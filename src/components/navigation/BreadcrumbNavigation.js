/**
 * 麵包屑導航組件
 * Step 3.5.3 階段1: 遊戲化麵包屑導航系統
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class BreadcrumbNavigation extends BaseComponent {
  constructor(options = {}) {
    super(options);

    // 路由標題映射 (遊戲風格命名)
    this.routeTitles = {
      '/': { name: '主城區', icon: '🏰', description: '冒險的起點' },
      '/about': { name: '角色檔案', icon: '👤', description: '查看角色狀態' },
      '/skills': { name: '技能樹', icon: '🌲', description: '技能發展路徑' },
      '/work-projects': {
        name: '職業任務',
        icon: '💼',
        description: '工作經歷時間軸',
      },
      '/personal-projects': {
        name: '個人收藏',
        icon: '🎴',
        description: '個人專案卡牌',
      },
      '/contact': { name: '聯絡據點', icon: '📮', description: '聯繫方式' },
    };

    // 綁定方法
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      breadcrumbs: [],
      currentPath: window.location.hash.slice(1) || '/',
      isVisible: true,
    };
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      showIcons: true,
      showDescriptions: true,
      maxItems: 4,
      animationEnabled: true,
      style: 'gaming', // gaming, minimal, classic
    };
  }

  /**
   * 渲染麵包屑導航
   */
  async render() {
    // 確保配置已初始化
    if (!this.config) {
      this.config = this.getDefaultConfig();
    }

    const { showIcons, showDescriptions, style } = this.config;
    const { breadcrumbs, isVisible } = this.state;

    if (!isVisible || breadcrumbs.length === 0) {
      return `<nav class="breadcrumb-nav breadcrumb-nav--hidden"></nav>`;
    }

    return `
      <nav class="breadcrumb-nav breadcrumb-nav--${style}"
           role="navigation"
           aria-label="麵包屑導航">
        <div class="breadcrumb-container">

          <!-- 導航路徑 -->
          <ol class="breadcrumb-list">
            ${breadcrumbs
              .map(
                (crumb, index) => `
              <li class="breadcrumb-item ${index === breadcrumbs.length - 1 ? 'breadcrumb-item--current' : ''}"
                  data-index="${index}">

                ${
                  index === breadcrumbs.length - 1
                    ? // 當前頁面 - 不可點擊
                      `<span class="breadcrumb-current" aria-current="page">
                    ${showIcons ? `<span class="breadcrumb-icon">${crumb.icon}</span>` : ''}
                    <span class="breadcrumb-text">${crumb.name}</span>
                    ${showDescriptions ? `<span class="breadcrumb-desc">${crumb.description}</span>` : ''}
                  </span>`
                    : // 可點擊的路徑項目
                      `<a href="#${crumb.path}"
                      class="breadcrumb-link"
                      data-path="${crumb.path}"
                      title="返回 ${crumb.name}">
                    ${showIcons ? `<span class="breadcrumb-icon">${crumb.icon}</span>` : ''}
                    <span class="breadcrumb-text">${crumb.name}</span>
                  </a>`
                }

                <!-- 分隔符 -->
                ${
                  index < breadcrumbs.length - 1
                    ? `
                  <span class="breadcrumb-separator" aria-hidden="true">
                    <svg class="separator-icon" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 2L11.5 8L6.5 14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                `
                    : ''
                }
              </li>
            `
              )
              .join('')}
          </ol>

          <!-- 快速動作按鈕 -->
          <div class="breadcrumb-actions">
            <button class="breadcrumb-action"
                    id="breadcrumb-home"
                    title="返回主城區"
                    aria-label="返回首頁">
              <span class="action-icon">🏠</span>
            </button>

            <button class="breadcrumb-action"
                    id="breadcrumb-back"
                    title="返回上一頁"
                    aria-label="返回上一頁">
              <span class="action-icon">⬅️</span>
            </button>
          </div>

        </div>
      </nav>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();

    // 綁定事件
    this.bindEvents();

    // 監聽路由變化
    window.addEventListener('hashchange', this.handleRouteChange);

    // 初始化麵包屑
    this.updateBreadcrumbs();

    console.log('🍞 BreadcrumbNavigation initialized');
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 綁定麵包屑連結點擊
    document.addEventListener('click', e => {
      const link = e.target.closest('.breadcrumb-link');
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('data-path');
        this.navigateToPath(path);
      }
    });

    // 綁定快速動作按鈕
    const homeBtn = document.getElementById('breadcrumb-home');
    const backBtn = document.getElementById('breadcrumb-back');

    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.navigateToPath('/'));
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => this.goBack());
    }
  }

  /**
   * 處理路由變化
   */
  handleRouteChange() {
    const newPath = window.location.hash.slice(1) || '/';
    this.state.currentPath = newPath;
    this.updateBreadcrumbs();
  }

  /**
   * 更新麵包屑數據
   */
  updateBreadcrumbs() {
    const path = this.state.currentPath;
    const breadcrumbs = this.generateBreadcrumbs(path);

    // 檢查是否需要顯示麵包屑
    const shouldShow = this.shouldShowBreadcrumbs(path);

    this.setState({
      breadcrumbs,
      isVisible: shouldShow,
    });
  }

  /**
   * 生成麵包屑數據
   */
  generateBreadcrumbs(currentPath) {
    const breadcrumbs = [];

    // 始終包含首頁
    if (currentPath !== '/') {
      breadcrumbs.push({
        path: '/',
        name: this.routeTitles['/'].name,
        icon: this.routeTitles['/'].icon,
        description: this.routeTitles['/'].description,
      });
    }

    // 添加當前頁面
    if (this.routeTitles[currentPath]) {
      breadcrumbs.push({
        path: currentPath,
        name: this.routeTitles[currentPath].name,
        icon: this.routeTitles[currentPath].icon,
        description: this.routeTitles[currentPath].description,
      });
    }

    return breadcrumbs;
  }

  /**
   * 判斷是否應該顯示麵包屑
   */
  shouldShowBreadcrumbs(path) {
    // 首頁不顯示麵包屑
    if (path === '/') {
      return false;
    }

    // 其他頁面都顯示
    return true;
  }

  /**
   * 導航到指定路徑
   */
  navigateToPath(path) {
    if (this.config && this.config.animationEnabled) {
      this.playNavigationAnimation();
    }

    // 延遲導航以播放動畫
    setTimeout(
      () => {
        window.location.hash = path;
      },
      this.config && this.config.animationEnabled ? 200 : 0
    );
  }

  /**
   * 返回上一頁
   */
  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateToPath('/');
    }
  }

  /**
   * 播放導航動畫
   */
  playNavigationAnimation() {
    const nav = document.querySelector('.breadcrumb-nav');
    if (nav && window.gsap) {
      // 點擊反饋動畫
      window.gsap.to(nav, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }
  }

  /**
   * 顯示/隱藏麵包屑
   */
  setVisibility(visible) {
    this.setState({ isVisible: visible });
  }

  /**
   * 更新路由標題映射
   */
  updateRouteTitles(newTitles) {
    this.routeTitles = { ...this.routeTitles, ...newTitles };
    this.updateBreadcrumbs();
  }

  /**
   * 獲取當前麵包屑數據
   */
  getCurrentBreadcrumbs() {
    return this.state.breadcrumbs;
  }

  /**
   * 銷毀組件
   */
  destroy() {
    window.removeEventListener('hashchange', this.handleRouteChange);
    super.destroy();
    console.log('🍞 BreadcrumbNavigation destroyed');
  }
}
