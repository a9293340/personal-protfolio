/**
 * WorkProjectsPage 工作專案時間軸頁面
 * Step 3.4.1: 整合 InteractiveTimeline 組件到獨立頁面
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { InteractiveTimeline } from '../components/gaming/InteractiveTimeline/InteractiveTimeline.js';

export class WorkProjectsPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.interactiveTimeline = null;
    this.isFullscreen = false;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '工作專案時間軸',
      subtitle: '專業開發歷程與重點專案展示',
      icon: '🚀',
      timeline: {
        enableFullscreen: true,
        showYearFilter: true,
        enableParticles: true,
        autoPlay: false
      }
    };
  }

  /**
   * 渲染頁面 HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <div class="work-projects-page">
        <!-- 頁面頭部 -->
        <header class="work-projects-header">
          <div class="work-projects-header-content">
            <h1 class="work-projects-title">
              <span class="title-icon">${config.icon}</span>
              <span class="title-text">${config.title}</span>
            </h1>
            <p class="work-projects-subtitle">${config.subtitle}</p>
            
            <!-- 控制面板 -->
            <div class="work-projects-controls">
              <button class="control-btn" id="fullscreen-btn" title="全螢幕檢視">
                <span class="btn-icon">⛶</span>
                <span class="btn-text">全螢幕</span>
              </button>
              <button class="control-btn" id="center-timeline-btn" title="重置時間軸">
                <span class="btn-icon">🎯</span>
                <span class="btn-text">居中</span>
              </button>
              <button class="control-btn" id="info-btn" title="操作說明">
                <span class="btn-icon">❓</span>
                <span class="btn-text">說明</span>
              </button>
            </div>
          </div>
        </header>

        <!-- 時間軸主容器 -->
        <main class="work-projects-main" id="work-projects-main">
          <div class="timeline-container" id="timeline-container">
            <!-- InteractiveTimeline 將在此渲染 -->
          </div>
          
          <!-- 載入指示器 -->
          <div class="timeline-loading" id="timeline-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">載入工作專案時間軸中...</p>
          </div>
        </main>

        <!-- 專案統計面板 -->
        <aside class="projects-stats-panel" id="projects-stats-panel">
          <div class="stats-content">
            <h3 class="stats-title">專案統計</h3>
            <div class="stats-grid" id="stats-grid">
              <div class="stat-item">
                <span class="stat-number">-</span>
                <span class="stat-label">總專案數</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">-</span>
                <span class="stat-label">技術類型</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">-</span>
                <span class="stat-label">開發年份</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">-</span>
                <span class="stat-label">重點專案</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 操作說明彈窗 -->
        <div class="info-modal" id="info-modal">
          <div class="modal-backdrop" id="info-backdrop"></div>
          <div class="modal-content">
            <header class="modal-header">
              <h3>時間軸操作說明</h3>
              <button class="close-btn" id="info-close-btn">✕</button>
            </header>
            <div class="modal-body">
              <div class="help-section">
                <h4>🖱️ 桌面端操作</h4>
                <ul>
                  <li><strong>拖曳：</strong>點擊拖曳時間軸水平移動</li>
                  <li><strong>滾輪：</strong>Ctrl + 滾輪縮放時間軸</li>
                  <li><strong>點擊：</strong>點擊專案節點查看詳情</li>
                  <li><strong>鍵盤：</strong>方向鍵移動，Ctrl+0 重置</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>📱 移動端操作</h4>
                <ul>
                  <li><strong>拖曳：</strong>上下拖曳瀏覽時間軸</li>
                  <li><strong>雙指：</strong>雙指縮放調整檢視</li>
                  <li><strong>點擊：</strong>點擊專案節點查看詳情</li>
                  <li><strong>年份：</strong>使用年份篩選器快速導航</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>⚡ 專案節點說明</h4>
                <ul>
                  <li><strong>節點大小：</strong>反映專案重要性</li>
                  <li><strong>顏色分類：</strong>不同技術類型用不同顏色</li>
                  <li><strong>發光效果：</strong>重點專案會有特殊效果</li>
                  <li><strong>飛出動畫：</strong>點擊後卡片會飛出展示詳情</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 全螢幕遮罩 -->
        <div class="fullscreen-overlay" id="fullscreen-overlay">
          <button class="exit-fullscreen-btn" id="exit-fullscreen-btn">
            <span class="btn-icon">✕</span>
            <span class="btn-text">退出全螢幕</span>
          </button>
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
      window.workProjectsPageInstance = this;
      
      // 初始化互動時間軸
      await this.initializeTimeline();
      
      // 綁定UI事件
      this.bindEvents();
      
      // 更新統計數據
      this.updateStats();
      
      console.log('🚀 WorkProjectsPage initialized');
      
    } catch (error) {
      console.error('❌ WorkProjectsPage initialization failed:', error);
      this.showError('工作專案時間軸載入失敗');
    }
  }

  /**
   * 初始化互動時間軸組件
   */
  async initializeTimeline() {
    const container = document.getElementById('timeline-container');
    const loading = document.getElementById('timeline-loading');
    
    if (!container) {
      throw new Error('時間軸容器不存在');
    }

    try {
      // 顯示載入狀態
      loading.style.display = 'flex';
      
      // 創建互動時間軸組件
      this.interactiveTimeline = new InteractiveTimeline({
        container: container,
        width: '100%',
        height: '600px',
        projectFilter: 'work', // 只顯示工作專案
        enableYearFilter: true,
        enableParticles: true,
        enableCardAnimation: true,
        responsive: {
          mobile: {
            height: '500px',
            orientation: 'vertical'
          },
          desktop: {
            height: '600px',
            orientation: 'horizontal'
          }
        }
      });

      console.log('🔧 InteractiveTimeline 實例已創建:', this.interactiveTimeline);
      
      // 容器狀態檢查
      if (!container.offsetWidth || !container.offsetHeight) {
        console.warn('⚠️ 時間軸容器可能不可見');
      }

      // 等待 DOM 佈局完成後再初始化 InteractiveTimeline
      await new Promise(resolve => {
        // 使用多個 requestAnimationFrame 確保佈局完全完成
        requestAnimationFrame(() => {
          requestAnimationFrame(async () => {
            // 檢查容器寬度是否已正確計算
            if (container && container.clientWidth > 0) {
              console.log('[WorkProjectsPage] 容器寬度已準備完成:', container.clientWidth);
              await this.interactiveTimeline.init();
              resolve();
            } else {
              // 如果寬度仍然是 0，等待更長時間
              console.warn('[WorkProjectsPage] 容器寬度仍為 0，延遲初始化');
              setTimeout(async () => {
                await this.interactiveTimeline.init();
                resolve();
              }, 100);
            }
          });
        });
      });

      // 監聽時間軸事件
      this.setupTimelineEvents();
      
      // 隱藏載入狀態
      loading.style.display = 'none';
      
      console.log('✅ InteractiveTimeline initialized in WorkProjectsPage');
      
      // 驗證時間軸內容是否正確載入
      setTimeout(() => {
        const nodeCount = container.querySelectorAll('.timeline-node').length;
        if (nodeCount === 0) {
          console.warn('⚠️ 時間軸節點未正確載入');
        } else {
          console.log(`✅ 時間軸載入成功 - ${nodeCount} 個專案節點`);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Timeline initialization failed:', error);
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">時間軸載入失敗</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      throw error;
    }
  }

  /**
   * 設置時間軸事件監聽
   */
  setupTimelineEvents() {
    if (!this.interactiveTimeline) return;

    // 專案節點點擊事件
    this.interactiveTimeline.on('project-selected', (data) => {
      console.log('🚀 專案選擇事件:', data);
      this.handleProjectSelection(data);
    });

    // 年份篩選變更事件
    this.interactiveTimeline.on('year-filter-changed', (data) => {
      console.log('📅 年份篩選變更:', data);
      this.updateStats();
    });

    // 時間軸初始化完成
    this.interactiveTimeline.on('timeline-initialized', (data) => {
      console.log(`🌟 時間軸載入完成: ${data.projectCount} 個專案`);
      this.updateStats();
    });

    // 錯誤處理
    this.interactiveTimeline.on('timeline-error', (data) => {
      console.error('🚨 時間軸錯誤:', data.error);
      this.showError('時間軸運行錯誤: ' + data.error.message);
    });
  }

  /**
   * 處理專案選擇事件
   */
  handleProjectSelection(data) {
    // 這裡可以添加專案詳情顯示邏輯
    console.log('🎯 處理專案選擇:', data.projectId);
    
    // 更新統計面板高亮當前專案
    this.highlightCurrentProject(data.projectId);
  }

  /**
   * 高亮當前專案
   */
  highlightCurrentProject(projectId) {
    // 實現專案高亮邏輯
    console.log('✨ 高亮專案:', projectId);
  }

  /**
   * 綁定UI事件
   */
  bindEvents() {
    // 全螢幕按鈕
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    // 居中按鈕
    const centerBtn = document.getElementById('center-timeline-btn');
    if (centerBtn) {
      centerBtn.addEventListener('click', () => {
        this.centerTimeline();
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
    const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
    
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

    if (exitFullscreenBtn) {
      exitFullscreenBtn.addEventListener('click', () => {
        this.exitFullscreen();
      });
    }

    // ESC 鍵處理
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.isFullscreen) {
          this.exitFullscreen();
        } else {
          this.hideInfo();
        }
      }
    });
  }

  /**
   * 切換全螢幕模式
   */
  toggleFullscreen() {
    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  /**
   * 進入全螢幕模式
   */
  enterFullscreen() {
    const page = document.querySelector('.work-projects-page');
    const overlay = document.getElementById('fullscreen-overlay');
    
    if (page && overlay) {
      page.classList.add('fullscreen');
      overlay.classList.add('show');
      this.isFullscreen = true;
      
      // 調整時間軸大小
      if (this.interactiveTimeline && this.interactiveTimeline.resize) {
        setTimeout(() => {
          this.interactiveTimeline.resize();
        }, 300);
      }
      
      console.log('⛶ 進入全螢幕模式');
    }
  }

  /**
   * 退出全螢幕模式
   */
  exitFullscreen() {
    const page = document.querySelector('.work-projects-page');
    const overlay = document.getElementById('fullscreen-overlay');
    
    if (page && overlay) {
      page.classList.remove('fullscreen');
      overlay.classList.remove('show');
      this.isFullscreen = false;
      
      // 調整時間軸大小
      if (this.interactiveTimeline && this.interactiveTimeline.resize) {
        setTimeout(() => {
          this.interactiveTimeline.resize();
        }, 300);
      }
      
      console.log('✕ 退出全螢幕模式');
    }
  }

  /**
   * 居中時間軸
   */
  centerTimeline() {
    if (this.interactiveTimeline && this.interactiveTimeline.centerView) {
      this.interactiveTimeline.centerView();
      console.log('🎯 時間軸已居中');
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
    }
  }

  /**
   * 更新統計數據
   */
  updateStats() {
    // 從時間軸組件獲取統計數據
    if (!this.interactiveTimeline) return;

    try {
      const stats = this.interactiveTimeline.getStats();
      const statsGrid = document.getElementById('stats-grid');
      
      if (statsGrid && stats) {
        const statItems = statsGrid.querySelectorAll('.stat-item');
        
        if (statItems[0]) {
          statItems[0].querySelector('.stat-number').textContent = stats.totalProjects || '-';
        }
        if (statItems[1]) {
          statItems[1].querySelector('.stat-number').textContent = stats.techTypes || '-';
        }
        if (statItems[2]) {
          statItems[2].querySelector('.stat-number').textContent = stats.yearSpan || '-';
        }
        if (statItems[3]) {
          statItems[3].querySelector('.stat-number').textContent = stats.featuredProjects || '-';
        }
        
        console.log('📊 統計數據已更新:', stats);
      }
    } catch (error) {
      console.warn('⚠️ 統計數據更新失敗:', error);
    }
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    console.error('🚨 WorkProjectsPage Error:', message);
    
    const loading = document.getElementById('timeline-loading');
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
      if (window.workProjectsPageInstance === this) {
        window.workProjectsPageInstance = null;
      }

      // 銷毀時間軸組件
      if (this.interactiveTimeline) {
        this.interactiveTimeline.destroy();
        this.interactiveTimeline = null;
      }

      // 移除事件監聽器
      const buttons = ['fullscreen-btn', 'center-timeline-btn', 'info-btn', 'info-close-btn', 'info-backdrop', 'exit-fullscreen-btn'];
      buttons.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.removeEventListener('click', this.boundEvents?.[id]);
        }
      });

      // 清理全局事件
      document.removeEventListener('keydown', this.boundEvents?.keydown);

      super.destroy();
      console.log('🚀 WorkProjectsPage destroyed');
      
    } catch (error) {
      console.error('❌ WorkProjectsPage destroy error:', error);
    }
  }
}