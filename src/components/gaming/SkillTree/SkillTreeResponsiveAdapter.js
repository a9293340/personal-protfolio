/**
 * SkillTreeResponsiveAdapter - 技能樹響應式適配器
 * 
 * 負責處理技能樹在不同設備上的響應式適配，包括：
 * - 桌面端和移動端的佈局切換
 * - 觸控和滑鼠事件的統一處理  
 * - 響應式斷點管理
 * - 移動端垂直滾動模式
 * - 分支折疊展開功能
 * 
 * @author Claude
 * @version 2.1.5
 */

import { EventManager } from '../../../core/events/EventManager.js';
import { DeviceDetector } from './SkillTreeViewportController.js';

/**
 * 響應式配置
 */
export const ResponsiveConfig = {
  // 斷點定義
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
    wide: 1600
  },
  
  // 佈局模式
  layouts: {
    desktop: {
      mode: 'free-drag',
      skillSize: 60,
      spacing: 120,
      maxColumns: 0, // 不限制
      showConnections: true,
      enableZoom: true,
      enableDrag: true
    },
    tablet: {
      mode: 'constrained-drag',
      skillSize: 50,
      spacing: 100,
      maxColumns: 8,
      showConnections: true,
      enableZoom: true,
      enableDrag: true
    },
    mobile: {
      mode: 'constrained-drag',
      skillSize: 50,
      spacing: 100, 
      maxColumns: 0, // 不限制
      showConnections: true,
      enableZoom: true,
      enableDrag: true,
      enableCollapse: false,
      // 手機端特殊設置
      initialScale: 0.6, // 初始縮放比例，讓畫面顯示更多內容
      centerOnStart: true // 啟動時自動居中
    }
  },
  
  // 動畫配置
  animations: {
    layoutTransition: 400,
    collapseExpand: 300,
    skillResize: 250
  },
  
  // 觸控配置
  touch: {
    tapThreshold: 10, // 點擊閾值
    longPressTime: 500, // 長按時間
    doubleTapTime: 300, // 雙擊時間
    swipeThreshold: 50 // 滑動閾值
  }
};

/**
 * 佈局模式枚舉
 */
export const LayoutMode = {
  FREE_DRAG: 'free-drag',           // 自由拖曳模式（桌面端）
  CONSTRAINED_DRAG: 'constrained-drag', // 限制拖曳模式（平板）  
  VERTICAL_SCROLL: 'vertical-scroll'     // 垂直滾動模式（手機）
};

export class SkillTreeResponsiveAdapter extends EventManager {
  constructor(container, config = {}) {
    super();
    
    this.container = container;
    this.config = { ...ResponsiveConfig, ...config };
    
    // 當前狀態
    this.state = {
      currentDevice: DeviceDetector.getDeviceType(),
      currentLayout: null,
      isTransitioning: false,
      collapsedBranches: new Set(), // 折疊的分支
      skillElements: new Map() // 技能元素映射
    };
    
    // 佈局信息
    this.layoutInfo = {
      containerWidth: 0,
      containerHeight: 0,
      skillSize: 60,
      spacing: 120,
      columns: 0,
      rows: 0
    };
    
    // 觸控狀態
    this.touchState = {
      lastTap: 0,
      lastTouchX: 0,
      lastTouchY: 0,
      isLongPress: false,
      longPressTimer: null
    };
    
    // 折疊狀態
    this.collapseState = {
      collapsedBranches: new Set(),
      animatingBranches: new Set()
    };
    
    // 分支元素映射
    this.branchElements = new Map();
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化適配器
   */
  init() {
    console.log('SkillTreeResponsiveAdapter: 初始化響應式適配器', {
      device: this.state.currentDevice,
      containerSize: {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      }
    });
    
    // 更新容器信息
    this.updateContainerInfo();
    
    // 設置初始佈局
    this.setupInitialLayout();
    
    // 綁定事件
    this.bindEvents();
    
    // 掃描技能元素
    this.scanSkillElements();
  }
  
  /**
   * 更新容器信息
   */
  updateContainerInfo() {
    const rect = this.container.getBoundingClientRect();
    this.layoutInfo.containerWidth = rect.width;
    this.layoutInfo.containerHeight = rect.height;
  }
  
  /**
   * 設置初始佈局
   */
  setupInitialLayout() {
    const device = this.state.currentDevice;
    const layoutConfig = this.config.layouts[device];
    
    this.applyLayout(layoutConfig, false); // 不使用動畫
  }
  
  /**
   * 綁定事件監聽器
   */
  bindEvents() {
    // 視窗大小變化
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // 方向變化
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // 移動端特定事件
    if (DeviceDetector.isTouchDevice()) {
      this.bindTouchEvents();
    }
  }
  
  /**
   * 綁定觸控事件
   */
  bindTouchEvents() {
    // 增強的觸控事件處理
    this.container.addEventListener('touchstart', this.handleEnhancedTouchStart.bind(this), { passive: false });
    this.container.addEventListener('touchend', this.handleEnhancedTouchEnd.bind(this), { passive: false });
  }
  
  /**
   * 處理增強觸控開始
   */
  handleEnhancedTouchStart(event) {
    const touch = event.touches[0];
    const now = Date.now();
    
    // 記錄觸控信息
    this.touchState.lastTouchX = touch.clientX;
    this.touchState.lastTouchY = touch.clientY;
    
    // 檢測雙擊
    if (now - this.touchState.lastTap < this.config.touch.doubleTapTime) {
      this.handleDoubleTap(touch);
      return;
    }
    
    this.touchState.lastTap = now;
    
    // 設置長按定時器
    this.touchState.longPressTimer = setTimeout(() => {
      this.handleLongPress(touch);
    }, this.config.touch.longPressTime);
  }
  
  /**
   * 處理增強觸控結束
   */
  handleEnhancedTouchEnd(event) {
    // 清除長按定時器
    if (this.touchState.longPressTimer) {
      clearTimeout(this.touchState.longPressTimer);
      this.touchState.longPressTimer = null;
    }
    
    // 如果是短觸控，處理點擊
    if (!this.touchState.isLongPress) {
      this.handleTap(event.changedTouches[0]);
    }
    
    this.touchState.isLongPress = false;
  }
  
  /**
   * 處理點擊
   */
  handleTap(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const skillElement = this.findSkillElement(element);
    
    if (skillElement) {
      this.handleSkillTap(skillElement, touch);
    }
  }
  
  /**
   * 處理雙擊
   */
  handleDoubleTap(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const branchElement = this.findBranchElement(element);
    
    if (branchElement && this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
      this.toggleBranchCollapse(branchElement);
    }
    
    this.emit('double-tap', { x: touch.clientX, y: touch.clientY });
  }
  
  /**
   * 處理長按
   */
  handleLongPress(touch) {
    this.touchState.isLongPress = true;
    
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const skillElement = this.findSkillElement(element);
    
    if (skillElement) {
      this.handleSkillLongPress(skillElement, touch);
    }
    
    this.emit('long-press', { x: touch.clientX, y: touch.clientY });
  }
  
  /**
   * 應用佈局
   */
  applyLayout(layoutConfig, animate = true) {
    if (this.state.isTransitioning) return;
    
    this.state.isTransitioning = true;
    this.state.currentLayout = layoutConfig.mode;
    
    console.log(`SkillTreeResponsiveAdapter: 切換到 ${layoutConfig.mode} 佈局`);
    
    // 更新佈局信息
    this.layoutInfo.skillSize = layoutConfig.skillSize;
    this.layoutInfo.spacing = layoutConfig.spacing;
    
    // 應用不同的佈局模式
    switch (layoutConfig.mode) {
      case LayoutMode.FREE_DRAG:
        this.applyFreeDragLayout(layoutConfig, animate);
        break;
      case LayoutMode.CONSTRAINED_DRAG:
        this.applyConstrainedDragLayout(layoutConfig, animate);
        break;
      case LayoutMode.VERTICAL_SCROLL:
        this.applyVerticalScrollLayout(layoutConfig, animate);
        break;
    }
    
    // 更新CSS變數
    this.updateCSSVariables(layoutConfig);
    
    // 動畫完成後重置狀態
    setTimeout(() => {
      this.state.isTransitioning = false;
      this.emit('layout-applied', {
        mode: layoutConfig.mode,
        config: layoutConfig
      });
    }, animate ? this.config.animations.layoutTransition : 0);
  }
  
  /**
   * 應用自由拖曳佈局（桌面端）
   */
  applyFreeDragLayout(config, animate) {
    // 移除所有佈局限制
    this.container.classList.remove('layout-vertical', 'layout-constrained');
    this.container.classList.add('layout-free-drag');
    
    // 顯示所有連接線
    this.toggleConnections(true);
    
    // 啟用所有技能
    this.expandAllBranches(animate);
    
    // 重置技能位置到配置的六角形座標
    this.resetSkillPositions(animate);
  }
  
  /**
   * 應用限制拖曳佈局（平板/手機）
   */
  applyConstrainedDragLayout(config, animate) {
    this.container.classList.remove('layout-vertical', 'layout-free-drag');
    this.container.classList.add('layout-constrained');
    
    // 確保技能樹容器移除垂直佈局類
    const skillTreeContainer = this.container.closest('.skill-tree-container');
    if (skillTreeContainer) {
      skillTreeContainer.classList.remove('layout-vertical');
    }
    
    // 顯示連接線但簡化
    this.toggleConnections(true, true);
    
    // 手機端特殊處理：設置初始縮放和居中
    if (this.state.currentDevice === 'mobile' && config.initialScale) {
      this.applyMobileInitialView(config);
    }
    
    // 應用網格限制
    this.applyGridConstraints(config, animate);
  }
  
  /**
   * 應用垂直滾動佈局（手機）
   */
  applyVerticalScrollLayout(config, animate) {
    this.container.classList.remove('layout-free-drag', 'layout-constrained');
    this.container.classList.add('layout-vertical');
    
    // 確保技能樹容器也有正確的類
    const skillTreeContainer = this.container.closest('.skill-tree-container');
    if (skillTreeContainer) {
      skillTreeContainer.classList.add('layout-vertical');
    }
    
    // 隱藏連接線
    this.toggleConnections(false);
    
    // 設置滾動容器
    this.setupScrollContainer();
    
    // 創建垂直分支佈局
    this.createVerticalBranchLayout(config, animate);
  }
  
  /**
   * 創建垂直分支佈局
   */
  createVerticalBranchLayout(config, animate) {
    const skillElements = this.getAllSkillElements();
    
    if (skillElements.length === 0) {
      console.warn('SkillTreeResponsiveAdapter: 沒有找到技能元素，無法創建垂直佈局');
      return;
    }
    
    const branches = this.groupSkillsByBranch(skillElements);
    let yOffset = 20;
    
    // 確保容器寬度正確
    this.updateContainerInfo();
    const containerWidth = Math.max(this.layoutInfo.containerWidth, 320); // 最小寬度
    
    branches.forEach((skills, branchName) => {
      // 創建分支頭部
      const branchHeader = this.createBranchHeader(branchName, skills.length);
      this.positionElement(branchHeader, 10, yOffset, animate);
      
      yOffset += 60;
      
      // 檢查是否折疊
      const isCollapsed = this.collapseState.collapsedBranches.has(branchName);
      
      if (!isCollapsed) {
        // 計算每行技能數量，確保至少1個
        const skillsPerRow = Math.max(1, Math.floor((containerWidth - 40) / (config.skillSize + 10)));
        
        console.log(`SkillTreeResponsiveAdapter: 佈局分支 "${branchName}"`, {
          skillCount: skills.length,
          containerWidth,
          skillSize: config.skillSize,
          skillsPerRow
        });
        
        skills.forEach((skill, index) => {
          const col = index % skillsPerRow;
          const row = Math.floor(index / skillsPerRow);
          
          const x = 20 + col * (config.skillSize + 10);
          const y = yOffset + row * (config.skillSize + 15);
          
          this.positionSkillElement(skill, x, y, animate);
          
          // 確保技能元素可見
          skill.style.display = 'flex';
          skill.style.opacity = '1';
          skill.style.zIndex = '10';
        });
        
        const rows = Math.ceil(skills.length / skillsPerRow);
        yOffset += rows * (config.skillSize + 15) + 20;
      }
      
      yOffset += 10; // 分支間距
    });
    
    // 更新容器高度
    this.updateContainerHeight(yOffset + 20);
    
    console.log('SkillTreeResponsiveAdapter: 垂直佈局創建完成', {
      totalHeight: yOffset + 20,
      branches: branches.size,
      totalSkills: skillElements.length
    });
  }
  
  /**
   * 創建分支頭部
   */
  createBranchHeader(branchName, skillCount) {
    let header = this.branchElements.get(branchName);
    
    if (!header) {
      header = document.createElement('div');
      header.className = 'skill-branch-header';
      header.dataset.branch = branchName;
      
      const title = document.createElement('h3');
      title.textContent = this.getBranchDisplayName(branchName);
      
      const counter = document.createElement('span');
      counter.className = 'skill-count';
      counter.textContent = `(${skillCount})`;
      
      const collapseIcon = document.createElement('button');
      collapseIcon.className = 'collapse-toggle';
      collapseIcon.innerHTML = '▼';
      collapseIcon.addEventListener('click', () => {
        this.toggleBranchCollapse(branchName);
      });
      
      header.appendChild(collapseIcon);
      header.appendChild(title);
      header.appendChild(counter);
      
      this.container.appendChild(header);
      this.branchElements.set(branchName, header);
    }
    
    // 更新折疊狀態
    const isCollapsed = this.collapseState.collapsedBranches.has(branchName);
    header.classList.toggle('collapsed', isCollapsed);
    header.querySelector('.collapse-toggle').innerHTML = isCollapsed ? '▶' : '▼';
    
    return header;
  }
  
  /**
   * 切換分支折疊
   */
  toggleBranchCollapse(branchName) {
    if (this.collapseState.animatingBranches.has(branchName)) return;
    
    this.collapseState.animatingBranches.add(branchName);
    
    const isCurrentlyCollapsed = this.collapseState.collapsedBranches.has(branchName);
    
    if (isCurrentlyCollapsed) {
      this.collapseState.collapsedBranches.delete(branchName);
      this.expandBranch(branchName);
    } else {
      this.collapseState.collapsedBranches.add(branchName);
      this.collapseBranch(branchName);
    }
    
    // 更新分支頭部（如果存在）
    if (this.branchElements && this.branchElements.has(branchName)) {
      const header = this.branchElements.get(branchName);
      if (header) {
        header.classList.toggle('collapsed', !isCurrentlyCollapsed);
        const toggleBtn = header.querySelector('.collapse-toggle');
        if (toggleBtn) {
          toggleBtn.innerHTML = isCurrentlyCollapsed ? '▼' : '▶';
        }
      }
    }
    
    this.emit('branch-toggle', {
      branch: branchName,
      collapsed: !isCurrentlyCollapsed
    });
    
    // 動畫完成後清理狀態
    setTimeout(() => {
      this.collapseState.animatingBranches.delete(branchName);
    }, this.config.animations.collapseExpand);
  }
  
  /**
   * 展開分支
   */
  expandBranch(branchName) {
    const skills = this.getSkillsByBranch(branchName);
    
    skills.forEach((skill, index) => {
      setTimeout(() => {
        skill.classList.remove('collapsed');
        skill.style.opacity = '1';
        skill.style.transform = skill.dataset.originalTransform || '';
      }, index * 50);
    });
    
    console.log(`SkillTreeResponsiveAdapter: 展開分支 "${branchName}" (${skills.length} 個技能)`);
    
    // 重新計算佈局
    setTimeout(() => {
      if (this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
        this.applyVerticalScrollLayout(
          this.config.layouts[this.state.currentDevice], 
          true
        );
      }
    }, 100);
  }
  
  /**
   * 折疊分支
   */
  collapseBranch(branchName) {
    const skills = this.getSkillsByBranch(branchName);
    
    skills.forEach((skill, index) => {
      setTimeout(() => {
        skill.classList.add('collapsed');
        skill.style.opacity = '0';
        skill.style.transform = 'scale(0.8) translateY(-20px)';
      }, index * 30);
    });
    
    console.log(`SkillTreeResponsiveAdapter: 折疊分支 "${branchName}" (${skills.length} 個技能)`);
    
    // 重新計算佈局
    setTimeout(() => {
      if (this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
        this.applyVerticalScrollLayout(
          this.config.layouts[this.state.currentDevice], 
          true
        );
      }
    }, this.config.animations.collapseExpand);
  }
  
  /**
   * 更新CSS變數
   */
  updateCSSVariables(config) {
    const root = document.documentElement;
    
    root.style.setProperty('--skill-size', `${config.skillSize}px`);
    root.style.setProperty('--skill-spacing', `${config.spacing}px`);
    root.style.setProperty('--layout-transition-duration', `${this.config.animations.layoutTransition}ms`);
  }
  
  /**
   * 處理視窗大小變化
   */
  handleResize() {
    const newDevice = DeviceDetector.getDeviceType();
    
    if (newDevice !== this.state.currentDevice) {
      console.log(`SkillTreeResponsiveAdapter: 設備類型變化 ${this.state.currentDevice} -> ${newDevice}`);
      this.state.currentDevice = newDevice;
      this.applyLayout(this.config.layouts[newDevice], true);
    } else {
      // 同設備類型內的大小調整
      this.updateContainerInfo();
      this.adjustCurrentLayout();
    }
    
    this.emit('responsive-change', {
      device: newDevice,
      containerSize: {
        width: this.layoutInfo.containerWidth,
        height: this.layoutInfo.containerHeight
      }
    });
  }
  
  /**
   * 處理方向變化
   */
  handleOrientationChange() {
    setTimeout(() => {
      this.handleResize();
    }, 200); // 延遲確保方向變化完成
  }
  
  /**
   * 調整當前佈局
   */
  adjustCurrentLayout() {
    if (this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
      // 重新計算垂直佈局
      this.applyVerticalScrollLayout(
        this.config.layouts[this.state.currentDevice], 
        false
      );
    }
    // 其他佈局模式通常由視窗控制器處理
  }
  
  // 工具方法
  
  /**
   * 掃描技能元素
   */
  scanSkillElements() {
    const skillElements = this.container.querySelectorAll('[data-skill-id]');
    this.state.skillElements.clear();
    
    skillElements.forEach(element => {
      const skillId = element.dataset.skillId;
      this.state.skillElements.set(skillId, element);
    });
    
    console.log(`SkillTreeResponsiveAdapter: 掃描到 ${skillElements.length} 個技能元素`, {
      elements: Array.from(skillElements).map(el => ({
        id: el.dataset.skillId,
        branch: el.dataset.branch || el.dataset.category,
        className: el.className
      }))
    });
    
    return skillElements.length;
  }
  
  /**
   * 獲取所有技能元素
   */
  getAllSkillElements() {
    return Array.from(this.state.skillElements.values());
  }
  
  /**
   * 按分支分組技能
   */
  groupSkillsByBranch(skillElements) {
    const branches = new Map();
    
    skillElements.forEach(element => {
      const branch = element.dataset.branch || element.dataset.category || 'misc';
      
      if (!branches.has(branch)) {
        branches.set(branch, []);
      }
      
      branches.get(branch).push(element);
    });
    
    console.log('SkillTreeResponsiveAdapter: 技能分支分組', {
      totalElements: skillElements.length,
      branches: Array.from(branches.entries()).map(([name, skills]) => ({
        name,
        count: skills.length
      }))
    });
    
    return branches;
  }
  
  /**
   * 獲取分支的技能
   */
  getSkillsByBranch(branchName) {
    return Array.from(this.state.skillElements.values())
      .filter(element => element.dataset.branch === branchName);
  }
  
  /**
   * 獲取分支顯示名稱
   */
  getBranchDisplayName(branchName) {
    const branchNames = {
      'frontend': '前端開發',
      'backend': '後端工程',
      'database': '資料庫工程',
      'devops': 'DevOps & 雲端',
      'ai': 'AI 工程應用',
      'architecture': '系統架構設計'
    };
    
    return branchNames[branchName] || branchName;
  }
  
  /**
   * 切換連接線顯示
   */
  toggleConnections(show, simplified = false) {
    const connections = this.container.querySelectorAll('.skill-connection');
    
    connections.forEach(connection => {
      if (show) {
        connection.style.display = '';
        connection.classList.toggle('simplified', simplified);
      } else {
        connection.style.display = 'none';
      }
    });
  }
  
  /**
   * 位置元素（帶動畫）
   */
  positionElement(element, x, y, animate = true) {
    if (animate) {
      element.style.transition = `transform ${this.config.animations.layoutTransition}ms ease-out`;
    }
    
    element.style.transform = `translate(${x}px, ${y}px)`;
    
    if (animate) {
      setTimeout(() => {
        element.style.transition = '';
      }, this.config.animations.layoutTransition);
    }
  }
  
  /**
   * 位置技能元素
   */
  positionSkillElement(element, x, y, animate = true) {
    // 保存原始變換用於折疊動畫
    element.dataset.originalTransform = `translate(${x}px, ${y}px)`;
    
    // 在垂直佈局模式下使用絕對定位
    if (this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      if (animate) {
        element.style.transition = `all ${this.config.animations.layoutTransition}ms ease-out`;
        setTimeout(() => {
          element.style.transition = '';
        }, this.config.animations.layoutTransition);
      }
    } else {
      this.positionElement(element, x, y, animate);
    }
  }
  
  /**
   * 查找技能元素
   */
  findSkillElement(element) {
    while (element && element !== this.container) {
      if (element.dataset.skillId) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
  
  /**
   * 查找分支元素
   */
  findBranchElement(element) {
    while (element && element !== this.container) {
      if (element.dataset.branch) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
  
  /**
   * 處理技能點擊
   */
  handleSkillTap(skillElement, touch) {
    this.emit('skill-tap', {
      skillId: skillElement.dataset.skillId,
      element: skillElement,
      position: { x: touch.clientX, y: touch.clientY }
    });
  }
  
  /**
   * 處理技能長按
   */
  handleSkillLongPress(skillElement, touch) {
    this.emit('skill-long-press', {
      skillId: skillElement.dataset.skillId,
      element: skillElement,
      position: { x: touch.clientX, y: touch.clientY }
    });
  }
  
  /**
   * 展開所有分支
   */
  expandAllBranches(animate = true) {
    this.collapseState.collapsedBranches.clear();
    
    const skillElements = this.getAllSkillElements();
    skillElements.forEach(element => {
      element.classList.remove('collapsed');
      if (animate) {
        element.style.transition = `opacity ${this.config.animations.collapseExpand}ms ease-out`;
      }
      element.style.opacity = '1';
    });
  }
  
  /**
   * 重置技能位置
   */
  resetSkillPositions(animate = true) {
    // 根據配置數據重置位置
    // 這裡需要與技能數據配置配合
    this.emit('reset-positions', { animate });
  }
  
  /**
   * 應用網格限制
   */
  applyGridConstraints(config, animate) {
    // 平板模式的網格限制邏輯
    this.emit('apply-grid-constraints', { config, animate });
  }
  
  /**
   * 應用手機端初始視圖
   */
  applyMobileInitialView(config) {
    // 通知視窗控制器設置初始縮放
    this.emit('set-initial-scale', {
      scale: config.initialScale,
      centerOnStart: config.centerOnStart
    });
    
    console.log('SkillTreeResponsiveAdapter: 應用手機端初始視圖', {
      initialScale: config.initialScale,
      centerOnStart: config.centerOnStart
    });
  }

  /**
   * 設置滾動容器
   */
  setupScrollContainer() {
    this.container.style.overflow = 'auto';
    this.container.style.overflowX = 'hidden';
    
    // 添加滾動指示器（如需要）
    this.addScrollIndicator();
  }
  
  /**
   * 添加滾動指示器
   */
  addScrollIndicator() {
    let indicator = this.container.querySelector('.scroll-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      indicator.innerHTML = '向下滾動查看更多技能';
      this.container.appendChild(indicator);
    }
    
    // 根據滾動位置顯示/隐藏指示器
    this.container.addEventListener('scroll', () => {
      const isAtBottom = this.container.scrollTop + this.container.clientHeight >= 
                        this.container.scrollHeight - 10;
      indicator.style.opacity = isAtBottom ? '0' : '1';
    });
  }
  
  /**
   * 更新容器高度
   */
  updateContainerHeight(height) {
    if (this.state.currentLayout === LayoutMode.VERTICAL_SCROLL) {
      const contentContainer = this.container.querySelector('.skill-tree-content');
      if (contentContainer) {
        contentContainer.style.height = `${height}px`;
        console.log(`SkillTreeResponsiveAdapter: 設置內容容器高度為 ${height}px`);
      }
      
      // 確保主容器可以滾動
      this.container.style.height = '100%';
      this.container.style.overflowY = 'auto';
    }
  }
  
  /**
   * 獲取適配器狀態
   */
  getAdapterState() {
    return {
      ...this.state,
      layoutInfo: this.layoutInfo,
      collapsedBranches: Array.from(this.collapseState.collapsedBranches)
    };
  }
  
  /**
   * 設置適配器狀態
   */
  setAdapterState(state) {
    Object.assign(this.state, state);
    
    if (state.collapsedBranches) {
      this.collapseState.collapsedBranches = new Set(state.collapsedBranches);
    }
    
    this.emit('state-change', this.state);
  }
  
  /**
   * 銷毀適配器
   */
  destroy() {
    // 清理定時器
    if (this.touchState.longPressTimer) {
      clearTimeout(this.touchState.longPressTimer);
    }
    
    // 移除事件監聽器
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    // 清理狀態
    this.state.skillElements.clear();
    this.branchElements.clear();
    
    console.log('SkillTreeResponsiveAdapter: 適配器已銷毀');
  }
}

export default SkillTreeResponsiveAdapter;