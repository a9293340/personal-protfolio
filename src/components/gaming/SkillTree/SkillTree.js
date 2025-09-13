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
import SkillTreeStateManager from './SkillTreeStateManager.js';
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
    gridSize: 2000,
    centerOffset: { x: 1000, y: 1000 },
  },

  // 六角形網格配置
  hexGrid: {
    size: 30, // 六角形半徑
    spacing: 120, // 六角形間距
    rings: 3, // 網格環數
    orientation: 'pointy-top', // 尖頂向上
  },

  // 交互配置
  interaction: {
    enableHover: true,
    enableClick: true,
    enableKeyboard: true,
    hoverDelay: 200,
    clickDelay: 150,
  },

  // 動畫配置
  animation: {
    enableAnimations: true,
    transitionDuration: 600,
    stateChangeDuration: 400,
    connectionDuration: 300,
  },
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

      // 6. 響應式適配器重新掃描元素並應用佈局
      if (this.responsiveAdapter) {
        const elementCount = this.responsiveAdapter.scanSkillElements();
        console.log(
          `SkillTree: 響應式適配器重新掃描完成，找到 ${elementCount} 個技能元素`
        );

        // 強制檢測當前設備類型並應用對應佈局
        const screenWidth = window.innerWidth;
        let deviceType = 'desktop';
        if (screenWidth < 768) deviceType = 'mobile';
        else if (screenWidth < 1200) deviceType = 'tablet';

        console.log(`SkillTree: 強制檢測設備類型`, {
          screenWidth,
          deviceType,
          currentDevice: this.responsiveAdapter.state?.currentDevice,
        });

        // 更新適配器的設備狀態
        this.responsiveAdapter.state.currentDevice = deviceType;

        // 根據設備類型應用佈局
        const layoutConfig = this.responsiveAdapter.config?.layouts[deviceType];
        if (layoutConfig) {
          setTimeout(() => {
            console.log(`SkillTree: 應用 ${deviceType} 佈局配置`, layoutConfig);
            this.responsiveAdapter.applyLayout(layoutConfig, false);
          }, 200);
        }
      }

      // 7. 標記初始化完成
      this.isInitialized = true;

      console.log('SkillTree: 技能樹系統初始化完成');
      this.emit('skill-tree-initialized', {
        skillCount: this.skillData?.length || 0,
        connections: this.connectionElements.size,
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
    this.contentContainer.style.width = `${this.config.rendering.gridSize}px`;
    this.contentContainer.style.height = `${this.config.rendering.gridSize}px`;
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

      // 優先使用構造函數傳入的技能數據
      if (this.config.skillData && Array.isArray(this.config.skillData)) {
        this.skillData = this.config.skillData;
        console.log(
          'SkillTree: 使用傳入的技能數據',
          this.skillData.length,
          '個技能'
        );
        return;
      }

      // 如果沒有傳入數據，則動態載入默認配置
      const skillsDataModule = await import(
        '../../../config/data/skills.data.js'
      );
      const skillsConfig =
        skillsDataModule.skillsDataConfig || skillsDataModule.default;

      if (!skillsConfig || !skillsConfig.tree) {
        throw new Error('技能數據格式無效或為空');
      }

      // 將分層技能數據合併為平面陣列
      this.skillData = [];
      const treeData = skillsConfig.tree;

      // 合併所有層級的技能
      if (treeData.center) this.skillData.push(treeData.center);
      if (treeData.ring1 && Array.isArray(treeData.ring1)) {
        this.skillData.push(...treeData.ring1);
      }
      if (treeData.ring2 && Array.isArray(treeData.ring2)) {
        this.skillData.push(...treeData.ring2);
      }
      if (treeData.ring3 && Array.isArray(treeData.ring3)) {
        this.skillData.push(...treeData.ring3);
      }

      if (this.skillData.length === 0) {
        throw new Error('沒有找到有效的技能數據');
      }

      console.log(`SkillTree: 成功載入 ${this.skillData.length} 個技能配置`);

      // 調試：顯示載入的技能資訊
      console.log(
        '載入的技能清單:',
        this.skillData.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          coordinates: skill.coordinates,
          hasCoordinates: !!skill.coordinates,
        }))
      );
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
        experience: 100,
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
        experience: 80,
      },
      {
        id: 'css-fundamentals',
        name: 'CSS 基礎',
        description: '網頁樣式設計基礎',
        branch: 'frontend',
        position: { ring: 1, angle: 60, x: 104, y: -60 },
        prerequisites: ['programming-core'],
        level: 4,
        experience: 75,
      },
      {
        id: 'javascript-fundamentals',
        name: 'JavaScript 基礎',
        description: '動態網頁程式設計',
        branch: 'frontend',
        position: { ring: 1, angle: 120, x: 104, y: 60 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 60,
      },
      {
        id: 'backend-fundamentals',
        name: '後端開發基礎',
        description: '伺服器端程式設計基礎',
        branch: 'backend',
        position: { ring: 1, angle: 180, x: 0, y: 120 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 65,
      },
      {
        id: 'database-fundamentals',
        name: '資料庫基礎',
        description: '數據存儲與管理基礎',
        branch: 'database',
        position: { ring: 1, angle: 240, x: -104, y: 60 },
        prerequisites: ['programming-core'],
        level: 3,
        experience: 55,
      },
      {
        id: 'devops-fundamentals',
        name: 'DevOps 基礎',
        description: '開發運維基礎技能',
        branch: 'devops',
        position: { ring: 1, angle: 300, x: -104, y: -60 },
        prerequisites: ['programming-core'],
        level: 2,
        experience: 40,
      },

      // Ring 2 - 進階技能
      {
        id: 'react-framework',
        name: 'React 框架',
        description: '現代前端框架開發',
        branch: 'frontend',
        position: { ring: 2, angle: 30, x: 156, y: -90 },
        prerequisites: [
          'html-fundamentals',
          'css-fundamentals',
          'javascript-fundamentals',
        ],
        level: 2,
        experience: 30,
      },
      {
        id: 'nodejs-runtime',
        name: 'Node.js 運行時',
        description: '服務器端 JavaScript 運行環境',
        branch: 'backend',
        position: { ring: 2, angle: 150, x: 156, y: 90 },
        prerequisites: ['javascript-fundamentals', 'backend-fundamentals'],
        level: 2,
        experience: 35,
      },
      {
        id: 'postgresql-database',
        name: 'PostgreSQL 數據庫',
        description: '高性能關聯式數據庫',
        branch: 'database',
        position: { ring: 2, angle: 210, x: 0, y: 180 },
        prerequisites: ['database-fundamentals'],
        level: 2,
        experience: 25,
      },
      {
        id: 'docker-containerization',
        name: 'Docker 容器化',
        description: '應用容器化部署技術',
        branch: 'devops',
        position: { ring: 2, angle: 270, x: -156, y: 90 },
        prerequisites: ['devops-fundamentals'],
        level: 1,
        experience: 15,
      },
      {
        id: 'typescript-language',
        name: 'TypeScript 語言',
        description: '帶類型的 JavaScript 超集',
        branch: 'frontend',
        position: { ring: 2, angle: 330, x: -156, y: -90 },
        prerequisites: ['javascript-fundamentals'],
        level: 1,
        experience: 20,
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
        experience: 0,
      },
      {
        id: 'graphql-api',
        name: 'GraphQL API',
        description: '現代 API 查詢語言',
        branch: 'backend',
        position: { ring: 3, angle: 120, x: 208, y: 120 },
        prerequisites: ['nodejs-runtime', 'postgresql-database'],
        level: 0,
        experience: 0,
      },
      {
        id: 'kubernetes-orchestration',
        name: 'Kubernetes 編排',
        description: '容器編排和管理平台',
        branch: 'devops',
        position: { ring: 3, angle: 240, x: -208, y: 120 },
        prerequisites: ['docker-containerization'],
        level: 0,
        experience: 0,
      },
    ];
  }

  /**
   * 初始化子系統
   */
  async initializeSubsystems() {
    console.log('SkillTree: 初始化子系統');

    // 1. 狀態管理器
    this.stateManager = new SkillTreeStateManager();

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
      this.waitForSubsystemReady(
        this.stateManager,
        'state-manager-initialized'
      ),
      this.waitForSubsystemReady(
        this.animationController,
        'animation-controller-ready'
      ),
      this.waitForSubsystemReady(
        this.responsiveAdapter,
        'responsive-adapter-ready'
      ),
    ]);

    console.log('SkillTree: 所有子系統初始化完成');
  }

  /**
   * 等待子系統準備就緒
   */
  waitForSubsystemReady(subsystem, eventName) {
    return new Promise(resolve => {
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

    console.log(
      `SkillTree: 渲染完成 - ${this.skillElements.size} 個技能，${this.connectionElements.size} 條連接線`
    );
  }

  /**
   * 渲染技能節點 - 流亡黯道風格放射狀佈局
   */
  renderSkillNodes() {
    const centerX = this.config.rendering.centerOffset.x;
    const centerY = this.config.rendering.centerOffset.y;

    // 重新組織技能數據為分支結構
    const skillBranches = this.organizePoeStyleBranches();

    console.log('🌳 PoE風格技能樹分支:', skillBranches);

    // 渲染中心節點
    this.renderCenterNode(centerX, centerY);

    // 渲染六個主要分支
    skillBranches.forEach((branch, branchIndex) => {
      this.renderSkillBranch(branch, branchIndex, centerX, centerY);
    });
  }

  /**
   * 組織技能為PoE風格分支結構
   */
  organizePoeStyleBranches() {
    const branches = {
      frontend: { name: '前端開發', angle: 0, skills: [], color: '#e74c3c' },
      architecture: {
        name: '系統架構',
        angle: 60,
        skills: [],
        color: '#34495e',
      },
      ai: { name: 'AI工程', angle: 120, skills: [], color: '#f39c12' },
      devops: { name: 'DevOps', angle: 180, skills: [], color: '#9b59b6' },
      database: { name: '資料庫', angle: 240, skills: [], color: '#2ecc71' },
      backend: { name: '後端開發', angle: 300, skills: [], color: '#3498db' },
    };

    // 將技能分配到對應分支
    this.skillData.forEach(skill => {
      if (skill.id === 'backend-engineer-core') {
        // 跳過中心節點
        return;
      }

      const category = skill.category || 'backend';
      if (branches[category]) {
        branches[category].skills.push(skill);
      } else {
        // 如果沒有對應分類，放入後端分支
        branches.backend.skills.push(skill);
      }
    });

    return Object.values(branches);
  }

  /**
   * 渲染中心節點
   */
  renderCenterNode(centerX, centerY) {
    const centerSkill = this.skillData.find(
      skill => skill.id === 'backend-engineer-core'
    );
    if (!centerSkill) return;

    const centerElement = this.createMainSkillElement(centerSkill);

    // 中心節點稍大一些
    const centerSize = this.config.rendering.skillSize * 1.5;
    centerElement.style.width = `${centerSize}px`;
    centerElement.style.height = `${centerSize}px`;
    centerElement.style.left = `${centerX - centerSize / 2}px`;
    centerElement.style.top = `${centerY - centerSize / 2}px`;
    centerElement.style.zIndex = '20';

    // 特殊的中心樣式
    centerElement.style.border = '4px solid #d4af37';
    centerElement.style.boxShadow =
      '0 0 30px rgba(212, 175, 55, 0.8), inset 0 0 15px rgba(212, 175, 55, 0.3)';

    this.skillLayer.appendChild(centerElement);
    this.skillElements.set(centerSkill.id, centerElement);

    // 渲染中心節點的子技能
    if (centerSkill.skills && centerSkill.skills.length > 0) {
      this.renderCenterSubSkills(centerSkill, centerX, centerY);
    }
  }

  /**
   * 渲染技能分支
   */
  renderSkillBranch(branch, _branchIndex, centerX, centerY) {
    if (!branch.skills.length) return;

    const angle = branch.angle * (Math.PI / 180); // 轉為弧度
    const baseDistance = 150; // 基礎距離

    branch.skills.forEach((skill, skillIndex) => {
      // 計算分支中的位置
      const distance = baseDistance + skillIndex * 120; // 沿分支延伸
      const branchVariation = (skillIndex % 2 === 0 ? 0 : 30) * (Math.PI / 180); // 交替偏移
      const actualAngle = angle + branchVariation;

      const x = centerX + Math.cos(actualAngle) * distance;
      const y = centerY + Math.sin(actualAngle) * distance;

      // 創建主技能節點
      const skillElement = this.createMainSkillElement(skill);
      const mainSkillSize = this.config.rendering.skillSize * 1.2;

      skillElement.style.left = `${x - mainSkillSize / 2}px`;
      skillElement.style.top = `${y - mainSkillSize / 2}px`;

      this.skillLayer.appendChild(skillElement);
      this.skillElements.set(skill.id, skillElement);

      // 創建到前一個節點的連接
      if (skillIndex === 0) {
        // 第一個技能連接到中心
        this.createPoeStyleConnection(
          'backend-engineer-core',
          skill.id,
          centerX,
          centerY,
          x,
          y
        );
      } else {
        // 連接到分支中的前一個技能
        const prevSkill = branch.skills[skillIndex - 1];
        const prevDistance = baseDistance + (skillIndex - 1) * 120;
        const prevBranchVariation =
          ((skillIndex - 1) % 2 === 0 ? 0 : 30) * (Math.PI / 180);
        const prevAngle = angle + prevBranchVariation;
        const prevX = centerX + Math.cos(prevAngle) * prevDistance;
        const prevY = centerY + Math.sin(prevAngle) * prevDistance;

        this.createPoeStyleConnection(
          prevSkill.id,
          skill.id,
          prevX,
          prevY,
          x,
          y
        );
      }

      // 渲染子技能
      if (skill.skills && skill.skills.length > 0) {
        this.renderBranchSubSkills(skill, x, y, actualAngle, branch.color);
      }
    });
  }

  /**
   * 渲染中心節點的子技能
   */
  renderCenterSubSkills(centerSkill, centerX, centerY) {
    const subSkills = centerSkill.skills;
    const radius = 50;

    subSkills.forEach((subSkill, index) => {
      const angle = (2 * Math.PI * index) / subSkills.length;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const subElement = this.createSubSkillElement(
        subSkill,
        centerSkill,
        index
      );
      subElement.style.left = `${x - 16}px`; // 32px / 2 = 16px
      subElement.style.top = `${y - 16}px`;

      this.skillLayer.appendChild(subElement);
      this.createPoeStyleConnection(
        centerSkill.id,
        `${centerSkill.id}-sub-${index}`,
        centerX,
        centerY,
        x,
        y
      );

      const subSkillId = `${centerSkill.id}-sub-${index}`;
      this.skillElements.set(subSkillId, subElement);
    });
  }

  /**
   * 渲染分支子技能
   */
  renderBranchSubSkills(
    parentSkill,
    parentX,
    parentY,
    parentAngle,
    branchColor
  ) {
    const subSkills = parentSkill.skills;
    const baseRadius = 40;

    subSkills.forEach((subSkill, index) => {
      // 子技能圍繞主技能，但偏向分支方向
      const subAngle = parentAngle + (index - subSkills.length / 2) * 0.8;
      const radius = baseRadius + Math.abs(index - subSkills.length / 2) * 10;

      const x = parentX + Math.cos(subAngle) * radius;
      const y = parentY + Math.sin(subAngle) * radius;

      const subElement = this.createSubSkillElement(
        subSkill,
        parentSkill,
        index
      );
      subElement.style.left = `${x - 16}px`; // 32px / 2 = 16px
      subElement.style.top = `${y - 16}px`;

      // 使用分支顏色
      subElement.style.borderColor = branchColor;
      subElement.style.background = `radial-gradient(circle, ${branchColor}60, ${branchColor}30)`;

      this.skillLayer.appendChild(subElement);
      this.createPoeStyleConnection(
        parentSkill.id,
        `${parentSkill.id}-sub-${index}`,
        parentX,
        parentY,
        x,
        y
      );

      const subSkillId = `${parentSkill.id}-sub-${index}`;
      this.skillElements.set(subSkillId, subElement);
    });
  }

  /**
   * 創建PoE風格連接線
   */
  createPoeStyleConnection(fromId, toId, x1, y1, x2, y2) {
    const connection = document.createElement('div');
    connection.className = 'poe-skill-connection';
    connection.dataset.from = fromId;
    connection.dataset.to = toId;

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    connection.style.position = 'absolute';
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    connection.style.width = `${distance}px`;
    connection.style.height = '2px';
    connection.style.background =
      'linear-gradient(90deg, rgba(52, 152, 219, 0.8) 0%, rgba(52, 152, 219, 0.4) 50%, rgba(52, 152, 219, 0.8) 100%)';
    connection.style.transformOrigin = '0 50%';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.pointerEvents = 'none';
    connection.style.zIndex = '1';
    connection.style.boxShadow = '0 0 3px rgba(52, 152, 219, 0.5)';

    this.connectionLayer.appendChild(connection);
    this.connectionElements.set(`${fromId}-${toId}`, connection);
  }

  /**
   * 渲染子技能圓圈
   */
  renderSubSkills(parentSkill, parentX, parentY) {
    const subSkills = parentSkill.skills;
    const subSkillRadius = 45; // 子技能圍繞主技能的半徑
    const subSkillSize = 24; // 子技能圓圈大小

    subSkills.forEach((subSkill, index) => {
      // 計算子技能位置（圍繞主技能分佈）
      const angle = (2 * Math.PI * index) / subSkills.length;
      const subX = parentX + Math.cos(angle) * subSkillRadius;
      const subY = parentY + Math.sin(angle) * subSkillRadius;

      // 創建子技能元素
      const subSkillElement = this.createSubSkillElement(
        subSkill,
        parentSkill,
        index
      );

      // 設置子技能位置
      subSkillElement.style.left = `${subX - subSkillSize / 2}px`;
      subSkillElement.style.top = `${subY - subSkillSize / 2}px`;

      // 添加到技能層
      this.skillLayer.appendChild(subSkillElement);

      // 創建連接線（主技能到子技能）
      this.createSubSkillConnection(
        parentSkill.id,
        parentX,
        parentY,
        subX,
        subY,
        index
      );

      // 存儲子技能元素引用
      const subSkillId = `${parentSkill.id}-sub-${index}`;
      this.skillElements.set(subSkillId, subSkillElement);
    });
  }

  /**
   * 創建主技能元素
   */
  createMainSkillElement(skill) {
    const element = document.createElement('div');
    element.className = 'skill-node';
    element.id = skill.id;
    element.dataset.skillId = skill.id;
    element.dataset.category = skill.category || 'unknown';
    element.dataset.branch = skill.category || 'unknown'; // 為響應式適配器設置分支屬性

    // 根據座標判斷是哪個ring
    let ring = 'center';
    if (skill.coordinates) {
      const distance =
        Math.abs(skill.coordinates.q) + Math.abs(skill.coordinates.r);
      if (distance === 0) ring = 'center';
      else if (distance <= 4) ring = 'ring1';
      else if (distance <= 8) ring = 'ring2';
      else ring = 'ring3';
    }
    element.dataset.ring = ring;

    // 分類顏色對應
    const categoryColors = {
      frontend: '#e74c3c',
      backend: '#3498db',
      database: '#2ecc71',
      devops: '#9b59b6',
      ai: '#f39c12',
      architecture: '#34495e',
      unknown: '#555555',
    };

    const categoryColor =
      categoryColors[skill.category] || categoryColors.unknown;

    // 存儲分類顏色到 dataset 供後續使用
    element.dataset.categoryColor = categoryColor;

    // 增大主技能圓圈尺寸，確保文字清晰顯示
    const mainSkillSize = this.config.rendering.skillSize * 1.3; // 增大30%

    // 設置基礎樣式
    element.style.position = 'absolute';
    element.style.width = `${mainSkillSize}px`;
    element.style.height = `${mainSkillSize}px`;
    element.style.borderRadius = '50%';
    element.style.border = `3px solid ${categoryColor}`;
    element.style.background = `radial-gradient(circle, ${categoryColor}40, ${categoryColor}20)`;
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
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
    element.style.boxShadow = `0 0 15px ${categoryColor}80, inset 0 0 10px ${categoryColor}30`;

    // 提高渲染清晰度
    element.style.imageRendering = 'crisp-edges';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';

    // 設置技能名稱 - 主要標題
    const nameElement = document.createElement('div');
    nameElement.textContent = skill.name;
    nameElement.style.fontSize = '11px';
    nameElement.style.lineHeight = '1.1';
    nameElement.style.fontWeight = 'bold';
    nameElement.style.marginBottom = '2px';
    nameElement.style.color = 'white';
    nameElement.style.textShadow = `0 0 3px ${categoryColor}`;
    element.appendChild(nameElement);

    // 顯示技能等級或描述
    if (skill.level) {
      const levelInfo = document.createElement('div');
      levelInfo.textContent = `Lv.${skill.level}`;
      levelInfo.style.fontSize = '8px';
      levelInfo.style.opacity = '0.8';
      levelInfo.style.color = '#ffffff';
      levelInfo.style.textAlign = 'center';
      levelInfo.style.marginTop = '2px';
      element.appendChild(levelInfo);
    }

    // 獲取並應用初始狀態
    if (this.stateManager) {
      const status = this.stateManager.getSkillStatus(skill.id);
      this.applySkillStatus(element, status);
    }

    return element;
  }

  /**
   * 創建子技能元素
   */
  createSubSkillElement(subSkill, parentSkill, index) {
    const element = document.createElement('div');
    element.className = 'sub-skill-node';
    element.id = `${parentSkill.id}-sub-${index}`;
    element.dataset.skillId = `${parentSkill.id}-sub-${index}`;
    element.dataset.parentId = parentSkill.id;
    element.dataset.subSkillIndex = index;
    element.dataset.category = parentSkill.category || 'unknown';
    element.dataset.branch = parentSkill.category || 'unknown'; // 為響應式適配器設置分支屬性

    // 分類顏色對應
    const categoryColors = {
      frontend: '#e74c3c',
      backend: '#3498db',
      database: '#2ecc71',
      devops: '#9b59b6',
      ai: '#f39c12',
      architecture: '#34495e',
      unknown: '#555555',
    };

    const categoryColor =
      categoryColors[parentSkill.category] || categoryColors.unknown;
    element.dataset.categoryColor = categoryColor;

    // 設置子技能樣式 - 增大尺寸確保文字清晰
    element.style.position = 'absolute';
    element.style.width = '32px'; // 增大到32px
    element.style.height = '32px';
    element.style.borderRadius = '50%';
    element.style.border = `2px solid ${categoryColor}`;
    element.style.background = `radial-gradient(circle, ${categoryColor}60, ${categoryColor}30)`;
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.fontSize = '10px'; // 增大字體
    element.style.fontWeight = 'bold';
    element.style.color = 'white';
    element.style.cursor = 'pointer';
    element.style.transition = 'all 0.2s ease';
    element.style.userSelect = 'none';
    element.style.zIndex = '12';
    element.style.boxShadow = `0 0 8px ${categoryColor}60, inset 0 0 5px ${categoryColor}20`;

    // 提高渲染清晰度
    element.style.imageRendering = 'crisp-edges';
    element.style.backfaceVisibility = 'hidden';
    element.style.webkitFontSmoothing = 'antialiased';

    // 添加子技能縮寫或圖標
    const skillText = document.createElement('span');
    skillText.textContent = this.getSkillAbbreviation(subSkill.name);
    skillText.style.textShadow = `0 0 2px ${categoryColor}`;
    element.appendChild(skillText);

    // 添加懸停效果
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.2)';
      element.style.boxShadow = `0 0 15px ${categoryColor}90, inset 0 0 8px ${categoryColor}40`;
      element.style.zIndex = '15';

      // 顯示技能名稱提示
      this.showSubSkillTooltip(element, subSkill, parentSkill);
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = `0 0 8px ${categoryColor}60, inset 0 0 5px ${categoryColor}20`;
      element.style.zIndex = '12';

      // 隱藏提示
      this.hideSubSkillTooltip();
    });

    return element;
  }

  /**
   * 創建子技能連接線
   */
  createSubSkillConnection(parentId, parentX, parentY, subX, subY, index) {
    const connection = document.createElement('div');
    connection.className = 'sub-skill-connection';
    connection.dataset.from = parentId;
    connection.dataset.to = `${parentId}-sub-${index}`;

    // 計算連接線
    const deltaX = subX - parentX;
    const deltaY = subY - parentY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    // 設置連接線樣式
    connection.style.position = 'absolute';
    connection.style.left = `${parentX}px`;
    connection.style.top = `${parentY}px`;
    connection.style.width = `${distance}px`;
    connection.style.height = '1px';
    connection.style.background = 'rgba(52, 152, 219, 0.4)';
    connection.style.transformOrigin = '0 50%';
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.pointerEvents = 'none';
    connection.style.zIndex = '1';
    connection.style.opacity = '0.6';

    this.connectionLayer.appendChild(connection);
    this.connectionElements.set(`${parentId}-sub-${index}`, connection);
  }

  /**
   * 獲取技能縮寫
   */
  getSkillAbbreviation(skillName) {
    // 提取技能名稱的縮寫
    if (skillName.length <= 3) {
      return skillName;
    }

    // 處理英文技能名稱：優先提取大寫字母
    const upperCase = skillName.match(/[A-Z]/g);
    if (upperCase && upperCase.length >= 2) {
      return upperCase.slice(0, 2).join('');
    }

    // 處理中文或混合名稱：提取關鍵字符
    if (/[\u4e00-\u9fa5]/.test(skillName)) {
      // 中文技能：取前兩個字符
      return skillName.substring(0, 2);
    }

    // 英文技能：提取前兩個字符
    return skillName.substring(0, 2).toUpperCase();
  }

  /**
   * 顯示子技能提示
   */
  showSubSkillTooltip(element, subSkill, parentSkill) {
    // 移除現有提示
    this.hideSubSkillTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'sub-skill-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">${subSkill.name}</div>
      <div class="tooltip-proficiency">熟練度: ${subSkill.proficiency || 0}%</div>
      <div class="tooltip-parent">屬於: ${parentSkill.name}</div>
    `;

    // 樣式
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    tooltip.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';

    // 位置
    const rect = element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    tooltip.style.left = `${rect.left - containerRect.left + 30}px`;
    tooltip.style.top = `${rect.top - containerRect.top - 10}px`;

    this.container.appendChild(tooltip);
    this.currentTooltip = tooltip;
  }

  /**
   * 隱藏子技能提示
   */
  hideSubSkillTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  /**
   * 應用技能狀態樣式 - 保持分類顏色的同時添加狀態效果
   */
  applySkillStatus(element, status) {
    // 移除舊狀態類
    element.classList.remove(
      'skill-status-locked',
      'skill-status-available',
      'skill-status-learning',
      'skill-status-mastered'
    );

    // 添加新狀態類
    element.classList.add(`skill-status-${status}`);

    // 獲取分類顏色
    const categoryColor = element.dataset.categoryColor || '#555555';

    // 應用狀態樣式，保持分類顏色作為基調
    switch (status) {
      case 'mastered':
        // 已掌握：金色光環 + 分類顏色邊框
        element.style.borderColor = categoryColor;
        element.style.opacity = '1.0';
        element.style.boxShadow = `0 0 20px ${categoryColor}80, 0 0 30px rgba(244, 208, 63, 0.6)`;
        element.style.filter = 'brightness(1.2)';
        break;
      case 'available':
        // 可學習：藍色光環 + 分類顏色邊框
        element.style.borderColor = categoryColor;
        element.style.opacity = '0.9';
        element.style.boxShadow = `0 0 15px ${categoryColor}60, 0 0 25px rgba(52, 152, 219, 0.4)`;
        element.style.filter = 'brightness(1.1)';
        break;
      case 'learning':
        // 學習中：綠色光環 + 分類顏色邊框
        element.style.borderColor = categoryColor;
        element.style.opacity = '0.8';
        element.style.boxShadow = `0 0 15px ${categoryColor}60, 0 0 25px rgba(46, 204, 113, 0.4)`;
        element.style.filter = 'brightness(1.05)';
        break;
      case 'locked':
      default:
        // 鎖定：暗淡化但保持分類顏色
        element.style.borderColor = categoryColor;
        element.style.opacity = '0.5';
        element.style.boxShadow = `0 0 5px ${categoryColor}30`;
        element.style.filter = 'brightness(0.7) grayscale(0.3)';
        break;
    }
  }

  /**
   * 渲染連接線
   */
  renderConnections() {
    this.skillData.forEach(skill => {
      // 支援不同的前置技能屬性名
      const prerequisites = skill.prerequisites || skill.dependencies || [];

      if (prerequisites.length > 0) {
        prerequisites.forEach(prereqId => {
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

    // 計算起點座標
    let x1, y1;
    if (fromSkill.coordinates) {
      const { q, r } = fromSkill.coordinates;
      x1 = centerX + q * this.config.hexGrid.spacing * 0.866;
      y1 =
        centerY +
        (r * this.config.hexGrid.spacing +
          q * this.config.hexGrid.spacing * 0.5);
    } else if (fromSkill.position) {
      x1 = centerX + fromSkill.position.x;
      y1 = centerY + fromSkill.position.y;
    } else {
      x1 = centerX;
      y1 = centerY;
    }

    // 計算終點座標
    let x2, y2;
    if (toSkill.coordinates) {
      const { q, r } = toSkill.coordinates;
      x2 = centerX + q * this.config.hexGrid.spacing * 0.866;
      y2 =
        centerY +
        (r * this.config.hexGrid.spacing +
          q * this.config.hexGrid.spacing * 0.5);
    } else if (toSkill.position) {
      x2 = centerX + toSkill.position.x;
      y2 = centerY + toSkill.position.y;
    } else {
      x2 = centerX;
      y2 = centerY;
    }

    const connection = document.createElement('div');
    connection.className = 'skill-connection';
    connection.dataset.from = fromSkillId;
    connection.dataset.to = toSkillId;

    // 計算連接線
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    // 設置樣式
    connection.style.position = 'absolute';
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    connection.style.width = `${length}px`;
    connection.style.height = `${this.config.rendering.connectionWidth}px`;
    connection.style.background =
      'linear-gradient(90deg, transparent, #3498db, transparent)';
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
      element.addEventListener('click', event => {
        this.handleSkillClick(skillId, event);
      });

      // 懸停事件
      if (this.config.interaction.enableHover) {
        element.addEventListener('mouseenter', event => {
          this.handleSkillHover(skillId, event, true);
        });

        element.addEventListener('mouseleave', event => {
          this.handleSkillHover(skillId, event, false);
        });
      }

      // 鍵盤事件
      if (this.config.interaction.enableKeyboard) {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', event => {
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
      this.stateManager.on('skill-status-changed', event => {
        const element = this.skillElements.get(event.data.skillId);
        if (element) {
          this.applySkillStatus(element, event.data.newStatus);
        }
      });
    }

    // 響應式適配器事件
    if (this.responsiveAdapter) {
      this.responsiveAdapter.on('layout-applied', event => {
        console.log(`SkillTree: 佈局切換到 ${event.data.mode}`);
        this.emit('layout-changed', event.data);
      });

      this.responsiveAdapter.on('skill-tap', event => {
        this.handleSkillClick(event.data.skillId, event);
      });

      // 監聽初始縮放設置事件
      this.responsiveAdapter.on('set-initial-scale', event => {
        if (
          this.viewportController &&
          this.viewportController.setInitialScale
        ) {
          console.log('SkillTree: 設置初始縮放', event.data);
          this.viewportController.setInitialScale(
            event.data.scale,
            event.data.centerOnStart
          );
        }
      });
    }
  }

  /**
   * 綁定容器事件
   */
  bindContainerEvents() {
    // 防止右鍵選單
    this.container.addEventListener('contextmenu', event => {
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
      event,
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
      event,
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
      if (
        connectionId.startsWith(skillId + '-') ||
        connectionId.endsWith('-' + skillId)
      ) {
        element.style.opacity = highlight ? '0.8' : '0.3';
        element.style.filter = highlight
          ? 'drop-shadow(0 0 5px #3498db)'
          : 'none';
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
      responsive: this.responsiveAdapter?.getAdapterState(),
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
   * 切換網格顯示
   */
  toggleGrid(visible) {
    if (!this.isInitialized) return;

    this.isGridVisible = visible;

    if (visible) {
      this.showGrid();
    } else {
      this.hideGrid();
    }

    console.log(`SkillTree: 網格顯示 ${visible ? '開啟' : '關閉'}`);
  }

  /**
   * 顯示六角形網格
   */
  showGrid() {
    console.log('SkillTree.showGrid called');
    console.log('contentContainer available:', !!this.contentContainer);
    console.log('connectionLayer available:', !!this.connectionLayer);

    if (!this.gridLayer) {
      console.log('Creating new grid layer');
      this.gridLayer = document.createElement('div');
      this.gridLayer.className = 'hexagonal-grid-layer';
      this.gridLayer.style.position = 'absolute';
      this.gridLayer.style.top = '0';
      this.gridLayer.style.left = '0';
      this.gridLayer.style.width = '100%';
      this.gridLayer.style.height = '100%';
      this.gridLayer.style.pointerEvents = 'none';
      this.gridLayer.style.zIndex = '1';
      this.gridLayer.style.opacity = '0.3';

      if (this.contentContainer && this.connectionLayer) {
        this.contentContainer.insertBefore(
          this.gridLayer,
          this.connectionLayer
        );
        console.log('Grid layer inserted into DOM');
      } else {
        console.error('Cannot insert grid layer - missing containers');
      }
    } else {
      console.log('Using existing grid layer');
    }

    this.renderGrid();
  }

  /**
   * 隱藏網格
   */
  hideGrid() {
    if (this.gridLayer) {
      this.gridLayer.remove();
      this.gridLayer = null;
    }
  }

  /**
   * 渲染六角形網格
   */
  renderGrid() {
    console.log('SkillTree.renderGrid called');
    console.log('gridLayer available:', !!this.gridLayer);

    if (!this.gridLayer) {
      console.error('No grid layer available for rendering');
      return;
    }

    this.gridLayer.innerHTML = '';

    const centerX = this.config.rendering.centerOffset.x;
    const centerY = this.config.rendering.centerOffset.y;
    const spacing = this.config.hexGrid.spacing;

    console.log('Grid rendering params:', { centerX, centerY, spacing });

    // 繪製真正的六角形網格
    this.renderHexagonalGridLines(centerX, centerY, spacing);

    // 只添加中心標記用於參考
    const centerMarker = document.createElement('div');
    centerMarker.style.position = 'absolute';
    centerMarker.style.left = `${centerX - 2}px`;
    centerMarker.style.top = `${centerY - 2}px`;
    centerMarker.style.width = '4px';
    centerMarker.style.height = '4px';
    centerMarker.style.backgroundColor = 'red';
    centerMarker.style.borderRadius = '50%';
    centerMarker.style.opacity = '0.6';
    this.gridLayer.appendChild(centerMarker);

    console.log('Hexagonal grid rendered');
    console.log('Grid layer element count:', this.gridLayer.children.length);
  }

  /**
   * 渲染六角形網格線
   */
  renderHexagonalGridLines(centerX, centerY, spacing) {
    // 根據容器大小動態計算網格範圍，確保覆蓋整個可視區域
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;

    // 標準蜂巢六角形網格的數學常數
    const hexRadius = spacing * 0.5; // 六角形外接圓半徑
    const hexWidth = hexRadius * Math.sqrt(3); // 六角形寬度
    const hexHeight = hexRadius * 2; // 六角形高度

    // 正確的蜂巢排列偏移量
    const horizontalSpacing = hexWidth;
    const verticalSpacing = hexHeight * 0.75;

    // 動態計算需要的網格範圍，確保覆蓋整個可拖曳區域
    const maxDistance = Math.max(containerWidth, containerHeight);
    const gridRange = Math.ceil(maxDistance / (spacing * 2)) + 10; // 充足的緩衝區

    console.log('Grid rendering params:', {
      containerWidth,
      containerHeight,
      spacing,
      maxDistance,
      gridRange,
      centerX,
      centerY,
    });

    // 使用標準的六角形網格座標系統
    for (let q = -gridRange; q <= gridRange; q++) {
      for (let r = -gridRange; r <= gridRange; r++) {
        // 六角形座標系統的範圍限制
        if (Math.abs(q + r) > gridRange) continue;

        // 標準六角形座標轉換為笛卡爾座標的公式
        const hexX = centerX + horizontalSpacing * (q + r * 0.5);
        const hexY = centerY + verticalSpacing * r;

        // 繪製六角形輪廓，使用正確的外接圓半徑
        this.drawHexagonOutline(hexX, hexY, hexRadius);
      }
    }
  }

  /**
   * 繪製六角形輪廓
   */
  drawHexagonOutline(centerX, centerY, radius) {
    const points = [];

    // 計算六角形的6個頂點（頂點在上方，平邊在左右）
    for (let i = 0; i < 6; i++) {
      const angle = ((i * 60 - 90) * Math.PI) / 180; // -90度讓頂點在上方
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }

    // 繪製6條邊，使用更高的透明度讓網格更清楚
    for (let i = 0; i < 6; i++) {
      const start = points[i];
      const end = points[(i + 1) % 6];

      this.createGridLine(start.x, start.y, end.x, end.y, 0.25);
    }
  }

  /**
   * 創建網格線
   */
  createGridLine(x1, y1, x2, y2, opacity) {
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    line.style.width = `${length}px`;
    line.style.height = '1px';
    line.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    line.style.opacity = opacity.toString();
    line.style.transformOrigin = '0 0.5px';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.pointerEvents = 'none';
    line.style.boxShadow = '0 0 1px rgba(255, 255, 255, 0.3)';

    this.gridLayer.appendChild(line);
  }

  /**
   * 在指定位置繪製六角形
   */
  drawHexagonAt(centerX, centerY, radius) {
    const hexagon = document.createElement('div');
    hexagon.style.position = 'absolute';
    hexagon.style.left = `${centerX - radius}px`;
    hexagon.style.top = `${centerY - radius}px`;
    hexagon.style.width = `${radius * 2}px`;
    hexagon.style.height = `${radius * 2}px`;
    hexagon.style.border = '1px solid white';
    hexagon.style.borderRadius = '50%';
    hexagon.style.opacity = '0.4';
    hexagon.style.pointerEvents = 'none';

    this.gridLayer.appendChild(hexagon);
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

    // 清除網格層
    if (this.gridLayer) {
      this.gridLayer.remove();
      this.gridLayer = null;
    }

    // 移除事件監聽器
    this.removeAllListeners();

    // 清除引用
    this.container = null;
    this.skillData = null;

    console.log('SkillTree: 技能樹系統已銷毀');
  }
}

export default SkillTree;
