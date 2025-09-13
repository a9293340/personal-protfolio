/**
 * StateManager - 全域狀態管理器
 *
 * 功能：
 * 1. 全域狀態存儲 - 中央化狀態管理
 * 2. 狀態訂閱機制 - 響應式狀態更新
 * 3. 狀態變化通知 - 事件驅動更新
 * 4. 狀態持久化 - 本地存儲整合
 * 5. 模組化狀態 - 命名空間管理
 *
 * @author Claude
 * @version 1.0.0
 */

import { EventEmitter } from '../events/EventEmitter.js';

// 狀態管理相關類型定義
export interface StateModule<T = any> {
  namespace: string;
  initialState: T;
  mutations?: Record<string, (state: T, payload?: any) => void>;
  actions?: Record<
    string,
    (context: StateActionContext<T>, payload?: any) => any
  >;
  getters?: Record<string, (state: T, rootState?: any) => any>;
  strict?: boolean;
  persistent?: boolean;
}

export interface StateActionContext<T = any> {
  state: T;
  rootState: any;
  commit: (mutation: string, payload?: any) => void;
  dispatch: (action: string, payload?: any) => Promise<any>;
  getters: Record<string, any>;
}

export interface StateSubscription {
  id: string;
  namespace?: string;
  mutation?: string;
  callback: (mutation: StateMutation, state: any) => void;
  once?: boolean;
}

export interface StateMutation {
  type: string;
  namespace: string;
  payload?: any;
  timestamp: number;
}

export interface StateSnapshot {
  id: string;
  timestamp: number;
  state: any;
  mutations: StateMutation[];
}

export interface StateManagerConfig {
  strict?: boolean;
  devtools?: boolean;
  persistent?: boolean;
  storageKey?: string;
  maxHistorySize?: number;
}

export class StateManager extends EventEmitter {
  private static instance: StateManager | null = null;

  // 狀態存儲
  private state: Record<string, any> = {};
  private modules: Map<string, StateModule> = new Map();

  // 訂閱管理
  private subscriptions: Map<string, StateSubscription> = new Map();
  private subscriptionCounter = 0;

  // 變更歷史
  private mutations: StateMutation[] = [];
  private snapshots: StateSnapshot[] = [];

  // 配置
  private config: StateManagerConfig;

  constructor(config: StateManagerConfig = {}) {
    super();

    this.config = {
      strict: false,
      devtools: true,
      persistent: false,
      storageKey: 'app-state',
      maxHistorySize: 100,
      ...config,
    };

    this.initializePersistentState();
    this.setupDevtools();
  }

  /**
   * 獲取單例實例
   */
  static getInstance(config?: StateManagerConfig): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(config);
    }
    return StateManager.instance;
  }

  /**
   * ========================================
   * 模組管理
   * ========================================
   */

  /**
   * 註冊狀態模組
   */
  registerModule<T>(module: StateModule<T>): void {
    if (this.modules.has(module.namespace)) {
      console.warn(
        `Module ${module.namespace} already registered. Overriding...`
      );
    }

    // 驗證模組
    this.validateModule(module);

    // 註冊模組
    this.modules.set(module.namespace, module);

    // 初始化狀態
    this.state[module.namespace] = { ...module.initialState };

    // 持久化恢復
    if (module.persistent && this.config.persistent) {
      this.restoreModuleState(module.namespace);
    }

    console.log(`✅ State module registered: ${module.namespace}`);

    this.emit('stateManager:moduleRegistered', {
      namespace: module.namespace,
      module,
    });
  }

  /**
   * 取消註冊模組
   */
  unregisterModule(namespace: string): boolean {
    if (!this.modules.has(namespace)) {
      return false;
    }

    // 移除狀態
    delete this.state[namespace];

    // 移除模組
    this.modules.delete(namespace);

    // 清理相關訂閱
    this.cleanupModuleSubscriptions(namespace);

    console.log(`🗑️ State module unregistered: ${namespace}`);

    this.emit('stateManager:moduleUnregistered', { namespace });

    return true;
  }

  /**
   * 檢查模組是否存在
   */
  hasModule(namespace: string): boolean {
    return this.modules.has(namespace);
  }

  /**
   * 獲取模組列表
   */
  getModules(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * ========================================
   * 狀態存取
   * ========================================
   */

  /**
   * 獲取狀態
   */
  getState<T = any>(namespace?: string): T {
    if (namespace) {
      return this.state[namespace] as T;
    }
    return this.state as T;
  }

  /**
   * 獲取狀態值
   */
  getStateValue<T = any>(path: string): T | undefined {
    const keys = path.split('.');
    let current = this.state;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current as T;
  }

  /**
   * 通過 Getter 獲取計算值
   */
  getGetter(namespace: string, getterName: string): any {
    const module = this.modules.get(namespace);
    if (!module || !module.getters || !module.getters[getterName]) {
      throw new Error(`Getter ${namespace}/${getterName} not found`);
    }

    const getter = module.getters[getterName];
    const moduleState = this.state[namespace];

    return getter(moduleState, this.state);
  }

  /**
   * ========================================
   * 狀態變更 (Mutations)
   * ========================================
   */

  /**
   * 提交變更
   */
  commit(type: string, payload?: any): void {
    const [namespace, mutationName] = this.parseMutationType(type);

    if (!namespace || !mutationName) {
      throw new Error(`Invalid mutation type: ${type}`);
    }

    const module = this.modules.get(namespace);
    if (!module) {
      throw new Error(`Module ${namespace} not found`);
    }

    if (!module.mutations || !module.mutations[mutationName]) {
      throw new Error(`Mutation ${type} not found`);
    }

    // 嚴格模式檢查
    if (this.config.strict || module.strict) {
      this.ensureStrictMode();
    }

    // 執行變更
    const previousState = JSON.parse(JSON.stringify(this.state[namespace]));

    try {
      module.mutations[mutationName](this.state[namespace], payload);

      // 記錄變更
      const mutation: StateMutation = {
        type,
        namespace,
        payload,
        timestamp: Date.now(),
      };

      this.recordMutation(mutation);

      // 觸發變更事件
      this.notifyStateChange(mutation, previousState, this.state[namespace]);

      // 持久化
      if (module.persistent && this.config.persistent) {
        this.persistModuleState(namespace);
      }
    } catch (error) {
      console.error(`Mutation ${type} failed:`, error);
      // 恢復狀態
      this.state[namespace] = previousState;
      throw error;
    }
  }

  /**
   * ========================================
   * 異步動作 (Actions)
   * ========================================
   */

  /**
   * 分發動作
   */
  async dispatch(type: string, payload?: any): Promise<any> {
    const [namespace, actionName] = this.parseMutationType(type);

    if (!namespace || !actionName) {
      throw new Error(`Invalid action type: ${type}`);
    }

    const module = this.modules.get(namespace);
    if (!module) {
      throw new Error(`Module ${namespace} not found`);
    }

    if (!module.actions || !module.actions[actionName]) {
      throw new Error(`Action ${type} not found`);
    }

    // 創建動作上下文
    const context: StateActionContext = {
      state: this.state[namespace],
      rootState: this.state,
      commit: (mutationType: string, mutationPayload?: any) => {
        // 如果沒有命名空間前綴，添加當前模組命名空間
        const fullType = mutationType.includes('/')
          ? mutationType
          : `${namespace}/${mutationType}`;
        this.commit(fullType, mutationPayload);
      },
      dispatch: (actionType: string, actionPayload?: any) => {
        // 如果沒有命名空間前綴，添加當前模組命名空間
        const fullType = actionType.includes('/')
          ? actionType
          : `${namespace}/${actionType}`;
        return this.dispatch(fullType, actionPayload);
      },
      getters: this.getModuleGetters(namespace),
    };

    try {
      this.emit('stateManager:actionStart', { type, payload });

      const result = await module.actions[actionName](context, payload);

      this.emit('stateManager:actionEnd', { type, payload, result });

      return result;
    } catch (error) {
      this.emit('stateManager:actionError', { type, payload, error });
      throw error;
    }
  }

  /**
   * ========================================
   * 訂閱機制
   * ========================================
   */

  /**
   * 訂閱狀態變更
   */
  subscribe(
    callback: (mutation: StateMutation, state: any) => void,
    options: {
      namespace?: string;
      mutation?: string;
      once?: boolean;
    } = {}
  ): () => void {
    const subscriptionId = `sub_${++this.subscriptionCounter}`;

    const subscription: StateSubscription = {
      id: subscriptionId,
      namespace: options.namespace,
      mutation: options.mutation,
      callback,
      once: options.once,
    };

    this.subscriptions.set(subscriptionId, subscription);

    // 返回取消訂閱函數
    return () => {
      this.subscriptions.delete(subscriptionId);
    };
  }

  /**
   * 訂閱特定模組
   */
  subscribeToModule(
    namespace: string,
    callback: (mutation: StateMutation, state: any) => void
  ): () => void {
    return this.subscribe(callback, { namespace });
  }

  /**
   * 訂閱特定變更
   */
  subscribeToMutation(
    mutationType: string,
    callback: (mutation: StateMutation, state: any) => void
  ): () => void {
    return this.subscribe(callback, { mutation: mutationType });
  }

  /**
   * 一次性訂閱
   */
  subscribeOnce(
    callback: (mutation: StateMutation, state: any) => void,
    options: { namespace?: string; mutation?: string } = {}
  ): () => void {
    return this.subscribe(callback, { ...options, once: true });
  }

  /**
   * ========================================
   * 狀態快照
   * ========================================
   */

  /**
   * 創建狀態快照
   */
  createSnapshot(label?: string): StateSnapshot {
    const snapshot: StateSnapshot = {
      id: label || `snapshot-${Date.now()}`,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(this.state)),
      mutations: [...this.mutations],
    };

    this.snapshots.push(snapshot);

    // 限制快照數量
    if (this.snapshots.length > (this.config.maxHistorySize || 100)) {
      this.snapshots.shift();
    }

    this.emit('stateManager:snapshotCreated', { snapshot, label });

    return snapshot;
  }

  /**
   * 恢復快照
   */
  restoreSnapshot(snapshot: StateSnapshot): void {
    this.state = JSON.parse(JSON.stringify(snapshot.state));
    this.mutations = [...snapshot.mutations];

    this.emit('stateManager:snapshotRestored', { snapshot });

    // 通知所有訂閱者
    this.notifyAllSubscribers({
      type: 'SNAPSHOT_RESTORED',
      namespace: '*',
      payload: snapshot,
      timestamp: Date.now(),
    });
  }

  /**
   * 獲取快照列表
   */
  getSnapshots(): StateSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * ========================================
   * 內部方法
   * ========================================
   */

  /**
   * 解析變更類型
   */
  private parseMutationType(type: string): [string, string] {
    const parts = type.split('/');
    if (parts.length !== 2) {
      return ['', ''];
    }
    return [parts[0], parts[1]];
  }

  /**
   * 獲取模組 Getters
   */
  private getModuleGetters(namespace: string): Record<string, any> {
    const module = this.modules.get(namespace);
    if (!module || !module.getters) {
      return {};
    }

    const getters: Record<string, any> = {};
    const moduleState = this.state[namespace];

    Object.keys(module.getters).forEach(key => {
      getters[key] = module.getters![key](moduleState, this.state);
    });

    return getters;
  }

  /**
   * 記錄變更
   */
  private recordMutation(mutation: StateMutation): void {
    this.mutations.push(mutation);

    // 限制歷史大小
    if (this.mutations.length > (this.config.maxHistorySize || 100)) {
      this.mutations.shift();
    }
  }

  /**
   * 通知狀態變更
   */
  private notifyStateChange(
    mutation: StateMutation,
    previousState: any,
    currentState: any
  ): void {
    // 通知所有相關訂閱者
    this.notifySubscribers(mutation, currentState);

    // 發送全域事件
    this.emit('stateManager:stateChanged', {
      mutation,
      previousState,
      currentState,
    });
  }

  /**
   * 通知訂閱者
   */
  private notifySubscribers(mutation: StateMutation, state: any): void {
    const toRemove: string[] = [];

    this.subscriptions.forEach(subscription => {
      const {
        namespace,
        mutation: mutationType,
        callback,
        once,
      } = subscription;

      // 檢查命名空間匹配
      if (namespace && namespace !== mutation.namespace) {
        return;
      }

      // 檢查變更類型匹配
      if (mutationType && mutationType !== mutation.type) {
        return;
      }

      try {
        callback(mutation, state);
      } catch (error) {
        console.error('Subscription callback error:', error);
      }

      // 一次性訂閱清理
      if (once) {
        toRemove.push(subscription.id);
      }
    });

    // 清理一次性訂閱
    toRemove.forEach(id => this.subscriptions.delete(id));
  }

  /**
   * 通知所有訂閱者
   */
  private notifyAllSubscribers(mutation: StateMutation): void {
    this.subscriptions.forEach(subscription => {
      try {
        subscription.callback(mutation, this.state);
      } catch (error) {
        console.error('Subscription callback error:', error);
      }
    });
  }

  /**
   * 驗證模組
   */
  private validateModule<T>(module: StateModule<T>): void {
    if (!module.namespace) {
      throw new Error('Module must have a namespace');
    }

    if (!module.initialState) {
      throw new Error('Module must have an initial state');
    }

    // 驗證變更名稱不包含斜線
    if (module.mutations) {
      Object.keys(module.mutations).forEach(key => {
        if (key.includes('/')) {
          throw new Error(`Mutation name ${key} cannot contain '/' character`);
        }
      });
    }

    // 驗證動作名稱不包含斜線
    if (module.actions) {
      Object.keys(module.actions).forEach(key => {
        if (key.includes('/')) {
          throw new Error(`Action name ${key} cannot contain '/' character`);
        }
      });
    }
  }

  /**
   * 清理模組訂閱
   */
  private cleanupModuleSubscriptions(namespace: string): void {
    const toRemove: string[] = [];

    this.subscriptions.forEach((subscription, id) => {
      if (subscription.namespace === namespace) {
        toRemove.push(id);
      }
    });

    toRemove.forEach(id => this.subscriptions.delete(id));
  }

  /**
   * ========================================
   * 持久化
   * ========================================
   */

  /**
   * 初始化持久化狀態
   */
  private initializePersistentState(): void {
    if (!this.config.persistent) return;

    try {
      const stored = localStorage.getItem(this.config.storageKey!);
      if (stored) {
        const data = JSON.parse(stored);
        this.state = { ...this.state, ...data };
      }
    } catch (error) {
      console.warn('Failed to restore persistent state:', error);
    }
  }

  /**
   * 持久化模組狀態
   */
  private persistModuleState(namespace: string): void {
    if (!this.config.persistent) return;

    try {
      const current = localStorage.getItem(this.config.storageKey!);
      const data = current ? JSON.parse(current) : {};

      data[namespace] = this.state[namespace];

      localStorage.setItem(this.config.storageKey!, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to persist state for module ${namespace}:`, error);
    }
  }

  /**
   * 恢復模組狀態
   */
  private restoreModuleState(namespace: string): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey!);
      if (stored) {
        const data = JSON.parse(stored);
        if (data[namespace]) {
          this.state[namespace] = {
            ...this.state[namespace],
            ...data[namespace],
          };
        }
      }
    } catch (error) {
      console.warn(`Failed to restore state for module ${namespace}:`, error);
    }
  }

  /**
   * ========================================
   * 開發工具
   * ========================================
   */

  /**
   * 設置開發工具
   */
  private setupDevtools(): void {
    if (!this.config.devtools || typeof window === 'undefined') {
      return;
    }

    // 簡單的開發工具支援
    (window as any).__STATE_MANAGER__ = this;

    this.on(
      'stateManager:stateChanged',
      ({ mutation, previousState, currentState }) => {
        if (console.group) {
          console.group(
            `%c mutation ${mutation.type}`,
            'color: #03A9F4; font-weight: bold'
          );
          console.log(
            '%c prev state',
            'color: #9E9E9E; font-weight: bold',
            previousState
          );
          console.log(
            '%c mutation',
            'color: #03A9F4; font-weight: bold',
            mutation
          );
          console.log(
            '%c next state',
            'color: #4CAF50; font-weight: bold',
            currentState
          );
          console.groupEnd();
        }
      }
    );
  }

  /**
   * 嚴格模式檢查
   */
  private ensureStrictMode(): void {
    // 在嚴格模式下，所有狀態變更必須通過 mutations
    // 這裡可以添加額外的檢查邏輯
  }

  /**
   * ========================================
   * 公開 API
   * ========================================
   */

  /**
   * 重置狀態
   */
  reset(): void {
    this.state = {};
    this.mutations = [];
    this.snapshots = [];
    this.subscriptions.clear();

    // 重新初始化模組狀態
    this.modules.forEach(module => {
      this.state[module.namespace] = { ...module.initialState };
    });

    this.emit('stateManager:reset');
  }

  /**
   * 獲取統計信息
   */
  getStats() {
    return {
      modules: this.modules.size,
      subscriptions: this.subscriptions.size,
      mutations: this.mutations.length,
      snapshots: this.snapshots.length,
      stateSize: JSON.stringify(this.state).length,
    };
  }

  /**
   * 銷毀狀態管理器
   */
  destroy(): void {
    this.subscriptions.clear();
    this.mutations = [];
    this.snapshots = [];
    this.removeAllListeners();

    if (typeof window !== 'undefined') {
      delete (window as any).__STATE_MANAGER__;
    }

    StateManager.instance = null;
  }
}

/**
 * 全域狀態管理器實例
 */
export let stateManager: StateManager | null = null;

/**
 * 創建狀態管理器
 */
export function createStateManager(config?: StateManagerConfig): StateManager {
  stateManager = new StateManager(config);
  return stateManager;
}

/**
 * 獲取狀態管理器實例
 */
export function getStateManager(): StateManager {
  if (!stateManager) {
    stateManager = StateManager.getInstance();
  }
  return stateManager;
}
