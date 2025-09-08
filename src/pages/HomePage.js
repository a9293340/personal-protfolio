/**
 * 首頁組件
 * Step 3.1.1c: 主頁面組件實現
 */

import { BaseComponent } from '../core/components/BaseComponent.js';

export class HomePage extends BaseComponent {
  constructor(options = {}) {
    super(options);
  }
  
  /**
   * 渲染首頁 HTML
   * @returns {Promise<string>} HTML 字串
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <div class="home-page">
        <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
          
          <!-- Hero Section -->
          <section class="hero-section" style="text-align: center; padding: 60px 0;">
            <h1 style="color: #d4af37; font-size: 3rem; margin-bottom: 20px; text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);">
              🎮 Gaming Portfolio
            </h1>
            <p style="color: #ffffff; font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9;">
              後端工程師向系統架構師的專業軌跡
            </p>
            
            <!-- Navigation Links -->
            <div class="nav-links" style="margin: 40px 0;">
              <a href="#/about" class="nav-link" style="display: inline-block; background: rgba(212, 175, 55, 0.2); border: 2px solid #d4af37; color: #d4af37; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s;">
                📋 關於我
              </a>
              <a href="#/skills" class="nav-link" style="display: inline-block; background: rgba(41, 128, 185, 0.2); border: 2px solid #3498db; color: #3498db; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s;">
                🌟 技能樹
              </a>
              <a href="#/projects" class="nav-link" style="display: inline-block; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; color: #2ecc71; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s;">
                🚀 專案展示
              </a>
              <a href="#/contact" class="nav-link" style="display: inline-block; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s;">
                📬 聯絡方式
              </a>
            </div>
          </section>
          
          <!-- Status Section -->
          <section class="status-section" style="margin: 40px 0;">
            <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; padding: 30px; border-radius: 12px;">
              <h2 style="color: #d4af37; margin-bottom: 20px; text-align: center;">
                ⚡ 系統狀態
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="text-align: center;">
                  <div style="color: #2ecc71; font-size: 1.5rem; font-weight: bold;">✅</div>
                  <div style="color: white; margin-top: 8px;">路由系統</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #2ecc71; font-size: 1.5rem; font-weight: bold;">✅</div>
                  <div style="color: white; margin-top: 8px;">頁面切換</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #f39c12; font-size: 1.5rem; font-weight: bold;">🔄</div>
                  <div style="color: white; margin-top: 8px;">組件載入</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #95a5a6; font-size: 1.5rem; font-weight: bold;">⏳</div>
                  <div style="color: white; margin-top: 8px;">動畫效果</div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Info Section -->
          <section class="info-section" style="margin: 40px 0;">
            <div style="background: rgba(52, 152, 219, 0.1); border: 2px solid #3498db; padding: 30px; border-radius: 12px;">
              <h3 style="color: #3498db; margin-bottom: 15px;">🎯 Step 3.1.1 進度</h3>
              <ul style="color: white; list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">✅ 建立首頁結構</li>
                <li style="margin-bottom: 8px;">✅ 實現 SPA 路由系統</li>
                <li style="margin-bottom: 8px;">🔄 建立頁面切換機制</li>
                <li style="margin-bottom: 8px;">⏳ 設置路由配置文件</li>
              </ul>
            </div>
          </section>
          
        </div>
      </div>
    `;
  }
  
  /**
   * 初始化首頁
   */
  async init() {
    await super.init();
    
    // 添加導航連結點擊效果
    this.addNavigationEffects();
    
    console.log('🏠 HomePage initialized');
  }
  
  /**
   * 添加導航效果
   */
  addNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
      });
      
      link.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    });
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    // 清理事件監聽器
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.replaceWith(link.cloneNode(true));
    });
    
    super.destroy();
    console.log('🏠 HomePage destroyed');
  }
}