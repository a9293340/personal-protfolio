/**
 * 首頁組件
 * Step 3.1.3a: 整合 Hero 組件
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { Hero } from '../components/layout/Hero.js';

export class HomePage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    
    // 子組件
    this.heroComponent = null;
  }
  
  /**
   * 渲染首頁 HTML
   * @returns {Promise<string>} HTML 字串
   */
  async render() {
    // 初始化 Hero 組件
    this.heroComponent = new Hero();
    const heroHTML = await this.heroComponent.render();
    
    return `
      <div class="home-page">
        ${heroHTML}
        
        <!-- 預覽區塊將在後續步驟中添加 -->
        <div class="preview-sections" style="display: none;">
          <!-- 技能樹預覽 -->
          <!-- 時間軸預覽 -->
          <!-- 專案卡牌預覽 -->
        </div>
      </div>
    `;
  }
  
  /**
   * 初始化首頁
   */
  async init() {
    await super.init();
    
    // 初始化 Hero 組件
    if (this.heroComponent) {
      await this.heroComponent.init();
    }
    
    console.log('🏠 HomePage initialized with Hero component');
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    // 銷毀 Hero 組件
    if (this.heroComponent) {
      this.heroComponent.destroy();
      this.heroComponent = null;
    }
    
    super.destroy();
    console.log('🏠 HomePage destroyed');
  }
}