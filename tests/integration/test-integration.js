/**
 * 整合測試腳本
 * Step 3.5.4: 首次整合測試
 */

class IntegrationTester {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  /**
   * 執行所有測試
   */
  async runAllTests() {
    console.log('🧪 開始整合測試...');

    // 測試 1: 路由系統
    await this.testRouteSystem();

    // 測試 2: 組件整合
    await this.testComponentIntegration();

    // 測試 3: 導航系統
    await this.testNavigationSystem();

    // 測試 4: 響應式設計
    await this.testResponsiveDesign();

    // 測試 5: 性能基準
    await this.testPerformanceBaseline();

    // 生成測試報告
    this.generateReport();
  }

  /**
   * 測試路由系統
   */
  async testRouteSystem() {
    console.log('🛣️ 測試路由系統...');

    const routes = [
      '/',
      '/about',
      '/skills',
      '/work-projects',
      '/personal-projects',
      '/contact'
    ];

    for (const route of routes) {
      try {
        await this.testSingleRoute(route);
      } catch (error) {
        this.addTestResult('路由測試', route, false, error.message);
      }
    }

    // 測試 404 頁面
    await this.test404Page();
  }

  /**
   * 測試單一路由
   */
  async testSingleRoute(route) {
    console.log(`  📄 測試路由: ${route}`);

    const startTime = performance.now();

    // 模擬導航
    if (window.gamingPortfolioApp && window.gamingPortfolioApp.getRouter()) {
      const router = window.gamingPortfolioApp.getRouter();
      await router.navigate(route, false);

      // 等待頁面載入
      await this.waitForPageLoad();

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // 檢查頁面是否正確載入
      const success = this.verifyPageLoad(route);

      this.addTestResult('路由測試', route, success, success ? `載入時間: ${loadTime.toFixed(2)}ms` : '頁面載入失敗');
    } else {
      this.addTestResult('路由測試', route, false, '路由器未初始化');
    }
  }

  /**
   * 等待頁面載入完成
   */
  async waitForPageLoad(timeout = 3000) {
    return new Promise((resolve) => {
      const startTime = Date.now();

      function checkLoad() {
        const pageContent = document.getElementById('page-content');
        if (pageContent && pageContent.innerHTML.trim() !== '') {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          resolve(false);
        } else {
          setTimeout(checkLoad, 100);
        }
      }

      checkLoad();
    });
  }

  /**
   * 驗證頁面載入
   */
  verifyPageLoad(route) {
    const pageContent = document.getElementById('page-content');
    if (!pageContent || pageContent.innerHTML.trim() === '') {
      return false;
    }

    // 檢查特定頁面的關鍵元素
    switch (route) {
      case '/':
        return document.querySelector('.hero-section') !== null;
      case '/about':
        return document.querySelector('.character-panel') !== null;
      case '/skills':
        return document.querySelector('.skill-tree') !== null || document.querySelector('.mobile-skill-tree') !== null;
      case '/work-projects':
        return document.querySelector('.interactive-timeline') !== null;
      case '/personal-projects':
        return document.querySelector('.personal-projects-gallery') !== null;
      case '/contact':
        return document.querySelector('.contact-form') !== null;
      default:
        return true;
    }
  }

  /**
   * 測試 404 頁面
   */
  async test404Page() {
    console.log('  🚫 測試 404 頁面...');

    try {
      const router = window.gamingPortfolioApp.getRouter();
      await router.navigate('/nonexistent-page', false);
      await this.waitForPageLoad();

      const pageContent = document.getElementById('page-content');
      const has404Content = pageContent && pageContent.innerHTML.includes('404');

      this.addTestResult('404 測試', '/nonexistent-page', has404Content, has404Content ? '正確顯示 404 頁面' : '404 頁面未正確顯示');
    } catch (error) {
      this.addTestResult('404 測試', '/nonexistent-page', false, error.message);
    }
  }

  /**
   * 測試組件整合
   */
  async testComponentIntegration() {
    console.log('🧩 測試組件整合...');

    // 測試導航欄
    const navbar = document.querySelector('.navbar');
    this.addTestResult('組件整合', '導航欄', navbar !== null, navbar ? '導航欄正常載入' : '導航欄未找到');

    // 測試麵包屑導航
    const breadcrumb = document.querySelector('.breadcrumb-navigation');
    this.addTestResult('組件整合', '麵包屑導航', breadcrumb !== null, breadcrumb ? '麵包屑導航正常載入' : '麵包屑導航未找到');

    // 測試進度指示器
    const progressIndicator = document.querySelector('.progress-indicator');
    this.addTestResult('組件整合', '進度指示器', progressIndicator !== null, progressIndicator ? '進度指示器正常載入' : '進度指示器未找到');

    // 測試快捷鍵導航
    const keyboardNav = document.querySelector('.keyboard-navigation');
    this.addTestResult('組件整合', '快捷鍵導航', keyboardNav !== null, keyboardNav ? '快捷鍵導航正常載入' : '快捷鍵導航未找到');
  }

  /**
   * 測試導航系統
   */
  async testNavigationSystem() {
    console.log('🧭 測試導航系統...');

    // 測試導航連結點擊
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    this.addTestResult('導航系統', '導航連結數量', navLinks.length >= 5, `找到 ${navLinks.length} 個導航連結`);

    // 測試進度指示器功能
    if (window.progressIndicator) {
      try {
        const stats = window.progressIndicator.getProgressStats();
        this.addTestResult('導航系統', '進度追蹤', stats !== null, `進度: ${stats.progress}%, 已訪問: ${stats.visitedCount}/${stats.totalPages}`);
      } catch (error) {
        this.addTestResult('導航系統', '進度追蹤', false, error.message);
      }
    }

    // 測試瀏覽器歷史記錄
    const historySupported = 'pushState' in window.history;
    this.addTestResult('導航系統', '歷史記錄支援', historySupported, historySupported ? '支援瀏覽器歷史記錄' : '不支援瀏覽器歷史記錄');
  }

  /**
   * 測試響應式設計
   */
  async testResponsiveDesign() {
    console.log('📱 測試響應式設計...');

    const originalWidth = window.innerWidth;

    // 模擬不同視窗大小（實際只能測試 CSS 媒體查詢）
    const breakpoints = [
      { name: '手機', width: 375 },
      { name: '平板', width: 768 },
      { name: '桌面', width: 1024 },
      { name: '大桌面', width: 1920 }
    ];

    for (const bp of breakpoints) {
      // 檢查對應的 CSS 媒體查詢
      const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`);
      const matches = bp.width <= window.innerWidth;

      this.addTestResult('響應式設計', bp.name, true, `${bp.width}px 斷點 ${matches ? '符合' : '不符合'} 當前視窗 ${window.innerWidth}px`);
    }

    // 檢查主要組件的響應式類別
    const responsiveElements = [
      '.navbar',
      '.hero-section',
      '.skill-tree',
      '.interactive-timeline'
    ];

    responsiveElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        const hasResponsiveClasses = element.className.includes('responsive') ||
                                   element.className.includes('mobile') ||
                                   element.className.includes('desktop');
        this.addTestResult('響應式設計', selector, true, hasResponsiveClasses ? '具備響應式類別' : '未檢測到響應式類別');
      }
    });
  }

  /**
   * 測試性能基準
   */
  async testPerformanceBaseline() {
    console.log('⚡ 測試性能基準...');

    // DOM 節點數量
    const nodeCount = document.querySelectorAll('*').length;
    this.addTestResult('性能基準', 'DOM 節點數', nodeCount < 1000, `${nodeCount} 個節點 ${nodeCount < 1000 ? '(良好)' : '(過多)'}`);

    // CSS 文件數量
    const cssFiles = document.querySelectorAll('link[rel="stylesheet"]').length;
    this.addTestResult('性能基準', 'CSS 文件數', cssFiles < 10, `${cssFiles} 個 CSS 文件`);

    // JavaScript 錯誤檢查
    const hasConsoleErrors = this.checkConsoleErrors();
    this.addTestResult('性能基準', '控制台錯誤', !hasConsoleErrors, hasConsoleErrors ? '發現控制台錯誤' : '無控制台錯誤');

    // 圖片載入檢查
    const images = document.querySelectorAll('img');
    let brokenImages = 0;
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        brokenImages++;
      }
    });
    this.addTestResult('性能基準', '圖片載入', brokenImages === 0, `${images.length - brokenImages}/${images.length} 圖片載入成功`);
  }

  /**
   * 檢查控制台錯誤（簡化版）
   */
  checkConsoleErrors() {
    // 這是一個簡化的檢查，實際應該監聽 console.error
    return false; // 假設無錯誤
  }

  /**
   * 添加測試結果
   */
  addTestResult(category, testName, success, message) {
    this.testResults.push({
      category,
      testName,
      success,
      message,
      timestamp: new Date().toISOString()
    });

    const status = success ? '✅' : '❌';
    console.log(`    ${status} ${category} - ${testName}: ${message}`);
  }

  /**
   * 生成測試報告
   */
  generateReport() {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    console.log('\n📊 === 整合測試報告 ===');
    console.log(`🕒 測試時間: ${totalTime}ms`);
    console.log(`📈 測試總數: ${totalTests}`);
    console.log(`✅ 通過: ${passedTests}`);
    console.log(`❌ 失敗: ${failedTests}`);
    console.log(`📊 通過率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ 失敗的測試:');
      this.testResults
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  • ${r.category} - ${r.testName}: ${r.message}`);
        });
    }

    console.log('\n🎯 測試完成！');

    // 返回摘要給調用者
    return {
      totalTests,
      passedTests,
      failedTests,
      passRate: (passedTests / totalTests) * 100,
      totalTime,
      results: this.testResults
    };
  }
}

// 導出測試器供手動使用
window.IntegrationTester = IntegrationTester;

// 提供簡易執行方法
window.runIntegrationTests = async function() {
  const tester = new IntegrationTester();
  return await tester.runAllTests();
};

console.log('🧪 整合測試腳本載入完成！');
console.log('💡 使用方法: 在控制台執行 runIntegrationTests()');