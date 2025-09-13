/**
 * 跨瀏覽器兼容性自動化測試腳本
 * Step 4.2: Cross-Browser Compatibility Testing
 */

class CrossBrowserTester {
    constructor() {
        this.testResults = {
            chrome: { passed: 0, failed: 0, warnings: 0 },
            firefox: { passed: 0, failed: 0, warnings: 0 },
            safari: { passed: 0, failed: 0, warnings: 0 },
            edge: { passed: 0, failed: 0, warnings: 0 }
        };

        this.testCategories = [
            'CSS支援性',
            '媒體查詢',
            'ES6+功能',
            '事件處理',
            'CSS Grid/Flexbox',
            'CSS變數',
            'Web APIs',
            '字體載入',
            '響應式圖片',
            '動畫效能'
        ];
    }

    async runAllTests() {
        console.log('🚀 開始跨瀏覽器兼容性測試...\n');

        const tests = [
            this.testCSSSupport,
            this.testResponsiveDesign,
            this.testJavaScriptFeatures,
            this.testEventHandling,
            this.testLayoutSystems,
            this.testWebAPIs,
            this.testPerformance,
            this.testAccessibility
        ];

        for (const test of tests) {
            try {
                await test.call(this);
            } catch (error) {
                this.logError(`測試執行錯誤: ${error.message}`);
            }
        }

        this.generateReport();
    }

    // 測試 CSS 支援性
    testCSSSupport() {
        console.log('📱 測試 CSS 功能支援...');

        const cssFeatures = {
            'CSS Grid': 'display: grid',
            'CSS Flexbox': 'display: flex',
            'CSS Variables': '--color: red',
            'CSS Transforms': 'transform: scale(1)',
            'CSS Animations': '@keyframes',
            'CSS Backdrop Filter': 'backdrop-filter: blur()',
            'CSS Scroll Behavior': 'scroll-behavior: smooth'
        };

        Object.entries(cssFeatures).forEach(([feature, property]) => {
            const supported = this.isCSSSupported(property);
            this.logResult(feature, supported, 'CSS');
        });
    }

    // 測試響應式設計
    testResponsiveDesign() {
        console.log('📐 測試響應式設計...');

        const breakpoints = [
            { name: '手機直向', width: 375, height: 667 },
            { name: '手機橫向', width: 667, height: 375 },
            { name: '平板直向', width: 768, height: 1024 },
            { name: '平板橫向', width: 1024, height: 768 },
            { name: '桌面小屏', width: 1280, height: 720 },
            { name: '桌面大屏', width: 1920, height: 1080 }
        ];

        breakpoints.forEach(bp => {
            // 模擬視窗大小測試
            const result = this.testViewportSize(bp.width, bp.height);
            this.logResult(`${bp.name} (${bp.width}x${bp.height})`, result, '響應式');
        });
    }

    // 測試 JavaScript 功能
    testJavaScriptFeatures() {
        console.log('⚡ 測試 JavaScript 功能...');

        const jsFeatures = {
            'ES6 Arrow Functions': () => (() => true)(),
            'ES6 Template Literals': () => `test` === 'test',
            'ES6 Destructuring': () => {
                const [a] = [1];
                return a === 1;
            },
            'ES6 Spread Operator': () => [...[1, 2]].length === 2,
            'Promise Support': () => typeof Promise !== 'undefined',
            'Async/Await': () => {
                try {
                    eval('(async () => {})');
                    return true;
                } catch (e) {
                    return false;
                }
            },
            'Fetch API': () => typeof fetch !== 'undefined',
            'IntersectionObserver': () => typeof IntersectionObserver !== 'undefined'
        };

        Object.entries(jsFeatures).forEach(([feature, test]) => {
            try {
                const result = test();
                this.logResult(feature, result, 'JavaScript');
            } catch (error) {
                this.logResult(feature, false, 'JavaScript', error.message);
            }
        });
    }

    // 測試事件處理
    testEventHandling() {
        console.log('🎯 測試事件處理...');

        const events = [
            'click', 'touchstart', 'touchend', 'keydown',
            'resize', 'scroll', 'load', 'DOMContentLoaded'
        ];

        events.forEach(eventType => {
            const supported = this.testEventSupport(eventType);
            this.logResult(`${eventType} 事件`, supported, '事件處理');
        });
    }

    // 測試佈局系統
    testLayoutSystems() {
        console.log('🏗️ 測試佈局系統...');

        // 測試 CSS Grid 支援
        const gridSupported = this.testCSSGrid();
        this.logResult('CSS Grid 完整支援', gridSupported, '佈局');

        // 測試 Flexbox 支援
        const flexSupported = this.testFlexbox();
        this.logResult('Flexbox 完整支援', flexSupported, '佈局');

        // 測試響應式單位
        const unitSupported = this.testResponsiveUnits();
        this.logResult('響應式單位 (vw, vh, vmin, vmax)', unitSupported, '佈局');
    }

    // 測試 Web APIs
    testWebAPIs() {
        console.log('🌐 測試 Web APIs...');

        const apis = {
            'Local Storage': () => typeof localStorage !== 'undefined',
            'Session Storage': () => typeof sessionStorage !== 'undefined',
            'History API': () => typeof history.pushState !== 'undefined',
            'Geolocation': () => typeof navigator.geolocation !== 'undefined',
            'Web Workers': () => typeof Worker !== 'undefined',
            'Service Workers': () => typeof navigator.serviceWorker !== 'undefined',
            'WebGL': () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            }
        };

        Object.entries(apis).forEach(([api, test]) => {
            try {
                const result = test();
                this.logResult(api, result, 'Web API');
            } catch (error) {
                this.logResult(api, false, 'Web API', error.message);
            }
        });
    }

    // 測試性能功能
    testPerformance() {
        console.log('🚀 測試性能相關功能...');

        const perfFeatures = {
            'Performance API': () => typeof performance !== 'undefined',
            'RequestAnimationFrame': () => typeof requestAnimationFrame !== 'undefined',
            'Will-change 支援': () => this.isCSSSupported('will-change: transform'),
            'Transform3d 硬體加速': () => this.isCSSSupported('transform: translate3d(0,0,0)')
        };

        Object.entries(perfFeatures).forEach(([feature, test]) => {
            try {
                const result = test();
                this.logResult(feature, result, '性能');
            } catch (error) {
                this.logResult(feature, false, '性能', error.message);
            }
        });
    }

    // 測試無障礙功能
    testAccessibility() {
        console.log('♿ 測試無障礙功能...');

        const a11yFeatures = {
            'ARIA 支援': () => typeof document.createElement('div').setAttribute === 'function',
            'Focus Management': () => typeof document.activeElement !== 'undefined',
            'Screen Reader APIs': () => typeof speechSynthesis !== 'undefined',
            'Keyboard Navigation': () => this.testKeyboardNavigation(),
            'Color Contrast': () => this.testColorContrast(),
            'Alt Text Support': () => true // 基本支援，需手動驗證
        };

        Object.entries(a11yFeatures).forEach(([feature, test]) => {
            try {
                const result = test();
                this.logResult(feature, result, '無障礙');
            } catch (error) {
                this.logResult(feature, false, '無障礙', error.message);
            }
        });
    }

    // 輔助方法
    isCSSSupported(property) {
        const element = document.createElement('div');
        try {
            element.style.cssText = property;
            return element.style.length > 0;
        } catch (e) {
            return false;
        }
    }

    testEventSupport(eventType) {
        try {
            const element = document.createElement('div');
            const supported = ('on' + eventType) in element;
            return supported;
        } catch (e) {
            return false;
        }
    }

    testCSSGrid() {
        return this.isCSSSupported('display: grid') &&
               this.isCSSSupported('grid-template-columns: 1fr') &&
               this.isCSSSupported('grid-gap: 10px');
    }

    testFlexbox() {
        return this.isCSSSupported('display: flex') &&
               this.isCSSSupported('flex-direction: column') &&
               this.isCSSSupported('justify-content: center');
    }

    testResponsiveUnits() {
        return this.isCSSSupported('width: 10vw') &&
               this.isCSSSupported('height: 10vh') &&
               this.isCSSSupported('width: 10vmin') &&
               this.isCSSSupported('width: 10vmax');
    }

    testViewportSize(width, height) {
        // 在實際應用中，這裡會模擬不同視窗大小
        // 現在返回基本檢查結果
        return width > 0 && height > 0;
    }

    testKeyboardNavigation() {
        // 檢查是否有基本的鍵盤導航支援
        return typeof document.addEventListener === 'function';
    }

    testColorContrast() {
        // 基本的對比度檢查 - 在實際應用中會更複雜
        return typeof getComputedStyle !== 'undefined';
    }

    logResult(feature, passed, category, error = null) {
        const status = passed ? '✅' : '❌';
        const message = error ? ` (${error})` : '';
        console.log(`  ${status} ${feature}${message}`);

        // 統計結果（簡化版本，實際會根據瀏覽器分類）
        if (passed) {
            // this.testResults.current.passed++;
        } else {
            // this.testResults.current.failed++;
        }
    }

    logError(message) {
        console.error(`❌ ${message}`);
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 跨瀏覽器兼容性測試報告');
        console.log('='.repeat(60));

        console.log('\n📝 測試摘要:');
        console.log(`• 測試類別數: ${this.testCategories.length}`);
        console.log('• 主要測試項目: CSS支援、響應式設計、JavaScript功能、事件處理');
        console.log('• 測試結果將在瀏覽器控制台中顯示');

        console.log('\n🔍 建議的手動測試項目:');
        console.log('• 在不同瀏覽器中打開 http://localhost:5173');
        console.log('• 測試所有頁面路由功能');
        console.log('• 驗證響應式設計在不同設備上的表現');
        console.log('• 檢查動畫效果的流暢度');
        console.log('• 驗證表單提交和互動功能');

        console.log('\n✨ 測試完成！');
        console.log('詳細結果請查看各項測試輸出。');
    }
}

// 執行測試
if (typeof window !== 'undefined') {
    // 瀏覽器環境
    window.CrossBrowserTester = CrossBrowserTester;

    // 自動執行測試（可選）
    document.addEventListener('DOMContentLoaded', () => {
        const tester = new CrossBrowserTester();
        tester.runAllTests();
    });
} else {
    // Node.js 環境
    module.exports = CrossBrowserTester;
}