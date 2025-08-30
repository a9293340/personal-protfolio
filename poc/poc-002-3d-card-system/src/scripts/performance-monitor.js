/**
 * 效能監控系統
 * 監控 FPS、記憶體使用量和動畫效能
 */

class PerformanceMonitor {
  constructor() {
    this.isMonitoring = false;
    this.fpsData = [];
    this.memoryData = [];
    this.animationTimes = [];
    
    // UI 元素
    this.fpsElement = document.getElementById('fpsCounter');
    this.memoryElement = document.getElementById('memoryUsage');
    this.cardCountElement = document.getElementById('cardCount');
    
    // 效能統計
    this.stats = {
      fps: 0,
      avgFps: 0,
      memory: 0,
      cardCount: 0,
      totalFlips: 0,
      avgFlipTime: 0
    };
    
    this.initialize();
  }
  
  initialize() {
    console.log('初始化效能監控系統...');
    
    // 檢查瀏覽器支援
    this.checkBrowserSupport();
    
    // 初始化 FPS 監控
    this.initializeFPSMonitoring();
    
    // 初始化記憶體監控
    this.initializeMemoryMonitoring();
    
    console.log('效能監控系統初始化完成');
  }
  
  /**
   * 檢查瀏覽器支援
   */
  checkBrowserSupport() {
    this.browserSupport = {
      performanceMemory: 'memory' in performance,
      requestAnimationFrame: 'requestAnimationFrame' in window,
      performanceNow: 'now' in performance,
      css3DTransform: this.checkCSS3DSupport()
    };
    
    console.log('瀏覽器支援檢查:', this.browserSupport);
  }
  
  /**
   * 檢查 CSS 3D Transform 支援
   */
  checkCSS3DSupport() {
    const testElement = document.createElement('div');
    const testStyles = [
      'transform: rotateY(90deg)',
      'transform-style: preserve-3d',
      'backface-visibility: hidden',
      'perspective: 1000px'
    ];
    
    return testStyles.every(style => {
      testElement.style.cssText = style;
      return testElement.style.length > 0;
    });
  }
  
  /**
   * 初始化 FPS 監控
   */
  initializeFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= 1000) {
        // 計算 FPS
        const fps = Math.round((frameCount * 1000) / deltaTime);
        this.updateFPS(fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    this.measureFPS = measureFPS;
  }
  
  /**
   * 初始化記憶體監控
   */
  initializeMemoryMonitoring() {
    if (!this.browserSupport.performanceMemory) {
      console.warn('瀏覽器不支援 performance.memory API');
      return;
    }
    
    this.memoryMonitorInterval = setInterval(() => {
      if (this.isMonitoring) {
        this.updateMemoryUsage();
      }
    }, 2000); // 每 2 秒更新一次
  }
  
  /**
   * 開始監控
   */
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('效能監控開始...');
    
    // 啟動 FPS 監控
    if (this.browserSupport.requestAnimationFrame) {
      requestAnimationFrame(this.measureFPS);
    }
    
    // 初始化顯示
    this.updateDisplay();
  }
  
  /**
   * 停止監控
   */
  stop() {
    this.isMonitoring = false;
    
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }
    
    console.log('效能監控停止');
  }
  
  /**
   * 更新 FPS
   */
  updateFPS(fps) {
    this.stats.fps = fps;
    this.fpsData.push(fps);
    
    // 保持最近 60 個數據點
    if (this.fpsData.length > 60) {
      this.fpsData.shift();
    }
    
    // 計算平均 FPS
    this.stats.avgFps = Math.round(
      this.fpsData.reduce((sum, val) => sum + val, 0) / this.fpsData.length
    );
    
    this.updateDisplay();
  }
  
  /**
   * 更新記憶體使用量
   */
  updateMemoryUsage() {
    if (!this.browserSupport.performanceMemory) return;
    
    const memory = performance.memory;
    const memoryMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    
    this.stats.memory = memoryMB;
    this.memoryData.push(memoryMB);
    
    // 保持最近 30 個數據點
    if (this.memoryData.length > 30) {
      this.memoryData.shift();
    }
    
    this.updateDisplay();
  }
  
  /**
   * 更新卡片數量
   */
  updateCardCount(count) {
    this.stats.cardCount = count;
    this.updateDisplay();
  }
  
  /**
   * 記錄翻轉動畫時間
   */
  recordFlipAnimation() {
    const startTime = performance.now();
    
    // 使用 setTimeout 模擬動畫完成時間
    setTimeout(() => {
      const endTime = performance.now();
      const animationTime = endTime - startTime;
      
      this.animationTimes.push(animationTime);
      this.stats.totalFlips++;
      
      // 保持最近 50 個動畫時間記錄
      if (this.animationTimes.length > 50) {
        this.animationTimes.shift();
      }
      
      // 計算平均動畫時間
      this.stats.avgFlipTime = Math.round(
        this.animationTimes.reduce((sum, val) => sum + val, 0) / this.animationTimes.length
      );
      
    }, 600); // 假設動畫時長為 600ms
  }
  
  /**
   * 更新顯示
   */
  updateDisplay() {
    if (this.fpsElement) {
      const fpsColor = this.getFPSColor(this.stats.fps);
      this.fpsElement.textContent = this.stats.fps;
      this.fpsElement.style.color = fpsColor;
    }
    
    if (this.memoryElement) {
      const memoryColor = this.getMemoryColor(this.stats.memory);
      this.memoryElement.textContent = `${this.stats.memory} MB`;
      this.memoryElement.style.color = memoryColor;
    }
    
    if (this.cardCountElement) {
      this.cardCountElement.textContent = this.stats.cardCount;
    }
  }
  
  /**
   * 獲取 FPS 顯示顏色
   */
  getFPSColor(fps) {
    if (fps >= 55) return '#4caf50';      // 綠色 - 優秀
    if (fps >= 45) return '#ff9800';      // 橙色 - 良好
    if (fps >= 30) return '#f44336';      // 紅色 - 較差
    return '#9c27b0';                     // 紫色 - 極差
  }
  
  /**
   * 獲取記憶體使用量顏色
   */
  getMemoryColor(memory) {
    if (memory < 50) return '#4caf50';    // 綠色 - 正常
    if (memory < 100) return '#ff9800';   // 橙色 - 注意
    if (memory < 150) return '#f44336';   // 紅色 - 警告
    return '#9c27b0';                     // 紫色 - 危險
  }
  
  /**
   * 檢測性能問題
   */
  detectPerformanceIssues() {
    const issues = [];
    
    // FPS 過低
    if (this.stats.avgFps < 30) {
      issues.push({
        type: 'low_fps',
        message: `平均 FPS 過低: ${this.stats.avgFps}`,
        severity: 'high'
      });
    }
    
    // 記憶體使用量過高
    if (this.stats.memory > 100) {
      issues.push({
        type: 'high_memory',
        message: `記憶體使用量過高: ${this.stats.memory} MB`,
        severity: 'medium'
      });
    }
    
    // 動畫時間過長
    if (this.stats.avgFlipTime > 700) {
      issues.push({
        type: 'slow_animation',
        message: `動畫響應過慢: ${this.stats.avgFlipTime} ms`,
        severity: 'medium'
      });
    }
    
    return issues;
  }
  
  /**
   * 生成效能報告
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      browserInfo: {
        userAgent: navigator.userAgent,
        support: this.browserSupport
      },
      performance: {
        ...this.stats,
        fpsHistory: [...this.fpsData],
        memoryHistory: [...this.memoryData]
      },
      issues: this.detectPerformanceIssues()
    };
    
    console.log('效能報告:', report);
    return report;
  }
  
  /**
   * 匯出效能數據
   */
  exportData() {
    const data = this.generateReport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3d-card-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('效能數據已匯出');
  }
  
  /**
   * 效能優化建議
   */
  getOptimizationSuggestions() {
    const suggestions = [];
    const issues = this.detectPerformanceIssues();
    
    if (issues.some(issue => issue.type === 'low_fps')) {
      suggestions.push('考慮減少同時顯示的卡片數量');
      suggestions.push('使用 CSS will-change 屬性優化動畫');
      suggestions.push('考慮使用 transform3d(0,0,0) 強制硬體加速');
    }
    
    if (issues.some(issue => issue.type === 'high_memory')) {
      suggestions.push('實施虛擬滾動減少 DOM 元素');
      suggestions.push('清理未使用的卡片實例');
      suggestions.push('優化圖片和資源載入');
    }
    
    if (issues.some(issue => issue.type === 'slow_animation')) {
      suggestions.push('簡化動畫效果或縮短動畫時間');
      suggestions.push('使用 CSS transform 代替修改 DOM 屬性');
      suggestions.push('檢查是否有阻塞主線程的操作');
    }
    
    return suggestions;
  }
}

// 全域快捷鍵
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'r' && window.performanceMonitor) {
    e.preventDefault();
    console.log('效能報告:');
    window.performanceMonitor.generateReport();
  }
  
  if (e.ctrlKey && e.key === 's' && window.performanceMonitor) {
    e.preventDefault();
    window.performanceMonitor.exportData();
  }
});

// 導出類別
window.PerformanceMonitor = PerformanceMonitor;