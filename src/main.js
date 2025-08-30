/**
 * 主應用程式入口點
 * Gaming Portfolio - Config-Driven Architecture
 */

// 核心系統導入 (後續會實現)
// import { ConfigManager } from '@core/config/ConfigManager.js';
// import { Router } from '@core/router/Router.js';
// import { StateManager } from '@core/state/StateManager.js';
// import { EventManager } from '@core/events/EventManager.js';

// 系統管理器導入 (後續會實現)  
// import { AudioManager } from '@systems/AudioManager.js';
// import { AnimationManager } from '@systems/AnimationManager.js';
// import { PreloadManager } from '@systems/PreloadManager.js';

/**
 * 應用程式類
 */
class App {
  constructor() {
    this.initialized = false;
    this.managers = {};
  }

  /**
   * 初始化應用程式
   */
  async init() {
    try {
      console.log('🎮 Gaming Portfolio - Initializing...');
      
      // 顯示載入畫面
      this.showLoadingScreen();
      
      // 初始化核心系統 (暫時註解，等實現後啟用)
      // await this.initializeCore();
      
      // 初始化功能系統 (暫時註解，等實現後啟用)
      // await this.initializeSystems();
      
      // 載入配置 (暫時註解，等實現後啟用)
      // await this.loadConfigurations();
      
      // 初始化路由 (暫時註解，等實現後啟用)
      // await this.initializeRouter();
      
      // 臨時測試內容
      await this.initializeTemporaryContent();
      
      // 隱藏載入畫面
      this.hideLoadingScreen();
      
      this.initialized = true;
      console.log('✅ Gaming Portfolio - Initialized successfully!');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.showError('Application failed to initialize. Please refresh the page.');
    }
  }

  /**
   * 顯示載入畫面
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContainer = document.getElementById('main-container');
    
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
    if (mainContainer) {
      mainContainer.classList.add('hidden');
    }
  }

  /**
   * 隱藏載入畫面
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContainer = document.getElementById('main-container');
    
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
      if (mainContainer) {
        mainContainer.classList.remove('hidden');
      }
    }, 1500); // 讓載入動畫播放一段時間
  }

  /**
   * 臨時測試內容 (開發階段使用)
   */
  async initializeTemporaryContent() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = `
        <div class="welcome-container">
          <h1 class="welcome-title">🎮 Gaming Portfolio</h1>
          <p class="welcome-subtitle">Config-Driven Architecture</p>
          <div class="status-info">
            <p><strong>狀態:</strong> 基礎架構已建立</p>
            <p><strong>下一步:</strong> 實現核心系統</p>
            <p><strong>架構:</strong> Config-Driven + Component-Based</p>
          </div>
          <div class="directory-structure">
            <h3>📁 已建立的目錄結構:</h3>
            <pre>
src/
├── config/     # 配置驅動核心
├── core/       # 系統核心
├── components/ # 組件系統  
├── pages/      # 頁面組件
├── systems/    # 功能系統
├── utils/      # 工具函數
└── styles/     # 樣式系統
            </pre>
          </div>
        </div>
      `;
    }
  }

  /**
   * 顯示錯誤訊息
   * @param {string} message - 錯誤訊息
   */
  showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.innerHTML = `
      <div class="error-content">
        <h2>❌ 錯誤</h2>
        <p>${message}</p>
        <button onclick="location.reload()" class="retry-button">重新載入</button>
      </div>
    `;
    document.body.appendChild(errorContainer);
  }
}

/**
 * 應用程式啟動
 */
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  await app.init();
});

// 全域錯誤處理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});