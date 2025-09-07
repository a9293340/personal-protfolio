/**
 * PersonalProjectCard.js - 個人專案卡牌組件
 * 
 * 功能特色：
 * - 遊戲王風格卡牌設計
 * - 稀有度驅動的視覺效果
 * - 3D 懸停動畫效果
 * - 響應式卡牌尺寸
 * - 卡牌資訊展示
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class PersonalProjectCard extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.project = config.project;
    this.index = config.index || 0;
    this.onClick = config.onClick || (() => {});
    
    // DOM 元素
    this.element = null;
    this.cardFront = null;
    this.cardBack = null;
    
    // 動畫狀態
    this.isHovered = false;
    this.hoverAnimation = null;
    
    console.log('🃏 [PersonalProjectCard] 卡牌組件初始化:', this.project?.title);
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      size: {
        width: 280,
        height: 390,  // 接近遊戲王卡牌比例
        borderRadius: 12
      },
      animation: {
        hover: {
          duration: 0.3,
          scale: 1.05,
          tiltAngle: 8,
          glowIntensity: 0.8
        },
        click: {
          duration: 0.2,
          scale: 0.95
        }
      },
      rarity: {
        normal: {
          borderColor: '#8e8e8e',
          glowColor: '#ffffff',
          particleCount: 0
        },
        rare: {
          borderColor: '#4169e1',
          glowColor: '#4169e1',
          particleCount: 3
        },
        superRare: {
          borderColor: '#9400d3',
          glowColor: '#9400d3',
          particleCount: 5
        },
        legendary: {
          borderColor: '#ffd700',
          glowColor: '#ffd700',
          particleCount: 8
        }
      }
    };
  }
  
  /**
   * 渲染卡牌
   */
  render() {
    this.createElement();
    this.bindEvents();
    this.applyRarityEffects();
    
    return this.element;
  }
  
  /**
   * 創建 DOM 元素
   */
  createElement() {
    const project = this.project;
    const rarityConfig = this.config.rarity[project.rarity] || this.config.rarity.normal;
    
    this.element = document.createElement('div');
    this.element.className = `project-card rarity-${project.rarity} status-${project.status}`;
    this.element.dataset.projectId = project.id;
    this.element.dataset.rarity = project.rarity;
    
    // 卡牌樣式
    this.element.style.cssText = `
      width: ${this.config.size.width}px;
      height: ${this.config.size.height}px;
      border-radius: ${this.config.size.borderRadius}px;
      position: relative;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: all 0.3s ease;
      border: 3px solid ${rarityConfig.borderColor};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
    `;
    
    // 卡牌內容
    this.element.innerHTML = `
      <div class="card-glow" style="
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: ${this.config.size.borderRadius + 2}px;
        background: ${rarityConfig.glowColor};
        opacity: 0;
        z-index: -1;
        transition: opacity 0.3s ease;
      "></div>
      
      <div class="card-content" style="
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 15px;
        position: relative;
        z-index: 1;
      ">
        <div class="card-header" style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        ">
          <div class="card-title" style="
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            line-height: 1.2;
            flex: 1;
            margin-right: 10px;
          ">${project.title}</div>
          
          <div class="card-rarity" style="
            font-size: 20px;
            opacity: 0.9;
          ">${this.getRarityIcon(project.rarity)}</div>
        </div>
        
        <div class="card-image" style="
          flex: 1;
          background: linear-gradient(135deg, 
            rgba(${this.getRarityRgb(project.rarity)}, 0.1) 0%, 
            rgba(${this.getRarityRgb(project.rarity)}, 0.05) 100%);
          border-radius: 8px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        ">
          <div class="image-placeholder" style="
            font-size: 48px;
            opacity: 0.6;
          ">${this.getCategoryIcon(project.category)}</div>
          
          ${project.images?.thumbnail ? `
            <img src="${project.images.thumbnail}" alt="${project.title}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 8px;
              position: absolute;
              top: 0;
              left: 0;
            ">
          ` : ''}
        </div>
        
        <div class="card-info" style="
          font-size: 12px;
          color: #a0a0a0;
          margin-bottom: 10px;
          line-height: 1.3;
        ">${project.description}</div>
        
        <div class="card-stats" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #d4af37;
        ">
          <div class="stat-group">
            <span class="stat-label">ATK/</span>
            <span class="stat-value">${project.cardData?.attack || '???'}</span>
          </div>
          <div class="stat-group">
            <span class="stat-label">DEF/</span>
            <span class="stat-value">${project.cardData?.defense || '???'}</span>
          </div>
          <div class="stat-group">
            <span class="stat-label">LV</span>
            <span class="stat-value">${project.cardData?.level || '?'}</span>
          </div>
        </div>
        
        <div class="card-footer" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 10px;
          color: #8e8e8e;
        ">
          <div class="card-category">${this.getCategoryLabel(project.category)}</div>
          <div class="card-date">${project.completedDate}</div>
        </div>
      </div>
      
      <div class="card-particles" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: ${this.config.size.borderRadius}px;
        overflow: hidden;
      "></div>
      
      <div class="card-shine" style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, 
          transparent 30%, 
          rgba(255, 255, 255, 0.3) 50%, 
          transparent 70%);
        transform: rotate(45deg) translateX(-200%);
        transition: transform 0.6s ease;
        pointer-events: none;
        border-radius: ${this.config.size.borderRadius}px;
      "></div>
    `;
    
    // 獲取子元素引用
    this.cardGlow = this.element.querySelector('.card-glow');
    this.cardShine = this.element.querySelector('.card-shine');
    this.cardParticles = this.element.querySelector('.card-particles');
  }
  
  /**
   * 應用稀有度特效
   */
  applyRarityEffects() {
    const rarityConfig = this.config.rarity[this.project.rarity] || this.config.rarity.normal;
    
    // 創建粒子效果（僅限稀有以上）
    if (rarityConfig.particleCount > 0) {
      this.createParticleEffect(rarityConfig);
    }
    
    // 傳說級卡牌額外效果
    if (this.project.rarity === 'legendary') {
      this.createLegendaryEffect();
    }
  }
  
  /**
   * 創建粒子效果
   */
  createParticleEffect(rarityConfig) {
    for (let i = 0; i < rarityConfig.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'card-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${rarityConfig.glowColor};
        border-radius: 50%;
        opacity: 0.8;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${2 + Math.random() * 3}s infinite ease-in-out;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      this.cardParticles.appendChild(particle);
    }
    
    // 添加動畫 CSS（如果尚未添加）
    if (!document.querySelector('#card-particle-animations')) {
      const style = document.createElement('style');
      style.id = 'card-particle-animations';
      style.textContent = `
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        
        @keyframes legendaryPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * 創建傳說級特效
   */
  createLegendaryEffect() {
    this.element.style.animation = 'legendaryPulse 3s infinite ease-in-out';
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 滑鼠懸停事件
    this.element.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // 點擊事件
    this.element.addEventListener('click', () => this.handleClick());
    
    // 鍵盤支援
    this.element.setAttribute('tabindex', '0');
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    });
  }
  
  /**
   * 處理滑鼠進入
   */
  handleMouseEnter() {
    this.isHovered = true;
    
    // 停止之前的動畫
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
    }
    
    // 創建懸停動畫
    this.hoverAnimation = gsap.timeline();
    
    // 卡牌縮放和傾斜
    this.hoverAnimation.to(this.element, {
      scale: this.config.animation.hover.scale,
      rotationY: this.config.animation.hover.tiltAngle,
      z: 50,
      duration: this.config.animation.hover.duration,
      ease: "power2.out"
    });
    
    // 發光效果
    this.hoverAnimation.to(this.cardGlow, {
      opacity: this.config.animation.hover.glowIntensity,
      duration: this.config.animation.hover.duration
    }, 0);
    
    // 光澤效果
    this.hoverAnimation.to(this.cardShine, {
      transform: 'rotate(45deg) translateX(200%)',
      duration: 0.6,
      ease: "power2.out"
    }, 0.1);
    
    console.log(`✨ [PersonalProjectCard] 卡牌懸停: ${this.project.title}`);
  }
  
  /**
   * 處理滑鼠離開
   */
  handleMouseLeave() {
    this.isHovered = false;
    
    // 停止之前的動畫
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
    }
    
    // 恢復原始狀態
    this.hoverAnimation = gsap.timeline();
    
    this.hoverAnimation.to(this.element, {
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      z: 0,
      duration: this.config.animation.hover.duration,
      ease: "power2.out"
    });
    
    this.hoverAnimation.to(this.cardGlow, {
      opacity: 0,
      duration: this.config.animation.hover.duration
    }, 0);
    
    // 重置光澤位置
    gsap.set(this.cardShine, {
      transform: 'rotate(45deg) translateX(-200%)'
    });
  }
  
  /**
   * 處理滑鼠移動（3D 跟隨效果）
   */
  handleMouseMove(e) {
    if (!this.isHovered) return;
    
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // 計算旋轉角度（限制在合理範圍內）
    const rotateX = (mouseY / rect.height) * -20;  // 上下旋轉
    const rotateY = (mouseX / rect.width) * 20;    // 左右旋轉
    
    // 應用 3D 旋轉
    gsap.to(this.element, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true
    });
  }
  
  /**
   * 處理點擊
   */
  handleClick() {
    console.log(`🎯 [PersonalProjectCard] 卡牌點擊: ${this.project.title}`);
    
    // 點擊動畫
    gsap.to(this.element, {
      scale: this.config.animation.click.scale,
      duration: this.config.animation.click.duration,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // 觸發點擊回調
        this.onClick(this.project, this.element);
      }
    });
  }
  
  /**
   * 獲取稀有度圖標
   */
  getRarityIcon(rarity) {
    const icons = {
      normal: '⚪',
      rare: '🔸',
      superRare: '💎',
      legendary: '⭐'
    };
    return icons[rarity] || icons.normal;
  }
  
  /**
   * 獲取稀有度 RGB 值
   */
  getRarityRgb(rarity) {
    const colors = {
      normal: '142, 142, 142',      // 灰色
      rare: '65, 105, 225',         // 藍色
      superRare: '148, 0, 211',     // 紫色
      legendary: '255, 215, 0'      // 金色
    };
    return colors[rarity] || colors.normal;
  }
  
  /**
   * 獲取類型圖標
   */
  getCategoryIcon(category) {
    const icons = {
      frontend: '🎨',
      backend: '⚙️',
      fullstack: '🔧',
      mobile: '📱',
      ai: '🧠',
      blockchain: '⛓️'
    };
    return icons[category] || '💻';
  }
  
  /**
   * 獲取類型標籤
   */
  getCategoryLabel(category) {
    const labels = {
      frontend: '前端',
      backend: '後端',
      fullstack: '全端',
      mobile: '移動端',
      ai: 'AI/ML',
      blockchain: '區塊鏈'
    };
    return labels[category] || '通用';
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [PersonalProjectCard] 銷毀卡牌組件:', this.project?.title);
    
    // 停止動畫
    if (this.hoverAnimation) {
      this.hoverAnimation.kill();
    }
    
    // 移除事件監聽器
    if (this.element) {
      this.element.removeEventListener('mouseenter', this.handleMouseEnter);
      this.element.removeEventListener('mouseleave', this.handleMouseLeave);
      this.element.removeEventListener('mousemove', this.handleMouseMove);
      this.element.removeEventListener('click', this.handleClick);
    }
    
    super.destroy();
  }
}