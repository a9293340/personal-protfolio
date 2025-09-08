/**
 * Gaming Portfolio 主應用程式
 * Step 3.1.1: 整合路由系統完成版
 */

import { Router } from './core/router/Router.js';
import { routesConfig, validateRoutesConfig, getRouteStats } from './config/routes.config.js';
import { NavBar } from './components/layout/NavBar.js';

/**
 * 主應用程式類
 */
class GamingPortfolioApp {
  constructor() {
    this.router = null;
    this.navbar = null;
    this.initialized = false;
  }
  
  /**
   * 初始化應用程式
   */
  async init() {
    try {
      console.log('🎮 Gaming Portfolio - Starting...');
      
      // 驗證路由配置
      if (!validateRoutesConfig()) {
        throw new Error('Invalid routes configuration');
      }
      
      // 顯示路由統計
      const stats = getRouteStats();
      console.log('📊 Routes Stats:', stats);
      
      // 準備 DOM
      this.prepareDOMElements();
      
      // 初始化導航系統
      await this.initializeNavBar();
      
      // 初始化路由系統
      await this.initializeRouter();
      
      // 隱藏載入畫面
      this.hideLoadingScreen();
      
      // 啟動路由
      this.router.start();
      
      this.initialized = true;
      console.log('✅ Gaming Portfolio - Initialized successfully!');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.showError(`Application failed to initialize: ${error.message}`);
    }
  }
  
  /**
   * 準備 DOM 元素
   */
  prepareDOMElements() {
    console.log('📄 Preparing DOM elements...');
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainContainer = document.getElementById('main-container');
    const pageContent = document.getElementById('page-content');
    
    // 確保主容器顯示
    if (mainContainer) {
      mainContainer.classList.remove('hidden');
      mainContainer.style.display = 'block';
      mainContainer.style.visibility = 'visible';
      mainContainer.style.opacity = '1';
      mainContainer.style.background = '#1a1a2e';
      mainContainer.style.minHeight = '100vh';
    }
    
    // 設置頁面內容樣式
    if (pageContent) {
      pageContent.style.background = '#1a1a2e';
      pageContent.style.color = 'white';
      pageContent.style.minHeight = '100vh';
    }
    
    // 設置 body 樣式
    document.body.style.background = '#1a1a2e';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    
    console.log('✅ DOM elements prepared');
  }
  
  /**
   * 初始化導航系統
   */
  async initializeNavBar() {
    console.log('🧭 Initializing navbar...');
    
    const navContainer = document.getElementById('navigation');
    if (navContainer) {
      this.navbar = new NavBar();
      const navHTML = await this.navbar.render();
      navContainer.innerHTML = navHTML;
      await this.navbar.init();
      
      console.log('✅ NavBar initialized');
    } else {
      console.warn('⚠️ Navigation container not found');
    }
  }
  
  /**
   * 初始化路由系統
   */
  async initializeRouter() {
    console.log('🛣️ Initializing router...');
    
    this.router = new Router();
    
    // 註冊所有路由
    routesConfig.forEach(route => {
      this.router.register(route.path, route.component, {
        title: route.title,
        meta: route.meta
      });
    });
    
    console.log('✅ Router initialized with', routesConfig.length, 'routes');
  }
  
  /**
   * 隱藏載入畫面
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
      console.log('✅ Loading screen hidden');
    }
  }
  
  /**
   * 顯示錯誤頁面
   */
  showError(message) {
    const pageContent = document.getElementById('page-content');
    
    if (pageContent) {
      pageContent.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #ff4757;">
          <div style="font-size: 4rem; margin-bottom: 20px;">💥</div>
          <h2 style="color: #e74c3c; margin-bottom: 20px;">應用程式初始化失敗</h2>
          <p style="color: white; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">${message}</p>
          <button onclick="location.reload()" 
                  style="background: #d4af37; color: black; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem;">
            🔄 重新載入
          </button>
        </div>
      `;
    }
  }
  
  /**
   * 獲取路由器實例
   */
  getRouter() {
    return this.router;
  }
  
  /**
   * 銷毀應用程式
   */
  destroy() {
    if (this.navbar) {
      this.navbar.destroy();
      this.navbar = null;
    }
    
    if (this.router) {
      this.router.destroy();
      this.router = null;
    }
    
    this.initialized = false;
    console.log('🔥 Gaming Portfolio - Destroyed');
  }
}

// 創建全域應用程式實例
let app = null;

/**
 * 應用程式啟動
 */
document.addEventListener('DOMContentLoaded', async () => {
  app = new GamingPortfolioApp();
  await app.init();
  
  // 將應用實例掛載到全域
  window.gamingPortfolioApp = app;
});

// 全域錯誤處理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 導出應用程式類（供其他模組使用）
export { GamingPortfolioApp };