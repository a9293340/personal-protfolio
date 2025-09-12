/**
 * ContactPage.js - 聯絡頁面主組件
 * 
 * 功能特色：
 * - Config-Driven 聯絡表單與社交連結展示
 * - 遊戲化風格的聯絡介面
 * - 響應式設計支援
 * - 表單驗證與提交處理
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { ContactForm } from '../components/common/ContactForm.js';
import { SocialLinksGrid } from '../components/common/SocialLinksGrid.js';
import { contactConfig } from '../config/data/contact/contact.config.js';

export class ContactPage extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(contactConfig, config);
    
    // 子組件
    this.contactForm = null;
    this.socialGrid = null;
    
    // 狀態
    this.isLoaded = false;
    
    console.log('📞 [ContactPage] 聯絡頁面組件初始化');
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      animations: {
        enabled: true,
        duration: 300,
        easing: 'ease-out'
      },
      responsive: {
        breakpoint: 768
      }
    };
  }
  
  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      isMobile: window.innerWidth <= 768,
      formSubmitted: false,
      currentSection: null
    };
  }
  
  /**
   * 渲染頁面
   */
  async render() {
    this.createElement();
    await this.initializeComponents();
    this.bindEvents();
    this.setupResponsiveLayout();
    
    return this.element.outerHTML;
  }
  
  /**
   * 創建主要 DOM 結構
   */
  createElement() {
    // 確保狀態已初始化
    if (!this.state) {
      this.state = this.getInitialState();
    }
    
    this.element = document.createElement('div');
    this.element.className = 'contact-page';
    
    // 應用響應式配置
    const layout = this.state.isMobile 
      ? this.config.responsive?.mobile?.layout 
      : this.config.layout;
    
    this.element.innerHTML = `
      <div class="contact-page-container" style="
        max-width: ${layout?.maxWidth || '1000px'};
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        position: relative;
      ">
        <!-- 頁面背景 -->
        <div class="contact-background">
          <div class="bg-particles"></div>
          <div class="bg-glow"></div>
        </div>
        
        <!-- 頁面標題 -->
        <header class="contact-hero" style="
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 2;
        ">
          <h1 class="hero-title" style="
            font-family: var(--font-heading);
            font-size: 3rem;
            color: var(--primary-gold);
            margin: 0 0 1rem 0;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
            animation: fadeInUp 0.8s ease-out;
          ">
            ${this.getHeroTitle()}
          </h1>
          
          <p class="hero-subtitle" style="
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 0.5rem 0;
            animation: fadeInUp 0.8s ease-out 0.2s both;
          ">
            ${this.getHeroSubtitle()}
          </p>
          
          <p class="hero-description" style="
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.6);
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
            animation: fadeInUp 0.8s ease-out 0.4s both;
          ">
            ${this.getHeroDescription()}
          </p>
        </header>
        
        <!-- 主要內容區域 -->
        <main class="contact-main" style="
          display: ${this.state.isMobile ? 'flex' : 'grid'};
          ${this.state.isMobile 
            ? 'flex-direction: column; gap: 2rem;'
            : `grid-template-columns: ${layout?.columns?.left?.width || '60%'} ${layout?.columns?.right?.width || '40%'}; gap: ${layout?.gap || '2rem'};`
          }
          position: relative;
          z-index: 2;
        ">
          <!-- 聯絡表單區域 -->
          <div class="contact-form-section" style="
            ${this.state.isMobile ? 'order: 2;' : ''}
          ">
            <div id="contact-form-container"></div>
          </div>
          
          <!-- 聯絡資訊區域 -->
          <div class="contact-info-section" style="
            ${this.state.isMobile ? 'order: 1;' : ''}
          ">
            <div id="contact-info-container"></div>
            <div id="social-links-container"></div>
          </div>
        </main>
        
        <!-- 合作興趣標籤 -->
        <section class="collaboration-interests" style="
          margin-top: 4rem;
          position: relative;
          z-index: 2;
        ">
          <div id="collaboration-tags-container"></div>
        </section>
        
        <!-- 回覆時間說明 -->
        <section class="response-info" style="
          margin-top: 2rem;
          position: relative;
          z-index: 2;
        ">
          <div id="response-info-container"></div>
        </section>
      </div>
    `;
    
    // 添加樣式
    this.addPageStyles();
  }
  
  /**
   * 初始化子組件
   */
  async initializeComponents() {
    try {
      // 初始化聯絡表單
      await this.initializeContactForm();
      
      // 初始化聯絡資訊
      await this.initializeContactInfo();
      
      // 初始化社交連結
      await this.initializeSocialLinks();
      
      // 初始化合作興趣標籤
      await this.initializeCollaborationTags();
      
      // 初始化回覆時間說明
      await this.initializeResponseInfo();
      
      this.isLoaded = true;
      console.log('✅ [ContactPage] 所有子組件初始化完成');
      
    } catch (error) {
      console.error('❌ [ContactPage] 組件初始化失敗:', error);
      this.showErrorMessage('頁面載入失敗，請重新整理頁面');
    }
  }
  
  /**
   * 初始化聯絡表單
   */
  async initializeContactForm() {
    const container = this.element.querySelector('#contact-form-container');
    
    if (container) {
      // 使用新的 contact.config.js 結構
      const formConfig = {
        fields: this.config.form?.fields || [],
        submitButton: this.config.form?.submission || {},
        handling: this.config.form?.submission?.messages || {}
      };
      
      // 創建表單組件
      this.contactForm = new ContactForm(formConfig);
      
      // 監聽表單事件
      this.contactForm.on('formSubmit', (data) => this.handleFormSubmit(data));
      this.contactForm.on('formSuccess', () => this.handleFormSuccess());
      this.contactForm.on('formError', (error) => this.handleFormError(error));
      
      // 渲染表單
      const formElement = await this.contactForm.render();
      container.appendChild(formElement);
    }
  }
  
  /**
   * 初始化聯絡資訊
   */
  async initializeContactInfo() {
    const container = this.element.querySelector('#contact-info-container');
    
    if (container && this.config.contactMethods) {
      container.innerHTML = `
        <div class="contact-info-card" style="
          background: rgba(46, 26, 46, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        ">
          <h3 style="
            color: var(--primary-gold);
            font-size: 1.5rem;
            margin: 0 0 1.5rem 0;
            font-weight: 600;
          ">直接聯絡方式</h3>
          
          <div class="contact-items">
            ${this.config.contactMethods.map(method => `
              <div class="contact-item" style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
              ">
                <span style="font-size: 1.5rem;">${method.icon}</span>
                <div>
                  <div style="color: white; font-weight: 500;">${method.label}</div>
                  ${method.action ? 
                    `<a href="${method.action}" style="
                      color: var(--primary-gold);
                      text-decoration: none;
                      font-size: 0.9rem;
                    ">${method.value}</a>` :
                    `<div style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${method.value}</div>`
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
  
  /**
   * 初始化社交連結
   */
  async initializeSocialLinks() {
    const container = this.element.querySelector('#social-links-container');
    
    if (container) {
      // 創建社交連結組件
      this.socialGrid = new SocialLinksGrid({
        title: '社交平台',
        style: 'gaming-grid',
        showStats: true
      });
      
      const socialElement = await this.socialGrid.render();
      container.appendChild(socialElement);
    }
  }
  
  /**
   * 初始化合作興趣標籤
   */
  async initializeCollaborationTags() {
    const container = this.element.querySelector('#collaboration-tags-container');
    
    if (container && this.config.collaborationInterests) {
      const tags = this.config.collaborationInterests || [];
      
      container.innerHTML = `
        <div class="collaboration-section">
          <h3 style="
            color: var(--primary-gold);
            font-size: 1.8rem;
            text-align: center;
            margin: 0 0 1rem 0;
            font-weight: 600;
          ">合作興趣領域</h3>
          
          <p style="
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            margin: 0 0 2rem 0;
            font-size: 1rem;
          ">以下是我感興趣的合作領域</p>
          
          <div class="tags-grid" style="
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
          ">
            ${tags.map((tag, index) => `
              <div class="interest-tag" style="
                background: linear-gradient(135deg, ${tag.color || 'var(--primary-gold)'}33, ${tag.color || 'var(--primary-gold)'}11);
                border: 1px solid ${tag.color || 'var(--primary-gold)'}66;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 2rem;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
                cursor: pointer;
                animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;
              " onmouseover="this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 8px 25px ${tag.color || 'var(--primary-gold)'}44';"
                 onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none';">
                ${tag.name}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
  
  /**
   * 初始化回覆時間說明
   */
  async initializeResponseInfo() {
    const container = this.element.querySelector('#response-info-container');
    
    if (container && this.config.responseInfo) {
      container.innerHTML = `
        <div class="response-info-card" style="
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 2rem; margin-bottom: 1rem;">${this.config.responseInfo.icon || '⏰'}</div>
          <h4 style="
            color: var(--primary-gold);
            font-size: 1.2rem;
            margin: 0 0 1rem 0;
            font-weight: 600;
          ">${this.config.responseInfo.title || '回覆時間'}</h4>
          <p style="
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin: 0;
          ">
            ${this.config.responseInfo.description.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--primary-gold);">$1</strong>')}
          </p>
        </div>
      `;
    }
  }
  
  /**
   * 綁定事件監聽器
   */
  bindEvents() {
    // 響應式監聽
    window.addEventListener('resize', () => this.handleResize());
    
    // 滾動事件
    window.addEventListener('scroll', () => this.handleScroll());
    
    // 表單項目懸停效果
    const contactItems = this.element.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(255, 255, 255, 0.1)';
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.background = 'rgba(255, 255, 255, 0.05)';
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'none';
      });
    });
  }
  
  /**
   * 處理視窗大小變化
   */
  handleResize() {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== this.state.isMobile) {
      this.setState({ isMobile: newIsMobile });
      this.setupResponsiveLayout();
    }
  }
  
  /**
   * 設置響應式佈局
   */
  setupResponsiveLayout() {
    const mainElement = this.element.querySelector('.contact-main');
    if (mainElement) {
      if (this.state.isMobile) {
        mainElement.style.display = 'flex';
        mainElement.style.flexDirection = 'column';
        mainElement.style.gap = '2rem';
      } else {
        mainElement.style.display = 'grid';
        mainElement.style.gridTemplateColumns = '60% 40%';
        mainElement.style.gap = '2rem';
      }
    }
  }
  
  /**
   * 處理滾動事件
   */
  handleScroll() {
    // 實現滾動視差效果
    const scrollY = window.scrollY;
    const particles = this.element.querySelector('.bg-particles');
    const glow = this.element.querySelector('.bg-glow');
    
    if (particles) {
      particles.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    
    if (glow) {
      glow.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
  }
  
  /**
   * 處理表單提交
   */
  async handleFormSubmit(formData) {
    console.log('📨 [ContactPage] 表單提交:', formData);
    // 更新 state
    this.state = { ...this.state, formSubmitted: true };
    
    // 這裡可以實現真實的表單提交邏輯
    // 例如發送到後端 API 或第三方服務
    
    return true; // 模擬成功提交
  }
  
  /**
   * 處理表單成功提交
   */
  handleFormSuccess() {
    console.log('✅ [ContactPage] 表單提交成功');
    this.showSuccessMessage('訊息發送成功！我會盡快回覆您。');
  }
  
  /**
   * 處理表單錯誤
   */
  handleFormError(error) {
    console.error('❌ [ContactPage] 表單提交失敗:', error);
    this.showErrorMessage('訊息發送失敗，請稍後再試或直接寄信給我。');
  }
  
  /**
   * 顯示成功訊息
   */
  showSuccessMessage(message) {
    // 實現成功訊息顯示邏輯
    console.log('✅ Success:', message);
  }
  
  /**
   * 顯示錯誤訊息
   */
  showErrorMessage(message) {
    // 實現錯誤訊息顯示邏輯
    console.error('❌ Error:', message);
  }
  
  /**
   * 獲取標題內容
   */
  getHeroTitle() {
    const heroConfig = this.config.sections?.find(s => s.id === 'contact-hero');
    return heroConfig?.config?.title || '建立連結';
  }
  
  /**
   * 獲取副標題內容
   */
  getHeroSubtitle() {
    const heroConfig = this.config.sections?.find(s => s.id === 'contact-hero');
    return heroConfig?.config?.subtitle || '技術交流 · 合作機會 · 職涯討論';
  }
  
  /**
   * 獲取描述內容
   */
  getHeroDescription() {
    const heroConfig = this.config.sections?.find(s => s.id === 'contact-hero');
    return heroConfig?.config?.description || '歡迎透過以下方式與我聯繫，一起探討技術趨勢和合作可能性';
  }
  
  /**
   * 添加頁面樣式
   */
  addPageStyles() {
    if (!document.querySelector('#contact-page-styles')) {
      const style = document.createElement('style');
      style.id = 'contact-page-styles';
      style.textContent = `
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            rgba(8, 8, 12, 0.98) 0%,
            rgba(25, 15, 25, 0.98) 50%,
            rgba(8, 8, 12, 0.98) 100%);
          color: white;
          position: relative;
        }
        
        .contact-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .bg-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(138, 43, 226, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px;
          animation: particlesFloat 20s linear infinite;
        }
        
        .bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: glowPulse 4s ease-in-out infinite alternate;
        }
        
        @keyframes particlesFloat {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
        
        @keyframes glowPulse {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .contact-page-container {
            padding: 1rem !important;
          }
          
          .hero-title {
            font-size: 2rem !important;
          }
          
          .hero-subtitle {
            font-size: 1rem !important;
          }
          
          .contact-main {
            gap: 1.5rem !important;
          }
          
          .contact-info-card,
          .response-info-card {
            padding: 1.5rem !important;
          }
          
          .tags-grid {
            gap: 0.75rem !important;
          }
          
          .interest-tag {
            padding: 0.5rem 1rem !important;
            font-size: 0.8rem !important;
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
    console.log('🗑️ [ContactPage] 銷毀聯絡頁面組件');
    
    // 銷毀子組件
    if (this.contactForm) {
      this.contactForm.destroy();
    }
    
    if (this.socialGrid) {
      this.socialGrid.destroy();
    }
    
    // 移除事件監聽器
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    
    super.destroy();
  }
}