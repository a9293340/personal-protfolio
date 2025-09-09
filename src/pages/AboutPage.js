/**
 * 關於頁面組件
 * Step 3.2.1: Config-Driven About Page
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import aboutConfig from '../config/data/about/about.data.js';
import { CharacterPanel } from '../components/gaming/CharacterPanel.js';
import { ConceptTimeline } from '../components/gaming/ConceptTimeline.js';

export class AboutPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.characterPanel = null;
    this.conceptTimeline = null;
  }
  
  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return aboutConfig;
  }

  /**
   * 渲染頁面標題區塊
   */
  renderHeader(headerConfig) {
    return `
      <header class="about-header">
        <h1 class="about-title">
          <span class="title-icon">${headerConfig.title.icon}</span>
          <span class="title-text">${headerConfig.title.text}</span>
        </h1>
        <p class="about-subtitle">${headerConfig.title.subtitle}</p>
        <p class="about-description">${headerConfig.description}</p>
      </header>
    `;
  }

  /**
   * 渲染職涯目標區塊
   */
  renderCareerGoal(goalConfig) {
    const goalsHtml = goalConfig.goals.map(goal => `
      <div class="goal-item">
        <h4 class="goal-primary">${goal.primary}</h4>
        <p class="goal-description">${goal.description}</p>
      </div>
    `).join('');

    return `
      <section class="career-goal-section" 
               style="background: ${goalConfig.theme.bgColor}; border: 2px solid ${goalConfig.theme.borderColor};">
        <h2 class="section-title" style="color: ${goalConfig.theme.titleColor};">
          ${goalConfig.title}
        </h2>
        <div class="goals-container">
          ${goalsHtml}
        </div>
      </section>
    `;
  }

  /**
   * 渲染技術專長區塊
   */
  renderTechnicalSkills(skillsConfig) {
    const categoriesHtml = skillsConfig.categories.map(category => `
      <div class="skill-category">
        <h3 class="category-title" style="color: ${category.color};">
          <span class="category-icon">${category.icon}</span>
          ${category.name}
        </h3>
        <ul class="skill-list">
          ${category.skills.map(skill => `<li class="skill-item">${skill}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    return `
      <section class="technical-skills-section" 
               style="background: ${skillsConfig.theme.bgColor}; border: 2px solid ${skillsConfig.theme.borderColor};">
        <h2 class="section-title" style="color: ${skillsConfig.theme.titleColor};">
          ${skillsConfig.title}
        </h2>
        <div class="skills-grid">
          ${categoriesHtml}
        </div>
      </section>
    `;
  }

  /**
   * 渲染個人特質區塊
   */
  renderPersonalTraits(traitsConfig) {
    const traitsHtml = traitsConfig.traits.map(trait => `
      <div class="trait-item">
        <div class="trait-header">
          <span class="trait-icon">${trait.icon}</span>
          <h4 class="trait-name">${trait.trait}</h4>
          <span class="trait-level">${trait.level}%</span>
        </div>
        <p class="trait-description">${trait.description}</p>
        <div class="trait-progress">
          <div class="progress-bar" style="width: ${trait.level}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <section class="personal-traits-section" 
               style="background: ${traitsConfig.theme.bgColor}; border: 2px solid ${traitsConfig.theme.borderColor};">
        <h2 class="section-title" style="color: ${traitsConfig.theme.titleColor};">
          ${traitsConfig.title}
        </h2>
        <div class="traits-grid">
          ${traitsHtml}
        </div>
      </section>
    `;
  }

  /**
   * 渲染頁面 HTML (Config-Driven)
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <div class="about-page">
        <div class="about-container" style="max-width: ${config.layout.maxWidth}; padding: ${config.layout.padding};">
          
          ${this.renderHeader(config.header)}
          
          <!-- RPG 角色面板 - 置於最顯眼位置 -->
          <section class="character-panel-section">
            <h2 class="section-title" style="color: var(--primary-gold); text-align: center; margin-bottom: 2rem;">
              🎮 角色狀態
            </h2>
            <div id="character-panel-container"></div>
          </section>
          
          <!-- 概念型時間軸 - 職涯發展概覽 -->
          <section class="concept-timeline-section">
            <div id="concept-timeline-container"></div>
          </section>
          
          ${this.renderCareerGoal(config.careerGoal)}
          ${this.renderTechnicalSkills(config.technicalSkills)}
          
          <div class="about-navigation">
            <a href="#/" class="back-button">
              ← 返回首頁
            </a>
          </div>
          
        </div>
      </div>
    `;
  }

  /**
   * 初始化頁面
   */
  async init() {
    await super.init();
    
    // 添加進度條動畫
    this.initProgressAnimations();
    
    // 初始化 RPG 角色面板
    await this.initCharacterPanel();
    
    // 初始化概念型時間軸
    await this.initConceptTimeline();
    
    console.log('📋 AboutPage initialized with Config-Driven architecture + RPG Character Panel + Concept Timeline');
  }

  /**
   * 初始化進度條動畫
   */
  initProgressAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = bar.style.width; // 觸發動畫
      }, index * 200);
    });
  }

  /**
   * 初始化 RPG 角色面板
   */
  async initCharacterPanel() {
    const container = document.getElementById('character-panel-container');
    if (container) {
      this.characterPanel = new CharacterPanel({
        container: container
      });
      
      // 渲染組件 HTML 並插入容器
      const html = await this.characterPanel.render();
      container.innerHTML = html;
      
      // 初始化組件功能
      await this.characterPanel.init();
      console.log('🎮 CharacterPanel integrated into AboutPage');
    }
  }

  /**
   * 初始化概念型時間軸
   */
  async initConceptTimeline() {
    const container = document.getElementById('concept-timeline-container');
    if (container) {
      this.conceptTimeline = new ConceptTimeline({
        container: container
      });
      
      // 渲染組件 HTML 並插入容器
      const html = await this.conceptTimeline.render();
      container.innerHTML = html;
      
      // 初始化組件功能
      await this.conceptTimeline.init();
      console.log('⏰ ConceptTimeline integrated into AboutPage');
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    if (this.characterPanel) {
      this.characterPanel.destroy();
      this.characterPanel = null;
    }
    
    if (this.conceptTimeline) {
      this.conceptTimeline.destroy();
      this.conceptTimeline = null;
    }
    
    super.destroy();
    console.log('📋 AboutPage destroyed');
  }
}