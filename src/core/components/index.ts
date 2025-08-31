/**
 * 組件系統統一入口
 * 
 * 導出所有組件相關的類別、類型和工具函數
 */

// 基礎組件類
export { BaseComponent } from './BaseComponent.js';
export type {
  ComponentState,
  ComponentConfig,
  ComponentLifecycleHooks,
  RenderContext
} from './BaseComponent.js';

// 組件工廠
export { ComponentFactory, componentFactory } from './ComponentFactory.js';
export {
  registerComponent,
  createComponent,
  isComponentRegistered,
  getRegisteredComponentTypes
} from './ComponentFactory.js';
export type {
  ComponentConstructor,
  ComponentRegistration,
  CreateComponentOptions,
  ComponentInstance,
  FactoryStats
} from './ComponentFactory.js';

// 導入類型用於本地使用
import type { BaseComponent } from './BaseComponent.js';
import type { ComponentConfig } from './BaseComponent.js';
import { componentFactory, createComponent } from './ComponentFactory.js';

// 測試組件
export { TestComponent } from './TestComponent.js';
export type {
  TestComponentConfig,
  TestComponentState
} from './TestComponent.js';

/**
 * 初始化組件系統
 */
export async function initializeComponentSystem(): Promise<void> {
  console.log('🚀 Initializing Component System...');
  
  const factory = componentFactory;
  
  // 註冊核心組件
  await factory.registerCoreComponents();
  
  // 驗證註冊
  const validation = await factory.validateRegistrations();
  
  if (validation.invalid.length > 0) {
    console.warn('⚠️ Some components failed validation:', validation.invalid);
  }
  
  // 輸出註冊報告
  console.log(factory.getRegistrationReport());
  
  console.log('✅ Component System initialized successfully!');
  console.log(`📊 Registered ${validation.valid.length} valid components`);
}

/**
 * 創建組件的便捷函數（帶錯誤處理）
 */
export async function safeCreateComponent<T extends BaseComponent>(
  componentName: string,
  container?: string | HTMLElement,
  config?: Partial<ComponentConfig>
): Promise<T | null> {
  try {
    return await createComponent<T>(componentName, {
      container,
      config,
      autoInit: true,
      timeout: 5000
    });
  } catch (error) {
    console.error(`Failed to create component ${componentName}:`, error);
    return null;
  }
}

/**
 * 批量創建組件
 */
export async function createMultipleComponents(
  specs: Array<{
    name: string;
    container?: string | HTMLElement;
    config?: Partial<ComponentConfig>;
  }>
): Promise<BaseComponent[]> {
  const results = await Promise.allSettled(
    specs.map(spec => safeCreateComponent(spec.name, spec.container, spec.config))
  );
  
  return results
    .filter((result): result is PromiseFulfilledResult<BaseComponent> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
}

/**
 * 獲取組件系統狀態
 */
export function getComponentSystemStatus() {
  const factory = componentFactory;
  const stats = factory.getStats();
  const categoryMapping = factory.getCategoryMapping();
  
  return {
    ...stats,
    categories: categoryMapping,
    isHealthy: stats.errorCount === 0,
    uptime: Date.now() // 簡單的運行時間追蹤
  };
}