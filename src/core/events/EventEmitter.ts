/**
 * EventEmitter - 事件發射器基類
 * 
 * 提供事件監聽、觸發、移除等基礎功能
 * 
 * @author Claude
 * @version 1.0.0
 */

export type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventListener[]>;

  /**
   * 創建事件發射器實例
   */
  constructor() {
    this.events = new Map();
  }

  /**
   * 添加事件監聽器
   */
  on(event: string, listener: EventListener): EventEmitter {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(listener);
    return this;
  }

  /**
   * 添加一次性事件監聽器
   */
  once(event: string, listener: EventListener): EventEmitter {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      listener(...args);
    };

    return this.on(event, onceWrapper);
  }

  /**
   * 移除事件監聽器
   */
  off(event: string, listener: EventListener): EventEmitter {
    const listeners = this.events.get(event);
    if (!listeners) return this;

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    // 如果沒有監聽器了，刪除事件
    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  /**
   * 觸發事件
   */
  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) {
      return false;
    }

    // 複製監聽器列表以避免在執行過程中被修改
    const listenersClone = [...listeners];
    
    for (const listener of listenersClone) {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    }

    return true;
  }

  /**
   * 移除所有事件監聽器
   */
  removeAllListeners(event?: string): EventEmitter {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * 取得事件監聽器列表
   */
  listeners(event: string): EventListener[] {
    const listeners = this.events.get(event);
    return listeners ? [...listeners] : [];
  }

  /**
   * 取得事件監聽器數量
   */
  listenerCount(event: string): number {
    const listeners = this.events.get(event);
    return listeners ? listeners.length : 0;
  }

  /**
   * 取得所有事件名稱
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}