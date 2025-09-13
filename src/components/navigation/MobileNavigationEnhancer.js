/**
 * 行動裝置導航增強器
 * Step 3.5.3 階段4: 行動裝置導航體驗優化
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class MobileNavigationEnhancer extends BaseComponent {
  constructor(options = {}) {
    super(options);

    this.state = {
      isMobile: false,
      isTablet: false,
      orientation: 'portrait',
      touchDevice: false,
      swipeThreshold: 50,
      currentGesture: null,
      gestureStartX: 0,
      gestureStartY: 0,
      isBottomNavVisible: false,
      currentPage: 0,
      totalPages: 6
    };

    // 頁面映射（用於手勢導航）
    this.pageRoutes = [
      { path: '/', name: '主城', icon: '🏰' },
      { path: '/about', name: '角色', icon: '👤' },
      { path: '/skills', name: '技能', icon: '🌲' },
      { path: '/work-projects', name: '任務', icon: '💼' },
      { path: '/personal-projects', name: '作品', icon: '🎴' },
      { path: '/contact', name: '聯絡', icon: '📮' }
    ];

    // 綁定方法
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      enableSwipeNavigation: true,
      enableBottomNavigation: true,
      enableHapticFeedback: true,
      swipeThreshold: 50,
      swipeVelocityThreshold: 0.3,
      bottomNavAutoHide: true,
      adaptiveInterface: true
    };
  }

  /**
   * 渲染行動裝置導航增強器
   */
  async render() {
    const { isBottomNavVisible, currentPage } = this.state;
    const { enableBottomNavigation } = this.config;

    return `
      <div class="mobile-navigation-enhancer ${this.state.isMobile ? 'mobile-nav--mobile' : ''}"
           data-device-type="${this.getDeviceType()}">

        <!-- 手勢導航指示器 -->
        <div class="gesture-navigation-indicator" id="gesture-indicator">
          <div class="gesture-hint gesture-hint--left">
            <span class="gesture-icon">←</span>
            <span class="gesture-text">上一頁</span>
          </div>
          <div class="gesture-hint gesture-hint--right">
            <span class="gesture-icon">→</span>
            <span class="gesture-text">下一頁</span>
          </div>
        </div>

        <!-- 底部導航欄 (僅移動端) -->
        ${enableBottomNavigation && this.state.isMobile ? `
          <nav class="mobile-bottom-navigation ${isBottomNavVisible ? 'bottom-nav--visible' : ''}"
               id="mobile-bottom-nav"
               role="navigation"
               aria-label="移動端底部導航">

            <div class="bottom-nav-container">
              ${this.pageRoutes.map((route, index) => `
                <a href="#${route.path}"
                   class="bottom-nav-item ${index === currentPage ? 'bottom-nav-item--active' : ''}"
                   data-page-index="${index}"
                   data-path="${route.path}"
                   aria-label="前往${route.name}">

                  <div class="nav-item-container">
                    <span class="nav-item-icon">${route.icon}</span>
                    <span class="nav-item-label">${route.name}</span>

                    <!-- 活躍指示器 -->
                    ${index === currentPage ? `
                      <div class="nav-item-indicator"></div>
                    ` : ''}
                  </div>
                </a>
              `).join('')}
            </div>

            <!-- 底部導航控制 -->
            <div class="bottom-nav-controls">
              <button class="nav-control-btn"
                      id="bottom-nav-hide"
                      aria-label="隱藏底部導航"
                      title="隱藏導航欄">
                <span class="control-icon">↓</span>
              </button>
            </div>

          </nav>
        ` : ''}

        <!-- 浮動導航按鈕 (導航隱藏時顯示) -->
        <button class="floating-nav-toggle ${!isBottomNavVisible ? 'floating-nav--visible' : ''}"
                id="floating-nav-toggle"
                aria-label="顯示導航選單"
                title="點擊顯示導航">
          <span class="floating-icon">🧭</span>
        </button>

        <!-- 手勢反饋覆蓋層 -->
        <div class="gesture-feedback-overlay" id="gesture-feedback"></div>

        <!-- 設備適配狀態指示 -->
        <div class="device-adaptation-status" id="device-status">
          <div class="status-info">
            <span class="device-type">${this.getDeviceTypeDisplay()}</span>
            <span class="orientation">${this.state.orientation}</span>
            ${this.state.touchDevice ? '<span class="touch-indicator">👆</span>' : ''}
          </div>
        </div>

      </div>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();

    // 檢測設備類型
    this.detectDeviceType();

    // 綁定事件
    this.bindEvents();

    // 初始化手勢導航
    if (this.config.enableSwipeNavigation) {
      this.initSwipeNavigation();
    }

    // 初始化底部導航
    if (this.config.enableBottomNavigation) {
      this.initBottomNavigation();
    }

    // 監聽方向變化
    window.addEventListener('orientationchange', this.handleOrientationChange);
    window.addEventListener('resize', this.handleResize);

    // 初始狀態更新
    this.updateNavigationState();

    console.log('📱 MobileNavigationEnhancer initialized');
  }

  /**
   * 檢測設備類型
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 檢測觸控設備
    this.state.touchDevice = 'ontouchstart' in window ||
                             navigator.maxTouchPoints > 0 ||
                             navigator.msMaxTouchPoints > 0;

    // 檢測移動設備
    this.state.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                          screenWidth <= 768;

    // 檢測平板
    this.state.isTablet = screenWidth > 768 && screenWidth <= 1024 && this.state.touchDevice;

    // 檢測方向
    this.state.orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

    console.log('📱 Device detected:', {
      isMobile: this.state.isMobile,
      isTablet: this.state.isTablet,
      touchDevice: this.state.touchDevice,
      orientation: this.state.orientation
    });
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 底部導航事件
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.bottom-nav-item');
      const hideBtn = e.target.closest('#bottom-nav-hide');
      const showBtn = e.target.closest('#floating-nav-toggle');

      if (navItem) {
        this.handleBottomNavClick(navItem);
      }

      if (hideBtn) {
        this.hideBottomNavigation();
      }

      if (showBtn) {
        this.showBottomNavigation();
      }
    });

    // 滾動事件 (自動隱藏底部導航)
    if (this.config.bottomNavAutoHide) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  /**
   * 初始化滑動導航
   */
  initSwipeNavigation() {
    if (!this.state.touchDevice) return;

    // 綁定觸控事件
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    console.log('📱 Swipe navigation initialized');
  }

  /**
   * 初始化底部導航
   */
  initBottomNavigation() {
    if (!this.state.isMobile) return;

    // 顯示底部導航
    this.setState({ isBottomNavVisible: true });

    console.log('📱 Bottom navigation initialized');
  }

  /**
   * 處理觸控開始
   */
  handleTouchStart(event) {
    if (!this.config.enableSwipeNavigation) return;

    const touch = event.touches[0];
    this.state.gestureStartX = touch.clientX;
    this.state.gestureStartY = touch.clientY;
    this.state.gestureStartTime = Date.now();

    // 顯示手勢指示器
    this.showGestureIndicator();
  }

  /**
   * 處理觸控移動
   */
  handleTouchMove(event) {
    if (!this.config.enableSwipeNavigation || !this.state.gestureStartX) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.state.gestureStartX;
    const deltaY = touch.clientY - this.state.gestureStartY;

    // 判斷是否為水平滑動
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      // 更新手勢反饋
      this.updateGestureFeedback(deltaX);

      // 防止頁面滾動
      if (Math.abs(deltaX) > 50) {
        event.preventDefault();
      }
    }
  }

  /**
   * 處理觸控結束
   */
  handleTouchEnd(event) {
    if (!this.config.enableSwipeNavigation || !this.state.gestureStartX) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.state.gestureStartX;
    const deltaY = touch.clientY - this.state.gestureStartY;
    const deltaTime = Date.now() - this.state.gestureStartTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    // 隱藏手勢指示器
    this.hideGestureIndicator();

    // 判斷滑動手勢
    if (Math.abs(deltaX) > Math.abs(deltaY) &&
        (Math.abs(deltaX) > this.config.swipeThreshold || velocity > this.config.swipeVelocityThreshold)) {

      if (deltaX > 0) {
        // 向右滑動 - 上一頁
        this.navigateToPreviousPage();
      } else {
        // 向左滑動 - 下一頁
        this.navigateToNextPage();
      }

      // 觸覺回饋
      this.triggerHapticFeedback();
    }

    // 重置手勢狀態
    this.resetGestureState();
  }

  /**
   * 處理方向變化
   */
  handleOrientationChange() {
    setTimeout(() => {
      this.detectDeviceType();
      this.updateNavigationState();
    }, 100);
  }

  /**
   * 處理視窗大小變化
   */
  handleResize() {
    this.detectDeviceType();
    this.updateNavigationState();
  }

  /**
   * 處理頁面滾動
   */
  handleScroll() {
    if (!this.config.bottomNavAutoHide || !this.state.isMobile) return;

    const scrollY = window.scrollY;
    const scrollThreshold = 100;

    if (scrollY > scrollThreshold && this.state.isBottomNavVisible) {
      this.hideBottomNavigation();
    } else if (scrollY <= scrollThreshold && !this.state.isBottomNavVisible) {
      this.showBottomNavigation();
    }
  }

  /**
   * 導航到上一頁
   */
  navigateToPreviousPage() {
    const currentIndex = this.getCurrentPageIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.pageRoutes.length - 1;
    const previousPage = this.pageRoutes[previousIndex];

    this.navigateToPage(previousPage.path);
    this.showSwipeSuccessFeedback('left');
  }

  /**
   * 導航到下一頁
   */
  navigateToNextPage() {
    const currentIndex = this.getCurrentPageIndex();
    const nextIndex = currentIndex < this.pageRoutes.length - 1 ? currentIndex + 1 : 0;
    const nextPage = this.pageRoutes[nextIndex];

    this.navigateToPage(nextPage.path);
    this.showSwipeSuccessFeedback('right');
  }

  /**
   * 導航到指定頁面
   */
  navigateToPage(path) {
    window.location.hash = path;
    this.updateCurrentPageIndex();
  }

  /**
   * 獲取當前頁面索引
   */
  getCurrentPageIndex() {
    const currentPath = window.location.hash.slice(1) || '/';
    return this.pageRoutes.findIndex(route => route.path === currentPath);
  }

  /**
   * 更新當前頁面索引
   */
  updateCurrentPageIndex() {
    const currentIndex = this.getCurrentPageIndex();
    this.setState({ currentPage: Math.max(0, currentIndex) });
  }

  /**
   * 更新導航狀態
   */
  updateNavigationState() {
    this.updateCurrentPageIndex();

    // 根據設備類型調整界面
    if (this.config.adaptiveInterface) {
      this.adaptInterfaceToDevice();
    }
  }

  /**
   * 適配界面到設備
   */
  adaptInterfaceToDevice() {
    const body = document.body;

    // 移除舊的設備類別
    body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
    body.classList.remove('orientation-portrait', 'orientation-landscape');
    body.classList.remove('touch-device', 'no-touch');

    // 添加新的設備類別
    body.classList.add(`device-${this.getDeviceType()}`);
    body.classList.add(`orientation-${this.state.orientation}`);
    body.classList.add(this.state.touchDevice ? 'touch-device' : 'no-touch');
  }

  /**
   * 獲取設備類型
   */
  getDeviceType() {
    if (this.state.isMobile) return 'mobile';
    if (this.state.isTablet) return 'tablet';
    return 'desktop';
  }

  /**
   * 獲取設備類型顯示名稱
   */
  getDeviceTypeDisplay() {
    const types = {
      mobile: '📱 手機',
      tablet: '📱 平板',
      desktop: '💻 桌機'
    };
    return types[this.getDeviceType()] || '🖥️ 未知';
  }

  /**
   * 顯示手勢指示器
   */
  showGestureIndicator() {
    const indicator = document.getElementById('gesture-indicator');
    if (indicator) {
      indicator.classList.add('gesture-indicator--active');
    }
  }

  /**
   * 隱藏手勢指示器
   */
  hideGestureIndicator() {
    const indicator = document.getElementById('gesture-indicator');
    if (indicator) {
      indicator.classList.remove('gesture-indicator--active');
    }
  }

  /**
   * 更新手勢反饋
   */
  updateGestureFeedback(deltaX) {
    const feedback = document.getElementById('gesture-feedback');
    if (!feedback) return;

    const direction = deltaX > 0 ? 'right' : 'left';
    const progress = Math.min(Math.abs(deltaX) / this.config.swipeThreshold, 1);

    feedback.className = `gesture-feedback-overlay gesture-feedback--${direction}`;
    feedback.style.opacity = progress * 0.3;
  }

  /**
   * 顯示滑動成功反饋
   */
  showSwipeSuccessFeedback(direction) {
    const feedback = document.getElementById('gesture-feedback');
    if (!feedback) return;

    feedback.className = `gesture-feedback-overlay gesture-feedback--success gesture-feedback--${direction}`;
    feedback.style.opacity = 0.6;

    setTimeout(() => {
      feedback.style.opacity = 0;
      feedback.className = 'gesture-feedback-overlay';
    }, 300);
  }

  /**
   * 重置手勢狀態
   */
  resetGestureState() {
    this.state.gestureStartX = 0;
    this.state.gestureStartY = 0;
    this.state.gestureStartTime = 0;
    this.state.currentGesture = null;

    // 清除反饋
    const feedback = document.getElementById('gesture-feedback');
    if (feedback) {
      feedback.style.opacity = 0;
      feedback.className = 'gesture-feedback-overlay';
    }
  }

  /**
   * 處理底部導航點擊
   */
  handleBottomNavClick(navItem) {
    const path = navItem.getAttribute('data-path');
    const pageIndex = parseInt(navItem.getAttribute('data-page-index'));

    this.navigateToPage(path);
    this.setState({ currentPage: pageIndex });

    // 觸覺回饋
    this.triggerHapticFeedback('light');
  }

  /**
   * 顯示底部導航
   */
  showBottomNavigation() {
    this.setState({ isBottomNavVisible: true });
  }

  /**
   * 隱藏底部導航
   */
  hideBottomNavigation() {
    this.setState({ isBottomNavVisible: false });
  }

  /**
   * 觸發觸覺回饋
   */
  triggerHapticFeedback(type = 'medium') {
    if (!this.config.enableHapticFeedback || !navigator.vibrate) return;

    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50
    };

    navigator.vibrate(patterns[type] || patterns.medium);
  }

  /**
   * 設置手勢導航啟用狀態
   */
  setSwipeNavigationEnabled(enabled) {
    this.config.enableSwipeNavigation = enabled;

    if (enabled) {
      this.initSwipeNavigation();
    } else {
      document.removeEventListener('touchstart', this.handleTouchStart);
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchend', this.handleTouchEnd);
    }
  }

  /**
   * 設置底部導航啟用狀態
   */
  setBottomNavigationEnabled(enabled) {
    this.config.enableBottomNavigation = enabled;

    if (enabled && this.state.isMobile) {
      this.initBottomNavigation();
    } else {
      this.setState({ isBottomNavVisible: false });
    }
  }

  /**
   * 獲取導航統計
   */
  getNavigationStats() {
    return {
      deviceType: this.getDeviceType(),
      isMobile: this.state.isMobile,
      isTablet: this.state.isTablet,
      touchDevice: this.state.touchDevice,
      orientation: this.state.orientation,
      currentPage: this.state.currentPage,
      totalPages: this.state.totalPages,
      swipeEnabled: this.config.enableSwipeNavigation,
      bottomNavEnabled: this.config.enableBottomNavigation
    };
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 移除事件監聽
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);

    // 清理樣式類別
    document.body.classList.remove(
      'device-mobile', 'device-tablet', 'device-desktop',
      'orientation-portrait', 'orientation-landscape',
      'touch-device', 'no-touch'
    );

    super.destroy();
    console.log('📱 MobileNavigationEnhancer destroyed');
  }
}