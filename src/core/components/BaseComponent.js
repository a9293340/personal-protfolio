/**
 * 基礎組件類別
 * Step 3.1.1c: 為所有頁面組件提供統一介面
 */

export class BaseComponent {
  constructor(options = {}) {
    this.options = options;
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
}