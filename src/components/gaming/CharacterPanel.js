/**
 * RPG 角色面板組件
 * Step 3.2.2: RPG Character Panel Implementation
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import characterConfig from '../../config/data/about/character.data.js';

export class CharacterPanel extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.radarCanvas = null;
    this.animationFrameId = null;
  }

  /**
   * 獲取默認配置（將通過 config 文件覆蓋）
   */
  getDefaultConfig() {
    return characterConfig.character;
  }

  /**
   * 渲染 RPG 角色面板
   */
  async render() {
    const config = this.mergeConfig();
    const { careerProgression, skillDomains } = config;

    // 獲取屬性數據 (從配置的正確位置)
    const attributesConfig = characterConfig.attributes?.attributes || {};

    // 計算屬性總值 (使用 .value 屬性)
    const totalStats = Object.values(attributesConfig).reduce(
      (sum, attr) => sum + (attr.value || 0),
      0
    );
    const averageStats = Math.round(totalStats / 6);

    return `
      <div class="character-panel" id="character-panel">
        
        <!-- 職業發展歷程 -->
        <div class="character-header">
          <h3 class="career-title">${careerProgression.title}</h3>
          <div class="career-progression">
            ${this.renderCareerStages(careerProgression.stages)}
          </div>
        </div>

        <!-- 六大技能領域系統 -->
        <div class="skill-domains-section">
          <div class="skill-domains-info">
            <span class="skill-domains-label">⚡ ${skillDomains.title || '六大技能領域'}</span>
          </div>
          <div class="skill-domains-grid">
            ${this.renderSkillDomains(skillDomains.domains)}
          </div>
        </div>

        <!-- 主要布局：屬性列表 + 雷達圖 -->
        <div class="character-stats-layout">
          
          <!-- 屬性列表 -->
          <div class="attributes-list">
            ${this.renderAttributesList(attributesConfig)}
          </div>
          
          <!-- 六角形雷達圖 -->
          <div class="radar-chart-container">
            <canvas id="radar-chart" class="radar-chart" width="280" height="280"></canvas>
            <div class="radar-center-info">
              <div class="total-stats">${totalStats}</div>
              <div class="avg-label">平均: ${averageStats}</div>
            </div>
          </div>
          
        </div>

      </div>
    `;
  }

  /**
   * 渲染職業發展階段
   */
  renderCareerStages(stages) {
    return stages
      .map(stage => {
        const statusClass =
          stage.status === 'current'
            ? 'current-stage'
            : stage.status === 'completed'
              ? 'completed-stage'
              : stage.status === 'target'
                ? 'target-stage'
                : 'stage';

        return `
        <div class="career-stage ${statusClass}">
          <div class="stage-icon">${stage.icon}</div>
          <div class="stage-info">
            <div class="stage-job">${stage.job}</div>
            <div class="stage-level">Lv.${stage.level}</div>
            <div class="stage-period">${stage.period}</div>
          </div>
        </div>
      `;
      })
      .join('<div class="stage-arrow">→</div>');
  }

  /**
   * 渲染技能領域系統
   */
  renderSkillDomains(domains) {
    return Object.entries(domains)
      .map(([key, domain]) => {
        const expPercentage = Math.round(
          (domain.experience / domain.maxExperience) * 100
        );

        return `
        <div class="skill-domain" data-domain="${key}">
          <div class="domain-header">
            <span class="domain-icon" style="color: ${domain.color}">${domain.icon}</span>
            <div class="domain-info">
              <span class="domain-name">${domain.name}</span>
              <span class="domain-level">Lv.${domain.currentLevel}/${domain.maxLevel}</span>
            </div>
          </div>
          <div class="domain-description">${domain.description}</div>
          <div class="exp-bar-container">
            <div class="exp-bar">
              <div class="exp-fill" style="width: ${expPercentage}%; background: ${domain.color}"></div>
            </div>
            <div class="exp-info">
              <span class="exp-current">${domain.experience.toLocaleString()}</span>
              <span class="exp-separator">/</span>
              <span class="exp-max">${domain.maxExperience.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * 渲染屬性列表
   */
  renderAttributesList(attributes) {
    const attributeInfo = {
      attack: { icon: '⚔️', name: '攻擊力', description: '代碼實現能力' },
      defense: { icon: '🛡️', name: '防禦力', description: '系統穩定性' },
      agility: { icon: '⚡', name: '敏捷度', description: '學習適應力' },
      intelligence: { icon: '🧠', name: '智力', description: '架構思維' },
      charisma: { icon: '🤝', name: '魅力', description: '團隊協作' },
      luck: { icon: '🎯', name: '幸運', description: '問題解決' },
    };

    return Object.entries(attributes)
      .map(([key, attrObj]) => {
        const info = attributeInfo[key];
        const value = attrObj.value || 0;
        return `
        <div class="attribute-item" data-attribute="${key}">
          <div class="attribute-header">
            <span class="attribute-icon">${info.icon}</span>
            <div class="attribute-info">
              <span class="attribute-name">${info.name}</span>
              <span class="attribute-description">${info.description}</span>
            </div>
            <span class="attribute-value">${value}</span>
          </div>
          <div class="attribute-bar-container">
            <div class="attribute-bar">
              <div class="attribute-fill" style="width: ${value}%" data-value="${value}"></div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();

    // 等待下一個事件循環，確保DOM已渲染
    await new Promise(resolve => setTimeout(resolve, 50));

    // 初始化雷達圖
    this.initRadarChart();

    // 啟動屬性條動畫
    this.animateAttributeBars();

    // 啟動技能領域經驗條動畫
    this.animateSkillDomainBars();

    console.log('🎮 CharacterPanel initialized with RPG systems');
  }

  /**
   * 初始化六角形雷達圖
   */
  initRadarChart() {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    this.radarCanvas = canvas;
    const ctx = canvas.getContext('2d');

    // 設置畫布分辨率 - 在手機版限制canvas實際尺寸
    const isMobile = window.innerWidth <= 768;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // 手機版限制最大canvas尺寸，避免DPR造成過大canvas
    const maxSize = isMobile ? 280 : rect.width;
    const actualWidth = Math.min(rect.width, maxSize);
    const actualHeight = Math.min(rect.height, maxSize);

    canvas.width = actualWidth * (isMobile ? 1 : dpr);
    canvas.height = actualHeight * (isMobile ? 1 : dpr);
    ctx.scale(isMobile ? 1 : dpr, isMobile ? 1 : dpr);

    // 開始雷達圖渲染動畫
    this.renderRadarChart();
  }

  /**
   * 渲染六角形雷達圖
   */
  renderRadarChart() {
    const canvas = this.radarCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 獲取屬性數據 (從配置的正確位置)
    const attributesConfig = characterConfig.attributes?.attributes || {};

    const centerX = 140;
    const centerY = 140;
    const maxRadius = 80;
    const attributeValues = Object.values(attributesConfig).map(
      attr => attr.value || 0
    );
    const attributeNames = ['攻擊', '防禦', '敏捷', '智力', '魅力', '幸運'];

    // 清除畫布
    ctx.clearRect(0, 0, 280, 280);

    // 繪制背景網格
    this.drawRadarGrid(ctx, centerX, centerY, maxRadius);

    // 繪制屬性數據
    this.drawRadarData(ctx, centerX, centerY, maxRadius, attributeValues);

    // 繪制屬性標籤
    this.drawRadarLabels(ctx, centerX, centerY, maxRadius + 20, attributeNames);
  }

  /**
   * 繪制雷達圖網格
   */
  drawRadarGrid(ctx, centerX, centerY, maxRadius) {
    const levels = 5;

    // 繪制同心六角形
    for (let level = 1; level <= levels; level++) {
      const radius = (maxRadius / levels) * level;
      ctx.beginPath();
      ctx.strokeStyle =
        level === levels ? '#d4af37' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = level === levels ? 2 : 1;

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 繪制從中心到頂點的線
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  /**
   * 繪制雷達圖數據
   */
  drawRadarData(ctx, centerX, centerY, maxRadius, values) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const value = values[i] / 100; // 標準化到 0-1
      const radius = maxRadius * value;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 繪制數據點
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const value = values[i] / 100;
      const radius = maxRadius * value;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  /**
   * 繪制雷達圖標籤
   */
  drawRadarLabels(ctx, centerX, centerY, radius, labels) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.fillText(labels[i], x, y);
    }
  }

  /**
   * 動畫屬性條
   */
  animateAttributeBars() {
    const attributeBars = document.querySelectorAll('.attribute-fill');
    attributeBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = bar.dataset.value + '%';

        // 添加發光效果
        setTimeout(() => {
          bar.classList.add('glow-effect');
        }, 1000);
      }, index * 200);
    });
  }

  /**
   * 動畫技能領域經驗條
   */
  animateSkillDomainBars() {
    const expFills = document.querySelectorAll('.skill-domain .exp-fill');
    expFills.forEach((bar, index) => {
      setTimeout(
        () => {
          bar.style.transition = 'width 1.8s ease-out';
          const finalWidth = bar.style.width;
          bar.style.width = '0%';

          setTimeout(() => {
            bar.style.width = finalWidth;
          }, 100);
        },
        index * 150 + 300
      );
    });
  }

  /**
   * 銷毀組件
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.radarCanvas = null;
    super.destroy();
    console.log('🎮 CharacterPanel destroyed');
  }
}
