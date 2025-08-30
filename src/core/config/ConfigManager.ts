/**
 * ConfigManager - 配置管理器
 * 
 * 功能：
 * 1. 配置載入和緩存
 * 2. 配置合併和覆蓋
 * 3. 配置監聽和通知
 * 4. 插值處理 ({{變數}} 替換)
 * 5. 深度取值和設定
 * 
 * @author Claude
 * @version 1.0.0
 */

import { EventEmitter } from '../events/EventEmitter.js';
import type {
  ConfigValue,
  ConfigObject,
  ConfigUpdateEvent,
  ConfigDeleteEvent,
  ConfigClearEvent,
  ConfigImportEvent,
  VariableUpdateEvent,
  InterpolatorHandler,
  ConfigStats,
  ConfigValidationResult,
  EnvironmentVariables,
  BrowserInfo,
  TimeInfo
} from '../../types/config.js';

export class ConfigManager extends EventEmitter {
  private configs: Map<string, ConfigValue>;
  private variables: Map<string, ConfigValue>;
  private interpolators: Map<string, InterpolatorHandler>;

  constructor() {
    super();
    
    this.configs = new Map();
    this.variables = new Map();
    this.interpolators = new Map();
    
    this.setupDefaultInterpolators();
    this.setupDefaultVariables();
  }

  /**
   * 設定預設插值函數
   */
  private setupDefaultInterpolators(): void {
    // 基本變數插值 {{var}}
    this.interpolators.set('variable', (match: string, key: string): string => {
      return String(this.getVariable(key) ?? match);
    });
    
    // 環境變數插值 {{env.NODE_ENV}}
    this.interpolators.set('env', (match: string, key: string): string => {
      const envVars = this.getVariable('env') as EnvironmentVariables;
      return String(this.getNestedValue(envVars || {}, key) ?? match);
    });
    
    // 配置引用插值 {{config.theme.primaryColor}}
    this.interpolators.set('config', (match: string, path: string): string => {
      const [configName, ...keyPath] = path.split('.');
      const config = this.get(configName);
      const result = keyPath.length > 0 ? this.getNestedValue(config, keyPath.join('.')) : config;
      return String(result ?? match);
    });
  }

  /**
   * 設定預設全域變數
   */
  private setupDefaultVariables(): void {
    // 環境變數
    const envVars: EnvironmentVariables = {
      NODE_ENV: (typeof process !== 'undefined' && process.env?.NODE_ENV) ? process.env.NODE_ENV : 'development',
      DEV: (typeof globalThis !== 'undefined' && '__DEV__' in globalThis) ? (globalThis as any).__DEV__ : true,
      PROD: (typeof globalThis !== 'undefined' && '__PROD__' in globalThis) ? (globalThis as any).__PROD__ : false,
    };
    this.variables.set('env', envVars);
    
    // 瀏覽器信息
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const browserInfo: BrowserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
        isDesktop: !/Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
      };
      this.variables.set('browser', browserInfo);
    }
    
    // 時間相關
    const now = new Date();
    const timeInfo: TimeInfo = {
      timestamp: now.getTime(),
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
      isoString: now.toISOString(),
    };
    this.variables.set('time', timeInfo);
  }

  /**
   * 設定配置
   */
  set(key: string, value: ConfigValue, merge = false): ConfigManager {
    const oldValue = this.configs.get(key);
    
    if (merge && oldValue && this.isObject(oldValue) && this.isObject(value)) {
      const mergedValue = this.deepMerge(oldValue as ConfigObject, value as ConfigObject);
      this.configs.set(key, mergedValue);
      
      this.emit('config:updated', {
        key,
        oldValue,
        newValue: mergedValue,
        action: 'merged'
      } as ConfigUpdateEvent);
    } else {
      this.configs.set(key, value);
      
      this.emit('config:updated', {
        key,
        oldValue,
        newValue: value,
        action: oldValue ? 'updated' : 'created'
      } as ConfigUpdateEvent);
    }
    
    return this;
  }

  /**
   * 取得配置
   */
  get<T = ConfigValue>(key: string, defaultValue: T | null = null, processInterpolation = true): T | null {
    let value = this.configs.get(key);
    
    if (value === undefined) {
      return defaultValue;
    }
    
    if (processInterpolation) {
      value = this.processInterpolation(value);
    }
    
    return value as T;
  }

  /**
   * 取得深層配置值
   */
  getNestedValue(obj: any, path: string, defaultValue: any = null): any {
    if (!obj || typeof obj !== 'object') return defaultValue;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }

  /**
   * 檢查配置是否存在
   */
  has(key: string): boolean {
    return this.configs.has(key);
  }

  /**
   * 刪除配置
   */
  delete(key: string): boolean {
    const existed = this.configs.has(key);
    const oldValue = this.configs.get(key);
    
    if (existed) {
      this.configs.delete(key);
      
      this.emit('config:deleted', {
        key,
        oldValue
      } as ConfigDeleteEvent);
    }
    
    return existed;
  }

  /**
   * 清空所有配置
   */
  clear(): void {
    const oldConfigs = new Map(this.configs);
    this.configs.clear();
    
    this.emit('config:cleared', {
      oldConfigs
    } as ConfigClearEvent);
  }

  /**
   * 取得所有配置鍵名
   */
  keys(): string[] {
    return Array.from(this.configs.keys());
  }

  /**
   * 取得所有配置
   */
  all(processInterpolation = true): Record<string, ConfigValue> {
    const result: Record<string, ConfigValue> = {};
    
    for (const [key, value] of this.configs) {
      result[key] = processInterpolation ? this.processInterpolation(value) : value;
    }
    
    return result;
  }

  /**
   * 深度合併物件
   */
  private deepMerge(target: ConfigObject, source: ConfigObject): ConfigObject {
    if (!this.isObject(target) || !this.isObject(source)) {
      return source;
    }
    
    const result = { ...target };
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (this.isObject(result[key]) && this.isObject(source[key])) {
          result[key] = this.deepMerge(result[key] as ConfigObject, source[key] as ConfigObject);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 判斷是否為物件
   */
  private isObject(obj: any): obj is ConfigObject {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }

  /**
   * 處理插值
   */
  private processInterpolation(value: ConfigValue): ConfigValue {
    if (typeof value === 'string') {
      return this.interpolateString(value);
    } else if (Array.isArray(value)) {
      return value.map(item => this.processInterpolation(item));
    } else if (this.isObject(value)) {
      const result: ConfigObject = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.processInterpolation(val);
      }
      return result;
    }
    
    return value;
  }

  /**
   * 插值字串處理
   */
  private interpolateString(str: string): string {
    return str.replace(/\{\{([^}]+)\}\}/g, (match, content) => {
      const trimmed = content.trim();
      
      if (trimmed.includes('.')) {
        const [type, ...keyParts] = trimmed.split('.');
        const key = keyParts.join('.');
        
        const interpolator = this.interpolators.get(type);
        if (interpolator) {
          return interpolator(match, key);
        }
      }
      
      const variableInterpolator = this.interpolators.get('variable');
      return variableInterpolator ? variableInterpolator(match, trimmed) : match;
    });
  }

  /**
   * 設定全域變數
   */
  setVariable(key: string, value: ConfigValue): ConfigManager {
    this.variables.set(key, value);
    
    this.emit('variable:updated', {
      key,
      value
    } as VariableUpdateEvent);
    
    return this;
  }

  /**
   * 取得全域變數
   */
  getVariable<T = ConfigValue>(key: string, defaultValue: T | null = null): T | null {
    const value = this.variables.get(key);
    return (value as T) ?? defaultValue;
  }

  /**
   * 註冊自訂插值處理函數
   */
  registerInterpolator(type: string, handler: InterpolatorHandler): ConfigManager {
    this.interpolators.set(type, handler);
    return this;
  }

  /**
   * 監聽配置變化
   */
  watch(callback: (data: ConfigUpdateEvent | ConfigDeleteEvent) => void): () => void;
  watch(key: string, callback: (data: ConfigUpdateEvent | ConfigDeleteEvent) => void): () => void;
  watch(
    keyOrCallback: string | ((data: ConfigUpdateEvent | ConfigDeleteEvent) => void), 
    callback?: (data: ConfigUpdateEvent | ConfigDeleteEvent) => void
  ): () => void {
    if (typeof keyOrCallback === 'function') {
      callback = keyOrCallback;
      keyOrCallback = undefined as any;
    }
    
    const handler = (data: ConfigUpdateEvent | ConfigDeleteEvent) => {
      if (!keyOrCallback || data.key === keyOrCallback) {
        callback!(data);
      }
    };
    
    this.on('config:updated', handler);
    this.on('config:deleted', handler);
    
    return () => {
      this.off('config:updated', handler);
      this.off('config:deleted', handler);
    };
  }

  /**
   * 匯出配置到 JSON
   */
  toJSON(keys?: string[]): string {
    const data = keys ? 
      keys.reduce((obj: Record<string, ConfigValue>, key) => {
        if (this.has(key)) {
          obj[key] = this.get(key, null, false)!;
        }
        return obj;
      }, {}) :
      this.all(false);
      
    return JSON.stringify(data, null, 2);
  }

  /**
   * 從 JSON 匯入配置
   */
  fromJSON(jsonStr: string, merge = false): ConfigManager {
    try {
      const data = JSON.parse(jsonStr) as Record<string, ConfigValue>;
      
      for (const [key, value] of Object.entries(data)) {
        this.set(key, value, merge);
      }
      
      this.emit('config:imported', {
        data,
        merge
      } as ConfigImportEvent);
      
    } catch (error) {
      throw new Error(`Failed to import config from JSON: ${(error as Error).message}`);
    }
    
    return this;
  }

  /**
   * 驗證配置完整性
   */
  validate(): ConfigValidationResult {
    const issues: Array<{ type: string; key?: string; message: string }> = [];
    
    // 檢查循環引用
    for (const [key, value] of this.configs) {
      try {
        JSON.stringify(value);
      } catch (error) {
        if ((error as Error).message.includes('circular')) {
          issues.push({
            type: 'circular_reference',
            key,
            message: `Circular reference detected in config '${key}'`
          });
        }
      }
    }
    
    // 檢查插值是否能正確解析
    for (const [key, value] of this.configs) {
      try {
        this.processInterpolation(value);
      } catch (error) {
        issues.push({
          type: 'interpolation_error',
          key,
          message: `Interpolation error in config '${key}': ${(error as Error).message}`
        });
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * 取得配置統計信息
   */
  getStats(): ConfigStats {
    const configs = Array.from(this.configs.values());
    
    return {
      totalConfigs: this.configs.size,
      totalVariables: this.variables.size,
      totalInterpolators: this.interpolators.size,
      configTypes: {
        objects: configs.filter(v => this.isObject(v)).length,
        arrays: configs.filter(v => Array.isArray(v)).length,
        strings: configs.filter(v => typeof v === 'string').length,
        numbers: configs.filter(v => typeof v === 'number').length,
        booleans: configs.filter(v => typeof v === 'boolean').length,
        others: configs.filter(v => 
          !this.isObject(v) && !Array.isArray(v) && 
          typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean'
        ).length
      }
    };
  }
}