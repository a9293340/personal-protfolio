// @ts-nocheck
/**
 * ParticleSystem.js - Three.js 3D 粒子效果系統
 * 
 * 功能特色：
 * - 環形粒子流動畫（Ring Flow）
 * - 星塵爆發效果（Stardust Burst）
 * - 設備性能自適應
 * - 記憶體管理和資源清理
 * - 與 MagicCircle 同步動畫
 * 
 * 基於 POC-003 規格實現，支援召喚特效完整序列
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class ParticleSystem extends BaseComponent {
  constructor(config = {}) {
    super();
    
    // 初始化配置和狀態
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };
    
    // Three.js 核心實例
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationFrame = null;
    
    // 粒子系統
    this.ringFlowParticles = null;
    this.burstParticles = null;
    this.particleGeometry = null;
    this.particleMaterial = null;
    
    // 動畫狀態
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.animations = {};
    
    console.log('🌟 [ParticleSystem] 粒子系統初始化，配置:', this.config);
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      container: {
        width: 600,
        height: 600
      },
      performance: {
        maxParticles: this.getOptimalParticleCount(),
        enableWebGL2: true,
        antialias: false,  // 移動端關閉抗鋸齒以提升性能
        powerPreference: 'high-performance'
      },
      ringFlow: {
        particleCount: 800,
        radius: 200,
        ringWidth: 50,
        speed: 0.02,
        color: 0xd4af37,
        opacity: 0.8,
        size: 2.0
      },
      burst: {
        particleCount: 1200,
        radius: 300,
        speed: 2.5,
        duration: 1000,
        color: 0xf4d03f,
        fadeSpeed: 0.98
      },
      animation: {
        ringFlowDuration: 1500,   // 環形粒子流時長 (ms)
        burstDuration: 1000,      // 爆發效果時長 (ms)
        fadeOutDuration: 500      // 消散時長 (ms)
      }
    };
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      isVisible: false,
      currentPhase: 'idle',
      particlesActive: 0,
      performance: {
        fps: 0,
        triangles: 0
      }
    };
  }

  /**
   * 組件初始化
   */
  async init() {
    console.log('🔧 [ParticleSystem] 開始初始化');
    
    try {
      // 檢查 WebGL 支援
      if (!this.checkWebGLSupport()) {
        throw new Error('WebGL 不支援，無法初始化 3D 粒子系統');
      }

      // 初始化 Three.js 場景
      this.initThreeJS();
      
      // 創建粒子系統
      this.createParticleSystems();
      
      // 啟動渲染循環
      this.startRenderLoop();
      
      console.log('✅ [ParticleSystem] 初始化完成');
      
    } catch (error) {
      console.error('❌ [ParticleSystem] 初始化失敗:', error);
      throw error;
    }
  }

  /**
   * 檢查 WebGL 支援
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  /**
   * 獲取最佳粒子數量（設備性能適配）
   */
  getOptimalParticleCount() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasWebGL2 = !!document.createElement('canvas').getContext('webgl2');
    
    // GPU 檢測（簡化版）
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    let isLowEndGPU = false;
    
    if (gl) {
      try {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          isLowEndGPU = renderer && (
            renderer.includes('Intel HD') || 
            renderer.includes('Mali') ||
            renderer.includes('Software')
          );
        }
      } catch (e) {
        // 忽略檢測錯誤
      }
    }
    
    // 根據設備能力調整粒子數量
    if (isMobile) return 1000;
    if (isLowEndGPU || !hasWebGL2) return 1500;
    return 3000; // 桌面端高性能設備
  }

  /**
   * 初始化 Three.js 場景
   */
  initThreeJS() {
    const { width, height } = this.config.container;
    
    // 創建場景
    this.scene = new window.THREE.Scene();
    
    // 創建攝影機
    this.camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 300;
    
    // 創建渲染器
    this.renderer = new window.THREE.WebGLRenderer({
      antialias: this.config.performance.antialias,
      alpha: true, // 背景透明
      powerPreference: this.config.performance.powerPreference
    });
    
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0); // 透明背景
    
    console.log('🎬 [ParticleSystem] Three.js 場景初始化完成');
  }

  /**
   * 創建粒子系統
   */
  createParticleSystems() {
    // 創建環形粒子流
    this.createRingFlowParticles();
    
    // 創建爆發粒子
    this.createBurstParticles();
    
    console.log('💫 [ParticleSystem] 粒子系統創建完成');
  }

  /**
   * 創建環形粒子流
   */
  createRingFlowParticles() {
    const { ringFlow } = this.config;
    const particleCount = Math.min(ringFlow.particleCount, this.config.performance.maxParticles * 0.6);
    
    // 創建幾何體
    const geometry = new window.THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    const phases = [];
    
    for (let i = 0; i < particleCount; i++) {
      // 隨機分佈在環形區域
      const angle = Math.random() * Math.PI * 2;
      const radius = ringFlow.radius + (Math.random() - 0.5) * ringFlow.ringWidth;
      
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 20
      );
      
      // 切向速度
      velocities.push(-Math.sin(angle), Math.cos(angle), 0);
      phases.push(Math.random() * Math.PI * 2);
    }
    
    geometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new window.THREE.Float32BufferAttribute(velocities, 3));
    geometry.setAttribute('phase', new window.THREE.Float32BufferAttribute(phases, 1));
    
    // 創建材質
    const material = new window.THREE.PointsMaterial({
      color: ringFlow.color,
      size: ringFlow.size,
      transparent: true,
      opacity: 0, // 初始透明
      blending: window.THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // 創建粒子系統
    this.ringFlowParticles = new window.THREE.Points(geometry, material);
    this.scene.add(this.ringFlowParticles);
  }

  /**
   * 創建爆發粒子
   */
  createBurstParticles() {
    const { burst } = this.config;
    const particleCount = Math.min(burst.particleCount, this.config.performance.maxParticles * 0.4);
    
    // 創建幾何體
    const geometry = new window.THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
      // 從中心向外爆發
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      
      positions.push(0, 0, 0);
      velocities.push(x * burst.speed, y * burst.speed, z * burst.speed);
    }
    
    geometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new window.THREE.Float32BufferAttribute(velocities, 3));
    
    // 創建材質
    const material = new window.THREE.PointsMaterial({
      color: burst.color,
      size: 3.0,
      transparent: true,
      opacity: 0, // 初始透明
      blending: window.THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // 創建粒子系統
    this.burstParticles = new window.THREE.Points(geometry, material);
    this.scene.add(this.burstParticles);
  }

  /**
   * 啟動渲染循環
   */
  startRenderLoop() {
    const animate = () => {
      this.animationFrame = requestAnimationFrame(animate);
      
      // 更新粒子動畫
      this.updateParticles();
      
      // 渲染場景
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }

  /**
   * 更新粒子動畫
   */
  updateParticles() {
    const time = Date.now() * 0.001;
    
    // 更新環形粒子流
    if (this.ringFlowParticles && this.currentPhase === 'ringFlow') {
      this.updateRingFlowParticles(time);
    }
    
    // 更新爆發粒子
    if (this.burstParticles && this.currentPhase === 'burst') {
      this.updateBurstParticles(time);
    }
  }

  /**
   * 更新環形粒子流動畫
   */
  updateRingFlowParticles(time) {
    const positions = this.ringFlowParticles.geometry.attributes.position.array;
    const velocities = this.ringFlowParticles.geometry.attributes.velocity.array;
    const phases = this.ringFlowParticles.geometry.attributes.phase.array;
    const speed = this.config.ringFlow.speed;
    
    for (let i = 0; i < positions.length; i += 3) {
      // 環形流動
      positions[i] += velocities[i] * speed;
      positions[i + 1] += velocities[i + 1] * speed;
      
      // 垂直波動
      positions[i + 2] = Math.sin(time + phases[i / 3]) * 10;
      
      // 邊界檢查：重新定位到環形
      const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2);
      const { radius, ringWidth } = this.config.ringFlow;
      
      if (distance > radius + ringWidth || distance < radius - ringWidth) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * ringWidth;
        positions[i] = Math.cos(angle) * r;
        positions[i + 1] = Math.sin(angle) * r;
        velocities[i] = -Math.sin(angle);
        velocities[i + 1] = Math.cos(angle);
      }
    }
    
    this.ringFlowParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * 更新爆發粒子動畫
   */
  updateBurstParticles(time) {
    const positions = this.burstParticles.geometry.attributes.position.array;
    const velocities = this.burstParticles.geometry.attributes.velocity.array;
    const material = this.burstParticles.material;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      // 減速效果
      velocities[i] *= this.config.burst.fadeSpeed;
      velocities[i + 1] *= this.config.burst.fadeSpeed;
      velocities[i + 2] *= this.config.burst.fadeSpeed;
    }
    
    // 整體透明度漸變
    if (material.opacity > 0) {
      material.opacity *= this.config.burst.fadeSpeed;
    }
    
    this.burstParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * 播放環形粒子流動畫
   */
  async playRingFlow() {
    if (this.isAnimating) {
      console.warn('[ParticleSystem] 粒子系統正在動畫中，忽略 Ring Flow 請求');
      return;
    }

    console.log('🌀 [ParticleSystem] 開始環形粒子流動畫');
    this.isAnimating = true;
    this.currentPhase = 'ringFlow';
    this.state.currentPhase = 'ringFlow';

    // 漸現動畫
    const material = this.ringFlowParticles.material;
    
    return new Promise((resolve) => {
      window.gsap.fromTo(material, {
        opacity: 0
      }, {
        opacity: this.config.ringFlow.opacity,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // 持續播放指定時間
          setTimeout(() => {
            // 漸隱
            window.gsap.to(material, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                this.currentPhase = 'idle';
                this.isAnimating = false;
                console.log('✅ [ParticleSystem] 環形粒子流動畫完成');
                resolve();
              }
            });
          }, this.config.animation.ringFlowDuration);
        }
      });
    });
  }

  /**
   * 播放星塵爆發動畫
   */
  async playBurst() {
    if (this.isAnimating) {
      console.warn('[ParticleSystem] 粒子系統正在動畫中，忽略 Burst 請求');
      return;
    }

    console.log('💥 [ParticleSystem] 開始星塵爆發動畫');
    this.isAnimating = true;
    this.currentPhase = 'burst';
    this.state.currentPhase = 'burst';

    // 重置爆發粒子位置
    const positions = this.burstParticles.geometry.attributes.position.array;
    const velocities = this.burstParticles.geometry.attributes.velocity.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = 0;
      positions[i + 1] = 0;
      positions[i + 2] = 0;
      
      // 重新計算速度向量
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const speed = this.config.burst.speed;
      
      velocities[i] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i + 2] = Math.cos(phi) * speed;
    }
    
    this.burstParticles.geometry.attributes.position.needsUpdate = true;
    
    // 爆發動畫
    const material = this.burstParticles.material;
    
    return new Promise((resolve) => {
      // 瞬間顯現並逐漸消散
      material.opacity = 1.0;
      
      setTimeout(() => {
        // 動畫結束時完全清理
        this.resetBurstParticles();
        
        this.currentPhase = 'idle';
        this.isAnimating = false;
        console.log('✅ [ParticleSystem] 星塵爆發動畫完成');
        resolve();
      }, this.config.animation.burstDuration);
    });
  }

  /**
   * 重置環形粒子流狀態
   */
  resetRingFlowParticles() {
    if (!this.ringFlowParticles) return;
    
    // 重置材質透明度
    this.ringFlowParticles.material.opacity = 0;
    
    // 重置粒子位置到初始環形分佈
    const positions = this.ringFlowParticles.geometry.attributes.position.array;
    const velocities = this.ringFlowParticles.geometry.attributes.velocity.array;
    const phases = this.ringFlowParticles.geometry.attributes.phase.array;
    const { ringFlow } = this.config;
    
    for (let i = 0; i < positions.length; i += 3) {
      // 重新分佈在環形區域
      const angle = Math.random() * Math.PI * 2;
      const radius = ringFlow.radius + (Math.random() - 0.5) * ringFlow.ringWidth;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = Math.sin(angle) * radius;
      positions[i + 2] = (Math.random() - 0.5) * 20;
      
      // 重設切向速度
      velocities[i] = -Math.sin(angle);
      velocities[i + 1] = Math.cos(angle);
      velocities[i + 2] = 0;
      
      phases[i / 3] = Math.random() * Math.PI * 2;
    }
    
    this.ringFlowParticles.geometry.attributes.position.needsUpdate = true;
    this.ringFlowParticles.geometry.attributes.velocity.needsUpdate = true;
    this.ringFlowParticles.geometry.attributes.phase.needsUpdate = true;
    
    console.log('🔄 [ParticleSystem] 環形粒子流已重置');
  }

  /**
   * 重置爆發粒子狀態
   */
  resetBurstParticles() {
    if (!this.burstParticles) return;
    
    // 重置材質透明度
    this.burstParticles.material.opacity = 0;
    
    // 重置所有粒子位置到中心點
    const positions = this.burstParticles.geometry.attributes.position.array;
    const velocities = this.burstParticles.geometry.attributes.velocity.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = 0;
      positions[i + 1] = 0;
      positions[i + 2] = 0;
      
      velocities[i] = 0;
      velocities[i + 1] = 0;
      velocities[i + 2] = 0;
    }
    
    this.burstParticles.geometry.attributes.position.needsUpdate = true;
    this.burstParticles.geometry.attributes.velocity.needsUpdate = true;
    
    console.log('🧹 [ParticleSystem] 爆發粒子已重置');
  }

  /**
   * 創建 DOM 元素
   */
  createElement() {
    const container = document.createElement('div');
    container.className = 'particle-system-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 15;
      overflow: visible;
    `;
    
    // 添加 Three.js 渲染器的 canvas
    const canvas = this.renderer.domElement;
    canvas.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;
    container.appendChild(canvas);
    
    this.element = container;
    return container;
  }

  /**
   * 重置粒子系統
   */
  reset() {
    console.log('🔄 [ParticleSystem] 重置粒子系統');
    
    // 停止所有動畫
    this.isAnimating = false;
    this.currentPhase = 'idle';
    this.state.currentPhase = 'idle';
    
    // 重置環形粒子流
    if (this.ringFlowParticles) {
      this.ringFlowParticles.material.opacity = 0;
      this.resetRingFlowParticles();
    }
    
    // 重置爆發粒子
    if (this.burstParticles) {
      this.resetBurstParticles();
    }
    
    // 重置狀態
    this.state.isVisible = false;
    this.state.particlesActive = 0;
    
    console.log('✅ [ParticleSystem] 粒子系統重置完成');
  }

  /**
   * 清理資源
   */
  destroy() {
    console.log('🗑️ [ParticleSystem] 清理資源');
    
    // 停止渲染循環
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // 清理 Three.js 資源
    if (this.ringFlowParticles) {
      this.ringFlowParticles.geometry.dispose();
      this.ringFlowParticles.material.dispose();
      this.scene.remove(this.ringFlowParticles);
    }
    
    if (this.burstParticles) {
      this.burstParticles.geometry.dispose();
      this.burstParticles.material.dispose();
      this.scene.remove(this.burstParticles);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // 清理 GSAP 動畫
    Object.values(this.animations).forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    
    // 清理父類資源
    super.destroy();
  }
}