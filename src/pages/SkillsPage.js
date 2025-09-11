/**
 * 技能樹頁面組件
 * Step 3.3.1: 整合完整技能樹系統
 */

import { BaseComponent } from '../core/components/BaseComponent.js';
import { PoeStyleSkillTree } from '../components/gaming/SkillTree/PoeStyleSkillTree.js';
import { MobileSkillTree } from '../components/gaming/SkillTree/MobileSkillTree.js';
import { skillsPageConfig } from '../config/pages/skills.config.js';
import skillsDataConfig from '../config/data/skills.data.js';

export class SkillsPage extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this.skillTree = null;
    this.mobileSkillTree = null;
    this.isMobile = false;
    this.isFullscreen = false;
  }

  /**
   * 獲取默認配置
   */
  getDefaultConfig() {
    return {
      title: '技能樹',
      subtitle: '專業技能發展軌跡',
      icon: '🌟',
      enableFullscreen: true,
      skillTreeConfig: {
        // 自定義技能樹配置
        rendering: {
          skillSize: 50,
          skillSpacing: 100,
          connectionWidth: 2,
          gridSize: 1600,
          centerOffset: { x: 800, y: 800 }
        },
        interaction: {
          enableHover: true,
          enableClick: true,
          enableKeyboard: true,
          hoverDelay: 200,
          clickDelay: 150
        }
      }
    };
  }

  /**
   * 渲染頁面 HTML
   */
  async render() {
    const config = this.mergeConfig();
    
    return `
      <div class="skills-page">
        <!-- 頁面頭部 -->
        <header class="skills-header">
          <div class="skills-header-content">
            <h1 class="skills-title">
              <span class="title-icon">${config.icon}</span>
              <span class="title-text">${config.title}</span>
            </h1>
            <p class="skills-subtitle">${config.subtitle}</p>
            
            <!-- 控制面板 - 簡化版 -->
            <div class="skills-controls">
              <button class="control-btn" id="center-btn" title="重置視圖">
                <span class="btn-icon">🎯</span>
              </button>
              <button class="control-btn" id="help-btn" title="操作說明">
                <span class="btn-icon">❓</span>
              </button>
            </div>
          </div>
        </header>

        <!-- 技能樹容器 -->
        <main class="skills-main">
          <!-- 桌面端技能樹 -->
          <div class="skill-tree-wrapper desktop-only" id="desktop-skill-tree-wrapper">
            <div class="skill-tree-container" id="desktop-skill-tree-container">
              <!-- 桌面端 PoeStyleSkillTree 將在此渲染 -->
            </div>
          </div>
          
          <!-- 手機端技能樹 -->
          <div class="mobile-skill-tree-wrapper mobile-only" id="mobile-skill-tree-wrapper">
            <div class="mobile-skill-tree-container" id="mobile-skill-tree-container">
              <!-- 手機端 MobileSkillTree 將在此渲染 -->
            </div>
          </div>
          
          <!-- 載入指示器 -->
          <div class="skill-tree-loading" id="skill-tree-loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">載入技能樹中...</p>
          </div>
        </main>

        <!-- 技能詳情面板 -->
        <aside class="skill-details-panel" id="skill-details-panel">
          <div class="panel-content">
            <h3 class="panel-title">技能詳情</h3>
            <div class="panel-body" id="skill-details-content">
              <p class="hint-text">點擊技能節點查看詳細信息</p>
            </div>
          </div>
        </aside>

        <!-- 操作說明彈窗 -->
        <div class="help-modal" id="help-modal">
          <div class="modal-backdrop" id="help-backdrop"></div>
          <div class="modal-content">
            <header class="modal-header">
              <h3>操作說明</h3>
              <button class="close-btn" id="help-close-btn">✕</button>
            </header>
            <div class="modal-body">
              <div class="help-section">
                <h4>🖱️ 滑鼠操作</h4>
                <ul>
                  <li>拖曳：移動技能樹視圖</li>
                  <li>滾輪：縮放技能樹</li>
                  <li>點擊：選擇技能節點</li>
                  <li>懸停：顯示技能預覽</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>📱 觸控操作</h4>
                <ul>
                  <li>單指拖曳：移動視圖</li>
                  <li>雙指縮放：縮放技能樹</li>
                  <li>點擊：選擇技能節點</li>
                </ul>
              </div>
              <div class="help-section">
                <h4>⌨️ 鍵盤操作</h4>
                <ul>
                  <li>方向鍵：移動視圖</li>
                  <li>Tab：技能節點間導航</li>
                  <li>Enter：選擇當前技能</li>
                  <li>ESC：取消選擇</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 移除返回首頁按鈕 - 使用 NavBar 或漢堡選單即可 -->
      </div>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();
    
    try {
      // 檢測設備類型
      this.detectDevice();
      
      // 初始化技能樹
      await this.initializeSkillTree();
      
      // 綁定UI事件
      this.bindEvents();
      
      console.log('🌟 SkillsPage initialized');
      
    } catch (error) {
      console.error('❌ SkillsPage initialization failed:', error);
      this.showError('技能樹載入失敗');
    }
  }

  /**
   * 檢測設備類型
   */
  detectDevice() {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isMobile = isMobile;
    
    console.log('📱 設備檢測:', isMobile ? '手機端' : '桌面端');
    
    // 添加對應的 CSS 類
    document.body.classList.toggle('mobile-device', isMobile);
    document.body.classList.toggle('desktop-device', !isMobile);
  }

  /**
   * 初始化技能樹組件
   */
  async initializeSkillTree() {
    const loading = document.getElementById('skill-tree-loading');
    
    try {
      // 顯示載入狀態
      loading.style.display = 'flex';
      
      if (this.isMobile) {
        await this.initializeMobileSkillTree();
      } else {
        await this.initializeDesktopSkillTree();
      }
      
      // 隱藏載入狀態
      loading.style.display = 'none';
      
      console.log('✅ SkillTree initialized successfully');
      
    } catch (error) {
      console.error('❌ SkillTree initialization failed:', error);
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">技能樹載入失敗</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      throw error;
    }
  }

  /**
   * 初始化桌面端技能樹
   */
  async initializeDesktopSkillTree() {
    const container = document.getElementById('desktop-skill-tree-container');
    
    if (!container) {
      throw new Error('桌面端技能樹容器不存在');
    }

    // 從 skillsDataConfig 提取技能樹數據
    const skillTreeData = skillsDataConfig.tree || {};
    this.skillsArray = this.extractSkillsFromTree(skillTreeData);
    
    console.log('🖥️ 桌面端 - 提取的技能數據:', this.skillsArray.length, '個技能');
    
    // 使用原本漂亮的 PoeStyleSkillTree
    this.skillTree = new PoeStyleSkillTree(container, {
      skillData: this.skillsArray,
      // 恢復原有的漂亮佈局參數
      centerX: 1000,  
      centerY: 1000,
      nodeSize: 120,      
      subNodeSize: 70,    
      gridSpacing: 250,   
      branchLength: 800   
    });

    // 監聽技能樹事件
    this.setupDesktopSkillTreeEvents();
    
    // 初始化技能樹
    await this.skillTree.init();
    
    console.log('✅ 桌面端 PoeStyleSkillTree 初始化完成');
  }

  /**
   * 初始化手機端技能樹
   */
  async initializeMobileSkillTree() {
    const container = document.getElementById('mobile-skill-tree-container');
    
    if (!container) {
      throw new Error('手機端技能樹容器不存在');
    }

    console.log('📱 手機端 - 初始化簡化版技能樹');
    
    // 建立手機端技能樹
    this.mobileSkillTree = new MobileSkillTree(container, {
      skillData: skillsDataConfig,
      enableAnimation: true
    });

    // 監聽手機端技能樹事件
    this.setupMobileSkillTreeEvents();
    
    // 初始化手機端技能樹
    await this.mobileSkillTree.init();
    
    console.log('✅ 手機端 MobileSkillTree 初始化完成');
  }

  /**
   * 從技能樹配置中提取技能數組
   */
  extractSkillsFromTree(treeData) {
    const skills = [];
    
    // 處理中心節點
    if (treeData.center) {
      skills.push({
        id: treeData.center.id,
        name: treeData.center.name,
        category: treeData.center.category,
        level: treeData.center.level,
        status: treeData.center.status,
        coordinates: treeData.center.coordinates || { q: 0, r: 0 },
        description: treeData.center.description,
        skills: treeData.center.skills || [],
        achievements: treeData.center.achievements || [],
        nextGoal: treeData.center.nextGoal
      });
    }
    
    // 處理其他層級的技能節點
    ['ring1', 'ring2', 'ring3'].forEach((ringName, ringIndex) => {
      const ring = treeData[ringName];
      if (ring && typeof ring === 'object') {
        // 如果 ring 是物件，遍歷其屬性
        Object.values(ring).forEach((skill, skillIndex) => {
          // 生成座標（如果沒有提供）
          const coordinates = skill.coordinates || this.generateCoordinates(ringIndex + 1, skillIndex);
          
          skills.push({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            level: skill.level,
            status: skill.status,
            coordinates: coordinates,
            description: skill.description,
            prerequisites: skill.prerequisites || [],
            skills: skill.skills || [],
            nextSteps: skill.nextSteps || []
          });
        });
      }
    });
    
    console.log('🔍 提取技能數量:', skills.length);
    console.log('🔍 技能範例:', skills.slice(0, 3));
    
    return skills;
  }

  /**
   * 為技能生成座標（六角形佈局）
   */
  generateCoordinates(ring, index) {
    if (ring === 0) return { q: 0, r: 0 };
    
    // 六角形佈局：每層最多 6 * ring 個技能
    const maxSkillsInRing = ring * 6;
    const angleStep = 360 / Math.max(maxSkillsInRing, 6);
    const angle = (index * angleStep) * (Math.PI / 180);
    
    // 六角形座標
    const distance = ring * 2;
    const q = Math.round(distance * Math.cos(angle));
    const r = Math.round(distance * Math.sin(angle) * 2/3);
    
    return { q, r };
  }

  /**
   * 根據技能 ID 查找技能對象（桌面端用）
   */
  findSkillById(skillId) {
    if (!skillId || !this.skillsArray) {
      console.warn('⚠️ 無效的技能 ID 或技能陣列:', skillId);
      return null;
    }

    const skill = this.skillsArray.find(s => s.id === skillId);
    if (!skill) {
      console.warn('⚠️ 找不到技能:', skillId);
      return null;
    }

    return skill;
  }

  /**
   * 根據技能 ID 在配置數據中查找技能對象（手機端用）
   */
  findSkillByIdInData(skillId) {
    if (!skillId || !skillsDataConfig.tree) {
      console.warn('⚠️ 無效的技能 ID 或技能數據:', skillId);
      return null;
    }

    const allSkills = [
      skillsDataConfig.tree.center,
      ...(skillsDataConfig.tree.ring1 || []),
      ...(skillsDataConfig.tree.ring2 || []),
      ...(skillsDataConfig.tree.ring3 || [])
    ].filter(Boolean);
    
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill) {
      console.warn('⚠️ 在配置數據中找不到技能:', skillId);
      return null;
    }

    return skill;
  }

  /**
   * 設置桌面端技能樹事件監聽
   */
  setupDesktopSkillTreeEvents() {
    if (!this.skillTree) return;

    // 技能選擇事件
    this.skillTree.on('skill-selected', (data) => {
      console.log('🖥️ 桌面端 - 技能選擇事件:', data);
      const skill = this.findSkillById(data.skillId);
      this.showSkillDetails(skill);
    });

    // 技能懸停事件
    this.skillTree.on('skill-hover', (data) => {
      console.log('🖥️ 桌面端 - 技能懸停事件:', data);
      if (data.isEnter) {
        const skill = this.findSkillById(data.skillId);
        this.previewSkill(skill);
      }
    });

    // 技能樹初始化完成
    this.skillTree.on('skill-tree-initialized', (data) => {
      console.log(`🌟 桌面端技能樹載入完成: ${data.skillCount} 個技能, ${data.connections} 條連線`);
    });

    // 錯誤處理
    this.skillTree.on('skill-tree-error', (data) => {
      console.error('🚨 桌面端技能樹錯誤:', data.error);
      this.showError('技能樹運行錯誤: ' + data.error.message);
    });
  }

  /**
   * 設置手機端技能樹事件監聽
   */
  setupMobileSkillTreeEvents() {
    if (!this.mobileSkillTree) return;

    // 技能點擊事件
    this.mobileSkillTree.on('skillClick', (event) => {
      console.log('📱 手機端 - 技能點擊事件:', event);
      const skill = this.findSkillByIdInData(event.data.skillId);
      this.showSkillDetails(skill);
    });

    // 分支展開/收合事件
    this.mobileSkillTree.on('branchToggle', (event) => {
      console.log('📱 手機端 - 分支切換:', event.data.categoryId, event.data.expanded ? '展開' : '收合');
    });
  }

  /**
   * 綁定UI事件
   */
  bindEvents() {
    // 重置視圖按鈕
    const centerBtn = document.getElementById('center-btn');
    if (centerBtn) {
      centerBtn.addEventListener('click', () => {
        this.centerView();
      });
    }

    // 說明按鈕
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelp();
      });
    }

    // 說明彈窗關閉
    const helpCloseBtn = document.getElementById('help-close-btn');
    const helpBackdrop = document.getElementById('help-backdrop');
    
    if (helpCloseBtn) {
      helpCloseBtn.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    if (helpBackdrop) {
      helpBackdrop.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    // ESC 鍵關閉說明
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideHelp();
      }
    });
  }

  /**
   * 顯示技能詳情
   */
  showSkillDetails(skill) {
    const detailsContent = document.getElementById('skill-details-content');
    if (!detailsContent) return;

    // 添加安全檢查
    if (!skill || typeof skill !== 'object') {
      console.warn('⚠️ 無效的技能詳情數據:', skill);
      detailsContent.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">技能數據載入失敗</p>
        </div>
      `;
      return;
    }

    const skillName = skill.name || skill.id || '未知技能';
    const skillStatus = skill.status || 'available';
    const skillDescription = skill.description || '暫無描述';
    const skillRequirements = skill.requirements || skill.prerequisites || [];
    const skillProjects = skill.relatedProjects || [];

    detailsContent.innerHTML = `
      <div class="skill-detail">
        <header class="skill-detail-header">
          <div class="skill-detail-title-row">
            <h4 class="skill-name">${skillName}</h4>
            <button class="skill-detail-close" onclick="this.closest('.skill-details-panel').classList.remove('show')">✕</button>
          </div>
          <span class="skill-level">${skillStatus}</span>
        </header>
        
        <div class="skill-detail-body">
          <p class="skill-description">${skillDescription}</p>
          
          ${skillRequirements.length > 0 ? `
            <div class="skill-requirements">
              <h5>前置需求</h5>
              <ul>
                ${skillRequirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${skillProjects.length > 0 ? `
            <div class="skill-projects">
              <h5>相關專案</h5>
              <ul>
                ${skillProjects.map(project => `<li>${project}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${skill.skills && skill.skills.length > 0 ? `
            <div class="skill-details-list">
              <h5>技能詳情</h5>
              <ul>
                ${skill.skills.map(s => `<li>${s.name} - 熟練度: ${s.proficiency}%</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // 顯示側邊欄
    const panel = document.getElementById('skill-details-panel');
    if (panel) {
      panel.classList.add('show');
    }
  }

  /**
   * 預覽技能（懸停時）
   */
  previewSkill(skill) {
    // 添加安全檢查
    if (!skill || typeof skill !== 'object') {
      console.warn('⚠️ 無效的技能數據:', skill);
      return;
    }

    // 可以在這裡添加技能預覽邏輯
    const skillName = skill.name || skill.id || '未知技能';
    console.log('👀 預覽技能:', skillName);
    
    // 可以在未來添加更多預覽功能
    // 例如：顯示簡短的技能提示
  }

  // 移除全螢幕功能，統一介面設計

  /**
   * 重置視圖到中心
   */
  centerView() {
    if (this.skillTree && this.skillTree.viewportController) {
      this.skillTree.viewportController.centerView();
      console.log('🎯 視圖已重置到中心');
    }
  }

  /**
   * 顯示操作說明
   */
  showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  /**
   * 隱藏操作說明
   */
  hideHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * 顯示錯誤訊息
   */
  showError(message) {
    console.error('🚨 SkillsPage Error:', message);
    
    // 可以在這裡添加錯誤提示UI
    const loading = document.getElementById('skill-tree-loading');
    if (loading) {
      loading.innerHTML = `
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          <p class="error-text">${message}</p>
          <button class="retry-btn" onclick="location.reload()">重新載入</button>
        </div>
      `;
      loading.style.display = 'flex';
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    try {
      // 銷毀技能樹組件
      if (this.skillTree) {
        this.skillTree.destroy();
        this.skillTree = null;
      }
      
      // 銷毀視窗控制器
      if (this.viewportController) {
        this.viewportController.destroy();
        this.viewportController = null;
      }

      // 移除事件監聽器
      const buttons = ['center-btn', 'help-btn', 'help-close-btn', 'help-backdrop'];
      buttons.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.removeEventListener('click', this.boundEvents?.[id]);
        }
      });

      // 清理全局事件
      document.removeEventListener('keydown', this.boundEvents?.keydown);

      super.destroy();
      console.log('🌟 SkillsPage destroyed');
      
    } catch (error) {
      console.error('❌ SkillsPage destroy error:', error);
    }
  }
}