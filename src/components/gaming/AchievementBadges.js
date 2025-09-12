/**
 * 成就徽章系統組件
 * Step 3.2.4: Achievement Badges System
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class AchievementBadges extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.visibleAchievements = [];
    this.animationQueue = [];
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '🏆 職業成就',
      achievements: [],
      theme: {
        bgColor: 'rgba(155, 89, 182, 0.1)',
        borderColor: '#9b59b6',
        titleColor: '#9b59b6'
      },
      rarityColors: {
        common: '#95a5a6',
        rare: '#3498db',
        epic: '#9b59b6',
        legendary: '#f39c12'
      },
      animation: {
        enabled: true,
        delay: 200,
        duration: 600
      }
    };
  }

  /**
   * 渲染成就徽章系統
   */
  async render() {
    const config = this.mergeConfig();
    const { title, achievements, theme } = config;

    return `
      <div class="achievement-badges-container" 
           style="background: ${theme.bgColor}; border: 2px solid ${theme.borderColor};">
        <header class="achievement-header">
          <h2 class="achievement-title" style="color: ${theme.titleColor};">
            ${title}
          </h2>
          <div class="achievement-stats">
            <span class="total-achievements">${achievements.length} 個成就</span>
            <span class="completion-rate">${this.calculateCompletionRate(achievements)}% 完成</span>
          </div>
        </header>
        
        <div class="achievements-grid" id="achievements-grid">
          ${this.renderAchievements(achievements)}
        </div>
        
        <div class="achievement-legend">
          <div class="rarity-indicators">
            ${this.renderRarityLegend(config.rarityColors)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染個別成就徽章
   */
  renderAchievements(achievements) {
    return achievements.map((achievement, index) => {
      const config = this.mergeConfig();
      const rarityColor = config.rarityColors[achievement.rarity] || '#95a5a6';
      const isCompleted = achievement.progress >= 100;
      
      return `
        <div class="achievement-badge ${achievement.rarity} ${isCompleted ? 'completed' : 'in-progress'}" 
             data-achievement="${achievement.id}"
             data-index="${index}"
             style="border-color: ${rarityColor};">
          
          <div class="badge-icon-container">
            <div class="badge-icon" style="background: linear-gradient(135deg, ${rarityColor}, ${this.lightenColor(rarityColor, 20)});">
              ${achievement.icon}
            </div>
            ${isCompleted ? '<div class="completion-glow"></div>' : ''}
          </div>
          
          <div class="badge-content">
            <h4 class="badge-name" style="color: ${rarityColor};">${achievement.name}</h4>
            <p class="badge-description">${achievement.description}</p>
            
            <div class="badge-progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" 
                     style="width: ${achievement.progress}%; background: ${rarityColor};"
                     data-progress="${achievement.progress}"></div>
              </div>
              <span class="progress-text">${achievement.progress}%</span>
            </div>
            
            <div class="badge-metadata">
              <span class="badge-date">獲得於 ${this.formatDate(achievement.date)}</span>
              <span class="badge-category">${this.getCategoryName(achievement.category)}</span>
            </div>
            
            <div class="badge-criteria">
              <small>${achievement.criteria}</small>
            </div>
          </div>
          
          <div class="badge-overlay">
            <div class="rarity-border" style="border-color: ${rarityColor};"></div>
            ${achievement.rarity === 'legendary' ? '<div class="legendary-sparkles"></div>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 渲染稀有度圖例
   */
  renderRarityLegend(rarityColors) {
    const rarityNames = {
      common: '普通',
      rare: '稀有',
      epic: '史詩',
      legendary: '傳說'
    };

    return Object.entries(rarityColors).map(([rarity, color]) => `
      <div class="rarity-indicator">
        <div class="rarity-dot" style="background: ${color};"></div>
        <span class="rarity-name">${rarityNames[rarity]}</span>
      </div>
    `).join('');
  }

  /**
   * 計算完成率
   */
  calculateCompletionRate(achievements) {
    const completedCount = achievements.filter(ach => ach.progress >= 100).length;
    return Math.round((completedCount / achievements.length) * 100);
  }

  /**
   * 顏色亮化工具函數
   */
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  /**
   * 日期格式化
   */
  formatDate(dateString) {
    const [year, month] = dateString.split('-');
    return `${year}年${month}月`;
  }

  /**
   * 類別名稱轉換
   */
  getCategoryName(category) {
    const categoryNames = {
      technical: '技術能力',
      architecture: '架構設計',
      optimization: '效能優化',
      leadership: '團隊領導',
      innovation: '技術創新',
      mentorship: '人才培育'
    };
    return categoryNames[category] || category;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 啟動入場動畫
    this.initEntranceAnimations();
    
    // 綁定互動事件
    this.bindInteractionEvents();
    
    console.log('🏆 AchievementBadges initialized');
  }

  /**
   * 初始化入場動畫
   */
  initEntranceAnimations() {
    const badges = document.querySelectorAll('.achievement-badge');
    const config = this.mergeConfig();
    
    badges.forEach((badge, index) => {
      // 初始狀態
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(30px) scale(0.8)';
      
      // 延遲動畫
      setTimeout(() => {
        badge.style.transition = `all ${config.animation.duration}ms ease-out`;
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0) scale(1)';
        
        // 進度條動畫
        setTimeout(() => {
          this.animateProgressBar(badge);
        }, config.animation.duration / 2);
        
      }, index * config.animation.delay);
    });
  }

  /**
   * 進度條動畫
   */
  animateProgressBar(badge) {
    const progressBar = badge.querySelector('.progress-bar-fill');
    if (progressBar) {
      const targetWidth = progressBar.dataset.progress + '%';
      progressBar.style.width = '0%';
      
      setTimeout(() => {
        progressBar.style.transition = 'width 1.5s ease-out';
        progressBar.style.width = targetWidth;
      }, 100);
    }
  }

  /**
   * 綁定互動事件
   */
  bindInteractionEvents() {
    const badges = document.querySelectorAll('.achievement-badge');
    
    badges.forEach(badge => {
      // 懸停效果
      badge.addEventListener('mouseenter', (e) => {
        this.handleBadgeHover(e.target, true);
      });
      
      badge.addEventListener('mouseleave', (e) => {
        this.handleBadgeHover(e.target, false);
      });
      
      // 點擊效果
      badge.addEventListener('click', (e) => {
        this.handleBadgeClick(e.target);
      });
    });
  }

  /**
   * 處理徽章懸停
   */
  handleBadgeHover(badge, isHover) {
    if (isHover) {
      badge.style.transform = 'translateY(-5px) scale(1.05)';
      badge.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
      
      // 添加脈衝效果
      const icon = badge.querySelector('.badge-icon');
      if (icon) {
        icon.style.animation = 'pulse 1s infinite';
      }
    } else {
      badge.style.transform = 'translateY(0) scale(1)';
      badge.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      
      // 移除脈衝效果
      const icon = badge.querySelector('.badge-icon');
      if (icon) {
        icon.style.animation = 'none';
      }
    }
  }

  /**
   * 處理徽章點擊
   */
  handleBadgeClick(badge) {
    const achievementId = badge.dataset.achievement;
    
    // 點擊反饋動畫
    badge.style.animation = 'bounce 0.6s ease-out';
    
    setTimeout(() => {
      badge.style.animation = 'none';
    }, 600);
    
    // 發送自定義事件（供頁面監聽）
    const event = new window.CustomEvent('achievement-clicked', {
      detail: { achievementId, badge },
      bubbles: true
    });
    badge.dispatchEvent(event);
    
    console.log(`🏆 Achievement clicked: ${achievementId}`);
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 清理動畫和事件監聽器
    const badges = document.querySelectorAll('.achievement-badge');
    badges.forEach(badge => {
      badge.removeEventListener('mouseenter', this.handleBadgeHover);
      badge.removeEventListener('mouseleave', this.handleBadgeHover);
      badge.removeEventListener('click', this.handleBadgeClick);
    });
    
    super.destroy();
    console.log('🏆 AchievementBadges destroyed');
  }
}