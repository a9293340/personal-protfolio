/* global performance, AbortController, DOMException */
/**
 * SummoningTransition.js - 召喚動畫到詳情頁無縫轉場控制器
 * 
 * 功能特色：
 * - 整合召喚動畫與 ProjectCardModal
 * - 精確的 8 秒動畫時序控制
 * - 動畫中斷處理機制
 * - 跨設備效能優化
 * - 記憶體管理策略
 * 
 * 動畫時序：
 * Phase 1: 魔法陣展開 (0-2s)
 * Phase 2: 能量聚集 (2-3.5s)
 * Phase 3: 粒子爆發 (3.5-4.5s)
 * Phase 4: 卡牌顯現 (4.5-6.5s)
 * Phase 5: 轉場準備 (6.5-7s)
 * Phase 6: 模態框切換 (7-8s)
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';
import { MagicCircle } from './MagicCircle.js';
import { ParticleSystem } from './ParticleSystem.js';
import { CardSummoning } from './CardSummoning.js';
import { AudioManager } from './AudioManager.js';
import { ProjectCardModal } from '../InteractiveTimeline/ProjectCardModal.js';

export class SummoningTransition extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };
    
    // 組件實例
    this.components = {
      magicCircle: null,
      particleSystem: null,
      cardSummoning: null,
      animationController: null,
      audioManager: null,
      projectCardModal: null,
      personalProjectModal: null
    };
    
    // 動畫狀態
    this.isTransitioning = false;
    this.currentPhase = 'idle';
    this.transitionTimeline = null;
    
    // 中斷處理
    this.abortController = null;
    this.skipHandlers = new Set();
    
    // 設備檢測 (暫時強制使用 desktop 配置進行測試)
    this.deviceProfile = 'desktop'; // this.detectDeviceProfile();
    
    console.log('🎬 [SummoningTransition] 轉場控制器初始化');
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      animation: {
        totalDuration: 8000,
        phases: {
          magicCircle: { start: 0, duration: 2000 },      // Phase 1
          energyGather: { start: 2000, duration: 1500 },  // Phase 2
          particleBurst: { start: 3500, duration: 1000 }, // Phase 3
          cardReveal: { start: 4500, duration: 2000 },    // Phase 4
          transition: { start: 6500, duration: 500 },     // Phase 5
          modalSwitch: { start: 7000, duration: 1000 }    // Phase 6
        },
        skipEnabled: true,
        skipKey: 'Escape'
      },
      performance: {
        desktop: {
          particleCount: 2000,
          enableBlur: true,
          enable3D: true,
          audioEnabled: true
        },
        mobile: {
          particleCount: 500,
          enableBlur: false,
          enable3D: false,
          audioEnabled: false
        },
        lowEnd: {
          skipSummoning: true,  // 直接顯示模態框
          particleCount: 0,
          enableBlur: false,
          enable3D: false,
          audioEnabled: false
        }
      },
      memory: {
        maxParticles: 3000,
        cleanupDelay: 500,
        reuseComponents: true
      }
    };
  }
  
  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      currentProject: null,
      sourceElement: null,
      isSkipped: false,
      phase: 'idle',
      startTime: 0,
      elapsedTime: 0
    };
  }
  
  /**
   * 檢測設備性能等級
   */
  detectDeviceProfile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasWebGL = this.checkWebGLSupport();
    const deviceMemory = navigator.deviceMemory || 4; // GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // 低端設備檢測
    if (!hasWebGL || deviceMemory < 2 || hardwareConcurrency < 2) {
      return 'lowEnd';
    }
    
    // 移動設備
    if (isMobile) {
      return 'mobile';
    }
    
    // 桌面設備
    return 'desktop';
  }
  
  /**
   * 檢查 WebGL 支援
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  /**
   * 啟動召喚轉場
   * @param {Object} project - 專案數據
   * @param {HTMLElement} sourceElement - 觸發元素（節點）
   */
  async startTransition(project, sourceElement) {
    if (this.isTransitioning) {
      console.warn('⚠️ [SummoningTransition] 轉場已在進行中');
      return;
    }
    
    console.log('🎬 [SummoningTransition] 開始轉場:', project.title);
    
    // 設置狀態
    this.isTransitioning = true;
    this.state.currentProject = project;
    this.state.sourceElement = sourceElement;
    this.state.isSkipped = false;
    this.state.startTime = performance.now();
    
    // 低端設備直接顯示模態框
    if (this.deviceProfile === 'lowEnd' && this.config.performance.lowEnd.skipSummoning) {
      console.log('📱 [SummoningTransition] 低端設備，跳過召喚動畫');
      await this.showModalDirectly();
      return;
    }
    
    // 創建中斷控制器
    this.abortController = new AbortController();
    
    // 設置跳過處理
    this.setupSkipHandlers();
    
    // 執行召喚序列
    try {
      await this.executeSummoningSequence();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏭️ [SummoningTransition] 動畫被跳過');
        await this.skipToModal();
      } else {
        console.error('❌ [SummoningTransition] 召喚失敗:', error);
        await this.showModalDirectly();
      }
    } finally {
      this.cleanup();
    }
  }
  
  /**
   * 執行召喚序列
   */
  async executeSummoningSequence() {
    const performanceConfig = this.config.performance[this.deviceProfile];
    
    // 創建召喚容器
    const container = this.createSummoningContainer();
    
    // 初始化組件
    await this.initializeComponents(container, performanceConfig);
    
    // 創建 GSAP Timeline
    this.transitionTimeline = gsap.timeline({
      onComplete: () => this.onSequenceComplete(),
      onUpdate: () => this.onSequenceUpdate()
    });
    
    // Phase 1: 魔法陣展開 (0-2s)
    this.transitionTimeline.add(() => {
      this.currentPhase = 'magicCircle';
      if (this.components.magicCircle && this.components.magicCircle.svgElement) {
        this.components.magicCircle.startRotationAnimations();
      } else {
        console.warn('⚠️ [SummoningTransition] MagicCircle 未完全初始化，跳過動畫');
      }
      if (performanceConfig.audioEnabled && this.components.audioManager) {
        this.components.audioManager.playPhaseSound('magicCircle');
      }
    }, 0);
    
    // Phase 2: 能量聚集 (2-3.5s)
    this.transitionTimeline.add(() => {
      this.currentPhase = 'energyGather';
      this.components.particleSystem?.playRingFlow();
    }, 2);
    
    // Phase 3: 粒子爆發 (3.5-4.5s) - 等待環形動畫完成
    this.transitionTimeline.add(() => {
      this.currentPhase = 'particleBurst';
      // 等待一小段時間確保環形動畫完成，然後執行爆發
      setTimeout(() => {
        if (this.components.particleSystem) {
          this.components.particleSystem.isAnimating = false; // 重置動畫狀態
          this.components.particleSystem.playBurst();
        }
      }, 200);
      if (performanceConfig.audioEnabled) {
        this.components.audioManager?.playPhaseSound('particleBurst');
      }
    }, 3.5);
    
    // Phase 4: 卡牌顯現 (4.5-7.5s) - 3秒卡牌動畫
    this.transitionTimeline.add(() => {
      this.currentPhase = 'cardReveal';
      this.components.cardSummoning?.playSummoningAnimation(this.state.currentProject);
    }, 4.5);
    
    // Phase 5: 轉場準備 (7.5-8s) - 等待卡片完整動畫
    this.transitionTimeline.add(() => {
      this.currentPhase = 'transition';
      this.prepareModalTransition();
    }, 7.5);
    
    // Phase 6: 模態框切換 (8-9s)
    this.transitionTimeline.add(() => {
      this.currentPhase = 'modalSwitch';
      this.switchToModal();
    }, 8);
    
    // 開始動畫
    this.transitionTimeline.play();
    
    // 等待完成或中斷
    return new Promise((resolve, reject) => {
      this.abortController.signal.addEventListener('abort', () => {
        this.transitionTimeline?.kill();
        reject(new DOMException('Animation aborted', 'AbortError'));
      });
      
      this.transitionTimeline.eventCallback('onComplete', resolve);
    });
  }
  
  /**
   * 創建召喚容器
   */
  createSummoningContainer() {
    const container = document.createElement('div');
    container.className = 'summoning-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0);
      transition: background 0.5s;
      pointer-events: auto;
    `;
    
    document.body.appendChild(container);
    
    // 淡入背景
    requestAnimationFrame(() => {
      container.style.background = 'rgba(0, 0, 0, 0.85)';
    });
    
    return container;
  }
  
  /**
   * 初始化組件
   */
  async initializeComponents(container, performanceConfig) {
    // 魔法陣
    if (performanceConfig.enable3D !== false) {
      this.components.magicCircle = new MagicCircle({
        container,
        size: this.deviceProfile === 'mobile' ? 300 : 400
      });
      await this.components.magicCircle.init();
    }
    
    // 粒子系統
    if (performanceConfig.particleCount > 0) {
      this.components.particleSystem = new ParticleSystem({
        container,
        maxParticles: performanceConfig.particleCount
      });
      await this.components.particleSystem.init();
    }
    
    // 卡牌召喚
    this.components.cardSummoning = new CardSummoning({
      container,
      card: {
        width: this.deviceProfile === 'mobile' ? 200 : 280,
        height: this.deviceProfile === 'mobile' ? 292 : 410
      }
    });
    await this.components.cardSummoning.init();
    
    // 音效管理器
    if (performanceConfig.audioEnabled) {
      this.components.audioManager = new AudioManager();
      await this.components.audioManager.init();
    }
  }
  
  /**
   * 設置跳過處理
   */
  setupSkipHandlers() {
    if (!this.config.animation.skipEnabled) return;
    
    // ESC 鍵跳過
    const handleKeydown = (e) => {
      if (e.key === this.config.animation.skipKey) {
        this.skip();
      }
    };
    
    // 點擊背景跳過
    const handleClick = (e) => {
      if (e.target.classList.contains('summoning-container')) {
        this.skip();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClick);
    
    this.skipHandlers.add(() => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleClick);
    });
  }
  
  /**
   * 跳過動畫
   */
  skip() {
    if (this.state.isSkipped) return;
    
    console.log('⏭️ [SummoningTransition] 跳過召喚動畫');
    this.state.isSkipped = true;
    this.abortController?.abort();
  }
  
  /**
   * 準備模態框轉場
   */
  prepareModalTransition() {
    // 淡出召喚元素
    const container = document.querySelector('.summoning-container');
    if (container && container.children.length > 0) {
      gsap.to(Array.from(container.children), {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        stagger: 0.1
      });
    }
  }
  
  /**
   * 切換到模態框
   */
  async switchToModal() {
    console.log('🔄 [SummoningTransition] 切換到模態框');
    
    // 檢查是否為個人專案模態框
    if (this.state.currentProject && !this.state.currentProject.date) {
      // 個人專案使用 PersonalProjectModal
      if (!this.components.personalProjectModal) {
        const { PersonalProjectModal } = await import('../PersonalProjects/PersonalProjectModal.js');
        this.components.personalProjectModal = new PersonalProjectModal();
      }
      
      // 顯示模態框
      await this.components.personalProjectModal.show(this.state.currentProject);
    } else {
      // 工作專案使用 ProjectCardModal
      if (!this.components.projectCardModal) {
        this.components.projectCardModal = new ProjectCardModal({
          project: this.state.currentProject,
          sourceElement: this.state.sourceElement,
          animation: {
            skipFlyIn: true  // 跳過飛入動畫
          }
        });
      }
      
      // 顯示模態框
      await this.components.projectCardModal.show(
        this.state.currentProject,
        this.state.sourceElement
      );
    }
    
    // 移除召喚容器
    const container = document.querySelector('.summoning-container');
    if (container) {
      gsap.to(container, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => container.remove()
      });
    }
  }
  
  /**
   * 直接顯示模態框（跳過召喚）
   */
  async showModalDirectly() {
    console.log('➡️ [SummoningTransition] 直接顯示模態框');
    
    // 檢查是否為個人專案模態框
    if (this.state.currentProject && !this.state.currentProject.date) {
      // 個人專案使用 PersonalProjectModal
      const { PersonalProjectModal } = await import('../PersonalProjects/PersonalProjectModal.js');
      const modal = new PersonalProjectModal();
      await modal.show(this.state.currentProject);
    } else {
      // 工作專案使用 ProjectCardModal
      const modal = new ProjectCardModal();
      await modal.show(this.state.currentProject, this.state.sourceElement);
    }
    
    this.isTransitioning = false;
  }
  
  /**
   * 跳到模態框
   */
  async skipToModal() {
    // 立即停止所有動畫
    this.transitionTimeline?.kill();
    
    // 清理召喚組件
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // 顯示模態框
    await this.showModalDirectly();
  }
  
  /**
   * 序列完成回調
   */
  onSequenceComplete() {
    console.log('✅ [SummoningTransition] 召喚序列完成');
    this.isTransitioning = false;
  }
  
  /**
   * 序列更新回調
   */
  onSequenceUpdate() {
    this.state.elapsedTime = performance.now() - this.state.startTime;
  }
  
  /**
   * 清理資源
   */
  cleanup() {
    console.log('🧹 [SummoningTransition] 清理資源');
    
    // 清理跳過處理器
    this.skipHandlers.forEach(handler => handler());
    this.skipHandlers.clear();
    
    // 延遲清理組件（避免影響動畫）
    setTimeout(() => {
      Object.keys(this.components).forEach(key => {
        const component = this.components[key];
        // ⚠️ 測試模式：保留 modal 組件不銷毀，方便測試關閉功能
        if (key === 'personalProjectModal' || key === 'projectCardModal') {
          console.log(`🧪 [SummoningTransition] 測試模式：保留 ${key} 組件不銷毀`);
          return; // 跳過 modal 銷毀
        }
        
        if (component && typeof component.destroy === 'function') {
          component.destroy();
        }
        this.components[key] = null;
      });
      
      // 重置非 modal 組件
      this.components.magicCircle = null;
      this.components.particleSystem = null;
      this.components.cardSummoning = null;
      this.components.animationController = null;
      this.components.audioManager = null;
      // 保留 modal 組件：personalProjectModal 和 projectCardModal
    }, this.config.memory.cleanupDelay);
    
    // 重置狀態
    this.isTransitioning = false;
    this.currentPhase = 'idle';
    this.transitionTimeline = null;
    this.abortController = null;
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    this.cleanup();
    super.destroy();
  }
}