/**
 * 核心系統統一入口
 * 
 * 整合所有核心系統並提供統一的初始化和管理介面
 */

// Config 系統
export {
  ConfigManager,
  ConfigValidator,
  ConfigLoader,
  createConfigSystem,
  getGlobalConfig
} from './config/index.js';

// 組件系統
export {
  BaseComponent,
  ComponentFactory,
  componentFactory,
  TestComponent,
  initializeComponentSystem,
  safeCreateComponent,
  createMultipleComponents
} from './components/index.js';

// 路由系統
export {
  Router,
  createRouter,
  getRouter
} from './router/Router.js';

// 狀態管理系統
export {
  StateManager,
  createStateManager,
  getStateManager
} from './state/StateManager.js';

// 事件系統
export { EventEmitter } from './events/EventEmitter.js';

// 類型導出
export type {
  ConfigValue,
  ConfigObject,
  ConfigArray
} from '../types/config.js';

export type {
  ComponentConfig,
  ComponentState,
  ComponentLifecycleHooks,
  RenderContext
} from './components/BaseComponent.js';

export type {
  ComponentRegistration,
  CreateComponentOptions
} from './components/ComponentFactory.js';

export type {
  RouteConfig,
  RouteLocation,
  RouterConfig,
  NavigationOptions
} from './router/Router.js';

export type {
  StateModule,
  StateActionContext,
  StateMutation,
  StateManagerConfig
} from './state/StateManager.js';

/**
 * 核心系統配置
 */
export interface CoreSystemConfig {
  config?: {
    enableValidator?: boolean;
    enableLoader?: boolean;
  };
  router?: {
    mode?: 'hash' | 'history';
    base?: string;
  };
  state?: {
    strict?: boolean;
    persistent?: boolean;
    devtools?: boolean;
  };
  components?: {
    autoInit?: boolean;
  };
}

/**
 * 核心系統狀態
 */
export interface CoreSystemStatus {
  initialized: boolean;
  config: {
    ready: boolean;
    totalConfigs: number;
    totalValidators: number;
  };
  components: {
    ready: boolean;
    totalRegistered: number;
    totalActive: number;
  };
  router: {
    ready: boolean;
    totalRoutes: number;
    currentRoute: string | null;
  };
  state: {
    ready: boolean;
    totalModules: number;
    totalSubscriptions: number;
  };
  errors: string[];
}

/**
 * 核心系統管理器
 */
export class CoreSystem {
  private static instance: CoreSystem | null = null;
  private initialized = false;
  private configSystem: any = null;
  private componentSystem: any = null;
  private routerSystem: any = null;
  private stateSystem: any = null;
  private errors: string[] = [];

  private constructor() {}

  /**
   * 獲取單例實例
   */
  static getInstance(): CoreSystem {
    if (!CoreSystem.instance) {
      CoreSystem.instance = new CoreSystem();
    }
    return CoreSystem.instance;
  }

  /**
   * 初始化核心系統
   */
  async initialize(config: CoreSystemConfig = {}): Promise<void> {
    if (this.initialized) {
      console.warn('Core system already initialized');
      return;
    }

    console.log('🚀 Initializing Core System...');

    try {
      // 1. 初始化 Config 系統
      await this.initializeConfigSystem(config.config);

      // 2. 初始化組件系統
      await this.initializeComponentSystem(config.components);

      // 3. 初始化路由系統
      await this.initializeRouterSystem(config.router);

      // 4. 初始化狀態管理系統
      await this.initializeStateSystem(config.state);

      this.initialized = true;
      console.log('✅ Core System initialized successfully!');

      // 輸出系統狀態
      const status = this.getStatus();
      console.log('📊 System Status:', status);

    } catch (error) {
      const errorMsg = `Core system initialization failed: ${(error as Error).message}`;
      this.errors.push(errorMsg);
      console.error('❌', errorMsg);
      throw error;
    }
  }

  /**
   * 初始化 Config 系統
   */
  private async initializeConfigSystem(config: any = {}): Promise<void> {
    try {
      const { createConfigSystem } = await import('./config/index.js');
      this.configSystem = createConfigSystem({
        enableValidator: true,
        enableLoader: true,
        ...config
      });

      console.log('✅ Config System initialized');
    } catch (error) {
      throw new Error(`Failed to initialize Config System: ${(error as Error).message}`);
    }
  }

  /**
   * 初始化組件系統
   */
  private async initializeComponentSystem(config: any = {}): Promise<void> {
    try {
      const { initializeComponentSystem } = await import('./components/index.js');
      await initializeComponentSystem();
      this.componentSystem = true;

      console.log('✅ Component System initialized');
    } catch (error) {
      throw new Error(`Failed to initialize Component System: ${(error as Error).message}`);
    }
  }

  /**
   * 初始化路由系統
   */
  private async initializeRouterSystem(config: any = {}): Promise<void> {
    try {
      const { createRouter } = await import('./router/Router.js');
      this.routerSystem = createRouter({
        mode: 'hash',
        ...config
      });

      console.log('✅ Router System initialized');
    } catch (error) {
      throw new Error(`Failed to initialize Router System: ${(error as Error).message}`);
    }
  }

  /**
   * 初始化狀態管理系統
   */
  private async initializeStateSystem(config: any = {}): Promise<void> {
    try {
      const { createStateManager } = await import('./state/StateManager.js');
      this.stateSystem = createStateManager({
        strict: false,
        persistent: false,
        devtools: true,
        ...config
      });

      console.log('✅ State Management System initialized');
    } catch (error) {
      throw new Error(`Failed to initialize State Management System: ${(error as Error).message}`);
    }
  }

  /**
   * 獲取系統狀態
   */
  getStatus(): CoreSystemStatus {
    const configStats = this.configSystem ? this.configSystem.manager?.getStats() : null;
    const componentStats = this.componentSystem ? (globalThis as any).componentFactory?.getStats() : null;
    const routerStats = this.routerSystem ? {
      totalRoutes: this.routerSystem.getRoutes?.()?.length || 0,
      currentRoute: this.routerSystem.getCurrentRoute?.()?.path || null
    } : null;
    const stateStats = this.stateSystem ? this.stateSystem.getStats?.() : null;

    return {
      initialized: this.initialized,
      config: {
        ready: !!this.configSystem,
        totalConfigs: configStats?.totalConfigs || 0,
        totalValidators: configStats?.totalInterpolators || 0
      },
      components: {
        ready: !!this.componentSystem,
        totalRegistered: componentStats?.totalRegistered || 0,
        totalActive: componentStats?.totalActive || 0
      },
      router: {
        ready: !!this.routerSystem,
        totalRoutes: routerStats?.totalRoutes || 0,
        currentRoute: routerStats?.currentRoute || null
      },
      state: {
        ready: !!this.stateSystem,
        totalModules: stateStats?.modules || 0,
        totalSubscriptions: stateStats?.subscriptions || 0
      },
      errors: [...this.errors]
    };
  }

  /**
   * 檢查系統健康狀態
   */
  isHealthy(): boolean {
    const status = this.getStatus();
    return status.initialized && 
           status.config.ready && 
           status.components.ready && 
           status.router.ready && 
           status.state.ready &&
           status.errors.length === 0;
  }

  /**
   * 獲取各個子系統實例
   */
  getSubSystems() {
    return {
      config: this.configSystem,
      components: this.componentSystem,
      router: this.routerSystem,
      state: this.stateSystem
    };
  }

  /**
   * 重新初始化
   */
  async reinitialize(config?: CoreSystemConfig): Promise<void> {
    this.destroy();
    await this.initialize(config);
  }

  /**
   * 銷毀系統
   */
  destroy(): void {
    if (this.routerSystem && typeof this.routerSystem.destroy === 'function') {
      this.routerSystem.destroy();
    }

    if (this.stateSystem && typeof this.stateSystem.destroy === 'function') {
      this.stateSystem.destroy();
    }

    this.configSystem = null;
    this.componentSystem = null;
    this.routerSystem = null;
    this.stateSystem = null;
    this.initialized = false;
    this.errors = [];

    CoreSystem.instance = null;
    console.log('🗑️ Core System destroyed');
  }
}

/**
 * 便捷函數：初始化核心系統
 */
export async function initializeCoreSystem(config?: CoreSystemConfig): Promise<CoreSystem> {
  const coreSystem = CoreSystem.getInstance();
  await coreSystem.initialize(config);
  return coreSystem;
}

/**
 * 便捷函數：獲取核心系統實例
 */
export function getCoreSystem(): CoreSystem {
  return CoreSystem.getInstance();
}

/**
 * 便捷函數：獲取系統狀態
 */
export function getCoreSystemStatus(): CoreSystemStatus {
  return CoreSystem.getInstance().getStatus();
}