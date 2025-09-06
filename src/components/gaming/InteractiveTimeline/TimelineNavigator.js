/**
 * TimelineNavigator - 時間導航控制器
 * 
 * 職責：
 * - 時間軸導航控制（前進、後退、跳轉）
 * - 縮放控制（放大、縮小、重置）
 * - 拖曳操作處理（滑鼠拖曳、觸控手勢）
 * - 桌面端增強功能（滾輪縮放、鍵盤快捷鍵）
 * - 觸控手勢支援（滑動、慣性、邊界限制）
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class TimelineNavigator extends BaseComponent {
  constructor(config = {}) {
    super();
    
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    
    // 導航相關屬性
    this.container = null;
    this.timeline = null;
    this.viewport = { x: 0, y: 0, scale: 1, width: 0, height: 0 };
    
    // 拖曳狀態
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
    
    // 觸控狀態
    this.touch = {
      isDragging: false,
      startPos: { x: 0, y: 0 },
      lastPos: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      startTime: 0
    };
    
    // 事件回調
    this.onNavigationChange = null;
    this.onZoomChange = null;
    this.onDragStart = null;
    this.onDragEnd = null;
  }

  getDefaultConfig() {
    return {
      // 導航控制配置
      navigation: {
        enabled: true,
        showButtons: true,
        step: 100,
        animationDuration: 0.5
      },
      
      // 縮放控制配置
      zoom: {
        enabled: true,
        min: 0.5,
        max: 2.0,
        step: 0.1,
        wheelSensitivity: 0.001,
        animationDuration: 0.3
      },
      
      // 拖曳配置
      drag: {
        enabled: true,
        axis: 'x', // 'x', 'y', 'both'
        inertia: true,
        bounds: 'auto', // 'auto', 'strict', 'none'
        resistance: 0.8
      },
      
      // 觸控手勢配置
      touch: {
        enabled: true,
        swipeThreshold: 50,
        velocityThreshold: 0.5,
        inertiaDecay: 0.95,
        maxInertiaDistance: 500
      },
      
      // 鍵盤快捷鍵配置
      keyboard: {
        enabled: true,
        shortcuts: {
          'ArrowLeft': 'navigate-left',
          'ArrowRight': 'navigate-right', 
          'ArrowUp': 'navigate-up',
          'ArrowDown': 'navigate-down',
          'Equal': 'zoom-in',
          'Minus': 'zoom-out',
          'Digit0': 'zoom-reset'
        }
      },
      
      // 響應式配置
      responsive: {
        mobile: {
          drag: { axis: 'y', step: 80 },
          zoom: { enabled: false },
          keyboard: { enabled: false }
        },
        tablet: {
          drag: { axis: 'both', step: 90 },
          zoom: { enabled: true },
          keyboard: { enabled: true }
        },
        desktop: {
          drag: { axis: 'x', step: 100 },
          zoom: { enabled: true },
          keyboard: { enabled: true }
        }
      }
    };
  }

  getInitialState() {
    return {
      currentBreakpoint: 'desktop',
      isNavigating: false,
      isZooming: false,
      isDragging: false,
      currentPosition: { x: 0, y: 0 },
      currentZoom: 1,
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
      animationTimeline: null
    };
  }

  /**
   * 初始化導航控制器
   * @param {HTMLElement} container - 時間軸容器元素
   * @param {Object} callbacks - 事件回調函數
   */
  initialize(container, callbacks = {}) {
    this.container = container;
    this.timeline = container.querySelector('.timeline-svg') || container.querySelector('svg');
    
    this.onNavigationChange = callbacks.onNavigationChange || (() => {});
    this.onZoomChange = callbacks.onZoomChange || (() => {});
    this.onDragStart = callbacks.onDragStart || (() => {});
    this.onDragEnd = callbacks.onDragEnd || (() => {});
    
    this.setupViewport();
    this.setupNavigationControls();
    this.setupZoomControls();
    this.setupDragControls();
    this.setupTouchGestures();
    this.setupKeyboardShortcuts();
    
    console.log('[TimelineNavigator] 導航控制器初始化完成');
  }

  /**
   * 設置視窗參數
   */
  setupViewport() {
    if (!this.container) return;
    
    const rect = this.container.getBoundingClientRect();
    this.viewport = {
      x: 0,
      y: 0,
      scale: 1,
      width: rect.width,
      height: rect.height
    };
    
    this.calculateBounds();
  }

  /**
   * 計算拖曳邊界
   */
  calculateBounds() {
    if (!this.timeline || !this.container) return;
    
    const timelineRect = this.timeline.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    this.state.bounds = {
      minX: Math.min(0, containerRect.width - timelineRect.width),
      maxX: 0,
      minY: Math.min(0, containerRect.height - timelineRect.height),
      maxY: 0
    };
  }

  /**
   * 設置導航控制按鈕
   */
  setupNavigationControls() {
    if (!this.config.navigation.enabled) return;
    
    const prevBtn = this.container.querySelector('.prev-btn');
    const nextBtn = this.container.querySelector('.next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigateLeft();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateRight();
      });
    }
    
    console.log('[TimelineNavigator] 導航控制按鈕已設置');
  }

  /**
   * 設置縮放控制
   */
  setupZoomControls() {
    if (!this.config.zoom.enabled) return;
    
    const zoomInBtn = this.container.querySelector('[data-zoom="in"]');
    const zoomOutBtn = this.container.querySelector('[data-zoom="out"]');
    const zoomResetBtn = this.container.querySelector('[data-zoom="reset"]');
    
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        this.zoomIn();
      });
    }
    
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        this.zoomOut();
      });
    }
    
    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        this.resetZoom();
      });
    }
    
    // 滾輪縮放（桌面端）
    if (this.state.currentBreakpoint !== 'mobile') {
      this.setupWheelZoom();
    }
    
    console.log('[TimelineNavigator] 縮放控制已設置');
  }

  /**
   * 設置滾輪縮放
   */
  setupWheelZoom() {
    this.container.addEventListener('wheel', (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        
        const delta = -event.deltaY * this.config.zoom.wheelSensitivity;
        const newZoom = Math.max(
          this.config.zoom.min,
          Math.min(this.config.zoom.max, this.state.currentZoom + delta)
        );
        
        this.setZoom(newZoom, {
          centerX: event.clientX,
          centerY: event.clientY
        });
      }
    }, { passive: false });
  }

  /**
   * 設置拖曳控制
   */
  setupDragControls() {
    if (!this.config.drag.enabled) return;
    
    // 滑鼠拖曳
    this.container.addEventListener('mousedown', (event) => {
      this.handleDragStart(event.clientX, event.clientY);
      
      const handleMouseMove = (e) => {
        this.handleDragMove(e.clientX, e.clientY);
      };
      
      const handleMouseUp = () => {
        this.handleDragEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    console.log('[TimelineNavigator] 拖曳控制已設置');
  }

  /**
   * 設置觸控手勢
   */
  setupTouchGestures() {
    if (!this.config.touch.enabled) return;
    
    this.container.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        this.handleTouchStart(event.touches[0]);
      }
    }, { passive: false });
    
    this.container.addEventListener('touchmove', (event) => {
      if (event.touches.length === 1 && this.touch.isDragging) {
        event.preventDefault();
        this.handleTouchMove(event.touches[0]);
      }
    }, { passive: false });
    
    this.container.addEventListener('touchend', (event) => {
      this.handleTouchEnd();
    });
    
    console.log('[TimelineNavigator] 觸控手勢已設置');
  }

  /**
   * 設置鍵盤快捷鍵
   */
  setupKeyboardShortcuts() {
    if (!this.config.keyboard.enabled) return;
    
    document.addEventListener('keydown', (event) => {
      // 只在容器有焦點時響應
      if (!this.container?.contains(document.activeElement) && 
          document.activeElement !== this.container) {
        return;
      }
      
      const key = event.code;
      const action = this.config.keyboard.shortcuts[key];
      
      if (action && this.handleKeyboardAction(action, event)) {
        event.preventDefault();
      }
    });
    
    // 使容器可獲得焦點
    this.container.setAttribute('tabindex', '0');
    
    console.log('[TimelineNavigator] 鍵盤快捷鍵已設置');
  }

  /**
   * 處理鍵盤動作
   */
  handleKeyboardAction(action, event) {
    const step = this.config.navigation.step;
    
    switch (action) {
      case 'navigate-left':
        this.navigateBy(-step, 0);
        return true;
      case 'navigate-right':
        this.navigateBy(step, 0);
        return true;
      case 'navigate-up':
        this.navigateBy(0, -step);
        return true;
      case 'navigate-down':
        this.navigateBy(0, step);
        return true;
      case 'zoom-in':
        if (event.ctrlKey || event.metaKey) {
          this.zoomIn();
          return true;
        }
        break;
      case 'zoom-out':
        if (event.ctrlKey || event.metaKey) {
          this.zoomOut();
          return true;
        }
        break;
      case 'zoom-reset':
        if (event.ctrlKey || event.metaKey) {
          this.resetZoom();
          return true;
        }
        break;
    }
    
    return false;
  }

  /**
   * 處理拖曳開始
   */
  handleDragStart(x, y) {
    this.isDragging = true;
    this.state.isDragging = true;
    this.dragStart = { x, y };
    this.dragOffset = { x: this.state.currentPosition.x, y: this.state.currentPosition.y };
    
    this.container.style.cursor = 'grabbing';
    this.onDragStart(this.state.currentPosition);
    
    console.log('[TimelineNavigator] 拖曳開始');
  }

  /**
   * 處理拖曳移動
   */
  handleDragMove(x, y) {
    if (!this.isDragging) return;
    
    const deltaX = x - this.dragStart.x;
    const deltaY = y - this.dragStart.y;
    
    const newX = this.dragOffset.x + deltaX;
    const newY = this.dragOffset.y + deltaY;
    
    this.setPosition(newX, newY, false);
  }

  /**
   * 處理拖曳結束
   */
  handleDragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.state.isDragging = false;
    this.container.style.cursor = '';
    
    this.onDragEnd(this.state.currentPosition);
    
    console.log('[TimelineNavigator] 拖曳結束');
  }

  /**
   * 處理觸控開始
   */
  handleTouchStart(touch) {
    this.touch.isDragging = true;
    this.touch.startPos = { x: touch.clientX, y: touch.clientY };
    this.touch.lastPos = { x: touch.clientX, y: touch.clientY };
    this.touch.startTime = Date.now();
    this.touch.velocity = { x: 0, y: 0 };
    
    // 停止任何慣性動畫
    if (this.state.animationTimeline) {
      this.state.animationTimeline.kill();
    }
  }

  /**
   * 處理觸控移動
   */
  handleTouchMove(touch) {
    if (!this.touch.isDragging) return;
    
    const deltaX = touch.clientX - this.touch.startPos.x;
    const deltaY = touch.clientY - this.touch.startPos.y;
    
    // 計算速度
    const timeDelta = Date.now() - this.touch.startTime;
    if (timeDelta > 0) {
      this.touch.velocity.x = (touch.clientX - this.touch.lastPos.x) / timeDelta;
      this.touch.velocity.y = (touch.clientY - this.touch.lastPos.y) / timeDelta;
    }
    
    this.touch.lastPos = { x: touch.clientX, y: touch.clientY };
    
    const axis = this.getCurrentDragAxis();
    let newX = this.state.currentPosition.x;
    let newY = this.state.currentPosition.y;
    
    if (axis === 'x' || axis === 'both') {
      newX += deltaX;
    }
    if (axis === 'y' || axis === 'both') {
      newY += deltaY;
    }
    
    this.setPosition(newX, newY, false);
    this.touch.startPos = { x: touch.clientX, y: touch.clientY };
  }

  /**
   * 處理觸控結束
   */
  handleTouchEnd() {
    if (!this.touch.isDragging) return;
    
    this.touch.isDragging = false;
    
    // 慣性滑動
    if (this.config.drag.inertia) {
      this.applyInertia();
    }
  }

  /**
   * 應用慣性滑動
   */
  applyInertia() {
    const { velocityThreshold, inertiaDecay, maxInertiaDistance } = this.config.touch;
    const { velocity } = this.touch;
    
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (speed < velocityThreshold) return;
    
    const distance = Math.min(speed * 100, maxInertiaDistance);
    const duration = distance / speed * 0.001;
    
    const axis = this.getCurrentDragAxis();
    let targetX = this.state.currentPosition.x;
    let targetY = this.state.currentPosition.y;
    
    if (axis === 'x' || axis === 'both') {
      targetX += velocity.x * distance;
    }
    if (axis === 'y' || axis === 'both') {
      targetY += velocity.y * distance;
    }
    
    this.animateToPosition(targetX, targetY, duration, 'power2.out');
  }

  /**
   * 導航到左側
   */
  navigateLeft() {
    const step = this.getCurrentNavigationStep();
    this.navigateBy(-step, 0);
  }

  /**
   * 導航到右側
   */
  navigateRight() {
    const step = this.getCurrentNavigationStep();
    this.navigateBy(step, 0);
  }

  /**
   * 導航到指定偏移
   */
  navigateBy(deltaX, deltaY) {
    const newX = this.state.currentPosition.x + deltaX;
    const newY = this.state.currentPosition.y + deltaY;
    
    this.animateToPosition(newX, newY, this.config.navigation.animationDuration);
    
    this.onNavigationChange({
      type: 'navigate',
      delta: { x: deltaX, y: deltaY },
      position: { x: newX, y: newY }
    });
  }

  /**
   * 放大
   */
  zoomIn() {
    const newZoom = Math.min(
      this.config.zoom.max,
      this.state.currentZoom + this.config.zoom.step
    );
    this.setZoom(newZoom);
  }

  /**
   * 縮小
   */
  zoomOut() {
    const newZoom = Math.max(
      this.config.zoom.min,
      this.state.currentZoom - this.config.zoom.step
    );
    this.setZoom(newZoom);
  }

  /**
   * 重置縮放
   */
  resetZoom() {
    this.setZoom(1);
    this.setPosition(0, 0);
  }

  /**
   * 設置縮放級別
   */
  setZoom(zoom, center = null) {
    const oldZoom = this.state.currentZoom;
    const newZoom = Math.max(this.config.zoom.min, Math.min(this.config.zoom.max, zoom));
    
    if (oldZoom === newZoom) return;
    
    this.state.currentZoom = newZoom;
    
    // 如果指定了縮放中心點，調整位置保持中心點不變
    if (center && this.timeline) {
      const rect = this.container.getBoundingClientRect();
      const centerX = center.centerX - rect.left;
      const centerY = center.centerY - rect.top;
      
      const scaleRatio = newZoom / oldZoom;
      const newX = centerX - (centerX - this.state.currentPosition.x) * scaleRatio;
      const newY = centerY - (centerY - this.state.currentPosition.y) * scaleRatio;
      
      this.setPosition(newX, newY, false);
    }
    
    // 應用縮放變換
    if (this.timeline) {
      this.applyTransform();
    }
    
    this.onZoomChange({
      type: 'zoom',
      zoom: newZoom,
      oldZoom: oldZoom
    });
    
    console.log(`[TimelineNavigator] 縮放變更: ${oldZoom.toFixed(2)} -> ${newZoom.toFixed(2)}`);
  }

  /**
   * 設置位置
   */
  setPosition(x, y, animated = true) {
    // 應用邊界限制
    const bounded = this.applyBounds(x, y);
    
    this.state.currentPosition.x = bounded.x;
    this.state.currentPosition.y = bounded.y;
    
    if (animated) {
      this.animateToPosition(bounded.x, bounded.y);
    } else {
      this.applyTransform();
    }
  }

  /**
   * 動畫到指定位置
   */
  animateToPosition(x, y, duration = null, ease = 'power2.out') {
    if (!window.gsap || !this.timeline) return;
    
    duration = duration || this.config.navigation.animationDuration;
    const bounded = this.applyBounds(x, y);
    
    // 停止當前動畫
    if (this.state.animationTimeline) {
      this.state.animationTimeline.kill();
    }
    
    this.state.animationTimeline = gsap.to(this.state.currentPosition, {
      x: bounded.x,
      y: bounded.y,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        this.applyTransform();
      },
      onComplete: () => {
        this.state.animationTimeline = null;
      }
    });
  }

  /**
   * 應用邊界限制
   */
  applyBounds(x, y) {
    if (this.config.drag.bounds === 'none') {
      return { x, y };
    }
    
    const bounds = this.state.bounds;
    const resistance = this.config.drag.resistance;
    
    let boundedX = x;
    let boundedY = y;
    
    if (this.config.drag.bounds === 'strict') {
      boundedX = Math.max(bounds.minX, Math.min(bounds.maxX, x));
      boundedY = Math.max(bounds.minY, Math.min(bounds.maxY, y));
    } else {
      // 彈性邊界
      if (x < bounds.minX) {
        boundedX = bounds.minX + (x - bounds.minX) * resistance;
      } else if (x > bounds.maxX) {
        boundedX = bounds.maxX + (x - bounds.maxX) * resistance;
      }
      
      if (y < bounds.minY) {
        boundedY = bounds.minY + (y - bounds.minY) * resistance;
      } else if (y > bounds.maxY) {
        boundedY = bounds.maxY + (y - bounds.maxY) * resistance;
      }
    }
    
    return { x: boundedX, y: boundedY };
  }

  /**
   * 應用變換
   */
  applyTransform() {
    if (!this.timeline) return;
    
    const { x, y } = this.state.currentPosition;
    const zoom = this.state.currentZoom;
    
    this.timeline.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
    this.timeline.style.transformOrigin = '0 0';
  }

  /**
   * 獲取當前拖曳軸向
   */
  getCurrentDragAxis() {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    return responsive?.drag?.axis || this.config.drag.axis;
  }

  /**
   * 獲取當前導航步長
   */
  getCurrentNavigationStep() {
    const responsive = this.config.responsive[this.state.currentBreakpoint];
    return responsive?.drag?.step || this.config.navigation.step;
  }

  /**
   * 更新響應式斷點
   */
  updateBreakpoint(breakpoint) {
    this.state.currentBreakpoint = breakpoint;
    
    // 重新計算邊界
    this.calculateBounds();
    
    // 更新配置
    const responsive = this.config.responsive[breakpoint];
    if (responsive) {
      // 根據新斷點調整功能
      if (!responsive.zoom?.enabled && this.state.currentZoom !== 1) {
        this.resetZoom();
      }
    }
    
    console.log(`[TimelineNavigator] 斷點更新: ${breakpoint}`);
  }

  /**
   * 獲取當前狀態
   */
  getState() {
    return {
      position: { ...this.state.currentPosition },
      zoom: this.state.currentZoom,
      isDragging: this.state.isDragging,
      bounds: { ...this.state.bounds },
      viewport: { ...this.viewport }
    };
  }

  /**
   * 重置導航狀態
   */
  reset() {
    this.state.currentPosition = { x: 0, y: 0 };
    this.state.currentZoom = 1;
    this.state.isDragging = false;
    
    if (this.state.animationTimeline) {
      this.state.animationTimeline.kill();
      this.state.animationTimeline = null;
    }
    
    this.applyTransform();
    
    console.log('[TimelineNavigator] 導航狀態已重置');
  }

  /**
   * 銷毀導航控制器
   */
  destroy() {
    // 停止所有動畫
    if (this.state.animationTimeline) {
      this.state.animationTimeline.kill();
    }
    
    if (window.gsap && this.timeline) {
      gsap.killTweensOf(this.timeline);
    }
    
    // 清理引用
    this.container = null;
    this.timeline = null;
    this.onNavigationChange = null;
    this.onZoomChange = null;
    this.onDragStart = null;
    this.onDragEnd = null;
    
    console.log('[TimelineNavigator] 導航控制器已銷毀');
  }
}

export default TimelineNavigator;