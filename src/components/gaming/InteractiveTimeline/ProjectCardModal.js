/**
 * ProjectCardModal - 飛出卡片彈窗組件
 *
 * 職責：
 * - 專案詳情卡片的創建和渲染
 * - 卡片飛出動畫（從節點到模態框）
 * - 卡片關閉和收回動畫（從模態框回到節點）
 * - 模態框互動管理（點擊外部關閉、鍵盤導航）
 * - 卡片內容動態生成和配置
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class ProjectCardModal extends BaseComponent {
  constructor(config = {}) {
    super();

    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();

    // 卡片相關屬性
    this.currentCard = null;
    this.backdrop = null;
    this.sourceNode = null;
    this.isAnimating = false;
    this.isOpen = false;

    // 事件回調
    this.onCardOpen = null;
    this.onCardClose = null;
    this.onCardClick = null;
  }

  getDefaultConfig() {
    return {
      // 卡片樣式配置
      card: {
        width: '95%',
        maxWidth: '900px',
        height: '92%',
        maxHeight: '800px',
        borderRadius: '15px',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '2px solid rgba(212, 175, 55, 0.6)',
        boxShadow:
          '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.3)',
      },

      // 動畫配置
      animations: {
        enabled: true,
        flyOutDuration: 0.8,
        flyBackDuration: 0.6,
        modalFadeDuration: 0.3,
        stagger: 0.1,
        easing: {
          flyOut: 'power2.out',
          flyBack: 'power2.inOut',
          modal: 'power1.inOut',
        },
      },

      // 飛出軌跡配置
      trajectory: {
        type: 'arc', // 'arc', 'spiral', 'direct'
        intensity: 1.2,
        rotations: 2,
        randomOffset: 0.1,
      },

      // 互動配置
      interaction: {
        closeOnOutsideClick: true,
        closeOnEscape: true,
        preventBodyScroll: false, // 暫時關閉，避免影響背景顯示
        focusManagement: true,
      },

      // 背景遮罩配置
      backdrop: {
        enabled: true,
        background: 'rgba(0, 0, 0, 0.7)', // 使用較深的黑色半透明遮罩
        backdropFilter: '', // 暫時移除模糊效果避免變白
        zIndex: 9999,
        animationDuration: 0.3,
      },

      // 內容配置
      content: {
        showThumbnail: true,
        showTechnology: true,
        showStats: true,
        showLinks: true,
        showDescription: true,
        maxDescriptionLength: 500,
      },

      // 響應式配置
      responsive: {
        mobile: {
          card: { width: '98%', height: '95%' },
          animations: { flyOutDuration: 0.6 },
        },
        tablet: {
          card: { width: '90%', height: '85%' },
          animations: { flyOutDuration: 0.7 },
        },
        desktop: {
          card: { width: '95%', height: '92%' },
          animations: { flyOutDuration: 0.8 },
        },
      },
    };
  }

  getInitialState() {
    return {
      currentBreakpoint: 'desktop',
      animationTimeline: null,
      isModalOpen: false,
      focusedElement: null,
      scrollPosition: 0,
    };
  }

  /**
   * 初始化卡片模態框系統
   * @param {Object} callbacks - 事件回調函數
   */
  initialize(callbacks = {}) {
    this.onCardOpen = callbacks.onCardOpen || (() => {});
    this.onCardClose = callbacks.onCardClose || (() => {});
    this.onCardClick = callbacks.onCardClick || (() => {});

    this.setupGlobalEventListeners();

    console.log('[ProjectCardModal] 卡片模態框系統初始化完成');
  }

  /**
   * 設置全域事件監聽
   */
  setupGlobalEventListeners() {
    // ESC 鍵關閉
    if (this.config.interaction.closeOnEscape) {
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.isOpen) {
          this.closeCard();
        }
      });
    }
  }

  /**
   * 創建並顯示專案卡片
   * @param {Object} project - 專案數據
   * @param {HTMLElement} sourceNode - 源節點元素
   * @param {number} index - 專案索引
   */
  showProjectCard(project, sourceNode, index = 0) {
    if (this.isAnimating || this.isOpen) {
      console.warn('[ProjectCardModal] 卡片正在顯示或動畫中');
      return;
    }

    this.sourceNode = sourceNode;
    this.isAnimating = true;

    // 防止重複創建
    this.removeExistingCard();

    // 創建背景遮罩
    if (this.config.backdrop.enabled) {
      this.createBackdrop();
    }

    // 創建卡片
    const card = this.createProjectCard(project, sourceNode);
    this.currentCard = card;

    // 計算飛出軌跡
    const trajectory = this.calculateCardTrajectory(sourceNode);

    // 執行飛出動畫
    this.animateCardFlyOut(card, trajectory, () => {
      this.isAnimating = false;
      this.isOpen = true;
      this.onCardOpen(project, sourceNode, index);
    });

    console.log(`[ProjectCardModal] 顯示專案卡片: ${project.title}`);
  }

  /**
   * 創建背景遮罩
   */
  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'project-card-backdrop';

    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.config.backdrop.background};
      z-index: ${this.config.backdrop.zIndex};
      opacity: 0;
      transition: opacity ${this.config.backdrop.animationDuration}s ease;
      cursor: pointer;
    `;

    // 點擊背景關閉
    if (this.config.interaction.closeOnOutsideClick) {
      this.backdrop.addEventListener('click', () => {
        this.closeCard();
      });
    }

    document.body.appendChild(this.backdrop);

    // 淡入動畫
    requestAnimationFrame(() => {
      this.backdrop.style.opacity = '1';
    });

    console.log('[ProjectCardModal] 背景遮罩已創建');
  }

  /**
   * 創建專案詳情卡片
   */
  createProjectCard(project, sourceNode) {
    const card = document.createElement('div');
    card.className = 'project-flying-card';

    // 獲取節點的世界座標作為起始位置
    const nodeRect = sourceNode.getBoundingClientRect();
    const startX = nodeRect.left + nodeRect.width / 2;
    const startY = nodeRect.top + nodeRect.height / 2;

    // 設置卡片樣式
    this.applyCardStyles(card);

    // 設置初始位置（節點位置）
    card.style.left = `${startX}px`;
    card.style.top = `${startY}px`;
    card.style.transform = 'translate(-50%, -50%) scale(0.1)';
    card.style.opacity = '0';

    // 創建卡片內容
    this.createCardContent(card, project);

    // 設置事件監聽
    this.setupCardEventListeners(card, project);

    document.body.appendChild(card);
    return card;
  }

  /**
   * 應用卡片樣式
   */
  applyCardStyles(card) {
    const cardConfig = this.getCurrentCardConfig();

    card.style.cssText = `
      position: fixed;
      width: ${cardConfig.width};
      max-width: ${cardConfig.maxWidth};
      height: ${cardConfig.height};
      max-height: ${cardConfig.maxHeight};
      border-radius: ${cardConfig.borderRadius};
      background: ${cardConfig.background};
      border: ${cardConfig.border};
      box-shadow: ${cardConfig.boxShadow};
      z-index: 10000;
      overflow-y: auto;
      overflow-x: hidden;
      cursor: default;
      user-select: text;
      -webkit-overflow-scrolling: touch;
    `;
  }

  /**
   * 創建卡片內容
   */
  createCardContent(card, project) {
    const content = `
      <div class="card-header">
        <button class="card-close-btn" aria-label="關閉">×</button>
        <div class="card-category ${project.category || 'default'}">${this.getCategoryName(project.category)}</div>
        <h2 class="card-title">${project.title}</h2>
        <div class="card-date">${project.date}</div>
      </div>
      
      <div class="card-body">
        ${
          this.config.content.showThumbnail && project.thumbnail
            ? `
          <div class="card-thumbnail">
            <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
          </div>
        `
            : ''
        }
        
        ${
          this.config.content.showDescription
            ? `
          <div class="card-description">
            <h3>專案描述</h3>
            <p>${this.truncateDescription(project.description || project.shortDescription || '暫無描述')}</p>
          </div>
        `
            : ''
        }
        
        ${
          this.config.content.showTechnology && project.technologies
            ? `
          <div class="card-technologies">
            <h3>技術棧</h3>
            <div class="tech-tags">
              ${project.technologies
                .map(
                  tech => `
                <span class="tech-tag ${tech.category || 'default'}">${tech.name || tech}</span>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
        
        ${
          this.config.content.showStats && project.stats
            ? `
          <div class="card-stats">
            <h3>專案統計</h3>
            <div class="stats-grid">
              ${Object.entries(project.stats)
                .map(
                  ([key, value]) => `
                <div class="stat-item">
                  <div class="stat-label">${this.getStatLabel(key)}</div>
                  <div class="stat-value">${value}</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
        
        ${
          project.highlights
            ? `
          <div class="card-highlights">
            <h3>技術亮點</h3>
            <ul class="highlights-list">
              ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
        
        ${
          this.config.content.showLinks && project.links
            ? `
          <div class="card-links">
            <h3>相關連結</h3>
            <div class="links-grid">
              ${Object.entries(project.links)
                .map(
                  ([key, url]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="link-btn ${key}">
                  ${this.getLinkIcon(key)} ${this.getLinkLabel(key)}
                </a>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;

    card.innerHTML = content;

    // 添加內部樣式
    this.addCardInternalStyles(card);
  }

  /**
   * 設置卡片事件監聽
   */
  setupCardEventListeners(card, project) {
    // 關閉按鈕
    const closeBtn = card.querySelector('.card-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', event => {
        event.stopPropagation();
        this.closeCard();
      });
    }

    // 點擊外部關閉 (現在由背景遮罩處理，這裡做為備用)
    if (
      this.config.interaction.closeOnOutsideClick &&
      !this.config.backdrop.enabled
    ) {
      setTimeout(() => {
        document.addEventListener(
          'click',
          this.handleOutsideClick.bind(this, card),
          { once: true }
        );
      }, 100);
    }

    // 防止卡片內部點擊冒泡
    card.addEventListener('click', event => {
      event.stopPropagation();
      this.onCardClick(project, event);
    });

    // 焦點管理
    if (this.config.interaction.focusManagement) {
      this.manageFocus(card);
    }

    // 防止背景滾動（使用更溫和的方式，避免影響背景顯示）
    if (this.config.interaction.preventBodyScroll) {
      this.state.scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      // 註釋掉 position: fixed，因為它會影響背景顯示
      // document.body.style.position = 'fixed';
      // document.body.style.top = `-${this.state.scrollPosition}px`;
      // document.body.style.width = '100%';
    }
  }

  /**
   * 計算卡片飛出軌跡
   */
  calculateCardTrajectory(sourceNode) {
    const nodeRect = sourceNode.getBoundingClientRect();
    const startX = nodeRect.left + nodeRect.width / 2;
    const startY = nodeRect.top + nodeRect.height / 2;

    // 目標位置（螢幕中心）
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;

    const trajectory = {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      distance: Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      ),
    };

    // 根據軌跡類型添加控制點
    if (this.config.trajectory.type === 'arc') {
      const midX = (startX + endX) / 2;
      const midY =
        (startY + endY) / 2 -
        trajectory.distance * 0.3 * this.config.trajectory.intensity;
      trajectory.control = { x: midX, y: midY };
    } else if (this.config.trajectory.type === 'spiral') {
      trajectory.rotations = this.config.trajectory.rotations;
    }

    return trajectory;
  }

  /**
   * 執行卡片飛出動畫
   */
  animateCardFlyOut(card, trajectory, onComplete) {
    if (!window.gsap) {
      // 無 GSAP 時的後備方案
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.transform = 'translate(-50%, -50%) scale(1)';
      card.style.opacity = '1';
      onComplete();
      return;
    }

    const duration = this.getCurrentAnimationDuration('flyOut');
    const timeline = gsap.timeline({
      onComplete: onComplete,
    });

    // 第一階段：從節點飛出並旋轉
    timeline.to(card, {
      x: trajectory.control
        ? trajectory.control.x - trajectory.start.x
        : trajectory.end.x - trajectory.start.x,
      y: trajectory.control
        ? trajectory.control.y - trajectory.start.y
        : trajectory.end.y - trajectory.start.y,
      scale: 0.6,
      rotation: 360 * this.config.trajectory.rotations,
      opacity: 0.8,
      duration: duration * 0.6,
      ease: this.config.animations.easing.flyOut,
    });

    // 第二階段：到達中心並展開
    if (trajectory.control) {
      timeline.to(card, {
        x: trajectory.end.x - trajectory.start.x,
        y: trajectory.end.y - trajectory.start.y,
        scale: 1,
        rotation: 360 * this.config.trajectory.rotations,
        opacity: 1,
        duration: duration * 0.4,
        ease: 'power2.out',
      });
    } else {
      timeline.to(card, {
        scale: 1,
        rotation: 360 * this.config.trajectory.rotations,
        opacity: 1,
        duration: duration * 0.4,
        ease: 'power2.out',
      });
    }

    // 內容動畫
    const cardContent = card.querySelectorAll(
      '.card-header > *, .card-body > *'
    );
    timeline.fromTo(
      cardContent,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: this.config.animations.stagger,
        duration: 0.3,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    this.state.animationTimeline = timeline;
  }

  /**
   * 關閉卡片
   */
  closeCard() {
    if (!this.currentCard || this.isAnimating) return;

    this.isAnimating = true;
    this.isOpen = false;

    // 執行收回動畫
    this.animateCardFlyBack(this.currentCard, () => {
      this.removeCard(this.currentCard);
      this.currentCard = null;
      this.sourceNode = null;
      this.isAnimating = false;
      this.onCardClose();
    });
  }

  /**
   * 執行卡片收回動畫
   */
  animateCardFlyBack(card, onComplete) {
    // 先淡出背景遮罩
    if (this.backdrop) {
      this.backdrop.style.opacity = '0';
    }

    if (!window.gsap || !this.sourceNode) {
      this.removeCard(card);
      onComplete();
      return;
    }

    const sourceRect = this.sourceNode.getBoundingClientRect();
    const currentRect = card.getBoundingClientRect();

    const targetX =
      sourceRect.left +
      sourceRect.width / 2 -
      currentRect.left -
      currentRect.width / 2;
    const targetY =
      sourceRect.top +
      sourceRect.height / 2 -
      currentRect.top -
      currentRect.height / 2;

    const duration = this.getCurrentAnimationDuration('flyBack');

    const timeline = gsap.timeline({
      onComplete: onComplete,
    });

    // 淡出內容
    timeline.to(card.querySelectorAll('.card-header > *, .card-body > *'), {
      y: -20,
      opacity: 0,
      stagger: this.config.animations.stagger / 2,
      duration: 0.2,
      ease: 'power2.in',
    });

    // 收回到節點
    timeline.to(
      card,
      {
        x: targetX,
        y: targetY,
        scale: 0.1,
        rotation: -180,
        opacity: 0,
        duration: duration,
        ease: this.config.animations.easing.flyBack,
      },
      '-=0.1'
    );
  }

  /**
   * 處理點擊外部關閉
   */
  handleOutsideClick(card, event) {
    if (!card.contains(event.target)) {
      this.closeCard();
    }
  }

  /**
   * 移除現有卡片
   */
  removeExistingCard() {
    const existingCard = document.querySelector('.project-flying-card');
    if (existingCard) {
      this.removeCard(existingCard);
    }

    // 移除現有背景遮罩
    const existingBackdrop = document.querySelector('.project-card-backdrop');
    if (existingBackdrop) {
      this.removeBackdrop(existingBackdrop);
    }
  }

  /**
   * 移除卡片
   */
  removeCard(card) {
    if (card && card.parentNode) {
      card.parentNode.removeChild(card);
    }

    // 移除背景遮罩
    if (this.backdrop) {
      this.removeBackdrop(this.backdrop);
    }

    // 恢復背景滾動
    if (this.config.interaction.preventBodyScroll) {
      document.body.style.overflow = '';
      // 由於我們沒有設置 position: fixed，所以也不需要恢復這些屬性
      // document.body.style.position = '';
      // document.body.style.top = '';
      // document.body.style.width = '';
      // window.scrollTo(0, this.state.scrollPosition);
    }

    // 恢復焦點
    if (this.state.focusedElement) {
      this.state.focusedElement.focus();
      this.state.focusedElement = null;
    }
  }

  /**
   * 移除背景遮罩
   */
  removeBackdrop(backdrop) {
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }

    if (this.backdrop === backdrop) {
      this.backdrop = null;
    }
  }

  /**
   * 焦點管理
   */
  manageFocus(card) {
    this.state.focusedElement = document.activeElement;

    // 使卡片可獲得焦點
    card.setAttribute('tabindex', '-1');
    card.focus();

    // 限制焦點在模態框內
    const focusableElements = card.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    card.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastFocusable
        ) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  /**
   * 工具方法 - 獲取分類名稱
   */
  getCategoryName(category) {
    const categoryMap = {
      backend: '後端系統',
      frontend: '前端開發',
      fullstack: '全端開發',
      architecture: '系統架構',
      opensource: '開源專案',
      default: '其他',
    };
    return categoryMap[category] || categoryMap.default;
  }

  /**
   * 工具方法 - 截斷描述文字
   */
  truncateDescription(text) {
    const maxLength = this.config.content.maxDescriptionLength;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * 工具方法 - 獲取統計標籤
   */
  getStatLabel(key) {
    const labelMap = {
      complexity: '複雜度',
      innovation: '創新性',
      utility: '實用性',
      developmentTime: '開發時間',
      teamSize: '團隊規模',
      linesOfCode: '代碼行數',
      services: '服務數量',
      apis: 'API 數量',
    };
    return labelMap[key] || key;
  }

  /**
   * 工具方法 - 獲取連結圖標
   */
  getLinkIcon(type) {
    const iconMap = {
      github: '🔗',
      demo: '🚀',
      documentation: '📚',
      article: '📝',
      website: '🌐',
    };
    return iconMap[type] || '🔗';
  }

  /**
   * 工具方法 - 獲取連結標籤
   */
  getLinkLabel(type) {
    const labelMap = {
      github: 'GitHub',
      demo: '線上演示',
      documentation: '說明文檔',
      article: '技術文章',
      website: '官方網站',
    };
    return labelMap[type] || type;
  }

  /**
   * 獲取當前卡片配置
   */
  getCurrentCardConfig() {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    return { ...this.config.card, ...responsive?.card };
  }

  /**
   * 獲取當前動畫持續時間
   */
  getCurrentAnimationDuration(type) {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    const animations = { ...this.config.animations, ...responsive?.animations };

    switch (type) {
      case 'flyOut':
        return animations.flyOutDuration;
      case 'flyBack':
        return animations.flyBackDuration;
      case 'modal':
        return animations.modalFadeDuration;
      default:
        return animations.flyOutDuration;
    }
  }

  /**
   * 更新響應式斷點
   */
  updateBreakpoint(breakpoint) {
    this.state.currentBreakpoint = breakpoint;
    console.log(`[ProjectCardModal] 斷點更新: ${breakpoint}`);
  }

  /**
   * 添加卡片內部樣式
   */
  addCardInternalStyles(card) {
    const style = document.createElement('style');
    style.textContent = `
      .project-flying-card * {
        box-sizing: border-box;
      }
      
      .card-header {
        position: relative;
        padding: 20px 25px 15px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
      }
      
      .card-close-btn {
        position: absolute;
        top: 15px;
        right: 20px;
        width: 35px;
        height: 35px;
        background: rgba(139, 0, 0, 0.8);
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      
      .card-close-btn:hover {
        background: rgba(139, 0, 0, 1);
        transform: scale(1.1);
      }
      
      .card-category {
        display: inline-block;
        padding: 4px 12px;
        background: linear-gradient(135deg, #d4af37, #f4d03f);
        color: #000;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      
      .card-title {
        color: #d4af37;
        font-size: 24px;
        font-weight: bold;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }
      
      .card-date {
        color: #aaa;
        font-size: 14px;
      }
      
      .card-body {
        padding: 20px 25px;
        color: #ffffff;
        line-height: 1.6;
      }
      
      .card-body h3 {
        color: #d4af37;
        font-size: 18px;
        margin: 25px 0 15px 0;
        border-left: 3px solid #d4af37;
        padding-left: 12px;
      }
      
      .card-body h3:first-child {
        margin-top: 0;
      }
      
      .card-thumbnail img {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      
      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .tech-tag {
        padding: 4px 10px;
        background: rgba(212, 175, 55, 0.2);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 16px;
        font-size: 12px;
        color: #d4af37;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
      }
      
      .stat-item {
        background: rgba(0, 0, 0, 0.3);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }
      
      .stat-label {
        font-size: 11px;
        color: #aaa;
        text-transform: uppercase;
        margin-bottom: 5px;
      }
      
      .stat-value {
        font-size: 16px;
        font-weight: bold;
        color: #d4af37;
      }
      
      .highlights-list {
        margin: 0;
        padding-left: 20px;
      }
      
      .highlights-list li {
        margin-bottom: 8px;
        color: #fff;
      }
      
      .links-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: linear-gradient(135deg, #d4af37, #f4d03f);
        color: #000;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .link-btn:hover {
        background: linear-gradient(135deg, #f4d03f, #ffeb3b);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      }
      
      @media (max-width: 768px) {
        .card-header {
          padding: 15px 20px 12px;
        }
        
        .card-body {
          padding: 15px 20px;
        }
        
        .card-title {
          font-size: 20px;
        }
        
        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
        }
        
        .links-grid {
          flex-direction: column;
        }
        
        .link-btn {
          justify-content: center;
        }
      }
    `;

    card.appendChild(style);
  }

  /**
   * 獲取當前狀態
   */
  getState() {
    return {
      isOpen: this.isOpen,
      isAnimating: this.isAnimating,
      currentCard: this.currentCard,
      sourceNode: this.sourceNode,
      breakpoint: this.state.currentBreakpoint,
    };
  }

  /**
   * 銷毀卡片模態框系統
   */
  destroy() {
    // 關閉當前卡片
    if (this.isOpen) {
      this.closeCard();
    }

    // 停止動畫
    if (this.state.animationTimeline) {
      this.state.animationTimeline.kill();
    }

    if (window.gsap && this.currentCard) {
      gsap.killTweensOf(this.currentCard);
    }

    // 清理引用
    this.currentCard = null;
    this.backdrop = null;
    this.sourceNode = null;
    this.onCardOpen = null;
    this.onCardClose = null;
    this.onCardClick = null;

    console.log('[ProjectCardModal] 卡片模態框系統已銷毀');
  }
}

export default ProjectCardModal;
