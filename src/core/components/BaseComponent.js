/**
 * BaseComponent 基礎組件類
 * 
 * 所有組件的基礎類，提供：
 * - 配置合併
 * - 生命週期管理
 * - 事件處理
 * - 狀態管理
 */

export class BaseComponent {
  constructor() {
    this.id = this.generateId();
    this.listeners = new Map();
    this.isDestroyed = false;
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return `component_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 合併配置
   */
  mergeConfig(defaultConfig, userConfig) {
    return this.deepMerge(defaultConfig, userConfig);
  }

  /**
   * 深度合併物件
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key]) && this.isObject(target[key])) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 檢查是否為物件
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * 事件綁定
   */
  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(handler);
  }

  /**
   * 移除事件監聽
   */
  off(eventName, handler) {
    if (this.listeners.has(eventName)) {
      const handlers = this.listeners.get(eventName);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 觸發事件
   */
  emit(eventName, data) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[BaseComponent] 事件處理器錯誤 (${eventName}):`, error);
        }
      });
    }
  }

  /**
   * 安全的DOM操作
   */
  safeQuerySelector(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (error) {
      console.error(`[BaseComponent] 查詢選擇器錯誤 (${selector}):`, error);
      return null;
    }
  }

  /**
   * 安全的DOM操作（多個元素）
   */
  safeQuerySelectorAll(selector, parent = document) {
    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (error) {
      console.error(`[BaseComponent] 查詢選擇器錯誤 (${selector}):`, error);
      return [];
    }
  }

  /**
   * 防抖函數
   */
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * 節流函數
   */
  throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 異步等待
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 檢查組件是否已銷毀
   */
  checkDestroyed() {
    if (this.isDestroyed) {
      console.warn('[BaseComponent] 嘗試操作已銷毀的組件');
      return true;
    }
    return false;
  }

  /**
   * 基礎銷毀方法
   */
  destroy() {
    this.isDestroyed = true;
    this.listeners.clear();
    console.log(`[BaseComponent] 組件 ${this.id} 已銷毀`);
  }

  /**
   * 需要子類實現的方法（可選）
   */
  getDefaultConfig() {
    return {};
  }

  getInitialState() {
    return {};
  }

  init() {
    // 子類實現
  }

  render() {
    // 子類實現
  }

  update() {
    // 子類實現
  }
}