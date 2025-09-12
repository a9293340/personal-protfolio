/**
 * PageTransitionManager - 頁面轉場動畫管理系統
 * Step 3.5.2: 實現遊戲化頁面切換動畫效果
 */

import { animationsConfig } from '../config/theme/animations.config.js';

export class PageTransitionManager {
  constructor() {
    this.isTransitioning = false;
    this.currentTransition = 'fadeSlideUp'; // 默認轉場效果
    this.transitionDuration = 400; // 與 animations.config.js 中的 pageTransition 一致
    
    // 性能優化配置
    this.performanceConfig = {
      // 檢測設備性能
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      isLowEndDevice: this.detectLowEndDevice(),
      isMobile: window.innerWidth <= 768
    };
    
    // 根據設備性能調整轉場時長
    if (this.performanceConfig.isLowEndDevice || this.performanceConfig.isMobile) {
      this.transitionDuration = 300; // 更短的動畫時長
    }
    
    // 如果用戶偏好減少動畫，則禁用複雜效果
    if (this.performanceConfig.reducedMotion) {
      this.currentTransition = 'fadeSlideUp'; // 使用簡單的淡入效果
      this.transitionDuration = 200;
    }
    
    // 綁定方法
    this.setupTransitionStyles();
    
    console.log('✨ PageTransitionManager initialized', this.performanceConfig);
  }
  
  /**
   * 檢測是否為低端設備
   * @returns {boolean}
   */
  detectLowEndDevice() {
    // 基於 navigator.hardwareConcurrency 檢測 CPU 核心數
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // GB
    
    // 如果 CPU 核心數少於 4 或記憶體少於 4GB，視為低端設備
    return cores < 4 || memory < 4;
  }
  
  /**
   * 設置頁面轉場 CSS 樣式
   */
  setupTransitionStyles() {
    // 檢查是否已經添加樣式
    if (document.querySelector('#page-transition-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'page-transition-styles';
    style.textContent = `
      /* 頁面轉場基礎樣式 */
      .page-content {
        position: relative;
        overflow: hidden;
        /* GPU 加速和性能優化 */
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      .page-transition-container {
        position: relative;
        min-height: 100vh;
        /* 優化渲染性能 */
        contain: layout style paint;
      }
      
      .page-exiting {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
        /* GPU 加速 */
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      .page-entering {
        position: relative;
        z-index: 2;
        /* GPU 加速 */
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      /* 淡出動畫 */
      .transition-fade-out {
        animation: fadeOut 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateZ(0);
        }
        to {
          opacity: 0;
          transform: translateZ(0);
        }
      }
      
      /* 向上滑入動畫 */
      .transition-slide-in-up {
        animation: slideInUp 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
        transform: translateY(30px) translateZ(0);
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px) translateZ(0);
        }
        to {
          opacity: 1;
          transform: translateY(0) translateZ(0);
        }
      }
      
      /* 向下滑入動畫 */
      .transition-slide-in-down {
        animation: slideInDown 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
        transform: translateY(-30px) translateZ(0);
      }
      
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px) translateZ(0);
        }
        to {
          opacity: 1;
          transform: translateY(0) translateZ(0);
        }
      }
      
      /* 縮放淡入動畫 */
      .transition-scale-in {
        animation: scaleIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        opacity: 0;
        transform: scale(0.9) translateZ(0);
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateZ(0);
        }
        to {
          opacity: 1;
          transform: scale(1) translateZ(0);
        }
      }
      
      /* 向左滑出動畫 */
      .transition-slide-out-left {
        animation: slideOutLeft 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      @keyframes slideOutLeft {
        from {
          opacity: 1;
          transform: translateX(0) translateZ(0);
        }
        to {
          opacity: 0;
          transform: translateX(-30px) translateZ(0);
        }
      }
      
      /* 遊戲化載入效果 */
      .gaming-loader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        text-align: center;
        pointer-events: none;
      }
      
      .gaming-loader-icon {
        font-size: 3rem;
        animation: gamingPulse 1s ease-in-out infinite alternate;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
      }
      
      @keyframes gamingPulse {
        from {
          transform: scale(1);
          opacity: 0.7;
        }
        to {
          transform: scale(1.2);
          opacity: 1;
        }
      }
      
      .gaming-loader-text {
        color: #d4af37;
        font-size: 1.1rem;
        font-weight: 500;
        opacity: 0.9;
      }
      
      /* 粒子背景效果 */
      .transition-particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 5;
        opacity: 0;
        transition: opacity 200ms ease;
      }
      
      .transition-particles.active {
        opacity: 1;
      }
      
      .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: #d4af37;
        border-radius: 50%;
        animation: particleFloat 2s ease-out forwards;
      }
      
      @keyframes particleFloat {
        from {
          opacity: 1;
          transform: translateY(0) scale(0.5);
        }
        to {
          opacity: 0;
          transform: translateY(-100px) scale(1);
        }
      }
      
      /* 響應式調整 */
      @media (max-width: 768px) {
        /* 移動端使用更簡單的動畫以提升效能 */
        .transition-slide-in-up,
        .transition-slide-in-down,
        .transition-scale-in {
          animation-duration: 300ms;
        }
        
        .transition-fade-out,
        .transition-slide-out-left {
          animation-duration: 300ms;
        }
        
        .gaming-loader-icon {
          font-size: 2rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Page transition styles injected');
  }
  
  /**
   * 執行頁面轉場動畫
   * @param {HTMLElement} container - 頁面容器元素
   * @param {Function} renderNewPage - 渲染新頁面的函數
   * @param {Object} options - 轉場選項
   * @returns {Promise} 轉場完成的 Promise
   */
  async executeTransition(container, renderNewPage, options = {}) {
    if (this.isTransitioning) {
      console.warn('⚠️ Transition already in progress');
      return;
    }
    
    this.isTransitioning = true;
    
    try {
      const {
        transitionType = this.currentTransition,
        showLoader = true,
        showParticles = true
      } = options;
      
      console.log(`✨ Starting page transition: ${transitionType}`);
      
      // 1. 準備轉場容器
      this.prepareTransitionContainer(container);
      
      // 2. 顯示載入效果（根據性能配置決定）
      if (showLoader && !this.performanceConfig.reducedMotion) {
        this.showGamingLoader();
      }
      
      // 3. 顯示粒子效果（低端設備跳過）
      if (showParticles && !this.performanceConfig.isLowEndDevice && !this.performanceConfig.reducedMotion) {
        this.showTransitionParticles();
      }
      
      // 4. 執行退出動畫
      await this.animatePageExit(container, transitionType);
      
      // 5. 渲染新頁面
      await renderNewPage();
      
      // 6. 執行進入動畫
      await this.animatePageEnter(container, transitionType);
      
      // 7. 清理效果
      this.hideGamingLoader();
      this.hideTransitionParticles();
      this.cleanupTransitionContainer(container);
      
      console.log('✅ Page transition completed');
      
    } catch (error) {
      console.error('❌ Page transition failed:', error);
      
      // 錯誤恢復
      this.hideGamingLoader();
      this.hideTransitionParticles();
      this.cleanupTransitionContainer(container);
      
    } finally {
      this.isTransitioning = false;
    }
  }
  
  /**
   * 準備轉場容器
   */
  prepareTransitionContainer(container) {
    if (!container.classList.contains('page-transition-container')) {
      container.classList.add('page-transition-container');
    }
  }
  
  /**
   * 執行頁面退出動畫
   */
  async animatePageExit(container, transitionType) {
    const config = animationsConfig.pageTransitions[transitionType];
    if (!config) {
      console.warn(`⚠️ Unknown transition type: ${transitionType}`);
      return;
    }
    
    // 獲取退出動畫類名
    const exitClass = this.getExitAnimationClass(config.exit);
    
    return new Promise((resolve) => {
      if (container.children.length > 0) {
        const currentContent = container.children[0];
        currentContent.classList.add('page-exiting');
        currentContent.classList.add(exitClass);
        
        // 動畫完成後清理
        setTimeout(() => {
          resolve();
        }, this.transitionDuration / 2);
      } else {
        resolve();
      }
    });
  }
  
  /**
   * 執行頁面進入動畫
   */
  async animatePageEnter(container, transitionType) {
    const config = animationsConfig.pageTransitions[transitionType];
    if (!config) {
      return;
    }
    
    // 獲取進入動畫類名
    const enterClass = this.getEnterAnimationClass(config.enter);
    
    return new Promise((resolve) => {
      if (container.children.length > 0) {
        const newContent = container.children[container.children.length - 1];
        newContent.classList.add('page-entering');
        newContent.classList.add(enterClass);
        
        // 動畫完成後清理類名
        setTimeout(() => {
          newContent.classList.remove('page-entering', enterClass);
          resolve();
        }, this.transitionDuration);
      } else {
        resolve();
      }
    });
  }
  
  /**
   * 獲取退出動畫類名
   */
  getExitAnimationClass(exitType) {
    const animationMap = {
      'fadeOut': 'transition-fade-out',
      'slideOutLeft': 'transition-slide-out-left'
    };
    return animationMap[exitType] || 'transition-fade-out';
  }
  
  /**
   * 獲取進入動畫類名
   */
  getEnterAnimationClass(enterType) {
    const animationMap = {
      'slideInUp': 'transition-slide-in-up',
      'slideInDown': 'transition-slide-in-down',
      'scaleIn': 'transition-scale-in'
    };
    return animationMap[enterType] || 'transition-slide-in-up';
  }
  
  /**
   * 顯示遊戲化載入器
   */
  showGamingLoader() {
    // 移除現有載入器
    this.hideGamingLoader();
    
    const loader = document.createElement('div');
    loader.id = 'gaming-page-loader';
    loader.classList.add('gaming-loader');
    loader.innerHTML = `
      <div class="gaming-loader-icon">⚡</div>
      <div class="gaming-loader-text">Loading...</div>
    `;
    
    document.body.appendChild(loader);
  }
  
  /**
   * 隱藏遊戲化載入器
   */
  hideGamingLoader() {
    const loader = document.getElementById('gaming-page-loader');
    if (loader) {
      loader.remove();
    }
  }
  
  /**
   * 顯示轉場粒子效果
   */
  showTransitionParticles() {
    // 移除現有粒子
    this.hideTransitionParticles();
    
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'transition-particles';
    particlesContainer.classList.add('transition-particles', 'active');
    
    // 創建粒子
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
    
    // 自動清理粒子
    setTimeout(() => {
      this.hideTransitionParticles();
    }, 2000);
  }
  
  /**
   * 隱藏轉場粒子效果
   */
  hideTransitionParticles() {
    const particles = document.getElementById('transition-particles');
    if (particles) {
      particles.classList.remove('active');
      setTimeout(() => particles.remove(), 200);
    }
  }
  
  /**
   * 清理轉場容器
   */
  cleanupTransitionContainer(container) {
    // 移除退出中的舊內容
    const exitingElements = container.querySelectorAll('.page-exiting');
    exitingElements.forEach(element => {
      element.remove();
    });
    
    // 清理類名
    const enteringElements = container.querySelectorAll('.page-entering');
    enteringElements.forEach(element => {
      element.classList.remove('page-entering');
    });
  }
  
  /**
   * 設置轉場類型
   */
  setTransitionType(type) {
    if (animationsConfig.pageTransitions[type]) {
      this.currentTransition = type;
      console.log(`🎬 Transition type set to: ${type}`);
    } else {
      console.warn(`⚠️ Unknown transition type: ${type}`);
    }
  }
  
  /**
   * 根據路由路徑選擇合適的轉場效果
   */
  getTransitionTypeForRoute(fromPath, toPath) {
    // 基於路由路徑選擇轉場效果的邏輯
    const routeTransitions = {
      '/': 'fadeSlideUp',
      '/about': 'fadeSlideDown', 
      '/skills': 'scaleSlide',
      '/work-projects': 'fadeSlideUp',
      '/personal-projects': 'scaleSlide',
      '/contact': 'fadeSlideDown'
    };
    
    return routeTransitions[toPath] || 'fadeSlideUp';
  }
  
  /**
   * 檢查是否正在轉場中
   */
  isInTransition() {
    return this.isTransitioning;
  }
  
  /**
   * 銷毀轉場管理器
   */
  destroy() {
    this.hideGamingLoader();
    this.hideTransitionParticles();
    
    const styles = document.getElementById('page-transition-styles');
    if (styles) {
      styles.remove();
    }
    
    console.log('🔥 PageTransitionManager destroyed');
  }
}