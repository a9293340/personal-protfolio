/**
 * SkillTree - 完整技能樹系統主組件
 * 
 * 整合所有技能樹子系統，提供完整的流亡闇道風格技能樹體驗：
 * - 六角形網格座標系統 (Step 2.1.2)
 * - 配置驅動的技能數據 (Step 2.1.3)
 * - 完整的狀態管理 (Step 2.1.4) 
 * - 動畫控制系統 (Step 2.1.4)
 * - 響應式適配系統 (Step 2.1.5)
 * - 視窗控制系統 (Step 2.1.5)
 * 
 * @author Claude
 * @version 2.1-integrated
 */

import { EventManager } from '../../../core/events/EventManager.js';
import SkillTreeStateManager from './SkillStateManager.js';
import SkillTreeAnimationController from './SkillAnimationController.js';
import SkillTreeViewportController from './SkillTreeViewportController.js';
import SkillTreeResponsiveAdapter from './SkillTreeResponsiveAdapter.js';

/**
 * 技能樹主配置
 */
export const SkillTreeConfig = {
  // 渲染配置
  rendering: {
    skillSize: 60,
    skillSpacing: 120,
    connectionWidth: 2,
    gridSize: 1000,
    centerOffset: { x: 500, y: 500 }
  },
  
  // 六角形網格配置
  hexGrid: {
    size: 30, // 六角形半徑
    spacing: 120, // 六角形間距
    rings: 3, // 網格環數
    orientation: 'pointy-top' // 尖頂向上
  },
  
  // 交互配置
  interaction: {
    enableHover: true,
    enableClick: true,
    enableKeyboard: true,
    hoverDelay: 200,
    clickDelay: 150
  },
  
  // 動畫配置
  animation: {
    enableAnimations: true,
    transitionDuration: 600,
    stateChangeDuration: 400,
    connectionDuration: 300
  }
};

export class SkillTree extends EventManager {
  constructor(container, config = {}) {
    super();
    
    this.container = container;
    this.config = { ...SkillTreeConfig, ...config };
    
    // 子系統組件
    this.stateManager = null;
    this.animationController = null;
    this.viewportController = null;
    this.responsiveAdapter = null;
    
    // 渲染相關
    this.skillElements = new Map();
    this.connectionElements = new Map();
    this.skillData = null;
    
    // 狀態追蹤
    this.isInitialized = false;
    this.isDestroying = false;
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化技能樹系統
   */
  async init() {
    try {
      console.log('SkillTree: 開始初始化完整技能樹系統');
      
      // 1. 設置容器
      this.setupContainer();
      
      // 2. 載入技能數據
      await this.loadSkillData();
      
      // 3. 初始化子系統
      await this.initializeSubsystems();
      
      // 4. 渲染技能樹
      this.renderSkillTree();
      
      // 5. 綁定事件
      this.bindEvents();
      
      // 6. 標記初始化完成
      this.isInitialized = true;
      
      console.log('SkillTree: 技能樹系統初始化完成');
      this.emit('skill-tree-initialized', {
        skillCount: this.skillData?.length || 0,
        connections: this.connectionElements.size
      });
      
    } catch (error) {
      console.error('SkillTree: 初始化失敗', error);
      this.emit('skill-tree-error', { error, phase: 'initialization' });
    }
  }
  
  /**
   * 設置容器
   */
  setupContainer() {
    if (!this.container) {
      throw new Error('SkillTree: 容器元素不存在');
    }
    
    // 設置容器基礎樣式
    this.container.classList.add('skill-tree-container');
    this.container.style.position = 'relative';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.overflow = 'hidden';
    this.container.style.userSelect = 'none';
    
    // 創建內容容器
    this.contentContainer = document.createElement('div');
    this.contentContainer.className = 'skill-tree-content';
    this.contentContainer.style.position = 'absolute';
    this.contentContainer.style.top = '0';
    this.contentContainer.style.left = '0';
    this.contentContainer.style.transformOrigin = '0 0';
    this.contentContainer.style.willChange = 'transform';
    
    // 創建連接線層
    this.connectionLayer = document.createElement('div');
    this.connectionLayer.className = 'skill-connection-layer';
    this.connectionLayer.style.position = 'absolute';
    this.connectionLayer.style.top = '0';
    this.connectionLayer.style.left = '0';
    this.connectionLayer.style.width = '100%';
    this.connectionLayer.style.height = '100%';
    this.connectionLayer.style.pointerEvents = 'none';
    this.connectionLayer.style.zIndex = '1';
    
    // 創建技能節點層
    this.skillLayer = document.createElement('div');
    this.skillLayer.className = 'skill-node-layer';
    this.skillLayer.style.position = 'absolute';
    this.skillLayer.style.top = '0';
    this.skillLayer.style.left = '0';
    this.skillLayer.style.width = '100%';
    this.skillLayer.style.height = '100%';
    this.skillLayer.style.zIndex = '2';
    
    // 組裝結構
    this.contentContainer.appendChild(this.connectionLayer);
    this.contentContainer.appendChild(this.skillLayer);
    this.container.appendChild(this.contentContainer);
  }
  
  /**
   * 載入技能數據
   */
  async loadSkillData() {
    try {
      console.log('SkillTree: 載入技能數據');
      
      // 動態導入技能數據配置
      const skillsDataModule = await import('../../../config/data/skills.data.js');
      this.skillData = skillsDataModule.skillsConfig?.skills || skillsDataModule.default?.skills;
      
      if (!this.skillData || !Array.isArray(this.skillData)) {
        throw new Error('技能數據格式無效或為空');
      }
      
      console.log(`SkillTree: 成功載入 ${this.skillData.length} 個技能配置`);
      
    } catch (error) {
      console.warn('SkillTree: 無法載入配置文件，使用測試數據', error);
      
      // 使用測試數據作為後備
      this.skillData = this.generateTestSkillData();
    }
  }
  
  /**
   * 生成測試技能數據
   */
  generateTestSkillData() {
    return [
      // 中心技能
      {
        id: 'programming-core',
        name: '程式設計核心',
        description: '程式設計的基礎核心技能',
        branch: 'core',
        position: { ring: 0, angle: 0, x: 0, y: 0 },
        prerequisites: [],
        level: 5,
        experience: 100
      },
      
      // Ring 1 - 基礎技能 (6個，每60度一個)
      {
        id: 'html-fundamentals',
        name: 'HTML 基礎',
        description: '網頁標記語言基礎',
        branch: 'frontend',
        position: { ring: 1, angle: 0, x: 0, y: -120 },
        prerequisites: ['programming-core'],
        level: 4,
        experience: 80
      },
      {
        id: 'css-fundamentals', 
        name: 'CSS 基礎',
        description: '網頁樣式設計基礎',
        branch: 'frontend',
        position: { ring: 1, angle: 60, x: 104, y: -60 },
        prerequisites: ['programming-core'],
        level: 4,
        experience: 75
      },
      {
        id: 'javascript-fundamentals',
        name: 'JavaScript 基礎',
        description: '動態網頁程式設計',
        branch: 'frontend',
        position: { ring: 1, angle: 120, x: 104, y: 60 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 60
      },
      {
        id: 'backend-fundamentals',
        name: '後端開發基礎',
        description: '伺服器端程式設計基礎',
        branch: 'backend',
        position: { ring: 1, angle: 180, x: 0, y: 120 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 65
      },
      {
        id: 'database-fundamentals',
        name: '資料庫基礎',
        description: '數據存儲與管理基礎',
        branch: 'database',
        position: { ring: 1, angle: 240, x: -104, y: 60 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 55
      },
      {
        id: 'devops-fundamentals',
        name: 'DevOps 基礎',
        description: '開發運維基礎技能',
        branch: 'devops',
        position: { ring: 1, angle: 300, x: -104, y: -60 },
        prerequisites: ['programming-core'],
        level: 2,
        experience: 40
      },
      
      // Ring 2 - 進階技能
      {
        id: 'react-framework',
        name: 'React 框架',
        description: '現代前端框架開發',
        branch: 'frontend',
        position: { ring: 2, angle: 30, x: 156, y: -90 },
        prerequisites: ['html-fundamentals', 'css-fundamentals', 'javascript-fundamentals'],
        level: 2,
        experience: 30
      },
      {
        id: 'nodejs-runtime',
        name: 'Node.js 運行時',
        description: '服務器端 JavaScript 運行環境',
        branch: 'backend',
        position: { ring: 2, angle: 150, x: 156, y: 90 },
        prerequisites: ['javascript-fundamentals', 'backend-fundamentals'],
        level: 2,
        experience: 35
      },
      {
        id: 'postgresql-database',
        name: 'PostgreSQL 數據庫',
        description: '高性能關聯式數據庫',
        branch: 'database',
        position: { ring: 2, angle: 210, x: 0, y: 180 },
        prerequisites: ['database-fundamentals'],
        level: 2,
        experience: 25
      },
      {
        id: 'docker-containerization',
        name: 'Docker 容器化',
        description: '應用容器化部署技術',
        branch: 'devops',
        position: { ring: 2, angle: 270, x: -156, y: 90 },
        prerequisites: ['devops-fundamentals'],
        level: 1,
        experience: 15
      },
      {
        id: 'typescript-language',
        name: 'TypeScript 語言',
        description: '帶類型的 JavaScript 超集',
        branch: 'frontend',
        position: { ring: 2, angle: 330, x: -156, y: -90 },
        prerequisites: ['javascript-fundamentals'],
        level: 1,
        experience: 20
      },
      
      // Ring 3 - 專精技能
      {
        id: 'nextjs-fullstack',
        name: 'Next.js 全端框架',
        description: '現代全端應用開發框架',
        branch: 'frontend',
        position: { ring: 3, angle: 0, x: 0, y: -240 },
        prerequisites: ['react-framework', 'nodejs-runtime'],
        level: 0,
        experience: 0
      },
      {
        id: 'graphql-api',
        name: 'GraphQL API',
        description: '現代 API 查詢語言',
        branch: 'backend',
        position: { ring: 3, angle: 120, x: 208, y: 120 },
        prerequisites: ['nodejs-runtime', 'postgresql-database'],
        level: 0,
        experience: 0
      },
      {
        id: 'kubernetes-orchestration',
        name: 'Kubernetes 編排',
        description: '容器編排和管理平台',
        branch: 'devops',
        position: { ring: 3, angle: 240, x: -208, y: 120 },
        prerequisites: ['docker-containerization'],
        level: 0,
        experience: 0
      }
    ];
  }
  
  /**
   * 初始化子系統
   */
  async initializeSubsystems() {
    console.log('SkillTree: 初始化子系統');
    
    // 1. 狀態管理器
    this.stateManager = new SkillTreeStateManager(this.skillData);
    
    // 2. 動畫控制器
    this.animationController = new SkillTreeAnimationController(
      this.container, 
      this.stateManager
    );
    
    // 3. 視窗控制器
    this.viewportController = new SkillTreeViewportController(this.container);
    
    // 4. 響應式適配器
    this.responsiveAdapter = new SkillTreeResponsiveAdapter(this.container);
    
    // 等待所有子系統初始化完成
    await Promise.all([
      this.waitForSubsystemReady(this.stateManager, 'state-manager-initialized'),
      this.waitForSubsystemReady(this.animationController, 'animation-controller-ready'),
      this.waitForSubsystemReady(this.responsiveAdapter, 'responsive-adapter-ready')
    ]);
    
    console.log('SkillTree: 所有子系統初始化完成');
  }
  
  /**
   * 等待子系統準備就緒
   */
  waitForSubsystemReady(subsystem, eventName) {
    return new Promise((resolve) => {
      if (subsystem.state?.initialized) {
        resolve();
        return;
      }
      
      const timeout = setTimeout(() => {
        console.warn(`SkillTree: 子系統 ${eventName} 初始化超時`);
        resolve();
      }, 5000);
      
      subsystem.once(eventName, () => {
        clearTimeout(timeout);
        resolve();
      });
      
      // 如果子系統沒有發送事件，短時間後直接解決
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, 1000);
    });
  }
  
  /**
   * 渲染技能樹
   */
  renderSkillTree() {
    console.log('SkillTree: 開始渲染技能樹');
    
    // 1. 清除現有內容
    this.clearSkillTree();
    
    // 2. 渲染技能節點
    this.renderSkillNodes();
    
    // 3. 渲染連接線
    this.renderConnections();
    
    // 4. 應用響應式佈局
    this.applyResponsiveLayout();
    
    console.log(`SkillTree: 渲染完成 - ${this.skillElements.size} 個技能，${this.connectionElements.size} 條連接線`);
  }
  
  /**
   * 渲染技能節點
   */
  renderSkillNodes() {
    const centerX = this.config.rendering.centerOffset.x;
    const centerY = this.config.rendering.centerOffset.y;
    
    this.skillData.forEach(skill => {
      const skillElement = this.createSkillElement(skill);
      
      // 設置位置
      const x = centerX + skill.position.x;
      const y = centerY + skill.position.y;
      
      skillElement.style.left = `${x - this.config.rendering.skillSize / 2}px`;
      skillElement.style.top = `${y - this.config.rendering.skillSize / 2}px`;
      
      // 添加到技能層
      this.skillLayer.appendChild(skillElement);
      this.skillElements.set(skill.id, skillElement);
    });
  }
  
  /**
   * 創建技能元素
   */
  createSkillElement(skill) {
    const element = document.createElement('div');
    element.className = 'skill-node';
    element.id = skill.id;
    element.dataset.skillId = skill.id;
    element.dataset.branch = skill.branch;
    element.dataset.ring = skill.position.ring;
    
    // 設置基礎樣式
    element.style.position = 'absolute';
    element.style.width = `${this.config.rendering.skillSize}px`;
    element.style.height = `${this.config.rendering.skillSize}px`;
    element.style.borderRadius = '50%';
    element.style.border = '3px solid #555';
    element.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1), rgba(0,0,0,0.3))';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.fontSize = '12px';
    element.style.fontWeight = 'bold';
    element.style.textAlign = 'center';
    element.style.color = 'white';
    element.style.cursor = 'pointer';
    element.style.transition = 'all 0.3s ease';
    element.style.userSelect = 'none';
    element.style.zIndex = '10';
    
    // 設置技能名稱
    const nameElement = document.createElement('span');
    nameElement.textContent = skill.name;
    nameElement.style.fontSize = '10px';
    nameElement.style.lineHeight = '1.2';
    nameElement.style.padding = '4px';
    element.appendChild(nameElement);
    
    // 獲取並應用初始狀態
    if (this.stateManager) {
      const status = this.stateManager.getSkillStatus(skill.id);
      this.applySkillStatus(element, status);
    }
    
    return element;
  }
  
  /**
   * 應用技能狀態樣式
   */
  applySkillStatus(element, status) {
    // 移除舊狀態類
    element.classList.remove('skill-status-locked', 'skill-status-available', 'skill-status-learning', 'skill-status-mastered');
    
    // 添加新狀態類
    element.classList.add(`skill-status-${status}`);
    
    // 應用狀態樣式
    switch (status) {
      case 'mastered':
        element.style.borderColor = '#f4d03f';
        element.style.opacity = '1.0';
        element.style.boxShadow = '0 0 20px rgba(244, 208, 63, 0.6)';
        break;
      case 'available':
        element.style.borderColor = '#3498db';
        element.style.opacity = '0.8';
        element.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.4)';
        break;
      case 'learning':
        element.style.borderColor = '#2ecc71';
        element.style.opacity = '0.7';
        element.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.4)';
        break;
      case 'locked':
      default:
        element.style.borderColor = '#555';
        element.style.opacity = '0.4';
        element.style.boxShadow = 'none';
        break;
    }
  }
  
  /**
   * 渲染連接線
   */
  renderConnections() {
    this.skillData.forEach(skill => {
      if (skill.prerequisites && skill.prerequisites.length > 0) {
        skill.prerequisites.forEach(prereqId => {
          this.createConnection(prereqId, skill.id);
        });
      }
    });
  }
  
  /**
   * 創建連接線
   */
  createConnection(fromSkillId, toSkillId) {
    const fromSkill = this.skillData.find(s => s.id === fromSkillId);
    const toSkill = this.skillData.find(s => s.id === toSkillId);
    
    if (!fromSkill || !toSkill) return;
    
    const centerX = this.config.rendering.centerOffset.x;
    const centerY = this.config.rendering.centerOffset.y;
    
    const x1 = centerX + fromSkill.position.x;
    const y1 = centerY + fromSkill.position.y;
    const x2 = centerX + toSkill.position.x;
    const y2 = centerY + toSkill.position.y;
    
    const connection = document.createElement('div');
    connection.className = 'skill-connection';
    connection.dataset.from = fromSkillId;
    connection.dataset.to = toSkillId;
    
    // 計算連接線
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // 設置樣式
    connection.style.position = 'absolute';
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    connection.style.width = `${length}px`;
    connection.style.height = `${this.config.rendering.connectionWidth}px`;
    connection.style.background = 'linear-gradient(90deg, transparent, #3498db, transparent)';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.transformOrigin = '0 50%';
    connection.style.opacity = '0.3';
    connection.style.pointerEvents = 'none';
    connection.style.zIndex = '1';
    
    this.connectionLayer.appendChild(connection);
    this.connectionElements.set(`${fromSkillId}-${toSkillId}`, connection);
  }
  
  /**
   * 應用響應式佈局
   */
  applyResponsiveLayout() {
    if (this.responsiveAdapter) {
      // 掃描技能元素
      this.responsiveAdapter.scanSkillElements?.();
      
      // 應用當前設備的佈局
      const deviceType = this.responsiveAdapter.device?.type || 'desktop';
      const layoutConfig = this.responsiveAdapter.config?.layouts[deviceType];
      
      if (layoutConfig) {
        this.responsiveAdapter.applyLayout(layoutConfig, false);
      }
    }
  }
  
  /**
   * 綁定事件
   */
  bindEvents() {
    // 技能節點事件
    this.bindSkillNodeEvents();
    
    // 子系統事件
    this.bindSubsystemEvents();
    
    // 容器事件
    this.bindContainerEvents();
  }
  
  /**
   * 綁定技能節點事件
   */
  bindSkillNodeEvents() {
    this.skillElements.forEach((element, skillId) => {
      // 點擊事件
      element.addEventListener('click', (event) => {
        this.handleSkillClick(skillId, event);
      });
      
      // 懸停事件
      if (this.config.interaction.enableHover) {
        element.addEventListener('mouseenter', (event) => {
          this.handleSkillHover(skillId, event, true);
        });
        
        element.addEventListener('mouseleave', (event) => {
          this.handleSkillHover(skillId, event, false);
        });
      }
      
      // 鍵盤事件
      if (this.config.interaction.enableKeyboard) {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (event) => {
          this.handleSkillKeydown(skillId, event);
        });
      }
    });
  }
  
  /**
   * 綁定子系統事件
   */
  bindSubsystemEvents() {
    // 狀態管理器事件
    if (this.stateManager) {
      this.stateManager.on('skill-status-changed', (event) => {
        const element = this.skillElements.get(event.data.skillId);
        if (element) {
          this.applySkillStatus(element, event.data.newStatus);
        }
      });
    }
    
    // 響應式適配器事件
    if (this.responsiveAdapter) {
      this.responsiveAdapter.on('layout-applied', (event) => {
        console.log(`SkillTree: 佈局切換到 ${event.data.mode}`);
        this.emit('layout-changed', event.data);
      });
      
      this.responsiveAdapter.on('skill-tap', (event) => {
        this.handleSkillClick(event.data.skillId, event);
      });
    }
  }
  
  /**
   * 綁定容器事件
   */
  bindContainerEvents() {
    // 防止右鍵選單
    this.container.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }
  
  /**
   * 處理技能點擊
   */
  handleSkillClick(skillId, event) {
    if (!this.isInitialized || this.isDestroying) return;
    
    console.log(`SkillTree: 技能點擊 - ${skillId}`);
    
    const skill = this.skillData.find(s => s.id === skillId);
    if (!skill) return;
    
    // 獲取當前狀態
    const currentStatus = this.stateManager?.getSkillStatus(skillId);
    
    // 發送點擊事件
    this.emit('skill-clicked', {
      skillId,
      skill,
      currentStatus,
      element: this.skillElements.get(skillId),
      event
    });
    
    // 如果有狀態管理器，嘗試切換狀態 (測試用途)
    if (this.stateManager?.toggleSkillStatus) {
      this.stateManager.toggleSkillStatus(skillId);
    }
  }
  
  /**
   * 處理技能懸停
   */
  handleSkillHover(skillId, event, isEnter) {
    if (!this.isInitialized || this.isDestroying) return;
    
    const element = this.skillElements.get(skillId);
    if (!element) return;
    
    if (isEnter) {
      element.style.transform = 'scale(1.1)';
      element.style.zIndex = '20';
      
      // 高亮相關連接線
      this.highlightConnections(skillId, true);
      
    } else {
      element.style.transform = 'scale(1)';
      element.style.zIndex = '10';
      
      // 取消高亮
      this.highlightConnections(skillId, false);
    }
    
    this.emit('skill-hover', {
      skillId,
      isEnter,
      element,
      event
    });
  }
  
  /**
   * 處理技能鍵盤事件
   */
  handleSkillKeydown(skillId, event) {
    switch (event.code) {
      case 'Enter':
      case 'Space':
        event.preventDefault();
        this.handleSkillClick(skillId, event);
        break;
    }
  }
  
  /**
   * 高亮連接線
   */
  highlightConnections(skillId, highlight) {
    // 高亮從該技能出發的連接線
    this.connectionElements.forEach((element, connectionId) => {
      if (connectionId.startsWith(skillId + '-') || connectionId.endsWith('-' + skillId)) {
        element.style.opacity = highlight ? '0.8' : '0.3';
        element.style.filter = highlight ? 'drop-shadow(0 0 5px #3498db)' : 'none';
      }
    });
  }
  
  /**
   * 清除技能樹
   */
  clearSkillTree() {
    // 清除技能節點
    this.skillElements.clear();
    this.skillLayer.innerHTML = '';
    
    // 清除連接線
    this.connectionElements.clear();
    this.connectionLayer.innerHTML = '';
  }
  
  /**
   * 獲取技能樹狀態
   */
  getSkillTreeState() {
    return {
      isInitialized: this.isInitialized,
      skillCount: this.skillElements.size,
      connectionCount: this.connectionElements.size,
      stateManager: this.stateManager?.getStatusStats(),
      viewport: this.viewportController?.getViewportState(),
      responsive: this.responsiveAdapter?.getAdapterState()
    };
  }
  
  /**
   * 重置技能樹
   */
  reset() {
    console.log('SkillTree: 重置技能樹');
    
    // 重置狀態管理器
    if (this.stateManager?.resetAllStates) {
      this.stateManager.resetAllStates();
    }
    
    // 重置視窗
    if (this.viewportController?.resetViewport) {
      this.viewportController.resetViewport();
    }
    
    // 重新渲染
    this.renderSkillTree();
    
    this.emit('skill-tree-reset');
  }
  
  /**
   * 銷毀技能樹
   */
  destroy() {
    if (this.isDestroying) return;
    
    console.log('SkillTree: 開始銷毀技能樹系統');
    this.isDestroying = true;
    
    // 銷毀子系統
    if (this.stateManager?.destroy) {
      this.stateManager.destroy();
    }
    
    if (this.animationController?.destroy) {
      this.animationController.destroy();
    }
    
    if (this.viewportController?.destroy) {
      this.viewportController.destroy();
    }
    
    if (this.responsiveAdapter?.destroy) {
      this.responsiveAdapter.destroy();
    }
    
    // 清除 DOM
    this.clearSkillTree();
    
    // 移除事件監聽器
    this.removeAllListeners();
    
    // 清除引用
    this.container = null;
    this.skillData = null;
    
    console.log('SkillTree: 技能樹系統已銷毀');
  }
}

export default SkillTree;