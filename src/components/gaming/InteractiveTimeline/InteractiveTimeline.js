/**
 * InteractiveTimeline 互動時間軸組件
 * 
 * 核心功能：
 * - 可拖曳滾動的時間軸線條 (桌機水平/手機垂直)
 * - 動態專案節點系統
 * - SVG 曲線路徑設計
 * - 節點點擊飛出卡片動畫
 * - GSAP 專業動畫整合
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class InteractiveTimeline extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    this.element = null;
    
    // 時間軸核心屬性
    this.timelineData = [];
    this.nodes = [];
    this.currentPosition = 0;
    this.isDragging = false;
    
    // 粒子系統屬性 (Step 2.2.2c)
    this.particleSystem = null;
    
    this.init();
  }

  getDefaultConfig() {
    return {
      // 時間軸基礎配置
      container: null,
      width: '100%',
      height: '400px',
      
      // 響應式配置
      responsive: {
        mobile: {
          orientation: 'vertical',
          nodeSize: 12,
          lineWidth: 3
        },
        tablet: {
          orientation: 'horizontal', 
          nodeSize: 16,
          lineWidth: 4
        },
        desktop: {
          orientation: 'horizontal',
          nodeSize: 20,
          lineWidth: 5
        }
      },
      
      // 動畫配置
      animations: {
        cardFlyOut: {
          duration: 1.2,
          easing: "back.out(1.7)"
        },
        nodeHover: {
          duration: 0.3,
          scale: 1.5
        },
        timelineScroll: {
          duration: 0.8,
          easing: "power2.out"
        }
      },
      
      // 視覺配置
      colors: {
        timeline: '#4a90e2',
        nodes: {
          current: '#ff6b35',
          recent: '#4ecdc4', 
          past: '#45b7d1',
          archive: '#96ceb4'
        },
        particles: '#ffffff'
      },
      
      // 粒子系統配置 (Step 2.2.2c)
      particles: {
        enabled: true,
        count: 50,
        size: {
          min: 1,
          max: 3
        },
        speed: {
          min: 0.5,
          max: 2.0
        },
        opacity: {
          min: 0.2,
          max: 0.8
        },
        colors: ['#4a90e2', '#64b5f6', '#90caf9', '#bbdefb'],
        flowDirection: 'timeline', // 沿時間軸方向流動
        respawn: true,
        performance: {
          mobile: { 
            count: 20, // Step 2.2.4b: 進一步減少移動端粒子數量
            size: { min: 0.5, max: 2 },
            frameRate: 30, // 限制移動端到30fps
            simplifyRendering: true // 啟用簡化渲染
          },
          tablet: { 
            count: 35, 
            size: { min: 0.8, max: 2.5 },
            frameRate: 45
          },
          desktop: { 
            count: 50, 
            size: { min: 1, max: 3 },
            frameRate: 60
          }
        }
      },
      
      // 專案數據
      projects: [],
      
      // Step 2.2.4a: 年份篩選系統配置
      yearFilter: {
        enabled: true,
        showAll: true,
        position: 'top', // top, bottom, left, right
        style: 'dropdown', // dropdown, tabs, buttons
        animation: {
          duration: 0.5,
          easing: 'power2.out'
        },
        // Step 2.2.4d: 年份切換體驗優化
        instantSwitch: true, // 立即切換節點，無動畫延遲
        autoCenter: false, // 停用年份切換後自動居中
        centerAnimation: {
          enabled: false, // 停用自動居中動畫
          duration: 0.6,
          easing: 'power2.out'
        }
      }
    };
  }

  getInitialState() {
    return {
      isInitialized: false,
      currentBreakpoint: this.detectBreakpoint(),
      isLoading: false,
      selectedNode: null,
      timelineLength: 0,
      viewportPosition: 0,
      // 粒子系統狀態 (Step 2.2.2c)
      particles: {
        isActive: false,
        canvas: null,
        context: null,
        animationFrame: null,
        particlePool: []
      },
      
      // Step 2.2.4a: 年份篩選狀態
      yearFilter: {
        availableYears: [],
        selectedYear: null, // null = 顯示所有年份
        filteredProjects: [],
        isFiltering: false
      }
    };
  }

  detectBreakpoint() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  async init() {
    try {
      console.log('[InteractiveTimeline] 開始初始化互動時間軸系統');
      
      await this.loadGSAPLibraries();
      await this.loadProjectData();
      this.createElement();
      
      this.state.isInitialized = true;
      console.log('[InteractiveTimeline] 互動時間軸初始化完成');
      
    } catch (error) {
      console.error('[InteractiveTimeline] 初始化失敗:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * 載入 GSAP 專業動畫套件
   */
  async loadGSAPLibraries() {
    const libraries = [
      {
        name: 'gsap',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        type: 'js'
      },
      {
        name: 'gsap-draggable',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js',
        type: 'js'
      },
      {
        name: 'gsap-scrolltrigger',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
        type: 'js'
      },
      {
        name: 'gsap-motionpath',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js',
        type: 'js'
      }
    ];

    const loadPromises = libraries.map(lib => this.loadLibrary(lib));
    
    try {
      await Promise.all(loadPromises);
      
      // 註冊 GSAP 插件
      if (window.gsap) {
        window.gsap.registerPlugin(window.Draggable, window.ScrollTrigger, window.MotionPathPlugin);
        console.log('[InteractiveTimeline] GSAP 套件載入完成');
      }
      
    } catch (error) {
      console.error('[InteractiveTimeline] GSAP 套件載入失敗:', error);
      throw error;
    }
  }

  loadLibrary(library) {
    return new Promise((resolve, reject) => {
      const selector = library.type === 'css' 
        ? `link[href="${library.url}"]`
        : `script[src="${library.url}"]`;
      
      if (document.querySelector(selector)) {
        resolve();
        return;
      }

      let element;
      
      if (library.type === 'css') {
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.href = library.url;
      } else {
        element = document.createElement('script');
        element.src = library.url;
        element.async = true;
      }

      element.onload = () => resolve();
      element.onerror = () => reject(new Error(`載入 ${library.name} 失敗`));

      document.head.appendChild(element);
    });
  }

  /**
   * 載入專案時間軸數據
   */
  async loadProjectData() {
    try {
      if (this.config.projects && this.config.projects.length > 0) {
        this.timelineData = this.config.projects;
      } else {
        // 載入真實專案數據
        const projectsModule = await import('../../../config/data/projects.data.js');
        const projectsConfig = projectsModule.projectsDataConfig || projectsModule.default;
        
        // 轉換為時間軸數據格式
        this.timelineData = this.convertProjectsToTimelineData(projectsConfig);
      }
      
      // 按時間排序
      this.timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      console.log(`[InteractiveTimeline] 載入 ${this.timelineData.length} 個專案節點`);
      
    } catch (error) {
      console.error('[InteractiveTimeline] 載入專案數據失敗:', error);
      // 使用預設測試數據
      this.timelineData = this.getDefaultTimelineData();
    }
  }

  convertProjectsToTimelineData(projectsConfig) {
    const timelineData = [];
    
    if (projectsConfig && projectsConfig.all) {
      Object.values(projectsConfig.all).forEach(project => {
        timelineData.push({
          id: project.id,
          title: project.name,
          date: project.startDate || project.completedDate || '2024-01-01',
          description: project.shortDescription,
          technologies: project.technologies || [],
          importance: project.importance || 3,
          category: project.category || 'general',
          links: project.links || {},
          status: this.calculateProjectStatus(project.startDate, project.completedDate)
        });
      });
    }
    
    return timelineData;
  }

  calculateProjectStatus(startDate, completedDate) {
    const now = new Date();
    const start = new Date(startDate || '2024-01-01');
    const completed = completedDate ? new Date(completedDate) : null;
    
    if (!completed && (now - start) < 90 * 24 * 60 * 60 * 1000) {
      return 'current';
    } else if (!completed || (now - new Date(completed)) < 365 * 24 * 60 * 60 * 1000) {
      return 'recent';
    } else if ((now - new Date(completed)) < 3 * 365 * 24 * 60 * 60 * 1000) {
      return 'past';
    } else {
      return 'archive';
    }
  }

  getDefaultTimelineData() {
    return [
      {
        id: 'project-1',
        title: '當前進行專案',
        date: '2024-08-01',
        description: '正在開發的最新專案',
        technologies: ['Vue 3', 'Node.js'],
        importance: 5,
        status: 'current'
      },
      {
        id: 'project-2', 
        title: '近期完成專案',
        date: '2024-01-15',
        description: '最近完成的重要專案',
        technologies: ['React', 'Express'],
        importance: 4,
        status: 'recent'
      },
      {
        id: 'project-3',
        title: '過往經典專案',
        date: '2023-06-10',
        description: '過去的重要專案',
        technologies: ['jQuery', 'PHP'],
        importance: 3,
        status: 'past'
      },
      {
        id: 'project-4',
        title: '歷史專案',
        date: '2022-03-20',
        description: '早期的專案作品',
        technologies: ['HTML', 'CSS'],
        importance: 2,
        status: 'archive'
      }
    ];
  }

  /**
   * 創建時間軸 DOM 結構
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'interactive-timeline';
    this.element.innerHTML = this.generateHTML();
    
    this.applyBaseStyles();
  }

  generateHTML() {
    const breakpoint = this.state.currentBreakpoint;
    const isVertical = breakpoint === 'mobile';
    
    return `
      <div class="timeline-container ${isVertical ? 'vertical' : 'horizontal'}">
        ${this.config.yearFilter.enabled ? `<div class="timeline-controls ${isVertical ? 'mobile-layout' : 'desktop-layout'}">
          ${this.generateYearFilterHTML()}
        </div>` : ''}
        
        <div class="timeline-viewport">
          <div class="timeline-content">
            <svg class="timeline-svg" width="${this.calculateSVGDimensions().width}" height="${this.calculateSVGDimensions().height}" viewBox="0 0 ${this.calculateSVGDimensions().width} ${this.calculateSVGDimensions().height}" preserveAspectRatio="none">
              <defs>
                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:${this.config.colors.timeline};stop-opacity:0.3" />
                  <stop offset="50%" style="stop-color:${this.config.colors.timeline};stop-opacity:1" />
                  <stop offset="100%" style="stop-color:${this.config.colors.timeline};stop-opacity:0.3" />
                </linearGradient>
              </defs>
              <path class="timeline-path" stroke="url(#timelineGradient)" fill="none"/>
            </svg>
            
            <div class="timeline-nodes">
              <!-- 動態生成的節點 -->
            </div>
            
            <div class="timeline-particles">
              <canvas class="particles-canvas" width="${this.calculateSVGDimensions().width}" height="${this.calculateSVGDimensions().height}"></canvas>
            </div>
          </div>
        </div>
        
        <div class="timeline-info">
          <div class="current-year"></div>
          <div class="timeline-markers">
            <!-- 年份標記將動態生成 -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成年份篩選器 HTML (Step 2.2.4a)
   */
  generateYearFilterHTML() {
    return `
      <div class="timeline-year-filter">
        <label class="filter-label">篩選年份：</label>
        <select class="year-selector">
          <option value="">顯示所有</option>
          <!-- 動態年份選項將在初始化時生成 -->
        </select>
        <div class="filter-status">
          <span class="filtered-count"></span>
        </div>
      </div>
    `;
  }
  
  /**
   * 設定基礎樣式
   */
  applyBaseStyles() {
    const styles = `
      <style id="interactive-timeline-styles">
        .interactive-timeline {
          width: 100%;
          height: 400px;
          position: relative;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .timeline-container {
          width: 100%;
          height: 100%;
          min-height: 400px;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .timeline-container.vertical {
          padding-top: 60px; /* 為手機版選單留出空間 */
        }
        
        .timeline-controls.desktop-layout {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
        }
        
        .timeline-controls.mobile-layout {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.85);
          padding: 8px 12px;
          border-radius: 6px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        /* Step 2.2.4a: 年份篩選器樣式 */
        .timeline-year-filter {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.7);
          padding: 12px 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          pointer-events: auto;
          cursor: default;
        }
        
        /* 手機版年份篩選器調整 */
        .mobile-layout .timeline-year-filter {
          position: absolute;
          top: 15px;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          z-index: 1000;
          padding: 8px 12px;
          font-size: 13px;
          gap: 8px;
          background: rgba(0, 0, 0, 0.85);
          pointer-events: auto;
          cursor: default;
        }
        
        .filter-label {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          white-space: nowrap;
        }
        
        .year-selector {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          pointer-events: auto;
          z-index: 1001;
        }
        
        .year-selector:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(74, 144, 226, 0.5);
        }
        
        .year-selector:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
        }
        
        .year-selector option {
          background: #1a1a2e;
          color: white;
          padding: 8px;
        }
        
        .filter-status {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }
        
        .filtered-count {
          color: #4a90e2;
          font-weight: 500;
        }
        
        .timeline-viewport {
          flex: 1;
          position: relative;
          overflow: hidden; /* 桌面版保持 hidden */
          min-height: 350px;
          cursor: grab;
        }
        
        .timeline-viewport:active {
          cursor: grabbing;
        }
        
        .timeline-content {
          position: absolute;
          top: 0;
          left: 0;
          transition: transform 0.3s ease-out;
          transform-origin: top left;
        }
        
        /* 手機版 viewport 需要更多高度 */
        @media (max-width: 768px) {
          .timeline-viewport {
            position: relative;
            min-height: 100vh;
            overflow: visible; /* 讓內容可以超出 */
          }
          
          .timeline-container.vertical {
            position: relative;
            min-height: 100vh;
            overflow-y: auto; /* 整個容器可滾動 */
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch; /* iOS 平滑滾動 */
          }
          
          .timeline-content {
            position: absolute; /* 保持絕對定位以支援節點定位 */
            top: 0;
            left: 0;
            width: 100%;
            /* 高度會在 JS 中動態設定 */
          }
          
          .timeline-nodes {
            /* 移除相對定位，保持絕對定位 */
          }
        }
        
        .timeline-svg {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
        }
        
        .timeline-path {
          stroke-width: 4;
          stroke-linecap: round;
        }
        
        .timeline-nodes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }
        
        /* 手機版節點容器需要擴展高度 */
        @media (max-width: 768px) {
          .timeline-nodes {
            /* 保持絕對定位系統 */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            /* 高度將在 JS 中動態設定 */
          }
        }
        
        .project-node {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--node-primary-color, #4a90e2) 0%, var(--node-secondary-color, #2171b5) 100%);
          border: 2px solid var(--node-primary-color, #4a90e2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
          box-shadow: 
            0 0 10px var(--node-glow-color, rgba(74, 144, 226, 0.3)),
            0 2px 8px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        /* Step 2.2.4b: 觸控區域優化 */
        .project-node::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 44px; /* 擴大觸控區域到44px (iOS推薦最小觸控尺寸) */
          height: 44px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: transparent;
          pointer-events: auto;
        }
        
        /* 移動端觸控增強 */
        @media (max-width: 768px) {
          .project-node {
            width: 24px; /* 移動端節點稍大 */
            height: 24px;
            border-width: 3px; /* 更粗的邊框 */
          }
          
          .project-node::before {
            width: 48px; /* 移動端更大的觸控區域 */
            height: 48px;
          }
          
          /* 觸控按下效果 */
          .project-node:active {
            transform: scale(1.1);
            box-shadow: 
              0 0 20px var(--node-glow-color, rgba(74, 144, 226, 0.6)),
              0 4px 12px rgba(0, 0, 0, 0.3);
          }
          
          .node-icon {
            font-size: 11px; /* 移動端圖標稍大 */
          }
        }
        
        .node-icon {
          font-size: 10px;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .project-node:hover {
          transform: scale(1.5);
          box-shadow: 
            0 0 20px var(--node-glow-color, rgba(74, 144, 226, 0.8)),
            0 4px 12px rgba(0, 0, 0, 0.3);
          border-color: var(--node-secondary-color, #64B5F6);
        }
        
        /* 主題特定增強效果 */
        .project-node.theme-active:hover {
          animation: activeNodePulse 1s ease-in-out infinite alternate;
        }
        
        .project-node.theme-recent {
          animation: recentNodeGlow 3s ease-in-out infinite;
        }
        
        @keyframes activeNodePulse {
          0% { box-shadow: 0 0 15px var(--node-glow-color), 0 2px 8px rgba(0, 0, 0, 0.2); }
          100% { box-shadow: 0 0 25px var(--node-glow-color), 0 4px 12px rgba(0, 0, 0, 0.3); }
        }
        
        @keyframes recentNodeGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .project-node.current { 
          background: ${this.config.colors.nodes.current}; 
          box-shadow: 0 0 15px ${this.config.colors.nodes.current}66;
        }
        .project-node.recent { 
          background: ${this.config.colors.nodes.recent}; 
          box-shadow: 0 0 12px ${this.config.colors.nodes.recent}66;
        }
        .project-node.past { 
          background: ${this.config.colors.nodes.past}; 
          box-shadow: 0 0 10px ${this.config.colors.nodes.past}66;
        }
        .project-node.archive { 
          background: ${this.config.colors.nodes.archive}; 
          box-shadow: 0 0 8px ${this.config.colors.nodes.archive}66;
        }
        
        .project-node.selected {
          border: 3px solid #ffffff;
          box-shadow: 0 0 20px #ffffff88;
        }
        
        /* 節點點擊狀態樣式 (Step 2.2.3a) */
        .project-node.clicking {
          pointer-events: none;
          z-index: 10;
        }
        
        .project-node:focus {
          outline: 2px solid #4a90e2;
          outline-offset: 2px;
        }
        
        .project-node {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }
        
        .node-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border: 2px solid currentColor;
          border-radius: 50%;
          opacity: 0;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }
        
        .node-label {
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          text-align: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.8);
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid rgba(74, 144, 226, 0.3);
          min-width: 80px;
        }
        
        .label-title {
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          margin-bottom: 2px;
        }
        
        .label-date {
          font-size: 10px;
          color: rgba(74, 144, 226, 0.8);
          font-weight: 400;
        }
        
        .project-node:hover .node-label {
          opacity: 1;
        }
        
        .timeline-info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          z-index: 100;
          pointer-events: none;
        }
        
        .timeline-markers {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }
        
        .year-marker {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          animation: yearMarkerFadeIn 0.5s ease-out forwards;
        }
        
        .year-marker .marker-line {
          width: 2px;
          height: 30px;
          background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
          margin-bottom: 8px;
        }
        
        .year-marker .marker-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          white-space: nowrap;
        }
        
        .period-marker {
          position: absolute;
          height: 40px;
          background: linear-gradient(90deg, transparent 0%, rgba(74, 144, 226, 0.1) 50%, transparent 100%);
          border-top: 2px solid rgba(74, 144, 226, 0.3);
          border-bottom: 2px solid rgba(74, 144, 226, 0.3);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: periodMarkerSlide 0.8s ease-out forwards;
        }
        
        .period-marker .period-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(74, 144, 226, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(74, 144, 226, 0.1);
          padding: 2px 8px;
          border-radius: 3px;
          border: 1px solid rgba(74, 144, 226, 0.3);
        }
        
        @keyframes yearMarkerFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes periodMarkerSlide {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 0.6; transform: scaleX(1); }
        }
        
        .current-year {
          font-size: 24px;
          font-weight: bold;
          color: #4a90e2;
          text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
          display: block !important;
          visibility: visible !important;
        }
        
        .timeline-controls {
          display: flex;
          gap: 10px;
        }
        
        .zoom-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .zoom-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* 粒子系統樣式 (Step 2.2.2c) */
        .timeline-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        
        .particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          opacity: 0.7;
          transition: opacity 0.5s ease;
        }
        
        .timeline-particles.active .particles-canvas {
          opacity: 1;
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .interactive-timeline {
            height: 960px; /* 增加高度，底部多留空間 */
            min-height: 960px;
            padding-bottom: 30px; /* 增加底部padding */
          }
          
          .timeline-container.vertical {
            flex-direction: column;
          }
          
          .timeline-navigation {
            flex-direction: column;
            top: 50%;
            transform: translateY(-50%);
          }
          
          .timeline-info {
            display: none !important; /* 手機版直接隱藏年份顯示 */
          }
          
          .current-year {
            font-size: 18px;
            font-weight: bold;
          }
          
          .particles-canvas {
            opacity: 0.5;
          }
        }
        
        /* 桌面版也稍微增加高度 */
        @media (min-width: 769px) {
          .interactive-timeline {
            height: 450px; /* 桌面版也稍微增加 */
            min-height: 450px;
          }
          
          .timeline-info {
            z-index: 10; /* 確保在最上層 */
            bottom: 20px;
            left: 20px;
          }
          
          .current-year {
            color: #4a90e2;
            text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
          }
        }
      </style>
    `;
    
    if (!document.querySelector('#interactive-timeline-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  /**
   * 計算 SVG 動態尺寸 - 根據專案數量調整
   */
  calculateSVGDimensions() {
    const projectCount = this.timelineData.length || 20; // 預設20個專案
    const isVertical = this.state?.currentBreakpoint === 'mobile';
    
    if (isVertical) {
      // 垂直模式：每個專案需要約 120px 高度，確保足夠空間顯示所有節點
      // 計算總高度時考慮額外緩衝
      const baseHeight = projectCount * 120; // 每個節點 120px（增加間距）
      const padding = 600; // 上下額外緩衝空間（增加到 600px）
      return {
        width: 400,
        height: Math.max(3000, baseHeight + padding) // 確保最小高度 3000px
      };
    } else {
      // 水平模式：每個專案需要約 100px 寬度，確保有足夠空間
      return {
        width: Math.max(1200, projectCount * 100),
        height: 400
      };
    }
  }

  /**
   * 設定時間軸路徑 - Step 2.2.2 核心實作
   */
  setupTimeline() {
    console.log('[InteractiveTimeline] 設定 SVG 時間軸路徑');
    
    const svg = this.element.querySelector('.timeline-svg');
    const path = this.element.querySelector('.timeline-path');
    
    if (!svg || !path) {
      console.error('[InteractiveTimeline] SVG 元素未找到');
      return;
    }

    const isVertical = this.state.currentBreakpoint === 'mobile';
    
    // 使用動態尺寸計算
    const dimensions = this.calculateSVGDimensions();
    const svgWidth = dimensions.width;
    const svgHeight = dimensions.height;
    
    console.log(`[InteractiveTimeline] 使用響應式 SVG 尺寸: ${svgWidth}x${svgHeight}, 斷點: ${this.state.currentBreakpoint}`);
    
    // 計算時間軸路徑
    const pathData = this.generateTimelinePath(svgWidth, svgHeight, isVertical);
    console.log(`[InteractiveTimeline] 生成路徑數據: ${pathData}`);
    
    // 更新 SVG viewBox 以匹配動態尺寸
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    // 設定 SVG 路徑
    path.setAttribute('d', pathData);
    path.setAttribute('stroke-width', this.config.responsive[this.state.currentBreakpoint].lineWidth);
    
    // 動畫顯示路徑
    if (window.gsap) {
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      
      window.gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut"
      });
    }
    
    console.log('[InteractiveTimeline] 時間軸路徑設定完成');
  }

  /**
   * 生成時間軸 SVG 路徑 - 自然曲線設計
   */
  generateTimelinePath(width, height, isVertical = false) {
    const padding = 60;
    const curveIntensity = 0.3;
    
    if (isVertical) {
      // 垂直時間軸 (手機版) - 簡單直線，確保節點對齊
      const startY = 60;
      const endY = height - 40; // 延伸到接近底部，確保覆蓋最後節點
      const centerX = 200; // 固定在中心
      
      // 創建幾乎直線的路徑，最小曲線
      const controlOffset = width * 0.04; // 更小的曲線，接近直線
      const midY = (startY + endY) / 2;
      
      return `M ${centerX} ${startY} 
              Q ${centerX - controlOffset} ${midY - 30} ${centerX} ${midY}
              Q ${centerX + controlOffset} ${midY + 30} ${centerX} ${endY}`;
    } else {
      // 水平時間軸 (桌面版)
      const startX = padding;
      const endX = width - padding;
      const centerY = height / 2;
      
      // 創建自然的波浪曲線
      const controlOffset = height * 0.2;
      const curve1X = startX + (endX - startX) * 0.25;
      const curve2X = startX + (endX - startX) * 0.5;
      const curve3X = startX + (endX - startX) * 0.75;
      
      return `M ${startX} ${centerY}
              Q ${curve1X} ${centerY - controlOffset} ${curve2X} ${centerY}
              Q ${curve3X} ${centerY + controlOffset} ${endX} ${centerY}`;
    }
  }

  /**
   * 設定專案節點 - Step 2.2.2 核心實作
   */
  setupNodes() {
    console.log('[InteractiveTimeline] 設定動態專案節點');
    
    const nodesContainer = this.element.querySelector('.timeline-nodes');
    const path = this.element.querySelector('.timeline-path');
    const svg = this.element.querySelector('.timeline-svg');
    
    if (!nodesContainer || !path || !svg) {
      console.error('[InteractiveTimeline] 節點容器、路徑或SVG元素未找到');
      return;
    }

    // 清空現有節點
    nodesContainer.innerHTML = '';
    this.nodes = [];
    
    // 為每個專案創建節點
    this.timelineData.forEach((project, index) => {
      const nodeElement = this.createProjectNode(project, index);
      
      // 計算節點在路徑上的位置（根據時間分佈）
      const svgPosition = this.calculateNodePosition(path, project, this.timelineData);
      
      // 轉換 SVG 坐標到實際像素坐標
      const actualPosition = this.convertSVGToPixelCoordinates(svg, svgPosition);
      
      // 設定節點位置
      nodeElement.style.left = `${actualPosition.x}px`;
      nodeElement.style.top = `${actualPosition.y}px`;
      
      nodesContainer.appendChild(nodeElement);
      this.nodes.push({
        element: nodeElement,
        data: project,
        position: actualPosition // 存儲節點的像素位置用於邊界計算
      });
      
      // 立即顯示節點，後續添加動畫
      nodeElement.style.opacity = '1';
      
      // 計算重要性縮放
      const importanceScale = 0.8 + (project.importance / 5) * 0.4;
      
      // 延遲顯示動畫
      if (window.gsap) {
        window.gsap.fromTo(nodeElement, {
          scale: 0,
          opacity: 0
        }, {
          scale: importanceScale,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.15,
          ease: "back.out(1.7)"
        });
      }
    });
    
    // 手機版：動態設定容器高度以確保所有節點可見
    if (this.state.currentBreakpoint === 'mobile' && this.nodes.length > 0) {
      // 使用 SVG 的計算高度作為基準
      const svgDimensions = this.calculateSVGDimensions();
      const totalHeight = svgDimensions.height;
      
      // 設定節點容器高度
      nodesContainer.style.height = `${totalHeight}px`;
      
      // 設定 timeline-content 高度
      const timelineContent = this.element.querySelector('.timeline-content');
      if (timelineContent) {
        timelineContent.style.height = `${totalHeight}px`;
      }
      
      // 設定 viewport 高度以包含所有內容
      const viewport = this.element.querySelector('.timeline-viewport');
      if (viewport) {
        viewport.style.minHeight = `${totalHeight}px`;
      }
      
      console.log(`[InteractiveTimeline] 手機版容器高度設定為: ${totalHeight}px`);
    }
    
    console.log(`[InteractiveTimeline] 創建了 ${this.nodes.length} 個專案節點`);
  }

  /**
   * 創建專案節點元素
   */
  createProjectNode(project, index) {
    const nodeElement = document.createElement('div');
    const nodeSize = this.config.responsive[this.state.currentBreakpoint].nodeSize;
    
    nodeElement.className = `timeline-node project-node ${project.status}`;
    nodeElement.style.width = `${nodeSize}px`;
    nodeElement.style.height = `${nodeSize}px`;
    
    // 根據重要性調整節點大小
    const importanceScale = 0.8 + (project.importance / 5) * 0.4;
    nodeElement.style.transform = `translate(-50%, -50%) scale(${importanceScale})`;
    
    // 節點內容和樣式 - Step 2.2.2a 色彩主題整合
    const nodeIcon = this.getProjectIcon(project.category || 'general');
    const formattedDate = this.formatProjectDate(project.date);
    const themeColors = this.getProjectThemeColors(project);
    
    nodeElement.innerHTML = `
      <div class="node-icon">${nodeIcon}</div>
      <div class="node-label">
        <div class="label-title">${project.title}</div>
        <div class="label-date">${formattedDate}</div>
      </div>
      <div class="node-pulse"></div>
    `;
    
    // 應用時期色彩主題
    nodeElement.style.setProperty('--node-primary-color', themeColors.primary);
    nodeElement.style.setProperty('--node-secondary-color', themeColors.secondary);
    nodeElement.style.setProperty('--node-glow-color', themeColors.glow);
    nodeElement.style.borderColor = themeColors.primary;
    
    // 添加分類和主題類別
    nodeElement.classList.add(`category-${project.category || 'general'}`);
    nodeElement.classList.add(`theme-${this.getProjectTheme(project)}`);
    
    // 添加數據屬性
    nodeElement.dataset.projectId = project.id;
    nodeElement.dataset.projectIndex = index;
    nodeElement.dataset.projectCategory = project.category || 'general';
    
    // 添加點擊事件監聽器 (Step 2.2.3a)
    this.setupNodeClickHandler(nodeElement, project, index);
    
    return nodeElement;
  }

  /**
   * 設定節點點擊事件處理器 (Step 2.2.3a)
   */
  setupNodeClickHandler(nodeElement, project, index) {
    // 點擊事件監聽
    nodeElement.addEventListener('click', (event) => {
      event.stopPropagation();
      this.handleNodeClick(nodeElement, project, index, event);
    });
    
    // 鍵盤可訪問性
    nodeElement.setAttribute('tabindex', '0');
    nodeElement.setAttribute('role', 'button');
    nodeElement.setAttribute('aria-label', `專案: ${project.title}, ${project.date}`);
    
    // 鍵盤事件監聽
    nodeElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleNodeClick(nodeElement, project, index, event);
      }
    });
    
    console.log(`[InteractiveTimeline] 節點點擊處理器已設定: ${project.title}`);
  }
  
  /**
   * 處理節點點擊事件 (Step 2.2.3a)
   */
  handleNodeClick(nodeElement, project, index, event) {
    console.log(`[InteractiveTimeline] 節點被點擊: ${project.title}`);
    
    // 防止重複點擊
    if (nodeElement.classList.contains('clicking')) {
      return;
    }
    
    // 設定當前選中節點
    this.setSelectedNode(nodeElement, project, index);
    
    // 執行點擊反饋動畫
    this.playNodeClickAnimation(nodeElement);
    
    // Step 2.2.3b: 卡片飛出動畫
    setTimeout(() => {
      this.createAndAnimateProjectCard(nodeElement, project, index);
    }, 300); // 等待點擊動畫完成
    
    // 觸發自定義事件
    this.element.dispatchEvent(new CustomEvent('nodeClick', {
      detail: { project, index, nodeElement, event }
    }));
  }
  
  /**
   * 設定選中節點狀態 (Step 2.2.3a)
   */
  setSelectedNode(nodeElement, project, index) {
    // 清除之前選中的節點
    const prevSelected = this.element.querySelector('.timeline-node.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }
    
    // 設定新選中節點
    nodeElement.classList.add('selected');
    this.state.selectedNode = {
      element: nodeElement,
      project: project,
      index: index
    };
    
    console.log(`[InteractiveTimeline] 設定選中節點: ${project.title}`);
  }
  
  /**
   * 播放節點點擊動畫 (Step 2.2.3a)
   */
  playNodeClickAnimation(nodeElement) {
    // 添加點擊狀態類
    nodeElement.classList.add('clicking');
    
    // 使用 GSAP 創建點擊反饋動畫
    const tl = gsap.timeline({
      onComplete: () => {
        nodeElement.classList.remove('clicking');
      }
    });
    
    // 點擊縮放動畫
    tl.to(nodeElement, {
      duration: 0.1,
      scale: 0.9,
      ease: "power2.out"
    })
    .to(nodeElement, {
      duration: 0.2,
      scale: 1.1,
      ease: "back.out(2)"
    })
    .to(nodeElement, {
      duration: 0.15,
      scale: 1.0,
      ease: "power2.out"
    });
    
    // 脈衝光環動畫
    const pulseRing = nodeElement.querySelector('.node-pulse');
    if (pulseRing) {
      gsap.fromTo(pulseRing, {
        scale: 0,
        opacity: 0.8
      }, {
        duration: 0.6,
        scale: 2,
        opacity: 0,
        ease: "power2.out"
      });
    }
    
    console.log(`[InteractiveTimeline] 播放節點點擊動畫: ${nodeElement.dataset.projectId}`);
  }

  /**
   * 創建並動畫化專案卡片 (Step 2.2.3b)
   */
  createAndAnimateProjectCard(nodeElement, project, index) {
    console.log(`[InteractiveTimeline] 創建專案卡片: ${project.title}`);
    
    // 防止重複創建卡片
    const existingCard = document.querySelector('.project-flying-card');
    if (existingCard) {
      this.closeProjectCard(existingCard);
      return;
    }
    
    // 創建卡片元素
    const card = this.createProjectCard(project, nodeElement);
    
    // 計算飛出軌跡
    const trajectory = this.calculateCardTrajectory(nodeElement);
    
    // 執行飛出動畫
    this.animateCardFlyOut(card, trajectory);
  }
  
  /**
   * 創建專案詳情卡片 (Step 2.2.3b)
   */
  createProjectCard(project, nodeElement) {
    const card = document.createElement('div');
    card.className = 'project-flying-card';
    
    // 獲取節點的世界座標作為起始位置
    const nodeRect = nodeElement.getBoundingClientRect();
    const startX = nodeRect.left + nodeRect.width / 2;
    const startY = nodeRect.top + nodeRect.height / 2;
    
    // 計算大尺寸卡片 (95% 畫面，無最大限制)
    const cardWidth = window.innerWidth * 0.95;
    const cardHeight = window.innerHeight * 0.92;
    
    // 設定卡片初始位置和樣式 (大尺寸版)
    card.style.cssText = `
      position: fixed;
      left: ${startX - cardWidth/2}px;
      top: ${startY - cardHeight/2}px;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid ${this.getProjectThemeColors(project).primary};
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
      z-index: 1000;
      opacity: 0;
      transform: scale(0.1);
      transform-origin: center center;
      pointer-events: auto;
      color: white;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      backdrop-filter: blur(10px);
    `;
    
    // 卡片內容
    const themeColors = this.getProjectThemeColors(project);
    const categoryIcon = this.getProjectIcon(project.category || 'general');
    
    card.innerHTML = `
      <div class="card-header" style="
        background: linear-gradient(90deg, ${themeColors.primary}33 0%, ${themeColors.secondary}33 100%);
        padding: 25px 30px;
        border-bottom: 2px solid ${themeColors.primary}66;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 120px;
      ">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="
            font-size: 60px;
            padding: 15px;
            background: ${themeColors.primary}22;
            border-radius: 12px;
            border: 2px solid ${themeColors.primary}44;
          ">${categoryIcon}</div>
          <div>
            <h2 style="margin: 0 0 8px 0; font-size: 28px; color: ${themeColors.primary}; font-weight: 700;">${project.title}</h2>
            <p style="margin: 0; font-size: 16px; opacity: 0.8;">${this.formatProjectDate(project.date)}</p>
            <div style="margin-top: 8px;">
              <span style="
                background: ${themeColors.primary}33;
                color: ${themeColors.primary};
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
              ">${project.category || 'general'}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; color: ${themeColors.primary};">
            重要性: ${'★'.repeat(project.importance || 1)}
          </div>
        </div>
      </div>
      
      <div class="card-content" style="
        padding: 25px 30px 50px 30px;
        height: calc(100% - 140px);
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: rgba(74, 144, 226, 0.5) rgba(255, 255, 255, 0.1);
      ">
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: ${themeColors.secondary};">專案描述</h3>
          <p style="margin: 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">${project.description}</p>
        </div>
        
        <div>
          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: ${themeColors.secondary};">技術亮點</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
              <div style="font-weight: 600; margin-bottom: 5px;">開發時間</div>
              <div style="opacity: 0.8;">${this.formatProjectDate(project.date)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
              <div style="font-weight: 600; margin-bottom: 5px;">專案類型</div>
              <div style="opacity: 0.8;">${project.category || 'general'}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
              <div style="font-weight: 600; margin-bottom: 5px;">專案狀態</div>
              <div style="opacity: 0.8;">${project.status || 'completed'}</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: auto;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button style="
              background: ${themeColors.primary};
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s ease;
            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              📖 查看詳情
            </button>
            <button style="
              background: transparent;
              color: ${themeColors.secondary};
              border: 2px solid ${themeColors.secondary};
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s ease;
            " onmouseover="this.style.background='${themeColors.secondary}22'" onmouseout="this.style.background='transparent'">
              🔗 線上展示
            </button>
          </div>
        </div>
      </div>
      
      <div class="card-close" style="
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s ease;
        backdrop-filter: blur(5px);
      " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">✕</div>
    `;
    
    // 添加自定義滾動條樣式 (WebKit browsers)
    const style = document.createElement('style');
    style.textContent = `
      .project-flying-card .card-content::-webkit-scrollbar {
        width: 8px;
      }
      .project-flying-card .card-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      .project-flying-card .card-content::-webkit-scrollbar-thumb {
        background: rgba(74, 144, 226, 0.5);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .project-flying-card .card-content::-webkit-scrollbar-thumb:hover {
        background: rgba(74, 144, 226, 0.7);
      }
    `;
    document.head.appendChild(style);
    
    // 添加關閉事件
    const closeBtn = card.querySelector('.card-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeProjectCard(card);
    });
    
    // 點擊卡片外部關閉
    document.addEventListener('click', this.handleOutsideClick.bind(this, card), { once: true });
    
    document.body.appendChild(card);
    return card;
  }
  
  /**
   * 計算卡片飛出軌跡 (Step 2.2.3b) - 修復定位
   */
  calculateCardTrajectory(nodeElement) {
    const nodeRect = nodeElement.getBoundingClientRect();
    const startX = nodeRect.left + nodeRect.width / 2;
    const startY = nodeRect.top + nodeRect.height / 2;
    
    // 計算目標位置 (螢幕中央)
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;
    
    // 控制點：創建弧形軌跡
    const controlX = startX + (endX - startX) * 0.5;
    const controlY = Math.min(startY, endY) - 100;
    
    return {
      start: { x: startX, y: startY },
      control: { x: controlX, y: controlY },
      end: { x: endX, y: endY }
    };
  }
  
  /**
   * 執行卡片飛出動畫 (Step 2.2.3b)
   */
  animateCardFlyOut(card, trajectory) {
    console.log(`[InteractiveTimeline] 執行卡片飛出動畫 - 流暢版`);
    
    // GSAP 時間軸動畫 - 流暢旋轉版本
    const tl = gsap.timeline();
    
    // 第一階段：飛出並旋轉 - 使用連續旋轉
    tl.to(card, {
      duration: 0.8,
      opacity: 1,
      scale: 1,
      rotateY: 720, // 兩圈完整旋轉，更加流暢
      left: (window.innerWidth / 2) - ((window.innerWidth * 0.95) / 2), // 移動到螢幕中央
      top: (window.innerHeight / 2) - ((window.innerHeight * 0.92) / 2),
      ease: "power2.out"
    })
    // 第二階段：穩定落地
    .to(card, {
      duration: 0.3,
      scale: 1.05,
      ease: "back.out(1.7)"
    })
    // 第三階段：最終定位
    .to(card, {
      duration: 0.2,
      scale: 1,
      ease: "power2.out"
    });
    
    // 添加發光脈衝效果
    gsap.to(card, {
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      boxShadow: "0 8px 32px rgba(74, 144, 226, 0.4), 0 0 0 1px rgba(74, 144, 226, 0.2)"
    });
  }
  
  /**
   * 關閉專案卡片 (Step 2.2.3b)
   */
  closeProjectCard(card) {
    console.log(`[InteractiveTimeline] 關閉專案卡片`);
    
    gsap.to(card, {
      duration: 0.4,
      scale: 0,
      rotateY: 180,
      opacity: 0,
      ease: "back.in(2)",
      onComplete: () => {
        if (card.parentNode) {
          card.remove();
        }
      }
    });
  }
  
  /**
   * 處理點擊外部關閉卡片
   */
  handleOutsideClick(card, event) {
    if (!card.contains(event.target)) {
      this.closeProjectCard(card);
    }
  }

  /**
   * 獲取專案圖標 - Step 2.2.2a 增強版
   */
  getProjectIcon(category) {
    const icons = {
      frontend: '🎨',     // 前端開發
      backend: '⚙️',      // 後端開發
      fullstack: '🔗',    // 全端開發
      devops: '🚀',       // DevOps/部署
      ai: '🤖',          // AI/機器學習
      mobile: '📱',       // 移動端開發
      blockchain: '⛓️',   // 區塊鏈
      cloud: '☁️',        // 雲端服務
      database: '🗄️',     // 資料庫
      security: '🔒',     // 資訊安全
      iot: '📡',         // 物聯網
      game: '🎮',        // 遊戲開發
      general: '💡'      // 通用/其他
    };
    return icons[category] || icons.general;
  }

  /**
   * 獲取專案主題類別名稱 - Step 2.2.2a 輔助方法
   */
  getProjectTheme(project) {
    const currentYear = new Date().getFullYear();
    const projectYear = new Date(project.date).getFullYear();
    const yearDiff = currentYear - projectYear;

    if (project.status === 'current') return 'active';
    if (yearDiff <= 1) return 'recent';
    if (yearDiff <= 2) return 'medium';
    return 'archive';
  }

  /**
   * 獲取專案時期色彩主題 - Step 2.2.2a 新增
   */
  getProjectThemeColors(project) {
    const currentYear = new Date().getFullYear();
    const projectYear = new Date(project.date).getFullYear();
    const yearDiff = currentYear - projectYear;

    // 根據時間距離和專案狀態決定色彩主題
    if (project.status === 'current') {
      return {
        primary: '#4CAF50',    // 活躍綠
        secondary: '#81C784',   
        glow: 'rgba(76, 175, 80, 0.6)'
      };
    } else if (yearDiff <= 1) {
      return {
        primary: '#2196F3',    // 近期藍
        secondary: '#64B5F6',
        glow: 'rgba(33, 150, 243, 0.5)'
      };
    } else if (yearDiff <= 2) {
      return {
        primary: '#FF9800',    // 中期橙
        secondary: '#FFB74D',
        glow: 'rgba(255, 152, 0, 0.4)'
      };
    } else {
      return {
        primary: '#795548',    // 歷史棕
        secondary: '#A1887F',
        glow: 'rgba(121, 85, 72, 0.3)'
      };
    }
  }

  /**
   * 格式化專案日期為月份顯示
   */
  formatProjectDate(dateString) {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // 月份從0開始，所以+1
      const year = date.getFullYear();
      
      // 如果是當前年份，只顯示月份
      const currentYear = new Date().getFullYear();
      if (year === currentYear) {
        return `${month}月`;
      }
      
      // 其他年份顯示年份和月份
      return `${year}年${month}月`;
    } catch (error) {
      console.warn('[InteractiveTimeline] 日期格式化失敗:', dateString);
      return '未知時間';
    }
  }

  /**
   * 轉換 SVG viewBox 坐標到實際像素坐標
   */
  convertSVGToPixelCoordinates(svg, svgPosition) {
    const svgRect = svg.getBoundingClientRect();
    
    // 使用動態尺寸計算
    const dimensions = this.calculateSVGDimensions();
    const viewBoxWidth = dimensions.width;
    const viewBoxHeight = dimensions.height;
    
    // SVG 尺寸檢查和降級處理
    if (svgRect.width === 0 || svgRect.height === 0) {
      console.warn('[InteractiveTimeline] SVG 尺寸為 0，使用降級坐標計算');
      
      // 降級方案：如果 viewBox 和容器尺寸比例相同，直接返回 SVG 坐標
      console.log(`[InteractiveTimeline] 降級方案 - 直接使用 SVG 坐標: (${svgPosition.x}, ${svgPosition.y})`);
      
      return {
        x: svgPosition.x,
        y: svgPosition.y
      };
    }
    
    // 計算縮放比例
    const scaleX = svgRect.width / viewBoxWidth;
    const scaleY = svgRect.height / viewBoxHeight;
    
    const isVertical = this.state?.currentBreakpoint === 'mobile';
    console.log(`[InteractiveTimeline] 坐標轉換 (${isVertical ? '垂直' : '水平'}): SVG(${svgPosition.x}, ${svgPosition.y}) -> 像素(${svgPosition.x * scaleX}, ${svgPosition.y * scaleY})`);
    console.log(`[InteractiveTimeline] viewBox: ${viewBoxWidth}x${viewBoxHeight}, 實際: ${svgRect.width}x${svgRect.height}, 縮放: ${scaleX}x${scaleY}`);
    
    return {
      x: svgPosition.x * scaleX,
      y: svgPosition.y * scaleY
    };
  }

  /**
   * 計算節點在路徑上的位置 - 根據時間分佈
   */
  calculateNodePosition(path, project, allProjects) {
    if (!path || allProjects.length === 0) {
      return { x: 0, y: 0 };
    }
    
    try {
      const pathLength = path.getTotalLength();
      console.log(`[InteractiveTimeline] 路徑長度: ${pathLength}, 專案: ${project.title}`);
      
      if (pathLength === 0) {
        console.error('[InteractiveTimeline] SVG 路徑長度為 0，使用降級方案');
        const container = this.element.querySelector('.timeline-viewport');
        const rect = container.getBoundingClientRect();
        const index = allProjects.indexOf(project);
        return {
          x: rect.width * 0.1 + (rect.width * 0.8 * (index / Math.max(allProjects.length - 1, 1))),
          y: rect.height * 0.5
        };
      }
      
      // 根據實際時間計算進度
      const projectDate = new Date(project.date);
      const dates = allProjects.map(p => new Date(p.date)).sort((a, b) => a - b);
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      
      // 優化的節點分佈演算法
      let progress;
      
      if (minDate.getTime() === maxDate.getTime()) {
        // 相同日期：均勻分佈所有節點
        const index = allProjects.findIndex(p => p.id === project.id);
        if (allProjects.length === 1) {
          progress = 0.5;
        } else {
          // 使用更大的分佈範圍，確保節點分散得更開
          progress = (index / (allProjects.length - 1)) * 0.9 + 0.05;
        }
      } else {
        // 不同日期：根據實際時間分佈，但加入防重疊機制
        const timeSpan = maxDate.getTime() - minDate.getTime();
        const projectOffset = projectDate.getTime() - minDate.getTime();
        let timeBasedProgress = (projectOffset / timeSpan) * 0.9 + 0.05;
        
        // 防重疊：檢查是否與其他節點太接近
        const minSpacing = 0.8 / Math.max(allProjects.length - 1, 1); // 最小間距
        const sortedProjects = allProjects.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        const currentIndex = sortedProjects.findIndex(p => p.id === project.id);
        
        // 確保節點之間有最小間距
        const idealProgress = (currentIndex / Math.max(allProjects.length - 1, 1)) * 0.9 + 0.05;
        
        // 在時間精確度和均勻分佈之間找平衡
        progress = timeBasedProgress * 0.7 + idealProgress * 0.3;
      }
      
      const point = path.getPointAtLength(pathLength * progress);
      
      // 手機版垂直佈局優化
      const isVertical = this.state.currentBreakpoint === 'mobile';
      if (isVertical) {
        // 垂直模式下，所有節點水平居中，只在垂直軸上分佈
        point.x = this.calculateSVGDimensions().width / 2; // 水平居中
        
        // 確保垂直分佈均勻
        const sortedByDate = allProjects.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        const currentIndex = sortedByDate.findIndex(p => p.id === project.id);
        const totalHeight = this.calculateSVGDimensions().height;
        
        // 在總高度的 80% 範圍內均勻分佈，上下各留 10% 邊距
        point.y = (totalHeight * 0.1) + (currentIndex / Math.max(allProjects.length - 1, 1)) * (totalHeight * 0.8);
      }
      
      console.log(`[InteractiveTimeline] 節點 ${project.title} 位置: (${point.x}, ${point.y})`);
      
      return {
        x: point.x,
        y: point.y
      };
    } catch (error) {
      console.error('[InteractiveTimeline] 計算節點位置失敗:', error);
      // 回傳預設位置
      const container = this.element.querySelector('.timeline-viewport');
      const rect = container?.getBoundingClientRect() || { width: 800, height: 400 };
      const projectIndex = allProjects.findIndex(p => p.id === project.id);
      return {
        x: rect.width * (projectIndex / Math.max(allProjects.length - 1, 1)),
        y: rect.height * 0.5
      };
    }
  }

  /**
   * 設定時間軸標記系統 - Step 2.2.2b 核心實作
   */
  setupTimelineMarkers() {
    console.log('[InteractiveTimeline] 設定時間軸年份標記系統');
    
    const markersContainer = this.element.querySelector('.timeline-markers');
    const svg = this.element.querySelector('.timeline-svg');
    const path = this.element.querySelector('.timeline-path');
    
    if (!markersContainer || !svg || !path) {
      console.error('[InteractiveTimeline] 標記容器或路徑元素未找到');
      return;
    }

    // 清空現有標記
    markersContainer.innerHTML = '';
    
    // 收集專案年份並生成標記
    this.generateYearMarkers(markersContainer, svg, path);
    this.generatePeriodMarkers(markersContainer);
    
    console.log('[InteractiveTimeline] 時間軸標記系統設定完成');
  }

  /**
   * 生成年份標記
   */
  generateYearMarkers(container, svg, path) {
    // 收集所有專案年份
    const years = [...new Set(this.timelineData.map(project => {
      return new Date(project.date).getFullYear();
    }))].sort();
    
    console.log('[InteractiveTimeline] 檢測到年份:', years);
    
    const isVertical = this.state.currentBreakpoint === 'mobile';
    
    years.forEach((year, index) => {
      // 計算年份標記在路徑上的位置
      const yearProgress = this.calculateYearProgress(year, years);
      const markerPosition = this.calculateMarkerPosition(path, yearProgress);
      
      // 創建年份標記元素
      const yearMarker = document.createElement('div');
      yearMarker.className = 'year-marker';
      yearMarker.style.animationDelay = `${index * 0.2}s`;
      
      if (isVertical) {
        yearMarker.style.left = '10px';
        yearMarker.style.top = `${markerPosition.y}px`;
      } else {
        yearMarker.style.left = `${markerPosition.x}px`;
        yearMarker.style.top = '10px';
      }
      
      yearMarker.innerHTML = `
        <div class="marker-line"></div>
        <div class="marker-label">${year}</div>
      `;
      
      container.appendChild(yearMarker);
    });
  }

  /**
   * 生成時期標記
   */
  generatePeriodMarkers(container) {
    const currentYear = new Date().getFullYear();
    const isVertical = this.state.currentBreakpoint === 'mobile';
    
    const periods = [
      { name: 'Current', years: [currentYear], color: '#4CAF50' },
      { name: 'Recent', years: [currentYear - 1], color: '#2196F3' },
      { name: 'Archive', years: [currentYear - 2, currentYear - 3, currentYear - 4], color: '#795548' }
    ];
    
    periods.forEach((period, index) => {
      const hasProjects = period.years.some(year => 
        this.timelineData.some(project => 
          new Date(project.date).getFullYear() === year
        )
      );
      
      if (!hasProjects) return;
      
      const periodMarker = document.createElement('div');
      periodMarker.className = 'period-marker';
      periodMarker.style.animationDelay = `${0.5 + index * 0.3}s`;
      
      // 根據時期設定位置和顏色
      if (isVertical) {
        periodMarker.style.left = '50px';
        periodMarker.style.right = '20px';
        periodMarker.style.top = `${60 + index * 80}px`;
        periodMarker.style.width = 'auto';
      } else {
        periodMarker.style.left = `${100 + index * 150}px`;
        periodMarker.style.right = 'auto';
        periodMarker.style.top = '60px';
        periodMarker.style.width = '120px';
      }
      
      periodMarker.style.setProperty('--period-color', period.color);
      periodMarker.innerHTML = `
        <div class="period-label">${period.name}</div>
      `;
      
      container.appendChild(periodMarker);
    });
  }

  /**
   * 計算年份在時間軸上的進度
   */
  calculateYearProgress(year, allYears) {
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    
    if (minYear === maxYear) return 0.5;
    
    return (year - minYear) / (maxYear - minYear);
  }

  /**
   * 計算標記在路徑上的位置
   */
  calculateMarkerPosition(path, progress) {
    try {
      const pathLength = path.getTotalLength();
      const point = path.getPointAtLength(pathLength * progress);
      
      // 轉換到實際坐標
      const svg = this.element.querySelector('.timeline-svg');
      return this.convertSVGToPixelCoordinates(svg, point);
    } catch (error) {
      console.warn('[InteractiveTimeline] 標記位置計算失敗:', error);
      return { x: 100, y: 200 };
    }
  }

  /**
   * 設定互動功能
   */
  setupInteractions() {
    console.log('[InteractiveTimeline] 設定節點互動功能');
    
    // 設定節點點擊事件
    this.nodes.forEach(node => {
      this.setupNodeInteraction(node);
    });
    
    // 設定導航按鈕
    this.setupNavigationControls();
    
    // 設定縮放控制
    this.setupZoomControls();
    
    console.log('[InteractiveTimeline] 互動功能設定完成');
  }

  /**
   * 設定單個節點互動
   */
  setupNodeInteraction(node) {
    const element = node.element;
    
    // 滑鼠進入效果
    element.addEventListener('mouseenter', () => {
      if (window.gsap) {
        window.gsap.to(element, {
          scale: this.config.animations.nodeHover.scale,
          duration: this.config.animations.nodeHover.duration,
          ease: "power2.out"
        });
        
        // 顯示標籤
        const label = element.querySelector('.node-label');
        if (label) {
          window.gsap.to(label, {
            opacity: 1,
            y: -5,
            duration: 0.3
          });
        }
      }
    });
    
    // 滑鼠離開效果
    element.addEventListener('mouseleave', () => {
      if (window.gsap) {
        const importanceScale = 0.8 + (node.data.importance / 5) * 0.4;
        window.gsap.to(element, {
          scale: importanceScale,
          duration: this.config.animations.nodeHover.duration,
          ease: "power2.out"
        });
        
        // 隱藏標籤
        const label = element.querySelector('.node-label');
        if (label) {
          window.gsap.to(label, {
            opacity: 0,
            y: 0,
            duration: 0.3
          });
        }
      }
    });
    
    // 點擊事件 (為 Step 2.2.3 準備)
    element.addEventListener('click', () => {
      this.handleNodeClickLegacy(node);
    });
  }

  /**
   * 處理節點點擊 (舊版本 - 將在 Step 2.2.3 更新為卡片飛出)
   */
  handleNodeClickLegacy(node) {
    console.log(`[InteractiveTimeline] 節點被點擊 (舊版): ${node.data.title}`);
    
    // 設定選中狀態
    this.state.selectedNode = node;
    
    // 移除其他節點的選中狀態
    this.nodes.forEach(n => n.element.classList.remove('selected'));
    node.element.classList.add('selected');
    
    // 節點點擊反饋動畫
    if (window.gsap) {
      window.gsap.to(node.element, {
        scale: 2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    
    // Step 2.2.3 將在這裡實作卡片飛出動畫
    console.log('[InteractiveTimeline] 卡片飛出動畫將在 Step 2.2.3 實作');
  }

  /**
   * 設定導航控制
   */
  setupNavigationControls() {
    const prevBtn = this.element.querySelector('.prev-btn');
    const nextBtn = this.element.querySelector('.next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateTimeline(-1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateTimeline(1));
    }
  }

  /**
   * 時間軸導航
   */
  navigateTimeline(direction) {
    console.log(`[InteractiveTimeline] 導航方向: ${direction > 0 ? '前進' : '後退'}`);
    
    this.currentPosition += direction;
    this.currentPosition = Math.max(0, Math.min(this.timelineData.length - 1, this.currentPosition));
    
    // 更新當前年份顯示
    this.updateCurrentYear();
    
    // Step 2.2.4 將實作完整的時間軸滾動
    console.log('[InteractiveTimeline] 時間軸滾動將在 Step 2.2.4 完善');
  }

  /**
   * 設定縮放控制
   */
  setupZoomControls() {
    const zoomInBtn = this.element.querySelector('[data-zoom="in"]');
    const zoomOutBtn = this.element.querySelector('[data-zoom="out"]');
    
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoomTimeline(1.2));
    }
    
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoomTimeline(0.8));
    }
  }

  /**
   * 時間軸縮放
   */
  zoomTimeline(scale) {
    console.log(`[InteractiveTimeline] 縮放比例: ${scale}`);
    
    const viewport = this.element.querySelector('.timeline-viewport');
    if (viewport && window.gsap) {
      window.gsap.to(viewport, {
        scale: scale,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }

  /**
   * 更新當前年份顯示
   */
  updateCurrentYear() {
    const yearElement = this.element.querySelector('.current-year');
    if (yearElement && this.timelineData[this.currentPosition]) {
      const currentProject = this.timelineData[this.currentPosition];
      const year = new Date(currentProject.date).getFullYear();
      yearElement.textContent = year;
    }
  }

  /**
   * 設定響應式處理
   */
  setupResponsiveHandling() {
    console.log('[InteractiveTimeline] 設定響應式處理');
    
    // 初始設定當前年份
    this.updateCurrentYear();
    
    // 監聽視窗大小變化
    const handleResize = this.debounce(() => {
      const newBreakpoint = this.detectBreakpoint();
      if (newBreakpoint !== this.state.currentBreakpoint) {
        this.state.currentBreakpoint = newBreakpoint;
        this.rebuildTimeline();
        
        // 更新觸控狀態 (Step 2.2.4b)
        if (this.state.touch) {
          this.state.touch.isEnabled = newBreakpoint === 'mobile';
          console.log('[TouchGesture] 更新觸控狀態:', this.state.touch.isEnabled);
        }
      }
    }, 300);
    
    window.addEventListener('resize', handleResize);
    
    console.log('[InteractiveTimeline] 響應式處理設定完成');
  }

  /**
   * 重建時間軸 (響應式切換時)
   */
  rebuildTimeline() {
    console.log('[InteractiveTimeline] 重建時間軸以適應新的斷點');
    
    // 重新生成路徑和節點
    this.setupTimeline();
    this.setupNodes();
    this.setupInteractions();
  }

  /**
   * 錯誤處理
   */
  handleInitializationError(error) {
    console.error('[InteractiveTimeline] 初始化錯誤:', error);
    if (this.element) {
      this.element.innerHTML = `
        <div style="color: #e74c3c; text-align: center; padding: 40px;">
          ❌ 互動時間軸載入失敗: ${error.message}
          <br><br>
          <button onclick="this.parentElement.parentElement.retry()" 
                  style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer;">
            🔄 重試
          </button>
        </div>
      `;
      
      this.element.retry = () => this.init();
    }
  }

  /**
   * 獲取DOM元素
   */
  getElement() {
    return this.element;
  }

  /**
   * 在元素添加到 DOM 後進行設定 - 修正 Step 2.2.2 時序問題
   */
  setupAfterMount() {
    if (!this.element || !this.element.parentNode) {
      console.error('[InteractiveTimeline] 元素未添加到 DOM，無法進行設定');
      return;
    }

    try {
      console.log('[InteractiveTimeline] 開始執行 DOM 掛載後設定');
      
      // 使用雙重 requestAnimationFrame 確保 SVG 完全渲染
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupTimeline();
          this.setupNodes();
          this.setupTimelineMarkers(); // Step 2.2.2b 新增
          this.setupParticleSystem(); // Step 2.2.2c 新增
          this.setupInteractions();
          this.setupResponsiveHandling();
          this.setupYearFilter(); // Step 2.2.4a 新增年份篩選
          this.setupTouchGestures(); // Step 2.2.4b 新增觸控手勢
          this.setupDesktopEnhancements(); // Step 2.2.4c 新增桌面端增強
          console.log('[InteractiveTimeline] DOM 掛載後設定完成');
        });
      });
      
    } catch (error) {
      console.error('[InteractiveTimeline] DOM 掛載後設定失敗:', error);
    }
  }

  /**
   * 設定年份篩選系統 (Step 2.2.4a)
   */
  setupYearFilter() {
    if (!this.config.yearFilter.enabled) {
      console.log('[InteractiveTimeline] 年份篩選功能已停用');
      return;
    }

    console.log('[InteractiveTimeline] 初始化年份篩選系統');

    // 收集所有可用年份
    this.collectAvailableYears();

    // 填充年份選項
    this.populateYearOptions();

    // 設定事件監聽器
    this.setupYearFilterEvents();

    // 初始化顯示狀態
    this.updateFilterStatus();
    this.updateCurrentYearDisplay();

    console.log('[InteractiveTimeline] 年份篩選系統初始化完成');
  }

  /**
   * 收集所有可用年份
   */
  collectAvailableYears() {
    const years = [...new Set(this.timelineData.map(project => {
      return new Date(project.date).getFullYear();
    }))].sort((a, b) => b - a); // 降序排列，最新年份在前

    this.state.yearFilter.availableYears = years;
    console.log('[InteractiveTimeline] 收集到年份:', years);
  }

  /**
   * 填充年份下拉選項
   */
  populateYearOptions() {
    const yearSelector = this.element.querySelector('.year-selector');
    if (!yearSelector) {
      console.error('[InteractiveTimeline] 年份選擇器元素未找到');
      return;
    }

    // 清空現有選項（保留"顯示所有"選項）
    const allOption = yearSelector.querySelector('option[value=""]');
    yearSelector.innerHTML = '';
    if (allOption) {
      yearSelector.appendChild(allOption);
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '顯示所有';
      yearSelector.appendChild(defaultOption);
    }

    // 添加年份選項
    this.state.yearFilter.availableYears.forEach(year => {
      const option = document.createElement('option');
      option.value = year.toString();
      option.textContent = `${year}年`;
      yearSelector.appendChild(option);
    });

    console.log('[InteractiveTimeline] 年份選項已填充');
  }

  /**
   * 設定年份篩選事件監聽器
   */
  setupYearFilterEvents() {
    const yearSelector = this.element.querySelector('.year-selector');
    if (!yearSelector) {
      console.error('[InteractiveTimeline] 年份選擇器元素未找到');
      return;
    }

    console.log('[DEBUG] 找到年份選擇器:', yearSelector);
    console.log('[DEBUG] 年份選擇器樣式:', window.getComputedStyle(yearSelector));
    
    // 添加多種事件監聽器來調試
    yearSelector.addEventListener('click', (event) => {
      console.log('[DEBUG] 年份選擇器被點擊:', event);
    });
    
    yearSelector.addEventListener('mousedown', (event) => {
      console.log('[DEBUG] 年份選擇器 mousedown:', event);
    });
    
    yearSelector.addEventListener('focus', (event) => {
      console.log('[DEBUG] 年份選擇器獲得焦點:', event);
    });

    yearSelector.addEventListener('change', (event) => {
      console.log('[DEBUG] 年份選擇器值變化:', event.target.value);
      const selectedYear = event.target.value;
      this.applyYearFilter(selectedYear);
    });

    console.log('[InteractiveTimeline] 年份篩選事件監聽器已設定');
  }

  /**
   * 應用年份篩選
   */
  applyYearFilter(year) {
    console.log(`[InteractiveTimeline] 應用年份篩選: ${year || '顯示所有'}`);

    this.state.yearFilter.selectedYear = year || null;
    this.state.yearFilter.isFiltering = !!year;

    // 篩選專案數據
    if (year) {
      this.state.yearFilter.filteredProjects = this.timelineData.filter(project => {
        const projectYear = new Date(project.date).getFullYear();
        return projectYear.toString() === year;
      });
    } else {
      this.state.yearFilter.filteredProjects = [...this.timelineData];
    }

    // 更新節點可見性
    this.updateNodesVisibility();

    // 更新狀態顯示
    this.updateFilterStatus();
    this.updateCurrentYearDisplay();

    // 觸發自定義事件
    this.element.dispatchEvent(new CustomEvent('yearFilterChanged', {
      detail: {
        selectedYear: year,
        filteredProjects: this.state.yearFilter.filteredProjects,
        totalProjects: this.timelineData.length
      }
    }));
  }

  /**
   * 更新節點可見性 - Step 2.2.4d 立即響應版本
   */
  updateNodesVisibility() {
    const { selectedYear, filteredProjects } = this.state.yearFilter;
    
    // Step 2.2.4d: 立即切換，無動畫延遲

    this.nodes.forEach((node, index) => {
      const project = node.data;
      const projectYear = new Date(project.date).getFullYear();
      const shouldShow = !selectedYear || projectYear.toString() === selectedYear;

      
      if (shouldShow) {
        // 立即顯示節點
        const importanceScale = 0.8 + (project.importance / 5) * 0.4;
        node.element.style.opacity = '1';
        node.element.style.transform = `translate(-50%, -50%) scale(${importanceScale})`;
        node.element.style.visibility = 'visible';
        node.element.style.pointerEvents = 'auto';
      } else {
        // 立即隱藏節點
        node.element.style.opacity = '0';
        node.element.style.transform = 'translate(-50%, -50%) scale(0)';
        node.element.style.visibility = 'hidden';
        node.element.style.pointerEvents = 'none';
      }
    });
    
    console.log(`[InteractiveTimeline] 節點可見性立即更新: ${selectedYear || '顯示所有'}`);
    
    // Step 2.2.4d: 年份切換後自動居中
    if (selectedYear && this.config.yearFilter.autoCenter) {
      this.centerViewportOnYear(selectedYear);
    }
  }

  /**
   * Step 2.2.4d: 視窗自動居中到指定年份
   */
  centerViewportOnYear(selectedYear) {
    const yearNodes = this.nodes.filter(node => {
      const projectYear = new Date(node.data.date).getFullYear();
      return projectYear.toString() === selectedYear;
    });
    
    if (yearNodes.length === 0) {
      console.warn(`[InteractiveTimeline] 未找到 ${selectedYear} 年的節點`);
      return;
    }
    
    // 計算年份節點的邊界框
    const bounds = this.calculateNodesBounds(yearNodes);
    
    // 計算視窗居中偏移
    const centerOffset = this.calculateCenterOffset(bounds);
    
    // 應用視窗變換
    this.applyViewportTransform(centerOffset);
    
    console.log(`[InteractiveTimeline] 視窗自動居中到 ${selectedYear} 年，偏移: (${centerOffset.x}, ${centerOffset.y})`);
  }

  /**
   * 計算節點邊界框 - Step 2.2.4d 修復座標計算
   */
  calculateNodesBounds(nodes) {
    if (nodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, centerX: 0, centerY: 0 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      // 修復：使用節點創建時儲存的正確位置
      let x, y;
      
      if (node.position) {
        // 使用已儲存的像素座標
        x = node.position.x;
        y = node.position.y;
      } else {
        // 回退方案：從 style 屬性解析
        const nodeStyle = node.element.style;
        x = parseFloat(nodeStyle.left) || 0;
        y = parseFloat(nodeStyle.top) || 0;
      }
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      console.log(`[DEBUG] 節點 ${node.data.title} 位置: (${x}, ${y})`);
    });
    
    const bounds = {
      minX,
      maxX,
      minY,
      maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    };
    
    console.log(`[DEBUG] 節點邊界框:`, bounds);
    return bounds;
  }

  /**
   * 計算居中偏移量 - Step 2.2.4d 修復偏移計算
   */
  calculateCenterOffset(bounds) {
    const viewport = this.element.querySelector('.timeline-viewport');
    
    const viewportCenterX = viewport.clientWidth / 2;
    const viewportCenterY = viewport.clientHeight / 2;
    
    // 獲取當前變換狀態
    const timelineContent = this.element.querySelector('.timeline-content');
    const currentTransform = timelineContent.style.transform || '';
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    
    // 計算需要移動的距離讓節點中心對齊視窗中心
    // 節點位置已經是像素坐標，不需要再次縮放調整
    const targetX = viewportCenterX - bounds.centerX;
    const targetY = viewportCenterY - bounds.centerY;
    
    console.log(`[DEBUG] 視窗中心: (${viewportCenterX}, ${viewportCenterY})`);
    console.log(`[DEBUG] 節點中心: (${bounds.centerX}, ${bounds.centerY})`);
    console.log(`[DEBUG] 當前縮放: ${currentScale}`);
    console.log(`[DEBUG] 目標偏移: (${targetX}, ${targetY})`);
    
    return {
      x: targetX,
      y: targetY
    };
  }

  /**
   * 應用視窗變換
   */
  applyViewportTransform(offset) {
    const timelineContent = this.element.querySelector('.timeline-content');
    if (!timelineContent) {
      console.log('[InteractiveTimeline] applyViewportTransform: timelineContent 未找到');
      return;
    }
    
    // 獲取當前變換
    const currentTransform = timelineContent.style.transform || '';
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    const currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    
    console.log(`[InteractiveTimeline] 當前變換: ${currentTransform}, 縮放: ${currentScale}`);
    console.log(`[InteractiveTimeline] 目標偏移: (${offset.x}, ${offset.y})`);
    
    // 計算邊界限制
    const viewport = this.element.querySelector('.timeline-viewport');
    const contentDimensions = this.calculateSVGDimensions();
    
    if (viewport) {
      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;
      const scaledContentWidth = contentDimensions.width * currentScale;
      const scaledContentHeight = contentDimensions.height * currentScale;
      
      console.log(`[InteractiveTimeline] 視窗尺寸: ${viewportWidth}x${viewportHeight}`);
      console.log(`[InteractiveTimeline] 內容尺寸: ${contentDimensions.width}x${contentDimensions.height} (縮放後: ${scaledContentWidth}x${scaledContentHeight})`);
      
      // 設定合理的邊界限制 - 允許足夠的移動空間用於年份切換
      const padding = Math.max(viewportWidth, viewportHeight); // 預留足夠的移動空間
      const maxTranslateX = scaledContentWidth + padding;
      const minTranslateX = -scaledContentWidth - padding;
      const maxTranslateY = scaledContentHeight + padding;
      const minTranslateY = -scaledContentHeight - padding;
      
      console.log(`[InteractiveTimeline] X 邊界: ${minTranslateX} ~ ${maxTranslateX}`);
      console.log(`[InteractiveTimeline] Y 邊界: ${minTranslateY} ~ ${maxTranslateY}`);
      
      // 應用邊界限制但保持足夠寬鬆以支持年份切換
      const boundedX = Math.max(minTranslateX, Math.min(maxTranslateX, offset.x));
      const boundedY = Math.max(minTranslateY, Math.min(maxTranslateY, offset.y));
      
      console.log(`[InteractiveTimeline] 邊界處理後偏移: (${boundedX}, ${boundedY})`);
      
      // 檢查是否啟用動畫
      const useAnimation = window.gsap && 
                          this.config.yearFilter && 
                          this.config.yearFilter.centerAnimation && 
                          this.config.yearFilter.centerAnimation.enabled;
                          
      console.log(`[InteractiveTimeline] 使用動畫: ${useAnimation}`);
      
      // 平滑過渡到新位置（如果啟用動畫）
      if (useAnimation) {
        console.log(`[InteractiveTimeline] 執行 GSAP 動畫到: translateX(${boundedX}px) translateY(${boundedY}px) scale(${currentScale})`);
        window.gsap.to(timelineContent, {
          duration: this.config.yearFilter.centerAnimation.duration || 0.8,
          ease: this.config.yearFilter.centerAnimation.easing || 'power2.out',
          transform: `translateX(${boundedX}px) translateY(${boundedY}px) scale(${currentScale})`,
          onComplete: () => {
            console.log('[InteractiveTimeline] GSAP 動畫完成');
            // 更新桌面端狀態
            if (this.state.desktop) {
              this.state.desktop.translateX = boundedX;
              this.state.desktop.translateY = boundedY;
            }
          }
        });
      } else {
        // 立即設定（無動畫或GSAP未載入）
        const newTransform = `translateX(${boundedX}px) translateY(${boundedY}px) scale(${currentScale})`;
        console.log(`[InteractiveTimeline] 立即設定變換: ${newTransform}`);
        timelineContent.style.transform = newTransform;
        
        if (this.state.desktop) {
          this.state.desktop.translateX = boundedX;
          this.state.desktop.translateY = boundedY;
        }
        
        // 確認設定是否成功
        setTimeout(() => {
          const actualTransform = timelineContent.style.transform;
          console.log(`[InteractiveTimeline] 設定後實際變換: ${actualTransform}`);
        }, 100);
      }
    }
  }

  /**
   * 更新篩選狀態顯示
   */
  updateFilterStatus() {
    const statusElement = this.element.querySelector('.filtered-count');
    if (!statusElement) return;

    const { filteredProjects } = this.state.yearFilter;
    const totalProjects = this.timelineData.length;

    if (this.state.yearFilter.isFiltering) {
      statusElement.textContent = `${filteredProjects.length}/${totalProjects} 個專案`;
    } else {
      statusElement.textContent = `${totalProjects} 個專案`;
    }
  }

  /**
   * 更新當前年份顯示
   */
  updateCurrentYearDisplay() {
    const currentYearElement = this.element.querySelector('.current-year');
    if (!currentYearElement) return;

    const { selectedYear } = this.state.yearFilter;

    if (selectedYear) {
      // 顯示選中的特定年份
      currentYearElement.textContent = selectedYear;
    } else {
      // 顯示所有年份時，顯示年份範圍
      if (this.state.yearFilter.availableYears.length > 0) {
        const years = [...this.state.yearFilter.availableYears].sort((a, b) => a - b);
        const minYear = years[0];
        const maxYear = years[years.length - 1];
        
        if (minYear === maxYear) {
          currentYearElement.textContent = minYear.toString();
        } else {
          currentYearElement.textContent = `${minYear}~${maxYear}`;
        }
      } else if (this.timelineData.length > 0) {
        // 降級方案：從專案數據計算
        const years = [...new Set(this.timelineData.map(project => {
          return new Date(project.date).getFullYear();
        }))].sort((a, b) => a - b);
        
        const minYear = years[0];
        const maxYear = years[years.length - 1];
        currentYearElement.textContent = minYear === maxYear ? minYear.toString() : `${minYear}~${maxYear}`;
      }
    }
  }

  /**
   * 初始化粒子系統 (Step 2.2.2c)
   */
  setupParticleSystem() {
    console.log('[InteractiveTimeline] 初始化背景粒子流動系統');
    
    if (!this.config.particles.enabled) {
      console.log('[InteractiveTimeline] 粒子系統已停用');
      return;
    }
    
    const canvas = this.element.querySelector('.particles-canvas');
    if (!canvas) {
      console.error('[InteractiveTimeline] 粒子 Canvas 元素未找到');
      return;
    }
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('[InteractiveTimeline] Canvas Context 取得失敗');
      return;
    }
    
    // 設定響應式 Canvas 尺寸
    this.setupCanvasSize(canvas);
    
    // 初始化粒子狀態
    this.state.particles.canvas = canvas;
    this.state.particles.context = context;
    this.state.particles.isActive = true;
    
    // 創建粒子池
    this.createParticlePool();
    
    // 啟動動畫循環
    this.startParticleAnimation();
    
    // 標記粒子容器為活躍
    const particleContainer = this.element.querySelector('.timeline-particles');
    if (particleContainer) {
      particleContainer.classList.add('active');
    }
    
    console.log('[InteractiveTimeline] 粒子系統初始化完成');
  }
  
  /**
   * 設定響應式 Canvas 尺寸
   */
  setupCanvasSize(canvas) {
    const container = canvas.closest('.timeline-viewport');
    if (!container) return;
    
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // 設定顯示尺寸
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // 設定實際解析度
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // 縮放 context 以適應 DPI
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
  }
  
  /**
   * 創建粒子對象池
   */
  createParticlePool() {
    const breakpoint = this.state.currentBreakpoint;
    const particleConfig = this.config.particles.performance[breakpoint] || this.config.particles;
    const count = particleConfig.count || this.config.particles.count;
    
    this.state.particles.particlePool = [];
    
    for (let i = 0; i < count; i++) {
      this.state.particles.particlePool.push(this.createParticle());
    }
    
    console.log(`[InteractiveTimeline] 創建 ${count} 個粒子 (${breakpoint})`);
  }
  
  /**
   * 創建單個粒子
   */
  createParticle() {
    const canvas = this.state.particles.canvas;
    const isVertical = this.state.currentBreakpoint === 'mobile';
    const colors = this.config.particles.colors;
    const sizeConfig = this.config.particles.size;
    const speedConfig = this.config.particles.speed;
    const opacityConfig = this.config.particles.opacity;
    
    // 使用顯示尺寸而非像素尺寸
    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;
    
    return {
      // 位置 - 初始隨機分佈
      x: Math.random() * displayWidth,
      y: Math.random() * displayHeight,
      
      // 起始位置 (用於重生)
      startX: isVertical ? Math.random() * displayWidth : -10,
      startY: isVertical ? -10 : Math.random() * displayHeight,
      
      // 速度
      vx: isVertical ? 
          (Math.random() - 0.5) * 0.5 : 
          speedConfig.min + Math.random() * (speedConfig.max - speedConfig.min),
      vy: isVertical ? 
          speedConfig.min + Math.random() * (speedConfig.max - speedConfig.min) :
          (Math.random() - 0.5) * 0.5,
      
      // 視覺屬性
      size: sizeConfig.min + Math.random() * (sizeConfig.max - sizeConfig.min),
      opacity: opacityConfig.min + Math.random() * (opacityConfig.max - opacityConfig.min),
      color: colors[Math.floor(Math.random() * colors.length)],
      
      // 生命週期
      life: 1.0,
      maxLife: 1.0,
      
      // 動畫屬性
      pulse: Math.random() * Math.PI * 2, // 脈衝相位
      pulseSpeed: 0.02 + Math.random() * 0.02
    };
  }
  
  /**
   * 啟動粒子動畫循環
   */
  startParticleAnimation() {
    if (this.state.particles.animationFrame) {
      cancelAnimationFrame(this.state.particles.animationFrame);
    }
    
    // Step 2.2.4b: 獲取性能配置
    const breakpoint = this.state.currentBreakpoint;
    const particleConfig = this.config.particles.performance[breakpoint] || this.config.particles;
    const targetFrameRate = particleConfig.frameRate || 60;
    const frameInterval = 1000 / targetFrameRate; // ms per frame
    
    let lastFrameTime = 0;
    
    const animate = (currentTime) => {
      if (!this.state.particles.isActive) return;
      
      // 幀率控制
      if (currentTime - lastFrameTime >= frameInterval) {
        this.updateParticles();
        this.renderParticles();
        lastFrameTime = currentTime;
      }
      
      this.state.particles.animationFrame = requestAnimationFrame(animate);
    };
    
    animate(0);
  }
  
  /**
   * 更新粒子位置和狀態
   */
  updateParticles() {
    const canvas = this.state.particles.canvas;
    const particles = this.state.particles.particlePool;
    const isVertical = this.state.currentBreakpoint === 'mobile';
    
    // 使用顯示尺寸進行邊界檢測
    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;
    
    particles.forEach(particle => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 更新脈衝動畫
      particle.pulse += particle.pulseSpeed;
      
      // 檢查邊界並重生粒子
      let needsRespawn = false;
      
      if (isVertical) {
        // 垂直流動：從上到下
        if (particle.y > displayHeight + 20) {
          needsRespawn = true;
        }
      } else {
        // 水平流動：從左到右
        if (particle.x > displayWidth + 20) {
          needsRespawn = true;
        }
      }
      
      // 重生粒子 - 從邊界外重新開始
      if (needsRespawn && this.config.particles.respawn) {
        if (isVertical) {
          // 垂直流動重生在頂部
          particle.x = Math.random() * displayWidth;
          particle.y = -10;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = this.config.particles.speed.min + Math.random() * (this.config.particles.speed.max - this.config.particles.speed.min);
        } else {
          // 水平流動重生在左側
          particle.x = -10;
          particle.y = Math.random() * displayHeight;
          particle.vx = this.config.particles.speed.min + Math.random() * (this.config.particles.speed.max - this.config.particles.speed.min);
          particle.vy = (Math.random() - 0.5) * 0.5;
        }
        // 重置其他屬性
        particle.pulse = Math.random() * Math.PI * 2;
        particle.opacity = this.config.particles.opacity.min + Math.random() * (this.config.particles.opacity.max - this.config.particles.opacity.min);
      }
    });
  }
  
  /**
   * 渲染粒子到 Canvas
   */
  renderParticles() {
    const canvas = this.state.particles.canvas;
    const ctx = this.state.particles.context;
    const particles = this.state.particles.particlePool;
    
    // 使用顯示尺寸清空畫布（因為 ctx 已經被縮放）
    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    
    // 渲染每個粒子
    particles.forEach(particle => {
      const pulseFactor = 0.8 + 0.2 * Math.sin(particle.pulse);
      const renderSize = particle.size * pulseFactor;
      const renderOpacity = particle.opacity * pulseFactor;
      
      ctx.save();
      
      // 設定粒子樣式
      ctx.globalAlpha = renderOpacity;
      ctx.fillStyle = particle.color;
      
      // 繪製發光效果
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = renderSize * 3;
      
      // 繪製粒子
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, renderSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }
  
  /**
   * 停止粒子系統
   */
  stopParticleSystem() {
    this.state.particles.isActive = false;
    
    if (this.state.particles.animationFrame) {
      cancelAnimationFrame(this.state.particles.animationFrame);
      this.state.particles.animationFrame = null;
    }
    
    const particleContainer = this.element?.querySelector('.timeline-particles');
    if (particleContainer) {
      particleContainer.classList.remove('active');
    }
    
    console.log('[InteractiveTimeline] 粒子系統已停止');
  }

  /**
   * 設定觸控手勢系統 (Step 2.2.4b)
   */
  setupTouchGestures() {
    const timelineContainer = this.element.querySelector('.timeline-container');
    if (!timelineContainer) {
      console.warn('[InteractiveTimeline] 找不到時間軸容器，跳過觸控手勢設定');
      return;
    }

    // 初始化觸控狀態
    this.state.touch = {
      isEnabled: this.state.currentBreakpoint === 'mobile',
      isDragging: false,
      startY: 0,
      currentY: 0,
      velocity: 0,
      lastMoveTime: 0,
      scrollOffset: 0,
      maxScroll: 0
    };

    // 只在移動端啟用觸控手勢
    if (!this.state.touch.isEnabled) {
      console.log('[InteractiveTimeline] 非移動端，跳過觸控手勢設定');
      return;
    }

    console.log('[InteractiveTimeline] 設定移動端觸控拖曳手勢');

    // 觸控開始
    timelineContainer.addEventListener('touchstart', (event) => {
      this.handleTouchStart(event);
    }, { passive: false });

    // 觸控移動
    timelineContainer.addEventListener('touchmove', (event) => {
      this.handleTouchMove(event);
    }, { passive: false });

    // 觸控結束
    timelineContainer.addEventListener('touchend', (event) => {
      this.handleTouchEnd(event);
    }, { passive: true });

    // 計算可滾動範圍
    this.updateScrollBounds();
  }

  /**
   * 處理觸控開始事件
   */
  handleTouchStart(event) {
    if (event.touches.length !== 1) return; // 只處理單指觸控

    this.state.touch.isDragging = true;
    this.state.touch.startY = event.touches[0].clientY;
    this.state.touch.currentY = event.touches[0].clientY;
    this.state.touch.velocity = 0;
    this.state.touch.lastMoveTime = Date.now();

    // 停止當前動畫
    if (this.state.touch.animationFrame) {
      cancelAnimationFrame(this.state.touch.animationFrame);
      this.state.touch.animationFrame = null;
    }

    console.log('[TouchGesture] 觸控開始:', event.touches[0].clientY);
  }

  /**
   * 處理觸控移動事件
   */
  handleTouchMove(event) {
    if (!this.state.touch.isDragging || event.touches.length !== 1) return;

    event.preventDefault(); // 防止頁面滾動

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - this.state.touch.currentY;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.state.touch.lastMoveTime;

    // 計算速度
    if (deltaTime > 0) {
      this.state.touch.velocity = deltaY / deltaTime;
    }

    // 更新滾動偏移
    this.state.touch.scrollOffset -= deltaY * 0.5; // 減速係數
    this.state.touch.scrollOffset = Math.max(0, Math.min(this.state.touch.scrollOffset, this.state.touch.maxScroll));

    // 應用滾動變換
    this.applyScrollTransform();

    this.state.touch.currentY = currentY;
    this.state.touch.lastMoveTime = currentTime;
  }

  /**
   * 處理觸控結束事件
   */
  handleTouchEnd(event) {
    if (!this.state.touch.isDragging) return;

    this.state.touch.isDragging = false;

    // 慣性滾動
    if (Math.abs(this.state.touch.velocity) > 0.1) {
      this.startInertiaAnimation();
    }

    console.log('[TouchGesture] 觸控結束，速度:', this.state.touch.velocity);
  }

  /**
   * 開始慣性動畫
   */
  startInertiaAnimation() {
    const animate = () => {
      // 速度衰減
      this.state.touch.velocity *= 0.95;

      // 更新位置
      this.state.touch.scrollOffset -= this.state.touch.velocity * 16;
      this.state.touch.scrollOffset = Math.max(0, Math.min(this.state.touch.scrollOffset, this.state.touch.maxScroll));

      this.applyScrollTransform();

      // 繼續動畫或停止
      if (Math.abs(this.state.touch.velocity) > 0.01) {
        this.state.touch.animationFrame = requestAnimationFrame(animate);
      } else {
        this.state.touch.animationFrame = null;
      }
    };

    this.state.touch.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * 應用滾動變換
   */
  applyScrollTransform() {
    const timelineViewport = this.element.querySelector('.timeline-viewport');
    if (timelineViewport) {
      timelineViewport.style.transform = `translateY(-${this.state.touch.scrollOffset}px)`;
    }
  }

  /**
   * 更新滾動邊界
   */
  updateScrollBounds() {
    const container = this.element.querySelector('.timeline-container');
    const viewport = this.element.querySelector('.timeline-viewport');
    
    if (container && viewport) {
      const containerHeight = container.clientHeight;
      const viewportHeight = viewport.scrollHeight;
      this.state.touch.maxScroll = Math.max(0, viewportHeight - containerHeight + 100); // 額外100px緩衝
      
      console.log('[TouchGesture] 滾動邊界:', {
        container: containerHeight,
        viewport: viewportHeight,
        maxScroll: this.state.touch.maxScroll
      });
    }
  }

  /**
   * 設定桌面端增強功能 (Step 2.2.4c)
   */
  setupDesktopEnhancements() {
    // 只在桌面端啟用（包含平板）
    if (this.state.currentBreakpoint === 'mobile') {
      console.log('[InteractiveTimeline] 移動端，跳過桌面端增強功能');
      return;
    }

    console.log('[InteractiveTimeline] 設定桌面端增強功能');

    // 初始化桌面端狀態
    this.state.desktop = {
      zoom: 1,
      minZoom: 0.5,
      maxZoom: 2,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      currentX: 0,
      currentY: 0,
      translateX: 0,
      translateY: 0,
      maxTranslateX: 0,
      maxTranslateY: 0
    };

    const timelineContainer = this.element.querySelector('.timeline-container');
    if (!timelineContainer) return;

    // 設定滑鼠滾輪縮放
    this.setupMouseWheelZoom(timelineContainer);
    
    // 設定水平拖曳
    this.setupHorizontalDrag(timelineContainer);
    
    // 設定鍵盤快捷鍵
    this.setupKeyboardShortcuts();
    
    // 增強視覺特效
    this.enhanceVisualEffects();
  }

  /**
   * 設定滑鼠滾輪縮放功能
   */
  setupMouseWheelZoom(container) {
    container.addEventListener('wheel', (event) => {
      // 只在按住 Ctrl 或 Cmd 時縮放
      if (!event.ctrlKey && !event.metaKey) return;
      
      event.preventDefault();
      
      const viewport = this.element.querySelector('.timeline-viewport');
      if (!viewport) return;

      // 計算縮放
      const delta = event.deltaY * -0.001;
      const newZoom = Math.max(
        this.state.desktop.minZoom,
        Math.min(this.state.desktop.maxZoom, this.state.desktop.zoom + delta)
      );

      // 計算縮放中心點
      const rect = container.getBoundingClientRect();
      const centerX = (event.clientX - rect.left) / rect.width;

      // 應用縮放
      this.state.desktop.zoom = newZoom;
      const timelineContent = this.element.querySelector('.timeline-content');
      if (timelineContent) {
        const translateX = this.state.desktop.translateX || 0;
        const translateY = this.state.desktop.translateY || 0;
        timelineContent.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${newZoom})`;
        timelineContent.style.transformOrigin = `${centerX * 100}% center`;
      }

      console.log('[DesktopEnhancement] 縮放:', newZoom.toFixed(2));
    }, { passive: false });
  }

  /**
   * 設定水平拖曳功能
   */
  setupHorizontalDrag(container) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    // 滑鼠按下
    container.addEventListener('mousedown', (event) => {
      // 忽略節點點擊和年份選擇器點擊
      if (event.target.closest('.project-node') || 
          event.target.closest('.timeline-year-filter') ||
          event.target.closest('.year-selector')) {
        console.log('[DEBUG] 跳過拖曳: 點擊在', event.target.closest('.project-node') ? '節點' : '年份選擇器');
        return;
      }
      
      console.log('[DEBUG] 開始拖曳:', event.target);
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      
      const timelineContent = this.element.querySelector('.timeline-content');
      if (timelineContent) {
        const transform = timelineContent.style.transform || '';
        const translateXMatch = transform.match(/translateX\(([^)]+)px\)/);
        const translateYMatch = transform.match(/translateY\(([^)]+)px\)/);
        initialTranslateX = translateXMatch ? parseFloat(translateXMatch[1]) : 0;
        initialTranslateY = translateYMatch ? parseFloat(translateYMatch[1]) : 0;
      }
      container.style.cursor = 'grabbing';
      
      event.preventDefault();
    });

    // 滑鼠移動
    window.addEventListener('mousemove', (event) => {
      if (!isDragging) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const timelineContent = this.element.querySelector('.timeline-content');
      
      if (timelineContent) {
        let newTranslateX = initialTranslateX + deltaX;
        let newTranslateY = initialTranslateY + deltaY;
        
        // 計算邊界限制
        const viewport = this.element.querySelector('.timeline-viewport');
        const contentDimensions = this.calculateSVGDimensions();
        
        if (viewport) {
          const viewportWidth = viewport.clientWidth;
          const viewportHeight = viewport.clientHeight;
          
          // 水平邊界限制
          const maxTranslateX = 0;
          const minTranslateX = Math.min(0, viewportWidth - contentDimensions.width);
          
          // 垂直邊界限制
          const maxTranslateY = 0;
          const minTranslateY = Math.min(0, viewportHeight - contentDimensions.height);
          
          newTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
          newTranslateY = Math.max(minTranslateY, Math.min(maxTranslateY, newTranslateY));
          
          const zoom = this.state.desktop.zoom || 1;
          timelineContent.style.transform = `translateX(${newTranslateX}px) translateY(${newTranslateY}px) scale(${zoom})`;
          
          this.state.desktop.translateX = newTranslateX;
          this.state.desktop.translateY = newTranslateY;
        }
      }
    });

    // 滑鼠放開
    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    // 預設游標
    container.style.cursor = 'grab';
  }

  /**
   * 設定鍵盤快捷鍵
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // 只在時間軸有焦點時響應
      if (!this.element?.contains(document.activeElement) && 
          document.activeElement !== document.body) return;

      const timelineContent = this.element?.querySelector('.timeline-content');
      if (!timelineContent) return;

      switch(event.key) {
        case '+':
        case '=':
          // 放大
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.state.desktop.zoom = Math.min(this.state.desktop.maxZoom, this.state.desktop.zoom + 0.1);
            const translateX = this.state.desktop.translateX || 0;
            const translateY = this.state.desktop.translateY || 0;
            timelineContent.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${this.state.desktop.zoom})`;
          }
          break;
        case '-':
          // 縮小
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.state.desktop.zoom = Math.max(this.state.desktop.minZoom, this.state.desktop.zoom - 0.1);
            const translateX = this.state.desktop.translateX || 0;
            const translateY = this.state.desktop.translateY || 0;
            timelineContent.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${this.state.desktop.zoom})`;
          }
          break;
        case '0':
          // 重置縮放
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.state.desktop.zoom = 1;
            this.state.desktop.translateX = 0;
            timelineContent.style.transform = 'translateX(0px) translateY(0px) scale(1)';
          }
          break;
        case 'ArrowLeft':
          // 向左滾動
          this.state.desktop.translateX += 50;
          const leftTranslateY = this.state.desktop.translateY || 0;
          timelineContent.style.transform = `translateX(${this.state.desktop.translateX}px) translateY(${leftTranslateY}px) scale(${this.state.desktop.zoom})`;
          break;
        case 'ArrowRight':
          // 向右滾動
          this.state.desktop.translateX -= 50;
          const rightTranslateY = this.state.desktop.translateY || 0;
          timelineContent.style.transform = `translateX(${this.state.desktop.translateX}px) translateY(${rightTranslateY}px) scale(${this.state.desktop.zoom})`;
          break;
        case 'ArrowUp':
          // 向上滾動
          this.state.desktop.translateY += 50;
          const upTranslateX = this.state.desktop.translateX || 0;
          timelineContent.style.transform = `translateX(${upTranslateX}px) translateY(${this.state.desktop.translateY}px) scale(${this.state.desktop.zoom})`;
          break;
        case 'ArrowDown':
          // 向下滾動
          this.state.desktop.translateY -= 50;
          const downTranslateX = this.state.desktop.translateX || 0;
          timelineContent.style.transform = `translateX(${downTranslateX}px) translateY(${this.state.desktop.translateY}px) scale(${this.state.desktop.zoom})`;
          break;
      }
    });
  }

  /**
   * 增強視覺特效
   */
  enhanceVisualEffects() {
    // 增強節點懸停效果
    const nodes = this.element.querySelectorAll('.project-node');
    nodes.forEach(node => {
      node.addEventListener('mouseenter', (event) => {
        if (window.gsap) {
          // 更強的懸停動畫
          window.gsap.to(node, {
            scale: 1.6,
            duration: 0.3,
            ease: "back.out(1.7)",
            boxShadow: "0 0 30px rgba(74, 144, 226, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4)"
          });

          // 添加脈動效果
          window.gsap.to(node, {
            boxShadow: "0 0 40px rgba(74, 144, 226, 1), 0 8px 25px rgba(0, 0, 0, 0.5)",
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      });

      node.addEventListener('mouseleave', (event) => {
        if (window.gsap) {
          window.gsap.killTweensOf(node);
          window.gsap.to(node, {
            scale: 1,
            duration: 0.3,
            boxShadow: "0 0 10px rgba(74, 144, 226, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)"
          });
        }
      });
    });

    // 增強路徑動畫 - Step 2.2.4d 優化閃爍效果
    const path = this.element.querySelector('.timeline-path');
    if (path && window.gsap) {
      // 設置基礎透明度和虛線樣式
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = `${pathLength * 0.3}, ${pathLength * 0.1}`; // 30% 實線, 10% 間隔
      
      // 流動光效 - 保留基礎痕跡
      const timeline = window.gsap.timeline({ repeat: -1 });
      timeline
        .to(path, {
          strokeDashoffset: -pathLength * 0.4,
          duration: 8,
          ease: "none"
        })
        .to(path, {
          strokeDashoffset: -pathLength * 0.8,
          duration: 8,
          ease: "none"
        });
      
      // 添加基礎路徑（始終可見的淡化版本）
      const basePath = path.cloneNode(true);
      basePath.style.strokeDasharray = 'none';
      basePath.style.opacity = '0.2';
      basePath.style.strokeWidth = '2';
      basePath.classList.add('timeline-base-path');
      path.parentNode.insertBefore(basePath, path);
    }

    console.log('[DesktopEnhancement] 視覺特效增強完成');
  }

  /**
   * 銷毀組件
   */
  destroy() {
    // 停止粒子系統
    this.stopParticleSystem();
    
    // 停止觸控動畫
    if (this.state.touch?.animationFrame) {
      cancelAnimationFrame(this.state.touch.animationFrame);
    }
    
    // 清理事件監聽器
    if (this.state.desktop) {
      // 清理桌面端事件
    }
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    console.log('[InteractiveTimeline] 組件已銷毀');
  }
}