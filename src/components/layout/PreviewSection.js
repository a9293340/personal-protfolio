/**
 * 預覽區塊組件
 * Step 3.1.4: Config-Driven PreviewSection
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';
import previewConfig, { 
  skillsPreviewConfig, 
  timelinePreviewConfig, 
  projectsPreviewConfig,
  previewLimits 
} from '../../config/data/home/preview.data.js';

export class PreviewSection extends BaseComponent {
  constructor(options = {}) {
    super(options);
  }
  
  /**
   * 獲取默認配置 (Config-Driven)
   */
  getDefaultConfig() {
    return {
      ...previewConfig.section,
      limits: previewLimits,
      skillsData: skillsPreviewConfig,
      timelineData: timelinePreviewConfig,
      projectsData: projectsPreviewConfig
    };
  }
  
  /**
   * 渲染預覽區塊 HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <section class="preview-section" id="preview-section">
        <div class="preview-container">
          
          <!-- 區塊標題 -->
          <div class="preview-header">
            <h2 class="preview-title">
              <span class="title-icon">${config.header.title.icon}</span>
              <span class="title-text">${config.header.title.text}</span>
            </h2>
            <p class="preview-subtitle">
              ${config.header.subtitle}
            </p>
          </div>
          
          <!-- 預覽卡片網格 -->
          <div class="preview-grid">
            ${config.sections.map(section => this.renderPreviewCard(section)).join('')}
          </div>
          
        </div>
      </section>
    `;
  }
  
  /**
   * 渲染單個預覽卡片
   */
  renderPreviewCard(section) {
    return `
      <div class="preview-card" 
           id="${section.id}"
           style="background: ${section.bgColor}; border: 2px solid ${section.borderColor};">
        
        <!-- 卡片頭部 -->
        <div class="card-header">
          <div class="card-icon">${section.icon}</div>
          <div class="card-title-group">
            <h3 class="card-title">${section.title}</h3>
            <p class="card-subtitle">${section.subtitle}</p>
          </div>
        </div>
        
        <!-- 預覽內容 -->
        <div class="card-content" id="${section.id}-content">
          <div class="content-placeholder">
            <div class="placeholder-animation">
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
              <span class="loading-dot"></span>
            </div>
            <p class="placeholder-text">載入中...</p>
          </div>
        </div>
        
        <!-- 查看更多按鈕 -->
        <div class="card-footer">
          <a href="#${section.action}" class="view-more-btn">
            查看更多
            <span class="arrow-icon">→</span>
          </a>
        </div>
        
      </div>
    `;
  }
  
  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    // 載入各個預覽內容
    this.loadPreviewContent();
    
    // 綁定交互事件
    this.bindInteractions();
    
    console.log('📦 PreviewSection initialized');
  }
  
  /**
   * 載入預覽內容
   */
  async loadPreviewContent() {
    // 載入技能樹預覽
    await this.loadSkillsPreview();
    
    // 載入時間軸預覽
    await this.loadTimelinePreview();
    
    // 載入專案預覽
    await this.loadProjectsPreview();
  }
  
  /**
   * 載入技能樹預覽 (Config-Driven)
   */
  async loadSkillsPreview() {
    const container = document.getElementById('skills-preview-content');
    if (!container) return;
    
    const config = this.mergeConfig();
    const skillsData = config.skillsData;
    const limits = config.limits.skills;
    
    // 應用最大標籤數限制
    const displaySkills = skillsData.skills.slice(0, limits.maxTags);
    
    // 生成技能標籤
    const skillBadges = displaySkills.map(skill => 
      `<span class="skill-badge" 
             style="background: ${skill.color};"
             title="技能等級: ${skill.level}">
        ${skill.name}
      </span>`
    ).join('');
    
    // 簡化的技能展示
    container.innerHTML = `
      <div class="skills-preview">
        <div class="skill-badges">
          ${skillBadges}
        </div>
        <div class="skill-stats">
          <div class="stat-item">
            <span class="stat-value">${skillsData.stats.totalTech}</span>
            <span class="stat-label">技術棧</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${skillsData.stats.experience}</span>
            <span class="stat-label">年經驗</span>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * 載入時間軸預覽 (Config-Driven)
   */
  async loadTimelinePreview() {
    const container = document.getElementById('timeline-preview-content');
    if (!container) return;
    
    const config = this.mergeConfig();
    const timelineData = config.timelineData;
    const limits = config.limits.timeline;
    
    // 應用最大時間點數限制
    const displayTimeline = timelineData.timeline.slice(0, limits.maxItems);
    
    // 生成時間軸項目
    const timelineItems = displayTimeline.map(item => 
      `<div class="timeline-item" data-importance="${item.importance}">
        <span class="timeline-year">${item.year}</span>
        <span class="timeline-title" title="${item.description}">${item.title}</span>
      </div>`
    ).join('');
    
    // 簡化的時間軸展示
    container.innerHTML = `
      <div class="timeline-preview">
        <div class="timeline-mini">
          ${timelineItems}
        </div>
      </div>
    `;
  }
  
  /**
   * 載入專案預覽 (Config-Driven)
   */
  async loadProjectsPreview() {
    const container = document.getElementById('projects-preview-content');
    if (!container) return;
    
    const config = this.mergeConfig();
    const projectsData = config.projectsData;
    const limits = config.limits.projects;
    
    // 應用最大卡片數限制
    const displayProjects = projectsData.projects.slice(0, limits.maxCards);
    
    // 生成專案迷你卡片
    const projectCards = displayProjects.map(project => 
      `<div class="project-mini-card" 
             data-status="${project.status}"
             title="${project.description}">
        <span class="project-icon">${project.icon}</span>
        <span class="project-name">${project.name}</span>
      </div>`
    ).join('');
    
    // 簡化的專案展示
    container.innerHTML = `
      <div class="projects-preview">
        <div class="project-cards-mini">
          ${projectCards}
        </div>
        <div class="project-stats">
          <span class="stat-highlight">${projectsData.stats.totalProjects}</span> 完成專案
        </div>
      </div>
    `;
  }
  
  /**
   * 綁定交互事件
   */
  bindInteractions() {
    // 卡片懸停效果
    const cards = document.querySelectorAll('.preview-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      });
    });
  }
  
  /**
   * 配置驗證與處理
   */
  validateAndProcessConfig(config) {
    const processedConfig = { ...config };
    
    // 驗證並處理技能數據
    if (processedConfig.skillsData) {
      const skills = processedConfig.skillsData.skills;
      const limits = processedConfig.limits.skills;
      
      if (skills.length > limits.maxTags) {
        console.warn(`🚨 Skills exceeded limit: ${skills.length} > ${limits.maxTags}, truncating...`);
        processedConfig.skillsData.skills = skills.slice(0, limits.maxTags);
      }
      
      if (skills.length < limits.minTags) {
        console.warn(`🚨 Not enough skills: ${skills.length} < ${limits.minTags}`);
      }
    }
    
    // 驗證並處理時間軸數據
    if (processedConfig.timelineData) {
      const timeline = processedConfig.timelineData.timeline;
      const limits = processedConfig.limits.timeline;
      
      if (timeline.length > limits.maxItems) {
        console.warn(`🚨 Timeline items exceeded limit: ${timeline.length} > ${limits.maxItems}, truncating...`);
        processedConfig.timelineData.timeline = timeline.slice(0, limits.maxItems);
      }
      
      // 檢查標題長度
      timeline.forEach((item, index) => {
        if (item.title.length > limits.maxTitleLength) {
          console.warn(`🚨 Timeline item ${index} title too long, truncating...`);
          processedConfig.timelineData.timeline[index].title = 
            item.title.substring(0, limits.maxTitleLength) + '...';
        }
      });
    }
    
    // 驗證並處理專案數據
    if (processedConfig.projectsData) {
      const projects = processedConfig.projectsData.projects;
      const limits = processedConfig.limits.projects;
      
      if (projects.length > limits.maxCards) {
        console.warn(`🚨 Projects exceeded limit: ${projects.length} > ${limits.maxCards}, truncating...`);
        processedConfig.projectsData.projects = projects.slice(0, limits.maxCards);
      }
      
      // 檢查專案名稱長度
      projects.forEach((project, index) => {
        if (project.name.length > limits.maxNameLength) {
          console.warn(`🚨 Project ${index} name too long, truncating...`);
          processedConfig.projectsData.projects[index].name = 
            project.name.substring(0, limits.maxNameLength) + '...';
        }
      });
    }
    
    return processedConfig;
  }

  /**
   * 重寫 mergeConfig 以包含驗證
   */
  mergeConfig() {
    const config = super.mergeConfig();
    return this.validateAndProcessConfig(config);
  }

  /**
   * 銷毀組件
   */
  destroy() {
    super.destroy();
    console.log('📦 PreviewSection destroyed (Config-Driven)');
  }
}