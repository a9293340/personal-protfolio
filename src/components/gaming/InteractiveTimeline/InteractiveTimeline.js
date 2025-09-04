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
      
      // 專案數據
      projects: []
    };
  }

  getInitialState() {
    return {
      isInitialized: false,
      currentBreakpoint: this.detectBreakpoint(),
      isLoading: false,
      selectedNode: null,
      timelineLength: 0,
      viewportPosition: 0
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
        <div class="timeline-navigation">
          <button class="nav-btn prev-btn" data-direction="-1">
            ${isVertical ? '↑' : '←'}
          </button>
          <button class="nav-btn next-btn" data-direction="1">
            ${isVertical ? '↓' : '→'}
          </button>
        </div>
        
        <div class="timeline-viewport">
          <svg class="timeline-svg" width="100%" height="400" viewBox="0 0 ${isVertical ? '400 800' : '800 400'}" preserveAspectRatio="none">
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
            <!-- 背景粒子效果 -->
          </div>
        </div>
        
        <div class="timeline-info">
          <div class="current-year"></div>
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
        
        .timeline-navigation {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          display: flex;
          gap: 10px;
        }
        
        .nav-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        .timeline-viewport {
          flex: 1;
          position: relative;
          overflow: hidden;
          min-height: 350px;
        }
        
        .timeline-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
        
        .project-node {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        
        .project-node:hover {
          transform: scale(1.5);
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
        }
        
        .current-year {
          font-size: 24px;
          font-weight: bold;
          color: ${this.config.colors.timeline};
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
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .interactive-timeline {
            height: 600px;
          }
          
          .timeline-container.vertical {
            flex-direction: column;
          }
          
          .timeline-navigation {
            flex-direction: column;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      </style>
    `;
    
    if (!document.querySelector('#interactive-timeline-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
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
    
    // 根據斷點使用不同的 viewBox 尺寸
    const svgWidth = isVertical ? 400 : 800;
    const svgHeight = isVertical ? 800 : 400;
    
    console.log(`[InteractiveTimeline] 使用響應式 SVG 尺寸: ${svgWidth}x${svgHeight}, 斷點: ${this.state.currentBreakpoint}`);
    
    // 計算時間軸路徑
    const pathData = this.generateTimelinePath(svgWidth, svgHeight, isVertical);
    console.log(`[InteractiveTimeline] 生成路徑數據: ${pathData}`);
    
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
      // 垂直時間軸 (手機版)
      const startY = padding;
      const endY = height - padding;
      const centerX = width / 2;
      
      // 創建自然的 S 型曲線
      const controlOffset = width * 0.15;
      const midY = height / 2;
      
      return `M ${centerX} ${startY} 
              Q ${centerX - controlOffset} ${midY * 0.7} ${centerX} ${midY}
              Q ${centerX + controlOffset} ${midY * 1.3} ${centerX} ${endY}`;
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
      
      // 計算節點在路徑上的位置
      const svgPosition = this.calculateNodePosition(path, index, this.timelineData.length);
      
      // 轉換 SVG 坐標到實際像素坐標
      const actualPosition = this.convertSVGToPixelCoordinates(svg, svgPosition);
      
      // 設定節點位置
      nodeElement.style.left = `${actualPosition.x}px`;
      nodeElement.style.top = `${actualPosition.y}px`;
      
      nodesContainer.appendChild(nodeElement);
      this.nodes.push({
        element: nodeElement,
        data: project,
        position: actualPosition
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
    
    // 節點內容
    const nodeIcon = this.getProjectIcon(project.category || 'general');
    const formattedDate = this.formatProjectDate(project.date);
    
    nodeElement.innerHTML = `
      ${nodeIcon}
      <div class="node-label">
        <div class="label-title">${project.title}</div>
        <div class="label-date">${formattedDate}</div>
      </div>
      <div class="node-pulse"></div>
    `;
    
    // 添加數據屬性
    nodeElement.dataset.projectId = project.id;
    nodeElement.dataset.projectIndex = index;
    
    return nodeElement;
  }

  /**
   * 獲取專案圖標
   */
  getProjectIcon(category) {
    const icons = {
      frontend: '🎨',
      backend: '⚙️',
      fullstack: '🔗',
      devops: '🚀',
      ai: '🤖',
      mobile: '📱',
      general: '💡'
    };
    return icons[category] || icons.general;
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
    const isVertical = this.state.currentBreakpoint === 'mobile';
    
    // 根據斷點使用不同的 viewBox 尺寸
    const viewBoxWidth = isVertical ? 400 : 800;
    const viewBoxHeight = isVertical ? 800 : 400;
    
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
    
    console.log(`[InteractiveTimeline] 坐標轉換 (${isVertical ? '垂直' : '水平'}): SVG(${svgPosition.x}, ${svgPosition.y}) -> 像素(${svgPosition.x * scaleX}, ${svgPosition.y * scaleY})`);
    console.log(`[InteractiveTimeline] viewBox: ${viewBoxWidth}x${viewBoxHeight}, 實際: ${svgRect.width}x${svgRect.height}, 縮放: ${scaleX}x${scaleY}`);
    
    return {
      x: svgPosition.x * scaleX,
      y: svgPosition.y * scaleY
    };
  }

  /**
   * 計算節點在路徑上的位置
   */
  calculateNodePosition(path, index, total) {
    if (!path || total === 0) {
      return { x: 0, y: 0 };
    }
    
    try {
      const pathLength = path.getTotalLength();
      console.log(`[InteractiveTimeline] 路徑長度: ${pathLength}, 節點 ${index}/${total}`);
      
      if (pathLength === 0) {
        console.error('[InteractiveTimeline] SVG 路徑長度為 0，使用降級方案');
        const container = this.element.querySelector('.timeline-viewport');
        const rect = container.getBoundingClientRect();
        return {
          x: rect.width * 0.1 + (rect.width * 0.8 * (index / Math.max(total - 1, 1))),
          y: rect.height * 0.5
        };
      }
      
      const progress = total === 1 ? 0.5 : index / (total - 1);
      const point = path.getPointAtLength(pathLength * progress);
      
      console.log(`[InteractiveTimeline] 節點 ${index} 位置: (${point.x}, ${point.y})`);
      
      return {
        x: point.x,
        y: point.y
      };
    } catch (error) {
      console.error('[InteractiveTimeline] 計算節點位置失敗:', error);
      // 回傳預設位置
      const container = this.element.querySelector('.timeline-viewport');
      const rect = container.getBoundingClientRect();
      return {
        x: rect.width * (index / total),
        y: rect.height * 0.5
      };
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
      this.handleNodeClick(node);
    });
  }

  /**
   * 處理節點點擊 (為 Step 2.2.3 飛出卡片準備)
   */
  handleNodeClick(node) {
    console.log(`[InteractiveTimeline] 節點被點擊: ${node.data.title}`);
    
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
          this.setupInteractions();
          this.setupResponsiveHandling();
          console.log('[InteractiveTimeline] DOM 掛載後設定完成');
        });
      });
      
    } catch (error) {
      console.error('[InteractiveTimeline] DOM 掛載後設定失敗:', error);
    }
  }

  /**
   * 銷毀組件
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    console.log('[InteractiveTimeline] 組件已銷毀');
  }
}