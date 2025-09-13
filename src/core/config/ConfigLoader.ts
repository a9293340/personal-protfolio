/**
 * ConfigLoader - 配置載入器
 *
 * 功能：
 * 1. 動態載入配置文件
 * 2. 批量載入多個配置
 * 3. 配置轉換和預處理
 * 4. 錯誤處理和重試機制
 * 5. 載入結果快取
 *
 * @author Claude
 * @version 1.0.0
 */

import { ConfigManager } from './ConfigManager.js';
import { ConfigValidator } from './ConfigValidator.js';
import type {
  LoadOptions,
  LoadResult,
  BatchLoadResult,
  ConfigValue,
} from '../../types/config.js';

export class ConfigLoader {
  private manager: ConfigManager;
  private validator?: ConfigValidator;
  private cache: Map<string, LoadResult>;
  private defaultOptions: Required<Omit<LoadOptions, 'schema' | 'transform'>>;

  constructor(manager: ConfigManager, validator?: ConfigValidator) {
    this.manager = manager;
    this.validator = validator;
    this.cache = new Map();

    // 預設選項
    this.defaultOptions = {
      baseUrl: '',
      timeout: 5000,
      retries: 2,
      cache: true,
      validate: false,
    };
  }

  /**
   * 載入單個配置文件
   */
  async load<T = ConfigValue>(
    source: string,
    key?: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<T>> {
    const opts = { ...this.defaultOptions, ...options };
    const cacheKey = this.getCacheKey(source, opts);

    // 檢查快取
    if (opts.cache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return { ...cached, cached: true } as LoadResult<T>;
    }

    let lastError: Error | null = null;

    // 重試機制
    for (let attempt = 0; attempt <= opts.retries; attempt++) {
      try {
        const result = await this.loadWithTimeout(source, opts);

        // 資料轉換
        let data = result;
        if (options.transform) {
          data = options.transform(data);
        }

        // 配置驗證
        if (opts.validate && options.schema && this.validator) {
          const validationResult = this.validator.validate(
            options.schema,
            data
          );
          if (!validationResult.valid) {
            throw new Error(
              `Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`
            );
          }
        }

        const loadResult: LoadResult<T> = {
          success: true,
          data: data as T,
          source,
          timestamp: Date.now(),
          cached: false,
        };

        // 快取結果
        if (opts.cache) {
          this.cache.set(cacheKey, loadResult);
        }

        // 儲存到 ConfigManager
        if (key) {
          this.manager.set(key, data as any);
        }

        return loadResult;
      } catch (error) {
        lastError = error as Error;

        // 如果不是最後一次嘗試，等待後重試
        if (attempt < opts.retries) {
          await this.delay(Math.pow(2, attempt) * 100); // 指數退避
        }
      }
    }

    // 所有嘗試都失敗
    const errorResult: LoadResult<T> = {
      success: false,
      error: lastError?.message || 'Unknown error',
      source,
      timestamp: Date.now(),
      cached: false,
    };

    return errorResult;
  }

  /**
   * 批量載入配置文件
   */
  async loadBatch(
    sources: Record<string, string | { source: string; options?: LoadOptions }>,
    globalOptions: LoadOptions = {}
  ): Promise<BatchLoadResult> {
    const results: Record<string, LoadResult> = {};
    const promises = Object.entries(sources).map(async ([key, config]) => {
      const source = typeof config === 'string' ? config : config.source;
      const options =
        typeof config === 'string'
          ? globalOptions
          : { ...globalOptions, ...config.options };

      const result = await this.load(source, key, options);
      results[key] = result;

      return { key, result };
    });

    await Promise.all(promises);

    const summary = {
      total: Object.keys(sources).length,
      success: Object.values(results).filter(r => r.success).length,
      failed: Object.values(results).filter(r => !r.success).length,
      cached: Object.values(results).filter(r => r.cached).length,
    };

    return {
      results,
      summary,
    };
  }

  /**
   * 載入配置文件 (帶超時)
   */
  private async loadWithTimeout(
    source: string,
    options: Required<Omit<LoadOptions, 'schema' | 'transform'>>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Load timeout after ${options.timeout}ms`));
      }, options.timeout);

      this.loadFromSource(source, options)
        .then(data => {
          clearTimeout(timeoutId);
          resolve(data);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * 從來源載入資料
   */
  private async loadFromSource(
    source: string,
    options: Required<Omit<LoadOptions, 'schema' | 'transform'>>
  ): Promise<any> {
    const fullUrl = this.resolveUrl(source, options.baseUrl);

    // 判斷載入方式
    if (this.isUrl(fullUrl)) {
      return this.loadFromUrl(fullUrl);
    } else {
      return this.loadFromModule(fullUrl);
    }
  }

  /**
   * 從 URL 載入 JSON 配置
   */
  private async loadFromUrl(url: string): Promise<any> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    } else if (
      contentType?.includes('text/') ||
      contentType?.includes('application/javascript')
    ) {
      const text = await response.text();
      // 嘗試解析為 JSON
      try {
        return JSON.parse(text);
      } catch {
        // 如果不是 JSON，返回原始文本
        return text;
      }
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  }

  /**
   * 從 ES 模組載入配置
   */
  private async loadFromModule(modulePath: string): Promise<any> {
    try {
      const module = await import(modulePath);

      // 優先使用 default export
      if (module.default !== undefined) {
        return module.default;
      }

      // 如果沒有 default，檢查是否有配置相關的 export
      const configExports = Object.keys(module).filter(
        key =>
          key.toLowerCase().includes('config') ||
          key.toLowerCase().includes('setting') ||
          key === 'data'
      );

      if (configExports.length === 1) {
        return module[configExports[0]];
      } else if (configExports.length > 1) {
        // 多個可能的配置 export，返回一個物件包含所有
        const result: Record<string, any> = {};
        configExports.forEach(key => {
          result[key] = module[key];
        });
        return result;
      } else {
        // 返回整個模組 (排除 default)
        const { default: _, ...rest } = module;
        return Object.keys(rest).length > 0 ? rest : module;
      }
    } catch (error) {
      throw new Error(
        `Failed to import module '${modulePath}': ${(error as Error).message}`
      );
    }
  }

  /**
   * 解析完整 URL
   */
  private resolveUrl(source: string, baseUrl: string): string {
    if (this.isUrl(source)) {
      return source;
    }

    if (baseUrl) {
      // 確保 baseUrl 以 / 結尾
      const normalizedBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      // 移除 source 開頭的 /
      const normalizedSource = source.startsWith('/')
        ? source.substring(1)
        : source;
      return normalizedBase + normalizedSource;
    }

    return source;
  }

  /**
   * 檢查是否為 URL
   */
  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return (
        str.startsWith('http://') ||
        str.startsWith('https://') ||
        str.startsWith('//')
      );
    }
  }

  /**
   * 生成快取鍵
   */
  private getCacheKey(
    source: string,
    options: Required<Omit<LoadOptions, 'schema' | 'transform'>>
  ): string {
    const optionsHash = JSON.stringify({
      baseUrl: options.baseUrl,
      timeout: options.timeout,
      validate: options.validate,
    });
    return `${source}:${btoa(optionsHash)}`;
  }

  /**
   * 延遲函數
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清除快取
   */
  clearCache(source?: string): void {
    if (source) {
      // 清除特定來源的快取
      const keysToDelete = Array.from(this.cache.keys()).filter(key =>
        key.startsWith(source)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // 清除所有快取
      this.cache.clear();
    }
  }

  /**
   * 取得快取統計
   */
  getCacheStats(): { total: number; keys: string[] } {
    return {
      total: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * 預載入配置 (不儲存到 ConfigManager)
   */
  async preload(
    sources: string[],
    options: LoadOptions = {}
  ): Promise<BatchLoadResult> {
    const sourceMap = sources.reduce(
      (acc, source, index) => {
        acc[`preload_${index}`] = source;
        return acc;
      },
      {} as Record<string, string>
    );

    return this.loadBatch(sourceMap, { ...options, cache: true });
  }

  /**
   * 載入配置並合併到現有配置
   */
  async loadAndMerge<T = ConfigValue>(
    source: string,
    key: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<T>> {
    const result = await this.load<T>(source, undefined, options);

    if (result.success && result.data !== undefined) {
      // 合併到現有配置
      this.manager.set(key, result.data as ConfigValue, true);
    }

    return result;
  }

  /**
   * 載入配置模板並應用變數
   */
  async loadTemplate<T = ConfigValue>(
    source: string,
    variables: Record<string, any>,
    key?: string,
    options: LoadOptions = {}
  ): Promise<LoadResult<T>> {
    // 設定變數到 ConfigManager
    Object.entries(variables).forEach(([varKey, varValue]) => {
      this.manager.setVariable(varKey, varValue);
    });

    const result = await this.load<T>(source, key, options);

    // 載入後處理插值
    if (result.success && result.data !== undefined && key) {
      const processedData = this.manager.get(key); // 會自動處理插值
      result.data = processedData as T;
    }

    return result;
  }

  /**
   * 監聽配置文件變化 (僅在開發環境)
   */
  watch(
    source: string,
    key: string,
    callback: (result: LoadResult) => void,
    options: LoadOptions & { interval?: number } = {}
  ): () => void {
    const interval = options.interval || 1000;
    let lastModified = Date.now();

    const checkForUpdates = async () => {
      try {
        const result = await this.load(source, undefined, {
          ...options,
          cache: false,
        });

        if (result.success && result.timestamp > lastModified) {
          lastModified = result.timestamp;
          this.manager.set(key, result.data!);
          callback(result);
        }
      } catch (error) {
        console.warn('Config watch error:', error);
      }
    };

    const intervalId = setInterval(
      checkForUpdates,
      interval
    ) as unknown as number;

    // 返回停止監聽的函數
    return () => {
      clearInterval(intervalId);
    };
  }

  /**
   * 設定預設載入選項
   */
  setDefaultOptions(options: Partial<LoadOptions>): void {
    Object.assign(this.defaultOptions, options);
  }

  /**
   * 取得載入器統計信息
   */
  getStats(): {
    cacheSize: number;
    defaultOptions: typeof this.defaultOptions;
    hasValidator: boolean;
  } {
    return {
      cacheSize: this.cache.size,
      defaultOptions: { ...this.defaultOptions },
      hasValidator: !!this.validator,
    };
  }
}
