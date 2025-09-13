/**
 * SkillAnimationController - 技能動畫控制器
 *
 * 管理技能樹的動畫效果，包括：
 * - 狀態變化動畫
 * - 技能點亮/熄滅效果
 * - 路徑高亮動畫
 * - 粒子效果整合
 *
 * @author Claude
 * @version 2.1.4
 */

import { EventManager } from '../../../core/events/EventManager.js';

/**
 * 動畫類型常量
 */
export const AnimationType = {
  STATUS_CHANGE: 'status-change',
  SKILL_UNLOCK: 'skill-unlock',
  SKILL_MASTER: 'skill-master',
  PATH_HIGHLIGHT: 'path-highlight',
  GLOW_PULSE: 'glow-pulse',
  PARTICLE_BURST: 'particle-burst',
};

/**
 * 動畫配置
 */
export const AnimationConfig = {
  [AnimationType.STATUS_CHANGE]: {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['opacity', 'transform', 'filter'],
  },
  [AnimationType.SKILL_UNLOCK]: {
    duration: 800,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    properties: ['scale', 'opacity', 'glow'],
    particles: true,
  },
  [AnimationType.SKILL_MASTER]: {
    duration: 1200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    properties: ['scale', 'glow', 'color'],
    particles: true,
    sound: 'skill-mastered',
  },
  [AnimationType.PATH_HIGHLIGHT]: {
    duration: 400,
    easing: 'ease-out',
    properties: ['stroke-opacity', 'stroke-width'],
  },
  [AnimationType.GLOW_PULSE]: {
    duration: 2000,
    easing: 'ease-in-out',
    loop: true,
    properties: ['glow-intensity'],
  },
  [AnimationType.PARTICLE_BURST]: {
    duration: 1000,
    particles: {
      count: 20,
      spread: 360,
      velocity: 50,
    },
  },
};

export class SkillAnimationController extends EventManager {
  constructor(container, stateManager) {
    super();

    this.container = container;
    this.stateManager = stateManager;

    // 動畫隊列
    this.animationQueue = [];
    this.runningAnimations = new Map();

    // 動畫設置
    this.animationsEnabled = true;
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // 初始化
    this.init();
  }

  /**
   * 初始化動畫控制器
   */
  init() {
    console.log('SkillAnimationController: 初始化動畫控制器');

    // 監聽狀態變化
    this.bindStateEvents();

    // 監聽媒體查詢變化
    this.bindMediaQueries();

    // 設置 CSS 自定義屬性
    this.setupCSSProperties();
  }

  /**
   * 綁定狀態事件
   */
  bindStateEvents() {
    if (!this.stateManager) return;

    // 監聽技能狀態變化
    this.stateManager.on('skill-status-changed', event => {
      this.handleSkillStatusChange(event);
    });

    // 監聽批量狀態重計算
    this.stateManager.on('skill-states-recalculated', event => {
      this.handleBatchStateUpdate(event);
    });
  }

  /**
   * 綁定媒體查詢
   */
  bindMediaQueries() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(e => {
      this.reducedMotion = e.matches;
      console.log(
        `SkillAnimationController: 減少動畫設置 = ${this.reducedMotion}`
      );
    });
  }

  /**
   * 設置 CSS 自定義屬性
   */
  setupCSSProperties() {
    const root = document.documentElement;

    // 設置動畫相關的 CSS 變數
    root.style.setProperty('--skill-animation-duration', '600ms');
    root.style.setProperty('--skill-glow-color-mastered', '#f4d03f');
    root.style.setProperty('--skill-glow-color-available', '#3498db');
    root.style.setProperty('--skill-glow-color-learning', '#2ecc71');
  }

  /**
   * 處理技能狀態變化
   */
  handleSkillStatusChange({ skillId, oldStatus, newStatus, state: _state }) {
    console.log(
      `SkillAnimationController: 處理狀態變化 ${skillId}: ${oldStatus} -> ${newStatus}`
    );

    // 找到對應的 DOM 元素
    const skillElement = this.findSkillElement(skillId);
    if (!skillElement) {
      console.warn(`SkillAnimationController: 找不到技能元素 ${skillId}`);
      return;
    }

    // 根據狀態變化類型選擇動畫
    let animationType;

    if (newStatus === 'mastered' && oldStatus !== 'mastered') {
      animationType = AnimationType.SKILL_MASTER;
    } else if (newStatus === 'available' && oldStatus === 'locked') {
      animationType = AnimationType.SKILL_UNLOCK;
    } else {
      animationType = AnimationType.STATUS_CHANGE;
    }

    // 執行動畫
    this.animateSkillStatusChange(
      skillElement,
      animationType,
      oldStatus,
      newStatus
    );
  }

  /**
   * 處理批量狀態更新
   */
  handleBatchStateUpdate({ rounds, states: _states }) {
    console.log('SkillAnimationController: 處理批量狀態更新');

    // 對於批量更新，使用較短的動畫以避免過於混亂
    if (rounds > 1) {
      this.animateMultipleStateChanges();
    }
  }

  /**
   * 動畫技能狀態變化
   */
  animateSkillStatusChange(element, animationType, oldStatus, newStatus) {
    if (!this.animationsEnabled || this.reducedMotion) {
      this.applyFinalState(element, newStatus);
      return;
    }

    const config = AnimationConfig[animationType];
    const animationId = `${element.id}-${Date.now()}`;

    // 停止任何正在運行的動畫
    this.stopElementAnimations(element);

    // 創建動畫時間軸
    const timeline = this.createAnimationTimeline(
      element,
      animationType,
      config,
      newStatus
    );

    // 記錄動畫
    this.runningAnimations.set(animationId, {
      element,
      timeline,
      type: animationType,
      startTime: Date.now(),
    });

    // 執行動畫
    timeline
      .play()
      .then(() => {
        this.runningAnimations.delete(animationId);
        this.applyFinalState(element, newStatus);

        // 發送動畫完成事件
        this.emit('animation-complete', {
          skillId: element.id,
          animationType,
          newStatus,
        });
      })
      .catch(error => {
        console.error('SkillAnimationController: 動畫執行失敗', error);
        this.runningAnimations.delete(animationId);
        this.applyFinalState(element, newStatus);
      });
  }

  /**
   * 創建動畫時間軸
   */
  createAnimationTimeline(element, animationType, config, newStatus) {
    const keyframes = this.generateKeyframes(animationType, newStatus);
    const options = {
      duration: config.duration,
      easing: config.easing,
      fill: 'forwards',
    };

    // 如果支持 Web Animations API
    if (element.animate) {
      return element.animate(keyframes, options);
    }

    // 降級到 CSS 動畫
    return this.fallbackToCSS(element, keyframes, options);
  }

  /**
   * 生成關鍵幀
   */
  generateKeyframes(animationType, newStatus) {
    const keyframes = [];

    switch (animationType) {
      case AnimationType.SKILL_MASTER:
        keyframes.push(
          {
            transform: 'scale(1)',
            filter: 'brightness(1) drop-shadow(0 0 0px #f4d03f)',
            offset: 0,
          },
          {
            transform: 'scale(1.3)',
            filter: 'brightness(1.5) drop-shadow(0 0 20px #f4d03f)',
            offset: 0.5,
          },
          {
            transform: 'scale(1)',
            filter: 'brightness(1.2) drop-shadow(0 0 10px #f4d03f)',
            offset: 1,
          }
        );
        break;

      case AnimationType.SKILL_UNLOCK:
        keyframes.push(
          {
            transform: 'scale(1)',
            opacity: '0.4',
            filter: 'brightness(0.6)',
            offset: 0,
          },
          {
            transform: 'scale(1.15)',
            opacity: '1',
            filter: 'brightness(1.3) drop-shadow(0 0 15px #3498db)',
            offset: 0.7,
          },
          {
            transform: 'scale(1)',
            opacity: '0.8',
            filter: 'brightness(1) drop-shadow(0 0 5px #3498db)',
            offset: 1,
          }
        );
        break;

      case AnimationType.STATUS_CHANGE:
      default: {
        const statusConfig = this.getStatusVisualConfig(newStatus);
        keyframes.push(
          {
            opacity: '0.5',
            transform: 'scale(0.95)',
            offset: 0,
          },
          {
            opacity: statusConfig.opacity.toString(),
            transform: 'scale(1)',
            filter: statusConfig.filter,
            offset: 1,
          }
        );
        break;
      }
    }

    return keyframes;
  }

  /**
   * 獲取狀態視覺配置
   */
  getStatusVisualConfig(status) {
    const configs = {
      mastered: {
        opacity: 1.0,
        filter: 'brightness(1.2) drop-shadow(0 0 8px #f4d03f)',
      },
      available: {
        opacity: 0.8,
        filter: 'brightness(1) drop-shadow(0 0 5px #3498db)',
      },
      learning: {
        opacity: 0.7,
        filter: 'brightness(1) drop-shadow(0 0 5px #2ecc71)',
      },
      locked: {
        opacity: 0.4,
        filter: 'brightness(0.6)',
      },
    };

    return configs[status] || configs.locked;
  }

  /**
   * 應用最終狀態
   */
  applyFinalState(element, newStatus) {
    const config = this.getStatusVisualConfig(newStatus);

    element.style.opacity = config.opacity;
    element.style.filter = config.filter;

    // 更新 CSS 類
    element.className = element.className.replace(/skill-status-\w+/g, '');
    element.classList.add(`skill-status-${newStatus}`);

    // 更新可交互性
    const clickable = ['mastered', 'available', 'learning'].includes(newStatus);
    element.style.pointerEvents = clickable ? 'auto' : 'none';

    if (clickable) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-disabled', 'false');
    } else {
      element.removeAttribute('tabindex');
      element.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * 動畫多個狀態變化
   */
  animateMultipleStateChanges() {
    // 為避免視覺混亂，使用全域脈沖效果
    if (this.container) {
      this.container.style.animation = 'skill-tree-update 800ms ease-out';

      setTimeout(() => {
        this.container.style.animation = '';
      }, 800);
    }
  }

  /**
   * 動畫路徑高亮
   */
  animatePathHighlight(pathElements, highlight = true) {
    if (!this.animationsEnabled || this.reducedMotion) return;

    pathElements.forEach(element => {
      if (!element) return;

      const keyframes = highlight
        ? [
            { strokeOpacity: '0.2', strokeWidth: '2px', offset: 0 },
            { strokeOpacity: '0.8', strokeWidth: '3px', offset: 1 },
          ]
        : [
            { strokeOpacity: '0.8', strokeWidth: '3px', offset: 0 },
            { strokeOpacity: '0.2', strokeWidth: '2px', offset: 1 },
          ];

      const options = {
        duration: AnimationConfig[AnimationType.PATH_HIGHLIGHT].duration,
        easing: AnimationConfig[AnimationType.PATH_HIGHLIGHT].easing,
        fill: 'forwards',
      };

      if (element.animate) {
        element.animate(keyframes, options);
      }
    });
  }

  /**
   * 停止元素動畫
   */
  stopElementAnimations(element) {
    // 停止 Web Animations API 動畫
    if (element.getAnimations) {
      element.getAnimations().forEach(animation => {
        animation.cancel();
      });
    }

    // 清除 CSS 動畫
    element.style.animation = '';
  }

  /**
   * 找到技能元素
   */
  findSkillElement(skillId) {
    if (!this.container) return null;

    // 多種選擇器嘗試
    const selectors = [
      `#${skillId}`,
      `[data-skill-id="${skillId}"]`,
      `.skill-node[data-id="${skillId}"]`,
    ];

    for (const selector of selectors) {
      const element = this.container.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  /**
   * CSS 動畫降級
   */
  fallbackToCSS(element, keyframes, options) {
    // 創建 CSS 動畫類名
    const animationClass = `skill-animation-${Date.now()}`;

    // 生成 CSS 規則
    const cssRule = this.generateCSSAnimation(
      animationClass,
      keyframes,
      options
    );

    // 添加樣式
    const style = document.createElement('style');
    style.textContent = cssRule;
    document.head.appendChild(style);

    // 應用動畫
    element.classList.add(animationClass);

    // 返回 Promise 模擬 Web Animations API
    return new Promise(resolve => {
      setTimeout(() => {
        element.classList.remove(animationClass);
        document.head.removeChild(style);
        resolve();
      }, options.duration);
    });
  }

  /**
   * 生成 CSS 動畫規則
   */
  generateCSSAnimation(className, keyframes, options) {
    let css = `@keyframes ${className} {\n`;

    keyframes.forEach(frame => {
      const percentage = (frame.offset * 100).toFixed(1);
      css += `  ${percentage}% {\n`;

      Object.entries(frame).forEach(([prop, value]) => {
        if (prop !== 'offset') {
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          css += `    ${cssProp}: ${value};\n`;
        }
      });

      css += `  }\n`;
    });

    css += `}\n`;
    css += `.${className} {\n`;
    css += `  animation: ${className} ${options.duration}ms ${options.easing} ${options.fill};\n`;
    css += `}\n`;

    return css;
  }

  /**
   * 設置動畫啟用狀態
   */
  setAnimationsEnabled(enabled) {
    this.animationsEnabled = enabled;
    console.log(`SkillAnimationController: 動畫啟用 = ${enabled}`);
  }

  /**
   * 清除所有動畫
   */
  clearAllAnimations() {
    // 停止所有運行中的動畫
    for (const [_id, animation] of this.runningAnimations) {
      if (animation.timeline && animation.timeline.cancel) {
        animation.timeline.cancel();
      }
      this.stopElementAnimations(animation.element);
    }

    this.runningAnimations.clear();
    this.animationQueue = [];

    console.log('SkillAnimationController: 已清除所有動畫');
  }

  /**
   * 銷毀動畫控制器
   */
  destroy() {
    this.clearAllAnimations();

    // 解除事件監聽
    if (this.stateManager) {
      this.stateManager.off('skill-status-changed');
      this.stateManager.off('skill-states-recalculated');
    }

    console.log('SkillAnimationController: 動畫控制器已銷毀');
  }
}

export default SkillAnimationController;
