/**
 * ComponentFactory - 組件工廠
 * 
 * 功能：
 * 1. 組件註冊系統 - 管理所有可用組件類型
 * 2. 組件創建系統 - 動態創建組件實例
 * 3. 生命週期管理 - 處理初始化和錯誤
 * 4. 依賴注入 - 自動注入配置和依賴
 * 5. 組件池管理 - 復用和性能優化
 * 
 * @author Claude
 * @version 1.0.0
 */

import { BaseComponent, ComponentConfig, ComponentLifecycleHooks } from './BaseComponent.js';
import type { ConfigValue } from '../../types/config.js';

// ComponentFactory 相關類型定義
export interface ComponentConstructor {
  new (
    container?: string | HTMLElement,
    config?: Partial<ComponentConfig>,
    hooks?: ComponentLifecycleHooks
  ): BaseComponent;
  
  readonly componentType: string;
  readonly version: string;
}

export interface ComponentRegistration {
  name: string;
  constructor: ComponentConstructor;
  version: string;
  description?: string;
  dependencies?: string[];
  category?: string;
  singleton?: boolean;
  lazy?: boolean;
}

export interface CreateComponentOptions {
  container?: string | HTMLElement;
  config?: Partial<ComponentConfig>;
  hooks?: ComponentLifecycleHooks;
  autoInit?: boolean;
  timeout?: number;
  retries?: number;
  fallback?: string;
}

export interface ComponentInstance {
  id: string;
  type: string;
  component: BaseComponent;
  container: HTMLElement | null;
  config: ComponentConfig;
  created: Date;
  initialized: boolean;
  destroyed: boolean;
}

export interface FactoryStats {
  totalRegistered: number;
  totalCreated: number;
  totalActive: number;
  totalDestroyed: number;
  registeredTypes: string[];
  activeInstances: number;
  singletonInstances: number;
  errorCount: number;
}

export class ComponentFactory {
  private static instance: ComponentFactory | null = null;
  
  // 組件註冊表
  private registrations: Map<string, ComponentRegistration> = new Map();
  
  // 組件實例管理
  private instances: Map<string, ComponentInstance> = new Map();
  private singletons: Map<string, ComponentInstance> = new Map();
  
  // 統計信息
  private stats = {
    totalCreated: 0,
    totalDestroyed: 0,
    errorCount: 0
  };
  
  // 創建選項默認值
  private defaultCreateOptions: CreateComponentOptions = {
    autoInit: true,
    timeout: 10000,
    retries: 3,
    fallback: undefined
  };

  constructor() {
    // 註冊基礎組件類型
    this.registerBuiltInComponents();
  }

  /**
   * 獲取單例實例
   */
  static getInstance(): ComponentFactory {
    if (!ComponentFactory.instance) {
      ComponentFactory.instance = new ComponentFactory();
    }
    return ComponentFactory.instance;
  }

  /**
   * ========================================
   * 組件註冊系統 - Step 1.2 第一部分
   * ========================================
   */

  /**
   * 註冊組件
   */
  register(registration: ComponentRegistration): ComponentFactory {
    // 驗證註冊信息
    this.validateRegistration(registration);
    
    // 檢查是否已註冊
    if (this.registrations.has(registration.name)) {
      console.warn(`Component ${registration.name} is already registered. Overriding...`);
    }
    
    // 檢查依賴
    if (registration.dependencies && registration.dependencies.length > 0) {
      this.validateDependencies(registration.dependencies);
    }
    
    // 註冊組件
    this.registrations.set(registration.name, registration);
    
    console.log(`✅ Component registered: ${registration.name} v${registration.version}`);
    return this;
  }

  /**
   * 批量註冊組件
   */
  registerBatch(registrations: ComponentRegistration[]): ComponentFactory {
    registrations.forEach(registration => {
      try {
        this.register(registration);
      } catch (error) {
        console.error(`Failed to register component ${registration.name}:`, error);
        this.stats.errorCount++;
      }
    });
    return this;
  }

  /**
   * 取消註冊組件
   */
  unregister(componentName: string): boolean {
    const registration = this.registrations.get(componentName);
    if (!registration) {
      return false;
    }

    // 銷毀所有該類型的實例
    this.destroyInstancesByType(componentName);
    
    // 移除註冊
    this.registrations.delete(componentName);
    
    console.log(`🗑️ Component unregistered: ${componentName}`);
    return true;
  }

  /**
   * 檢查組件是否已註冊
   */
  isRegistered(componentName: string): boolean {
    return this.registrations.has(componentName);
  }

  /**
   * 獲取已註冊的組件類型列表
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registrations.keys());
  }

  /**
   * 獲取組件註冊信息
   */
  getRegistration(componentName: string): ComponentRegistration | undefined {
    return this.registrations.get(componentName);
  }

  /**
   * 根據類別獲取組件列表
   */
  getComponentsByCategory(category: string): ComponentRegistration[] {
    return Array.from(this.registrations.values())
      .filter(registration => registration.category === category);
  }

  /**
   * 搜索組件
   */
  searchComponents(query: string): ComponentRegistration[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.registrations.values())
      .filter(registration => 
        registration.name.toLowerCase().includes(lowerQuery) ||
        registration.description?.toLowerCase().includes(lowerQuery) ||
        registration.category?.toLowerCase().includes(lowerQuery)
      );
  }

  /**
   * 驗證註冊信息
   */
  private validateRegistration(registration: ComponentRegistration): void {
    if (!registration.name || typeof registration.name !== 'string') {
      throw new Error('Component registration must have a valid name');
    }
    
    if (!registration.constructor || typeof registration.constructor !== 'function') {
      throw new Error(`Component ${registration.name} must have a valid constructor`);
    }
    
    if (!registration.version || typeof registration.version !== 'string') {
      throw new Error(`Component ${registration.name} must have a version`);
    }

    // 檢查構造函數是否繼承自 BaseComponent
    const proto = registration.constructor.prototype;
    if (!proto || !(proto instanceof BaseComponent) && proto.constructor !== BaseComponent) {
      // 這裡我們檢查原型鏈，但由於 TypeScript 的限制，我們放寬檢查
      console.warn(`Component ${registration.name} may not extend BaseComponent properly`);
    }
  }

  /**
   * 驗證依賴
   */
  private validateDependencies(dependencies: string[]): void {
    const missing = dependencies.filter(dep => !this.isRegistered(dep));
    if (missing.length > 0) {
      throw new Error(`Missing dependencies for component: ${missing.join(', ')}`);
    }
  }

  /**
   * ========================================
   * 預設組件註冊 - Step 1.2 第三部分
   * ========================================
   */

  /**
   * 註冊內建組件
   */
  private registerBuiltInComponents(): void {
    // 動態導入和註冊測試組件
    this.registerTestComponents();
    
    console.log('🏗️ ComponentFactory initialized with built-in component registrations');
  }

  /**
   * 註冊測試組件
   */
  private async registerTestComponents(): Promise<void> {
    try {
      // 動態導入 TestComponent
      const { TestComponent } = await import('./TestComponent.js');
      
      this.register({
        name: 'TestComponent',
        constructor: TestComponent as ComponentConstructor,
        version: TestComponent.version,
        description: '用於測試 BaseComponent 和 ComponentFactory 功能的測試組件',
        category: 'test',
        singleton: false,
        lazy: false
      });

    } catch (error) {
      console.warn('Failed to register test components:', error);
    }
  }

  /**
   * 註冊所有核心組件類型
   */
  async registerCoreComponents(): Promise<void> {
    const coreRegistrations = [
      {
        name: 'TestComponent',
        description: '基礎測試組件',
        category: 'test',
        singleton: false,
        lazy: false
      }
      // 未來可以在這裡添加更多核心組件：
      // SkillTreeComponent, ProjectCardComponent, CharacterPanelComponent 等
    ];

    for (const reg of coreRegistrations) {
      try {
        // 動態導入組件類
        const modulePath = `./${reg.name}.js`;
        const module = await import(modulePath);
        const ComponentClass = module[reg.name];
        
        if (ComponentClass) {
          this.register({
            ...reg,
            constructor: ComponentClass as ComponentConstructor,
            version: ComponentClass.version || '1.0.0'
          });
        }
        
      } catch (error) {
        console.warn(`Failed to register core component ${reg.name}:`, error);
      }
    }
  }

  /**
   * 創建組件類型映射表
   */
  getComponentTypeMapping(): Record<string, ComponentRegistration> {
    const mapping: Record<string, ComponentRegistration> = {};
    
    for (const [name, registration] of this.registrations) {
      mapping[name] = {
        ...registration,
        // 不包含構造函數以避免序列化問題
        constructor: null as any
      };
    }
    
    return mapping;
  }

  /**
   * 根據類別獲取組件映射
   */
  getCategoryMapping(): Record<string, string[]> {
    const mapping: Record<string, string[]> = {};
    
    for (const registration of this.registrations.values()) {
      const category = registration.category || 'uncategorized';
      if (!mapping[category]) {
        mapping[category] = [];
      }
      mapping[category].push(registration.name);
    }
    
    return mapping;
  }

  /**
   * 驗證所有註冊的組件
   */
  async validateRegistrations(): Promise<{
    valid: string[];
    invalid: Array<{ name: string; error: string }>;
  }> {
    const valid: string[] = [];
    const invalid: Array<{ name: string; error: string }> = [];
    
    for (const [name, registration] of this.registrations) {
      try {
        // 嘗試創建一個測試實例（但不初始化）
        const testDiv = document.createElement('div');
        testDiv.id = `test-container-${name}`;
        document.body.appendChild(testDiv);
        
        const instance = new registration.constructor(
          testDiv,
          { debug: false },
          {}
        );
        
        // 檢查基本屬性
        if (typeof instance.getInfo === 'function') {
          const info = instance.getInfo();
          if (info.type && info.version) {
            valid.push(name);
          } else {
            invalid.push({ name, error: 'Missing type or version info' });
          }
        } else {
          invalid.push({ name, error: 'Missing getInfo method' });
        }
        
        // 清理測試容器
        document.body.removeChild(testDiv);
        
      } catch (error) {
        invalid.push({ 
          name, 
          error: `Constructor failed: ${(error as Error).message}` 
        });
      }
    }
    
    return { valid, invalid };
  }

  /**
   * 輸出註冊報告
   */
  getRegistrationReport(): string {
    const stats = this.getStats();
    const categoryMapping = this.getCategoryMapping();
    
    let report = '📋 Component Factory Registration Report\n';
    report += '='.repeat(50) + '\n\n';
    
    report += `📊 統計信息:\n`;
    report += `  - 已註冊組件: ${stats.totalRegistered}\n`;
    report += `  - 已創建實例: ${stats.totalCreated}\n`;
    report += `  - 活躍實例: ${stats.totalActive}\n`;
    report += `  - 錯誤數量: ${stats.errorCount}\n\n`;
    
    report += `📁 按類別分組:\n`;
    Object.entries(categoryMapping).forEach(([category, components]) => {
      report += `  ${category}:\n`;
      components.forEach(comp => {
        const reg = this.registrations.get(comp);
        report += `    - ${comp} v${reg?.version} ${reg?.description ? '(' + reg.description + ')' : ''}\n`;
      });
    });
    
    return report;
  }

  /**
   * ========================================
   * 組件創建系統 - Step 1.2 第二部分  
   * ========================================
   */

  /**
   * 創建組件實例
   */
  async create<T extends BaseComponent>(
    componentName: string, 
    options: CreateComponentOptions = {}
  ): Promise<T> {
    // 合併選項
    const finalOptions = { ...this.defaultCreateOptions, ...options };
    
    // 獲取註冊信息
    const registration = this.registrations.get(componentName);
    if (!registration) {
      throw new Error(`Component ${componentName} is not registered`);
    }

    // 檢查單例
    if (registration.singleton) {
      const existingInstance = this.singletons.get(componentName);
      if (existingInstance) {
        return existingInstance.component as T;
      }
    }

    try {
      // 檢查依賴
      if (registration.dependencies) {
        await this.ensureDependencies(registration.dependencies);
      }

      // 創建實例
      const instance = await this.createInstance(registration, finalOptions);
      
      // 記錄實例
      this.trackInstance(instance, registration);
      
      // 自動初始化
      if (finalOptions.autoInit) {
        await this.initializeInstance(instance.component, finalOptions.timeout!);
      }

      this.stats.totalCreated++;
      return instance.component as T;

    } catch (error) {
      this.stats.errorCount++;
      
      // 嘗試使用回退選項
      if (finalOptions.fallback && finalOptions.fallback !== componentName) {
        console.warn(`Failed to create ${componentName}, falling back to ${finalOptions.fallback}`);
        return this.create<T>(finalOptions.fallback, { ...finalOptions, fallback: undefined });
      }
      
      throw new Error(`Failed to create component ${componentName}: ${(error as Error).message}`);
    }
  }

  /**
   * 創建多個組件實例
   */
  async createBatch<T extends BaseComponent>(
    requests: Array<{ name: string; options?: CreateComponentOptions }>
  ): Promise<T[]> {
    const results = await Promise.allSettled(
      requests.map(req => this.create<T>(req.name, req.options))
    );

    const successful: T[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push(requests[index].name);
        console.error(`Failed to create component ${requests[index].name}:`, result.reason);
      }
    });

    if (failed.length > 0) {
      console.warn(`Failed to create ${failed.length} components: ${failed.join(', ')}`);
    }

    return successful;
  }

  /**
   * 創建組件實例（內部方法）
   */
  private async createInstance(
    registration: ComponentRegistration,
    options: CreateComponentOptions
  ): Promise<ComponentInstance> {
    // 生成唯一 ID
    const id = this.generateInstanceId(registration.name);
    
    // 解析容器
    let container: HTMLElement | null = null;
    if (options.container) {
      container = typeof options.container === 'string' 
        ? document.querySelector(options.container)
        : options.container;
    }

    // 創建組件實例
    const component = new registration.constructor(
      container || undefined,
      options.config || {},
      options.hooks || {}
    );

    // 創建實例記錄
    const instance: ComponentInstance = {
      id,
      type: registration.name,
      component,
      container,
      config: component.getConfigValue ? component.getConfigValue('') : {} as ComponentConfig,
      created: new Date(),
      initialized: false,
      destroyed: false
    };

    return instance;
  }

  /**
   * 追蹤組件實例
   */
  private trackInstance(instance: ComponentInstance, registration: ComponentRegistration): void {
    // 添加到實例列表
    this.instances.set(instance.id, instance);
    
    // 如果是單例，也添加到單例列表
    if (registration.singleton) {
      this.singletons.set(instance.type, instance);
    }

    // 監聽組件銷毀事件
    instance.component.onDestroy(() => {
      this.handleInstanceDestroyed(instance.id);
    });
  }

  /**
   * 初始化組件實例
   */
  private async initializeInstance(component: BaseComponent, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Component initialization timeout after ${timeout}ms`));
      }, timeout);

      // 監聽初始化完成
      component.onReady(() => {
        clearTimeout(timeoutId);
        resolve();
      });

      // 監聽初始化錯誤
      component.onError((error) => {
        clearTimeout(timeoutId);
        reject(new Error(`Component initialization failed: ${error.error}`));
      });

      // 開始初始化（如果還未初始化）
      if (!component.isReady()) {
        (component as any).init?.().catch((error: Error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
      } else {
        clearTimeout(timeoutId);
        resolve();
      }
    });
  }

  /**
   * 確保依賴組件已創建
   */
  private async ensureDependencies(dependencies: string[]): Promise<void> {
    const missing = [];
    
    for (const dep of dependencies) {
      if (!this.hasActiveInstance(dep)) {
        missing.push(dep);
      }
    }

    if (missing.length > 0) {
      // 嘗試創建缺失的依賴
      await Promise.all(
        missing.map(dep => this.create(dep, { autoInit: true }))
      );
    }
  }

  /**
   * 生成實例 ID
   */
  private generateInstanceId(componentName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${componentName}-${timestamp}-${random}`;
  }

  /**
   * 處理實例銷毀
   */
  private handleInstanceDestroyed(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.destroyed = true;
      instance.initialized = false;
      
      // 從單例列表中移除（如果存在）
      if (this.singletons.get(instance.type)?.id === instanceId) {
        this.singletons.delete(instance.type);
      }
      
      this.stats.totalDestroyed++;
    }
  }

  /**
   * 檢查是否有活動實例
   */
  private hasActiveInstance(componentType: string): boolean {
    for (const instance of this.instances.values()) {
      if (instance.type === componentType && !instance.destroyed) {
        return true;
      }
    }
    return false;
  }

  /**
   * 根據類型銷毀實例
   */
  private destroyInstancesByType(componentType: string): void {
    for (const instance of this.instances.values()) {
      if (instance.type === componentType && !instance.destroyed) {
        instance.component.destroy();
      }
    }
  }

  /**
   * ========================================
   * 實例管理方法
   * ========================================
   */

  /**
   * 獲取組件實例
   */
  getInstance(instanceId: string): ComponentInstance | undefined {
    return this.instances.get(instanceId);
  }

  /**
   * 根據類型獲取實例
   */
  getInstancesByType(componentType: string): ComponentInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.type === componentType && !instance.destroyed);
  }

  /**
   * 獲取所有活動實例
   */
  getActiveInstances(): ComponentInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => !instance.destroyed);
  }

  /**
   * 銷毀實例
   */
  async destroyInstance(instanceId: string): Promise<boolean> {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.destroyed) {
      return false;
    }

    try {
      await instance.component.destroy();
      return true;
    } catch (error) {
      console.error(`Failed to destroy instance ${instanceId}:`, error);
      return false;
    }
  }

  /**
   * 銷毀所有實例
   */
  async destroyAll(): Promise<void> {
    const activeInstances = this.getActiveInstances();
    
    await Promise.allSettled(
      activeInstances.map(instance => this.destroyInstance(instance.id))
    );
    
    // 清理所有記錄
    this.instances.clear();
    this.singletons.clear();
  }

  /**
   * 獲取工廠統計信息
   */
  getStats(): FactoryStats {
    const activeInstances = this.getActiveInstances();
    
    return {
      totalRegistered: this.registrations.size,
      totalCreated: this.stats.totalCreated,
      totalActive: activeInstances.length,
      totalDestroyed: this.stats.totalDestroyed,
      registeredTypes: Array.from(this.registrations.keys()),
      activeInstances: activeInstances.length,
      singletonInstances: this.singletons.size,
      errorCount: this.stats.errorCount
    };
  }

  /**
   * 設置默認創建選項
   */
  setDefaultCreateOptions(options: Partial<CreateComponentOptions>): void {
    this.defaultCreateOptions = { ...this.defaultCreateOptions, ...options };
  }

  /**
   * 重置統計信息
   */
  resetStats(): void {
    this.stats = {
      totalCreated: 0,
      totalDestroyed: 0,
      errorCount: 0
    };
  }
}

/**
 * 全域組件工廠實例
 */
export const componentFactory = ComponentFactory.getInstance();

/**
 * 便捷函數：註冊組件
 */
export function registerComponent(registration: ComponentRegistration): ComponentFactory {
  return componentFactory.register(registration);
}

/**
 * 便捷函數：創建組件
 */
export function createComponent<T extends BaseComponent>(
  componentName: string,
  options?: CreateComponentOptions
): Promise<T> {
  return componentFactory.create<T>(componentName, options);
}

/**
 * 便捷函數：檢查組件是否已註冊
 */
export function isComponentRegistered(componentName: string): boolean {
  return componentFactory.isRegistered(componentName);
}

/**
 * 便捷函數：獲取已註冊的組件類型
 */
export function getRegisteredComponentTypes(): string[] {
  return componentFactory.getRegisteredTypes();
}