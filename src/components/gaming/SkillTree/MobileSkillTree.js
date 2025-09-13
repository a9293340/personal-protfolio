/**
 * 手機端簡化版技能樹組件
 * 基於 skills.data.js 的收合式樹狀結構
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';
import { EventManager } from '../../../core/events/EventManager.js';

export class MobileSkillTree extends BaseComponent {
  constructor(container, options = {}) {
    super(options);

    this.container = container;
    this.skillData = options.skillData || {};
    this.expandedBranches = new Set(['backend']); // 預設展開後端分支
    this.events = new EventManager();

    if (!this.container) {
      console.error('❌ MobileSkillTree: 容器不存在', container);
    }
  }

  getDefaultConfig() {
    return {
      showDetails: true,
      enableAnimation: true,
      animationDuration: 300,
      initialExpandedBranch: '', // 預設全部收起
    };
  }

  getInitialState() {
    const config = this.config || this.getDefaultConfig();
    return {
      selectedSkill: null,
      expandedBranches: config.initialExpandedBranch
        ? new Set([config.initialExpandedBranch])
        : new Set(),
    };
  }

  async init() {
    await super.init();

    // 合併配置
    this.config = { ...this.getDefaultConfig(), ...this.options };

    // 初始化狀態
    this.state = this.getInitialState();

    this.createStructure();
    this.bindEvents();
    this.render();
  }

  createStructure() {
    if (!this.container) {
      console.error('❌ MobileSkillTree: createStructure - 容器不存在');
      return;
    }

    this.container.innerHTML = `
      <div class="mobile-skill-tree">
        <div class="skill-tree-header">
          <h2 class="skill-tree-title">技能樹總覽</h2>
          <div class="skill-tree-stats"></div>
        </div>
        <div class="skill-tree-content">
          <div class="center-skill"></div>
          <div class="skill-branches"></div>
        </div>
      </div>
    `;

    this.elements = {
      header: this.container.querySelector('.skill-tree-header'),
      stats: this.container.querySelector('.skill-tree-stats'),
      centerSkill: this.container.querySelector('.center-skill'),
      branches: this.container.querySelector('.skill-branches'),
      content: this.container.querySelector('.skill-tree-content'),
    };
  }

  render() {
    this.renderStats();
    this.renderCenterSkill();
    this.renderBranches();
  }

  renderStats() {
    const stats = this.skillData.statistics || {};

    this.elements.stats.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${stats.totalNodes || 0}</span>
          <span class="stat-label">技能總數</span>
        </div>
        <div class="stat-item mastered">
          <span class="stat-value">${stats.nodesByStatus?.mastered || 0}</span>
          <span class="stat-label">已掌握</span>
        </div>
        <div class="stat-item learning">
          <span class="stat-value">${stats.nodesByStatus?.learning || 0}</span>
          <span class="stat-label">學習中</span>
        </div>
      </div>
    `;
  }

  renderCenterSkill() {
    const centerSkill = this.skillData.tree?.center;
    if (!centerSkill) return;

    this.elements.centerSkill.innerHTML = `
      <div class="center-skill-node" data-skill-id="${centerSkill.id}">
        <div class="skill-icon">
          <div class="skill-level-ring level-${centerSkill.level}">
            <span class="skill-emoji">⚡</span>
          </div>
        </div>
        <div class="skill-info">
          <h3 class="skill-name">${centerSkill.name}</h3>
          <p class="skill-description">${centerSkill.description}</p>
          <div class="skill-status status-${centerSkill.status}">
            <span class="status-text">${this.getStatusText(centerSkill.status)}</span>
            <span class="level-indicator">Lv.${centerSkill.level}</span>
          </div>
        </div>
        <div class="skill-achievements">
          ${
            centerSkill.achievements
              ?.map(
                achievement =>
                  `<span class="achievement-badge">${achievement}</span>`
              )
              .join('') || ''
          }
        </div>
      </div>
    `;
  }

  renderBranches() {
    const categories = this.skillData.categories || {};
    const _ring1Skills = this.skillData.tree?.ring1 || [];

    let branchesHTML = '';

    Object.entries(categories).forEach(([categoryId, category]) => {
      const branchSkills = this.getBranchSkills(categoryId);
      const isExpanded = this.state.expandedBranches.has(categoryId);

      branchesHTML += `
        <div class="skill-branch ${isExpanded ? 'expanded' : 'collapsed'}" data-category="${categoryId}">
          <div class="branch-header" data-toggle-branch="${categoryId}">
            <div class="branch-icon">
              <span class="category-emoji">${category.icon}</span>
              <div class="expand-indicator ${isExpanded ? 'expanded' : ''}">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="branch-info">
              <h4 class="branch-name" style="color: ${category.color}">${category.name}</h4>
              <p class="branch-description">${category.description}</p>
              <div class="branch-stats">
                <span class="skills-count">${branchSkills.length} 項技能</span>
                <span class="mastered-count">${branchSkills.filter(s => s.status === 'mastered').length} 已掌握</span>
              </div>
            </div>
          </div>
          
          <div class="branch-content ${isExpanded ? 'expanded' : 'collapsed'}">
            <div class="skills-list">
              ${this.renderBranchSkills(branchSkills)}
            </div>
          </div>
        </div>
      `;
    });

    this.elements.branches.innerHTML = branchesHTML;
  }

  renderBranchSkills(skills) {
    return skills
      .map(
        skill => `
      <div class="skill-item" data-skill-id="${skill.id}">
        <div class="skill-indicator status-${skill.status}"></div>
        <div class="skill-content">
          <h5 class="skill-name">${skill.name}</h5>
          <div class="skill-meta">
            <span class="skill-status">${this.getStatusText(skill.status)}</span>
            <span class="skill-level">Lv.${skill.level}</span>
          </div>
        </div>
        <div class="skill-arrow">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M8 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
      </div>
    `
      )
      .join('');
  }

  getBranchSkills(categoryId) {
    const allSkills = [
      ...(this.skillData.tree?.ring1 || []),
      ...(this.skillData.tree?.ring2 || []),
      ...(this.skillData.tree?.ring3 || []),
    ];

    return allSkills.filter(skill => skill.category === categoryId);
  }

  getSkillNameById(skillId) {
    const allSkills = [
      this.skillData.tree?.center,
      ...(this.skillData.tree?.ring1 || []),
      ...(this.skillData.tree?.ring2 || []),
      ...(this.skillData.tree?.ring3 || []),
    ].filter(Boolean);

    const skill = allSkills.find(s => s.id === skillId);
    return skill ? skill.name : skillId;
  }

  getStatusText(status) {
    const statusMap = {
      mastered: '已掌握',
      available: '可學習',
      learning: '學習中',
      locked: '待解鎖',
    };
    return statusMap[status] || status;
  }

  bindEvents() {
    // 分支展開/收合
    this.elements.branches.addEventListener('click', e => {
      const toggleBtn = e.target.closest('[data-toggle-branch]');
      if (toggleBtn) {
        const categoryId = toggleBtn.dataset.toggleBranch;
        console.log('📱 點擊分支切換按鈕:', categoryId, toggleBtn);
        this.toggleBranch(categoryId);
        return;
      }

      // 技能點擊彈窗
      const skillItem = e.target.closest('.skill-item');
      if (skillItem) {
        const skillId = skillItem.dataset.skillId;
        console.log('📱 點擊技能項目:', skillId);
        this.showSkillModal(skillId);
        return;
      }

      // 除錯：顯示點擊的元素
      console.log('📱 點擊了其他元素:', e.target);
    });

    // 中心技能點擊
    this.elements.centerSkill.addEventListener('click', e => {
      const skillNode = e.target.closest('[data-skill-id]');
      if (skillNode) {
        this.showSkillModal(skillNode.dataset.skillId);
      }
    });
  }

  toggleBranch(categoryId) {
    if (!categoryId) {
      console.warn('⚠️ MobileSkillTree: toggleBranch - 無效的 categoryId');
      return;
    }

    const branchElement = this.container.querySelector(
      `[data-category="${categoryId}"]`
    );
    if (!branchElement) {
      console.warn(
        '⚠️ MobileSkillTree: toggleBranch - 找不到分支元素:',
        categoryId
      );
      return;
    }

    const isCurrentlyExpanded = this.state.expandedBranches.has(categoryId);
    const content = branchElement.querySelector('.branch-content');
    const indicator = branchElement.querySelector('.expand-indicator');

    if (isCurrentlyExpanded) {
      // 收合
      this.state.expandedBranches.delete(categoryId);
      branchElement.classList.remove('expanded');
      branchElement.classList.add('collapsed');
      if (content) {
        content.classList.remove('expanded');
        content.classList.add('collapsed');
      }
    } else {
      // 展開
      this.state.expandedBranches.add(categoryId);
      branchElement.classList.remove('collapsed');
      branchElement.classList.add('expanded');
      if (content) {
        content.classList.remove('collapsed');
        content.classList.add('expanded');
      }
    }

    // 更新展開指示器
    if (indicator) {
      indicator.classList.toggle('expanded', !isCurrentlyExpanded);
    }

    // 設定動畫過渡效果
    if (this.config.enableAnimation && content) {
      content.style.transition = `all ${this.config.animationDuration}ms ease-in-out`;
    }

    console.log(
      '📱 分支切換:',
      categoryId,
      isCurrentlyExpanded ? '收合' : '展開'
    );
    this.emit('branchToggle', { categoryId, expanded: !isCurrentlyExpanded });
  }

  showSkillModal(skillId) {
    if (skillId) {
      this.emit('skillClick', { skillId });
    } else {
      console.warn('⚠️ MobileSkillTree: showSkillModal - 無效的 skillId');
    }
  }

  // 更新技能數據
  updateSkillData(newSkillData) {
    this.skillData = newSkillData;
    this.render();
  }

  // 展開指定分支
  expandBranch(categoryId) {
    this.state.expandedBranches.add(categoryId);
    this.render();
  }

  // 收合所有分支
  collapseAllBranches() {
    this.state.expandedBranches.clear();
    this.render();
  }

  // 事件管理方法
  on(eventName, callback) {
    return this.events.on(eventName, callback);
  }

  off(eventName, callback) {
    return this.events.off(eventName, callback);
  }

  emit(eventName, data) {
    return this.events.emit(eventName, data);
  }

  destroy() {
    this.elements.branches.removeEventListener(
      'click',
      this.boundToggleHandler
    );
    this.elements.centerSkill.removeEventListener(
      'click',
      this.boundCenterHandler
    );
    super.destroy();
  }
}
