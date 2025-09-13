/**
 * 導航管理系統
 * Step 3.5.3: 整體導航優化 - 統一管理器
 */

import { BreadcrumbNavigation } from '../components/navigation/BreadcrumbNavigation.js';
import { ProgressIndicator } from '../components/navigation/ProgressIndicator.js';
import { KeyboardNavigation } from '../components/navigation/KeyboardNavigation.js';

export class NavigationManager {
  constructor() {
    this.breadcrumbNav = null;
    this.progressIndicator = null;
    this.keyboardNav = null;
    this.currentPage = null;
    this.navigationHistory = [];
    this.isInitialized = false;
  }

  /**
   * 初始化導航管理器
   */
  async init() {
    try {
      console.log('🧭 NavigationManager - Initializing...');

      // 初始化麵包屑導航
      await this.initBreadcrumbNavigation();

      // 初始化進度指示器
      await this.initProgressIndicator();

      // 初始化快捷鍵導航
      await this.initKeyboardNavigation();

      // 綁定路由變化監聽
      this.bindRouteEvents();

      this.isInitialized = true;
      console.log('✅ NavigationManager - Initialized successfully');

    } catch (error) {
      console.error('❌ NavigationManager initialization failed:', error);
      throw error;
    }
  }

  /**
   * 初始化麵包屑導航
   */
  async initBreadcrumbNavigation() {
    console.log('🍞 Initializing breadcrumb navigation...');

    // 創建麵包屑容器
    this.createBreadcrumbContainer();

    // 創建麵包屑導航組件
    this.breadcrumbNav = new BreadcrumbNavigation({
      showIcons: true,
      showDescriptions: true,
      animationEnabled: true,
      style: 'gaming'
    });

    // 渲染麵包屑導航
    const container = document.getElementById('breadcrumb-container');
    if (container) {
      const html = await this.breadcrumbNav.render();
      container.innerHTML = html;
      await this.breadcrumbNav.init();
      console.log('✅ Breadcrumb navigation initialized');
    } else {
      console.warn('⚠️ Breadcrumb container not found');
    }
  }

  /**
   * 初始化進度指示器
   */
  async initProgressIndicator() {
    console.log('📊 Initializing progress indicator...');

    // 創建進度指示器容器
    this.createProgressIndicatorContainer();

    // 創建進度指示器組件
    this.progressIndicator = new ProgressIndicator({
      showMilestones: true,
      showPercentage: true,
      showVisitedCount: true,
      animationEnabled: true,
      style: 'gaming',
      position: 'top-right',
      storageType: 'sessionStorage' // 每次開啟瀏覽器都重新開始
    });

    // 渲染進度指示器
    const container = document.getElementById('progress-indicator-container');
    if (container) {
      const html = await this.progressIndicator.render();
      container.innerHTML = html;
      await this.progressIndicator.init();
      console.log('✅ Progress indicator initialized');
    } else {
      console.warn('⚠️ Progress indicator container not found');
    }
  }

  /**
   * 創建進度指示器容器
   */
  createProgressIndicatorContainer() {
    // 檢查是否已存在
    let container = document.getElementById('progress-indicator-container');
    if (container) {
      return; // 已存在，不重複創建
    }

    // 創建容器
    container = document.createElement('div');
    container.id = 'progress-indicator-container';
    container.className = 'progress-indicator-wrapper';

    // 添加到 body
    document.body.appendChild(container);
    console.log('✅ Progress indicator container created');
  }

  /**
   * 初始化快捷鍵導航
   */
  async initKeyboardNavigation() {
    console.log('⌨️ Initializing keyboard navigation...');

    // 創建快捷鍵導航容器
    this.createKeyboardNavigationContainer();

    // 創建快捷鍵導航組件
    this.keyboardNav = new KeyboardNavigation({
      enabled: true,
      showVisualFeedback: true,
      enableSounds: false,
      helpPanelPosition: 'center'
    });

    // 渲染快捷鍵導航
    const container = document.getElementById('keyboard-navigation-container');
    if (container) {
      const html = await this.keyboardNav.render();
      container.innerHTML = html;
      await this.keyboardNav.init();
      console.log('✅ Keyboard navigation initialized');
    } else {
      console.warn('⚠️ Keyboard navigation container not found');
    }
  }

  /**
   * 創建快捷鍵導航容器
   */
  createKeyboardNavigationContainer() {
    // 檢查是否已存在
    let container = document.getElementById('keyboard-navigation-container');
    if (container) {
      return; // 已存在，不重複創建
    }

    // 創建容器
    container = document.createElement('div');
    container.id = 'keyboard-navigation-container';
    container.className = 'keyboard-navigation-wrapper';

    // 添加到 body
    document.body.appendChild(container);
    console.log('✅ Keyboard navigation container created');
  }

  /**
   * 創建麵包屑容器
   */
  createBreadcrumbContainer() {
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) {
      console.warn('⚠️ Main container not found');
      return;
    }

    // 檢查是否已存在
    let breadcrumbContainer = document.getElementById('breadcrumb-container');
    if (breadcrumbContainer) {
      return; // 已存在，不重複創建
    }

    // 創建麵包屑容器
    breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.id = 'breadcrumb-container';
    breadcrumbContainer.className = 'breadcrumb-container-wrapper';

    // 插入到導航和內容之間
    const navigation = document.getElementById('navigation');
    const pageContent = document.getElementById('page-content');

    if (navigation && pageContent) {
      mainContainer.insertBefore(breadcrumbContainer, pageContent);
      console.log('✅ Breadcrumb container created and positioned');
    } else {
      console.warn('⚠️ Navigation or page content not found');
    }
  }

  /**
   * 綁定路由事件
   */
  bindRouteEvents() {
    // 監聽 hash 變化
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });

    // 初始路由處理
    this.handleRouteChange();
  }

  /**
   * 處理路由變化
   */
  handleRouteChange() {
    const newPath = window.location.hash.slice(1) || '/';

    if (newPath !== this.currentPage) {
      console.log(`🛣️ Route changed: ${this.currentPage} → ${newPath}`);

      // 更新歷史記錄
      this.updateNavigationHistory(newPath);

      // 更新當前頁面
      this.currentPage = newPath;

      // 更新麵包屑導航
      if (this.breadcrumbNav) {
        this.breadcrumbNav.handleRouteChange();
      }

      // 更新進度指示器
      if (this.progressIndicator) {
        this.progressIndicator.handleRouteChange();
      }

      // 發送導航事件
      this.emitNavigationEvent('route-changed', {
        from: this.navigationHistory[this.navigationHistory.length - 2],
        to: newPath,
        history: this.navigationHistory
      });
    }
  }

  /**
   * 更新導航歷史
   */
  updateNavigationHistory(path) {
    // 添加到歷史記錄
    this.navigationHistory.push(path);

    // 限制歷史記錄長度
    if (this.navigationHistory.length > 20) {
      this.navigationHistory = this.navigationHistory.slice(-20);
    }
  }

  /**
   * 發送導航事件
   */
  emitNavigationEvent(eventName, data) {
    if (typeof window !== 'undefined' && window.CustomEvent) {
      const event = new window.CustomEvent(`navigation:${eventName}`, {
        detail: data
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * 獲取當前路徑
   */
  getCurrentPath() {
    return this.currentPage;
  }

  /**
   * 獲取導航歷史
   */
  getNavigationHistory() {
    return [...this.navigationHistory];
  }

  /**
   * 清除導航歷史
   */
  clearNavigationHistory() {
    this.navigationHistory = [];
    console.log('🗑️ Navigation history cleared');
  }

  /**
   * 導航到指定路徑
   */
  navigateTo(path) {
    if (path !== this.currentPage) {
      window.location.hash = path;
    }
  }

  /**
   * 返回上一頁
   */
  goBack() {
    if (this.navigationHistory.length > 1) {
      // 移除當前頁面
      this.navigationHistory.pop();
      // 獲取上一頁
      const previousPage = this.navigationHistory[this.navigationHistory.length - 1];
      this.navigateTo(previousPage || '/');
    } else {
      this.navigateTo('/');
    }
  }

  /**
   * 顯示/隱藏麵包屑導航
   */
  setBreadcrumbVisibility(visible) {
    if (this.breadcrumbNav) {
      this.breadcrumbNav.setVisibility(visible);
    }
  }

  /**
   * 更新麵包屑路由標題
   */
  updateBreadcrumbTitles(newTitles) {
    if (this.breadcrumbNav) {
      this.breadcrumbNav.updateRouteTitles(newTitles);
    }
  }

  /**
   * 獲取麵包屑數據
   */
  getCurrentBreadcrumbs() {
    if (this.breadcrumbNav) {
      return this.breadcrumbNav.getCurrentBreadcrumbs();
    }
    return [];
  }

  /**
   * 檢查是否已初始化
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * 銷毀導航管理器
   */
  destroy() {
    console.log('🔥 NavigationManager - Destroying...');

    // 銷毀麵包屑導航
    if (this.breadcrumbNav) {
      this.breadcrumbNav.destroy();
      this.breadcrumbNav = null;
    }

    // 銷毀進度指示器
    if (this.progressIndicator) {
      this.progressIndicator.destroy();
      this.progressIndicator = null;
    }

    // 銷毀快捷鍵導航
    if (this.keyboardNav) {
      this.keyboardNav.destroy();
      this.keyboardNav = null;
    }

    // 移除事件監聽
    window.removeEventListener('hashchange', this.handleRouteChange);

    // 清理狀態
    this.currentPage = null;
    this.navigationHistory = [];
    this.isInitialized = false;

    console.log('✅ NavigationManager - Destroyed');
  }
}

// 創建全域實例
let navigationManagerInstance = null;

/**
 * 獲取全域導航管理器實例
 */
export function getNavigationManager() {
  if (!navigationManagerInstance) {
    navigationManagerInstance = new NavigationManager();
  }
  return navigationManagerInstance;
}

/**
 * 初始化全域導航管理器
 */
export async function initializeGlobalNavigation() {
  const manager = getNavigationManager();
  if (!manager.isReady()) {
    await manager.init();
  }
  return manager;
}