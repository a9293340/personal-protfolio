/**
 * CardSummoning.js - 遊戲王風格卡牌召喚動畫控制器
 * 
 * 功能特色：
 * - 完整8秒召喚動畫序列
 * - 遊戲王風格卡背設計
 * - 3D 旋轉、縮放、發光效果
 * - 與 MagicCircle 和 ParticleSystem 協調
 * - 無縫轉場到專案詳情模態框
 * 
 * 動畫序列：
 * Phase 1: 卡牌從虛空顯現 (0-2s)
 * Phase 2: 3D 旋轉展示 (2-4s)  
 * Phase 3: 發光強化效果 (4-6s)
 * Phase 4: 穩定懸浮展示 (6-8s)
 * Phase 5: 轉場到詳情模態 (8s+)
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class CardSummoning extends BaseComponent {
  constructor(config = {}) {
    super();
    
    // 初始化配置和狀態
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };
    
    // 卡牌元素
    this.cardElement = null;
    this.cardContainer = null;
    this.holographicOverlay = null;
    
    // 動畫狀態
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.animations = {};
    
    // 專案數據
    this.projectData = null;
    
    console.log('🎴 [CardSummoning] 卡牌召喚系統初始化，配置:', this.config);
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      card: {
        width: 280,
        height: 410,
        borderRadius: 12,
        glowColor: '#d4af37',
        backImageUrl: '/src/assets/images/卡背.webp' // 遊戲王卡背圖片
      },
      animation: {
        totalDuration: 8000,      // 總動畫時長 8秒
        phases: {
          materialize: 2000,      // Phase 1: 物質化 (0-2s)
          rotation: 2000,         // Phase 2: 旋轉展示 (2-4s)  
          glow: 2000,            // Phase 3: 發光強化 (4-6s)
          stabilize: 2000         // Phase 4: 穩定懸浮 (6-8s)
        },
        easing: {
          materialize: 'power3.out',
          rotation: 'power2.inOut',
          glow: 'sine.inOut',
          stabilize: 'power1.out'
        }
      },
      effects: {
        holographic: {
          enabled: true,
          intensity: 0.3,
          speed: 1.5
        },
        glow: {
          enabled: true,
          maxIntensity: 1.2,
          pulseSpeed: 0.8
        },
        rotation: {
          x: 15,      // X軸旋轉角度
          y: 360,     // Y軸完整旋轉
          z: 5        // Z軸微調
        }
      },
      responsive: {
        mobile: {
          scale: 0.8,
          reducedEffects: true
        }
      }
    };
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      currentPhase: 'idle',
      isVisible: false,
      animationProgress: 0,
      cardReady: false
    };
  }

  /**
   * 組件初始化
   */
  async init() {
    console.log('🔧 [CardSummoning] 開始初始化');
    
    try {
      // 檢查 GSAP 可用性
      if (!window.gsap) {
        throw new Error('GSAP 未載入，無法執行卡牌動畫');
      }

      // 創建卡牌元素
      this.createCardElements();
      
      // 初始化動畫系統
      this.initAnimations();
      
      console.log('✅ [CardSummoning] 初始化完成');
      
    } catch (error) {
      console.error('❌ [CardSummoning] 初始化失敗:', error);
      throw error;
    }
  }

  /**
   * 創建卡牌 DOM 元素
   */
  createCardElements() {
    // 主容器
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-summoning-container';
    this.cardContainer.style.cssText = `
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${this.config.card.width}px;
      height: ${this.config.card.height}px;
      transform-style: preserve-3d;
      perspective: 1000px;
      z-index: 30;
      opacity: 0;
      pointer-events: auto;
    `;

    // 卡牌元素
    this.cardElement = document.createElement('div');
    this.cardElement.className = 'summoning-card';
    this.cardElement.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: ${this.config.card.borderRadius}px;
      transform-style: preserve-3d;
      transition: none;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 
        0 0 20px rgba(212, 175, 55, 0.3),
        0 0 40px rgba(212, 175, 55, 0.2),
        inset 0 0 20px rgba(255, 255, 255, 0.1);
    `;

    // 卡背圖片
    this.createCardBack();
    
    // 全息效果層
    this.createHolographicOverlay();
    
    // 發光效果層
    this.createGlowEffects();

    // 組裝元素
    this.cardElement.appendChild(this.cardBack);
    this.cardElement.appendChild(this.holographicOverlay);
    this.cardContainer.appendChild(this.cardElement);
    
    this.element = this.cardContainer;
    
    console.log('🎨 [CardSummoning] 卡牌元素創建完成');
  }

  /**
   * 創建遊戲王卡背
   */
  createCardBack() {
    this.cardBack = document.createElement('div');
    this.cardBack.className = 'card-back';
    this.cardBack.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${this.config.card.borderRadius}px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      overflow: hidden;
    `;

    // 卡背圖片
    const cardBackImage = document.createElement('img');
    cardBackImage.className = 'card-back-image';
    cardBackImage.src = this.config.card.backImageUrl;
    cardBackImage.alt = 'Yu-Gi-Oh Card Back';
    cardBackImage.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${this.config.card.borderRadius}px;
      transition: all 0.3s ease;
    `;

    // 圖片載入錯誤處理
    cardBackImage.onerror = () => {
      console.warn('[CardSummoning] 卡背圖片載入失敗，使用備用樣式');
      cardBackImage.style.display = 'none';
      this.createFallbackCardBack();
    };

    this.cardBack.appendChild(cardBackImage);
  }

  /**
   * 創建備用卡背設計（圖片載入失敗時）
   */
  createFallbackCardBack() {
    const fallbackBack = document.createElement('div');
    fallbackBack.className = 'card-back-fallback';
    fallbackBack.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at center, #d4af37 0%, #b8860b 30%, #1a1a2e  70%),
        linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%);
      border-radius: ${this.config.card.borderRadius}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', serif;
      color: #d4af37;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
      border: 2px solid #d4af37;
    `;
    
    fallbackBack.innerHTML = `
      <div style="text-align: center; transform: rotate(-45deg);">
        <div style="font-size: 16px; margin-bottom: 5px;">SUMMONING</div>
        <div style="font-size: 20px;">CARD</div>
      </div>
    `;
    
    this.cardBack.appendChild(fallbackBack);
  }

  /**
   * 創建全息效果層
   */
  createHolographicOverlay() {
    if (!this.config.effects.holographic.enabled) return;

    this.holographicOverlay = document.createElement('div');
    this.holographicOverlay.className = 'holographic-overlay';
    this.holographicOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${this.config.card.borderRadius}px;
      background: 
        linear-gradient(
          45deg,
          transparent 30%,
          rgba(255, 255, 255, ${this.config.effects.holographic.intensity}) 50%,
          transparent 70%
        );
      opacity: 0;
      pointer-events: none;
      mix-blend-mode: overlay;
      animation: holographic-sweep 3s ease-in-out infinite;
    `;

    // 添加 CSS 動畫（如果尚未添加）
    this.addHolographicCSS();
  }

  /**
   * 添加全息效果 CSS 動畫
   */
  addHolographicCSS() {
    if (document.querySelector('#holographic-animations')) return;

    const style = document.createElement('style');
    style.id = 'holographic-animations';
    style.textContent = `
      @keyframes holographic-sweep {
        0% { 
          background-position: -200% center;
          opacity: 0;
        }
        50% { 
          background-position: 200% center;
          opacity: 0.6;
        }
        100% { 
          background-position: 200% center;
          opacity: 0;
        }
      }
      
      @keyframes card-glow-pulse {
        0%, 100% { 
          box-shadow: 
            0 0 20px rgba(212, 175, 55, 0.3),
            0 0 40px rgba(212, 175, 55, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }
        50% { 
          box-shadow: 
            0 0 30px rgba(212, 175, 55, 0.8),
            0 0 60px rgba(212, 175, 55, 0.6),
            0 0 100px rgba(212, 175, 55, 0.3),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * 創建發光效果
   */
  createGlowEffects() {
    if (!this.config.effects.glow.enabled) return;

    // 發光效果會通過 CSS 動畫和 GSAP 控制
    this.cardElement.classList.add('glow-enabled');
  }

  /**
   * 初始化動畫系統
   */
  initAnimations() {
    // 設置初始狀態
    window.gsap.set(this.cardContainer, {
      opacity: 0,
      scale: 0,
      rotationY: -90,
      z: -200
    });

    // 預設動畫時間軸
    this.createAnimationTimeline();
    
    console.log('🎬 [CardSummoning] 動畫系統初始化完成');
  }

  /**
   * 創建完整動畫時間軸
   */
  createAnimationTimeline() {
    this.masterTimeline = window.gsap.timeline({
      paused: true,
      onStart: () => {
        this.isAnimating = true;
        console.log('🎬 [CardSummoning] 召喚序列開始');
      },
      onComplete: () => {
        this.isAnimating = false;
        this.state.currentPhase = 'completed';
        console.log('✅ [CardSummoning] 召喚序列完成');
        this.emit('summoningComplete', this.projectData);
      },
      onUpdate: () => {
        this.state.animationProgress = this.masterTimeline.progress();
      }
    });

    // Phase 1: 物質化 (0-2s)
    this.masterTimeline
      .to(this.cardContainer, {
        opacity: 1,
        scale: 0.1,
        duration: 0.5,
        ease: this.config.animation.easing.materialize
      })
      .to(this.cardContainer, {
        scale: 1.2,
        rotationY: 0,
        z: 0,
        duration: 1.0,
        ease: this.config.animation.easing.materialize
      })
      .to(this.cardContainer, {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        onComplete: () => {
          this.state.currentPhase = 'materialized';
          console.log('📦 [CardSummoning] Phase 1 完成：物質化');
        }
      });

    // Phase 2: 3D 旋轉展示 (2-4s)
    this.masterTimeline
      .to(this.cardElement, {
        rotationY: this.config.effects.rotation.y,
        rotationX: this.config.effects.rotation.x,
        rotationZ: this.config.effects.rotation.z,
        duration: 2.0,
        ease: this.config.animation.easing.rotation,
        onStart: () => {
          this.state.currentPhase = 'rotating';
          console.log('🌀 [CardSummoning] Phase 2 開始：旋轉展示');
        }
      }, '2');

    // Phase 3: 發光強化 (4-6s) 
    this.masterTimeline
      .to(this.cardElement, {
        duration: 2.0,
        ease: this.config.animation.easing.glow,
        onStart: () => {
          this.state.currentPhase = 'glowing';
          this.startGlowAnimation();
          console.log('✨ [CardSummoning] Phase 3 開始：發光強化');
        }
      }, '4');

    // Phase 4: 穩定懸浮 (6-8s)
    this.masterTimeline
      .to(this.cardElement, {
        rotationY: 360 + 5, // 輕微超轉
        rotationX: 0,
        rotationZ: 0,
        duration: 2.0,
        ease: this.config.animation.easing.stabilize,
        onStart: () => {
          this.state.currentPhase = 'stabilizing';
          console.log('🎯 [CardSummoning] Phase 4 開始：穩定懸浮');
        },
        onComplete: () => {
          this.startHoverAnimation();
        }
      }, '6');
  }

  /**
   * 開始發光動畫
   */
  startGlowAnimation() {
    if (!this.config.effects.glow.enabled) return;

    // 啟動 CSS 脈衝動畫
    this.cardElement.style.animation = `card-glow-pulse ${this.config.effects.glow.pulseSpeed}s ease-in-out infinite`;
    
    // 全息效果增強
    if (this.holographicOverlay) {
      window.gsap.to(this.holographicOverlay, {
        opacity: 0.8,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }

  /**
   * 開始懸浮動畫
   */
  startHoverAnimation() {
    // 輕微的上下浮動
    this.hoverAnimation = window.gsap.to(this.cardContainer, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // 輕微的旋轉擺動
    this.swayAnimation = window.gsap.to(this.cardElement, {
      rotationZ: 2,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * 播放完整召喚動畫
   */
  async playSummoningAnimation(projectData = null) {
    if (this.isAnimating) {
      console.warn('[CardSummoning] 召喚動畫正在進行中，忽略新請求');
      return;
    }

    console.log('🎴 [CardSummoning] 開始播放召喚動畫');
    
    // 存儲專案數據
    this.projectData = projectData;
    
    // 重置動畫狀態
    this.reset();
    
    // 顯示卡牌容器
    this.state.isVisible = true;
    this.state.currentPhase = 'summoning';
    
    // 播放主動畫時間軸
    this.masterTimeline.restart();
    
    return new Promise((resolve) => {
      // 監聽動畫完成事件
      const handleComplete = () => {
        this.off('summoningComplete', handleComplete);
        resolve(this.projectData);
      };
      
      this.on('summoningComplete', handleComplete);
    });
  }

  /**
   * 創建 DOM 元素
   */
  createElement() {
    if (!this.element) {
      throw new Error('CardSummoning 元素尚未創建，請先調用 init()');
    }
    
    return this.element;
  }

  /**
   * 重置動畫狀態
   */
  reset() {
    console.log('🔄 [CardSummoning] 重置召喚狀態');
    
    // 停止所有動畫
    this.isAnimating = false;
    this.state.currentPhase = 'idle';
    this.state.isVisible = false;
    this.state.animationProgress = 0;
    
    // 停止懸浮動畫
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
      this.hoverAnimation = null;
    }
    
    if (this.swayAnimation) {
      this.swayAnimation.kill();
      this.swayAnimation = null;
    }
    
    // 重置視覺狀態
    if (this.cardElement) {
      this.cardElement.style.animation = '';
    }
    
    if (this.holographicOverlay) {
      window.gsap.killTweensOf(this.holographicOverlay);
      this.holographicOverlay.style.opacity = '0';
    }
    
    // 重置主時間軸
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
    }
    
    // 重置容器樣式
    window.gsap.set(this.cardContainer, {
      opacity: 0,
      scale: 0,
      rotationY: -90,
      z: -200,
      y: 0
    });
    
    window.gsap.set(this.cardElement, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0
    });
  }

  /**
   * 清理資源
   */
  destroy() {
    console.log('🗑️ [CardSummoning] 清理資源');
    
    // 停止並清理所有動畫
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
    
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
    }
    
    if (this.swayAnimation) {
      this.swayAnimation.kill();
    }
    
    // 清理 GSAP 動畫
    if (this.cardContainer) {
      window.gsap.killTweensOf(this.cardContainer);
    }
    
    if (this.cardElement) {
      window.gsap.killTweensOf(this.cardElement);
    }
    
    if (this.holographicOverlay) {
      window.gsap.killTweensOf(this.holographicOverlay);
    }
    
    // 移除事件監聽器
    this.removeAllListeners();
    
    // 清理 DOM 元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // 清理父類資源
    super.destroy();
  }
}