/**
 * 關於頁面組件
 * Step 3.2.1: Config-Driven About Page
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import aboutConfig from '../config/data/about/about.data.js';
import { CharacterPanel } from '../components/gaming/CharacterPanel.js';
import { ConceptTimeline } from '../components/gaming/ConceptTimeline.js';
import { AchievementBadges } from '../components/gaming/AchievementBadges.js';
import { SkillsTagCloud } from '../components/gaming/SkillsTagCloud.js';

export class AboutPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.characterPanel = null;
    this.conceptTimeline = null;
    this.achievementBadges = null;
    this.skillsTagCloud = null;
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
          
          <!-- 成就徽章系統 - Step 3.2.4 -->
          <section class="achievement-badges-section">
            <div id="achievement-badges-container"></div>
          </section>
          
          <!-- 技能標籤雲 - Step 3.2.4 -->
          <section class="skills-tag-cloud-section">
            <div id="skills-tag-cloud-container"></div>
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
    
    // 初始化成就徽章系統
    await this.initAchievementBadges();
    
    // 初始化技能標籤雲
    await this.initSkillsTagCloud();
    
    // 設置組件間互動效果
    this.setupComponentInteractions();
    
    // 啟動頁面過渡動畫
    this.startPageTransitions();
    
    console.log('📋 AboutPage initialized with Config-Driven architecture + RPG Character Panel + Concept Timeline + Achievement Badges + Skills Tag Cloud');
  }

  /**
   * 初始化進度條動畫
   */
  initProgressAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = targetWidth;
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
   * 初始化成就徽章系統
   */
  async initAchievementBadges() {
    const container = document.getElementById('achievement-badges-container');
    if (container) {
      // 確保配置正確傳遞
      const achievementsConfig = aboutConfig.achievementBadges || aboutConfig.default?.achievementBadges;
      
      console.log('🔍 AchievementBadges config:', achievementsConfig); // 調試輸出
      
      this.achievementBadges = new AchievementBadges({
        container: container,
        ...achievementsConfig  // 直接展開配置
      });
      
      // 渲染組件 HTML 並插入容器
      const html = await this.achievementBadges.render();
      container.innerHTML = html;
      
      // 初始化組件功能
      await this.achievementBadges.init();
      console.log('🏆 AchievementBadges integrated into AboutPage');
    }
  }

  /**
   * 初始化技能標籤雲
   */
  async initSkillsTagCloud() {
    const container = document.getElementById('skills-tag-cloud-container');
    if (container) {
      // 確保配置正確傳遞
      const skillsConfig = aboutConfig.skillsTagCloud || aboutConfig.default?.skillsTagCloud;
      
      console.log('🔍 SkillsTagCloud config:', skillsConfig); // 調試輸出
      
      this.skillsTagCloud = new SkillsTagCloud({
        container: container,
        ...skillsConfig  // 直接展開配置
      });
      
      // 渲染組件 HTML 並插入容器
      const html = await this.skillsTagCloud.render();
      container.innerHTML = html;
      
      // 初始化組件功能
      await this.skillsTagCloud.init();
      console.log('☁️ SkillsTagCloud integrated into AboutPage');
    }
  }

  /**
   * 設置組件間互動效果
   * Step 3.2.4: Interactive Effects
   */
  setupComponentInteractions() {
    // 簡化版本：直接使用DOM事件而不是自定義事件系統
    
    // 成就點擊處理
    const achievementBadges = document.querySelectorAll('.achievement-badge');
    achievementBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const achievementId = badge.dataset.achievement;
        this.handleAchievementClick({ achievementId });
      });
    });
    
    // 技能標籤點擊處理
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const tagName = tag.dataset.tag;
        this.handleSkillTagClick({ tagName });
      });
    });
    
    // 滾動視差效果
    this.setupScrollParallax();
    
    console.log('🔗 Component interactions setup complete');
  }

  /**
   * 處理成就點擊事件
   */
  handleAchievementClick(achievementData) {
    const { achievementId } = achievementData;
    
    // 根據成就類型高亮相關技能標籤
    const relatedSkills = this.getRelatedSkillsByAchievement(achievementId);
    
    if (relatedSkills.length > 0) {
      this.highlightSkillTags(relatedSkills);
    }
    
    console.log(`🏆 Achievement clicked: ${achievementId}`);
  }

  /**
   * 處理技能標籤點擊事件
   */
  handleSkillTagClick(skillData) {
    const { tagName } = skillData;
    
    // 在角色面板中突出顯示相關屬性
    this.highlightCharacterAttribute(tagName);
    
    // 顯示技能相關的成就
    this.highlightRelatedAchievements(tagName);
  }

  /**
   * 根據成就獲取相關技能
   */
  getRelatedSkillsByAchievement(achievementId) {
    const skillMap = {
      'fullstack-mastery': ['Node.js', 'React', 'MySQL', 'Python'],
      'system-architect': ['System Design', 'Microservices', 'AWS', 'Docker'],
      'performance-optimizer': ['Redis', 'MySQL', 'Node.js', 'Linux'],
      'team-leader': ['Git', 'CI/CD', 'System Design'],
      'innovation-pioneer': ['WebSocket', 'GraphQL', 'Serverless'],
      'mentorship-master': ['Git', 'JavaScript', 'HTML5', 'CSS3']
    };
    
    return skillMap[achievementId] || [];
  }

  /**
   * 高亮技能標籤
   */
  highlightSkillTags(skillNames) {
    const allTags = document.querySelectorAll('.skill-tag');
    
    // 重置所有標籤
    allTags.forEach(tag => {
      tag.style.filter = 'brightness(0.5)';
      tag.style.opacity = '0.3';
    });
    
    // 高亮指定標籤
    skillNames.forEach(skillName => {
      const tag = document.querySelector(`[data-tag="${skillName}"]`);
      if (tag) {
        tag.style.filter = 'brightness(1.2)';
        tag.style.opacity = '1';
        tag.style.transform = 'scale(1.1) translateY(-5px)';
        tag.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.6)';
      }
    });
    
    // 3秒後恢復正常
    setTimeout(() => {
      allTags.forEach(tag => {
        tag.style.filter = '';
        tag.style.opacity = '';
        tag.style.transform = '';
        tag.style.boxShadow = '';
      });
    }, 3000);
  }

  /**
   * 高亮角色屬性
   */
  highlightCharacterAttribute(skillName) {
    // 技能與屬性的映射關係
    const attributeMap = {
      'Node.js': 'attack',
      'Python': 'attack', 
      'JavaScript': 'attack',
      'System Design': 'intelligence',
      'AWS': 'intelligence',
      'Docker': 'agility',
      'Git': 'charisma',
      'MySQL': 'defense'
    };
    
    const attributeName = attributeMap[skillName];
    if (attributeName) {
      const attributeElement = document.querySelector(`[data-attribute="${attributeName}"]`);
      if (attributeElement) {
        // 添加脈衝動畫
        attributeElement.style.animation = 'pulse 2s ease-in-out 3';
        attributeElement.style.boxShadow = '0 0 20px var(--primary-gold)';
        
        setTimeout(() => {
          attributeElement.style.animation = '';
          attributeElement.style.boxShadow = '';
        }, 6000);
      }
    }
  }

  /**
   * 高亮相關成就
   */
  highlightRelatedAchievements(skillName) {
    // 技能與成就的映射關係
    const skillMap = {
      'fullstack-mastery': ['Node.js', 'React', 'MySQL', 'Python'],
      'system-architect': ['System Design', 'Microservices', 'AWS', 'Docker'],
      'performance-optimizer': ['Redis', 'MySQL', 'Node.js', 'Linux'],
      'team-leader': ['Git', 'CI/CD', 'System Design'],
      'innovation-pioneer': ['WebSocket', 'GraphQL', 'Serverless'],
      'mentorship-master': ['Git', 'JavaScript', 'HTML5', 'CSS3']
    };
    
    // 找到包含該技能的成就
    const relatedAchievements = [];
    Object.entries(skillMap).forEach(([achievementId, skills]) => {
      if (skills.includes(skillName)) {
        relatedAchievements.push(achievementId);
      }
    });
    
    // 高亮相關成就徽章
    relatedAchievements.forEach(achievementId => {
      const badge = document.querySelector(`[data-achievement="${achievementId}"]`);
      if (badge) {
        badge.style.animation = 'glow 1s ease-in-out 2';
        badge.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
          badge.style.animation = '';
          badge.style.transform = '';
        }, 2000);
      }
    });
  }

  /**
   * 設置滾動視差效果
   */
  setupScrollParallax() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrollTop = window.pageYOffset;
      const sections = document.querySelectorAll('.about-page section');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const speed = 0.1 + (index * 0.05); // 不同層級不同速度
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = -(scrollTop * speed);
          section.style.transform = `translateY(${yPos}px)`;
        }
      });
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * 啟動頁面過渡動畫
   * Step 3.2.4: Page Transition Animations
   */
  startPageTransitions() {
    const sections = document.querySelectorAll('.about-page section');
    
    // 創建交叉觀察器用於滾動動畫
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          this.triggerSectionAnimation(entry.target);
        }
      });
    }, observerOptions);
    
    // 觀察所有section
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(50px)';
      section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.25, 0.25, 1)';
      section.style.transitionDelay = `${index * 0.1}s`;
      
      sectionObserver.observe(section);
    });
    
    console.log('🎬 Page transition animations started');
  }

  /**
   * 觸發section動畫
   */
  triggerSectionAnimation(section) {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    
    // 根據section類型添加特殊動畫
    if (section.classList.contains('character-panel-section')) {
      this.animateCharacterPanelEntrance();
    } else if (section.classList.contains('achievement-badges-section')) {
      this.animateAchievementBadgesEntrance();
    } else if (section.classList.contains('skills-tag-cloud-section')) {
      this.animateSkillsTagCloudEntrance();
    }
  }

  /**
   * 角色面板入場動畫
   */
  animateCharacterPanelEntrance() {
    const panel = document.querySelector('.character-panel');
    if (panel) {
      panel.style.animation = 'slideInFromRight 1s ease-out';
    }
  }

  /**
   * 成就徽章入場動畫
   */
  animateAchievementBadgesEntrance() {
    const badges = document.querySelectorAll('.achievement-badge');
    badges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.animation = 'bounceIn 0.6s ease-out';
      }, index * 100);
    });
  }

  /**
   * 技能標籤雲入場動畫
   */
  animateSkillsTagCloudEntrance() {
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.animation = 'fadeInUp 0.5s ease-out';
      }, index * 50);
    });
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
    
    if (this.achievementBadges) {
      this.achievementBadges.destroy();
      this.achievementBadges = null;
    }
    
    if (this.skillsTagCloud) {
      this.skillsTagCloud.destroy();
      this.skillsTagCloud = null;
    }
    
    super.destroy();
    console.log('📋 AboutPage destroyed');
  }
}