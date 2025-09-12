/**
 * 技能標籤雲組件
 * Step 3.2.4: Skills Tag Cloud System
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class SkillsTagCloud extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.tagElements = [];
    this.animationId = null;
    this.floatAnimations = new Map();
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '☁️ 技能星雲',
      description: '技術能力的全方位展現',
      tags: [],
      theme: {
        bgColor: 'rgba(52, 73, 94, 0.1)',
        borderColor: '#34495e',
        titleColor: '#34495e'
      },
      animation: {
        hover: {
          scale: 1.2,
          duration: '0.3s',
          easing: 'ease-out'
        },
        float: {
          enabled: true,
          amplitude: '5px',
          duration: '3s'
        }
      }
    };
  }

  /**
   * 渲染技能標籤雲
   */
  async render() {
    const config = this.mergeConfig();
    const { title, description, tags, theme } = config;

    return `
      <div class="skills-tag-cloud-container" 
           style="background: ${theme.bgColor}; border: 2px solid ${theme.borderColor};">
        <header class="tag-cloud-header">
          <h2 class="tag-cloud-title" style="color: ${theme.titleColor};">
            ${title}
          </h2>
          <p class="tag-cloud-description">${description}</p>
          
          <div class="tag-cloud-stats">
            <div class="stat-item">
              <span class="stat-value">${tags.length}</span>
              <span class="stat-label">技術項目</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.getAvgLevel(tags)}</span>
              <span class="stat-label">平均熟練度</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.getTopTechnologies(tags).length}</span>
              <span class="stat-label">核心技術</span>
            </div>
          </div>
        </header>
        
        <div class="tag-cloud-filters">
          ${window.innerWidth > 768 ? '<button class="filter-btn active" data-category="all">全部</button>' : ''}
          ${this.renderCategoryFilters(tags)}
        </div>
        
        <div class="tag-cloud-canvas" id="tag-cloud-canvas">
          ${this.renderTagCloud(tags)}
        </div>
        
        <div class="tag-cloud-legend">
          <div class="level-legend">
            <span class="legend-title">熟練度等級：</span>
            <div class="level-indicators">
              ${this.renderLevelLegend()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染標籤雲
   */
  renderTagCloud(tags) {
    // 按熟練度排序並分組佈局
    const sortedTags = [...tags].sort((a, b) => b.level - a.level);
    
    return `
      <div class="tag-cloud-grid">
        ${sortedTags.map((tag, index) => {
          const size = this.calculateTagSize(tag.level);
          const opacity = this.calculateTagOpacity(tag.level);
          const delay = index * 100;
          
          return `
            <div class="skill-tag ${this.getTagSizeClass(tag.level)}" 
                 data-tag="${tag.name}"
                 data-level="${tag.level}"
                 data-category="${tag.category}"
                 data-index="${index}"
                 style="
                   color: ${tag.color}; 
                   border-color: ${tag.color};
                   opacity: ${opacity};
                   font-size: ${size.fontSize};
                   animation-delay: ${delay}ms;
                 ">
              
              <div class="tag-content">
                <span class="tag-name">${tag.name}</span>
                <div class="tag-level-indicator">
                  <div class="level-dots">
                    ${this.renderLevelDots(tag.level)}
                  </div>
                  <span class="level-number">Lv.${tag.level}</span>
                </div>
              </div>
              
              <div class="tag-glow" style="box-shadow: 0 0 20px ${tag.color}33;"></div>
              
              <div class="tag-tooltip" id="tooltip-${tag.name.replace(/[^a-zA-Z0-9]/g, '')}">
                <div class="tooltip-header">
                  <h4>${tag.name}</h4>
                  <span class="tooltip-level">Level ${tag.level}</span>
                </div>
                <div class="tooltip-category">${this.getCategoryDisplayName(tag.category)}</div>
                <div class="tooltip-proficiency">${this.getProficiencyText(tag.level)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * 渲染分類篩選按鈕
   */
  renderCategoryFilters(tags) {
    const categories = [...new Set(tags.map(tag => tag.category))];
    const categoryNames = {
      backend: '後端',
      frontend: '前端', 
      database: '資料庫',
      cloud: '雲端',
      devops: 'DevOps',
      tools: '工具',
      api: 'API',
      architecture: '架構',
      realtime: '即時通訊'
    };

    // 判斷移動端預設激活狀態
    const isMobile = window.innerWidth <= 768;
    const defaultCategory = isMobile ? 'backend' : 'all';

    return categories.map(category => {
      const isActive = isMobile && category === defaultCategory;
      return `
        <button class="filter-btn ${isActive ? 'active' : ''}" data-category="${category}">
          ${categoryNames[category] || category}
        </button>
      `;
    }).join('');
  }

  /**
   * 渲染等級圖例
   */
  renderLevelLegend() {
    return Array.from({length: 10}, (_, i) => {
      const level = i + 1;
      return `
        <div class="level-indicator" data-level="${level}">
          <div class="level-bar" style="height: ${level * 10}%;"></div>
          <span class="level-text">${level}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * 渲染技能等級點
   */
  renderLevelDots(level) {
    return Array.from({length: 10}, (_, i) => {
      const isActive = i < level;
      return `<div class="level-dot ${isActive ? 'active' : ''}"></div>`;
    }).join('');
  }

  /**
   * 計算標籤大小
   */
  calculateTagSize(level) {
    const baseSize = 0.8;
    const maxSize = 2.0;
    const scale = baseSize + ((level - 1) / 9) * (maxSize - baseSize);
    
    return {
      fontSize: `${scale}rem`,
      scale: scale
    };
  }

  /**
   * 計算標籤透明度
   */
  calculateTagOpacity(level) {
    return 0.6 + (level / 10) * 0.4; // 0.6 to 1.0
  }

  /**
   * 獲取標籤大小類別
   */
  getTagSizeClass(level) {
    if (level >= 9) return 'tag-xl';
    if (level >= 7) return 'tag-lg';
    if (level >= 5) return 'tag-md';
    return 'tag-sm';
  }

  /**
   * 工具函數們
   */
  getAvgLevel(tags) {
    const avg = tags.reduce((sum, tag) => sum + tag.level, 0) / tags.length;
    return Math.round(avg * 10) / 10;
  }

  getTopTechnologies(tags) {
    return tags.filter(tag => tag.level >= 8);
  }

  getCategoryDisplayName(category) {
    const names = {
      backend: '後端開發',
      frontend: '前端開發', 
      database: '資料庫',
      cloud: '雲端服務',
      devops: '開發維運',
      tools: '開發工具',
      api: 'API設計',
      architecture: '系統架構',
      realtime: '即時通訊'
    };
    return names[category] || category;
  }

  getProficiencyText(level) {
    if (level >= 9) return '專家級 - 深度掌握並能指導他人';
    if (level >= 7) return '熟練級 - 能獨立解決複雜問題';
    if (level >= 5) return '中級 - 具備實際專案經驗';
    return '入門級 - 基礎理解與應用';
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 初始化標籤動畫
    this.initTagAnimations();
    
    // 綁定互動事件
    this.bindTagInteractions();
    
    // 綁定篩選事件
    this.bindFilterEvents();
    
    // 設置移動端預設篩選
    this.setInitialFilter();
    
    // 啟動浮動動畫
    this.startFloatAnimations();
    
    console.log('☁️ SkillsTagCloud initialized');
  }

  /**
   * 初始化標籤動畫
   */
  initTagAnimations() {
    const tags = document.querySelectorAll('.skill-tag');
    
    tags.forEach((tag, index) => {
      // 入場動畫
      tag.style.opacity = '0';
      tag.style.transform = 'scale(0.5) rotate(10deg)';
      
      setTimeout(() => {
        tag.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        tag.style.opacity = tag.dataset.opacity || '1';
        tag.style.transform = 'scale(1) rotate(0deg)';
      }, index * 100);
    });
  }

  /**
   * 綁定標籤互動事件
   */
  bindTagInteractions() {
    const tags = document.querySelectorAll('.skill-tag');
    
    tags.forEach(tag => {
      const tooltip = tag.querySelector('.tag-tooltip');
      
      tag.addEventListener('mouseenter', () => {
        this.showTagTooltip(tag, tooltip);
        this.pauseFloatAnimation(tag);
      });
      
      tag.addEventListener('mouseleave', () => {
        this.hideTagTooltip(tag, tooltip);
        this.resumeFloatAnimation(tag);
      });
      
      tag.addEventListener('click', () => {
        this.handleTagClick(tag);
      });
    });
  }

  /**
   * 綁定篩選事件
   */
  bindFilterEvents() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleFilterClick(btn);
      });
    });
  }

  /**
   * 設置初始篩選狀態
   */
  setInitialFilter() {
    // 移動端預設顯示後端分類，桌面端顯示全部
    const isMobile = window.innerWidth <= 768;
    const defaultCategory = isMobile ? 'backend' : 'all';
    
    // 找到對應的篩選按鈕
    const targetBtn = document.querySelector(`.filter-btn[data-category="${defaultCategory}"]`);
    
    if (targetBtn) {
      // 模擬點擊事件來設置初始狀態
      this.handleFilterClick(targetBtn);
    }
  }

  /**
   * 處理篩選按鈕點擊
   */
  handleFilterClick(clickedBtn) {
    const category = clickedBtn.dataset.category;
    
    // 更新按鈕狀態
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');
    
    // 篩選標籤
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
      const tagCategory = tag.dataset.category;
      const shouldShow = category === 'all' || tagCategory === category;
      
      if (shouldShow) {
        tag.style.display = 'block';
        setTimeout(() => {
          tag.style.opacity = tag.dataset.opacity || '1';
          tag.style.transform = 'scale(1)';
        }, 50);
      } else {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(() => {
          tag.style.display = 'none';
        }, 300);
      }
    });
  }

  /**
   * 顯示標籤提示
   */
  showTagTooltip(tag, tooltip) {
    tag.style.transform += ' scale(1.1)';
    tag.style.zIndex = '10';
    
    if (tooltip) {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    }
  }

  /**
   * 隱藏標籤提示
   */
  hideTagTooltip(tag, tooltip) {
    tag.style.transform = tag.style.transform.replace(' scale(1.1)', '');
    tag.style.zIndex = '';
    
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }
  }

  /**
   * 處理標籤點擊
   */
  handleTagClick(tag) {
    const tagName = tag.dataset.tag;
    const level = tag.dataset.level;
    
    // 點擊動畫
    tag.style.animation = 'tagBounce 0.6s ease-out';
    
    setTimeout(() => {
      tag.style.animation = '';
    }, 600);
    
    // 發送自定義事件（供頁面監聽）
    const event = new window.CustomEvent('tag-clicked', {
      detail: { tagName, level, tag },
      bubbles: true
    });
    tag.dispatchEvent(event);
    
    console.log(`☁️ Skill tag clicked: ${tagName} (Level ${level})`);
  }

  /**
   * 啟動浮動動畫
   */
  startFloatAnimations() {
    const config = this.mergeConfig();
    if (!config.animation.float.enabled) return;
    
    const tags = document.querySelectorAll('.skill-tag');
    
    tags.forEach((tag, index) => {
      const delay = index * 300;
      const duration = 3000 + (Math.random() * 2000); // 3-5秒
      const amplitude = 5 + (Math.random() * 5); // 5-10px
      
      setTimeout(() => {
        this.createFloatAnimation(tag, amplitude, duration);
      }, delay);
    });
  }

  /**
   * 創建浮動動畫
   */
  createFloatAnimation(tag, amplitude, duration) {
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      const progress = (elapsed % duration) / duration;
      const y = Math.sin(progress * Math.PI * 2) * amplitude;
      
      if (!tag.dataset.paused) {
        tag.style.transform = `translateY(${y}px)`;
      }
      
      const animationId = requestAnimationFrame(animate);
      this.floatAnimations.set(tag, animationId);
    };
    
    const animationId = requestAnimationFrame(animate);
    this.floatAnimations.set(tag, animationId);
  }

  /**
   * 暫停浮動動畫
   */
  pauseFloatAnimation(tag) {
    tag.dataset.paused = 'true';
  }

  /**
   * 恢復浮動動畫
   */
  resumeFloatAnimation(tag) {
    tag.dataset.paused = 'false';
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 清理浮動動畫
    this.floatAnimations.forEach(animationId => {
      cancelAnimationFrame(animationId);
    });
    this.floatAnimations.clear();
    
    // 清理事件監聽器
    const tags = document.querySelectorAll('.skill-tag');
    const filters = document.querySelectorAll('.filter-btn');
    
    tags.forEach(tag => {
      tag.removeEventListener('mouseenter', this.showTagTooltip);
      tag.removeEventListener('mouseleave', this.hideTagTooltip);
      tag.removeEventListener('click', this.handleTagClick);
    });
    
    filters.forEach(btn => {
      btn.removeEventListener('click', this.handleFilterClick);
    });
    
    super.destroy();
    console.log('☁️ SkillsTagCloud destroyed');
  }
}