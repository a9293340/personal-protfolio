/**
 * 概念型時間軸組件
 * Step 3.2.3: Concept Timeline Implementation
 * 為專案頁面完整時間軸做前情提要的簡潔版本
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import timelineConfig from '../../config/data/about/timeline.data.js';

export class ConceptTimeline extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.previewModal = null;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return timelineConfig.timeline;
  }

  /**
   * 渲染概念型時間軸
   */
  async render() {
    const config = { ...this.getDefaultConfig(), ...this.options };
    const { metadata, stages, visual } = config;

    return `
      <div class="concept-timeline" id="concept-timeline">
        
        <!-- 時間軸標題 -->
        <div class="timeline-header">
          <h3 class="timeline-title">${metadata.title}</h3>
          <p class="timeline-subtitle">${metadata.subtitle}</p>
        </div>

        <!-- 水平時間線容器 -->
        <div class="concept-timeline-container">
          <div class="timeline-line"></div>
          
          <!-- 階段節點 -->
          <div class="timeline-stages">
            ${this.renderTimelineStages(stages)}
          </div>
        </div>

        <!-- 預覽模態框 -->
        <div class="stage-preview-modal hidden" id="stage-preview-modal">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
            <div class="modal-header">
              <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body" id="modal-body">
              <!-- 動態內容 -->
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * 渲染時間軸階段節點
   */
  renderTimelineStages(stages) {
    return stages.map((stage, index) => {
      const statusClass = this.getStageStatusClass(stage.status);
      const progressWidth = this.calculateProgress(index, stages.length);
      
      return `
        <div class="timeline-stage ${statusClass}" 
             data-stage="${stage.id}"
             data-index="${index}">
          
          <!-- 進度線段 -->
          <div class="stage-progress" style="width: ${progressWidth}%"></div>
          
          <!-- 階段節點 -->
          <div class="stage-node" style="border-color: ${stage.theme.primaryColor}">
            <div class="stage-icon" style="color: ${stage.theme.primaryColor}">
              ${stage.icon}
            </div>
          </div>
          
          <!-- 階段信息 -->
          <div class="stage-info">
            <div class="stage-period">${stage.period}</div>
            <div class="stage-title">${stage.title}</div>
            <div class="stage-concept" style="color: ${stage.theme.primaryColor}">
              ${stage.concept}
            </div>
          </div>
          
          <!-- 懸停提示 -->
          <div class="stage-tooltip">
            <div class="tooltip-title">${stage.title}</div>
            <div class="tooltip-description">${stage.description}</div>
            <div class="tooltip-achievements">
              ${stage.keyAchievements.map(achievement => 
                `<span class="achievement-tag">✓ ${achievement}</span>`
              ).join('')}
            </div>
            <div class="tooltip-tech">
              <span class="tech-label">技術重點:</span>
              ${stage.technologies.slice(0, 3).join(' • ')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 獲取階段狀態CSS類別
   */
  getStageStatusClass(status) {
    const statusMap = {
      completed: 'stage-completed',
      current: 'stage-current', 
      target: 'stage-target'
    };
    return statusMap[status] || 'stage-default';
  }

  /**
   * 計算進度線寬度
   */
  calculateProgress(index, total) {
    if (index === 0) return 0;
    return (index / (total - 1)) * 100;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 等待DOM渲染
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 初始化互動功能
    this.initStageInteractions();
    
    // 啟動載入動畫
    this.animateStagesLoad();
    
    console.log('⏰ ConceptTimeline initialized with minimal design');
  }

  /**
   * 初始化階段互動功能
   */
  initStageInteractions() {
    const stages = document.querySelectorAll('.timeline-stage');
    
    stages.forEach(stage => {
      // 懸停顯示詳細信息
      stage.addEventListener('mouseenter', (e) => {
        this.showStageTooltip(stage);
      });
      
      stage.addEventListener('mouseleave', (e) => {
        this.hideStageTooltip(stage);
      });
      
      // 點擊顯示預覽
      stage.addEventListener('click', (e) => {
        const stageId = stage.dataset.stage;
        this.showStagePreview(stageId);
      });
    });

    // 模態框關閉
    const modal = document.getElementById('stage-preview-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const backdrop = modal?.querySelector('.modal-backdrop');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideStagePreview());
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideStagePreview());
    }
  }

  /**
   * 顯示階段工具提示
   */
  showStageTooltip(stageElement) {
    const tooltip = stageElement.querySelector('.stage-tooltip');
    if (tooltip) {
      tooltip.classList.add('visible');
    }
  }

  /**
   * 隱藏階段工具提示
   */
  hideStageTooltip(stageElement) {
    const tooltip = stageElement.querySelector('.stage-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  /**
   * 顯示階段預覽模態框
   */
  showStagePreview(stageId) {
    const config = this.getDefaultConfig();
    const stage = config.stages.find(s => s.id === stageId);
    
    if (!stage) return;

    const modal = document.getElementById('stage-preview-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;

    // 生成預覽內容
    modalBody.innerHTML = `
      <div class="preview-stage-header">
        <div class="preview-icon" style="color: ${stage.theme.primaryColor}">${stage.icon}</div>
        <div class="preview-info">
          <h4 class="preview-title">${stage.title}</h4>
          <p class="preview-period">${stage.period}</p>
          <p class="preview-concept" style="color: ${stage.theme.primaryColor}">${stage.concept}</p>
        </div>
      </div>
      
      <div class="preview-description">
        ${stage.description}
      </div>
      
      <div class="preview-achievements">
        <h5>關鍵成就</h5>
        <ul>
          ${stage.keyAchievements.map(achievement => 
            `<li>✓ ${achievement}</li>`
          ).join('')}
        </ul>
      </div>
      
      <div class="preview-technologies">
        <h5>主要技術</h5>
        <div class="tech-tags">
          ${stage.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
          ).join('')}
        </div>
      </div>
      
      <div class="preview-cta">
        <div class="cta-text">想了解詳細專案內容？</div>
        <button class="cta-button" style="background: ${stage.theme.primaryColor}">
          查看完整專案時間軸 →
        </button>
      </div>
    `;

    // 顯示模態框
    modal.classList.remove('hidden');
  }

  /**
   * 隱藏階段預覽模態框
   */
  hideStagePreview() {
    const modal = document.getElementById('stage-preview-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * 階段載入動畫
   */
  animateStagesLoad() {
    const stages = document.querySelectorAll('.timeline-stage');
    
    stages.forEach((stage, index) => {
      setTimeout(() => {
        stage.classList.add('stage-loaded');
      }, index * 200);
    });
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 移除事件監聽器
    const stages = document.querySelectorAll('.timeline-stage');
    stages.forEach(stage => {
      stage.replaceWith(stage.cloneNode(true));
    });
    
    super.destroy();
    console.log('⏰ ConceptTimeline destroyed');
  }
}