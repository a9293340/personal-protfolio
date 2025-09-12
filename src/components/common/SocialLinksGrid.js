/**
 * SocialLinksGrid.js - 社交連結網格組件
 * 
 * 功能特色：
 * - 遊戲化的社交平台展示
 * - 動態載入社交數據配置
 * - 互動動畫和懸停效果
 * - 響應式網格佈局
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import { socialDataConfig } from '../../config/data/social.data.js';

export class SocialLinksGrid extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.socialData = socialDataConfig;
    
    console.log('🔗 [SocialLinksGrid] 社交連結組件初始化');
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      title: '社交平台',
      style: 'gaming-grid',
      showStats: false,
      showDescriptions: true,
      maxPlatforms: 6,
      
      layout: {
        columns: {
          mobile: 1,
          tablet: 2,
          desktop: 2
        },
        gap: '1rem'
      },
      
      animations: {
        hover: 'icon-bounce',
        click: 'ripple-effect',
        entrance: 'stagger-fade-in'
      }
    };
  }
  
  /**
   * 渲染組件
   */
  async render() {
    this.createElement();
    this.bindEvents();
    this.applyAnimations();
    
    return this.element;
  }
  
  /**
   * 創建主要結構
   */
  createElement() {
    
    this.element = document.createElement('div');
    this.element.className = 'social-links-grid';
    
    this.element.innerHTML = `
      <div class="social-section" style="
        background: rgba(46, 26, 46, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem;
        padding: 1rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        margin-top: 1rem;
      ">
        <h3 style="
          color: var(--primary-gold);
          font-size: 1.1rem;
          margin: 0 0 1rem 0;
          text-align: center;
          font-weight: 600;
        ">${this.config.title}</h3>
        
        <!-- 精簡的專業檔案連結 -->
        <div class="professional-links" style="
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        ">
          ${this.renderProfessionalLinks()}
        </div>
      </div>
    `;
    
    // 添加樣式
    this.addStyles();
  }
  
  
  /**
   * 渲染專業檔案連結
   */
  renderProfessionalLinks() {
    const professionalPlatforms = [
      {
        name: 'GitHub',
        icon: '💻',
        url: 'https://github.com',
        color: '#333333'
      },
      {
        name: 'LinkedIn',
        icon: '💼', 
        url: 'https://linkedin.com',
        color: '#0077B5'
      }
    ];
    
    return professionalPlatforms.map(platform => `
      <a href="${platform.url}" 
         target="_blank" 
         rel="noopener noreferrer"
         class="professional-link"
         style="
           display: inline-flex;
           align-items: center;
           gap: 0.4rem;
           padding: 0.4rem 0.8rem;
           background: rgba(255, 255, 255, 0.08);
           border: 1px solid rgba(${this.hexToRgb(platform.color)}, 0.3);
           border-radius: 1.5rem;
           color: white;
           text-decoration: none;
           font-size: 0.8rem;
           font-weight: 500;
           transition: all 0.3s ease;
         "
         onmouseover="this.style.background='rgba(${this.hexToRgb(platform.color)}, 0.2)'; this.style.borderColor='rgba(${this.hexToRgb(platform.color)}, 0.5)'; this.style.transform='translateY(-1px) scale(1.05)';"
         onmouseout="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.borderColor='rgba(${this.hexToRgb(platform.color)}, 0.3)'; this.style.transform='translateY(0) scale(1)';">
        <span style="font-size: 0.9rem;">${platform.icon}</span>
        ${platform.name}
      </a>
    `).join('');
  }
  
  
  /**
   * 綁定事件監聽器
   */
  bindEvents() {
    // 簡化的事件處理 - 社交連結已經透過內聯事件處理
    console.log('🔗 Social links events bound');
  }
  
  /**
   * 應用動畫效果
   */
  applyAnimations() {
    // 入場動畫已在 CSS 中定義
    
    // 響應式檢查
    this.setupResponsiveLayout();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', () => {
      this.setupResponsiveLayout();
    });
  }
  
  /**
   * 設置響應式佈局
   */
  setupResponsiveLayout() {
    const grid = this.element.querySelector('.social-grid');
    const professionalGrid = this.element.querySelector('.professional-grid');
    
    if (window.innerWidth <= 768) {
      // 手機版：單列佈局
      if (grid) {
        grid.style.gridTemplateColumns = '1fr';
      }
      if (professionalGrid) {
        professionalGrid.style.flexDirection = 'column';
        professionalGrid.style.alignItems = 'center';
      }
    } else {
      // 桌面版：多列佈局
      if (grid) {
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
      }
      if (professionalGrid) {
        professionalGrid.style.flexDirection = 'row';
        professionalGrid.style.alignItems = 'stretch';
      }
    }
  }
  
  /**
   * 16進位顏色轉 RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '255, 255, 255';
    
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  
  /**
   * 添加樣式
   */
  addStyles() {
    if (!document.querySelector('#social-links-styles')) {
      const style = document.createElement('style');
      style.id = 'social-links-styles';
      style.textContent = `
        .professional-link {
          will-change: transform;
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .social-section {
            padding: 0.8rem !important;
            margin-top: 0.8rem !important;
          }
          
          .professional-links {
            gap: 0.5rem !important;
          }
          
          .professional-link {
            padding: 0.35rem 0.7rem !important;
            font-size: 0.75rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .professional-links {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [SocialLinksGrid] 銷毀社交連結組件');
    
    // 移除事件監聽器
    window.removeEventListener('resize', this.setupResponsiveLayout);
    
    super.destroy();
  }
}