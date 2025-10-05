/**
 * Resume 頁面組件 - 靜態簡歷版本
 * Phase 1: 建立頁面骨架與路由
 *
 * 設計理念：
 * - 極簡專業風格，適合面試官快速瀏覽
 * - 單頁設計，方便列印和 PDF 輸出
 * - Config-Driven，與動態版共用數據源
 * - 響應式設計，支援桌面和移動端
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import personalConfig from '../config/data/personal.config.js';
import socialConfig from '../config/data/social.data.js';
import aboutConfig from '../config/data/about/about.data.js';
import characterConfig from '../config/data/about/character.data.js';
import timelineConfig from '../config/data/about/timeline.data.js';
import skillsConfig from '../config/data/skills.data.js';
import workProjectsConfig from '../config/data/work-projects/projects.data.js';
import { personalProjectsData } from '../config/data/personal-projects/projects.data.js';
import resumeConfig from '../config/data/resume/education-work.config.js';
import resumeSummaryConfig from '../config/data/resume/resume-summary.config.js';
import headerBgImage from '../assets/images/resume/head-bg.png';
import profilePhoto from '../assets/images/resume/profile-photo.jpg';

export class ResumePage extends BaseComponent {
  constructor(options = {}) {
    super(options);

    // 合併所有配置數據
    this.personalData = personalConfig;
    this.socialData = socialConfig;
    this.aboutData = aboutConfig;
    this.characterData = characterConfig;
    this.timelineData = timelineConfig.timeline.stages; // 使用 stages 陣列
    this.skillsData = skillsConfig;
    this.workProjectsConfig = workProjectsConfig;
    this.personalProjects = personalProjectsData;
    this.educationData = resumeConfig.education;
    this.workExperienceData = resumeConfig.workExperience;
    this.resumeSummary = resumeSummaryConfig;
    this.headerBgImage = headerBgImage;
    this.profilePhoto = profilePhoto;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '簡歷 - Resume',
      showAnimations: false, // 靜態版本不需要動畫
      printOptimized: true,
    };
  }

  /**
   * 渲染頁面
   */
  async render() {
    return `
      <div class="resume-page standalone">
        ${this.renderHeader()}
        ${this.renderEducation()}
        ${this.renderWorkExperience()}
        ${this.renderWorkProjects()}
        ${this.renderPersonalProjects()}
        ${this.renderSkills()}
        ${this.renderFooter()}
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * 渲染 Header 區域 - 現代設計風格
   * 數據來源: personal.config.js + social.data.js + header-bg.jpg
   */
  renderHeader() {
    const personal = this.personalData.personal;
    const platforms = this.socialData.platforms;
    const summary = this.resumeSummary;

    const github = platforms.find(p => p.id === 'github');
    const linkedin = platforms.find(p => p.id === 'linkedin');
    const email = platforms.find(p => p.id === 'email');

    return `
      <header class="cv-header">
        <div class="cv-header-bg"></div>
        <div class="cv-header-content">
          <div class="cv-theme-toggle" onclick="window.toggleCVTheme()">
            <span class="theme-icon">🌙</span>
          </div>

          <div class="cv-header-main">
            <div class="cv-profile-section">
              <img src="${this.profilePhoto}" alt="${personal.fullName}" class="cv-profile-photo" />
            </div>

            <div class="cv-name-section">
              <h1 class="cv-name">${personal.fullName}</h1>
              <h2 class="cv-title">${personal.jobTitle}</h2>
              <p class="cv-tagline">${summary.tagline}</p>
            </div>

            <div class="cv-contact-section">
              ${email ? `<a href="${email.url}" class="cv-contact-item">
                <span class="contact-icon">${email.icon}</span>
                <span class="contact-text">${email.username}</span>
              </a>` : ''}
              ${github ? `<a href="${github.url}" target="_blank" class="cv-contact-item">
                <span class="contact-icon">${github.icon}</span>
                <span class="contact-text">${github.username}</span>
              </a>` : ''}
              ${linkedin ? `<a href="${linkedin.url}" target="_blank" class="cv-contact-item">
                <span class="contact-icon">${linkedin.icon}</span>
                <span class="contact-text">LinkedIn</span>
              </a>` : ''}
              <div class="cv-contact-item">
                <span class="contact-icon">📍</span>
                <span class="contact-text">${personal.location}</span>
              </div>
            </div>
          </div>

          <!-- 經歷概述區塊 -->
          <div class="cv-career-summary">
            <h3 class="cv-career-summary-title">經歷概述</h3>
            <p class="cv-career-summary-text">${summary.careerSummary}</p>
          </div>
        </div>
      </header>
    `;
  }

  /**
   * 渲染 Education 區域 - 學歷
   */
  renderEducation() {
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Education 學歷</h2>
        <div class="cv-content">
          ${this.educationData.map(edu => `
            <div class="cv-item">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-title">${edu.institutionZh} ${edu.institution}</h3>
                  <p class="cv-item-subtitle">${edu.degreeZh}</p>
                </div>
                <span class="cv-item-period">${edu.period}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * 渲染 Work Experience 區域 - 工作經歷
   */
  renderWorkExperience() {
    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Work Experience 工作經歷</h2>
        <div class="cv-content">
          ${this.workExperienceData.map(work => `
            <div class="cv-item">
              <div class="cv-item-header">
                <div>
                  <h3 class="cv-item-title">${work.company}</h3>
                  <p class="cv-item-subtitle">${work.positionZh} ${work.position}</p>
                </div>
                <span class="cv-item-period">${work.period}</span>
              </div>

              ${work.achievements && work.achievements.length > 0 ? `
                <ul class="cv-item-list">
                  ${work.achievements.map(achievement => `
                    <li>${achievement}</li>
                  `).join('')}
                </ul>
              ` : ''}

              ${work.technologies && work.technologies.length > 0 ? `
                <div class="cv-item-tags">
                  ${work.technologies.map(tech => `<span class="cv-tag">${tech}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * 渲染 Work Projects 區域 - 工作專案（按時間近到遠）
   */
  renderWorkProjects() {
    const workProjectsArray = Object.values(this.workProjectsConfig.all);

    // 按時間排序（最近到最遠）
    const sortedWorkProjects = workProjectsArray.sort((a, b) => {
      const dateA = a.timeline?.startDate || '2000-01';
      const dateB = b.timeline?.startDate || '2000-01';
      return dateB.localeCompare(dateA);
    });

    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Work Projects 工作專案</h2>
        <div class="cv-content">
          ${sortedWorkProjects.map((project) => {
            const title = project.name || '未命名專案';
            const description = (project.shortDescription || '').substring(0, 150) + '...';
            const period = project.timeline ? `${project.timeline.startDate} ~ ${project.timeline.endDate || 'now'}` : '';

            return `
              <div class="cv-project-item">
                <div class="cv-project-header">
                  <div>
                    <h3 class="cv-project-title">${title}</h3>
                    ${period ? `<p class="cv-project-period">${period}</p>` : ''}
                  </div>
                  <span class="cv-project-type">工作專案</span>
                </div>
                <p class="cv-project-desc">${description}</p>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  /**
   * 渲染 Personal Projects 區域 - 個人專案（按重要性）
   */
  renderPersonalProjects() {
    // 按 importance 排序（高到低）
    const sortedPersonalProjects = [...this.personalProjects].sort((a, b) => {
      return (b.importance || 0) - (a.importance || 0);
    });

    return `
      <section class="cv-section">
        <h2 class="cv-section-title">Personal Projects 個人專案</h2>
        <div class="cv-content">
          ${sortedPersonalProjects.map((project) => {
            const title = project.title || '未命名專案';
            const description = (project.description || '').substring(0, 150) + '...';

            return `
              <div class="cv-project-item">
                <div class="cv-project-header">
                  <h3 class="cv-project-title">${title}</h3>
                  <span class="cv-project-type">個人專案</span>
                </div>
                <p class="cv-project-desc">${description}</p>
                ${project.technologies && project.technologies.length > 0 ? `
                  <div class="cv-item-tags">
                    ${project.technologies.slice(0, 6).map(tech => `<span class="cv-tag">${tech}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  /**
   * 渲染 Skills 區域 - 六大領域分類展示
   * 從 skills.data.js 提取並分類為「熟悉」和「正在學習」
   */
  renderSkills() {
    const categories = this.skillsData.categories;
    const tree = this.skillsData.tree;

    // 建立六大領域的技能分類
    const skillsByCategory = {};

    // 從技能樹中提取所有技能節點（ring1 + ring2）
    const allNodes = [
      tree.center,
      ...(tree.ring1 || []),
      ...(tree.ring2 || []),
    ];

    // 按領域分類技能
    Object.keys(categories).forEach(catKey => {
      const category = categories[catKey];

      // 找到該領域的所有節點
      const categoryNodes = allNodes.filter(node => node.category === catKey);

      // 提取技能並按 proficiency 分類
      const proficient = [];
      const learning = [];

      categoryNodes.forEach(node => {
        if (node.skills && Array.isArray(node.skills)) {
          node.skills.forEach(skill => {
            const skillName = skill.name;
            const proficiency = skill.proficiency || 0;

            // 熟悉: proficiency >= 70
            // 正在學習: proficiency < 70
            if (proficiency >= 70) {
              if (!proficient.includes(skillName)) {
                proficient.push(skillName);
              }
            } else if (proficiency >= 40) {
              if (!learning.includes(skillName)) {
                learning.push(skillName);
              }
            }
          });
        }
      });

      skillsByCategory[catKey] = {
        ...category,
        proficient,
        learning,
      };
    });

    return `
      <section class="cv-section cv-skills-section">
        <h2 class="cv-section-title">Technical Skills 技術技能</h2>
        <div class="cv-skills-container">
          ${Object.keys(skillsByCategory).map(catKey => {
            const cat = skillsByCategory[catKey];
            if (cat.proficient.length === 0 && cat.learning.length === 0) return '';

            return `
              <div class="cv-skill-domain">
                <h3 class="cv-skill-domain-title">
                  <span class="domain-icon">${cat.icon}</span>
                  <span class="domain-name">${cat.name}</span>
                </h3>

                ${cat.proficient.length > 0 ? `
                  <div class="cv-skill-level-group">
                    <h4 class="cv-skill-level-title">熟悉</h4>
                    <div class="cv-skill-tags">
                      ${cat.proficient.map(skill => `
                        <span class="cv-skill-tag proficient">${skill}</span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${cat.learning.length > 0 ? `
                  <div class="cv-skill-level-group">
                    <h4 class="cv-skill-level-title">正在學習</h4>
                    <div class="cv-skill-tags">
                      ${cat.learning.map(skill => `
                        <span class="cv-skill-tag learning">${skill}</span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  /**
   * 渲染 Footer - 返回動態網站連結
   */
  renderFooter() {
    return `
      <footer class="cv-footer">
        <a href="/#/" class="cv-back-link">
          🎮 查看互動式遊戲化個人網站
        </a>
        <p class="cv-footer-note">
          此簡歷由 config-driven 系統自動生成 • 最後更新: ${new Date().toLocaleDateString('zh-TW')}
        </p>
      </footer>
    `;
  }

  /**
   * 刪除的舊方法 - renderProjectCard
   */
  _oldRenderProjectCard(project, type) {
    const rarityColors = {
      legendary: '#FFD700',
      superRare: '#9B59B6',
      rare: '#3498DB',
      common: '#95A5A6',
    };

    const rarityColor = rarityColors[project.rarity] || rarityColors.common;

    // 統一不同類型專案的欄位名稱
    const title = project.title || project.name || '未命名專案';
    const description = project.description || project.shortDescription || '';

    // 處理時間顯示
    let period = '';
    if (type === 'work' && project.timeline) {
      const start = project.timeline.startDate?.substring(0, 7) || '';
      const end = project.timeline.endDate?.substring(0, 7) || '進行中';
      period = start && end ? `${start} ~ ${end}` : '';
    } else if (project.period) {
      period = project.period;
    }

    // 處理技術棧 - work projects 是物件陣列，personal projects 是字串陣列
    let technologies = [];
    if (project.technologies) {
      if (typeof project.technologies[0] === 'object') {
        // work projects: { name, category }
        technologies = project.technologies.map(t => t.name);
      } else {
        // personal projects: string[]
        technologies = project.technologies;
      }
    }

    // 處理成就/亮點
    const achievements = project.achievements || project.highlights || [];

    return `
      <div class="project-card" style="border-color: ${rarityColor};">
        <div class="project-header">
          <h4 class="project-title">${title}</h4>
          ${period ? `<span class="project-period">${period}</span>` : ''}
        </div>

        <p class="project-description">${description}</p>

        ${technologies.length > 0 ? `
          <div class="project-technologies">
            ${technologies.slice(0, 6).map(tech => `
              <span class="tech-tag-small">${tech}</span>
            `).join('')}
          </div>
        ` : ''}

        ${achievements.length > 0 ? `
          <ul class="project-achievements">
            ${achievements.slice(0, 3).map(achievement => {
              // 處理字串或物件格式的成就
              const text = typeof achievement === 'string' ? achievement : achievement.challenge || achievement;
              return `<li>${text}</li>`;
            }).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  /**
   * 渲染樣式 - 簡約 CV 風格
   */
  renderStyles() {
    return `
      <style>
        /* ===== CV Page Standalone Mode ===== */
        .resume-page.standalone {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          color: #2c3e50;
          font-family: 'Inter', 'Noto Sans TC', sans-serif;
          line-height: 1.7;
          overflow-y: auto;
          z-index: 9999;
          padding: 0;
          max-width: 100vw;
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* 深色模式 */
        .resume-page.standalone.dark-mode {
          background: linear-gradient(135deg, #1e1e2e 0%, #2d3748 100%);
          color: #e2e8f0;
        }

        /* 隱藏動態網站的導航元素 */
        body:has(.resume-page.standalone) #navigation,
        body:has(.resume-page.standalone) #breadcrumb-container,
        body:has(.resume-page.standalone) #progress-indicator-container,
        body:has(.resume-page.standalone) #keyboard-nav-container {
          display: none !important;
        }

        /* ===== CV Header with Background Image ===== */
        .cv-header {
          position: relative;
          margin: 0 20% 40px 20%;
          padding: 60px 40px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .cv-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('${this.headerBgImage}');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .cv-header-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);
          z-index: 1;
        }

        .dark-mode .cv-header-bg::before {
          background: linear-gradient(135deg, rgba(30, 30, 46, 0.85) 0%, rgba(45, 55, 72, 0.85) 100%);
        }

        .cv-header-content {
          position: relative;
          z-index: 2;
        }

        .cv-theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
          z-index: 1000;
        }

        .cv-theme-toggle:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .theme-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .cv-header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
        }

        .cv-profile-section {
          flex-shrink: 0;
        }

        .cv-profile-photo {
          width: 160px;
          height: 200px;
          border-radius: 8px;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .dark-mode .cv-profile-photo {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .cv-name-section {
          flex: 1;
        }

        .cv-name {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          letter-spacing: -0.5px;
        }

        .cv-title {
          font-size: 1.5rem;
          font-weight: 400;
          margin: 0 0 20px 0;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .cv-tagline {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          max-width: 600px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
          margin: 0;
        }

        /* 經歷概述區塊 */
        .cv-career-summary {
          margin-top: 40px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark-mode .cv-career-summary {
          background: rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .cv-career-summary-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 15px 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .cv-career-summary-text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.8;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
          white-space: pre-line;
        }

        .cv-contact-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 280px;
        }

        .cv-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.95);
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 8px;
          border-radius: 8px;
        }

        .cv-contact-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .contact-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .contact-text {
          flex: 1;
        }

        /* ===== CV Sections ===== */
        .cv-section {
          margin: 0 20% 40px 20%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .dark-mode .cv-section {
          background: rgba(45, 55, 72, 0.5);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .cv-section-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0 0 25px 0;
          padding-bottom: 15px;
          border-bottom: 3px solid;
          border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;
          color: #2c3e50;
        }

        .dark-mode .cv-section-title {
          color: #e2e8f0;
        }

        .cv-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ===== CV Items (Education & Work) ===== */
        .cv-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }

        .dark-mode .cv-item {
          background: rgba(30, 30, 46, 0.4);
          border-left-color: #764ba2;
        }

        .cv-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .cv-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .cv-item-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
          color: #2c3e50;
        }

        .dark-mode .cv-item-title {
          color: #e2e8f0;
        }

        .cv-item-subtitle {
          font-size: 1rem;
          margin: 4px 0 0 0;
          color: #667eea;
          font-weight: 500;
        }

        .dark-mode .cv-item-subtitle {
          color: #a78bfa;
        }

        .cv-item-period {
          font-size: 0.9rem;
          color: #666;
          white-space: nowrap;
          font-weight: 600;
          background: rgba(102, 126, 234, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .dark-mode .cv-item-period {
          color: #cbd5e0;
          background: rgba(167, 139, 250, 0.2);
        }

        .cv-item-list {
          margin: 8px 0 0 0;
          padding-left: 20px;
          list-style-type: none;
        }

        .cv-item-list li {
          margin-bottom: 8px;
          color: #555;
          line-height: 1.7;
          position: relative;
          padding-left: 10px;
        }

        .cv-item-list li:before {
          content: '▸';
          position: absolute;
          left: -10px;
          color: #667eea;
          font-weight: bold;
        }

        .dark-mode .cv-item-list li {
          color: #cbd5e0;
        }

        .cv-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .cv-tag {
          padding: 6px 14px;
          background: linear-gradient(135deg, #667eea15, #764ba215);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 20px;
          font-size: 0.85rem;
          color: #667eea;
          font-weight: 500;
        }

        .dark-mode .cv-tag {
          background: rgba(167, 139, 250, 0.15);
          border-color: rgba(167, 139, 250, 0.3);
          color: #a78bfa;
        }

        .cv-details-btn {
          align-self: flex-start;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          font-weight: 600;
        }

        .cv-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        /* ===== CV Projects ===== */
        .cv-project-item {
          padding: 25px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-radius: 16px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          transition: all 0.3s ease;
        }

        .dark-mode .cv-project-item {
          background: rgba(30, 30, 46, 0.4);
          border-color: rgba(167, 139, 250, 0.3);
        }

        .cv-project-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .cv-project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          gap: 15px;
        }

        .cv-project-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          color: #2c3e50;
          flex: 1;
        }

        .dark-mode .cv-project-title {
          color: #e2e8f0;
        }

        .cv-project-period {
          font-size: 0.85rem;
          color: #999;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .dark-mode .cv-project-period {
          color: #a0aec0;
        }

        .cv-project-type {
          padding: 6px 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 20px;
          font-size: 0.8rem;
          white-space: nowrap;
          font-weight: 600;
        }

        .cv-project-desc {
          margin: 0 0 15px 0;
          color: #555;
          line-height: 1.7;
        }

        .dark-mode .cv-project-desc {
          color: #cbd5e0;
        }

        /* ===== CV Skills - 兩欄式佈局 ===== */
        .cv-skills-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .cv-skill-domain {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(5px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(102, 126, 234, 0.2);
          transition: all 0.3s ease;
        }

        .dark-mode .cv-skill-domain {
          background: rgba(45, 55, 72, 0.4);
          border-color: rgba(167, 139, 250, 0.2);
        }

        .cv-skill-domain:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }

        .cv-skill-domain-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          padding-bottom: 10px;
          border-bottom: 2px solid rgba(102, 126, 234, 0.3);
        }

        .dark-mode .cv-skill-domain-title {
          color: #e2e8f0;
          border-bottom-color: rgba(167, 139, 250, 0.3);
        }

        .domain-icon {
          font-size: 1.3rem;
        }

        .domain-name {
          flex: 1;
        }

        .cv-skill-level-group {
          margin-bottom: 15px;
        }

        .cv-skill-level-group:last-child {
          margin-bottom: 0;
        }

        .cv-skill-level-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #667eea;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dark-mode .cv-skill-level-title {
          color: #a78bfa;
        }

        .cv-skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cv-skill-tag {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .cv-skill-tag.proficient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
        }

        .cv-skill-tag.learning {
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
          border: 1.5px solid #667eea;
        }

        .dark-mode .cv-skill-tag.learning {
          background: rgba(167, 139, 250, 0.15);
          color: #a78bfa;
          border-color: #a78bfa;
        }

        .cv-skill-tag:hover {
          transform: translateY(-2px);
        }

        .cv-skill-tag.proficient:hover {
          box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
        }

        .cv-skill-tag.learning:hover {
          background: rgba(102, 126, 234, 0.25);
        }

        .dark-mode .cv-skill-tag.learning:hover {
          background: rgba(167, 139, 250, 0.25);
        }

        /* ===== CV Footer ===== */
        .cv-footer {
          margin-top: 60px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .dark-mode .cv-footer {
          background: rgba(45, 55, 72, 0.5);
        }

        .cv-back-link {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .cv-back-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .cv-footer-note {
          font-size: 0.9rem;
          color: #999;
          margin: 15px 0 0 0;
        }

        .dark-mode .cv-footer-note {
          color: #a0aec0;
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .resume-page.standalone {
            padding: 0;
          }

          .cv-header {
            margin: 0 5% 30px 5%;
            padding: 40px 20px;
            border-radius: 20px;
          }

          .cv-profile-photo {
            width: 100px;
            height: 125px;
          }

          .cv-theme-toggle {
            top: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
          }

          .cv-header-main {
            flex-direction: column;
            gap: 25px;
          }

          .cv-contact-section {
            width: 100%;
            min-width: auto;
          }

          .cv-name {
            font-size: 2.2rem;
          }

          .cv-title {
            font-size: 1.3rem;
          }

          .cv-tagline {
            font-size: 1rem;
          }

          .cv-career-summary {
            margin-top: 30px;
            padding: 20px;
          }

          .cv-section {
            padding: 20px;
            margin: 0 5% 30px 5%;
          }

          .cv-section-title {
            font-size: 1.4rem;
          }

          .cv-item-header {
            flex-direction: column;
            gap: 8px;
          }

          .cv-item-period {
            align-self: flex-start;
          }

          .cv-project-header {
            flex-direction: column;
            gap: 10px;
          }

          .cv-project-type {
            align-self: flex-start;
          }

          .cv-skills-container {
            grid-template-columns: 1fr;
          }
        }

        /* ===== Print Styles ===== */
        @media print {
          .resume-page.standalone {
            position: static;
            padding: 20px;
            background: #fff !important;
          }

          .cv-header {
            margin: 0;
            border-radius: 0;
          }

          .cv-header-bg {
            display: none;
          }

          .cv-theme-toggle,
          .cv-back-link,
          .cv-details-btn {
            display: none !important;
          }

          .cv-footer-note {
            display: none;
          }

          .cv-section {
            page-break-inside: avoid;
            background: #fff !important;
            box-shadow: none !important;
          }

          .cv-name,
          .cv-title,
          .cv-summary,
          .cv-contact-item {
            color: #000 !important;
            text-shadow: none !important;
          }
        }
      </style>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    console.log('📄 Resume Page initialized');

    // 預設深色模式
    const savedTheme = localStorage.getItem('cv-theme') || 'dark';
    if (savedTheme === 'dark') {
      document.querySelector('.resume-page').classList.add('dark-mode');
      const themeIcon = document.querySelector('.theme-icon');
      if (themeIcon) themeIcon.textContent = '☀️';
    }

    // 設置全局主題切換函數
    window.toggleCVTheme = () => {
      const resumePage = document.querySelector('.resume-page');
      const themeIcon = document.querySelector('.theme-icon');
      const isDark = resumePage.classList.toggle('dark-mode');

      if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
      }

      localStorage.setItem('cv-theme', isDark ? 'dark' : 'light');
    };

    // 設置全局彈窗函數（待實作）
    window.showWorkDetails = (workId) => {
      console.log('Show work details:', workId);
      // TODO: 實作工作詳情彈窗
    };

    window.showProjectDetails = (projectId, type) => {
      console.log('Show project details:', projectId, type);
      // TODO: 實作專案詳情彈窗
    };
  }

  /**
   * 銷毀組件
   */
  destroy() {
    console.log('📄 Resume Page destroyed');
  }
}
