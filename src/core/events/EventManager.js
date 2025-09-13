/**
 * EventManager - 事件管理器基類
 *
 * 提供事件發送、監聽和管理功能，作為所有組件的基類使用
 *
 * @author Claude
 * @version 2.1.0
 */

export class EventManager {
  constructor() {
    this.eventListeners = new Map();
    this.maxListeners = 50; // 防止記憶體洩漏
  }

  /**
   * 監聽事件
   * @param {string} eventName 事件名稱
   * @param {Function} handler 事件處理函數
   * @param {Object} options 選項
   */
  on(eventName, handler, options = {}) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }

    const listeners = this.eventListeners.get(eventName);

    // 檢查監聽器數量限制
    if (listeners.length >= this.maxListeners) {
      console.warn(
        `EventManager: 事件 "${eventName}" 的監聽器數量超過限制 (${this.maxListeners})`
      );
      return;
    }

    const listener = {
      handler,
      once: options.once || false,
      priority: options.priority || 0,
      context: options.context || null,
    };

    listeners.push(listener);

    // 按優先級排序（高優先級先執行）
    listeners.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 監聽事件一次
   * @param {string} eventName 事件名稱
   * @param {Function} handler 事件處理函數
   * @param {Object} options 選項
   */
  once(eventName, handler, options = {}) {
    this.on(eventName, handler, { ...options, once: true });
  }

  /**
   * 移除事件監聽器
   * @param {string} eventName 事件名稱
   * @param {Function} handler 事件處理函數（可選）
   */
  off(eventName, handler = null) {
    if (!this.eventListeners.has(eventName)) {
      return;
    }

    const listeners = this.eventListeners.get(eventName);

    if (handler) {
      // 移除特定處理函數
      const index = listeners.findIndex(
        listener => listener.handler === handler
      );
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    } else {
      // 移除所有監聽器
      listeners.length = 0;
    }

    // 如果沒有監聽器了，刪除整個事件
    if (listeners.length === 0) {
      this.eventListeners.delete(eventName);
    }
  }

  /**
   * 發送事件
   * @param {string} eventName 事件名稱
   * @param {any} data 事件數據
   * @returns {boolean} 是否有監聽器處理了事件
   */
  emit(eventName, data = null) {
    if (!this.eventListeners.has(eventName)) {
      return false;
    }

    const listeners = this.eventListeners.get(eventName);
    const listenersToRemove = [];
    let handled = false;

    // 創建事件對象
    const eventObject = {
      type: eventName,
      data,
      timestamp: Date.now(),
      target: this,
      preventDefault: false,
      stopPropagation: false,
    };

    // 執行所有監聽器
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];

      try {
        // 設置執行上下文
        const context = listener.context || this;

        // 調用處理函數
        listener.handler.call(context, eventObject);
        handled = true;

        // 如果設置了 once，標記為需要移除
        if (listener.once) {
          listenersToRemove.push(i);
        }

        // 檢查是否停止傳播
        if (eventObject.stopPropagation) {
          break;
        }
      } catch (error) {
        console.error(
          `EventManager: 事件處理器執行錯誤 (${eventName}):`,
          error
        );
      }
    }

    // 移除一次性監聽器（從後往前移除避免索引問題）
    for (let i = listenersToRemove.length - 1; i >= 0; i--) {
      listeners.splice(listenersToRemove[i], 1);
    }

    return handled;
  }

  /**
   * 異步發送事件
   * @param {string} eventName 事件名稱
   * @param {any} data 事件數據
   * @returns {Promise<boolean>} 是否有監聽器處理了事件
   */
  async emitAsync(eventName, data = null) {
    return new Promise(resolve => {
      setTimeout(() => {
        const result = this.emit(eventName, data);
        resolve(result);
      }, 0);
    });
  }

  /**
   * 獲取事件監聽器數量
   * @param {string} eventName 事件名稱（可選）
   * @returns {number} 監聽器數量
   */
  listenerCount(eventName = null) {
    if (eventName) {
      return this.eventListeners.has(eventName)
        ? this.eventListeners.get(eventName).length
        : 0;
    }

    let total = 0;
    for (const listeners of this.eventListeners.values()) {
      total += listeners.length;
    }
    return total;
  }

  /**
   * 獲取所有事件名稱
   * @returns {string[]} 事件名稱數組
   */
  eventNames() {
    return Array.from(this.eventListeners.keys());
  }

  /**
   * 檢查是否有特定事件的監聽器
   * @param {string} eventName 事件名稱
   * @returns {boolean} 是否有監聽器
   */
  hasListeners(eventName) {
    return (
      this.eventListeners.has(eventName) &&
      this.eventListeners.get(eventName).length > 0
    );
  }

  /**
   * 移除所有事件監聽器
   */
  removeAllListeners() {
    this.eventListeners.clear();
  }

  /**
   * 設置最大監聽器數量
   * @param {number} max 最大數量
   */
  setMaxListeners(max) {
    this.maxListeners = Math.max(0, max);
  }

  /**
   * 創建事件代理
   * @param {string} eventName 源事件名稱
   * @param {EventManager} target 目標事件管理器
   * @param {string} targetEventName 目標事件名稱（可選）
   */
  pipe(eventName, target, targetEventName = null) {
    if (!target || typeof target.emit !== 'function') {
      throw new Error('EventManager: pipe 目標必須是 EventManager 實例');
    }

    const targetEvent = targetEventName || eventName;

    this.on(eventName, event => {
      target.emit(targetEvent, event.data);
    });
  }

  /**
   * 創建事件過濾器
   * @param {string} eventName 事件名稱
   * @param {Function} filter 過濾函數
   * @returns {EventManager} 新的事件管理器
   */
  filter(eventName, filter) {
    const filtered = new EventManager();

    this.on(eventName, event => {
      if (filter(event.data)) {
        filtered.emit(eventName, event.data);
      }
    });

    return filtered;
  }

  /**
   * 等待特定事件
   * @param {string} eventName 事件名稱
   * @param {number} timeout 超時時間（毫秒，可選）
   * @returns {Promise} 事件數據
   */
  waitFor(eventName, timeout = null) {
    return new Promise((resolve, reject) => {
      let timeoutId = null;

      const handler = event => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(event.data);
      };

      this.once(eventName, handler);

      if (timeout) {
        timeoutId = setTimeout(() => {
          this.off(eventName, handler);
          reject(
            new Error(
              `EventManager: 等待事件 "${eventName}" 超時 (${timeout}ms)`
            )
          );
        }, timeout);
      }
    });
  }

  /**
   * 事件命名空間支援
   * @param {string} namespace 命名空間
   * @returns {EventManager} 命名空間事件管理器
   */
  namespace(namespace) {
    const namespacedManager = new EventManager();
    const prefix = `${namespace}:`;

    // 代理事件到帶命名空間的事件名
    namespacedManager.on = (eventName, handler, options) => {
      return this.on(`${prefix}${eventName}`, handler, options);
    };

    namespacedManager.off = (eventName, handler) => {
      return this.off(`${prefix}${eventName}`, handler);
    };

    namespacedManager.emit = (eventName, data) => {
      return this.emit(`${prefix}${eventName}`, data);
    };

    return namespacedManager;
  }

  /**
   * 獲取調試信息
   * @returns {Object} 調試信息
   */
  getDebugInfo() {
    const info = {
      totalEvents: this.eventListeners.size,
      totalListeners: this.listenerCount(),
      events: {},
    };

    for (const [eventName, listeners] of this.eventListeners) {
      info.events[eventName] = {
        listenerCount: listeners.length,
        listeners: listeners.map(l => ({
          priority: l.priority,
          once: l.once,
          hasContext: !!l.context,
        })),
      };
    }

    return info;
  }

  /**
   * 銷毀事件管理器
   */
  destroy() {
    this.removeAllListeners();
    console.log('EventManager: 事件管理器已銷毀');
  }
}

export default EventManager;
