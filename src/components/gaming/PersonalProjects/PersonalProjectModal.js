/**
 * PersonalProjectModal.js - 個人專案詳情模態框
 * 
 * 功能特色：
 * - 遊戲王風格詳情展示
 * - 專案技術棧、圖片、連結展示
 * - 響應式設計
 * - 鍵盤導航支援
 * - 平滑進出動畫
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class PersonalProjectModal extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = { ...this.getInitialState() };
    
    // DOM 元素
    this.element = null;
    this.backdrop = null;
    this.modal = null;
    this.closeBtn = null;
    
    // 狀態
    this.isVisible = false;
    this.currentProject = null;
    
    // 動畫
    this.showAnimation = null;
    this.hideAnimation = null;
    
    console.log('📋 [PersonalProjectModal] 模態框初始化');
  }
  
  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      size: {
        maxWidth: '90vw',
        maxHeight: '90vh',
        minWidth: '320px'
      },
      animation: {
        duration: 0.4,
        backdropOpacity: 0.85
      },
      zIndex: 10000,
      closeOnBackdrop: true,
      closeOnEscape: true
    };
  }
  
  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      isAnimating: false
    };
  }
  
  /**
   * 顯示模態框
   */
  async show(project) {
    if (this.isVisible || this.state.isAnimating) {
      return;
    }
    
    console.log(`📋 [PersonalProjectModal] 顯示專案詳情: ${project.title}`);
    
    this.currentProject = project;
    this.state.isAnimating = true;
    
    // 創建模態框（如果不存在）
    if (!this.element) {
      this.createElement();
    }
    
    // 更新內容
    this.updateContent(project);
    
    // 顯示模態框
    document.body.appendChild(this.element);
    this.bindEvents();
    
    // 播放顯示動畫
    await this.playShowAnimation();
    
    this.isVisible = true;
    this.state.isAnimating = false;
    
    // 設置焦點到關閉按鈕
    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }
  
  /**
   * 隱藏模態框
   */
  async hide() {
    if (!this.isVisible || this.state.isAnimating) {
      return;
    }
    
    console.log('📋 [PersonalProjectModal] 隱藏模態框');
    
    this.state.isAnimating = true;
    
    // 播放隱藏動畫
    await this.playHideAnimation();
    
    // 移除模態框
    this.unbindEvents();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this.isVisible = false;
    this.state.isAnimating = false;
    this.currentProject = null;
  }
  
  /**
   * 創建 DOM 元素
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'personal-project-modal';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${this.config.zIndex};
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
    `;
    
    this.element.innerHTML = `
      <div class="modal-backdrop" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, ${this.config.animation.backdropOpacity});
        backdrop-filter: blur(5px);
      "></div>
      
      <div class="modal-container" style="
        position: relative;
        max-width: ${this.config.size.maxWidth};
        max-height: ${this.config.size.maxHeight};
        min-width: ${this.config.size.minWidth};
        margin: 20px;
        background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        border: 3px solid #d4af37;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        transform: scale(0.8);
      ">
        <div class="modal-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%);
        ">
          <h2 class="modal-title" style="
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
          "></h2>
          
          <button class="modal-close" style="
            background: none;
            border: 2px solid #d4af37;
            color: #d4af37;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          " title="關閉 (ESC)">×</button>
        </div>
        
        <div class="modal-content" style="
          padding: 20px;
          max-height: 70vh;
          overflow-y: auto;
        ">
          <div class="project-details">
            <!-- 內容將動態插入 -->
          </div>
        </div>
      </div>
    `;
    
    // 獲取子元素引用
    this.backdrop = this.element.querySelector('.modal-backdrop');
    this.modal = this.element.querySelector('.modal-container');
    this.closeBtn = this.element.querySelector('.modal-close');
  }
  
  /**
   * 更新模態框內容
   */
  updateContent(project) {
    // 更新標題
    const titleEl = this.element.querySelector('.modal-title');
    if (titleEl) {
      titleEl.innerHTML = `
        ${this.getRarityIcon(project.rarity)}
        ${project.title}
      `;
    }
    
    // 更新詳情內容
    const detailsEl = this.element.querySelector('.project-details');
    if (detailsEl) {
      detailsEl.innerHTML = this.generateProjectDetails(project);
    }
    
    // 應用稀有度樣式
    this.applyRarityStyles(project);
  }
  
  /**
   * 生成專案詳情 HTML
   */
  generateProjectDetails(project) {
    return `
      <div class="project-overview" style="margin-bottom: 30px;">
        <div class="project-meta" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        ">
          <div class="meta-card" style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #d4af37;
          ">
            <h4 style="margin: 0 0 8px 0; color: #d4af37;">基本資訊</h4>
            <div class="meta-item">
              <span style="color: #a0a0a0;">類型：</span>
              <span style="color: #ffffff;">${this.getCategoryLabel(project.category)}</span>
            </div>
            <div class="meta-item">
              <span style="color: #a0a0a0;">稀有度：</span>
              <span style="color: ${this.getRarityColor(project.rarity)};">
                ${this.getRarityIcon(project.rarity)} ${this.getRarityLabel(project.rarity)}
              </span>
            </div>
            <div class="meta-item">
              <span style="color: #a0a0a0;">狀態：</span>
              <span style="color: ${this.getStatusColor(project.status)};">
                ${this.getStatusLabel(project.status)}
              </span>
            </div>
            <div class="meta-item">
              <span style="color: #a0a0a0;">完成時間：</span>
              <span style="color: #ffffff;">${project.completedDate}</span>
            </div>
          </div>
          
          ${project.cardData ? `
            <div class="meta-card" style="
              background: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              padding: 15px;
              border-left: 4px solid #4169e1;
            ">
              <h4 style="margin: 0 0 8px 0; color: #4169e1;">卡牌數據</h4>
              <div class="card-stats" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                font-family: monospace;
              ">
                <div>
                  <span style="color: #a0a0a0;">ATK：</span>
                  <span style="color: #ff6b6b; font-weight: bold;">${project.cardData.attack || '???'}</span>
                </div>
                <div>
                  <span style="color: #a0a0a0;">DEF：</span>
                  <span style="color: #4ecdc4; font-weight: bold;">${project.cardData.defense || '???'}</span>
                </div>
                <div>
                  <span style="color: #a0a0a0;">Level：</span>
                  <span style="color: #ffd93d; font-weight: bold;">${project.cardData.level || '?'}</span>
                </div>
                <div>
                  <span style="color: #a0a0a0;">Type：</span>
                  <span style="color: #a0a0a0; font-size: 12px;">${project.cardData.type || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="project-description" style="
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        ">
          <h4 style="margin: 0 0 12px 0; color: #ffffff;">專案描述</h4>
          <p style="
            color: #e0e0e0;
            line-height: 1.6;
            margin: 0;
          ">${project.description}</p>
        </div>
      </div>
      
      ${project.technologies && project.technologies.length > 0 ? `
        <div class="project-technologies" style="margin-bottom: 30px;">
          <h4 style="margin: 0 0 15px 0; color: #ffffff;">
            🔧 技術棧
          </h4>
          <div class="tech-tags" style="
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          ">
            ${project.technologies.map(tech => `
              <span class="tech-tag" style="
                background: linear-gradient(135deg, #4169e1, #357abd);
                color: white;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
              ">${tech}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${project.images && project.images.screenshots && project.images.screenshots.length > 0 ? `
        <div class="project-gallery" style="margin-bottom: 30px;">
          <h4 style="margin: 0 0 15px 0; color: #ffffff;">
            🖼️ 專案截圖
          </h4>
          <div class="gallery-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          ">
            ${project.images.screenshots.map((img, index) => `
              <div class="gallery-item" style="
                position: relative;
                aspect-ratio: 16/9;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease;
              " onmouseover="this.style.transform='scale(1.05)'" 
                 onmouseout="this.style.transform='scale(1)'">
                <img src="${img}" alt="Screenshot ${index + 1}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                ">
                <div style="
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  background: linear-gradient(transparent, rgba(0,0,0,0.7));
                  color: white;
                  padding: 10px;
                  font-size: 12px;
                ">截圖 ${index + 1}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${project.links && Object.keys(project.links).length > 0 ? `
        <div class="project-links">
          <h4 style="margin: 0 0 15px 0; color: #ffffff;">
            🔗 相關連結
          </h4>
          <div class="links-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
          ">
            ${Object.entries(project.links).map(([type, url]) => `
              <a href="${url}" target="_blank" rel="noopener noreferrer" 
                 class="link-button" style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px;
                background: linear-gradient(135deg, #16213e, #1a1a2e);
                border: 2px solid #d4af37;
                border-radius: 8px;
                color: #d4af37;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
              " onmouseover="this.style.background='linear-gradient(135deg, #d4af37, #f4d03f)'; this.style.color='#1a1a2e';"
                 onmouseout="this.style.background='linear-gradient(135deg, #16213e, #1a1a2e)'; this.style.color='#d4af37';">
                ${this.getLinkIcon(type)}
                ${this.getLinkLabel(type)}
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }
  
  /**
   * 應用稀有度樣式
   */
  applyRarityStyles(project) {
    const rarityColors = {
      normal: '#8e8e8e',
      rare: '#4169e1',
      superRare: '#9400d3',
      legendary: '#ffd700'
    };
    
    const color = rarityColors[project.rarity] || rarityColors.normal;
    
    if (this.modal) {
      this.modal.style.borderColor = color;
      
      // 傳說級額外效果
      if (project.rarity === 'legendary') {
        this.modal.style.boxShadow = `
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 30px ${color}40,
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;
      }
    }
  }
  
  /**
   * 播放顯示動畫
   */
  async playShowAnimation() {
    return new Promise(resolve => {
      this.showAnimation = gsap.timeline({
        onComplete: resolve
      });
      
      // 背景淡入
      this.showAnimation.fromTo(this.element, {
        opacity: 0
      }, {
        opacity: 1,
        duration: this.config.animation.duration * 0.5,
        ease: "power2.out"
      });
      
      // 模態框縮放進入
      this.showAnimation.fromTo(this.modal, {
        scale: 0.8,
        y: 50
      }, {
        scale: 1,
        y: 0,
        duration: this.config.animation.duration,
        ease: "back.out(1.7)"
      }, this.config.animation.duration * 0.2);
      
      // 內容淡入
      const content = this.element.querySelector('.modal-content');
      if (content) {
        this.showAnimation.fromTo(content, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: this.config.animation.duration * 0.8,
          ease: "power2.out"
        }, this.config.animation.duration * 0.4);
      }
    });
  }
  
  /**
   * 播放隱藏動畫
   */
  async playHideAnimation() {
    return new Promise(resolve => {
      this.hideAnimation = gsap.timeline({
        onComplete: resolve
      });
      
      // 模態框縮放退出
      this.hideAnimation.to(this.modal, {
        scale: 0.8,
        y: -50,
        duration: this.config.animation.duration * 0.6,
        ease: "back.in(1.7)"
      });
      
      // 背景淡出
      this.hideAnimation.to(this.element, {
        opacity: 0,
        duration: this.config.animation.duration * 0.6,
        ease: "power2.in"
      }, this.config.animation.duration * 0.2);
    });
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 關閉按鈕
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }
    
    // 背景點擊關閉
    if (this.config.closeOnBackdrop && this.backdrop) {
      this.backdrop.addEventListener('click', () => this.hide());
    }
    
    // ESC 鍵關閉
    if (this.config.closeOnEscape) {
      this.escHandler = (e) => {
        if (e.key === 'Escape') {
          this.hide();
        }
      };
      document.addEventListener('keydown', this.escHandler);
    }
  }
  
  /**
   * 解綁事件
   */
  unbindEvents() {
    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler);
      this.escHandler = null;
    }
  }
  
  // 輔助方法
  getRarityIcon(rarity) {
    const icons = { normal: '⚪', rare: '🔸', superRare: '💎', legendary: '⭐' };
    return icons[rarity] || icons.normal;
  }
  
  getRarityLabel(rarity) {
    const labels = { normal: '普通', rare: '稀有', superRare: '超稀有', legendary: '傳說' };
    return labels[rarity] || labels.normal;
  }
  
  getRarityColor(rarity) {
    const colors = { normal: '#8e8e8e', rare: '#4169e1', superRare: '#9400d3', legendary: '#ffd700' };
    return colors[rarity] || colors.normal;
  }
  
  getCategoryLabel(category) {
    const labels = { frontend: '前端', backend: '後端', fullstack: '全端', mobile: '移動端', ai: 'AI/ML', blockchain: '區塊鏈' };
    return labels[category] || '通用';
  }
  
  getStatusLabel(status) {
    const labels = { completed: '已完成', inProgress: '進行中', archived: '已封存' };
    return labels[status] || status;
  }
  
  getStatusColor(status) {
    const colors = { completed: '#4ecdc4', inProgress: '#ffd93d', archived: '#8e8e8e' };
    return colors[status] || '#ffffff';
  }
  
  getLinkIcon(type) {
    const icons = { demo: '🚀', github: '🐙', article: '📝', store: '🏪', website: '🌐' };
    return icons[type] || '🔗';
  }
  
  getLinkLabel(type) {
    const labels = { demo: 'Demo', github: 'GitHub', article: '文章', store: 'App Store', website: '網站' };
    return labels[type] || type;
  }
  
  /**
   * 銷毀組件
   */
  destroy() {
    console.log('🗑️ [PersonalProjectModal] 銷毀模態框');
    
    // 停止動畫
    if (this.showAnimation) {
      this.showAnimation.kill();
    }
    if (this.hideAnimation) {
      this.hideAnimation.kill();
    }
    
    // 解綁事件
    this.unbindEvents();
    
    // 移除 DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    super.destroy();
  }
}