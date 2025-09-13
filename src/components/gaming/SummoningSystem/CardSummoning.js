// @ts-nocheck
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
 * Phase 2: 3D 旋轉展示 (2-4s) - 卡面在220度時顯現
 * Phase 3: 發光強化效果 (4-6s)
 * Phase 4: 穩定懸浮展示 (6-8s)
 * Phase 5: 延長卡面展示 (8-10s) - 增強質感停留
 * Phase 6: 轉場到詳情模態 (10s+)
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

// 動態導入卡牌數據系統 (避免循環依賴)
let cardsDataModule = null;
let cardConfigModule = null;

async function loadCardDataSystems() {
  if (!cardsDataModule || !cardConfigModule) {
    try {
      [cardsDataModule, cardConfigModule] = await Promise.all([
        import('../../../config/data/cards.data.js'),
        import('../../../config/data/card.config.js'),
      ]);
      console.log('🃏 [CardSummoning] 卡牌數據系統載入完成');
    } catch (error) {
      console.warn('⚠️ [CardSummoning] 卡牌數據系統載入失敗:', error);
    }
  }
  return { cardsDataModule, cardConfigModule };
}

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

    // 翻轉狀態追蹤
    this.isCardFlipped = false;

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
        backImageUrl: '/src/assets/images/卡背.webp', // 遊戲王卡背圖片
      },
      animation: {
        totalDuration: 10000, // 總動畫時長 10秒 (延長2秒)
        phases: {
          materialize: 2000, // Phase 1: 物質化 (0-2s)
          rotation: 2000, // Phase 2: 旋轉展示 (2-4s)
          glow: 2000, // Phase 3: 發光強化 (4-6s)
          stabilize: 2000, // Phase 4: 穩定懸浮 (6-8s)
          display: 2000, // Phase 5: 延長展示 (8-10s)
        },
        easing: {
          materialize: 'power3.out',
          rotation: 'power2.inOut',
          glow: 'sine.inOut',
          stabilize: 'power1.out',
        },
      },
      effects: {
        holographic: {
          enabled: true,
          intensity: 0.3,
          speed: 1.5,
        },
        glow: {
          enabled: true,
          maxIntensity: 1.2,
          pulseSpeed: 0.8,
        },
        rotation: {
          x: 15, // X軸旋轉角度
          y: 360, // Y軸完整旋轉
          z: 5, // Z軸微調
        },
      },
      responsive: {
        mobile: {
          scale: 0.8,
          reducedEffects: true,
        },
      },
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
      cardReady: false,
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

      // 將元素添加到容器或頁面
      if (this.config.container && this.config.container.appendChild) {
        this.config.container.appendChild(this.element);
      } else {
        console.warn(
          '⚠️ [CardSummoning] 無效容器，添加到 body:',
          this.config.container
        );
        document.body.appendChild(this.element);
      }

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
    // 檢查設備類型並調整尺寸
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? this.config.responsive.mobile.scale : 1;
    const finalWidth = this.config.card.width * scale;
    const finalHeight = this.config.card.height * scale;

    // 主容器
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-summoning-container';
    this.cardContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      margin-top: -${finalHeight / 2}px;
      margin-left: -${finalWidth / 2}px;
      width: ${finalWidth}px;
      height: ${finalHeight}px;
      transform-style: preserve-3d;
      perspective: 1000px;
      z-index: 10003;
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
    if (this.holographicOverlay) {
      this.cardElement.appendChild(this.holographicOverlay);
    }
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
      z-index: 2;
      opacity: 1;
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
      z: -200,
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
      },
    });

    // Phase 1: 平滑物質化 (0-0.5s) - 確保正確的初始狀態和漸進縮放
    this.masterTimeline
      .set(this.cardContainer, {
        rotationY: 0, // 重置旋轉，避免偏移
        z: 0, // 重置Z軸位置
        y: 0, // 重置Y軸位置
      })
      .to(this.cardContainer, {
        opacity: 1,
        scale: 0.1,
        duration: 0.1,
        ease: this.config.animation.easing.materialize,
      })
      .to(this.cardContainer, {
        scale: 1.05,
        duration: 0.3,
        ease: this.config.animation.easing.materialize,
      })
      .to(this.cardContainer, {
        scale: 1,
        duration: 0.1,
        ease: 'back.out(1.7)',
        onComplete: () => {
          this.state.currentPhase = 'materialized';
          console.log('📦 [CardSummoning] Phase 1 完成：平滑物質化');
        },
      });

    // Phase 2: 延長的 3D 旋轉展示 (0.5-3.5s) - 多轉兩圈無翻轉
    this.masterTimeline
      .to(
        this.cardElement,
        {
          rotationY: 720, // 先轉兩圈 (720度)
          rotationX: this.config.effects.rotation.x,
          rotationZ: this.config.effects.rotation.z,
          duration: 2.0, // 延長旋轉時間
          ease: this.config.animation.easing.rotation,
          onStart: () => {
            this.state.currentPhase = 'rotating';
            console.log('🌀 [CardSummoning] Phase 2 開始：延長旋轉展示');
            this.startGlowAnimation(); // 旋轉時就開始發光
          },
        },
        '0.5'
      )
      .to(this.cardElement, {
        rotationY: 1080, // 再轉一圈 (總共3圈)
        rotationX: 0,
        rotationZ: 0,
        duration: 1.0, // 最後一圈稍慢
        ease: this.config.animation.easing.rotation,
      });

    // Phase 3: 快速穩定 (3.5-4s) - 最終穩定狀態，準備直接跳轉彈窗
    this.masterTimeline.to(
      this.cardElement,
      {
        rotationY: 1080, // 保持最後位置不變
        y: 0,
        duration: 0.5,
        ease: this.config.animation.easing.stabilize,
        onStart: () => {
          this.state.currentPhase = 'stabilizing';
          console.log('🎯 [CardSummoning] Phase 3 開始：最終穩定（無翻轉）');
        },
        onComplete: () => {
          this.state.currentPhase = 'completed';
          console.log(
            '✅ [CardSummoning] 延長旋轉動畫序列結束，準備直接跳轉彈窗'
          );
        },
      },
      '3.5'
    );
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
        ease: 'sine.inOut',
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
      repeat: -1,
    });

    // 輕微的旋轉擺動
    this.swayAnimation = window.gsap.to(this.cardElement, {
      rotationZ: 2,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
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

    try {
      // 載入卡牌數據系統
      const { cardsDataModule, cardConfigModule } = await loadCardDataSystems();

      // 存儲專案數據和轉換為卡牌數據
      this.projectData = projectData;
      this.cardData = await this.getCardData(
        projectData,
        cardsDataModule,
        cardConfigModule
      );

      console.log('🃏 [CardSummoning] 卡牌數據:', this.cardData);

      // 根據卡牌稀有度更新視覺效果
      this.updateVisualEffects();

      // 更新卡牌內容
      await this.updateCardContent();

      // 重置動畫狀態
      this.reset();

      // 重置翻轉狀態
      this.isCardFlipped = false;

      // 顯示卡牌容器
      this.state.isVisible = true;
      this.state.currentPhase = 'summoning';

      // 播放主動畫時間軸
      this.masterTimeline.restart();
    } catch (error) {
      console.error('❌ [CardSummoning] 召喚動畫啟動失敗:', error);
      // 降級處理：使用原始專案數據
      this.projectData = projectData;
      this.reset();
      this.state.isVisible = true;
      this.state.currentPhase = 'summoning';
      this.masterTimeline.restart();
    }

    return new Promise(resolve => {
      // 監聽動畫完成事件
      const handleComplete = () => {
        this.off('summoningComplete', handleComplete);
        resolve({
          projectData: this.projectData,
          cardData: this.cardData,
        });
      };

      this.on('summoningComplete', handleComplete);
    });
  }

  /**
   * 獲取卡牌數據
   */
  async getCardData(projectData, cardsDataModule, cardConfigModule) {
    if (!projectData || !cardsDataModule || !cardConfigModule) {
      return null;
    }

    try {
      // 如果有專案ID，直接從卡牌數據中獲取
      if (projectData.id && cardsDataModule.getCardData) {
        const cardData = cardsDataModule.getCardData(projectData.id);
        if (cardData) {
          return cardData;
        }
      }

      // 如果沒有找到，嘗試動態轉換
      if (cardConfigModule.CardDataConverter) {
        return cardConfigModule.CardDataConverter.convertProjectToCard(
          projectData
        );
      }

      return null;
    } catch (error) {
      console.warn('⚠️ [CardSummoning] 卡牌數據獲取失敗:', error);
      return null;
    }
  }

  /**
   * 根據卡牌稀有度更新視覺效果
   */
  updateVisualEffects() {
    if (!this.cardData || !this.cardData.rarityConfig) {
      return;
    }

    const rarity = this.cardData.rarity;
    const rarityConfig = this.cardData.rarityConfig;

    console.log(`✨ [CardSummoning] 更新視覺效果: ${rarity}級卡牌`);

    // 更新發光顏色
    this.config.card.glowColor = rarityConfig.color;

    // 根據稀有度調整粒子和動畫強度
    if (rarityConfig.particleCount) {
      this.config.effects.particleIntensity = rarityConfig.particleCount / 1000;
    }

    if (rarityConfig.animationIntensity) {
      this.config.effects.glow.maxIntensity = rarityConfig.animationIntensity;
    }

    // 更新卡牌邊框發光效果
    if (this.cardElement) {
      this.cardElement.style.boxShadow = `
        0 0 20px ${rarityConfig.glowColor},
        0 0 40px ${rarityConfig.glowColor},
        inset 0 0 20px rgba(255, 255, 255, 0.1)
      `;
    }
  }

  /**
   * 更新卡牌內容顯示
   */
  async updateCardContent() {
    console.log(
      '🔧 [CardSummoning] 開始更新卡牌內容，數據狀態:',
      !!this.cardData
    );

    try {
      if (!this.cardData) {
        console.log('🎴 [CardSummoning] 無完整卡牌數據，創建基礎卡面');
        // 即使沒有完整數據，也創建基本的卡面內容
        await this.createBasicCardFront();
      } else {
        console.log('🎴 [CardSummoning] 有完整卡牌數據，創建詳細卡面');
        console.log('📋 [CardSummoning] 卡牌數據詳情:', this.cardData);
        // 創建完整的卡牌正面內容
        await this.createCardFront();
      }

      // 檢查卡面元素是否成功創建
      if (this.cardFront) {
        console.log('✅ [CardSummoning] 卡面元素創建成功');
        console.log('🔄 [CardSummoning] 卡牌翻轉將由旋轉動畫時程控制');
      } else {
        console.error('❌ [CardSummoning] 卡面元素創建失敗');
      }
    } catch (error) {
      console.error('❌ [CardSummoning] 卡牌內容更新失敗:', error);
      // 錯誤降級：創建最基本的卡面
      try {
        await this.createBasicCardFront();
        console.log('🔄 [CardSummoning] 基礎卡牌翻轉將由旋轉動畫時程控制');
      } catch (fallbackError) {
        console.error('❌ [CardSummoning] 基礎卡面創建也失敗:', fallbackError);
      }
    }
  }

  /**
   * 創建卡牌正面內容
   */
  async createCardFront() {
    if (this.cardFront) {
      this.cardFront.remove();
    }

    this.cardFront = document.createElement('div');
    this.cardFront.className = 'card-front';
    this.cardFront.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${this.config.card.borderRadius}px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid ${this.cardData.rarityConfig?.borderColor || '#8e8e8e'};
      opacity: 0;
      transform: rotateY(-180deg);
      backface-visibility: hidden;
      overflow: hidden;
      color: white;
      font-family: 'Inter', sans-serif;
      z-index: 1;
    `;

    // 確保卡背在正面之上，初始時可見
    if (this.cardBack) {
      this.cardBack.style.zIndex = '2';
      this.cardBack.style.opacity = '1';
    }

    // 卡牌內容
    this.cardFront.innerHTML = `
      <div class="card-content" style="
        padding: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <!-- 卡牌標題 -->
        <div class="card-header" style="text-align: center; margin-bottom: 10px;">
          <h3 style="
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: ${this.cardData.rarityConfig?.color || '#ffffff'};
            text-shadow: 0 0 5px ${this.cardData.rarityConfig?.glowColor || '#ffffff'};
            line-height: 1.2;
          ">${this.cardData.name}</h3>
          <div style="
            font-size: 10px;
            color: ${this.cardData.attributeConfig?.color || '#ffffff'};
            margin-top: 2px;
          ">
            ${this.cardData.attributeConfig?.icon || '⚡'} ${this.cardData.attributeConfig?.name || this.cardData.attribute || 'Unknown'}
          </div>
        </div>

        <!-- 等級星星 -->
        <div class="card-level" style="
          text-align: center;
          margin-bottom: 8px;
        ">
          ${'★'.repeat(this.cardData.level)}
        </div>

        <!-- 卡牌圖片區域 -->
        <div class="card-image" style="
          flex-grow: 1;
          background: linear-gradient(45deg, #2a2a4e, #3a3a6e);
          border-radius: 6px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: ${this.cardData.attributeConfig?.color || '#ffffff'};
        ">
          ${this.cardData.attributeConfig?.icon || '⚡'}
        </div>

        <!-- 攻擊力/防禦力 -->
        <div class="card-stats" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          font-size: 14px;
        ">
          <span style="color: #ff6b6b;">ATK/${this.cardData.attack}</span>
          <span style="color: #4ecdc4;">DEF/${this.cardData.defense}</span>
        </div>

        <!-- 卡牌效果 -->
        <div class="card-effect" style="
          font-size: 8px;
          line-height: 1.2;
          background: rgba(0,0,0,0.3);
          padding: 4px;
          border-radius: 3px;
          margin-top: 4px;
          max-height: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          ${this.cardData.effect || this.cardData.flavorText || ''}
        </div>
      </div>
    `;

    // 添加到卡牌元素
    this.cardElement.appendChild(this.cardFront);

    console.log('🎨 [CardSummoning] 卡牌正面內容創建完成');
  }

  /**
   * 創建基礎卡牌正面內容（無完整數據時的降級版本）
   */
  async createBasicCardFront() {
    if (this.cardFront) {
      this.cardFront.remove();
    }

    this.cardFront = document.createElement('div');
    this.cardFront.className = 'card-front basic';
    this.cardFront.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${this.config.card.borderRadius}px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #d4af37;
      opacity: 0;
      transform: rotateY(-180deg);
      backface-visibility: hidden;
      overflow: hidden;
      color: white;
      font-family: 'Inter', sans-serif;
      z-index: 1;
    `;

    // 確保卡背在正面之上，初始時可見
    if (this.cardBack) {
      this.cardBack.style.zIndex = '2';
      this.cardBack.style.opacity = '1';
    }

    // 基礎卡牌內容 - 使用專案數據或默認內容
    const projectName =
      this.projectData?.name || this.projectData?.title || '神秘專案';
    const projectType =
      this.projectData?.rarity || this.projectData?.type || 'unknown';

    this.cardFront.innerHTML = `
      <div class="card-content" style="
        padding: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <!-- 卡牌標題 -->
        <div class="card-header" style="text-align: center; margin-bottom: 10px;">
          <h3 style="
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #d4af37;
            text-shadow: 0 0 5px rgba(212, 175, 55, 0.8);
            line-height: 1.2;
          ">${projectName}</h3>
          <div style="
            font-size: 10px;
            color: #4ecdc4;
            margin-top: 2px;
          ">
            ⚡ ${projectType.toUpperCase()}
          </div>
        </div>

        <!-- 等級星星 (基礎3星) -->
        <div class="card-level" style="
          text-align: center;
          margin-bottom: 8px;
        ">
          ⭐⭐⭐
        </div>

        <!-- 卡牌圖片區域 -->
        <div class="card-image" style="
          flex-grow: 1;
          background: linear-gradient(45deg, #2a2a4e, #3a3a6e);
          border-radius: 6px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #d4af37;
        ">
          🎮
        </div>

        <!-- 攻擊力/防禦力 (基礎數值) -->
        <div class="card-stats" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          font-size: 14px;
        ">
          <span style="color: #ff6b6b;">ATK/1500</span>
          <span style="color: #4ecdc4;">DEF/1200</span>
        </div>

        <!-- 卡牌效果 -->
        <div class="card-effect" style="
          font-size: 8px;
          line-height: 1.2;
          background: rgba(0,0,0,0.3);
          padding: 4px;
          border-radius: 3px;
          margin-top: 4px;
          text-align: center;
        ">
          【召喚效果】這張卡代表了一個精彩的專案作品，展現了開發者的創意與技術實力。
        </div>
      </div>
    `;

    // 添加到卡牌元素
    this.cardElement.appendChild(this.cardFront);

    console.log('🎨 [CardSummoning] 基礎卡牌正面內容創建完成');
  }

  /**
   * 執行卡牌翻轉（在旋轉到180度時調用）
   */
  executeCardFlip() {
    console.log('🔄 [CardSummoning] 在旋轉180度時執行卡牌翻轉');

    if (!this.cardFront) {
      console.warn('⚠️ [CardSummoning] 卡面元素不存在，無法翻轉');
      return;
    }

    if (!this.cardBack) {
      console.warn('⚠️ [CardSummoning] 卡背元素不存在，無法翻轉');
      return;
    }

    console.log('🔄 [CardSummoning] 執行卡牌翻轉到正面');

    // 瞬間翻轉：隱藏卡背，顯示卡面
    window.gsap.set(this.cardBack, {
      opacity: 0,
      zIndex: 1,
    });

    window.gsap.set(this.cardFront, {
      opacity: 1,
      zIndex: 2,
      rotateY: 0, // 確保卡面正向顯示
      backfaceVisibility: 'visible',
    });

    this.isCardFlipped = true; // 標記翻轉完成
    console.log('✅ [CardSummoning] 卡面翻轉完成，設置翻轉狀態為 true');
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
   * 軟重置 - 保持卡牌翻轉狀態的重置
   */
  softReset() {
    console.log('🔄 [CardSummoning] 軟重置 - 保持卡牌顯示狀態');

    // 停止動畫但不重置視覺狀態
    this.isAnimating = false;
    this.state.currentPhase = 'idle';

    // 停止懸浮動畫
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
      this.hoverAnimation = null;
    }

    if (this.swayAnimation) {
      this.swayAnimation.kill();
      this.swayAnimation = null;
    }

    // 停止時間軸
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
    }

    // 如果已翻轉，保持卡面顯示
    if (this.isCardFlipped) {
      console.log('🎴 [CardSummoning] 保持卡面顯示狀態');

      // 確保容器和卡面都正確顯示
      if (this.cardContainer) {
        window.gsap.set(this.cardContainer, {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          z: 0,
          y: 0,
          visibility: 'visible',
          display: 'block',
        });
        console.log('🔧 [CardSummoning] 確保卡牌容器可見');
      }

      if (this.cardBack) {
        window.gsap.set(this.cardBack, {
          opacity: 0,
          zIndex: 1,
          visibility: 'hidden',
        });
        console.log('🔧 [CardSummoning] 確保卡背隱藏');
      }

      if (this.cardFront) {
        window.gsap.set(this.cardFront, {
          opacity: 1,
          transform: 'rotateY(0deg)',
          zIndex: 2,
          visibility: 'visible',
          display: 'block',
        });
        console.log('🔧 [CardSummoning] 確保卡面可見');
      }

      // 調試：輸出當前狀態
      console.log('🔍 [CardSummoning] 調試信息:');
      console.log('  - 容器opacity:', this.cardContainer?.style.opacity);
      console.log('  - 容器visibility:', this.cardContainer?.style.visibility);
      console.log('  - 卡面opacity:', this.cardFront?.style.opacity);
      console.log('  - 卡面visibility:', this.cardFront?.style.visibility);
      console.log('  - 卡面transform:', this.cardFront?.style.transform);
    }
  }

  /**
   * 完全重置動畫狀態
   */
  reset() {
    console.log('🔄 [CardSummoning] 完全重置召喚狀態');

    // 停止所有動畫
    this.isAnimating = false;
    this.state.currentPhase = 'idle';
    this.state.isVisible = false;
    this.state.animationProgress = 0;

    // 重置翻轉狀態
    this.isCardFlipped = false;

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

    // 重置到卡背顯示
    if (this.cardBack) {
      window.gsap.set(this.cardBack, {
        opacity: 1,
        zIndex: 2,
      });
    }

    if (this.cardFront) {
      window.gsap.set(this.cardFront, {
        opacity: 0,
        transform: 'rotateY(-180deg)',
        zIndex: 1,
      });
    }

    // 重置容器樣式
    window.gsap.set(this.cardContainer, {
      opacity: 0,
      scale: 0,
      rotationY: -90,
      z: -200,
      y: 0,
    });

    // 重置主時間軸
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
    }

    window.gsap.set(this.cardElement, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
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

    // 事件監聽器由父類 destroy() 方法處理

    // 清理 DOM 元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    // 清理父類資源
    super.destroy();
  }
}
