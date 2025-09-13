/**
 * NavBar 導航組件
 * Step 3.1.2: 遊戲風格導航系統
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import { getNavigationItems } from '../../config/routes.config.js';

export class NavBar extends BaseComponent {
  constructor(options = {}) {
    super(options);

    // 導航狀態
    this.state = {
      isMenuOpen: false,
      currentPath: window.location.hash.slice(1) || '/',
      scrolled: false,
    };

    // 綁定方法
    this.handleScroll = this.handleScroll.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  /**
   * 渲染導航 HTML
   */
  async render() {
    const navItems = getNavigationItems();
    const { currentPath, isMenuOpen } = this.state;

    console.log('🧭 NavBar render - navItems:', navItems);
    console.log('🧭 NavBar render - currentPath:', currentPath);
    console.log('🧭 NavBar render - isMenuOpen:', isMenuOpen);

    return `
      <nav class="navbar" id="navbar">
        <div class="navbar-container">
          
          <!-- Logo / Brand -->
          <div class="navbar-brand">
            <a href="#/" class="brand-link">
              <span class="brand-icon">🎮</span>
              <span class="brand-text">Gaming Portfolio</span>
            </a>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="navbar-menu desktop-menu">
            <a href="#/" class="nav-item ${currentPath === '/' ? 'active' : ''}" data-path="/">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">首頁</span>
            </a>
            ${navItems
              .map(
                item => `
              <a href="#${item.path}" 
                 class="nav-item ${currentPath === item.path ? 'active' : ''}" 
                 data-path="${item.path}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.name}</span>
              </a>
            `
              )
              .join('')}
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          
        </div>
        
        <!-- Mobile Navigation Menu -->
        <div class="mobile-menu ${isMenuOpen ? 'open' : ''}" id="mobile-menu">
          <div class="mobile-menu-content">
            <a href="#/" class="mobile-nav-item ${currentPath === '/' ? 'active' : ''}" data-path="/">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">首頁</span>
            </a>
            ${navItems
              .map(
                item => `
              <a href="#${item.path}" 
                 class="mobile-nav-item ${currentPath === item.path ? 'active' : ''}" 
                 data-path="${item.path}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.name}</span>
              </a>
            `
              )
              .join('')}
          </div>
        </div>
      </nav>
    `;
  }

  /**
   * 初始化導航
   */
  async init() {
    await super.init();

    // 綁定事件
    this.bindNavEvents();

    // 監聽滾動
    window.addEventListener('scroll', this.handleScroll);

    // 監聽路由變化
    window.addEventListener('hashchange', this.handleHashChange);

    // 初始滾動檢查
    this.handleScroll();

    console.log('🧭 NavBar initialized');
  }

  /**
   * 綁定導航事件
   */
  bindNavEvents() {
    // 綁定漢堡菜單點擊
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', this.toggleMenu);
    }

    // 綁定導航項目點擊
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', _e => {
        // 關閉移動菜單
        if (this.state.isMenuOpen) {
          this.toggleMenu();
        }

        // 更新當前路徑
        const path = item.getAttribute('data-path');
        this.updateActiveState(path);
      });
    });

    // 點擊外部關閉移動菜單
    document.addEventListener('click', e => {
      const navbar = document.getElementById('navbar');
      if (this.state.isMenuOpen && navbar && !navbar.contains(e.target)) {
        this.toggleMenu();
      }
    });
  }

  /**
   * 切換移動菜單
   */
  toggleMenu() {
    this.state.isMenuOpen = !this.state.isMenuOpen;

    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');

    if (mobileMenu) {
      if (this.state.isMenuOpen) {
        mobileMenu.classList.add('open');
        menuToggle?.classList.add('active');
      } else {
        mobileMenu.classList.remove('open');
        menuToggle?.classList.remove('active');
      }
    }

    console.log('📱 Menu toggled:', this.state.isMenuOpen);
  }

  /**
   * 處理滾動事件
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.getElementById('navbar');

    if (scrollTop > 50) {
      if (!this.state.scrolled) {
        this.state.scrolled = true;
        navbar?.classList.add('scrolled');
      }
    } else {
      if (this.state.scrolled) {
        this.state.scrolled = false;
        navbar?.classList.remove('scrolled');
      }
    }
  }

  /**
   * 處理路由變化
   */
  handleHashChange() {
    const newPath = window.location.hash.slice(1) || '/';
    this.updateActiveState(newPath);
  }

  /**
   * 更新激活狀態
   */
  updateActiveState(path) {
    this.state.currentPath = path;

    // 更新所有導航項目的激活狀態
    const allItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    allItems.forEach(item => {
      const itemPath = item.getAttribute('data-path');
      if (itemPath === path) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 移除事件監聽
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('hashchange', this.handleHashChange);

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.removeEventListener('click', this.toggleMenu);
    }

    super.destroy();
    console.log('🧭 NavBar destroyed');
  }
}
