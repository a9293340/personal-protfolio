/**
 * 簡單 SPA 路由系統
 * Step 3.1.1b: 基礎路由實現
 * Step 3.5.2: 整合頁面轉場動畫系統
 */

import { PageTransitionManager } from '../../systems/PageTransitionManager.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentComponent = null;
    this.previousRoute = null;
    this.isNavigating = false;
    
    // 初始化頁面轉場管理器
    this.transitionManager = new PageTransitionManager();
    
    // 綁定 this 上下文
    this.handlePopState = this.handlePopState.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    
    // 監聽瀏覽器前進後退
    window.addEventListener('popstate', this.handlePopState);
    
    // 監聽 hash 變化（點擊連結時觸發）
    window.addEventListener('hashchange', this.handleHashChange);
    
    console.log('🛣️ Router initialized with page transitions');
  }
  
  /**
   * 註冊路由
   * @param {string} path - 路由路徑
   * @param {Function} component - 組件函數
   * @param {Object} options - 選項
   */
  register(path, component, options = {}) {
    this.routes.set(path, {
      component,
      title: options.title || 'Gaming Portfolio',
      meta: options.meta || {}
    });
    
    console.log(`📝 Route registered: ${path}`);
  }
  
  /**
   * 導航到指定路由
   * @param {string} path - 目標路徑
   * @param {boolean} pushState - 是否推送歷史記錄
   * @param {Object} options - 導航選項
   */
  async navigate(path, pushState = true, options = {}) {
    try {
      console.log(`🧭 Navigating to: ${path}`);
      
      // 防止重複導航到相同路徑
      if (path === this.currentRoute && !options.forceReload) {
        console.log('📍 Already on this route, skipping navigation');
        return;
      }
      
      // 檢查是否正在轉場中或導航中
      if (this.transitionManager.isInTransition() || this.isNavigating) {
        console.warn('⚠️ Navigation blocked - transition or navigation in progress');
        return;
      }
      
      // 標記開始導航，防止併發導航
      this.isNavigating = true;
      
      // 檢查路由是否存在
      let route = this.routes.get(path);
      if (!route) {
        console.warn(`⚠️ Route not found: ${path}`);
        // 導航到 404 或首頁
        path = '/';
        route = this.routes.get('/');
        if (!route) {
          throw new Error('No fallback route defined');
        }
      }
      
      // 推送歷史記錄
      if (pushState && path !== this.currentRoute) {
        window.history.pushState({ path }, '', `#${path}`);
      }
      
      // 更新頁面標題
      document.title = route.title;
      
      // 決定轉場類型
      const transitionType = this.transitionManager.getTransitionTypeForRoute(
        this.currentRoute, 
        path
      );
      
      // 記錄路由變化
      this.previousRoute = this.currentRoute;
      
      // 暫時禁用轉場動畫，使用原始渲染方式確保穩定性
      await this.renderComponent(route.component, path);
      
      // 更新當前路由
      this.currentRoute = path;
      
      console.log(`✅ Navigation complete: ${path}`);
      
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      
      // 如果轉場動畫失敗，降級使用原始渲染方式
      console.warn('🔄 Falling back to simple rendering due to transition error');
      try {
        const fallbackRoute = this.routes.get(path) || this.routes.get('/');
        if (fallbackRoute) {
          await this.renderComponent(fallbackRoute.component, path);
          this.currentRoute = path;
          console.log(`✅ Navigation complete (fallback): ${path}`);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback navigation also failed:', fallbackError);
        this.showError(`Navigation failed: ${error.message}`);
      }
    } finally {
      // 無論成功或失敗，都清除導航標誌
      this.isNavigating = false;
    }
  }
  
  /**
   * 使用轉場動畫渲染組件
   * @param {Function} ComponentClass - 組件類別
   * @param {string} path - 當前路徑
   * @param {Object} transitionOptions - 轉場選項
   */
  async renderComponentWithTransition(ComponentClass, path, transitionOptions = {}) {
    console.log(`🎬 Rendering component with transition: ${path}`);
    console.log(`📦 Component class:`, ComponentClass.name);
    console.log(`✨ Transition options:`, transitionOptions);
    
    const container = document.getElementById('page-content');
    if (!container) {
      throw new Error('Page content container not found');
    }
    
    // 使用轉場管理器執行轉場動畫
    await this.transitionManager.executeTransition(
      container,
      () => this.renderComponentContent(ComponentClass, path),
      transitionOptions
    );
  }
  
  /**
   * 渲染組件內容（不含轉場動畫）
   * @param {Function} ComponentClass - 組件類別
   * @param {string} path - 當前路徑
   */
  async renderComponentContent(ComponentClass, path) {
    console.log(`🎨 Rendering component content for path: ${path}`);
    
    const container = document.getElementById('page-content');
    if (!container) {
      throw new Error('Page content container not found');
    }
    
    // 清理舊組件
    if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
      console.log(`🧹 Destroying old component: ${this.currentComponent.constructor.name}`);
      this.currentComponent.destroy();
    }
    
    // 清空容器
    container.innerHTML = '';
    console.log(`🗑️ Container cleared`);
    
    // 創建新組件
    this.currentComponent = new ComponentClass();
    console.log(`🏗️ New component created: ${this.currentComponent.constructor.name}`);
    
    // 渲染組件
    if (typeof this.currentComponent.render === 'function') {
      const html = await this.currentComponent.render();
      container.innerHTML = html;
      console.log(`✏️ Component HTML rendered, length: ${html.length} chars`);
      
      // 執行組件初始化
      if (typeof this.currentComponent.init === 'function') {
        await this.currentComponent.init();
        console.log(`🚀 Component initialized`);
      }
    } else {
      throw new Error('Component must have render method');
    }
  }
  
  /**
   * 渲染組件到頁面（原始方法，作為後備）
   * @param {Function} ComponentClass - 組件類別
   * @param {string} path - 當前路徑
   */
  async renderComponent(ComponentClass, path) {
    console.log(`🎨 Rendering component (fallback): ${path}`);
    return this.renderComponentContent(ComponentClass, path);
  }
  
  /**
   * 處理瀏覽器前進後退
   */
  handlePopState(event) {
    const path = event.state?.path || '/';
    console.log(`⬅️ Pop state: ${path}`);
    this.navigate(path, false);
  }
  
  /**
   * 處理 hash 變化（點擊連結時）
   */
  handleHashChange(event) {
    const hash = window.location.hash.slice(1) || '/';
    console.log(`#️⃣ Hash changed to: ${hash}`);
    
    // 避免重複導航到相同路徑
    if (hash !== this.currentRoute) {
      this.navigate(hash, false);
    }
  }
  
  /**
   * 啟動路由系統
   */
  start() {
    // 獲取當前 hash 路徑
    const hash = window.location.hash.slice(1) || '/';
    console.log(`🚀 Starting router with path: ${hash}`);
    
    // 導航到當前路徑
    this.navigate(hash, false);
  }
  
  /**
   * 顯示錯誤頁面
   */
  showError(message) {
    const container = document.getElementById('page-content');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #ff4757;">
          <h2>⚠️ 路由錯誤</h2>
          <p>${message}</p>
          <button onclick="window.location.hash = '#/'" 
                  style="background: #d4af37; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">
            返回首頁
          </button>
        </div>
      `;
    }
  }
  
  /**
   * 銷毀路由器
   */
  destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('hashchange', this.handleHashChange);
    
    if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
      this.currentComponent.destroy();
    }
    
    // 銷毀轉場管理器
    if (this.transitionManager) {
      this.transitionManager.destroy();
    }
    
    console.log('🔥 Router destroyed');
  }
}