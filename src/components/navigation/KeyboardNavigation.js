/**
 * 快捷鍵導航組件
 * Step 3.5.3 階段3: 專業快捷鍵導航系統
 */

import { BaseComponent } from '../../core/components/BaseComponent.js';

export class KeyboardNavigation extends BaseComponent {
  constructor(options = {}) {
    super(options);

    // 快捷鍵映射配置
    this.shortcuts = {
      // 頁面導航 (數字鍵)
      navigation: {
        Digit1: {
          path: '/',
          name: '首頁',
          icon: '🏰',
          description: '返回主城區',
        },
        Digit2: {
          path: '/about',
          name: '關於',
          icon: '👤',
          description: '查看角色檔案',
        },
        Digit3: {
          path: '/skills',
          name: '技能',
          icon: '🌲',
          description: '打開技能樹',
        },
        Digit4: {
          path: '/work-projects',
          name: '工作',
          icon: '💼',
          description: '職業任務列表',
        },
        Digit5: {
          path: '/personal-projects',
          name: '作品',
          icon: '🎴',
          description: '個人收藏展示',
        },
        Digit6: {
          path: '/contact',
          name: '聯絡',
          icon: '📮',
          description: '聯絡據點',
        },
      },

      // 功能快捷鍵
      actions: {
        KeyH: {
          action: 'showHelp',
          name: '幫助',
          icon: '❓',
          description: '顯示快捷鍵說明',
        },
        Escape: {
          action: 'escape',
          name: '退出',
          icon: '❌',
          description: '退出當前操作',
        },
        KeyF: {
          action: 'fullscreen',
          name: '全螢幕',
          icon: '⛶',
          description: '切換全螢幕模式',
        },
        KeyS: {
          action: 'search',
          name: '搜尋',
          icon: '🔍',
          description: '開啟搜尋功能',
        },
        KeyT: {
          action: 'toggleTheme',
          name: '主題',
          icon: '🎨',
          description: '切換主題',
        },
      },

      // 導航控制 (方向鍵 + 修飾鍵)
      movement: {
        ArrowLeft: {
          action: 'goBack',
          name: '上一頁',
          icon: '←',
          description: '返回上一頁',
        },
        ArrowRight: {
          action: 'goForward',
          name: '下一頁',
          icon: '→',
          description: '前往下一頁',
        },
        Home: {
          action: 'goHome',
          name: '首頁',
          icon: '🏠',
          description: '返回首頁',
        },
        End: {
          action: 'goEnd',
          name: '最後',
          icon: '🔚',
          description: '前往最後一頁',
        },
        ArrowUp: {
          action: 'scrollUp',
          name: '向上',
          icon: '↑',
          description: '向上滾動',
        },
        ArrowDown: {
          action: 'scrollDown',
          name: '向下',
          icon: '↓',
          description: '向下滾動',
        },
      },

      // 進階功能 (Ctrl + 鍵)
      advanced: {
        'ctrl+KeyR': {
          action: 'refresh',
          name: '刷新',
          icon: '🔄',
          description: '刷新當前頁面',
        },
        'ctrl+KeyD': {
          action: 'debug',
          name: '除錯',
          icon: '🐛',
          description: '開啟開發者工具',
        },
        'ctrl+KeyP': {
          action: 'print',
          name: '列印',
          icon: '🖨️',
          description: '列印當前頁面',
        },
        'ctrl+Equal': {
          action: 'zoomIn',
          name: '放大',
          icon: '🔍+',
          description: '放大頁面',
        },
        'ctrl+Minus': {
          action: 'zoomOut',
          name: '縮小',
          icon: '🔍-',
          description: '縮小頁面',
        },
        'ctrl+Digit0': {
          action: 'zoomReset',
          name: '重置縮放',
          icon: '🔍=',
          description: '重置頁面縮放',
        },
      },
    };

    // 綁定方法
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * 獲取初始狀態
   */
  getInitialState() {
    return {
      isEnabled: true,
      showHelpPanel: false,
      currentMode: 'global', // global, page-specific
      activeModifiers: new Set(),
      lastKeySequence: [],
    };
  }

  /**
   * 獲取預設配置
   */
  getDefaultConfig() {
    return {
      enabled: true,
      showVisualFeedback: true,
      enableSounds: false,
      helpPanelPosition: 'center', // center, top-right, bottom-right
      keySequenceTimeout: 1000,
      excludeElements: ['input', 'textarea', 'select', '[contenteditable]'],
    };
  }

  /**
   * 渲染快捷鍵幫助面板
   */
  async render() {
    // 確保配置已初始化
    if (!this.config) {
      this.config = this.getDefaultConfig();
    }

    const { helpPanelPosition } = this.config;
    const { showHelpPanel } = this.state;

    return `
      <div class="keyboard-navigation-system">

        <!-- 快捷鍵幫助面板 -->
        <div class="keyboard-help-panel keyboard-help-panel--${helpPanelPosition} ${showHelpPanel ? 'keyboard-help-panel--open' : ''}"
             id="keyboard-help-panel"
             role="dialog"
             aria-labelledby="keyboard-help-title"
             aria-hidden="${!showHelpPanel}">

          <div class="keyboard-help-content">

            <!-- 標題列 -->
            <div class="keyboard-help-header">
              <h3 id="keyboard-help-title" class="keyboard-help-title">
                ⌨️ 快捷鍵導航
              </h3>
              <button class="keyboard-help-close"
                      id="keyboard-help-close"
                      aria-label="關閉快捷鍵說明"
                      title="按 Esc 或點擊關閉">
                ❌
              </button>
            </div>

            <!-- 系統介紹 -->
            <div class="keyboard-help-intro">
              <div class="keyboard-system-overview">
                <p><strong>🎮 遊戲化快捷鍵導航系統</strong></p>
                <p>這個作品集網站採用遊戲風格的快捷鍵導航，讓您可以像操作遊戲一樣快速瀏覽內容。</p>
                <ul class="system-features">
                  <li>✨ 數字鍵 1-6 快速切換主要頁面</li>
                  <li>🎯 H 鍵開啟/關閉此說明面板</li>
                  <li>🔄 方向鍵控制頁面導航和滾動</li>
                  <li>⚡ Ctrl + 組合鍵執行進階功能</li>
                  <li>🎛️ 在右下角可以切換快捷鍵開關狀態</li>
                </ul>
              </div>
            </div>

            <!-- 快捷鍵分類 -->
            <div class="keyboard-help-sections">

              <!-- 頁面導航 -->
              <div class="keyboard-help-section">
                <h4 class="keyboard-section-title">
                  <span class="section-icon">🧭</span>
                  頁面導航
                </h4>
                <div class="keyboard-shortcuts-grid">
                  ${Object.entries(this.shortcuts.navigation)
                    .map(
                      ([key, config]) => `
                    <div class="keyboard-shortcut-item">
                      <kbd class="keyboard-key">${this.getKeyDisplayName(key)}</kbd>
                      <span class="shortcut-icon">${config.icon}</span>
                      <div class="shortcut-info">
                        <div class="shortcut-name">${config.name}</div>
                        <div class="shortcut-desc">${config.description}</div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- 功能快捷鍵 -->
              <div class="keyboard-help-section">
                <h4 class="keyboard-section-title">
                  <span class="section-icon">🔧</span>
                  功能控制
                </h4>
                <div class="keyboard-shortcuts-grid">
                  ${Object.entries(this.shortcuts.actions)
                    .map(
                      ([key, config]) => `
                    <div class="keyboard-shortcut-item">
                      <kbd class="keyboard-key">${this.getKeyDisplayName(key)}</kbd>
                      <span class="shortcut-icon">${config.icon}</span>
                      <div class="shortcut-info">
                        <div class="shortcut-name">${config.name}</div>
                        <div class="shortcut-desc">${config.description}</div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- 導航控制 -->
              <div class="keyboard-help-section">
                <h4 class="keyboard-section-title">
                  <span class="section-icon">🎮</span>
                  導航控制
                </h4>
                <div class="keyboard-shortcuts-grid">
                  ${Object.entries(this.shortcuts.movement)
                    .map(
                      ([key, config]) => `
                    <div class="keyboard-shortcut-item">
                      <kbd class="keyboard-key">${this.getKeyDisplayName(key)}</kbd>
                      <span class="shortcut-icon">${config.icon}</span>
                      <div class="shortcut-info">
                        <div class="shortcut-name">${config.name}</div>
                        <div class="shortcut-desc">${config.description}</div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- 進階功能 -->
              <div class="keyboard-help-section">
                <h4 class="keyboard-section-title">
                  <span class="section-icon">⚡</span>
                  進階功能
                </h4>
                <div class="keyboard-shortcuts-grid">
                  ${Object.entries(this.shortcuts.advanced)
                    .map(
                      ([key, config]) => `
                    <div class="keyboard-shortcut-item">
                      <kbd class="keyboard-key">${this.getKeyDisplayName(key)}</kbd>
                      <span class="shortcut-icon">${config.icon}</span>
                      <div class="shortcut-info">
                        <div class="shortcut-name">${config.name}</div>
                        <div class="shortcut-desc">${config.description}</div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

            </div>

            <!-- 提示資訊 -->
            <div class="keyboard-help-footer">
              <div class="keyboard-tip">
                💡 <strong>提示：</strong>在輸入框中輸入時快捷鍵會被停用
              </div>
              <div class="keyboard-tip">
                🎮 <strong>遊戲模式：</strong>按 <kbd>1-6</kbd> 快速切換頁面
              </div>
            </div>

          </div>

        </div>

        <!-- 快捷鍵視覺反饋 -->
        <div class="keyboard-feedback" id="keyboard-feedback"></div>

        <!-- 快捷鍵狀態指示 -->
        <div class="keyboard-status-indicator ${this.state.isEnabled ? 'keyboard-status--enabled' : 'keyboard-status--disabled'}"
             id="keyboard-status"
             title="快捷鍵導航狀態">
          <span class="status-icon">⌨️</span>
          <span class="status-text">${this.state.isEnabled ? 'ON' : 'OFF'}</span>
        </div>

      </div>
    `;
  }

  /**
   * 初始化組件
   */
  async init() {
    await super.init();

    // 綁定事件監聽
    this.bindEvents();

    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    console.log('⌨️ KeyboardNavigation initialized');
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 綁定鍵盤事件
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('keyup', this.handleKeyUp, true);

    // 綁定幫助面板關閉
    document.addEventListener('click', e => {
      const closeBtn = e.target.closest('#keyboard-help-close');
      if (closeBtn) {
        this.hideHelpPanel();
      }

      // 點擊面板外部關閉
      const panel = document.getElementById('keyboard-help-panel');
      if (this.state.showHelpPanel && panel && !panel.contains(e.target)) {
        this.hideHelpPanel();
      }
    });

    // 狀態指示器點擊切換
    document.addEventListener('click', e => {
      const statusIndicator = e.target.closest('#keyboard-status');
      if (statusIndicator) {
        this.toggleEnabled();
      }
    });
  }

  /**
   * 處理按鍵按下
   */
  handleKeyDown(event) {
    if (!this.state.isEnabled) return;

    // 檢查是否在排除元素中
    if (this.isExcludedElement(event.target)) {
      return;
    }

    // 更新修飾鍵狀態
    this.updateModifierKeys(event);

    // 構建快捷鍵標識
    const shortcutId = this.buildShortcutId(event);

    // 檢查快捷鍵匹配
    const shortcut = this.findShortcut(shortcutId);
    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      this.executeShortcut(shortcut, shortcutId);
      this.showKeyboardFeedback(shortcutId, shortcut);
    }

    // 記錄按鍵序列
    this.recordKeySequence(event.code);
  }

  /**
   * 處理按鍵釋放
   */
  handleKeyUp(event) {
    this.updateModifierKeys(event);
  }

  /**
   * 處理頁面可見性變化
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // 頁面隱藏時清除修飾鍵狀態
      this.state.activeModifiers.clear();
    }
  }

  /**
   * 檢查是否在排除元素中
   */
  isExcludedElement(element) {
    if (!this.config) {
      this.config = this.getDefaultConfig();
    }
    const { excludeElements } = this.config;

    return excludeElements.some(selector => {
      if (selector.startsWith('[') && selector.endsWith(']')) {
        const attr = selector.slice(1, -1);
        return element.hasAttribute(attr);
      }
      return element.tagName.toLowerCase() === selector;
    });
  }

  /**
   * 更新修飾鍵狀態
   */
  updateModifierKeys(event) {
    const modifiers = ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'];

    modifiers.forEach(mod => {
      const key = mod.replace('Key', '').toLowerCase();
      if (event[mod]) {
        this.state.activeModifiers.add(key);
      } else {
        this.state.activeModifiers.delete(key);
      }
    });
  }

  /**
   * 構建快捷鍵標識
   */
  buildShortcutId(event) {
    const parts = [];

    // 添加修飾鍵
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');

    // 添加主鍵
    parts.push(event.code);

    return parts.join('+');
  }

  /**
   * 查找快捷鍵配置
   */
  findShortcut(shortcutId) {
    // 檢查所有快捷鍵類別
    for (const category of Object.values(this.shortcuts)) {
      if (category[shortcutId]) {
        return category[shortcutId];
      }
    }
    return null;
  }

  /**
   * 執行快捷鍵動作
   */
  executeShortcut(shortcut, shortcutId) {
    console.log(`⌨️ Executing shortcut: ${shortcutId}`, shortcut);

    if (shortcut.path) {
      // 頁面導航
      this.navigateToPath(shortcut.path);
    } else if (shortcut.action) {
      // 功能動作
      this.executeAction(shortcut.action);
    }

    // 播放音效（如果啟用）
    if (this.config && this.config.enableSounds) {
      this.playShortcutSound(shortcut);
    }
  }

  /**
   * 執行功能動作
   */
  executeAction(actionName) {
    switch (actionName) {
      case 'showHelp':
        this.showHelpPanel();
        break;

      case 'escape':
        this.handleEscape();
        break;

      case 'fullscreen':
        this.toggleFullscreen();
        break;

      case 'search':
        this.openSearch();
        break;

      case 'toggleTheme':
        this.toggleTheme();
        break;

      case 'goBack':
        window.history.back();
        break;

      case 'goForward':
        window.history.forward();
        break;

      case 'goHome':
        window.location.hash = '/';
        break;

      case 'scrollUp':
        window.scrollBy(0, -200);
        break;

      case 'scrollDown':
        window.scrollBy(0, 200);
        break;

      case 'refresh':
        window.location.reload();
        break;

      case 'zoomIn':
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom) || 1) * 1.1}`;
        break;

      case 'zoomOut':
        document.body.style.zoom = `${(parseFloat(document.body.style.zoom) || 1) / 1.1}`;
        break;

      case 'zoomReset':
        document.body.style.zoom = '1';
        break;

      default:
        console.warn(`Unknown action: ${actionName}`);
    }
  }

  /**
   * 導航到指定路徑
   */
  navigateToPath(path) {
    window.location.hash = path;
  }

  /**
   * 處理 Escape 鍵
   */
  handleEscape() {
    if (this.state.showHelpPanel) {
      this.hideHelpPanel();
    } else {
      // 其他 Escape 處理邏輯
      document.querySelectorAll('.modal, .popup, .dropdown').forEach(el => {
        if (el.style.display !== 'none') {
          el.style.display = 'none';
        }
      });
    }
  }

  /**
   * 顯示幫助面板
   */
  showHelpPanel() {
    this.setState({ showHelpPanel: true });
    document.body.classList.add('keyboard-help-open');

    // 焦點管理
    setTimeout(() => {
      const panel = document.getElementById('keyboard-help-panel');
      if (panel) {
        panel.focus();
      }
    }, 100);
  }

  /**
   * 隱藏幫助面板
   */
  hideHelpPanel() {
    this.setState({ showHelpPanel: false });
    document.body.classList.remove('keyboard-help-open');
  }

  /**
   * 切換全螢幕
   */
  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  /**
   * 顯示鍵盤回饋
   */
  showKeyboardFeedback(shortcutId, shortcut) {
    if (!this.config || !this.config.showVisualFeedback) return;

    const feedback = document.getElementById('keyboard-feedback');
    if (!feedback) return;

    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'keyboard-feedback-item';
    feedbackElement.innerHTML = `
      <div class="feedback-shortcut">
        <kbd class="feedback-key">${this.getKeyDisplayName(shortcutId)}</kbd>
        <span class="feedback-icon">${shortcut.icon || '⌨️'}</span>
        <span class="feedback-name">${shortcut.name}</span>
      </div>
    `;

    feedback.appendChild(feedbackElement);

    // 動畫移除
    setTimeout(() => {
      feedbackElement.classList.add('feedback-item--fade-out');
      setTimeout(() => {
        feedback.removeChild(feedbackElement);
      }, 300);
    }, 1500);
  }

  /**
   * 獲取按鍵顯示名稱
   */
  getKeyDisplayName(key) {
    const displayNames = {
      Digit1: '1',
      Digit2: '2',
      Digit3: '3',
      Digit4: '4',
      Digit5: '5',
      Digit6: '6',
      KeyH: 'H',
      KeyF: 'F',
      KeyS: 'S',
      KeyT: 'T',
      KeyR: 'R',
      KeyD: 'D',
      KeyP: 'P',
      ArrowLeft: '←',
      ArrowRight: '→',
      ArrowUp: '↑',
      ArrowDown: '↓',
      Home: 'Home',
      End: 'End',
      Escape: 'Esc',
      Equal: '+',
      Minus: '-',
      Digit0: '0',
    };

    // 處理組合鍵
    if (key.includes('+')) {
      return key
        .split('+')
        .map(part => displayNames[part] || part)
        .join(' + ');
    }

    return displayNames[key] || key;
  }

  /**
   * 記錄按鍵序列
   */
  recordKeySequence(code) {
    this.state.lastKeySequence.push(code);

    // 限制序列長度
    if (this.state.lastKeySequence.length > 5) {
      this.state.lastKeySequence.shift();
    }

    // 清除舊序列
    setTimeout(() => {
      const index = this.state.lastKeySequence.indexOf(code);
      if (index > -1) {
        this.state.lastKeySequence.splice(index, 1);
      }
    }, this.config.keySequenceTimeout);
  }

  /**
   * 切換啟用狀態
   */
  toggleEnabled() {
    const newEnabledState = !this.state.isEnabled;
    this.setState({ isEnabled: newEnabledState }, () => {
      console.log(
        `⌨️ Keyboard navigation ${newEnabledState ? 'enabled' : 'disabled'}`
      );
      this.updateStatusDisplay();
    });
  }

  /**
   * 設置啟用狀態
   */
  setEnabled(enabled) {
    this.setState({ isEnabled: enabled }, () => {
      this.updateStatusDisplay();
    });
  }

  /**
   * 更新狀態顯示
   */
  updateStatusDisplay() {
    const statusIndicator = document.querySelector(
      '.keyboard-status-indicator'
    );
    const statusText = document.querySelector('.status-text');

    if (statusIndicator && statusText) {
      statusIndicator.className = `keyboard-status-indicator ${this.state.isEnabled ? 'keyboard-status--enabled' : 'keyboard-status--disabled'}`;
      statusText.textContent = this.state.isEnabled ? 'ON' : 'OFF';
    }
  }

  /**
   * 添加自訂快捷鍵
   */
  addShortcut(category, key, config) {
    if (!this.shortcuts[category]) {
      this.shortcuts[category] = {};
    }
    this.shortcuts[category][key] = config;
  }

  /**
   * 移除快捷鍵
   */
  removeShortcut(category, key) {
    if (this.shortcuts[category] && this.shortcuts[category][key]) {
      delete this.shortcuts[category][key];
    }
  }

  /**
   * 播放快捷鍵音效
   */
  playShortcutSound(_shortcut) {
    // 簡單的音效實現
    if (window.AudioContext) {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }

  /**
   * 獲取快捷鍵統計
   */
  getShortcutStats() {
    const totalShortcuts = Object.values(this.shortcuts).reduce(
      (total, category) => total + Object.keys(category).length,
      0
    );

    return {
      totalShortcuts,
      categories: Object.keys(this.shortcuts).length,
      enabled: this.state.isEnabled,
      lastSequence: this.state.lastKeySequence,
    };
  }

  /**
   * 銷毀組件
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('keyup', this.handleKeyUp, true);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
    document.body.classList.remove('keyboard-help-open');
    super.destroy();
    console.log('⌨️ KeyboardNavigation destroyed');
  }
}
