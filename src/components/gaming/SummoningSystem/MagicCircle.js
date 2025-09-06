// @ts-nocheck
/**
 * MagicCircle - SVG 魔法陣組件
 * 
 * 基於 POC-003 設計，實現遊戲王風格的魔法陣動畫：
 * - outer-ring (外環) → 逆時針旋轉
 * - middle-ring (中環) → 順時針旋轉  
 * - inner-ring (內環) → 快速逆時針旋轉
 * - runes (符文) → 依序點亮
 * - central-gem (中心寶石) → 脈衝發光
 * 
 * 職責：
 * - SVG 魔法陣的創建和渲染
 * - 旋轉動畫的控制和管理
 * - 符文點亮序列動畫
 * - 中心寶石脈衝效果
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class MagicCircle extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    
    // 魔法陣相關屬性
    this.svgElement = null;
    this.uniqueId = 'mc_' + Math.random().toString(36).substr(2, 9); // 唯一ID避免衝突
    this.animations = {
      outerRing: null,
      middleRing: null,
      innerRing: null,
      runes: [],
      centralGem: null
    };
    
    this.isAnimating = false;
    this.isExpanded = false;
  }

  getDefaultConfig() {
    return {
      // 魔法陣基礎配置
      circle: {
        size: 400,                    // 魔法陣直徑 (px)
        strokeWidth: 3,               // 線條寬度
        color: '#d4af37',             // 主色調 (金色)
        glowColor: '#f4d03f',         // 發光色彩
        opacity: 0.9                  // 透明度
      },
      
      // 動畫配置
      animation: {
        expandDuration: 2,            // 展開時間 (秒)
        rotationSpeed: {
          outer: -0.5,                // 外環旋轉速度 (逆時針)
          middle: 0.3,                // 中環旋轉速度 (順時針)
          inner: -1.2                 // 內環旋轉速度 (快速逆時針)
        },
        runeDelay: 0.2,              // 符文點亮間隔 (秒)
        pulseSpeed: 1.5               // 中心寶石脈衝速度
      },
      
      // 響應式配置
      responsive: {
        mobile: {
          size: 300,                  // 移動端縮小
          strokeWidth: 2
        }
      },
      
      // 定位配置
      position: {
        x: '50%',                     // 水平中心
        y: '50%',                     // 垂直中心
        zIndex: 10                    // 圖層順序 - 最底層
      }
    };
  }

  getInitialState() {
    return {
      isVisible: false,
      currentPhase: 'idle',           // idle, expanding, active, collapsing
      runesActivated: 0,
      animationProgress: 0
    };
  }

  /**
   * 創建 SVG 魔法陣元素
   */
  createElement() {
    const container = document.createElement('div');
    container.className = 'magic-circle-container';
    
    // 應用基礎樣式
    container.style.cssText = `
      position: fixed;
      left: ${this.config.position.x};
      top: ${this.config.position.y};
      transform: translate(-50%, -50%);
      z-index: ${this.config.position.zIndex};
      pointer-events: none;
      opacity: 0;
      overflow: visible;
      width: auto;
      height: auto;
    `;
    
    // 創建 SVG 元素
    const svg = this.createSVGElement();
    container.appendChild(svg);
    
    this.element = container;
    this.svgElement = svg;
    
    return container;
  }

  /**
   * 創建完整的 SVG 魔法陣
   */
  createSVGElement() {
    const size = this.config.circle.size;
    const padding = 50; // 增加邊距避免裁剪
    const svgSize = size + padding * 2;
    const center = svgSize / 2;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
    svg.setAttribute('class', 'magic-circle-svg');
    
    // 確保 SVG 不被裁剪
    svg.style.overflow = 'visible';
    
    // 創建漸變定義
    const defs = this.createGradientDefinitions();
    svg.appendChild(defs);
    
    // 創建三個旋轉環
    const outerRing = this.createRing(center, center, center * 0.9, 'outer-ring');
    const middleRing = this.createRing(center, center, center * 0.7, 'middle-ring');
    const innerRing = this.createRing(center, center, center * 0.5, 'inner-ring');
    
    // 創建符文
    const runesGroup = this.createRunesGroup(center);
    
    // 創建中心寶石
    const centralGem = this.createCentralGem(center);
    
    // 添加所有元素到 SVG
    svg.appendChild(outerRing);
    svg.appendChild(middleRing);
    svg.appendChild(innerRing);
    svg.appendChild(runesGroup);
    svg.appendChild(centralGem);
    
    return svg;
  }

  /**
   * 創建漸變定義
   */
  createGradientDefinitions() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // 主漸變 - 使用唯一ID
    const gradientId = `magic-circle-gradient-${this.uniqueId}`;
    const filterId = `magic-glow-${this.uniqueId}`;
    
    const mainGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    mainGradient.setAttribute('id', gradientId);
    mainGradient.innerHTML = `
      <stop offset="0%" style="stop-color:${this.config.circle.color};stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:${this.config.circle.glowColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.config.circle.color};stop-opacity:0.3" />
    `;
    
    // 發光濾鏡 - 增強版本
    const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    glowFilter.setAttribute('id', filterId);
    glowFilter.setAttribute('x', '-50%');
    glowFilter.setAttribute('y', '-50%');
    glowFilter.setAttribute('width', '200%');
    glowFilter.setAttribute('height', '200%');
    glowFilter.innerHTML = `
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feColorMatrix in="coloredBlur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0" result="brightBlur"/>
      <feMerge>
        <feMergeNode in="brightBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `;
    
    defs.appendChild(mainGradient);
    defs.appendChild(glowFilter);
    
    // 存儲ID供其他方法使用
    this.gradientId = gradientId;
    this.filterId = filterId;
    
    return defs;
  }

  /**
   * 創建旋轉環
   */
  createRing(cx, cy, radius, className) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', radius);
    ring.setAttribute('class', className);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', `url(#${this.gradientId})`);
    ring.setAttribute('stroke-width', this.config.circle.strokeWidth);
    ring.setAttribute('filter', `url(#${this.filterId})`);
    ring.setAttribute('opacity', this.config.circle.opacity);
    
    return ring;
  }

  /**
   * 創建符文組
   */
  createRunesGroup(center) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'runes-group');
    
    // 創建6個符文，均勻分布在圓周上
    const runeCount = 6;
    const radius = center * 0.8;
    
    for (let i = 0; i < runeCount; i++) {
      const angle = (i * 360 / runeCount) * Math.PI / 180;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      const rune = this.createRune(x, y, i);
      group.appendChild(rune);
    }
    
    return group;
  }

  /**
   * 創建單個符文
   */
  createRune(x, y, index) {
    const rune = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rune.setAttribute('cx', x);
    rune.setAttribute('cy', y);
    rune.setAttribute('r', 8);
    rune.setAttribute('class', `rune rune-${index}`);
    rune.setAttribute('fill', this.config.circle.color);
    rune.setAttribute('opacity', 0);
    rune.setAttribute('filter', `url(#${this.filterId})`);
    
    return rune;
  }

  /**
   * 創建中心寶石
   */
  createCentralGem(center) {
    const gem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    gem.setAttribute('cx', center);
    gem.setAttribute('cy', center);
    gem.setAttribute('r', 15);
    gem.setAttribute('class', 'central-gem');
    gem.setAttribute('fill', this.config.circle.glowColor);
    gem.setAttribute('opacity', 0.8);
    gem.setAttribute('filter', `url(#${this.filterId})`);
    
    return gem;
  }

  /**
   * 開始魔法陣展開動畫
   */
  async expand() {
    if (this.isAnimating) {
      console.warn('[MagicCircle] 魔法陣正在動畫中，忽略展開請求');
      return;
    }

    console.log('[MagicCircle] 開始魔法陣展開動畫');
    this.isAnimating = true;
    this.state.currentPhase = 'expanding';

    // 確保 GSAP 可用
    if (!window.gsap) {
      console.error('[MagicCircle] GSAP 未載入，無法執行動畫');
      return;
    }

    // 顯示魔法陣容器
    window.gsap.set(this.element, { opacity: 1 });
    this.state.isVisible = true;

    // 創建展開動畫時間軸
    const tl = window.gsap.timeline();

    // 階段1：魔法陣淡入並放大
    tl.fromTo(this.svgElement, {
      scale: 0,
      opacity: 0,
      rotation: -90
    }, {
      scale: 1,
      opacity: this.config.circle.opacity,
      rotation: 0,
      duration: this.config.animation.expandDuration * 0.4,
      ease: "power2.out"
    });

    // 階段2：啟動旋轉動畫
    this.startRotationAnimations();

    // 階段3：依序點亮符文
    const runeElements = this.svgElement.querySelectorAll('.rune');
    runeElements.forEach((rune, index) => {
      tl.to(rune, {
        opacity: 1,
        scale: 1.5,
        duration: 0.3,
        ease: "bounce.out",
        onComplete: () => {
          this.state.runesActivated++;
          console.log(`[MagicCircle] 符文 ${index + 1} 已激活`);
        }
      }, `+=${this.config.animation.runeDelay}`);
    });

    // 階段4：中心寶石脈衝
    this.startCentralGemPulse();

    // 動畫完成
    tl.call(() => {
      this.isAnimating = false;
      this.isExpanded = true;
      this.state.currentPhase = 'active';
      console.log('[MagicCircle] ✅ 魔法陣展開完成');
    });

    return tl;
  }

  /**
   * 啟動旋轉動畫
   */
  startRotationAnimations() {
    const outerRing = this.svgElement.querySelector('.outer-ring');
    const middleRing = this.svgElement.querySelector('.middle-ring');
    const innerRing = this.svgElement.querySelector('.inner-ring');

    // 取得 SVG 的中心點
    const size = this.config.circle.size;
    const padding = 50;
    const svgSize = size + padding * 2;
    const center = svgSize / 2;

    // 外環 - 逆時針旋轉
    this.animations.outerRing = window.gsap.to(outerRing, {
      rotation: 360 * this.config.animation.rotationSpeed.outer,
      duration: Math.abs(1 / this.config.animation.rotationSpeed.outer),
      repeat: -1,
      ease: "none",
      transformOrigin: `${center}px ${center}px`
    });

    // 中環 - 順時針旋轉
    this.animations.middleRing = window.gsap.to(middleRing, {
      rotation: 360 * this.config.animation.rotationSpeed.middle,
      duration: Math.abs(1 / this.config.animation.rotationSpeed.middle),
      repeat: -1,
      ease: "none",
      transformOrigin: `${center}px ${center}px`
    });

    // 內環 - 快速逆時針旋轉
    this.animations.innerRing = window.gsap.to(innerRing, {
      rotation: 360 * this.config.animation.rotationSpeed.inner,
      duration: Math.abs(1 / this.config.animation.rotationSpeed.inner),
      repeat: -1,
      ease: "none",
      transformOrigin: `${center}px ${center}px`
    });

    console.log('[MagicCircle] 🌀 旋轉動畫已啟動，中心點:', `${center}px ${center}px`);
  }

  /**
   * 啟動中心寶石脈衝動畫
   */
  startCentralGemPulse() {
    const centralGem = this.svgElement.querySelector('.central-gem');
    
    // 創建更明顯的脈衝效果
    this.animations.centralGem = window.gsap.timeline({ repeat: -1 })
      .to(centralGem, {
        scale: 1.8,
        opacity: 1,
        duration: this.config.animation.pulseSpeed * 0.6,
        ease: "power2.out"
      })
      .to(centralGem, {
        scale: 1,
        opacity: 0.6,
        duration: this.config.animation.pulseSpeed * 0.4,
        ease: "power2.in"
      });

    console.log('[MagicCircle] 💎 中心寶石脈衝已啟動 - 增強版');
  }

  /**
   * 停止所有動畫
   */
  stopAnimations() {
    Object.values(this.animations).forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    
    // 清空動畫引用
    this.animations = {
      outerRing: null,
      middleRing: null,
      innerRing: null,
      runes: [],
      centralGem: null
    };
    
    console.log('[MagicCircle] ⏹️ 所有動畫已停止');
  }

  /**
   * 隱藏魔法陣
   */
  async collapse() {
    console.log('[MagicCircle] 開始魔法陣收縮動畫');
    this.state.currentPhase = 'collapsing';

    // 停止旋轉動畫
    this.stopAnimations();

    // 收縮動畫
    if (window.gsap && this.element) {
      const tl = window.gsap.timeline();
      
      tl.to(this.svgElement, {
        scale: 0,
        opacity: 0,
        rotation: 90,
        duration: 1,
        ease: "power2.in"
      });
      
      tl.to(this.element, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          this.state.currentPhase = 'idle';
          this.state.isVisible = false;
          this.isExpanded = false;
          this.state.runesActivated = 0;
          console.log('[MagicCircle] ✅ 魔法陣已隱藏');
        }
      });

      return tl;
    }
  }

  /**
   * 重置魔法陣狀態
   */
  reset() {
    this.stopAnimations();
    this.state = this.getInitialState();
    this.isAnimating = false;
    this.isExpanded = false;
    
    if (this.element) {
      window.gsap.set(this.element, { opacity: 0 });
    }
    
    console.log('[MagicCircle] 🔄 魔法陣已重置');
  }

  /**
   * 銷毀組件
   */
  destroy() {
    this.stopAnimations();
    
    if (this.element) {
      this.element.remove();
    }
    
    this.svgElement = null;
    super.destroy();
    
    console.log('[MagicCircle] 🗑️ 魔法陣組件已銷毀');
  }
}