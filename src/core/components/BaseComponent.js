/**
 * 基礎組件類別
 * Step 3.1.1c: 為所有頁面組件提供統一介面
 */

import { EventManager } from '../events/EventManager.js';

export class BaseComponent extends EventManager {
  constructor(options = {}) {
    super(); // Initialize EventManager

    this.options = options;
    this.config = this.mergeConfig(options);
    this.state = this.getInitialState ? this.getInitialState() : {};
    this.initialized = false;
    this.destroyed = false;

    console.log(`🧩 Component created: ${this.constructor.name}`);
  }
  
  /**
   * 渲染組件 HTML
   * 子類別必須實現此方法
   * @returns {Promise<string>} HTML 字串
   */
  async render() {
    throw new Error(`${this.constructor.name} must implement render() method`);
  }
  
  /**
   * 初始化組件
   * 在 HTML 插入 DOM 後執行
   */
  async init() {
    if (this.initialized) {
      console.warn(`${this.constructor.name} already initialized`);
      return;
    }
    
    this.initialized = true;
    console.log(`✅ Component initialized: ${this.constructor.name}`);
  }
  
  /**
   * 銷毀組件
   * 清理事件監聽器、定時器等
   */
  destroy() {
    if (this.destroyed) {
      return;
    }
    
    // Clean up event listeners first
    super.destroy();
    
    this.destroyed = true;
    this.initialized = false;
    
    console.log(`🔥 Component destroyed: ${this.constructor.name}`);
  }
  
  /**
   * 創建 HTML 元素
   * @param {string} tag - 標籤名
   * @param {Object} attrs - 屬性
   * @param {string} content - 內容
   * @returns {string} HTML 字串
   */
  createElement(tag, attrs = {}, content = '') {
    const attrStr = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    return `<${tag}${attrStr ? ' ' + attrStr : ''}>${content}</${tag}>`;
  }
  
  /**
   * 獲取組件預設配置
   * 子類別可覆寫此方法
   * @returns {Object} 預設配置
   */
  getDefaultConfig() {
    return {};
  }
  
  /**
   * 合併配置
   * @param {Object} config - 新配置
   * @returns {Object} 合併後配置
   */
  mergeConfig(config = {}) {
    return {
      ...this.getDefaultConfig(),
      ...this.options,
      ...config
    };
  }

  /**
   * 獲取初始狀態
   * 子類別可覆寫此方法
   * @returns {Object} 初始狀態
   */
  getInitialState() {
    return {};
  }

  /**
   * 設置狀態
   * @param {Object} newState - 新狀態
   * @param {Function} callback - 可選的回調函數
   */
  setState(newState, callback) {
    // 合併狀態
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // 觸發狀態變化事件
    this.emit('stateChange', {
      prevState,
      currentState: this.state,
      changes: newState
    });

    // 執行回調
    if (typeof callback === 'function') {
      callback(this.state, prevState);
    }

    // 如果組件已經初始化且需要重新渲染，可以觸發渲染
    if (this.initialized && this.shouldRerenderOnStateChange) {
      this.rerender();
    }
  }

  /**
   * 重新渲染組件 (可選實現)
   */
  async rerender() {
    // 子類別可以覆寫這個方法來實現重新渲染邏輯
    console.log(`${this.constructor.name} state updated, rerender triggered`);
  }
}