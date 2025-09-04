/**
 * ProjectCard 專案卡片組件
 * 
 * 核心功能：
 * - 基於成熟動畫套件的 3D 翻轉卡片
 * - 稀有度系統視覺效果
 * - 響應式設計 (Mobile-first)
 * - Config-Driven 數據載入
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class ProjectCard extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    this.element = null;
    this.isFlipped = false;
    
    this.init();
  }

  getDefaultConfig() {
    return {
      // 卡片基礎配置
      width: '320px',
      height: '240px',
      borderRadius: '16px',
      
      // 動畫配置
      flipDuration: '1s',
      flipEasing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      hoverScale: {
        desktop: 1.05,
        mobile: 1.03
      },
      
      // 稀有度配置
      rarity: 'normal', // normal, rare, superRare, legendary
      
      // 響應式配置
      responsive: {
        mobile: {
          width: '280px',
          height: '200px',
          simplifiedEffects: true
        },
        desktop: {
          width: '320px', 
          height: '240px',
          fullEffects: true
        }
      },
      
      // 專案數據
      projectData: {
        id: '',
        title: '',
        description: '',
        technologies: [],
        images: {
          front: '',
          back: ''
        },
        links: {
          demo: '',
          github: '',
          detail: ''
        }
      }
    };
  }

  getInitialState() {
    return {
      isHovered: false,
      isFlipped: false,
      isLoading: false,
      currentRarity: this.config.rarity,
      isMobile: this.detectMobile()
    };
  }

  detectMobile() {
    return window.innerWidth <= 768;
  }

  async init() {
    try {
      await this.loadAnimationLibraries();
      await this.loadProjectData();
      this.createElement();
      this.bindEvents();
      this.applyResponsiveHandling();
      console.log('[ProjectCard] 組件初始化完成');
    } catch (error) {
      console.error('[ProjectCard] 初始化失敗:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * 載入專案數據 (整合 ConfigManager)
   */
  async loadProjectData() {
    try {
      if (this.config.projectData && this.config.projectData.id && !this.config.projectData.title) {
        const projectsModule = await import('../../../config/data/projects.data.js');
        const projectsConfig = projectsModule.projectsDataConfig || projectsModule.default;
        
        const projectData = projectsConfig.all[this.config.projectData.id];
        
        if (projectData) {
          this.config.projectData = {
            id: projectData.id,
            title: projectData.name,
            description: projectData.shortDescription,
            technologies: projectData.technologies?.map(tech => 
              typeof tech === 'object' ? tech.name : tech
            ) || [],
            images: {
              front: projectData.thumbnail || '',
              back: projectData.images?.[0] || ''
            },
            links: projectData.links || {}
          };
          
          // 更新稀有度
          if (projectData.rarity) {
            this.config.rarity = projectData.rarity;
            this.state.currentRarity = projectData.rarity;
          }
          
          console.log(`[ProjectCard] 載入專案數據: ${projectData.name}`);
        } else {
          console.warn(`[ProjectCard] 未找到專案數據: ${this.config.projectData.id}`);
        }
      }
    } catch (error) {
      console.error('[ProjectCard] 載入專案數據失敗:', error);
    }
  }

  /**
   * 載入成熟的動畫套件
   */
  async loadAnimationLibraries() {
    const libraries = [
      {
        name: 'animate.css',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
        type: 'css'
      },
      {
        name: 'hover.css',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css',
        type: 'css'
      },
      {
        name: 'aos',
        url: 'https://unpkg.com/aos@2.3.1/dist/aos.css',
        type: 'css'
      },
      {
        name: 'aos.js',
        url: 'https://unpkg.com/aos@2.3.1/dist/aos.js',
        type: 'js'
      }
    ];

    const loadPromises = libraries.map(lib => this.loadLibrary(lib));
    
    try {
      await Promise.all(loadPromises);
      
      // 初始化 AOS
      if (window.AOS) {
        window.AOS.init({
          duration: 1000,
          easing: 'ease-in-out-cubic',
          once: false,
          mirror: true
        });
      }
      
      console.log('[ProjectCard] 動畫套件載入完成');
    } catch (error) {
      console.error('[ProjectCard] 動畫套件載入失敗:', error);
      throw error;
    }
  }

  loadLibrary(library) {
    return new Promise((resolve, reject) => {
      // 檢查是否已載入
      const selector = library.type === 'css' 
        ? `link[href="${library.url}"]`
        : `script[src="${library.url}"]`;
      
      if (document.querySelector(selector)) {
        resolve();
        return;
      }

      let element;
      
      if (library.type === 'css') {
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.href = library.url;
      } else {
        element = document.createElement('script');
        element.src = library.url;
        element.async = true;
      }

      element.onload = () => resolve();
      element.onerror = () => reject(new Error(`載入 ${library.name} 失敗`));

      document.head.appendChild(element);
    });
  }

  /**
   * 創建卡片DOM結構
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = this.generateClasses();
    
    this.element.innerHTML = this.generateHTML();
    
    // 設定基礎樣式
    this.applyBaseStyles();
    
    // 套用稀有度效果
    this.applyRarityEffects();
  }

  generateClasses() {
    const classes = [
      'project-card',
      `rarity-${this.state.currentRarity}`,
      'animate__animated',
      'hvr-float'
    ];
    
    if (this.state.isMobile) {
      classes.push('mobile-optimized');
    }
    
    return classes.join(' ');
  }

  generateHTML() {
    const { projectData } = this.config;
    
    return `
      <div class="card-container" data-aos="fade-up">
        <div class="flip-card">
          <div class="card-face card-front">
            <div class="card-content">
              <div class="project-icon">${this.getRarityIcon()}</div>
              <h3 class="project-title">${projectData.title || '專案標題'}</h3>
              <p class="project-description">${projectData.description || '專案描述'}</p>
              <div class="tech-tags">
                ${(projectData.technologies || []).map(tech => 
                  `<span class="tech-tag">${tech}</span>`
                ).join('')}
              </div>
            </div>
          </div>
          
          <div class="card-face card-back">
            <div class="card-content">
              <div class="project-details">
                <h3>專案詳情</h3>
                <div class="project-links">
                  ${projectData.links.demo ? 
                    `<a href="${projectData.links.demo}" class="project-link demo-link" target="_blank">
                      <span>🌐</span> 查看展示
                    </a>` : ''
                  }
                  ${projectData.links.github ? 
                    `<a href="${projectData.links.github}" class="project-link github-link" target="_blank">
                      <span>📦</span> 源碼庫
                    </a>` : ''
                  }
                  ${projectData.links.detail ? 
                    `<a href="${projectData.links.detail}" class="project-link detail-link">
                      <span>📋</span> 詳細資訊
                    </a>` : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getRarityIcon() {
    const icons = {
      normal: '📄',
      rare: '💎', 
      superRare: '🌟',
      legendary: '👑'
    };
    return icons[this.state.currentRarity] || icons.normal;
  }

  /**
   * 套用基礎樣式
   */
  applyBaseStyles() {
    const styles = `
      <style>
        .project-card {
          width: ${this.state.isMobile ? this.config.responsive.mobile.width : this.config.responsive.desktop.width};
          min-height: ${this.state.isMobile ? this.config.responsive.mobile.height : this.config.responsive.desktop.height};
          margin: 20px;
          perspective: 1000px;
          cursor: pointer;
          position: relative;
        }
        
        .card-container {
          width: 100%;
          min-height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform ${this.config.flipDuration} ${this.config.flipEasing};
        }
        
        .flip-card {
          width: 100%;
          min-height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform ${this.config.flipDuration} ${this.config.flipEasing};
        }
        
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          min-height: 100%;
          backface-visibility: hidden;
          border-radius: ${this.config.borderRadius};
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .card-front {
          transform: rotateY(0deg);
        }
        
        .card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%);
        }
        
        .card-content {
          text-align: center;
          color: white;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100%;
          padding-top: 10px;
        }
        
        .project-icon {
          font-size: 2.5em;
          margin-bottom: 15px;
        }
        
        .project-title {
          font-size: 1.4em;
          font-weight: bold;
          margin-bottom: 10px;
          color: #ffffff;
        }
        
        .project-description {
          font-size: 0.95em;
          line-height: 1.4;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 10px;
        }
        
        
        .tech-tag {
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          border: 1px solid rgba(255,255,255,0.3);
          white-space: nowrap;
          flex-shrink: 0;
          min-width: max-content;
        }
        
        .project-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }
        
        .project-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 15px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .project-link:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        
        /* 響應式優化 */
        @media (max-width: 768px) {
          .project-card.mobile-optimized {
            margin: 10px auto;
            width: ${this.config.responsive.mobile.width} !important;
            min-height: ${this.config.responsive.mobile.height} !important;
          }
          
          .project-card.mobile-optimized .project-icon {
            font-size: 2em;
            margin-bottom: 10px;
          }
          
          .project-card.mobile-optimized .project-title {
            font-size: 1.2em;
            margin-bottom: 8px;
          }
          
          .project-card.mobile-optimized .project-description {
            font-size: 0.85em;
            margin-bottom: 10px;
            line-height: 1.3;
          }
          
          .project-card.mobile-optimized .tech-tags {
            gap: 4px;
          }
          
          .project-card.mobile-optimized .tech-tag {
            font-size: 0.75em;
            padding: 3px 6px;
            border-radius: 10px;
          }
          
          .project-card.mobile-optimized .project-links {
            margin-top: 15px;
          }
          
          .project-card.mobile-optimized .project-link {
            padding: 8px 12px;
            font-size: 0.9em;
          }
        }
        
        /* 大屏響應式優化 */
        @media (min-width: 1024px) {
          .project-card:hover {
            transform: scale(${this.config.hoverScale.desktop}) translateZ(0);
          }
        }
        
        /* 觸控設備優化 */
        @media (hover: none) and (pointer: coarse) {
          .project-card {
            transform: scale(1) !important;
          }
          
          .project-card:active {
            transform: scale(${this.config.hoverScale.mobile}) !important;
            transition: transform 0.1s ease;
          }
        }
      </style>
    `;
    
    if (!document.querySelector('#project-card-base-styles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'project-card-base-styles';
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
  }

  /**
   * 套用稀有度效果
   */
  applyRarityEffects() {
    // 稀有度效果將在下個步驟詳細實現
    const rarityClass = `rarity-${this.state.currentRarity}`;
    this.element.classList.add(rarityClass);
    
    console.log(`[ProjectCard] 套用稀有度效果: ${this.state.currentRarity}`);
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    const flipCard = this.element.querySelector('.flip-card');
    
    // 點擊翻轉
    this.element.addEventListener('click', () => {
      this.toggleFlip();
    });
    
    // Hover 效果
    this.element.addEventListener('mouseenter', () => {
      this.handleHover(true);
    });
    
    this.element.addEventListener('mouseleave', () => {
      this.handleHover(false);
    });
    
    // 響應式處理
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    const flipCard = this.element.querySelector('.flip-card');
    
    if (this.isFlipped) {
      flipCard.classList.add('flipped');
    } else {
      flipCard.classList.remove('flipped');
    }
    
    console.log(`[ProjectCard] 卡片翻轉: ${this.isFlipped ? '背面' : '正面'}`);
  }

  handleHover(isHovered) {
    this.state.isHovered = isHovered;
    
    const scale = this.state.isMobile 
      ? this.config.hoverScale.mobile 
      : this.config.hoverScale.desktop;
    
    if (isHovered) {
      this.element.style.transform = `scale(${scale})`;
      this.element.classList.add('animate__pulse');
    } else {
      this.element.style.transform = 'scale(1)';
      this.element.classList.remove('animate__pulse');
    }
  }

  handleResize() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = this.detectMobile();
    
    if (wasMobile !== this.state.isMobile) {
      this.applyResponsiveHandling();
      console.log(`[ProjectCard] 響應式切換: ${this.state.isMobile ? 'Mobile' : 'Desktop'}`);
    }
  }

  applyResponsiveHandling() {
    if (this.state.isMobile) {
      this.element.classList.add('mobile-optimized');
      // 移動端簡化效果
    } else {
      this.element.classList.remove('mobile-optimized');
      // 桌面端完整效果
    }
  }

  /**
   * 公開方法：設定專案數據
   */
  setProjectData(projectData) {
    this.config.projectData = { ...this.config.projectData, ...projectData };
    this.update();
  }

  /**
   * 公開方法：設定稀有度
   */
  setRarity(rarity) {
    if (['normal', 'rare', 'superRare', 'legendary'].includes(rarity)) {
      this.element.classList.remove(`rarity-${this.state.currentRarity}`);
      this.state.currentRarity = rarity;
      this.element.classList.add(`rarity-${rarity}`);
      this.applyRarityEffects();
    }
  }

  /**
   * 處理初始化錯誤
   */
  handleInitializationError(error) {
    this.element = document.createElement('div');
    this.element.className = 'project-card error-state';
    this.element.innerHTML = `
      <div class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-title">組件載入失敗</div>
        <div class="error-details">${error.message}</div>
        <button class="retry-button" onclick="this.parentElement.parentElement.retry()">
          🔄 重試
        </button>
      </div>
    `;
    
    this.element.retry = () => {
      this.init();
    };
    
    this.applyErrorStyles();
  }

  applyErrorStyles() {
    const errorStyles = `
      <style>
        .project-card.error-state {
          width: 320px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%);
          border: 2px solid rgba(231, 76, 60, 0.3);
          border-radius: 16px;
          margin: 20px;
        }
        
        .error-message {
          text-align: center;
          color: #e74c3c;
          padding: 20px;
        }
        
        .error-icon {
          font-size: 2em;
          margin-bottom: 10px;
        }
        
        .error-title {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .error-details {
          font-size: 0.9em;
          opacity: 0.8;
          margin-bottom: 15px;
        }
        
        .retry-button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-button:hover {
          background: #c0392b;
          transform: translateY(-2px);
        }
      </style>
    `;
    
    if (!document.querySelector('#project-card-error-styles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'project-card-error-styles';
      styleElement.innerHTML = errorStyles;
      document.head.appendChild(styleElement);
    }
  }

  /**
   * 更新組件
   */
  update() {
    if (this.element) {
      const newElement = this.createElement();
      this.element.parentNode.replaceChild(newElement.element, this.element);
      this.element = newElement.element;
      this.bindEvents();
    }
  }

  /**
   * 獲取DOM元素
   */
  getElement() {
    return this.element;
  }

  /**
   * 銷毀組件
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    console.log('[ProjectCard] 組件已銷毀');
  }
}