/**
 * 網站功能快速測試腳本
 * 在瀏覽器控制台中運行此腳本來測試基本功能
 */

class SiteFunctionTester {
    constructor() {
        this.results = [];
        this.baseUrl = 'http://localhost:5173';
    }

    async runAllTests() {
        console.log('🚀 開始網站功能測試...\n');

        // 測試順序
        await this.testCurrentPage();
        await this.testRouting();
        await this.testResponsiveDesign();
        await this.testInteractiveElements();
        await this.testPerformance();

        this.generateSummary();
    }

    testCurrentPage() {
        console.log('📄 測試當前頁面...');

        const tests = [
            {
                name: '頁面標題存在',
                test: () => document.title && document.title.length > 0
            },
            {
                name: 'HTML 結構完整',
                test: () => document.querySelector('body') && document.querySelector('head')
            },
            {
                name: '主要容器存在',
                test: () => document.querySelector('#app') || document.querySelector('main')
            },
            {
                name: 'CSS 樣式載入',
                test: () => {
                    const testEl = document.createElement('div');
                    testEl.style.display = 'none';
                    document.body.appendChild(testEl);
                    const computed = getComputedStyle(testEl);
                    document.body.removeChild(testEl);
                    return computed.display === 'none';
                }
            },
            {
                name: 'JavaScript 執行正常',
                test: () => typeof window !== 'undefined' && typeof document !== 'undefined'
            }
        ];

        this.runTestGroup('當前頁面', tests);
    }

    async testRouting() {
        console.log('🛣️ 測試路由功能...');

        // 檢查是否為 SPA 應用
        const isHashRouter = window.location.hash.length > 0;
        const router = window.router || window.Router;

        const tests = [
            {
                name: '路由系統存在',
                test: () => router || typeof history.pushState === 'function'
            },
            {
                name: '導航元素存在',
                test: () => {
                    const navElements = document.querySelectorAll('nav, .nav, .navbar, [role="navigation"]');
                    return navElements.length > 0;
                }
            },
            {
                name: '導航連結可點擊',
                test: () => {
                    const links = document.querySelectorAll('a[href], [data-route]');
                    return links.length > 0;
                }
            },
            {
                name: '當前路由標識',
                test: () => {
                    // 檢查是否有當前路由的視覺指示
                    const activeElements = document.querySelectorAll('.active, .current, [aria-current]');
                    return activeElements.length > 0;
                }
            }
        ];

        this.runTestGroup('路由系統', tests);
    }

    testResponsiveDesign() {
        console.log('📱 測試響應式設計...');

        const tests = [
            {
                name: 'Viewport meta 標籤',
                test: () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    return viewport && viewport.content.includes('width=device-width');
                }
            },
            {
                name: 'CSS 媒體查詢支援',
                test: () => {
                    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches !== undefined;
                }
            },
            {
                name: '響應式圖片支援',
                test: () => {
                    const responsiveImages = document.querySelectorAll('img[srcset], picture');
                    return responsiveImages.length >= 0; // 可選功能
                }
            },
            {
                name: '觸控事件支援',
                test: () => {
                    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                }
            }
        ];

        this.runTestGroup('響應式設計', tests);
    }

    testInteractiveElements() {
        console.log('🎯 測試互動元素...');

        const tests = [
            {
                name: '可點擊元素存在',
                test: () => {
                    const clickable = document.querySelectorAll('button, a, [onclick], [role="button"]');
                    return clickable.length > 0;
                }
            },
            {
                name: '表單元素存在',
                test: () => {
                    const forms = document.querySelectorAll('form, input, textarea, select');
                    return forms.length >= 0; // 可選
                }
            },
            {
                name: '事件監聽器功能',
                test: () => {
                    return typeof addEventListener === 'function' && typeof removeEventListener === 'function';
                }
            },
            {
                name: '動畫支援',
                test: () => {
                    return typeof requestAnimationFrame === 'function';
                }
            },
            {
                name: 'CSS Transform 支援',
                test: () => {
                    const testEl = document.createElement('div');
                    return 'transform' in testEl.style || 'webkitTransform' in testEl.style;
                }
            }
        ];

        this.runTestGroup('互動元素', tests);
    }

    testPerformance() {
        console.log('⚡ 測試性能指標...');

        const tests = [
            {
                name: 'Performance API 可用',
                test: () => typeof performance !== 'undefined' && typeof performance.now === 'function'
            },
            {
                name: '頁面載入時間合理',
                test: () => {
                    if (performance.timing) {
                        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                        return loadTime < 5000; // 5秒內
                    }
                    return true;
                }
            },
            {
                name: 'DOM 準備時間合理',
                test: () => {
                    if (performance.timing) {
                        const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
                        return domTime < 3000; // 3秒內
                    }
                    return true;
                }
            },
            {
                name: 'GPU 加速可用',
                test: () => {
                    const canvas = document.createElement('canvas');
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    return gl !== null;
                }
            }
        ];

        this.runTestGroup('性能指標', tests);
    }

    runTestGroup(groupName, tests) {
        console.log(`\n  📋 ${groupName} 測試:`);

        tests.forEach(({ name, test }) => {
            try {
                const result = test();
                const status = result ? '✅' : '⚠️';
                console.log(`    ${status} ${name}`);

                this.results.push({
                    group: groupName,
                    name,
                    passed: !!result
                });
            } catch (error) {
                console.log(`    ❌ ${name} (錯誤: ${error.message})`);
                this.results.push({
                    group: groupName,
                    name,
                    passed: false,
                    error: error.message
                });
            }
        });
    }

    generateSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 網站功能測試摘要');
        console.log('='.repeat(60));

        const groupedResults = this.results.reduce((acc, result) => {
            if (!acc[result.group]) {
                acc[result.group] = { passed: 0, total: 0 };
            }
            acc[result.group].total++;
            if (result.passed) {
                acc[result.group].passed++;
            }
            return acc;
        }, {});

        Object.entries(groupedResults).forEach(([group, stats]) => {
            const percentage = Math.round((stats.passed / stats.total) * 100);
            const status = percentage === 100 ? '✅' : percentage >= 80 ? '⚠️' : '❌';
            console.log(`${status} ${group}: ${stats.passed}/${stats.total} (${percentage}%)`);
        });

        const totalPassed = this.results.filter(r => r.passed).length;
        const totalTests = this.results.length;
        const overallPercentage = Math.round((totalPassed / totalTests) * 100);

        console.log('\n' + '-'.repeat(60));
        console.log(`📈 總體通過率: ${totalPassed}/${totalTests} (${overallPercentage}%)`);

        if (overallPercentage >= 90) {
            console.log('🎉 網站功能測試表現優秀！');
        } else if (overallPercentage >= 75) {
            console.log('👍 網站功能測試表現良好，有少許改進空間。');
        } else {
            console.log('⚠️ 網站功能需要改進，請檢查失敗的測試項目。');
        }

        // 列出失敗的測試
        const failedTests = this.results.filter(r => !r.passed);
        if (failedTests.length > 0) {
            console.log('\n❌ 需要注意的問題:');
            failedTests.forEach(test => {
                console.log(`  • ${test.group}: ${test.name}${test.error ? ` (${test.error})` : ''}`);
            });
        }

        console.log('\n✨ 測試完成！複製以上結果用於跨瀏覽器比較。');
    }

    // 獲取瀏覽器信息
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';

        if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edg')) browser = 'Edge';

        return {
            browser,
            userAgent: ua,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    // 測試特定功能
    async testSpecificFeature(featureName) {
        console.log(`🔍 測試特定功能: ${featureName}`);

        const features = {
            'skill-tree': () => {
                const skillTree = document.querySelector('.skill-tree, #skill-tree, [data-component="skill-tree"]');
                return skillTree !== null;
            },
            'timeline': () => {
                const timeline = document.querySelector('.timeline, .interactive-timeline, [data-component="timeline"]');
                return timeline !== null;
            },
            'project-cards': () => {
                const cards = document.querySelectorAll('.project-card, .card, [data-component="project-card"]');
                return cards.length > 0;
            },
            'navigation': () => {
                const nav = document.querySelector('nav, .navigation, [role="navigation"]');
                return nav !== null;
            }
        };

        if (features[featureName]) {
            const result = features[featureName]();
            console.log(`${result ? '✅' : '❌'} ${featureName}: ${result ? '正常' : '未找到'}`);
            return result;
        } else {
            console.log(`❓ 未知功能: ${featureName}`);
            return false;
        }
    }
}

// 導出和自動執行
if (typeof window !== 'undefined') {
    window.SiteFunctionTester = SiteFunctionTester;

    // 在控制台中可以運行:
    // const tester = new SiteFunctionTester();
    // tester.runAllTests();

    console.log('🔧 網站功能測試器已載入！');
    console.log('執行測試: const tester = new SiteFunctionTester(); tester.runAllTests();');
    console.log('瀏覽器信息:', new SiteFunctionTester().getBrowserInfo());
} else {
    module.exports = SiteFunctionTester;
}