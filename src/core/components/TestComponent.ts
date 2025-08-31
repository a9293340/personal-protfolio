/**
 * TestComponent - 測試組件
 * 
 * 這是一個簡單的測試組件，用於驗證 BaseComponent 和 ComponentFactory 的功能
 * 
 * @author Claude
 * @version 1.0.0
 */

import { BaseComponent, ComponentConfig, ComponentState, RenderContext } from './BaseComponent.js';

export interface TestComponentConfig extends ComponentConfig {
  title?: string;
  content?: string;
  color?: string;
}

export interface TestComponentState extends ComponentState {
  clickCount: number;
  lastClicked: Date | null;
}

export class TestComponent extends BaseComponent {
  static readonly componentType = 'TestComponent';
  static readonly version = '1.0.0';

  protected declare config: TestComponentConfig;
  protected declare state: TestComponentState;

  /**
   * 獲取組件特定的默認配置
   */
  protected getComponentDefaults(): Partial<TestComponentConfig> {
    return {
      title: 'Test Component',
      content: 'This is a test component',
      color: '#d4af37',
      className: 'test-component'
    };
  }

  /**
   * 獲取組件特定的初始狀態
   */
  protected getDefaultState(): Partial<TestComponentState> {
    return {
      clickCount: 0,
      lastClicked: null
    };
  }

  /**
   * 實現抽象的渲染方法
   */
  protected doRender(context: RenderContext): HTMLElement {
    const { config, state } = context;
    
    // 創建主容器
    const element = document.createElement('div');
    element.className = 'test-component-wrapper';
    
    // 創建標題
    const title = document.createElement('h3');
    title.textContent = String(config.title || 'Test Component');
    title.style.color = String(config.color || '#d4af37');
    element.appendChild(title);
    
    // 創建內容
    const content = document.createElement('p');
    content.textContent = String(config.content || 'This is a test component');
    element.appendChild(content);
    
    // 創建點擊計數器
    const counter = document.createElement('div');
    counter.className = 'click-counter';
    counter.innerHTML = `
      <p>Clicks: <span class="count">${state.clickCount}</span></p>
      <button class="test-button">Click Me!</button>
    `;
    element.appendChild(counter);
    
    // 創建狀態顯示
    const statusDiv = document.createElement('div');
    statusDiv.className = 'component-status';
    statusDiv.innerHTML = `
      <small>
        Component: ${this.constructor.name}<br>
        Initialized: ${this.isInitialized}<br>
        Last Clicked: ${state.lastClicked ? state.lastClicked.toLocaleTimeString() : 'Never'}
      </small>
    `;
    element.appendChild(statusDiv);
    
    // 添加到容器
    if (context.container) {
      context.container.appendChild(element);
    }
    
    return element;
  }

  /**
   * 綁定組件特定事件
   */
  protected bindComponentEvents(): void {
    if (!this.element) return;
    
    // 綁定按鈕點擊事件
    const button = this.element.querySelector('.test-button') as HTMLButtonElement;
    if (button) {
      button.addEventListener('click', this.handleButtonClick.bind(this));
    }
    
    // 綁定雙擊事件
    this.element.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    
    // 綁定滑鼠懸停事件
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  /**
   * 處理按鈕點擊
   */
  private handleButtonClick(): void {
    this.setState((prevState: TestComponentState) => ({
      clickCount: prevState.clickCount + 1,
      lastClicked: new Date()
    }));
    
    // 更新顯示
    this.updateCounterDisplay();
    
    // 發送用戶事件
    this.emitUserEvent('buttonClick', {
      clickCount: this.state.clickCount,
      timestamp: new Date()
    });
  }

  /**
   * 處理雙擊事件
   */
  private handleDoubleClick(): void {
    this.setState({ clickCount: 0, lastClicked: null });
    this.updateCounterDisplay();
    
    this.emitUserEvent('counterReset', {
      timestamp: new Date()
    });
  }

  /**
   * 處理滑鼠懸停
   */
  private handleMouseEnter(): void {
    if (this.element) {
      this.element.style.transform = 'scale(1.05)';
      this.element.style.transition = 'transform 0.2s ease';
    }
  }

  /**
   * 處理滑鼠離開
   */
  private handleMouseLeave(): void {
    if (this.element) {
      this.element.style.transform = 'scale(1)';
    }
  }

  /**
   * 更新計數器顯示
   */
  private updateCounterDisplay(): void {
    if (!this.element) return;
    
    const countSpan = this.element.querySelector('.count');
    const statusDiv = this.element.querySelector('.component-status small');
    
    if (countSpan) {
      countSpan.textContent = this.state.clickCount.toString();
    }
    
    if (statusDiv) {
      statusDiv.innerHTML = `
        Component: ${this.constructor.name}<br>
        Initialized: ${this.isInitialized}<br>
        Last Clicked: ${this.state.lastClicked ? this.state.lastClicked.toLocaleTimeString() : 'Never'}
      `;
    }
  }

  /**
   * 狀態變化處理
   */
  protected onStateChanged(
    prevState: TestComponentState,
    newState: TestComponentState,
    changes: Partial<TestComponentState>
  ): void {
    super.onStateChanged(prevState, newState, changes);
    
    // 處理點擊計數變化
    if ('clickCount' in changes) {
      console.log(`TestComponent: Click count changed from ${prevState.clickCount} to ${newState.clickCount}`);
      
      // 特殊里程碑處理
      if (newState.clickCount > 0 && newState.clickCount % 5 === 0) {
        this.celebrateMillestone(newState.clickCount);
      }
    }
  }

  /**
   * 慶祝里程碑
   */
  private celebrateMillestone(count: number): void {
    if (!this.element) return;
    
    const celebration = document.createElement('div');
    celebration.textContent = `🎉 ${count} clicks!`;
    celebration.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #f4d03f;
      color: #000;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      animation: fadeInOut 2s ease-in-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    // 添加 CSS 動畫
    if (!document.querySelector('#milestone-animation-style')) {
      const style = document.createElement('style');
      style.id = 'milestone-animation-style';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-10px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.element.style.position = 'relative';
    this.element.appendChild(celebration);
    
    // 2秒後移除
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
    }, 2000);
    
    this.trigger('milestone', { count, timestamp: new Date() });
  }

  /**
   * 公開方法：重置計數器
   */
  resetCounter(): void {
    this.handleDoubleClick();
  }

  /**
   * 公開方法：獲取點擊統計
   */
  getClickStats() {
    return {
      totalClicks: this.state.clickCount,
      lastClicked: this.state.lastClicked,
      averageClicksPerMinute: this.calculateClickRate()
    };
  }

  /**
   * 計算點擊率
   */
  private calculateClickRate(): number {
    if (!this.state.lastClicked || this.state.clickCount === 0) {
      return 0;
    }
    
    const now = new Date();
    const firstClick = new Date(now.getTime() - (this.state.clickCount * 10000)); // 估算
    const minutes = (now.getTime() - firstClick.getTime()) / (1000 * 60);
    
    return minutes > 0 ? this.state.clickCount / minutes : 0;
  }
}