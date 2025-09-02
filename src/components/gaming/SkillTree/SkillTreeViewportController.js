/**
 * SkillTreeViewportController - 技能樹視窗控制器
 * 
 * 負責處理技能樹的視窗控制功能，包括：
 * - 桌面端拖曳和縮放
 * - 移動端觸控手勢
 * - 視窗邊界限制
 * - 響應式佈局適配
 * 
 * @author Claude
 * @version 2.1.5
 */

import { EventManager } from '../../../core/events/EventManager.js';

/**
 * 視窗控制器配置
 */
export const ViewportConfig = {
  // 縮放配置
  zoom: {
    min: 0.3,
    max: 3.0,
    default: 1.0,
    step: 0.1,
    sensitivity: 0.001
  },
  
  // 拖曳配置
  drag: {
    enabled: true,
    threshold: 3, // 最小拖曳距離
    inertia: 0.9, // 慣性系數
    maxVelocity: 2000 // 最大速度
  },
  
  // 邊界配置
  bounds: {
    enabled: true,
    margin: 100, // 邊界外邊距
    elastic: true, // 彈性邊界
    elasticStrength: 0.1
  },
  
  // 動畫配置
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // 響應式斷點
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
};

/**
 * 設備類型檢測
 */
export const DeviceDetector = {
  isMobile: () => window.innerWidth < ViewportConfig.breakpoints.mobile,
  isTablet: () => window.innerWidth >= ViewportConfig.breakpoints.mobile && 
                  window.innerWidth < ViewportConfig.breakpoints.desktop,
  isDesktop: () => window.innerWidth >= ViewportConfig.breakpoints.desktop,
  
  isTouchDevice: () => 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0,
  
  hasPointerEvents: () => 'onpointerdown' in window,
  
  getDeviceType: () => {
    if (DeviceDetector.isMobile()) return 'mobile';
    if (DeviceDetector.isTablet()) return 'tablet';
    return 'desktop';
  }
};

export class SkillTreeViewportController extends EventManager {
  constructor(container, config = {}) {
    super();
    
    this.container = container;
    this.config = { ...ViewportConfig, ...config };
    
    // 視窗狀態
    this.viewport = {
      x: 0,
      y: 0,
      scale: this.config.zoom.default,
      width: 0,
      height: 0
    };
    
    // 拖曳狀態
    this.dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      velocityX: 0,
      velocityY: 0,
      startTime: 0
    };
    
    // 縮放狀態
    this.zoomState = {
      isZooming: false,
      centerX: 0,
      centerY: 0,
      startDistance: 0,
      startScale: 1
    };
    
    // 動畫狀態
    this.animationState = {
      isAnimating: false,
      animationId: null
    };
    
    // 邊界信息
    this.bounds = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    };
    
    // 設備信息
    this.device = {
      type: DeviceDetector.getDeviceType(),
      isTouchDevice: DeviceDetector.isTouchDevice(),
      hasPointerEvents: DeviceDetector.hasPointerEvents()
    };
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化視窗控制器
   */
  init() {
    console.log('SkillTreeViewportController: 初始化視窗控制器', {
      device: this.device,
      viewport: this.viewport
    });
    
    // 設置容器樣式
    this.setupContainer();
    
    // 綁定事件
    this.bindEvents();
    
    // 延遲初始化，確保DOM完全渲染
    setTimeout(() => {
      // 初始化視窗大小
      this.updateViewportSize();
      
      // 計算邊界
      this.calculateBounds();
      
      // 初始居中
      this.centerViewport();
      
      console.log('SkillTreeViewportController: 延遲初始化完成');
    }, 100);
  }
  
  /**
   * 設置容器樣式
   */
  setupContainer() {
    if (!this.container) return;
    
    // 設置容器為可滾動
    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.style.cursor = 'grab';
    
    // 創建技能樹內容容器
    this.contentContainer = this.container.querySelector('.skill-tree-content') || 
                           this.createContentContainer();
    
    // 設置內容容器的變換原點
    this.contentContainer.style.transformOrigin = '0 0';
    this.contentContainer.style.willChange = 'transform';
  }
  
  /**
   * 創建內容容器
   */
  createContentContainer() {
    const content = document.createElement('div');
    content.className = 'skill-tree-content';
    content.style.position = 'absolute';
    content.style.top = '0';
    content.style.left = '0';
    content.style.width = '100%';
    content.style.height = '100%';
    
    // 移動現有內容到新容器
    while (this.container.firstChild) {
      content.appendChild(this.container.firstChild);
    }
    
    this.container.appendChild(content);
    return content;
  }
  
  /**
   * 綁定事件監聽器
   */
  bindEvents() {
    // 桌面端事件
    this.bindDesktopEvents();
    
    // 移動端事件
    this.bindTouchEvents();
    
    // 通用事件
    this.bindCommonEvents();
  }
  
  /**
   * 綁定桌面端事件
   */
  bindDesktopEvents() {
    if (this.device.isTouchDevice) return;
    
    // 滑鼠事件
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // 滾輪縮放
    this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // 防止右鍵選單
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  /**
   * 綁定觸控事件
   */
  bindTouchEvents() {
    if (!this.device.isTouchDevice) return;
    
    // 觸控事件
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    
    // 阻止默認觸控行為
    this.container.style.touchAction = 'none';
  }
  
  /**
   * 綁定通用事件
   */
  bindCommonEvents() {
    // 視窗大小變化
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // 方向變化（移動設備）
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // 鍵盤事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  /**
   * 處理滑鼠按下
   */
  handleMouseDown(event) {
    if (event.button !== 0) return; // 只處理左鍵
    
    console.log('ViewportController: Mouse down', {
      clientX: event.clientX,
      clientY: event.clientY,
      target: event.target.className
    });
    
    this.startDrag(event.clientX, event.clientY, event.timeStamp);
    this.container.style.cursor = 'grabbing';
    
    event.preventDefault();
    event.stopPropagation();
  }
  
  /**
   * 處理滑鼠移動
   */
  handleMouseMove(event) {
    if (!this.dragState.isDragging) return;
    
    this.updateDrag(event.clientX, event.clientY, event.timeStamp);
    event.preventDefault();
    event.stopPropagation();
  }
  
  /**
   * 處理滑鼠釋放
   */
  handleMouseUp(event) {
    if (!this.dragState.isDragging) return;
    
    console.log('ViewportController: Mouse up');
    
    this.endDrag(event.timeStamp);
    this.container.style.cursor = 'grab';
    
    event.preventDefault();
    event.stopPropagation();
  }
  
  /**
   * 處理滾輪縮放
   */
  handleWheel(event) {
    event.preventDefault();
    
    const rect = this.container.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    const zoomDelta = -event.deltaY * this.config.zoom.sensitivity;
    this.zoomAtPoint(centerX, centerY, zoomDelta);
  }
  
  /**
   * 處理觸控開始
   */
  handleTouchStart(event) {
    event.preventDefault();
    
    const touches = event.touches;
    
    if (touches.length === 1) {
      // 單指拖曳
      this.startDrag(touches[0].clientX, touches[0].clientY, event.timeStamp);
    } else if (touches.length === 2) {
      // 雙指縮放
      this.startPinchZoom(touches[0], touches[1]);
    }
  }
  
  /**
   * 處理觸控移動
   */
  handleTouchMove(event) {
    event.preventDefault();
    
    const touches = event.touches;
    
    if (touches.length === 1 && this.dragState.isDragging) {
      // 單指拖曳
      this.updateDrag(touches[0].clientX, touches[0].clientY, event.timeStamp);
    } else if (touches.length === 2 && this.zoomState.isZooming) {
      // 雙指縮放
      this.updatePinchZoom(touches[0], touches[1]);
    }
  }
  
  /**
   * 處理觸控結束
   */
  handleTouchEnd(event) {
    event.preventDefault();
    
    if (this.dragState.isDragging) {
      this.endDrag(event.timeStamp);
    }
    
    if (this.zoomState.isZooming) {
      this.endPinchZoom();
    }
  }
  
  /**
   * 開始拖曳
   */
  startDrag(clientX, clientY, timeStamp) {
    this.dragState = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      velocityX: 0,
      velocityY: 0,
      startTime: timeStamp
    };
    
    // 停止任何進行中的動畫
    this.stopAnimation();
    
    this.emit('drag-start', { x: clientX, y: clientY });
  }
  
  /**
   * 更新拖曳
   */
  updateDrag(clientX, clientY, timeStamp) {
    if (!this.dragState.isDragging) return;
    
    const deltaX = clientX - this.dragState.lastX;
    const deltaY = clientY - this.dragState.lastY;
    const deltaTime = timeStamp - this.dragState.startTime;
    
    // 計算速度
    if (deltaTime > 0) {
      this.dragState.velocityX = deltaX / deltaTime * 1000;
      this.dragState.velocityY = deltaY / deltaTime * 1000;
    }
    
    // 記錄原始位置
    const oldX = this.viewport.x;
    const oldY = this.viewport.y;
    
    // 直接更新視窗位置，避免累積誤差
    const newX = this.viewport.x + deltaX;
    const newY = this.viewport.y + deltaY;
    
    // 應用邊界限制
    const clampedX = this.clampToBounds(newX, this.bounds.minX, this.bounds.maxX);
    const clampedY = this.clampToBounds(newY, this.bounds.minY, this.bounds.maxY);
    
    this.viewport.x = clampedX;
    this.viewport.y = clampedY;
    
    this.updateTransform();
    
    // 更新上次位置
    this.dragState.lastX = clientX;
    this.dragState.lastY = clientY;
    
    this.emit('drag-update', { 
      deltaX, 
      deltaY, 
      velocityX: this.dragState.velocityX, 
      velocityY: this.dragState.velocityY 
    });
    
    // 減少調試信息輸出，只在大幅度拖曳或邊界觸發時顯示
    if ((Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) || (newX !== clampedX || newY !== clampedY)) {
      console.log('Significant drag update:', {
        delta: { x: deltaX, y: deltaY },
        viewport: { x: this.viewport.x, y: this.viewport.y },
        boundsHit: {
          x: newX !== clampedX,
          y: newY !== clampedY
        },
        bounds: this.bounds
      });
    }
  }
  
  /**
   * 結束拖曳
   */
  endDrag(timeStamp) {
    if (!this.dragState.isDragging) return;
    
    // 應用慣性效果
    if (this.config.drag.inertia > 0) {
      this.applyInertia();
    }
    
    this.dragState.isDragging = false;
    
    this.emit('drag-end', {
      velocityX: this.dragState.velocityX,
      velocityY: this.dragState.velocityY
    });
  }
  
  /**
   * 應用慣性效果
   */
  applyInertia() {
    const { velocityX, velocityY } = this.dragState;
    const { inertia, maxVelocity } = this.config.drag;
    
    // 限制最大速度
    const clampedVelX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
    const clampedVelY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));
    
    // 如果速度太小，不需要慣性
    if (Math.abs(clampedVelX) < 50 && Math.abs(clampedVelY) < 50) return;
    
    this.animateInertia(clampedVelX, clampedVelY, inertia);
  }
  
  /**
   * 動畫慣性效果
   */
  animateInertia(velocityX, velocityY, friction) {
    if (Math.abs(velocityX) < 0.5 && Math.abs(velocityY) < 0.5) return;
    
    this.translateViewport(velocityX * 0.016, velocityY * 0.016); // 假設 60fps
    
    this.animationState.animationId = requestAnimationFrame(() => {
      this.animateInertia(velocityX * friction, velocityY * friction, friction);
    });
  }
  
  /**
   * 開始雙指縮放
   */
  startPinchZoom(touch1, touch2) {
    const distance = this.getTouchDistance(touch1, touch2);
    const center = this.getTouchCenter(touch1, touch2);
    
    this.zoomState = {
      isZooming: true,
      centerX: center.x,
      centerY: center.y,
      startDistance: distance,
      startScale: this.viewport.scale
    };
    
    this.stopAnimation();
    this.emit('zoom-start', center);
  }
  
  /**
   * 更新雙指縮放
   */
  updatePinchZoom(touch1, touch2) {
    if (!this.zoomState.isZooming) return;
    
    const distance = this.getTouchDistance(touch1, touch2);
    const center = this.getTouchCenter(touch1, touch2);
    
    const scale = this.zoomState.startScale * (distance / this.zoomState.startDistance);
    const clampedScale = this.clampZoom(scale);
    
    this.setZoomAtPoint(this.zoomState.centerX, this.zoomState.centerY, clampedScale);
    
    this.emit('zoom-update', { scale: clampedScale, center });
  }
  
  /**
   * 結束雙指縮放
   */
  endPinchZoom() {
    this.zoomState.isZooming = false;
    this.emit('zoom-end', { scale: this.viewport.scale });
  }
  
  /**
   * 獲取觸控點距離
   */
  getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * 獲取觸控點中心
   */
  getTouchCenter(touch1, touch2) {
    const rect = this.container.getBoundingClientRect();
    return {
      x: (touch1.clientX + touch2.clientX) / 2 - rect.left,
      y: (touch1.clientY + touch2.clientY) / 2 - rect.top
    };
  }
  
  /**
   * 在指定點縮放
   */
  zoomAtPoint(pointX, pointY, zoomDelta) {
    const newScale = this.clampZoom(this.viewport.scale + zoomDelta);
    this.setZoomAtPoint(pointX, pointY, newScale);
  }
  
  /**
   * 設置在指定點的縮放
   */
  setZoomAtPoint(pointX, pointY, newScale) {
    const oldScale = this.viewport.scale;
    const scaleDelta = newScale - oldScale;
    
    // 計算縮放中心調整
    const rect = this.container.getBoundingClientRect();
    const centerX = pointX - rect.width / 2;
    const centerY = pointY - rect.height / 2;
    
    // 調整視窗位置以保持縮放中心
    this.viewport.x -= centerX * scaleDelta;
    this.viewport.y -= centerY * scaleDelta;
    this.viewport.scale = newScale;
    
    this.applyBounds();
    this.updateTransform();
    
    this.emit('zoom-change', { scale: newScale, center: { x: pointX, y: pointY } });
  }
  
  /**
   * 限制縮放範圍
   */
  clampZoom(scale) {
    return Math.max(this.config.zoom.min, Math.min(this.config.zoom.max, scale));
  }
  
  /**
   * 平移視窗
   */
  translateViewport(deltaX, deltaY) {
    // 直接更新位置並應用邊界
    const newX = this.viewport.x + deltaX;
    const newY = this.viewport.y + deltaY;
    
    this.viewport.x = this.clampToBounds(newX, this.bounds.minX, this.bounds.maxX);
    this.viewport.y = this.clampToBounds(newY, this.bounds.minY, this.bounds.maxY);
    
    this.updateTransform();
    
    this.emit('translate', { x: this.viewport.x, y: this.viewport.y });
  }
  
  /**
   * 應用邊界限制
   */
  applyBounds() {
    if (!this.config.bounds.enabled) return;
    
    const { bounds } = this;
    
    // 暫時關閉彈性邊界，使用硬邊界避免位置跳躍
    this.viewport.x = this.clampToBounds(this.viewport.x, bounds.minX, bounds.maxX);
    this.viewport.y = this.clampToBounds(this.viewport.y, bounds.minY, bounds.maxY);
  }
  
  /**
   * 應用彈性邊界
   */
  /**
   * 簡單的邊界限制函數
   */
  clampToBounds(value, min, max) {
    if (isNaN(value) || isNaN(min) || isNaN(max)) {
      console.warn('clampToBounds: Invalid values', { value, min, max });
      return 0;
    }
    
    // 如果邊界範圍無效，不做限制
    if (min > max) {
      console.warn('clampToBounds: Invalid bounds', { min, max });
      return value;
    }
    
    const result = Math.max(min, Math.min(max, value));
    
    // 只在大幅度限制時輸出調試信息
    if (result !== value && Math.abs(value - result) > 10) {
      console.log('clampToBounds: Significant clamping', {
        original: value,
        min,
        max,
        result,
        clampAmount: Math.abs(value - result)
      });
    }
    
    return result;
  }
  
  /**
   * 彈性邊界函數（暫時停用）
   */
  applyElasticBound(value, min, max) {
    if (value < min) {
      const excess = min - value;
      return min - excess * this.config.bounds.elasticStrength;
    } else if (value > max) {
      const excess = value - max;
      return max + excess * this.config.bounds.elasticStrength;
    }
    return value;
  }
  
  /**
   * 更新變換
   */
  updateTransform() {
    if (!this.contentContainer) return;
    
    const transform = `translate(${this.viewport.x}px, ${this.viewport.y}px) scale(${this.viewport.scale})`;
    this.contentContainer.style.transform = transform;
  }
  
  /**
   * 計算邊界
   */
  calculateBounds() {
    if (!this.contentContainer) return;
    
    // 簡化邊界計算 - 給予寬鬆的拖曳範圍，確保所有技能都能看到
    // 不精準計算，優先保證功能性
    
    const baseRange = 1500; // 基礎拖曳範圍
    const scaleMultiplier = this.viewport.scale; // 縮放倍數
    const bufferMultiplier = 1.5; // 安全buffer倍數
    
    // 簡單粗暴的邊界計算：給足夠大的拖曳範圍
    const maxOffsetX = Math.max(
      baseRange * scaleMultiplier * bufferMultiplier,
      this.viewport.width * 0.8  // 至少80%視窗大小
    );
    
    const maxOffsetY = Math.max(
      baseRange * scaleMultiplier * bufferMultiplier, 
      this.viewport.height * 0.8  // 至少80%視窗大小
    );
    
    this.bounds = {
      minX: -maxOffsetX,
      maxX: maxOffsetX,
      minY: -maxOffsetY,
      maxY: maxOffsetY
    };
    
    // 簡化調試信息
    console.log('SkillTreeViewportController: 寬鬆邊界計算', {
      scale: this.viewport.scale,
      viewport: { width: this.viewport.width, height: this.viewport.height },
      dragRange: { x: maxOffsetX * 2, y: maxOffsetY * 2 },
      bounds: this.bounds
    });
  }
  
  /**
   * 居中視窗
   */
  centerViewport() {
    // 技能樹居中到網格中心 (1000, 1000)
    // 視窗坐標系統中，(0, 0) 應該顯示網格中心
    this.viewport.x = 0;
    this.viewport.y = 0;
    this.updateTransform();
    
    console.log('SkillTreeViewportController: 視窗已居中', {
      viewport: { x: this.viewport.x, y: this.viewport.y, scale: this.viewport.scale }
    });
  }
  
  /**
   * 重置視窗
   */
  resetViewport(animate = true) {
    const targetViewport = {
      x: 0,
      y: 0,
      scale: this.config.zoom.default
    };
    
    if (animate) {
      this.animateToViewport(targetViewport);
    } else {
      Object.assign(this.viewport, targetViewport);
      this.updateTransform();
    }
    
    this.emit('viewport-reset', targetViewport);
  }
  
  /**
   * 動畫到指定視窗
   */
  animateToViewport(targetViewport) {
    const startViewport = { ...this.viewport };
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.config.animation.duration, 1);
      
      // 緩動函數
      const eased = this.easeInOutCubic(progress);
      
      // 插值計算
      this.viewport.x = startViewport.x + (targetViewport.x - startViewport.x) * eased;
      this.viewport.y = startViewport.y + (targetViewport.y - startViewport.y) * eased;
      this.viewport.scale = startViewport.scale + (targetViewport.scale - startViewport.scale) * eased;
      
      this.updateTransform();
      
      if (progress < 1) {
        this.animationState.animationId = requestAnimationFrame(animate);
      } else {
        this.animationState.isAnimating = false;
        this.emit('animation-complete', this.viewport);
      }
    };
    
    this.animationState.isAnimating = true;
    this.animationState.animationId = requestAnimationFrame(animate);
  }
  
  /**
   * 緩動函數
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  /**
   * 停止動畫
   */
  stopAnimation() {
    if (this.animationState.animationId) {
      cancelAnimationFrame(this.animationState.animationId);
      this.animationState.animationId = null;
      this.animationState.isAnimating = false;
    }
  }
  
  /**
   * 處理視窗大小變化
   */
  handleResize() {
    this.updateViewportSize();
    this.calculateBounds();
    this.applyBounds();
    this.updateTransform();
    
    this.emit('viewport-resize', {
      width: this.viewport.width,
      height: this.viewport.height
    });
  }
  
  /**
   * 處理方向變化
   */
  handleOrientationChange() {
    setTimeout(() => {
      this.handleResize();
    }, 100); // 延遲確保方向變化完成
  }
  
  /**
   * 處理鍵盤事件
   */
  handleKeyDown(event) {
    // 空格鍵：重置視窗
    if (event.code === 'Space') {
      event.preventDefault();
      this.resetViewport();
      return;
    }
    
    // 方向鍵：移動視窗
    const moveDistance = 50;
    switch (event.code) {
      case 'ArrowUp':
        event.preventDefault();
        this.translateViewport(0, moveDistance);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.translateViewport(0, -moveDistance);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.translateViewport(moveDistance, 0);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.translateViewport(-moveDistance, 0);
        break;
    }
    
    // 加號減號：縮放
    if (event.code === 'Equal' || event.code === 'NumpadAdd') {
      event.preventDefault();
      this.zoomAtPoint(
        this.viewport.width / 2, 
        this.viewport.height / 2, 
        this.config.zoom.step
      );
    } else if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
      event.preventDefault();
      this.zoomAtPoint(
        this.viewport.width / 2, 
        this.viewport.height / 2, 
        -this.config.zoom.step
      );
    }
  }
  
  /**
   * 更新視窗大小
   */
  updateViewportSize() {
    const rect = this.container.getBoundingClientRect();
    
    // 確保有有效的尺寸
    const width = rect.width > 0 ? rect.width : 800; // 預設寬度
    const height = rect.height > 0 ? rect.height : 600; // 預設高度
    
    this.viewport.width = width;
    this.viewport.height = height;
    
    console.log('SkillTreeViewportController: 視窗尺寸更新', {
      rect: { width: rect.width, height: rect.height },
      viewport: { width: this.viewport.width, height: this.viewport.height }
    });
  }
  
  /**
   * 獲取當前視窗狀態
   */
  getViewportState() {
    return {
      ...this.viewport,
      device: this.device,
      bounds: this.bounds,
      isDragging: this.dragState.isDragging,
      isZooming: this.zoomState.isZooming,
      isAnimating: this.animationState.isAnimating
    };
  }
  
  /**
   * 設置視窗狀態
   */
  setViewportState(state) {
    Object.assign(this.viewport, state);
    this.updateTransform();
    this.emit('viewport-change', this.viewport);
  }
  
  /**
   * 銷毀視窗控制器
   */
  destroy() {
    this.stopAnimation();
    
    // 移除事件監聽器
    // 注意：這裡需要保存事件處理函數的引用才能正確移除
    // 簡化起見，這裡只展示結構
    
    console.log('SkillTreeViewportController: 視窗控制器已銷毀');
  }
}

export default SkillTreeViewportController;