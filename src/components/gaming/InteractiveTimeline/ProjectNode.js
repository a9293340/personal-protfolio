/**
 * ProjectNode - 專案節點組件
 * 
 * 職責：
 * - 單一專案節點的渲染和狀態管理
 * - 節點基礎互動（懸停、點擊、鍵盤導航）
 * - 節點位置更新和動畫效果
 * - 節點狀態獲取和管理
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class ProjectNode extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    
    // 節點相關屬性
    this.project = null;
    this.index = -1;
    this.element = null;
    this.position = { x: 0, y: 0 };
    this.isInteractive = true;
    
    // 事件回調
    this.onNodeClick = null;
    this.onNodeHover = null;
  }

  getDefaultConfig() {
    return {
      // 節點樣式配置
      nodeSize: 16,
      nodeColors: {
        default: '#d4af37',
        hover: '#f4d03f', 
        active: '#ffeb3b',
        completed: '#4caf50',
        inProgress: '#ff9800',
        planned: '#757575'
      },
      
      // 動畫配置
      animations: {
        enabled: true,
        hoverScale: 1.3,
        clickScale: 1.5,
        duration: 0.3
      },
      
      // 互動配置
      interaction: {
        enabled: true,
        keyboard: true,
        tooltip: true,
        clickFeedback: true
      },
      
      // 響應式配置
      responsive: {
        mobile: { nodeSize: 12, hoverScale: 1.2 },
        tablet: { nodeSize: 14, hoverScale: 1.25 },
        desktop: { nodeSize: 16, hoverScale: 1.3 }
      }
    };
  }

  getInitialState() {
    return {
      isHovered: false,
      isActive: false,
      isClicking: false,
      currentBreakpoint: 'desktop',
      animationTimeline: null
    };
  }

  /**
   * 初始化專案節點
   * @param {Object} project - 專案數據
   * @param {number} index - 節點索引
   * @param {Object} callbacks - 事件回調函數
   */
  initialize(project, index, callbacks = {}) {
    this.project = project;
    this.index = index;
    this.onNodeClick = callbacks.onNodeClick || (() => {});
    this.onNodeHover = callbacks.onNodeHover || (() => {});
    
    this.createElement();
    this.setupInteractions();
    
    return this.element;
  }

  /**
   * 創建節點DOM元素
   */
  createElement() {
    if (!this.project) {
      console.error('[ProjectNode] 無法創建節點：缺少專案數據');
      return;
    }

    const nodeElement = document.createElement('div');
    const nodeSize = this.getCurrentNodeSize();
    
    nodeElement.className = `timeline-node project-node ${this.project.status || 'default'}`;
    nodeElement.style.cssText = `
      width: ${nodeSize}px;
      height: ${nodeSize}px;
      border-radius: 50%;
      background: ${this.getNodeColor()};
      border: 2px solid rgba(212, 175, 55, 0.6);
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      position: absolute;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // 添加節點內部圖標或標記
    this.addNodeContent(nodeElement);
    
    // 添加工具提示
    if (this.config.interaction.tooltip) {
      this.addTooltip(nodeElement);
    }
    
    this.element = nodeElement;
    
    console.log(`[ProjectNode] 節點已創建: ${this.project.title}`);
  }

  /**
   * 添加節點內容（圖標、標記等）
   */
  addNodeContent(nodeElement) {
    // 根據專案類型添加圖標
    const iconMap = {
      backend: '⚡',
      frontend: '🎨',
      fullstack: '🚀', 
      architecture: '🏗️',
      opensource: '❤️',
      default: '●'
    };
    
    const icon = document.createElement('span');
    icon.textContent = iconMap[this.project.category] || iconMap.default;
    icon.style.cssText = `
      font-size: 8px;
      color: rgba(255, 255, 255, 0.9);
      user-select: none;
      pointer-events: none;
    `;
    
    nodeElement.appendChild(icon);
  }

  /**
   * 添加工具提示
   */
  addTooltip(nodeElement) {
    const tooltip = document.createElement('div');
    tooltip.className = 'node-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">${this.project.title}</div>
      <div class="tooltip-date">${this.project.date}</div>
      <div class="tooltip-category">${this.project.category}</div>
    `;
    
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(26, 26, 46, 0.95);
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      line-height: 1.4;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      margin-bottom: 8px;
    `;
    
    nodeElement.appendChild(tooltip);
  }

  /**
   * 設置節點互動事件
   */
  setupInteractions() {
    if (!this.config.interaction.enabled || !this.element) {
      return;
    }

    // 滑鼠懸停效果
    this.element.addEventListener('mouseenter', (event) => {
      this.handleMouseEnter(event);
    });

    this.element.addEventListener('mouseleave', (event) => {
      this.handleMouseLeave(event);
    });

    // 點擊事件
    this.element.addEventListener('click', (event) => {
      event.stopPropagation();
      this.handleClick(event);
    });

    // 鍵盤可訪問性
    if (this.config.interaction.keyboard) {
      this.setupKeyboardAccessibility();
    }
  }

  /**
   * 設置鍵盤可訪問性
   */
  setupKeyboardAccessibility() {
    this.element.setAttribute('tabindex', '0');
    this.element.setAttribute('role', 'button');
    this.element.setAttribute('aria-label', `專案節點: ${this.project.title}`);
    
    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handleClick(event);
      }
    });
  }

  /**
   * 處理滑鼠進入事件
   */
  handleMouseEnter(event) {
    this.state.isHovered = true;
    
    // 顯示工具提示
    const tooltip = this.element.querySelector('.node-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    }
    
    // 懸停動畫效果
    if (this.config.animations.enabled && window.gsap) {
      const scale = this.getCurrentHoverScale();
      gsap.to(this.element, {
        scale: scale,
        duration: this.config.animations.duration,
        ease: 'power2.out'
      });
    }
    
    // 觸發懸停回調
    this.onNodeHover(this.project, this.index, 'enter', event);
    
    console.log(`[ProjectNode] 節點懸停: ${this.project.title}`);
  }

  /**
   * 處理滑鼠離開事件
   */
  handleMouseLeave(event) {
    this.state.isHovered = false;
    
    // 隱藏工具提示
    const tooltip = this.element.querySelector('.node-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    }
    
    // 恢復原始大小
    if (this.config.animations.enabled && window.gsap) {
      gsap.to(this.element, {
        scale: 1,
        duration: this.config.animations.duration,
        ease: 'power2.out'
      });
    }
    
    // 觸發懸停回調
    this.onNodeHover(this.project, this.index, 'leave', event);
  }

  /**
   * 處理點擊事件
   */
  handleClick(event) {
    if (this.state.isClicking) {
      return; // 防止重複點擊
    }

    this.state.isClicking = true;
    
    console.log(`[ProjectNode] 節點被點擊: ${this.project.title}`);
    
    // 點擊反饋動畫
    if (this.config.animations.enabled && this.config.interaction.clickFeedback) {
      this.animateClickFeedback();
    }
    
    // 觸發點擊回調
    this.onNodeClick(this.element, this.project, this.index, event);
    
    // 重置點擊狀態
    setTimeout(() => {
      this.state.isClicking = false;
    }, 300);
  }

  /**
   * 點擊反饋動畫
   */
  animateClickFeedback() {
    if (!window.gsap) return;

    const timeline = gsap.timeline();
    const clickScale = this.config.animations.clickScale;
    
    timeline
      .to(this.element, {
        scale: clickScale,
        duration: 0.1,
        ease: 'power2.out'
      })
      .to(this.element, {
        scale: this.state.isHovered ? this.getCurrentHoverScale() : 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)'
      });
  }

  /**
   * 更新節點位置
   * @param {Object} position - 新位置 {x, y}
   */
  updatePosition(position) {
    if (!this.element || !position) return;
    
    this.position = { ...position };
    
    this.element.style.left = `${position.x}px`;
    this.element.style.top = `${position.y}px`;
    
    // 存儲節點的像素位置用於邊界計算
    if (this.element._nodeData) {
      this.element._nodeData.position = position;
    }
  }

  /**
   * 獲取當前節點狀態
   */
  getNodeState() {
    return {
      project: this.project,
      index: this.index,
      position: this.position,
      isHovered: this.state.isHovered,
      isActive: this.state.isActive,
      isInteractive: this.isInteractive,
      element: this.element
    };
  }

  /**
   * 設置節點狀態
   */
  setNodeState(newState) {
    if (newState.isActive !== undefined) {
      this.state.isActive = newState.isActive;
      this.updateNodeAppearance();
    }
    
    if (newState.isInteractive !== undefined) {
      this.isInteractive = newState.isInteractive;
      this.element.style.pointerEvents = newState.isInteractive ? 'auto' : 'none';
    }
  }

  /**
   * 更新節點外觀
   */
  updateNodeAppearance() {
    if (!this.element) return;
    
    const color = this.getNodeColor();
    this.element.style.background = color;
    
    if (this.state.isActive) {
      this.element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    } else {
      this.element.style.boxShadow = `0 0 15px rgba(212, 175, 55, 0.4)`;
    }
  }

  /**
   * 獲取節點顏色
   */
  getNodeColor() {
    const colors = this.config.nodeColors;
    
    if (this.state.isActive) return colors.active;
    if (this.state.isHovered) return colors.hover;
    
    return colors[this.project.status] || colors.default;
  }

  /**
   * 獲取當前節點尺寸
   */
  getCurrentNodeSize() {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    return responsive?.nodeSize || this.config.nodeSize;
  }

  /**
   * 獲取當前懸停縮放比例
   */
  getCurrentHoverScale() {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    return responsive?.hoverScale || this.config.animations.hoverScale;
  }

  /**
   * 更新響應式斷點
   */
  updateBreakpoint(breakpoint) {
    this.state.currentBreakpoint = breakpoint;
    
    if (this.element) {
      const newSize = this.getCurrentNodeSize();
      this.element.style.width = `${newSize}px`;
      this.element.style.height = `${newSize}px`;
    }
  }

  /**
   * 顯示節點
   */
  show(animated = true) {
    if (!this.element) return;
    
    if (animated && this.config.animations.enabled && window.gsap) {
      gsap.to(this.element, {
        opacity: 1,
        scale: 1,
        duration: this.config.animations.duration,
        ease: 'power2.out'
      });
    } else {
      this.element.style.opacity = '1';
      this.element.style.transform = 'scale(1)';
    }
    
    this.element.style.display = 'flex';
  }

  /**
   * 隱藏節點
   */
  hide(animated = true) {
    if (!this.element) return;
    
    if (animated && this.config.animations.enabled && window.gsap) {
      gsap.to(this.element, {
        opacity: 0,
        scale: 0.8,
        duration: this.config.animations.duration,
        ease: 'power2.in',
        onComplete: () => {
          this.element.style.display = 'none';
        }
      });
    } else {
      this.element.style.opacity = '0';
      this.element.style.transform = 'scale(0.8)';
      this.element.style.display = 'none';
    }
  }

  /**
   * 銷毀節點
   */
  destroy() {
    if (this.element) {
      // 清理事件監聽器
      this.element.removeEventListener('mouseenter', this.handleMouseEnter);
      this.element.removeEventListener('mouseleave', this.handleMouseLeave);
      this.element.removeEventListener('click', this.handleClick);
      
      // 停止所有動畫
      if (window.gsap) {
        gsap.killTweensOf(this.element);
      }
      
      // 移除DOM元素
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    
    // 清理引用
    this.element = null;
    this.project = null;
    this.onNodeClick = null;
    this.onNodeHover = null;
    
    console.log(`[ProjectNode] 節點已銷毀`);
  }
}

export default ProjectNode;