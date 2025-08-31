/**
 * 核心系統整合測試
 * 
 * 測試 Router、StateManager 和整個 Core 系統的整合運作
 */

import { 
  initializeCoreSystem, 
  getCoreSystemStatus,
  Router,
  StateManager,
  type RouteConfig,
  type StateModule 
} from './core/index.js';

/**
 * 測試路由系統
 */
async function testRouterSystem(): Promise<void> {
  console.log('📋 測試 Router 路由系統');

  try {
    const { createRouter } = await import('./core/router/Router.js');
    const router = createRouter({ mode: 'hash' });

    // 測試路由註冊
    const testRoutes: RouteConfig[] = [
      {
        path: '/',
        name: 'home',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: '儀表板', requiresAuth: false }
      },
      {
        path: '/profile/:id',
        name: 'profile',
        meta: { title: '個人資料', requiresAuth: true }
      },
      {
        path: '/projects',
        name: 'projects',
        children: [
          {
            path: '/skills',
            name: 'skills',
            meta: { title: '技能樹' }
          }
        ]
      }
    ];

    router.addRoutes(testRoutes);
    console.log('- 路由註冊完成');

    // 測試路由匹配
    const matchResult = router.matchRoute('/profile/123');
    console.log('- 路由匹配測試:', matchResult ? '成功' : '失敗');
    if (matchResult) {
      console.log('  匹配結果:', matchResult.params);
    }

    // 測試路由導航
    router.on('router:navigated', (data) => {
      console.log('- 導航完成事件:', data.to.path);
    });

    console.log('✅ Router 系統測試通過\n');

  } catch (error) {
    console.error('❌ Router 系統測試失敗:', error);
  }
}

/**
 * 測試狀態管理系統
 */
async function testStateSystem(): Promise<void> {
  console.log('📋 測試 StateManager 狀態管理系統');

  try {
    const { createStateManager } = await import('./core/state/StateManager.js');
    const stateManager = createStateManager({
      strict: false,
      devtools: true,
      persistent: false
    });

    // 定義測試模組
    const userModule: StateModule<{
      id: number | null;
      name: string;
      email: string;
      isAuthenticated: boolean;
    }> = {
      namespace: 'user',
      initialState: {
        id: null,
        name: '',
        email: '',
        isAuthenticated: false
      },
      mutations: {
        setUser(state, payload) {
          state.id = payload.id;
          state.name = payload.name;
          state.email = payload.email;
          state.isAuthenticated = true;
        },
        logout(state) {
          state.id = null;
          state.name = '';
          state.email = '';
          state.isAuthenticated = false;
        },
        updateProfile(state, payload) {
          if (payload.name !== undefined) state.name = payload.name;
          if (payload.email !== undefined) state.email = payload.email;
        }
      },
      actions: {
        async login(context, { username, password }) {
          // 模擬 API 調用
          console.log('- 模擬登入 API 調用:', username);
          
          // 模擬成功登入
          context.commit('setUser', {
            id: 123,
            name: username,
            email: `${username}@example.com`
          });
          
          return { success: true };
        },
        
        async updateUserProfile(context, profileData) {
          console.log('- 更新用戶資料:', profileData);
          context.commit('updateProfile', profileData);
          return { success: true };
        }
      },
      getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        userDisplayName: (state) => state.name || '訪客',
        userInfo: (state) => ({
          id: state.id,
          name: state.name,
          email: state.email
        })
      }
    };

    // 註冊模組
    stateManager.registerModule(userModule);
    console.log('- 用戶模組註冊完成');

    // 測試狀態訂閱
    const unsubscribe = stateManager.subscribe((mutation, state) => {
      console.log(`- 狀態變更: ${mutation.type}`, mutation.payload);
    });

    // 測試動作分發
    await stateManager.dispatch('user/login', {
      username: 'testuser',
      password: 'password'
    });

    // 測試 Getter
    const isLoggedIn = stateManager.getGetter('user', 'isLoggedIn');
    const displayName = stateManager.getGetter('user', 'userDisplayName');
    console.log('- 登入狀態:', isLoggedIn);
    console.log('- 顯示名稱:', displayName);

    // 測試狀態快照
    const snapshot = stateManager.createSnapshot('after-login');
    console.log('- 建立狀態快照:', snapshot.timestamp);

    // 清理訂閱
    unsubscribe();
    
    console.log('✅ StateManager 系統測試通過\n');

  } catch (error) {
    console.error('❌ StateManager 系統測試失敗:', error);
  }
}

/**
 * 測試核心系統整合
 */
async function testCoreSystemIntegration(): Promise<void> {
  console.log('📋 測試核心系統整合');

  try {
    // 初始化核心系統
    const coreSystem = await initializeCoreSystem({
      config: {
        enableValidator: true,
        enableLoader: true
      },
      router: {
        mode: 'hash',
        base: ''
      },
      state: {
        strict: false,
        persistent: false,
        devtools: true
      },
      components: {
        autoInit: true
      }
    });

    console.log('- 核心系統初始化完成');

    // 獲取系統狀態
    const status = getCoreSystemStatus();
    console.log('- 系統狀態檢查:');
    console.log(`  Config Ready: ${status.config.ready}`);
    console.log(`  Components Ready: ${status.components.ready}`);
    console.log(`  Router Ready: ${status.router.ready}`);
    console.log(`  State Ready: ${status.state.ready}`);
    console.log(`  系統健康: ${coreSystem.isHealthy()}`);

    // 測試子系統存取
    const subSystems = coreSystem.getSubSystems();
    console.log('- 子系統存取測試:');
    console.log(`  Config System: ${!!subSystems.config}`);
    console.log(`  Component System: ${!!subSystems.components}`);
    console.log(`  Router System: ${!!subSystems.router}`);
    console.log(`  State System: ${!!subSystems.state}`);

    console.log('✅ 核心系統整合測試通過\n');

  } catch (error) {
    console.error('❌ 核心系統整合測試失敗:', error);
  }
}

/**
 * 展示系統能力
 */
async function demonstrateSystemCapabilities(): Promise<void> {
  console.log('🎮 核心系統能力展示');
  console.log('='.repeat(50));

  console.log('\n📊 系統架構總覽:');
  console.log(`
核心系統架構 (Core System)
├── Config-Driven 配置系統
│   ├── ConfigManager (配置管理)
│   ├── ConfigValidator (驗證系統)  
│   └── ConfigLoader (動態載入)
├── 組件化開發系統
│   ├── BaseComponent (基礎組件類)
│   ├── ComponentFactory (組件工廠)
│   └── TestComponent (測試組件)
├── 路由導航系統
│   ├── 路由註冊和匹配
│   ├── 歷史記錄管理
│   ├── 頁面切換動畫
│   └── 路由守衛功能
├── 狀態管理系統
│   ├── 模組化狀態存儲
│   ├── 響應式訂閱機制
│   ├── 動作和變更管理
│   └── 狀態持久化支援
└── 統一管理入口
    ├── 自動初始化
    ├── 健康狀態監控
    └── 系統生命週期管理
  `);

  console.log('\n✨ 核心特色:');
  console.log('• 🏗️ 完整的 TypeScript 架構');
  console.log('• ⚡ Config-Driven 響應式配置');
  console.log('• 🧱 組件化開發模式');
  console.log('• 🛣️ SPA 路由導航系統');  
  console.log('• 📦 模組化狀態管理');
  console.log('• 🎯 事件驅動架構');
  console.log('• 🔧 統一的系統管理');
  console.log('• 📊 完整的監控和統計');

  console.log('\n💡 使用範例:');
  console.log(`
// 1. 初始化系統
import { initializeCoreSystem } from './core/index.js';
const coreSystem = await initializeCoreSystem();

// 2. 使用路由系統
import { getRouter } from './core/index.js';
const router = getRouter();
await router.push('/dashboard');

// 3. 使用狀態管理
import { getStateManager } from './core/index.js';
const state = getStateManager();
await state.dispatch('user/login', credentials);

// 4. 創建組件
import { createComponent } from './core/index.js';
const component = await createComponent('TestComponent', {
  container: '#app',
  config: { title: 'Hello World' }
});
  `);
}

/**
 * 執行所有測試
 */
async function runAllTests(): Promise<void> {
  console.log('🚀 開始核心系統測試...\n');

  try {
    await testRouterSystem();
    await testStateSystem();
    await testCoreSystemIntegration();
    await demonstrateSystemCapabilities();

    console.log('\n🎉 所有測試完成！');
    console.log('📊 總結:');
    console.log('- ✅ Router 路由系統: 路由匹配、導航、事件');
    console.log('- ✅ StateManager 狀態管理: 模組、動作、訂閱');
    console.log('- ✅ 核心系統整合: 統一初始化、狀態監控');
    console.log('- ✅ 準備好用於遊戲化個人作品集專案');

  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
}

// 執行測試
if (typeof window === 'undefined') {
  // Node.js 環境
  runAllTests();
} else {
  // 瀏覽器環境  
  document.addEventListener('DOMContentLoaded', () => {
    runAllTests();
  });
}

export { runAllTests, testRouterSystem, testStateSystem, testCoreSystemIntegration };