/**
 * PersonalProjectsPage 個人專案卡牌頁面
 * Step 3.4.2: 整合 PersonalProjectsGallery 組件到獨立頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { PersonalProjectsGallery } from '../components/gaming/PersonalProjects/PersonalProjectsGallery.js';

export class PersonalProjectsPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.personalProjectsGallery = null;
    this.isInfoModalOpen = false;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '個人專案卡牌收藏',
      subtitle: '遊戲王風格個人作品展示，點擊卡牌體驗召喚特效',
      icon: '🎴',
      gallery: {
        enableSummoning: true,
        enableFilters: true,
        enableSort: true,
        layout: {
          desktop: 4,
          tablet: 3,
          mobile: 2,
        },
      },
    };
  }

  /**
   * 渲染頁面 HTML
   */
  async render() {
    const config = this.mergeConfig();

    return `
      <div class="personal-projects-page">
        <!-- 頁面頭部 -->
        <header class="personal-projects-header">
          <div class="personal-projects-header-content">
            <h1 class="personal-projects-title">
              <span class="title-icon">${config.icon}</span>
              <span class="title-text">${config.title}</span>
            </h1>
            <p class="personal-projects-subtitle">${config.subtitle}</p>
            
            <!-- 控制面板 -->
            <div class="personal-projects-controls">
              <button class="control-btn" id="reset-filters-btn" title="重置篩選">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">重置</span>
              </button>
              <button class="control-btn" id="random-card-btn" title="隨機卡牌">
                <span class="btn-icon">🎲</span>
                <span class="btn-text">隨機</span>
              </button>
              <button class="control-btn" id="info-btn" title="操作說明">
                <span class="btn-icon">❓</span>
                <span class="btn-text">說明</span>
              </button>
            </div>
          </div>
        </header>

        <!-- 卡牌畫廊主容器 -->
        <main class="personal-projects-main" id="personal-projects-main">
          <div class="gallery-container" id="gallery-container">
            <!-- PersonalProjectsGallery 將在此渲染 -->
          </div>
          
          <!-- 載入指示器 -->
          <div class="gallery-loading" id="gallery-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">載入個人專案卡牌中...</p>
          </div>
        </main>

        <!-- 召喚說明面板 -->
        <aside class="summoning-guide-panel" id="summoning-guide-panel">
          <div class="guide-content">
            <h3 class="guide-title">🌟 召喚指南</h3>
            <div class="guide-items">
              <div class="guide-item">
                <span class="guide-icon">⭐</span>
                <div class="guide-text">
                  <strong>傳說級</strong>
                  <span>完整召喚特效</span>
                </div>
              </div>
              <div class="guide-item">
                <span class="guide-icon">💎</span>
                <div class="guide-text">
                  <strong>超稀有</strong>
                  <span>精簡召喚動畫</span>
                </div>
              </div>
              <div class="guide-item">
                <span class="guide-icon">🔸</span>
                <div class="guide-text">
                  <strong>稀有</strong>
                  <span>基礎翻牌效果</span>
                </div>
              </div>
              <div class="guide-item">
                <span class="guide-icon">⚪</span>
                <div class="guide-text">
                  <strong>普通</strong>
                  <span>直接顯示詳情</span>
                </div>
              </div>
            </div>
            <div class="guide-tip">
              <p>💡 提示：按 ESC 鍵可跳過召喚動畫</p>
            </div>
          </div>
        </aside>

        <!-- 操作說明彈窗 -->
        <div class="info-modal" id="info-modal">
          <div class="modal-backdrop" id="info-backdrop"></div>
          <div class="modal-content">
            <header class="modal-header">
              <h3>個人專案卡牌說明</h3>
              <button class="close-btn" id="info-close-btn">✕</button>
            </header>
            <div class="modal-body">
              <div class="help-section">
                <h4>🎴 卡牌系統</h4>
                <ul>
                  <li><strong>稀有度：</strong>普通 → 稀有 → 超稀有 → 傳說</li>
                  <li><strong>屬性：</strong>光、闇、地、水、火、風</li>
                  <li><strong>攻防值：</strong>基於專案複雜度和實用價值</li>
                  <li><strong>等級：</strong>反映專案重要性評分</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>🌟 召喚特效</h4>
                <ul>
                  <li><strong>傳說級：</strong>完整8秒遊戲王召喚動畫</li>
                  <li><strong>超稀有：</strong>3秒精簡召喚特效</li>
                  <li><strong>稀有：</strong>1.5秒翻牌效果</li>
                  <li><strong>普通：</strong>直接顯示專案詳情</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>🔍 篩選與排序</h4>
                <ul>
                  <li><strong>類型篩選：</strong>前端、後端、全端、移動、AI、區塊鏈</li>
                  <li><strong>稀有度篩選：</strong>按卡牌稀有度分類檢視</li>
                  <li><strong>狀態篩選：</strong>已完成、進行中、已封存</li>
                  <li><strong>排序選項：</strong>時間、稀有度、重要性、名稱</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>🎮 互動操作</h4>
                <ul>
                  <li><strong>點擊卡牌：</strong>觸發召喚動畫或直接查看詳情</li>
                  <li><strong>懸停效果：</strong>卡牌會有 3D 傾斜和發光效果</li>
                  <li><strong>隨機卡牌：</strong>隨機選擇一張卡牌進行展示</li>
                  <li><strong>ESC 鍵：</strong>跳過召喚動畫或關閉彈窗</li>
                </ul>
              </div>
            </div>
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

    try {
      // 設置全局實例
      window.personalProjectsPageInstance = this;

      // 初始化個人專案畫廊
      await this.initializeGallery();

      // 綁定UI事件
      this.bindEvents();

      console.log('🎴 PersonalProjectsPage initialized');
    } catch (error) {
      console.error('❌ PersonalProjectsPage initialization failed:', error);
      this.showError('個人專案卡牌載入失敗');
    }
  }

  /**
   * 初始化個人專案畫廊組件
   */
  async initializeGallery() {
    // 等待DOM完全渲染
    await new Promise(resolve => setTimeout(resolve, 0));

    const container = document.getElementById('gallery-container');
    const loading = document.getElementById('gallery-loading');

    if (!container) {
      throw new Error('卡牌畫廊容器不存在');
    }

    try {
      // 顯示載入狀態
      loading.style.display = 'flex';

      // 創建個人專案畫廊組件
      const config = this.mergeConfig();

      const galleryConfig = {
        container: container,
        layout: config.gallery.layout,
        summoning: {
          enabled: config.gallery.enableSummoning,
          triggerOnClick: true,
          legendaryOnly: false,
        },
        // 使用默認的 filters 和 sorting 配置
      };

      this.personalProjectsGallery = new PersonalProjectsGallery(galleryConfig);

      console.log(
        '🔧 PersonalProjectsGallery 實例已創建:',
        this.personalProjectsGallery
      );

      // 容器狀態檢查
      if (!container.offsetWidth || !container.offsetHeight) {
        console.warn('⚠️ 卡牌畫廊容器可能不可見');
      }

      // 監聽畫廊事件
      this.setupGalleryEvents();

      // 初始化畫廊組件
      await this.personalProjectsGallery.init();

      // 隱藏載入狀態
      loading.style.display = 'none';

      console.log(
        '✅ PersonalProjectsGallery initialized in PersonalProjectsPage'
      );

      // 驗證卡牌內容是否正確載入
      setTimeout(() => {
        const galleryGrid = container.querySelector('.gallery-grid');
        if (galleryGrid) {
          const cards = galleryGrid.querySelectorAll('.project-card-wrapper');
          console.log(`✅ 個人專案卡牌載入成功 - ${cards.length} 張卡牌`);
        } else {
          console.warn('⚠️ 個人專案卡牌未正確載入');
        }
      }, 1000);
    } catch (error) {
      console.error('❌ Gallery initialization failed:', error);
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">個人專案卡牌載入失敗</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      throw error;
    }
  }

  /**
   * 設置畫廊事件監聽
   */
  setupGalleryEvents() {
    if (!this.personalProjectsGallery) return;

    // 卡牌點擊事件
    this.personalProjectsGallery.on?.('card-clicked', data => {
      console.log('🎴 卡牌點擊事件:', data);
      this.handleCardClick(data);
    });

    // 召喚動畫開始事件
    this.personalProjectsGallery.on?.('summoning-started', data => {
      console.log('🌟 召喚動畫開始:', data);
      this.highlightSummoningGuide(data.rarity);
    });

    // 召喚動畫結束事件
    this.personalProjectsGallery.on?.('summoning-completed', data => {
      console.log('✨ 召喚動畫完成:', data);
      this.resetSummoningGuide();
    });

    // 篩選變更事件
    this.personalProjectsGallery.on?.('filter-changed', data => {
      console.log('🔍 篩選變更:', data);
    });

    // 錯誤處理
    this.personalProjectsGallery.on?.('gallery-error', data => {
      console.error('🚨 畫廊錯誤:', data.error);
      this.showError('個人專案畫廊運行錯誤: ' + data.error.message);
    });
  }

  /**
   * 處理卡牌點擊事件
   */
  handleCardClick(data) {
    console.log('🎯 處理卡牌點擊:', data.projectId);

    // 高亮召喚指南相應稀有度
    this.highlightSummoningGuide(data.rarity);
  }

  /**
   * 高亮召喚指南
   */
  highlightSummoningGuide(rarity) {
    const guide = document.getElementById('summoning-guide-panel');
    const items = guide?.querySelectorAll('.guide-item');

    if (!items) return;

    // 移除所有高亮
    items.forEach(item => item.classList.remove('highlight'));

    // 高亮對應稀有度
    const rarityMap = {
      legendary: 0,
      superRare: 1,
      rare: 2,
      normal: 3,
    };

    const index = rarityMap[rarity];
    if (items[index]) {
      items[index].classList.add('highlight');

      // 3秒後移除高亮
      setTimeout(() => {
        items[index].classList.remove('highlight');
      }, 3000);
    }
  }

  /**
   * 重置召喚指南
   */
  resetSummoningGuide() {
    const guide = document.getElementById('summoning-guide-panel');
    const items = guide?.querySelectorAll('.guide-item');

    if (items) {
      items.forEach(item => item.classList.remove('highlight'));
    }
  }

  /**
   * 綁定UI事件
   */
  bindEvents() {
    // 重置篩選按鈕
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // 隨機卡牌按鈕
    const randomBtn = document.getElementById('random-card-btn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this.showRandomCard();
      });
    }

    // 說明按鈕
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
      infoBtn.addEventListener('click', () => {
        this.showInfo();
      });
    }

    // 說明彈窗關閉
    const infoCloseBtn = document.getElementById('info-close-btn');
    const infoBackdrop = document.getElementById('info-backdrop');

    if (infoCloseBtn) {
      infoCloseBtn.addEventListener('click', () => {
        this.hideInfo();
      });
    }

    if (infoBackdrop) {
      infoBackdrop.addEventListener('click', () => {
        this.hideInfo();
      });
    }

    // ESC 鍵處理
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (this.isInfoModalOpen) {
          this.hideInfo();
        }
        // 召喚動畫的 ESC 處理由 SummoningTransition 組件處理
      }
    });
  }

  /**
   * 重置篩選條件
   */
  resetFilters() {
    if (
      this.personalProjectsGallery &&
      this.personalProjectsGallery.resetFilters
    ) {
      this.personalProjectsGallery.resetFilters();
      console.log('🔄 篩選條件已重置');
    }
  }

  /**
   * 顯示隨機卡牌
   */
  showRandomCard() {
    if (
      this.personalProjectsGallery &&
      this.personalProjectsGallery.showRandomCard
    ) {
      this.personalProjectsGallery.showRandomCard();
      console.log('🎲 顯示隨機卡牌');
    } else {
      // 降級實現：隨機點擊一張卡牌
      const cards = document.querySelectorAll('.project-card-wrapper');
      if (cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex];
        randomCard.click();
        console.log('🎲 點擊隨機卡牌 (降級實現)');
      }
    }
  }

  /**
   * 顯示操作說明
   */
  showInfo() {
    const modal = document.getElementById('info-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      this.isInfoModalOpen = true;
    }
  }

  /**
   * 隱藏操作說明
   */
  hideInfo() {
    const modal = document.getElementById('info-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      this.isInfoModalOpen = false;
    }
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    console.error('🚨 PersonalProjectsPage Error:', message);

    const loading = document.getElementById('gallery-loading');
    if (loading) {
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">${message}</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      loading.style.display = 'flex';
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    try {
      // 清理全局實例
      if (window.personalProjectsPageInstance === this) {
        window.personalProjectsPageInstance = null;
      }

      // 銷毀畫廊組件
      if (this.personalProjectsGallery) {
        this.personalProjectsGallery.destroy();
        this.personalProjectsGallery = null;
      }

      // 移除事件監聽器
      const buttons = [
        'reset-filters-btn',
        'random-card-btn',
        'info-btn',
        'info-close-btn',
        'info-backdrop',
      ];
      buttons.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.removeEventListener('click', this.boundEvents?.[id]);
        }
      });

      // 清理全局事件
      document.removeEventListener('keydown', this.boundEvents?.keydown);

      super.destroy();
      console.log('🎴 PersonalProjectsPage destroyed');
    } catch (error) {
      console.error('❌ PersonalProjectsPage destroy error:', error);
    }
  }
}
