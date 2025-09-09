/**
 * 首頁組件
 * Step 3.1.3a: 整合 Hero 組件
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { Hero } from '../components/layout/Hero.js';
import { PreviewSection } from '../components/layout/PreviewSection.js';

export class HomePage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    
    // 子組件
    this.heroComponent = null;
    this.previewSection = null;
  }
  
  /**
   * 渲染首頁 HTML
   * @returns {Promise<string>} HTML 字串
   */
  async render() {
    // 初始化組件
    this.heroComponent = new Hero();
    this.previewSection = new PreviewSection();
    
    const heroHTML = await this.heroComponent.render();
    const previewHTML = await this.previewSection.render();
    
    return `
      <div class="home-page">
        ${heroHTML}
        ${previewHTML}
      </div>
    `;
  }
  
  /**
   * 初始化首頁
   */
  async init() {
    await super.init();
    
    // 初始化組件
    if (this.heroComponent) {
      await this.heroComponent.init();
    }
    
    if (this.previewSection) {
      await this.previewSection.init();
    }
    
    console.log('🏠 HomePage initialized with Hero and PreviewSection components');
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    // 銷毀組件
    if (this.heroComponent) {
      this.heroComponent.destroy();
      this.heroComponent = null;
    }
    
    if (this.previewSection) {
      this.previewSection.destroy();
      this.previewSection = null;
    }
    
    super.destroy();
    console.log('🏠 HomePage destroyed');
  }
}