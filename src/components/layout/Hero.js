/**
 * Hero 區域組件
 * Step 3.1.3a: 建立 Hero 組件結構
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class Hero extends BaseComponent {
  constructor(options = {}) {
    super(options);
    
    // Hero 狀態
    this.state = {
      isTypingActive: false,
      currentTextIndex: 0,
      isAnimationComplete: false
    };
  }
  
  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      // 個人基本信息
      title: "後端工程師",
      name: "Gaming Portfolio",
      subtitle: "系統架構師的專業軌跡",
      
      // 動態打字文字
      typingTexts: [
        "後端工程師向系統架構師發展",
        "專精於 Config-Driven 架構設計", 
        "追求高品質代碼與用戶體驗",
        "熱衷於技術創新與團隊協作"
      ],
      
      // CTA 按鈕組
      ctaButtons: [
        {
          text: "查看技能樹",
          icon: "🌟",
          action: "skills",
          primary: true
        },
        {
          text: "專案展示", 
          icon: "🚀",
          action: "projects",
          primary: false
        }
      ],
      
      // 動畫配置
      animations: {
        typingSpeed: 100,
        deleteSpeed: 50,
        pauseDuration: 2000
      }
    };
  }
  
  /**
   * 渲染 Hero HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <section class="hero-section" id="hero-section">
        <div class="hero-container">
          
          <!-- 個人介紹區域 -->
          <div class="hero-content">
            
            <!-- 主標題區 -->
            <div class="hero-main">
              <h1 class="hero-title">
                <span class="title-greeting">👋 Hello, I'm</span>
                <span class="title-name">${config.name}</span>
                <span class="title-role">${config.title}</span>
              </h1>
              
              <!-- 動態打字機效果區域 -->
              <div class="hero-typing">
                <span class="typing-text" id="typing-text">${config.subtitle}</span>
                <span class="typing-cursor" id="typing-cursor">|</span>
              </div>
            </div>
            
            <!-- CTA 按鈕組 -->
            <div class="hero-actions">
              ${config.ctaButtons.map(button => `
                <button class="cta-button ${button.primary ? 'primary' : 'secondary'}" 
                        data-action="${button.action}">
                  <span class="button-icon">${button.icon}</span>
                  <span class="button-text">${button.text}</span>
                </button>
              `).join('')}
            </div>
            
          </div>
          
          <!-- 背景裝飾元素 -->
          <div class="hero-decorations">
            <div class="decoration-grid"></div>
            <div class="decoration-particles"></div>
          </div>
          
        </div>
      </section>
    `;
  }
  
  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 綁定 CTA 按鈕事件
    this.bindCTAEvents();
    
    console.log('🦸 Hero component initialized');
  }
  
  /**
   * 綁定 CTA 按鈕事件
   */
  bindCTAEvents() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.getAttribute('data-action');
        this.handleCTAClick(action);
      });
    });
  }
  
  /**
   * 處理 CTA 按鈕點擊
   */
  handleCTAClick(action) {
    // 發送路由事件
    window.location.hash = `#/${action}`;
    console.log(`🎯 Navigating to: ${action}`);
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    // 清理打字機動畫
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    
    super.destroy();
    console.log('🦸 Hero component destroyed');
  }
}