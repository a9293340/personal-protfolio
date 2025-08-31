/**
 * BaseComponent - 基礎組件類
 * 
 * 提供所有組件的基礎功能：
 * 1. 完整生命週期管理
 * 2. 狀態管理系統  
 * 3. 事件系統整合
 * 4. 配置合併機制
 * 5. DOM 操作封裝
 * 
 * @author Claude
 * @version 1.0.0
 */

import { EventEmitter } from '../events/EventEmitter.js';
import type { ConfigValue, ConfigObject } from '../../types/config.js';

// BaseComponent 相關類型定義
export interface ComponentState {
  [key: string]: any;
}

export interface ComponentConfig extends ConfigObject {
  selector?: string;
  className?: string;
  attributes?: Record<string, string>;
  theme?: string;
  responsive?: boolean;
  animation?: boolean;
  debug?: boolean;
}

export interface ComponentLifecycleHooks {
  beforeInit?: () => void | Promise<void>;
  afterInit?: () => void | Promise<void>;
  beforeRender?: () => void | Promise<void>;
  afterRender?: () => void | Promise<void>;
  beforeDestroy?: () => void | Promise<void>;
  afterDestroy?: () => void | Promise<void>;
}

export interface RenderContext {
  container: HTMLElement;
  config: ComponentConfig;
  state: ComponentState;
  theme?: ConfigObject;
}

export abstract class BaseComponent extends EventEmitter {
  protected container: HTMLElement | null = null;
  protected element: HTMLElement | null = null;
  protected config: ComponentConfig = {};
  protected state: ComponentState = {};
  protected isInitialized: boolean = false;
  protected isDestroyed: boolean = false;
  protected hooks: ComponentLifecycleHooks = {};
  
  // 靜態屬性
  static readonly componentType: string = 'BaseComponent';
  static readonly version: string = '1.0.0';

  constructor(
    containerSelector?: string | HTMLElement,
    config: Partial<ComponentConfig> = {},
    hooks: ComponentLifecycleHooks = {}
  ) {
    super();
    
    // 設置容器
    if (containerSelector) {
      this.container = typeof containerSelector === 'string' 
        ? document.querySelector(containerSelector)
        : containerSelector;
    }
    
    // 合併配置
    this.config = this.mergeConfig(config);
    
    // 設置生命週期鉤子
    this.hooks = hooks;
    
    // 初始化狀態
    this.state = this.getInitialState();
    
    // 自動初始化（如果有容器）
    if (this.container) {
      this.init();
    }
  }

  /**
   * ========================================
   * 生命週期方法 - Step 1.2 第一部分
   * ========================================
   */

  /**
   * 初始化組件
   */
  async init(): Promise<void> {
    if (this.isInitialized || this.isDestroyed) {
      return;
    }

    try {
      // 前置鉤子
      await this.beforeInit();
      
      // 渲染組件
      await this.render();
      
      // 綁定事件
      this.bindEvents();
      
      // 後置鉤子
      await this.afterInit();
      
      this.isInitialized = true;
      this.emit('component:initialized', { component: this });
      
    } catch (error) {
      this.handleError('init', error as Error);
    }
  }

  /**
   * 前置鉤子 - 初始化前執行
   */
  protected async beforeInit(): Promise<void> {
    // 驗證必要條件
    if (!this.container) {
      throw new Error(`${this.constructor.name}: Container not found`);
    }
    
    // 檢查配置完整性
    this.validateConfig();
    
    // 執行用戶自定義鉤子
    if (this.hooks.beforeInit) {
      await this.hooks.beforeInit();
    }
    
    this.emit('component:beforeInit', { component: this });
  }

  /**
   * 渲染方法 - 核心渲染邏輯
   */
  protected async render(): Promise<void> {
    if (!this.container) {
      throw new Error(`${this.constructor.name}: Cannot render without container`);
    }

    try {
      // 前置渲染鉤子
      if (this.hooks.beforeRender) {
        await this.hooks.beforeRender();
      }
      
      this.emit('component:beforeRender', { component: this });
      
      // 創建渲染上下文
      const context: RenderContext = {
        container: this.container,
        config: this.config,
        state: this.state,
        theme: this.getThemeConfig()
      };
      
      // 執行具體渲染邏輯
      this.element = await this.doRender(context);
      
      // 應用基礎樣式和屬性
      this.applyBaseStyles();
      this.applyAttributes();
      
      // 後置渲染鉤子
      if (this.hooks.afterRender) {
        await this.hooks.afterRender();
      }
      
      this.emit('component:rendered', { component: this, element: this.element });
      
    } catch (error) {
      this.handleError('render', error as Error);
    }
  }

  /**
   * 抽象渲染方法 - 子類必須實現
   */
  protected abstract doRender(context: RenderContext): Promise<HTMLElement> | HTMLElement;

  /**
   * 綁定事件 - 設置組件的事件監聽
   */
  protected bindEvents(): void {
    if (!this.element) {
      return;
    }

    try {
      // 綁定基礎事件
      this.bindBaseEvents();
      
      // 綁定組件特定事件
      this.bindComponentEvents();
      
      // 綁定響應式事件
      if (this.config.responsive) {
        this.bindResponsiveEvents();
      }
      
      this.emit('component:eventsBound', { component: this });
      
    } catch (error) {
      this.handleError('bindEvents', error as Error);
    }
  }

  /**
   * 後置鉤子 - 初始化完成後執行
   */
  protected async afterInit(): Promise<void> {
    // 標記組件為已初始化
    if (this.element) {
      this.element.setAttribute('data-component', this.constructor.name);
      this.element.setAttribute('data-initialized', 'true');
    }
    
    // 發送準備完成事件
    this.emit('component:ready', { 
      component: this,
      type: (this.constructor as any).componentType || this.constructor.name
    });
    
    // 執行用戶自定義鉤子
    if (this.hooks.afterInit) {
      await this.hooks.afterInit();
    }
    
    this.emit('component:afterInit', { component: this });
  }

  /**
   * 銷毀組件
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) {
      return;
    }

    try {
      // 前置銷毀鉤子
      if (this.hooks.beforeDestroy) {
        await this.hooks.beforeDestroy();
      }
      
      this.emit('component:beforeDestroy', { component: this });
      
      // 清理事件監聽
      this.unbindEvents();
      
      // 清理 DOM
      this.cleanupDOM();
      
      // 清理狀態
      this.cleanup();
      
      // 後置銷毀鉤子
      if (this.hooks.afterDestroy) {
        await this.hooks.afterDestroy();
      }
      
      this.isDestroyed = true;
      this.emit('component:destroyed', { component: this });
      
      // 清理所有事件監聽器
      this.removeAllListeners();
      
    } catch (error) {
      this.handleError('destroy', error as Error);
    }
  }

  /**
   * ========================================
   * 輔助方法 - 支援生命週期
   * ========================================
   */

  /**
   * 驗證配置
   */
  protected validateConfig(): void {
    // 基本配置驗證邏輯
    if (this.config.selector && typeof this.config.selector !== 'string') {
      throw new Error(`${this.constructor.name}: Invalid selector type`);
    }
    
    // 子類可以覆蓋此方法進行更具體的驗證
  }

  /**
   * 應用基礎樣式
   */
  protected applyBaseStyles(): void {
    if (!this.element) return;
    
    // 添加基礎 CSS 類
    if (this.config.className) {
      this.element.classList.add(...this.config.className.split(' '));
    }
    
    // 添加組件類型類
    const componentType = (this.constructor as any).componentType || this.constructor.name;
    this.element.classList.add(`component-${componentType.toLowerCase()}`);
    
    // 響應式類
    if (this.config.responsive) {
      this.element.classList.add('component-responsive');
    }
    
    // 動畫類
    if (this.config.animation) {
      this.element.classList.add('component-animated');
    }
  }

  /**
   * 應用 HTML 屬性
   */
  protected applyAttributes(): void {
    if (!this.element || !this.config.attributes) return;
    
    Object.entries(this.config.attributes).forEach(([key, value]) => {
      this.element!.setAttribute(key, value);
    });
  }

  /**
   * 綁定基礎事件
   */
  protected bindBaseEvents(): void {
    // 子類可以覆蓋此方法
  }

  /**
   * 綁定組件特定事件
   */
  protected abstract bindComponentEvents(): void;

  /**
   * 綁定響應式事件
   */
  protected bindResponsiveEvents(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
      window.addEventListener('orientationchange', this.handleResize.bind(this));
    }
  }

  /**
   * 處理窗口大小變化
   */
  protected handleResize(): void {
    this.emit('component:resize', { 
      component: this,
      viewport: this.getViewportInfo()
    });
  }

  /**
   * 解綁事件
   */
  protected unbindEvents(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
      window.removeEventListener('orientationchange', this.handleResize.bind(this));
    }
  }

  /**
   * 清理 DOM
   */
  protected cleanupDOM(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  /**
   * 清理內部狀態
   */
  protected cleanup(): void {
    this.container = null;
    this.element = null;
    this.state = {};
    this.isInitialized = false;
  }

  /**
   * 錯誤處理
   */
  protected handleError(method: string, error: Error): void {
    const errorInfo = {
      component: this.constructor.name,
      method,
      error: error.message,
      stack: error.stack
    };
    
    this.emit('component:error', errorInfo);
    
    if (this.config.debug) {
      console.error(`[${this.constructor.name}] Error in ${method}:`, error);
    }
    
    throw error;
  }

  /**
   * ========================================
   * 狀態管理系統 - Step 1.2 第二部分
   * ========================================
   */

  /**
   * 獲取初始狀態
   */
  protected getInitialState(): ComponentState {
    return {
      initialized: false,
      visible: true,
      loading: false,
      error: null,
      data: null,
      ...this.getDefaultState()
    };
  }

  /**
   * 子類覆蓋以提供特定的初始狀態
   */
  protected getDefaultState(): ComponentState {
    return {};
  }

  /**
   * 設置狀態
   */
  protected setState(
    newState: Partial<ComponentState> | ((prevState: ComponentState) => Partial<ComponentState>),
    shouldUpdate: boolean = true
  ): void {
    const prevState = { ...this.state };
    
    // 支援函數式更新
    const stateUpdate = typeof newState === 'function' 
      ? newState(prevState) 
      : newState;
    
    // 合併新狀態
    this.state = {
      ...prevState,
      ...stateUpdate
    };
    
    // 發送狀態變化事件
    this.emit('component:stateChanged', {
      component: this,
      prevState,
      newState: this.state,
      changes: stateUpdate
    });
    
    // 觸發更新
    if (shouldUpdate && this.isInitialized) {
      this.onStateChanged(prevState, this.state, stateUpdate);
    }
    
    // Debug 模式下記錄狀態變化
    if (this.config.debug) {
      console.log(`[${this.constructor.name}] State changed:`, {
        from: prevState,
        to: this.state,
        changes: stateUpdate
      });
    }
  }

  /**
   * 獲取當前狀態
   */
  protected getState<T = ComponentState>(): T {
    return this.state as T;
  }

  /**
   * 獲取特定狀態值
   */
  protected getStateValue<T = any>(key: string, defaultValue?: T): T {
    return this.state[key] ?? defaultValue;
  }

  /**
   * 檢查狀態值
   */
  protected hasStateValue(key: string): boolean {
    return key in this.state && this.state[key] !== undefined;
  }

  /**
   * 重置狀態到初始值
   */
  protected resetState(): void {
    const prevState = { ...this.state };
    this.state = this.getInitialState();
    
    this.emit('component:stateReset', {
      component: this,
      prevState,
      newState: this.state
    });
    
    if (this.isInitialized) {
      this.onStateChanged(prevState, this.state, this.state);
    }
  }

  /**
   * 批量更新狀態
   */
  protected batchStateUpdate(updates: Array<() => void>): void {
    const prevState = { ...this.state };
    
    // 暫停更新通知
    let tempShouldUpdate = false;
    
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        this.handleError('batchStateUpdate', error as Error);
      }
    });
    
    // 發送單次狀態變化事件
    this.emit('component:stateChanged', {
      component: this,
      prevState,
      newState: this.state,
      changes: this.getStateChanges(prevState, this.state)
    });
    
    if (this.isInitialized) {
      this.onStateChanged(prevState, this.state, this.getStateChanges(prevState, this.state));
    }
  }

  /**
   * 狀態變化回調 - 子類可以覆蓋
   */
  protected onStateChanged(
    prevState: ComponentState, 
    newState: ComponentState, 
    changes: Partial<ComponentState>
  ): void {
    // 處理載入狀態變化
    if ('loading' in changes) {
      this.handleLoadingStateChange(newState.loading);
    }
    
    // 處理錯誤狀態變化
    if ('error' in changes) {
      this.handleErrorStateChange(newState.error);
    }
    
    // 處理可見性變化
    if ('visible' in changes) {
      this.handleVisibilityChange(newState.visible);
    }
    
    // 子類可以覆蓋此方法進行更具體的處理
  }

  /**
   * 計算狀態變化
   */
  private getStateChanges(prevState: ComponentState, newState: ComponentState): Partial<ComponentState> {
    const changes: Partial<ComponentState> = {};
    
    Object.keys(newState).forEach(key => {
      if (prevState[key] !== newState[key]) {
        changes[key] = newState[key];
      }
    });
    
    return changes;
  }

  /**
   * 處理載入狀態變化
   */
  protected handleLoadingStateChange(loading: boolean): void {
    if (!this.element) return;
    
    if (loading) {
      this.element.classList.add('component-loading');
      this.element.setAttribute('aria-busy', 'true');
    } else {
      this.element.classList.remove('component-loading');
      this.element.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * 處理錯誤狀態變化
   */
  protected handleErrorStateChange(error: any): void {
    if (!this.element) return;
    
    if (error) {
      this.element.classList.add('component-error');
      this.element.setAttribute('aria-invalid', 'true');
    } else {
      this.element.classList.remove('component-error');
      this.element.removeAttribute('aria-invalid');
    }
  }

  /**
   * 處理可見性變化
   */
  protected handleVisibilityChange(visible: boolean): void {
    if (!this.element) return;
    
    if (visible) {
      this.element.style.display = '';
      this.element.removeAttribute('hidden');
    } else {
      this.element.style.display = 'none';
      this.element.setAttribute('hidden', '');
    }
  }

  /**
   * ========================================
   * 事件系統整合 - Step 1.2 第三部分
   * ========================================
   */

  /**
   * 重寫 emit 方法，加入組件事件命名規範
   */
  emit(eventName: string, data?: any): boolean {
    // 確保事件名符合命名規範
    const normalizedEventName = this.normalizeEventName(eventName);
    
    // 添加組件上下文
    const eventData = {
      ...data,
      component: this,
      timestamp: Date.now(),
      type: (this.constructor as any).componentType || this.constructor.name
    };
    
    // 發送組件特定事件
    const componentEventName = `${normalizedEventName}:${this.constructor.name.toLowerCase()}`;
    super.emit(componentEventName, eventData);
    
    // 發送通用事件
    return super.emit(normalizedEventName, eventData);
  }

  /**
   * 重寫 on 方法，支援事件命名規範
   */
  on(eventName: string, listener: (...args: any[]) => void): this {
    const normalizedEventName = this.normalizeEventName(eventName);
    super.on(normalizedEventName, listener);
    return this;
  }

  /**
   * 重寫 off 方法，支援事件命名規範
   */
  off(eventName: string, listener: (...args: any[]) => void): this {
    const normalizedEventName = this.normalizeEventName(eventName);
    super.off(normalizedEventName, listener);
    return this;
  }

  /**
   * 重寫 once 方法，支援事件命名規範
   */
  once(eventName: string, listener: (...args: any[]) => void): this {
    const normalizedEventName = this.normalizeEventName(eventName);
    super.once(normalizedEventName, listener);
    return this;
  }

  /**
   * 事件命名規範化
   */
  private normalizeEventName(eventName: string): string {
    // 確保事件名以 component: 開頭（如果不是系統事件）
    if (!eventName.includes(':') && !this.isSystemEvent(eventName)) {
      return `component:${eventName}`;
    }
    return eventName;
  }

  /**
   * 檢查是否為系統事件
   */
  private isSystemEvent(eventName: string): boolean {
    const systemEvents = [
      'component:initialized', 'component:beforeInit', 'component:afterInit',
      'component:beforeRender', 'component:rendered', 'component:eventsBound',
      'component:ready', 'component:beforeDestroy', 'component:destroyed',
      'component:stateChanged', 'component:stateReset', 'component:resize',
      'component:error'
    ];
    return systemEvents.includes(eventName);
  }

  /**
   * 監聽組件生命週期事件的便捷方法
   */
  onInit(listener: (data: any) => void): this {
    return this.on('component:initialized', listener);
  }

  onReady(listener: (data: any) => void): this {
    return this.on('component:ready', listener);
  }

  onDestroy(listener: (data: any) => void): this {
    return this.on('component:destroyed', listener);
  }

  onStateChange(listener: (data: any) => void): this {
    return this.on('component:stateChanged', listener);
  }

  onError(listener: (data: any) => void): this {
    return this.on('component:error', listener);
  }

  onResize(listener: (data: any) => void): this {
    return this.on('component:resize', listener);
  }

  /**
   * 發送自訂組件事件的便捷方法
   */
  trigger(eventName: string, data?: any): boolean {
    return this.emit(`custom:${eventName}`, data);
  }

  /**
   * 監聽自訂組件事件的便捷方法
   */
  listen(eventName: string, listener: (data: any) => void): this {
    return this.on(`custom:${eventName}`, listener);
  }

  /**
   * 發送用戶互動事件
   */
  emitUserEvent(action: string, data?: any): boolean {
    return this.emit(`user:${action}`, {
      ...data,
      element: this.element,
      timestamp: Date.now()
    });
  }

  /**
   * 監聽用戶互動事件
   */
  onUserEvent(action: string, listener: (data: any) => void): this {
    return this.on(`user:${action}`, listener);
  }

  /**
   * 發送數據事件
   */
  emitDataEvent(type: string, data?: any): boolean {
    return this.emit(`data:${type}`, data);
  }

  /**
   * 監聽數據事件
   */
  onDataEvent(type: string, listener: (data: any) => void): this {
    return this.on(`data:${type}`, listener);
  }

  /**
   * 批量註冊事件監聽器
   */
  registerEventListeners(listeners: Record<string, (data: any) => void>): void {
    Object.entries(listeners).forEach(([eventName, listener]) => {
      this.on(eventName, listener);
    });
  }

  /**
   * 批量移除事件監聽器
   */
  unregisterEventListeners(listeners: Record<string, (data: any) => void>): void {
    Object.entries(listeners).forEach(([eventName, listener]) => {
      this.off(eventName, listener);
    });
  }

  /**
   * 創建事件代理
   */
  createEventProxy(targetSelector: string, eventType: string, handler: (event: Event) => void): () => void {
    if (!this.element) {
      throw new Error('Cannot create event proxy without element');
    }

    const proxyHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.matches && target.matches(targetSelector)) {
        handler(event);
      }
    };

    this.element.addEventListener(eventType, proxyHandler);

    // 返回清理函數
    return () => {
      if (this.element) {
        this.element.removeEventListener(eventType, proxyHandler);
      }
    };
  }

  /**
   * 防抖事件處理
   */
  createDebouncedHandler(handler: (...args: any[]) => void, delay: number = 300): (...args: any[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(...args), delay);
    };
  }

  /**
   * 節流事件處理
   */
  createThrottledHandler(handler: (...args: any[]) => void, interval: number = 100): (...args: any[]) => void {
    let lastCall = 0;
    
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= interval) {
        lastCall = now;
        handler(...args);
      }
    };
  }

  /**
   * ========================================
   * 配置合併機制 - Step 1.2 第四部分
   * ========================================
   */

  /**
   * 獲取默認配置
   */
  protected getDefaultConfig(): ComponentConfig {
    return {
      selector: '',
      className: '',
      attributes: {},
      theme: 'default',
      responsive: true,
      animation: true,
      debug: false,
      ...this.getComponentDefaults()
    };
  }

  /**
   * 子類覆蓋以提供組件特定的默認配置
   */
  protected getComponentDefaults(): Partial<ComponentConfig> {
    return {};
  }

  /**
   * 獲取主題配置
   */
  protected getThemeConfig(): ConfigObject | undefined {
    if (!this.config.theme) {
      return undefined;
    }

    // 嘗試從全域配置系統獲取主題配置
    try {
      // 這裡會在未來整合 ConfigManager 時實現
      if (typeof window !== 'undefined' && (window as any).globalConfig) {
        const globalConfig = (window as any).globalConfig;
        return globalConfig.get(`themes.${this.config.theme}`);
      }
      
      // 返回預設主題配置
      return this.getBuiltInThemeConfig(this.config.theme);
      
    } catch (error) {
      if (this.config.debug) {
        console.warn(`[${this.constructor.name}] Failed to load theme config:`, error);
      }
      return this.getBuiltInThemeConfig('default');
    }
  }

  /**
   * 獲取內建主題配置
   */
  protected getBuiltInThemeConfig(themeName: string): ConfigObject {
    const builtInThemes: Record<string, ConfigObject> = {
      default: {
        colors: {
          primary: '#d4af37',
          secondary: '#1a1a2e', 
          background: '#0a0a0a',
          text: '#ffffff',
          accent: '#f4d03f'
        },
        fonts: {
          heading: 'Cinzel, serif',
          body: 'Inter, sans-serif',
          mono: 'Fira Code, monospace'
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px'
        },
        breakpoints: {
          mobile: '768px',
          tablet: '1024px',
          desktop: '1280px'
        }
      },
      dark: {
        colors: {
          primary: '#d4af37',
          secondary: '#2a2a3e',
          background: '#000000',
          text: '#ffffff',
          accent: '#f4d03f'
        }
      },
      light: {
        colors: {
          primary: '#b8860b',
          secondary: '#f5f5f5',
          background: '#ffffff', 
          text: '#333333',
          accent: '#daa520'
        }
      }
    };

    return builtInThemes[themeName] || builtInThemes.default;
  }

  /**
   * 合併配置
   */
  protected mergeConfig(userConfig: Partial<ComponentConfig>): ComponentConfig {
    const defaultConfig = this.getDefaultConfig();
    
    // 深度合併用戶配置
    const mergedConfig = this.deepMerge(defaultConfig, userConfig as ComponentConfig);
    
    // 獲取主題配置並合併
    const themeConfig = this.getThemeConfig();
    if (themeConfig) {
      mergedConfig.themeData = themeConfig;
    }
    
    // 驗證合併後的配置
    this.validateMergedConfig(mergedConfig);
    
    return mergedConfig;
  }

  /**
   * 深度合併兩個配置對象
   */
  protected deepMerge<T extends ConfigObject>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof T];
      const targetValue = result[key as keyof T];
      
      if (sourceValue !== undefined) {
        if (this.isPlainObject(sourceValue) && this.isPlainObject(targetValue)) {
          result[key as keyof T] = this.deepMerge(
            targetValue as ConfigObject,
            sourceValue as ConfigObject
          ) as T[keyof T];
        } else {
          result[key as keyof T] = sourceValue as T[keyof T];
        }
      }
    });
    
    return result;
  }

  /**
   * 檢查是否為純對象
   */
  private isPlainObject(obj: any): obj is ConfigObject {
    return obj !== null && 
           typeof obj === 'object' && 
           !Array.isArray(obj) && 
           Object.prototype.toString.call(obj) === '[object Object]';
  }

  /**
   * 驗證合併後的配置
   */
  protected validateMergedConfig(config: ComponentConfig): void {
    // 基本驗證
    if (config.responsive !== undefined && typeof config.responsive !== 'boolean') {
      throw new Error(`${this.constructor.name}: Invalid responsive config type`);
    }
    
    if (config.animation !== undefined && typeof config.animation !== 'boolean') {
      throw new Error(`${this.constructor.name}: Invalid animation config type`);
    }
    
    if (config.debug !== undefined && typeof config.debug !== 'boolean') {
      throw new Error(`${this.constructor.name}: Invalid debug config type`);
    }
    
    // 子類可以覆蓋此方法進行更具體的驗證
    this.validateComponentConfig(config);
  }

  /**
   * 組件特定配置驗證 - 子類覆蓋
   */
  protected validateComponentConfig(config: ComponentConfig): void {
    // 子類實現具體的配置驗證邏輯
  }

  /**
   * 動態更新配置
   */
  updateConfig(newConfig: Partial<ComponentConfig>, shouldRerender: boolean = false): void {
    const prevConfig = { ...this.config };
    
    // 合併新配置
    this.config = this.mergeConfig({
      ...this.config,
      ...newConfig
    });
    
    // 發送配置變更事件
    this.emit('component:configChanged', {
      component: this,
      prevConfig,
      newConfig: this.config,
      changes: newConfig
    });
    
    // 觸發重新渲染
    if (shouldRerender && this.isInitialized) {
      this.handleConfigChange(prevConfig, this.config, newConfig);
    }
    
    // Debug 模式記錄
    if (this.config.debug) {
      console.log(`[${this.constructor.name}] Config updated:`, {
        from: prevConfig,
        to: this.config,
        changes: newConfig
      });
    }
  }

  /**
   * 配置變更處理 - 子類可覆蓋
   */
  protected handleConfigChange(
    prevConfig: ComponentConfig,
    newConfig: ComponentConfig,
    changes: Partial<ComponentConfig>
  ): void {
    // 處理主題變更
    if ('theme' in changes) {
      this.handleThemeChange(newConfig.theme);
    }
    
    // 處理響應式配置變更
    if ('responsive' in changes) {
      this.handleResponsiveChange(newConfig.responsive);
    }
    
    // 處理動畫配置變更
    if ('animation' in changes) {
      this.handleAnimationChange(newConfig.animation);
    }
    
    // 子類可以覆蓋此方法進行更具體的處理
  }

  /**
   * 處理主題變更
   */
  protected handleThemeChange(newTheme?: string): void {
    if (!this.element || !newTheme) return;
    
    // 移除舊主題類
    this.element.className = this.element.className
      .replace(/theme-\w+/g, '')
      .trim();
    
    // 添加新主題類
    this.element.classList.add(`theme-${newTheme}`);
    
    // 重新獲取主題配置
    const themeConfig = this.getThemeConfig();
    if (themeConfig) {
      this.config.themeData = themeConfig;
      this.emit('component:themeChanged', {
        component: this,
        theme: newTheme,
        themeData: themeConfig
      });
    }
  }

  /**
   * 處理響應式配置變更
   */
  protected handleResponsiveChange(responsive?: boolean): void {
    if (!this.element) return;
    
    if (responsive) {
      this.element.classList.add('component-responsive');
      this.bindResponsiveEvents();
    } else {
      this.element.classList.remove('component-responsive');
      // 這裡需要解綁響應式事件，但由於事件綁定方式的限制，
      // 實際上我們應該在初始化時決定是否綁定響應式事件
    }
  }

  /**
   * 處理動畫配置變更
   */
  protected handleAnimationChange(animation?: boolean): void {
    if (!this.element) return;
    
    if (animation) {
      this.element.classList.add('component-animated');
    } else {
      this.element.classList.remove('component-animated');
    }
  }

  /**
   * 獲取配置值的便捷方法
   */
  getConfigValue<T = any>(path: string, defaultValue?: T): T {
    return this.getNestedConfigValue(this.config, path, defaultValue);
  }

  /**
   * 從嵌套配置中取值
   */
  private getNestedConfigValue(obj: any, path: string, defaultValue: any = undefined): any {
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
   * 檢查配置值是否存在
   */
  hasConfigValue(path: string): boolean {
    return this.getNestedConfigValue(this.config, path, Symbol('not-found')) !== Symbol('not-found');
  }

  /**
   * ========================================
   * 工具方法
   * ========================================
   */

  /**
   * 獲取視窗信息
   */
  protected getViewportInfo() {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0, isMobile: false, isTablet: false, isDesktop: true };
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    };
  }

  /**
   * 檢查組件狀態
   */
  isReady(): boolean {
    return this.isInitialized && !this.isDestroyed && this.element !== null;
  }

  /**
   * 獲取組件信息
   */
  getInfo() {
    return {
      type: (this.constructor as any).componentType || this.constructor.name,
      version: (this.constructor as any).version || '1.0.0',
      initialized: this.isInitialized,
      destroyed: this.isDestroyed,
      hasElement: !!this.element,
      hasContainer: !!this.container
    };
  }
}