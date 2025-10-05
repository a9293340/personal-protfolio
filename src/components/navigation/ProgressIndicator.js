/**
 * 頁面進度指示器組件
 * Step 3.5.3 階段2: 遊戲化進度追蹤系統
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class ProgressIndicator extends BaseComponent {
  constructor(options = {}) {
    super(options);

    // 暫時停用自動重新渲染，避免無限循環
    this.shouldRerenderOnStateChange = false;

    // 頁面配置（遊戲風格）
    this.pageConfig = {
      '/': {
        name: '主城區',
        icon: '🏰',
        weight: 10,
        category: 'hub',
        description: '冒險的起點',
      },
      '/about': {
        name: '角色檔案',
        icon: '👤',
        weight: 20,
        category: 'character',
        description: '了解角色背景',
      },
      '/skills': {
        name: '技能樹',
        icon: '🌲',
        weight: 25,
        category: 'skills',
        description: '掌握專業技能',
      },
      '/work-projects': {
        name: '職業任務',
        icon: '💼',
        weight: 25,
        category: 'quests',
        description: '完成工作挑戰',
      },
      '/personal-projects': {
        name: '個人收藏',
        icon: '🎴',
        weight: 15,
        category: 'collection',
        description: '探索個人作品',
      },
      '/contact': {
        name: '聯絡據點',
        icon: '📮',
        weight: 5,
        category: 'social',
        description: '建立聯繫',
      },
    };

    // 里程碑配置
    this.milestoneConfig = [
      {
        threshold: 25,
        name: '初級探索者',
        icon: '🌱',
        description: '開始了解基本資訊',
      },
      {
        threshold: 50,
        name: '中級冒險者',
        icon: '⚔️',
        description: '深入了解技能和經歷',
      },
      {
        threshold: 75,
        name: '高級探索者',
        icon: '🏆',
        description: '全面了解專業能力',
      },
      {
        threshold: 100,
        name: '完全探索者',
        icon: '👑',
        description: '完整體驗所有內容',
      },
    ];

    // 綁定方法
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handlePageScroll = this.handlePageScroll.bind(this);
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    // 從 localStorage 恢復狀態
    const savedState = this.loadStateFromStorage();

    return {
      currentProgress: savedState.currentProgress || 0,
      totalPages: savedState.totalPages || 0,
      visitedPages: new Set(savedState.visitedPages || []),
      currentPageIndex: 0,
      isVisible: true,
      milestones: savedState.milestones || [],
    };
  }

  /**
   * 從存儲加載狀態
   */
  loadStateFromStorage() {
    try {
      const storageType = this.config?.storageType || 'localStorage';
      const storage =
        storageType === 'sessionStorage' ? sessionStorage : localStorage;
      const saved = storage.getItem('progress-indicator-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`📦 Loaded state from ${storageType}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
    return {};
  }

  /**
   * 保存狀態到存儲
   */
  saveStateToStorage() {
    try {
      const storageType = this.config?.storageType || 'localStorage';
      const storage =
        storageType === 'sessionStorage' ? sessionStorage : localStorage;
      const stateToSave = {
        currentProgress: this.state.currentProgress,
        totalPages: this.state.totalPages,
        visitedPages: Array.from(this.state.visitedPages),
        milestones: this.state.milestones,
      };
      storage.setItem('progress-indicator-state', JSON.stringify(stateToSave));
      console.log(`💾 Saved state to ${storageType}:`, stateToSave);
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      showMilestones: true,
      showPercentage: true,
      showVisitedCount: true,
      animationEnabled: true,
      style: 'gaming', // gaming, minimal, elegant
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left
      storageType: 'localStorage', // 'localStorage' | 'sessionStorage'
    };
  }

  /**
   * 渲染進度指示器
   */
  async render() {
    // 確保配置已初始化
    if (!this.config) {
      this.config = this.getDefaultConfig();
    }

    const {
      showMilestones,
      showPercentage,
      showVisitedCount,
      style,
      position,
    } = this.config;

    const {
      currentProgress,
      visitedPages,
      totalPages,
      milestones: _milestones,
      isVisible,
    } = this.state;

    if (!isVisible) {
      return `<div class="progress-indicator progress-indicator--hidden"></div>`;
    }

    const currentMilestone = this.getCurrentMilestone();
    const nextMilestone = this.getNextMilestone();

    console.log('🖼️ ProgressIndicator render state:', {
      currentProgress,
      visitedPagesSize: visitedPages.size,
      totalPages,
      currentMilestone: currentMilestone ? currentMilestone.name : 'none',
      nextMilestone: nextMilestone ? nextMilestone.name : 'none',
    });

    return `
      <div class="progress-indicator progress-indicator--${style} progress-indicator--${position}"
           role="region"
           style="display: none;"
           aria-label="網站瀏覽進度">

        <!-- 主進度顯示 -->
        <div class="progress-main">

          <!-- 進度圓環 -->
          <div class="progress-circle"
               aria-label="總體進度 ${Math.round(currentProgress)}%">
            <svg class="progress-circle-svg" viewBox="0 0 120 120">
              <!-- 背景圓環 -->
              <circle class="progress-bg-circle"
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke="rgba(212, 175, 55, 0.2)"
                      stroke-width="6"/>

              <!-- 進度圓環 -->
              <circle class="progress-fill-circle"
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke="var(--primary-gold)"
                      stroke-width="6"
                      stroke-linecap="round"
                      stroke-dasharray="339.292"
                      stroke-dashoffset="${339.292 * (1 - currentProgress / 100)}"
                      transform="rotate(-90 60 60)"/>

              <!-- 當前里程碑圖標 -->
              ${
                currentMilestone
                  ? `
                <foreignObject x="35" y="35" width="50" height="50">
                  <div class="progress-milestone-icon">
                    ${currentMilestone.icon}
                  </div>
                </foreignObject>
              `
                  : `
                <foreignObject x="45" y="45" width="30" height="30">
                  <div class="progress-percentage">
                    ${Math.round(currentProgress)}%
                  </div>
                </foreignObject>
              `
              }
            </svg>

            <!-- 脈衝動畫 -->
            <div class="progress-pulse ${currentProgress > 0 ? 'progress-pulse--active' : ''}"></div>
          </div>

          <!-- 進度資訊 -->
          <div class="progress-info">
            ${
              showPercentage
                ? `
              <div class="progress-percentage-text">
                ${Math.round(currentProgress)}%
              </div>
            `
                : ''
            }

            ${
              showVisitedCount
                ? `
              <div class="progress-stats">
                <span class="progress-visited">${visitedPages.size}</span>
                <span class="progress-separator">/</span>
                <span class="progress-total">${totalPages}</span>
                <span class="progress-label">頁面</span>
              </div>
            `
                : ''
            }

            ${
              currentMilestone
                ? `
              <div class="progress-milestone-name">
                ${currentMilestone.name}
              </div>
            `
                : ''
            }
          </div>

        </div>

        <!-- 里程碑指示器 -->
        ${
          showMilestones
            ? `
          <div class="progress-milestones">
            ${this.milestoneConfig
              .map(
                milestone => `
              <div class="progress-milestone ${currentProgress >= milestone.threshold ? 'progress-milestone--achieved' : ''}"
                   data-threshold="${milestone.threshold}"
                   title="${milestone.name}: ${milestone.description}">
                <span class="milestone-icon">${milestone.icon}</span>
                <div class="milestone-progress">${milestone.threshold}%</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }


        <!-- 詳情切換按鈕 -->
        <button class="progress-toggle"
                id="progress-toggle"
                aria-label="切換詳細進度資訊"
                title="查看詳細進度">
          <span class="toggle-icon">📊</span>
        </button>

        <!-- 詳細面板 -->
        <div class="progress-details" id="progress-details">
          <div class="progress-details-content">

            <h4 class="details-title">瀏覽進度詳情</h4>

            <!-- 頁面完成狀態 -->
            <div class="details-pages">
              ${Object.entries(this.pageConfig)
                .map(
                  ([path, config]) => `
                <div class="details-page ${visitedPages.has(path) ? 'details-page--visited' : ''}" data-path="${path}">
                  <span class="page-icon">${config.icon}</span>
                  <span class="page-name">${config.name}</span>
                  <span class="page-status">
                    ${visitedPages.has(path) ? '✅' : '⭕'}
                  </span>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- 成就統計 -->
            <div class="details-achievements">
              <div class="achievement-item">
                <span class="achievement-label">探索深度</span>
                <span class="achievement-value">${Math.round(currentProgress)}%</span>
              </div>
              <div class="achievement-item">
                <span class="achievement-label">頁面覆蓋</span>
                <span class="achievement-value">${visitedPages.size}/${totalPages}</span>
              </div>
              <div class="achievement-item">
                <span class="achievement-label">當前等級</span>
                <span class="achievement-value">${currentMilestone ? currentMilestone.name : '新手'}</span>
              </div>
            </div>

            <button class="details-close" id="progress-details-close">
              關閉詳情
            </button>
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

    // 設置元素引用
    this.element =
      document.querySelector('.progress-indicator') ||
      document
        .getElementById('progress-indicator-container')
        ?.querySelector('.progress-indicator');

    // 計算總頁面數並更新狀態
    const totalPages = Object.keys(this.pageConfig).length;

    // 獲取當前路徑並記錄為已訪問
    const currentPath = window.location.hash.slice(1) || '/';
    const visitedPages = new Set([currentPath]);

    this.setState({
      totalPages,
      visitedPages,
    });

    // 綁定事件
    this.bindEvents();

    // 使用定時器檢查路由變化，避免與 Router 衝突
    this.lastKnownRoute = currentPath;
    this.routeCheckInterval = setInterval(() => {
      const currentRoute = window.location.hash.slice(1) || '/';
      if (currentRoute !== this.lastKnownRoute) {
        this.lastKnownRoute = currentRoute;
        this.handleRouteChange();
      }
    }, 100);

    // 監聽頁面滾動（可選的進度計算）
    window.addEventListener('scroll', this.handlePageScroll);

    // 初始化進度
    this.updateProgress();

    console.log('📊 ProgressIndicator initialized', {
      totalPages,
      currentPath,
      visitedPages: visitedPages.size,
      element: this.element ? 'found' : 'not found',
    });

    // 在全局暴露實例，方便調試
    window.progressIndicator = this;

    // 檢查當前狀態並提供測試說明
    const currentStats = this.getProgressStats();
    if (currentStats.milestonesAchieved >= this.milestoneConfig.length) {
      console.log('🔧 ALL MILESTONES ALREADY ACHIEVED!');
      console.log(
        '🔧 To test upgrade notifications, use: window.progressIndicator.resetProgress()'
      );
      console.log(
        '🔧 Then visit pages or use: window.progressIndicator.setProgressForTesting(25) for 25%'
      );
    } else {
      console.log(
        '🔧 Milestones available to achieve:',
        this.milestoneConfig.length - currentStats.milestonesAchieved
      );
    }

    console.log('🔧 Debug commands:');
    console.log('   • resetProgress() - Reset all progress');
    console.log(
      '   • setProgressForTesting(percentage) - Set progress to specific %'
    );
    console.log('   • showProgressDebug() - Show full debug info');
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 移除舊的事件處理器
    if (this.boundEventHandler) {
      document.removeEventListener('click', this.boundEventHandler);
    }

    // 創建新的事件處理器
    this.boundEventHandler = e => {
      const toggleBtn = e.target.closest('#progress-toggle');
      const closeBtn = e.target.closest('#progress-details-close');
      const details = document.getElementById('progress-details');
      const milestone = e.target.closest('.progress-milestone');

      if (toggleBtn && details) {
        console.log('🔄 Toggle progress details');
        const isOpen = details.classList.contains('progress-details--open');
        if (isOpen) {
          details.classList.remove('progress-details--open');
          console.log('❌ Closed progress details');
        } else {
          details.classList.add('progress-details--open');
          console.log('✅ Opened progress details');
        }
        e.preventDefault();
        e.stopPropagation();
      }

      if (closeBtn && details) {
        console.log('❌ Close progress details');
        details.classList.remove('progress-details--open');
        e.preventDefault();
        e.stopPropagation();
      }

      if (milestone) {
        console.log('📊 Show milestone details');
        this.showMilestoneDetails(milestone);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 綁定事件處理器
    document.addEventListener('click', this.boundEventHandler);
  }

  /**
   * 處理路由變化
   */
  handleRouteChange() {
    const currentPath = window.location.hash.slice(1) || '/';

    console.log('🛣️ Route changed to:', currentPath);

    // 記錄訪問的頁面 - 使用正確的狀態更新方式
    const newVisitedPages = new Set(this.state.visitedPages);
    const wasNewPage = !newVisitedPages.has(currentPath);
    newVisitedPages.add(currentPath);

    this.setState({ visitedPages: newVisitedPages });

    if (wasNewPage) {
      console.log(
        '✨ New page visited:',
        currentPath,
        'Total:',
        newVisitedPages.size
      );

      // 當有新頁面被訪問時，立即更新進度並檢查里程碑
      setTimeout(() => {
        this.updateProgress();
      }, 100);
    } else {
      console.log('📍 Revisited page:', currentPath);
    }

    // 播放進度更新動畫
    if (this.config && this.config.animationEnabled) {
      this.playProgressUpdateAnimation();
    }
  }

  /**
   * 處理頁面滾動（可選功能）
   */
  handlePageScroll() {
    // 根據頁面滾動深度微調進度
    // 這是可選功能，可以讓進度更精確
  }

  /**
   * 更新進度計算
   */
  updateProgress() {
    const { visitedPages } = this.state;
    let totalWeight = 0;
    let visitedWeight = 0;

    // 計算權重總和
    Object.values(this.pageConfig).forEach(config => {
      totalWeight += config.weight;
    });

    // 計算已訪問頁面權重
    visitedPages.forEach(path => {
      const config = this.pageConfig[path];
      if (config) {
        visitedWeight += config.weight;
      }
    });

    // 計算進度百分比
    const progress = totalWeight > 0 ? (visitedWeight / totalWeight) * 100 : 0;
    const finalProgress = Math.min(progress, 100);

    console.log('📊 Progress update:', {
      visitedPagesSize: visitedPages.size,
      visitedPaths: Array.from(visitedPages),
      totalWeight,
      visitedWeight,
      progress,
      finalProgress,
    });

    // 更新狀態
    this.setState({
      currentProgress: finalProgress,
    });

    // 檢查里程碑
    this.checkMilestones();

    // 保存狀態到 localStorage
    this.saveStateToStorage();

    // 直接更新 DOM 元素，避免重新渲染
    this.updateProgressDOM(finalProgress, visitedPages.size);
  }

  /**
   * 檢查里程碑達成
   */
  checkMilestones() {
    const { currentProgress, milestones } = this.state;
    const newMilestones = [...milestones];
    let hasNewMilestone = false;

    console.log('🔍 Checking milestones:', {
      currentProgress,
      existingMilestones: milestones.map(m => `${m.name}(${m.threshold}%)`),
      allMilestones: this.milestoneConfig.map(
        m => `${m.name}(${m.threshold}%)`
      ),
    });

    this.milestoneConfig.forEach(milestone => {
      const alreadyAchieved = milestones.find(
        m => m.threshold === milestone.threshold
      );
      const shouldAchieve = currentProgress >= milestone.threshold;

      console.log(`📊 Milestone ${milestone.name}:`, {
        threshold: milestone.threshold,
        currentProgress,
        shouldAchieve,
        alreadyAchieved: !!alreadyAchieved,
      });

      if (shouldAchieve && !alreadyAchieved) {
        // 達成新里程碑
        newMilestones.push(milestone);
        hasNewMilestone = true;

        console.log('🎉 NEW MILESTONE ACHIEVED:', milestone.name);

        // 立即顯示成就通知
        setTimeout(() => {
          this.showMilestoneAchievement(milestone);
        }, 500);
      }
    });

    // 如果有新里程碑，更新狀態
    if (hasNewMilestone) {
      this.setState({ milestones: newMilestones });
      // 立即保存狀態
      this.saveStateToStorage();
      console.log('🎉 New milestones achieved! Total:', newMilestones.length);
    } else {
      console.log('📊 No new milestones to achieve');
    }
  }

  /**
   * 獲取當前里程碑
   */
  getCurrentMilestone() {
    const { currentProgress } = this.state;
    const achieved = this.milestoneConfig.filter(
      m => currentProgress >= m.threshold
    );
    const current = achieved.length > 0 ? achieved[achieved.length - 1] : null;

    console.log('🏆 getCurrentMilestone:', {
      currentProgress,
      achievedMilestones: achieved.map(m => `${m.name}(${m.threshold}%)`),
      currentMilestone: current
        ? `${current.name}(${current.threshold}%)`
        : 'none',
    });

    return current;
  }

  /**
   * 獲取下一個里程碑
   */
  getNextMilestone() {
    const { currentProgress } = this.state;
    return this.milestoneConfig.find(m => currentProgress < m.threshold);
  }

  /**
   * 顯示里程碑達成動畫
   */
  showMilestoneAchievement(milestone) {
    console.log('🎉 Showing milestone achievement:', milestone);

    if (!this.config) {
      this.config = this.getDefaultConfig();
    }

    // 創建成就通知
    const notification = document.createElement('div');
    notification.className = 'milestone-achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${milestone.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">恭喜達成！</div>
          <div class="achievement-name">${milestone.name}</div>
          <div class="achievement-desc">${milestone.description}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // 動畫效果 - 根據配置決定是否啟用動畫
    if (window.gsap && this.config.animationEnabled) {
      window.gsap
        .timeline()
        .fromTo(
          notification,
          { opacity: 0, scale: 0.5, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        )
        .to(notification, { opacity: 0, y: -50, duration: 0.3, delay: 3 })
        .call(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        });
    } else {
      // 無動畫直接顯示
      notification.style.opacity = '1';
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  }

  /**
   * 播放進度更新動畫
   */
  playProgressUpdateAnimation() {
    if (!this.config || !this.config.animationEnabled) return;

    const progressCircle = document.querySelector('.progress-fill-circle');
    const progressPulse = document.querySelector('.progress-pulse');

    if (window.gsap && progressCircle) {
      // 進度條動畫
      window.gsap.to(progressCircle, {
        strokeDashoffset: 339.292 * (1 - this.state.currentProgress / 100),
        duration: 1,
        ease: 'power2.out',
      });

      // 脈衝動畫
      if (progressPulse) {
        window.gsap.fromTo(
          progressPulse,
          { scale: 1, opacity: 0.8 },
          { scale: 1.2, opacity: 0, duration: 0.6, ease: 'power2.out' }
        );
      }
    }
  }

  /**
   * 顯示里程碑詳情
   */
  showMilestoneDetails(milestoneElement) {
    const threshold = milestoneElement.getAttribute('data-threshold');
    const milestone = this.milestoneConfig.find(m => m.threshold == threshold);

    if (milestone) {
      // 簡單的提示顯示
      console.log(`里程碑: ${milestone.name} - ${milestone.description}`);
    }
  }

  /**
   * 設置可見性
   */
  setVisibility(visible) {
    this.setState({ isVisible: visible });
  }

  /**
   * 重置進度狀態
   */
  resetProgress() {
    console.log('🔄 Resetting progress state...');

    // 清除存儲（根據配置決定用哪種存儲）
    const storageType = this.config?.storageType || 'localStorage';
    const storage =
      storageType === 'sessionStorage' ? sessionStorage : localStorage;
    storage.removeItem('progress-indicator-state');

    // 重置狀態到初始值
    this.setState({
      currentProgress: 0,
      totalPages: this.state.totalPages,
      visitedPages: new Set(),
      milestones: [],
    });

    this.saveStateToStorage();
    this.updateProgressDOM(0, 0);

    console.log(`✅ Progress reset complete (${storageType} cleared)`);
    console.log('🔧 Visit different pages to trigger milestone achievements!');
  }

  /**
   * 供測試使用：快速設置進度到指定百分比
   */
  setProgressForTesting(percentage) {
    const targetPages = Math.floor((percentage / 100) * this.state.totalPages);
    const routePaths = Object.keys(this.pageConfig);
    const visitedPages = new Set(routePaths.slice(0, targetPages));

    console.log(
      `🧪 Setting progress to ${percentage}% (${targetPages}/${this.state.totalPages} pages)`
    );

    this.setState({
      currentProgress: percentage,
      visitedPages: visitedPages,
      milestones: [], // 清空里程碑讓它重新計算
    });

    this.saveStateToStorage();
    this.checkMilestones(); // 觸發里程碑檢查
    this.updateProgressDOM(percentage, visitedPages.size);

    console.log('✅ Test progress set to', percentage + '%');
  }

  /**
   * 顯示當前進度詳情
   */
  showProgressDebug() {
    const stats = this.getProgressStats();
    console.log('📊 Current Progress Debug:', {
      state: this.state,
      localStorage: JSON.parse(
        localStorage.getItem('progress-indicator-state') || '{}'
      ),
      stats,
      pageConfig: this.pageConfig,
      milestoneConfig: this.milestoneConfig,
    });
    return stats;
  }

  /**
   * 獲取進度統計
   */
  getProgressStats() {
    const { currentProgress, visitedPages, totalPages, milestones } =
      this.state;

    return {
      progress: currentProgress,
      visitedCount: visitedPages.size,
      totalPages,
      completionRate: visitedPages.size / totalPages,
      milestonesAchieved: milestones.length,
      currentMilestone: this.getCurrentMilestone(),
      nextMilestone: this.getNextMilestone(),
    };
  }

  /**
   * 直接更新 DOM 元素，避免重新渲染
   */
  updateProgressDOM(progress, visitedCount) {
    try {
      // 更新進度百分比
      const progressPercentage = document.querySelector('.progress-percentage');
      const progressPercentageText = document.querySelector(
        '.progress-percentage-text'
      );

      if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(progress)}%`;
      }

      if (progressPercentageText) {
        progressPercentageText.textContent = `${Math.round(progress)}%`;
      }

      // 更新進度圓環
      const progressCircle = document.querySelector('.progress-fill-circle');
      if (progressCircle) {
        const strokeDashoffset = 339.292 * (1 - progress / 100);
        progressCircle.setAttribute('stroke-dashoffset', strokeDashoffset);
      }

      // 更新統計數字
      const visitedElement = document.querySelector('.progress-visited');
      const totalElement = document.querySelector('.progress-total');

      if (visitedElement) {
        visitedElement.textContent = visitedCount;
      }

      if (totalElement) {
        totalElement.textContent = this.state.totalPages;
      }

      // 更新里程碑圖標和名稱
      const currentMilestone = this.getCurrentMilestone();
      const milestoneIcon = document.querySelector('.progress-milestone-icon');
      const milestoneName = document.querySelector('.progress-milestone-name');

      console.log('🔍 DOM elements found:', {
        milestoneIcon: milestoneIcon ? 'found' : 'not found',
        milestoneName: milestoneName ? 'found' : 'not found',
        currentMilestone: currentMilestone ? currentMilestone.name : 'none',
      });

      // 如果有當前里程碑，更新圖標和名稱
      if (currentMilestone) {
        if (milestoneIcon) {
          milestoneIcon.textContent = currentMilestone.icon;
          console.log('✅ Updated milestone icon:', currentMilestone.icon);
        }
        if (milestoneName) {
          milestoneName.textContent = currentMilestone.name;
          console.log('✅ Updated milestone name:', currentMilestone.name);
        }
        console.log('🏆 Milestone updated:', currentMilestone.name);
      } else {
        console.log('🏆 No milestone to display');
      }

      // 更新里程碑進度條
      document
        .querySelectorAll('.progress-milestone')
        .forEach((milestoneEl, _index) => {
          const threshold = parseInt(
            milestoneEl.getAttribute('data-threshold')
          );
          if (progress >= threshold) {
            milestoneEl.classList.add('progress-milestone--achieved');
          } else {
            milestoneEl.classList.remove('progress-milestone--achieved');
          }
        });

      // 更新詳情面板內容
      this.updateDetailsPanelContent();

      console.log('📊 Progress DOM updated:', {
        progress,
        visitedCount,
        currentMilestone: currentMilestone?.name,
      });
    } catch (error) {
      console.error('📊 Progress DOM update failed:', error);
    }
  }

  /**
   * 更新詳情面板內容
   */
  updateDetailsPanelContent() {
    try {
      const { visitedPages, currentProgress, totalPages } = this.state;
      const currentMilestone = this.getCurrentMilestone();

      // 更新頁面狀態
      Object.entries(this.pageConfig).forEach(([path, _config]) => {
        const pageEl = document.querySelector(
          `.details-page[data-path="${path}"]`
        );
        if (pageEl) {
          const isVisited = visitedPages.has(path);
          const statusEl = pageEl.querySelector('.page-status');

          if (isVisited) {
            pageEl.classList.add('details-page--visited');
            if (statusEl) statusEl.textContent = '✅';
          } else {
            pageEl.classList.remove('details-page--visited');
            if (statusEl) statusEl.textContent = '⭕';
          }
        }
      });

      // 更新成就統計
      const achievementItems = document.querySelectorAll('.achievement-item');
      achievementItems.forEach(item => {
        const label = item.querySelector('.achievement-label')?.textContent;
        const valueEl = item.querySelector('.achievement-value');

        if (valueEl && label) {
          switch (label) {
            case '探索深度':
              valueEl.textContent = `${Math.round(currentProgress)}%`;
              break;
            case '頁面覆蓋':
              valueEl.textContent = `${visitedPages.size}/${totalPages}`;
              break;
            case '當前等級':
              valueEl.textContent = currentMilestone
                ? currentMilestone.name
                : '新手';
              break;
          }
        }
      });

      console.log('📋 Details panel content updated');
    } catch (error) {
      console.error('📋 Details panel update failed:', error);
    }
  }

  /**
   * 重新渲染組件
   */
  async rerender() {
    if (this.element) {
      try {
        const html = await this.render();
        const newElement = document.createElement('div');
        newElement.innerHTML = html;
        const newProgressIndicator = newElement.firstElementChild;

        // 替換元素並保持引用
        const parent = this.element.parentNode;
        const nextSibling = this.element.nextSibling;

        parent.removeChild(this.element);
        if (nextSibling) {
          parent.insertBefore(newProgressIndicator, nextSibling);
        } else {
          parent.appendChild(newProgressIndicator);
        }

        this.element = newProgressIndicator;

        // 重新綁定事件
        this.bindEvents();

        console.log('📊 ProgressIndicator rerendered');
      } catch (error) {
        console.error('📊 ProgressIndicator rerender failed:', error);
      }
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 清理定時器
    if (this.routeCheckInterval) {
      clearInterval(this.routeCheckInterval);
    }

    window.removeEventListener('scroll', this.handlePageScroll);

    // 清理事件處理器
    if (this.boundEventHandler) {
      document.removeEventListener('click', this.boundEventHandler);
    }

    super.destroy();
    console.log('📊 ProgressIndicator destroyed');
  }
}
