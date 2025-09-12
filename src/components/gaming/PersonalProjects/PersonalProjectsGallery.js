/**
 * PersonalProjectsGallery.js - 個人專案卡牌展示畫廊
 * 
 * 功能特色：
 * - 遊戲王風格卡牌網格佈局
 * - 稀有度驅動的視覺差異化
 * - 響應式卡牌排列（桌面多列、移動端適配）
 * - 分類篩選和排序系統
 * - 點擊觸發召喚動畫
 * - 跨設備優化體驗
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';
import { PersonalProjectCard } from './PersonalProjectCard.js';
import { SummoningTransition } from '../SummoningSystem/SummoningTransition.js';
import { PersonalProjectModal } from './PersonalProjectModal.js';

export class PersonalProjectsGallery extends BaseComponent {
  constructor(config = {}) {
    super();
    
    // 直接合併配置，避免 mergeConfig 的 this.options 覆蓋問題
    this.config = {
      ...this.getDefaultConfig(),
      ...config
    };
    this.state = { ...this.getInitialState() };
    
    // 組件實例
    this.projectCards = new Map();
    this.summoningTransition = null;
    this.projectModal = null;
    
    // DOM 元素
    this.element = null;
    this.galleryGrid = null;
    this.filterControls = null;
    this.sortControls = null;
    
    // 數據
    this.projectsData = [];
    this.filteredProjects = [];
    
    console.log('🎴 [PersonalProjectsGallery] 個人專案畫廊初始化');
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      container: null,
      layout: {
        columns: {
          desktop: 4,    // 桌面端 4 列
          tablet: 3,     // 平板端 3 列
          mobile: 2      // 移動端 2 列
        },
        gap: '20px',
        cardAspectRatio: 1.4  // 卡牌長寬比 (高/寬)
      },
      filters: {
        enabled: true,
        categories: ['all', 'frontend', 'backend', 'fullstack', 'mobile', 'ai', 'blockchain'],
        rarities: ['all', 'normal', 'rare', 'superRare', 'legendary'],
        status: ['all', 'completed', 'inProgress', 'archived']
      },
      sorting: {
        enabled: true,
        options: [
          { key: 'date', label: '完成時間', order: 'desc' },
          { key: 'rarity', label: '稀有度', order: 'desc' },
          { key: 'importance', label: '重要性', order: 'desc' },
          { key: 'name', label: '專案名稱', order: 'asc' }
        ],
        default: 'date'
      },
      summoning: {
        enabled: true,
        triggerOnClick: true,
        legendaryOnly: false  // 是否只對傳說級專案啟用召喚
      },
      animation: {
        cardHover: {
          duration: 0.3,
          scale: 1.05,
          tiltAngle: 5
        },
        gridTransition: {
          duration: 0.5,
          stagger: 0.1
        }
      }
    };
  }
  
  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      currentFilter: {
        category: 'all',
        rarity: 'all', 
        status: 'all'
      },
      currentSort: 'date',
      isLoading: false,
      selectedProject: null,
      isAnimating: false
    };
  }
  
  /**
   * 初始化組件
   */
  async init() {
    console.log('🎴 [PersonalProjectsGallery] 開始初始化');
    
    try {
      // 載入專案數據
      await this.loadProjectsData();
      
      // 創建 DOM 結構
      this.createElement();
      
      // 初始化子組件
      await this.initializeComponents();
      
      // 渲染專案卡牌
      this.renderProjects();
      
      // 綁定事件
      this.bindEvents();
      
      console.log('✅ [PersonalProjectsGallery] 初始化完成');
      
    } catch (error) {
      console.error('❌ [PersonalProjectsGallery] 初始化失敗:', error);
      throw error;
    }
  }
  
  /**
   * 載入專案數據
   */
  async loadProjectsData() {
    try {
      // 動態載入個人專案配置數據
      const { personalProjectsData } = await import('../../../config/data/personal-projects.data.js');
      this.projectsData = personalProjectsData;
      this.filteredProjects = [...this.projectsData];
      
      console.log(`📊 [PersonalProjectsGallery] 載入 ${this.projectsData.length} 個個人專案`);
      
    } catch (error) {
      console.warn('⚠️ [PersonalProjectsGallery] 專案數據載入失敗，使用測試數據:', error);
      
      // 使用測試數據
      this.projectsData = this.getTestData();
      this.filteredProjects = [...this.projectsData];
    }
  }
  
  /**
   * 獲取測試數據
   */
  getTestData() {
    return [
      {
        id: 'personal-project-1',
        title: '🌟 AI 聊天助手',
        description: '基於 GPT 的智能對話系統',
        category: 'ai',
        rarity: 'legendary',
        status: 'completed',
        importance: 9,
        completedDate: '2024-08',
        technologies: ['React', 'Node.js', 'OpenAI API', 'WebSocket'],
        cardData: {
          attack: 3000,
          defense: 2500,
          level: 9,
          attribute: 'LIGHT',
          type: 'AI/Effect'
        },
        images: {
          thumbnail: '/images/projects/ai-chat-thumb.jpg',
          screenshots: ['/images/projects/ai-chat-1.jpg', '/images/projects/ai-chat-2.jpg']
        },
        links: {
          demo: 'https://demo.example.com',
          github: 'https://github.com/user/ai-chat',
          article: 'https://blog.example.com/ai-chat'
        }
      },
      {
        id: 'personal-project-2',
        title: '⚡ 區塊鏈錢包',
        description: '多幣種加密貨幣錢包應用',
        category: 'blockchain',
        rarity: 'superRare',
        status: 'completed',
        importance: 8,
        completedDate: '2024-06',
        technologies: ['Vue.js', 'Web3.js', 'Solidity', 'IPFS'],
        cardData: {
          attack: 2800,
          defense: 2200,
          level: 8,
          attribute: 'DARK',
          type: 'Crypto/Fusion'
        },
        images: {
          thumbnail: '/images/projects/wallet-thumb.jpg',
          screenshots: ['/images/projects/wallet-1.jpg', '/images/projects/wallet-2.jpg']
        },
        links: {
          demo: 'https://wallet-demo.example.com',
          github: 'https://github.com/user/crypto-wallet'
        }
      },
      {
        id: 'personal-project-3',
        title: '📱 健身追蹤 App',
        description: 'React Native 健身記錄應用',
        category: 'mobile',
        rarity: 'rare',
        status: 'completed',
        importance: 7,
        completedDate: '2024-03',
        technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
        cardData: {
          attack: 2200,
          defense: 1800,
          level: 7,
          attribute: 'EARTH',
          type: 'Mobile/Effect'
        },
        images: {
          thumbnail: '/images/projects/fitness-thumb.jpg',
          screenshots: ['/images/projects/fitness-1.jpg']
        },
        links: {
          github: 'https://github.com/user/fitness-app',
          store: 'https://apps.apple.com/app/fitness-tracker'
        }
      },
      {
        id: 'personal-project-4',
        title: '🎮 遊戲化個人網站',
        description: '流亡黯道+遊戲王風格作品集',
        category: 'frontend',
        rarity: 'legendary',
        status: 'inProgress',
        importance: 10,
        completedDate: '2024-09',
        technologies: ['JavaScript', 'GSAP', 'Three.js', 'Vite'],
        cardData: {
          attack: 3200,
          defense: 2800,
          level: 10,
          attribute: 'LIGHT',
          type: 'Portfolio/Synchro'
        },
        images: {
          thumbnail: '/images/projects/portfolio-thumb.jpg',
          screenshots: ['/images/projects/portfolio-1.jpg', '/images/projects/portfolio-2.jpg']
        },
        links: {
          demo: 'https://portfolio.example.com',
          github: 'https://github.com/user/portfolio'
        }
      },
      {
        id: 'personal-project-5',
        title: '🛒 電商平台',
        description: 'Full-stack 電子商務解決方案',
        category: 'fullstack',
        rarity: 'rare',
        status: 'completed',
        importance: 6,
        completedDate: '2023-12',
        technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Docker'],
        cardData: {
          attack: 2400,
          defense: 2000,
          level: 6,
          attribute: 'WATER',
          type: 'Commerce/Xyz'
        },
        images: {
          thumbnail: '/images/projects/ecommerce-thumb.jpg',
          screenshots: ['/images/projects/ecommerce-1.jpg']
        },
        links: {
          demo: 'https://shop-demo.example.com',
          github: 'https://github.com/user/ecommerce-platform'
        }
      },
      {
        id: 'personal-project-6',
        title: '📊 數據視覺化儀表板',
        description: 'D3.js 互動式數據分析工具',
        category: 'frontend',
        rarity: 'normal',
        status: 'completed',
        importance: 5,
        completedDate: '2023-08',
        technologies: ['D3.js', 'React', 'Express', 'MongoDB'],
        cardData: {
          attack: 1800,
          defense: 1500,
          level: 5,
          attribute: 'WIND',
          type: 'Data/Effect'
        },
        images: {
          thumbnail: '/images/projects/dashboard-thumb.jpg',
          screenshots: ['/images/projects/dashboard-1.jpg']
        },
        links: {
          demo: 'https://dashboard-demo.example.com',
          github: 'https://github.com/user/data-dashboard'
        }
      }
    ];
  }
  
  /**
   * 創建 DOM 元素
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'personal-projects-gallery';
    
    // 創建結構
    this.element.innerHTML = `
      <div class="gallery-header">
        <h2 class="gallery-title">
          <span class="title-icon">🎴</span>
          <span class="title-text">個人專案卡牌收藏</span>
        </h2>
        <div class="gallery-controls">
          <div class="filter-controls">
            <div class="filter-group">
              <label>類型:</label>
              <select class="filter-select" data-filter="category">
                <option value="all">全部</option>
                <option value="frontend">前端</option>
                <option value="backend">後端</option>
                <option value="fullstack">全端</option>
                <option value="mobile">移動端</option>
                <option value="ai">AI/ML</option>
                <option value="blockchain">區塊鏈</option>
              </select>
            </div>
            <div class="filter-group">
              <label>稀有度:</label>
              <select class="filter-select" data-filter="rarity">
                <option value="all">全部</option>
                <option value="legendary">傳說 ⭐</option>
                <option value="superRare">超稀有 💎</option>
                <option value="rare">稀有 🔸</option>
                <option value="normal">普通</option>
              </select>
            </div>
            <div class="filter-group">
              <label>狀態:</label>
              <select class="filter-select" data-filter="status">
                <option value="all">全部</option>
                <option value="completed">已完成</option>
                <option value="inProgress">進行中</option>
                <option value="archived">已封存</option>
              </select>
            </div>
          </div>
          <div class="sort-controls">
            <label>排序:</label>
            <select class="sort-select">
              <option value="date">完成時間</option>
              <option value="rarity">稀有度</option>
              <option value="importance">重要性</option>
              <option value="name">專案名稱</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="gallery-stats">
        <span class="stats-item">
          <span class="stats-label">總計:</span>
          <span class="stats-value" data-stat="total">-</span>
        </span>
        <span class="stats-item">
          <span class="stats-label">已完成:</span>
          <span class="stats-value" data-stat="completed">-</span>
        </span>
        <span class="stats-item">
          <span class="stats-label">傳說級:</span>
          <span class="stats-value" data-stat="legendary">-</span>
        </span>
      </div>
      
      <div class="gallery-grid" id="projectsGrid">
        <!-- 卡牌將動態插入此處 -->
      </div>
      
      <div class="gallery-empty" style="display: none;">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">沒有找到符合條件的專案</div>
        <button class="empty-reset-btn">重置篩選條件</button>
      </div>
    `;
    
    // 獲取子元素引用
    this.galleryGrid = this.element.querySelector('.gallery-grid');
    this.filterControls = this.element.querySelectorAll('.filter-select');
    this.sortControls = this.element.querySelector('.sort-select');
    
    // 插入到容器
    if (this.config.container) {
      this.config.container.appendChild(this.element);
      console.log('✅ [PersonalProjectsGallery] Element appended to container');
    } else {
      console.error('❌ [PersonalProjectsGallery] No container provided');
    }
  }
  
  /**
   * 初始化子組件
   */
  async initializeComponents() {
    // 初始化召喚轉場系統
    this.summoningTransition = new SummoningTransition({
      animation: {
        skipEnabled: true,
        skipKey: 'Escape'
      }
    });
    
    // 初始化詳情模態框
    this.projectModal = new PersonalProjectModal();
    
    console.log('🔧 [PersonalProjectsGallery] 子組件初始化完成');
  }
  
  /**
   * 渲染專案卡牌
   */
  renderProjects() {
    console.log('🎨 [PersonalProjectsGallery] 開始渲染專案卡牌');
    
    // 清空網格
    this.galleryGrid.innerHTML = '';
    this.projectCards.clear();
    
    // 應用篩選和排序
    this.applyFiltersAndSort();
    
    // 檢查是否有結果
    if (this.filteredProjects.length === 0) {
      this.showEmptyState();
      return;
    }
    
    // 隱藏空狀態
    this.hideEmptyState();
    
    // 創建並渲染卡牌
    this.filteredProjects.forEach((project, index) => {
      this.createProjectCard(project, index);
    });
    
    // 更新統計數據
    this.updateStats();
    
    // 播放進場動畫
    this.playGridAnimation();
    
    console.log(`✅ [PersonalProjectsGallery] 渲染完成，顯示 ${this.filteredProjects.length} 張卡牌`);
  }
  
  /**
   * 創建專案卡牌
   */
  createProjectCard(project, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'project-card-wrapper';
    cardElement.dataset.projectId = project.id;
    cardElement.dataset.index = index;
    
    // 創建卡牌組件
    const projectCard = new PersonalProjectCard({
      project,
      index,
      onClick: (project, element) => this.handleCardClick(project, element)
    });
    
    // 渲染卡牌
    const cardContent = projectCard.render();
    cardElement.appendChild(cardContent);
    
    // 加入網格
    this.galleryGrid.appendChild(cardElement);
    
    // 保存卡牌實例
    this.projectCards.set(project.id, {
      component: projectCard,
      element: cardElement,
      project
    });
  }
  
  /**
   * 處理卡牌點擊
   */
  async handleCardClick(project, cardElement) {
    // 檢查是否為重複點擊同一張卡片
    if (this.state.isAnimating && this.state.selectedProject?.id === project.id) {
      console.log('⏳ [PersonalProjectsGallery] 同一卡片動畫進行中，忽略重複點擊');
      return;
    }
    
    console.log(`🎮 [PersonalProjectsGallery] 卡牌被點擊: ${project.title}`);
    
    this.state.selectedProject = project;
    this.state.isAnimating = true;
    
    // 添加超時保護機制，避免狀態永久鎖定
    const timeoutId = setTimeout(() => {
      if (this.state.isAnimating) {
        console.log('⚠️ [PersonalProjectsGallery] 動畫超時，強制重置狀態');
        this.state.isAnimating = false;
      }
    }, 10000); // 10秒超時保護
    
    // 清理超時定時器
    const cleanupTimeout = () => {
      clearTimeout(timeoutId);
    };
    
    // 檢查是否啟用召喚動畫
    const shouldSummon = this.shouldTriggerSummoning(project);
    
    if (shouldSummon) {
      console.log(`⭐ [PersonalProjectsGallery] 觸發召喚動畫: ${project.title}`);
      
      try {
        // 執行召喚動畫，完成後自動顯示詳情模態框
        await this.summoningTransition.startTransition(project, cardElement);
        
      } catch (error) {
        console.error('❌ [PersonalProjectsGallery] 召喚動畫失敗:', error);
        
        // 降級到直接顯示模態框
        await this.showProjectModal(project);
      }
    } else {
      // 直接顯示詳情模態框
      await this.showProjectModal(project);
    }
    
    // 清理狀態和定時器
    cleanupTimeout();
    this.state.isAnimating = false;
  }
  
  /**
   * 判斷是否應該觸發召喚動畫
   */
  shouldTriggerSummoning(project) {
    if (!this.config.summoning.enabled) {
      return false;
    }
    
    // 只對傳說級專案啟用召喚
    if (this.config.summoning.legendaryOnly) {
      return project.rarity === 'legendary';
    }
    
    // 高重要性或稀有度專案啟用召喚
    return project.rarity === 'legendary' || 
           project.rarity === 'superRare' || 
           project.importance >= 8;
  }
  
  /**
   * 顯示專案詳情模態框
   */
  async showProjectModal(project) {
    console.log(`📋 [PersonalProjectsGallery] 顯示專案詳情: ${project.title}`);
    await this.projectModal.show(project);
  }
  
  /**
   * 應用篩選和排序
   */
  applyFiltersAndSort() {
    let filtered = [...this.projectsData];
    
    // 應用篩選
    const filters = this.state.currentFilter;
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(p => p.rarity === filters.rarity);
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    // 應用排序
    const sortKey = this.state.currentSort;
    const sortConfig = this.config.sorting.options.find(opt => opt.key === sortKey);
    
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        
        // 特殊處理
        if (sortKey === 'date') {
          aVal = new Date(aVal + '-01'); // YYYY-MM 格式
          bVal = new Date(bVal + '-01');
        } else if (sortKey === 'rarity') {
          const rarityOrder = { 'legendary': 4, 'superRare': 3, 'rare': 2, 'normal': 1 };
          aVal = rarityOrder[aVal] || 0;
          bVal = rarityOrder[bVal] || 0;
        }
        
        if (sortConfig.order === 'desc') {
          return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }
    
    this.filteredProjects = filtered;
  }
  
  /**
   * 更新統計數據
   */
  updateStats() {
    const stats = {
      total: this.projectsData.length,
      completed: this.projectsData.filter(p => p.status === 'completed').length,
      legendary: this.projectsData.filter(p => p.rarity === 'legendary').length
    };
    
    Object.entries(stats).forEach(([key, value]) => {
      const statEl = this.element.querySelector(`[data-stat="${key}"]`);
      if (statEl) {
        statEl.textContent = value;
      }
    });
  }
  
  /**
   * 播放網格動畫
   */
  playGridAnimation() {
    const cards = this.galleryGrid.querySelectorAll('.project-card-wrapper');
    
    // 檢查 GSAP 是否可用
    if (typeof gsap === 'undefined' || !window.gsap) {
      console.warn('⚠️ [PersonalProjectsGallery] GSAP not available, skipping animation');
      // 降級：直接顯示卡牌
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1) translateY(0)';
      });
      return;
    }
    
    gsap.fromTo(cards, {
      opacity: 0,
      scale: 0.8,
      y: 50
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: this.config.animation.gridTransition.duration,
      stagger: this.config.animation.gridTransition.stagger,
      ease: "back.out(1.7)"
    });
  }
  
  /**
   * 顯示空狀態
   */
  showEmptyState() {
    const emptyEl = this.element.querySelector('.gallery-empty');
    const gridEl = this.element.querySelector('.gallery-grid');
    
    if (emptyEl && gridEl) {
      emptyEl.style.display = 'block';
      gridEl.style.display = 'none';
    }
  }
  
  /**
   * 隱藏空狀態
   */
  hideEmptyState() {
    const emptyEl = this.element.querySelector('.gallery-empty');
    const gridEl = this.element.querySelector('.gallery-grid');
    
    if (emptyEl && gridEl) {
      emptyEl.style.display = 'none';
      gridEl.style.display = 'grid';
    }
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 篩選器變更事件
    this.filterControls.forEach(select => {
      select.addEventListener('change', (e) => {
        const filterType = e.target.dataset.filter;
        const filterValue = e.target.value;
        
        this.state.currentFilter[filterType] = filterValue;
        this.renderProjects();
        
        console.log(`🔍 [PersonalProjectsGallery] 篩選更新: ${filterType} = ${filterValue}`);
      });
    });
    
    // 排序器變更事件
    this.sortControls.addEventListener('change', (e) => {
      this.state.currentSort = e.target.value;
      this.renderProjects();
      
      console.log(`📊 [PersonalProjectsGallery] 排序更新: ${e.target.value}`);
    });
    
    // 重置篩選按鈕
    const resetBtn = this.element.querySelector('.empty-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }
  
  /**
   * 重置篩選條件
   */
  resetFilters() {
    // 重置狀態
    this.state.currentFilter = {
      category: 'all',
      rarity: 'all',
      status: 'all'
    };
    this.state.currentSort = 'date';
    
    // 重置 UI
    this.filterControls.forEach(select => {
      const filterType = select.dataset.filter;
      select.value = this.state.currentFilter[filterType];
    });
    this.sortControls.value = this.state.currentSort;
    
    // 重新渲染
    this.renderProjects();
    
    console.log('🔄 [PersonalProjectsGallery] 篩選條件已重置');
  }
  
  /**
   * 獲取組件元素
   */
  getElement() {
    return this.element;
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [PersonalProjectsGallery] 銷毀組件');
    
    // 清理卡牌組件
    this.projectCards.forEach(({ component }) => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.projectCards.clear();
    
    // 清理子組件
    if (this.summoningTransition) {
      this.summoningTransition.destroy();
    }
    
    if (this.projectModal) {
      this.projectModal.destroy();
    }
    
    // 移除 DOM 元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    super.destroy();
  }
}