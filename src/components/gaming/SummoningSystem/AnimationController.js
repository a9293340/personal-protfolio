// @ts-nocheck
/**
 * AnimationController.js - 遊戲王召喚特效動畫流程總控制器
 * 
 * 功能特色：
 * - 協調 MagicCircle、ParticleSystem、CardSummoning 三大組件
 * - 精確控制8秒完整召喚序列時序
 * - 狀態機管理動畫流程
 * - 錯誤處理和優雅降級
 * - 跨組件事件協調
 * 
 * 召喚序列流程：
 * Phase 1: 魔法陣展開 (0-2s)
 * Phase 2: 能量聚集 - 環形粒子流 (2-3.5s)  
 * Phase 3: 粒子爆發 (3.5-4.5s)
 * Phase 4: 卡牌顯現 - 召喚動畫 (4.5-8s)
 * Phase 5: 轉場準備 (8s+)
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class AnimationController extends BaseComponent {
  constructor(config = {}) {
    super();
    
    // 初始化配置和狀態
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };
    
    // 組件實例
    this.magicCircle = null;
    this.particleSystem = null;
    this.cardSummoning = null;
    this.audioManager = null;
    
    // 動畫控制
    this.masterTimeline = null;
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.animations = {};
    
    // 回調函數
    this.onComplete = null;
    this.onPhaseChange = null;
    this.onError = null;
    
    console.log('🎮 [AnimationController] 動畫控制器初始化，配置:', this.config);
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      sequence: {
        totalDuration: 8000,        // 總時長 8秒
        phases: {
          magicCircle: {            // Phase 1: 魔法陣展開
            start: 0,
            duration: 2000,
            name: 'Magic Circle Expansion'
          },
          energyGather: {           // Phase 2: 能量聚集
            start: 2000,
            duration: 1500,
            name: 'Energy Gathering'
          },
          particleBurst: {          // Phase 3: 粒子爆發
            start: 3500,
            duration: 1000,
            name: 'Particle Burst'
          },
          cardSummoning: {          // Phase 4: 卡牌召喚
            start: 4500,
            duration: 3500,
            name: 'Card Summoning'
          },
          transition: {             // Phase 5: 轉場準備
            start: 8000,
            duration: 500,
            name: 'Transition'
          }
        }
      },
      coordination: {
        autoCleanup: true,          // 動畫結束後自動清理
        errorRecovery: true,        // 啟用錯誤恢復
        performanceMode: 'auto',    // auto | high | medium | low
        debugMode: false            // 除錯模式
      },
      container: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      currentPhase: 'idle',
      phaseProgress: 0,
      totalProgress: 0,
      componentsReady: {
        magicCircle: false,
        particleSystem: false,
        cardSummoning: false,
        audioManager: false
      },
      lastError: null
    };
  }

  /**
   * 組件初始化
   */
  async init(components = {}) {
    console.log('🔧 [AnimationController] 開始初始化');
    
    try {
      // 檢查必要依賴
      if (!window.gsap) {
        throw new Error('GSAP 未載入，無法執行動畫控制');
      }

      // 設置組件實例
      this.setComponents(components);
      
      // 初始化各組件
      await this.initializeComponents();
      
      // 創建主控時間軸
      this.createMasterTimeline();
      
      // 綁定組件事件
      this.bindComponentEvents();
      
      console.log('✅ [AnimationController] 初始化完成');
      
    } catch (error) {
      console.error('❌ [AnimationController] 初始化失敗:', error);
      this.state.lastError = error;
      throw error;
    }
  }

  /**
   * 設置組件實例
   */
  setComponents({ magicCircle, particleSystem, cardSummoning, audioManager }) {
    this.magicCircle = magicCircle;
    this.particleSystem = particleSystem;
    this.cardSummoning = cardSummoning;
    this.audioManager = audioManager;
    
    console.log('🔗 [AnimationController] 組件設置:', {
      magicCircle: !!this.magicCircle,
      particleSystem: !!this.particleSystem,
      cardSummoning: !!this.cardSummoning,
      audioManager: !!this.audioManager
    });
  }

  /**
   * 初始化各組件
   */
  async initializeComponents() {
    const initPromises = [];
    
    // 安全包裝 init 方法，確保返回 Promise
    const safeInit = async (component, name) => {
      try {
        // 檢查組件是否有 init 方法
        if (typeof component.init === 'function') {
          const result = component.init();
          // 如果返回 Promise，等待它；否則直接繼續
          if (result && typeof result.then === 'function') {
            await result;
          }
          console.log(`✅ [AnimationController] ${name} 初始化並準備就緒`);
        } else {
          // 沒有 init 方法，直接標記為準備就緒
          console.log(`✅ [AnimationController] ${name} 準備就緒（無需初始化）`);
        }
        return true;
      } catch (error) {
        console.error(`❌ [AnimationController] ${name} 初始化失敗:`, error);
        throw error;
      }
    };
    
    // 初始化魔法陣
    if (this.magicCircle) {
      initPromises.push(
        safeInit(this.magicCircle, 'MagicCircle').then(() => {
          this.state.componentsReady.magicCircle = true;
        })
      );
    }
    
    // 初始化粒子系統
    if (this.particleSystem) {
      initPromises.push(
        safeInit(this.particleSystem, 'ParticleSystem').then(() => {
          this.state.componentsReady.particleSystem = true;
        })
      );
    }
    
    // 初始化卡牌召喚
    if (this.cardSummoning) {
      initPromises.push(
        safeInit(this.cardSummoning, 'CardSummoning').then(() => {
          this.state.componentsReady.cardSummoning = true;
        })
      );
    }
    
    // 初始化音效管理器
    if (this.audioManager) {
      initPromises.push(
        safeInit(this.audioManager, 'AudioManager').then(() => {
          this.state.componentsReady.audioManager = true;
        })
      );
    }
    
    // 等待所有組件初始化完成
    if (initPromises.length > 0) {
      await Promise.all(initPromises);
    }
    console.log('🎯 [AnimationController] 所有組件初始化完成');
  }

  /**
   * 創建主控動畫時間軸
   */
  createMasterTimeline() {
    this.masterTimeline = window.gsap.timeline({
      paused: true,
      onStart: () => {
        this.isAnimating = true;
        this.currentPhase = 'summoning';
        this.state.currentPhase = 'summoning';
        console.log('🎬 [AnimationController] 召喚序列開始');
        this.emit('sequenceStart');
      },
      onUpdate: () => {
        this.updateProgress();
      },
      onComplete: () => {
        this.handleSequenceComplete();
      }
    });

    // 設置各階段的時間標記
    const { phases } = this.config.sequence;
    
    // Phase 1: 魔法陣展開 (0-2s)
    this.masterTimeline.add(() => {
      this.executePhase('magicCircle');
    }, phases.magicCircle.start / 1000);

    // Phase 2: 能量聚集 (2-3.5s)  
    this.masterTimeline.add(() => {
      this.executePhase('energyGather');
    }, phases.energyGather.start / 1000);

    // Phase 3: 粒子爆發 (3.5-4.5s)
    this.masterTimeline.add(() => {
      this.executePhase('particleBurst');
    }, phases.particleBurst.start / 1000);

    // Phase 4: 卡牌召喚 (4.5-8s)
    this.masterTimeline.add(() => {
      this.executePhase('cardSummoning');
    }, phases.cardSummoning.start / 1000);

    // Phase 5: 轉場準備 (8s+)
    this.masterTimeline.add(() => {
      this.executePhase('transition');
    }, phases.transition.start / 1000);

    console.log('⏱️ [AnimationController] 主控時間軸創建完成');
  }

  /**
   * 執行指定階段
   */
  async executePhase(phaseName) {
    const phase = this.config.sequence.phases[phaseName];
    
    console.log(`🎯 [AnimationController] 執行階段: ${phase.name}`);
    this.currentPhase = phaseName;
    this.state.currentPhase = phaseName;
    
    // 觸發階段變更事件
    this.emit('phaseChange', { phase: phaseName, config: phase });
    if (this.onPhaseChange) {
      this.onPhaseChange(phaseName, phase);
    }

    try {
      switch (phaseName) {
        case 'magicCircle':
          await this.executeMagicCirclePhase();
          break;
        case 'energyGather':
          await this.executeEnergyGatherPhase();
          break;
        case 'particleBurst':
          await this.executeParticleBurstPhase();
          break;
        case 'cardSummoning':
          await this.executeCardSummoningPhase();
          break;
        case 'transition':
          await this.executeTransitionPhase();
          break;
      }
    } catch (error) {
      console.error(`❌ [AnimationController] 階段 ${phaseName} 執行失敗:`, error);
      this.handlePhaseError(phaseName, error);
    }
  }

  /**
   * 執行魔法陣階段
   */
  async executeMagicCirclePhase() {
    if (!this.magicCircle) {
      console.warn('[AnimationController] MagicCircle 組件未設置，跳過階段');
      return;
    }

    console.log('🔮 [AnimationController] 開始魔法陣展開');
    
    // 播放魔法陣音效
    if (this.audioManager) {
      this.audioManager.playPhaseSound('magicCircle').catch(err => 
        console.warn('[AnimationController] 魔法陣音效播放失敗:', err)
      );
    }
    
    await this.magicCircle.expand();
    console.log('✅ [AnimationController] 魔法陣展開完成');
  }

  /**
   * 執行能量聚集階段
   */
  async executeEnergyGatherPhase() {
    if (!this.particleSystem) {
      console.warn('[AnimationController] ParticleSystem 組件未設置，跳過階段');
      return;
    }

    console.log('🌀 [AnimationController] 開始能量聚集');
    
    // 播放能量聚集音效
    if (this.audioManager) {
      this.audioManager.playPhaseSound('energyGather').catch(err => 
        console.warn('[AnimationController] 能量聚集音效播放失敗:', err)
      );
    }
    
    await this.particleSystem.playRingFlow();
    console.log('✅ [AnimationController] 能量聚集完成');
  }

  /**
   * 執行粒子爆發階段
   */
  async executeParticleBurstPhase() {
    if (!this.particleSystem) {
      console.warn('[AnimationController] ParticleSystem 組件未設置，跳過階段');
      return;
    }

    console.log('💥 [AnimationController] 開始粒子爆發');
    
    // 播放粒子爆發音效
    if (this.audioManager) {
      this.audioManager.playPhaseSound('particleBurst').catch(err => 
        console.warn('[AnimationController] 粒子爆發音效播放失敗:', err)
      );
    }
    
    try {
      // 確保粒子系統準備就緒
      if (this.particleSystem.playBurst) {
        await this.particleSystem.playBurst();
        console.log('✅ [AnimationController] 粒子爆發完成');
      } else {
        console.error('❌ [AnimationController] ParticleSystem.playBurst 方法不存在');
      }
    } catch (error) {
      console.error('❌ [AnimationController] 粒子爆發執行失敗:', error);
      throw error;
    }
  }

  /**
   * 執行卡牌召喚階段
   */
  async executeCardSummoningPhase() {
    if (!this.cardSummoning) {
      console.warn('[AnimationController] CardSummoning 組件未設置，跳過階段');
      return;
    }

    console.log('🎴 [AnimationController] 開始卡牌召喚');
    
    // 播放卡牌召喚音效
    if (this.audioManager) {
      this.audioManager.playPhaseSound('cardSummoning').catch(err => 
        console.warn('[AnimationController] 卡牌召喚音效播放失敗:', err)
      );
    }
    
    // 傳入專案數據（如果有的話）
    const projectData = this.state.projectData || { title: '召喚卡牌' };
    await this.cardSummoning.playSummoningAnimation(projectData);
    console.log('✅ [AnimationController] 卡牌召喚完成');
  }

  /**
   * 執行轉場階段
   */
  async executeTransitionPhase() {
    console.log('🌟 [AnimationController] 開始轉場準備');
    
    // 播放轉場音效
    if (this.audioManager) {
      this.audioManager.playPhaseSound('transition').catch(err => 
        console.warn('[AnimationController] 轉場音效播放失敗:', err)
      );
    }
    
    // 這裡可以添加轉場到專案詳情模態框的邏輯
    // 目前只是完成標記
    await new Promise(resolve => setTimeout(resolve, this.config.sequence.phases.transition.duration));
    
    console.log('✅ [AnimationController] 轉場準備完成');
  }

  /**
   * 綁定組件事件
   */
  bindComponentEvents() {
    // 監聽各組件的完成事件
    if (this.magicCircle) {
      // MagicCircle 的事件可能需要從組件內部觸發
    }
    
    if (this.particleSystem) {
      // ParticleSystem 的事件可能需要從組件內部觸發
    }
    
    if (this.cardSummoning) {
      this.cardSummoning.on('summoningComplete', (projectData) => {
        console.log('🎴 [AnimationController] 收到卡牌召喚完成事件:', projectData);
      });
    }
  }

  /**
   * 更新動畫進度
   */
  updateProgress() {
    if (!this.masterTimeline) return;
    
    const totalProgress = this.masterTimeline.progress();
    this.state.totalProgress = totalProgress;
    
    // 計算當前階段進度
    const currentTime = this.masterTimeline.time() * 1000; // 轉為毫秒
    const { phases } = this.config.sequence;
    
    for (const [phaseName, phase] of Object.entries(phases)) {
      if (currentTime >= phase.start && currentTime <= (phase.start + phase.duration)) {
        const phaseProgress = (currentTime - phase.start) / phase.duration;
        this.state.phaseProgress = Math.max(0, Math.min(1, phaseProgress));
        break;
      }
    }
    
    // 觸發進度更新事件
    this.emit('progressUpdate', {
      total: this.state.totalProgress,
      phase: this.state.phaseProgress,
      currentPhase: this.currentPhase
    });
  }

  /**
   * 處理序列完成
   */
  handleSequenceComplete() {
    console.log('✅ [AnimationController] 召喚序列完成');
    
    this.isAnimating = false;
    this.currentPhase = 'completed';
    this.state.currentPhase = 'completed';
    this.state.totalProgress = 1;
    
    // 觸發完成事件
    this.emit('sequenceComplete', this.state.projectData);
    
    if (this.onComplete) {
      this.onComplete(this.state.projectData);
    }
    
    // 自動清理（如果啟用）
    if (this.config.coordination.autoCleanup) {
      setTimeout(() => {
        this.reset();
      }, 1000); // 1秒後清理
    }
  }

  /**
   * 處理階段錯誤
   */
  handlePhaseError(phaseName, error) {
    console.error(`❌ [AnimationController] 階段 ${phaseName} 發生錯誤:`, error);
    
    this.state.lastError = { phase: phaseName, error };
    
    // 觸發錯誤事件
    this.emit('phaseError', { phase: phaseName, error });
    
    if (this.onError) {
      this.onError(phaseName, error);
    }
    
    // 錯誤恢復邏輯
    if (this.config.coordination.errorRecovery) {
      this.recoverFromError(phaseName, error);
    }
  }

  /**
   * 錯誤恢復
   */
  recoverFromError(phaseName, error) {
    console.log(`🔧 [AnimationController] 嘗試從階段 ${phaseName} 的錯誤中恢復`);
    
    // 簡單的錯誤恢復：跳過失敗的階段，繼續執行下一階段
    // 在實際應用中，可能需要更複雜的恢復邏輯
  }

  /**
   * 播放完整召喚序列
   */
  async playSummoningSequence(projectData = null) {
    if (this.isAnimating) {
      console.warn('[AnimationController] 召喚序列正在進行中，忽略新請求');
      return;
    }

    console.log('🎮 [AnimationController] 開始播放完整召喚序列');
    
    // 存儲專案數據
    this.state.projectData = projectData;
    
    // 重置狀態
    this.reset();
    
    // 播放主控時間軸
    this.masterTimeline.restart();
    
    return new Promise((resolve, reject) => {
      // 監聽完成事件
      const handleComplete = (data) => {
        this.off('sequenceComplete', handleComplete);
        this.off('phaseError', handleError);
        resolve(data);
      };
      
      const handleError = ({ phase, error }) => {
        this.off('sequenceComplete', handleComplete);
        this.off('phaseError', handleError);
        reject(new Error(`序列在階段 ${phase} 失敗: ${error.message}`));
      };
      
      this.on('sequenceComplete', handleComplete);
      this.on('phaseError', handleError);
    });
  }

  /**
   * 創建 DOM 元素
   */
  createElement() {
    const container = document.createElement('div');
    container.className = 'animation-controller-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
      overflow: visible;
    `;
    
    // 按正確的層級順序添加組件元素（從底層到頂層）
    
    // 1. 魔法陣 - 最底層 (z-index: 10)
    if (this.magicCircle) {
      const magicCircleElement = this.magicCircle.createElement();
      container.appendChild(magicCircleElement);
    }
    
    // 2. 粒子系統 - 中間層 (z-index: 15)  
    if (this.particleSystem) {
      const particleElement = this.particleSystem.createElement();
      container.appendChild(particleElement);
    }
    
    // 3. 卡牌召喚 - 最頂層 (z-index: 30)
    if (this.cardSummoning) {
      const cardElement = this.cardSummoning.createElement();
      container.appendChild(cardElement);
    }
    
    this.element = container;
    return container;
  }

  /**
   * 軟重置 - 保持卡牌顯示狀態
   */
  softReset() {
    console.log('🔄 [AnimationController] 軟重置動畫控制器 - 保持卡牌顯示');
    
    // 停止主控時間軸
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
    }
    
    // 重置狀態
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.state.currentPhase = 'idle';
    this.state.totalProgress = 0;
    this.state.phaseProgress = 0;
    this.state.lastError = null;
    
    // 軟重置各組件
    if (this.magicCircle) {
      this.magicCircle.reset();
    }
    
    if (this.particleSystem) {
      this.particleSystem.reset();
    }
    
    if (this.cardSummoning) {
      this.cardSummoning.softReset(); // 使用軟重置保持卡面顯示
    }
    
    console.log('✅ [AnimationController] 軟重置完成');
  }

  /**
   * 完全重置動畫控制器
   */
  reset() {
    console.log('🔄 [AnimationController] 完全重置動畫控制器');
    
    // 停止主控時間軸
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
    }
    
    // 重置狀態
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.state.currentPhase = 'idle';
    this.state.totalProgress = 0;
    this.state.phaseProgress = 0;
    this.state.lastError = null;
    
    // 重置各組件
    if (this.magicCircle) {
      this.magicCircle.reset();
    }
    
    if (this.particleSystem) {
      this.particleSystem.reset();
    }
    
    if (this.cardSummoning) {
      this.cardSummoning.reset();
    }
    
    console.log('✅ [AnimationController] 重置完成');
  }

  /**
   * 清理資源
   */
  destroy() {
    console.log('🗑️ [AnimationController] 清理資源');
    
    // 停止並清理主控時間軸
    if (this.masterTimeline) {
      this.masterTimeline.kill();
      this.masterTimeline = null;
    }
    
    // 移除所有事件監聽器
    this.removeAllListeners();
    
    // 清理組件引用
    this.magicCircle = null;
    this.particleSystem = null;
    this.cardSummoning = null;
    
    // 清理 DOM 元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // 清理父類資源
    super.destroy();
  }
}