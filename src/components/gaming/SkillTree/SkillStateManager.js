/**
 * SkillStateManager - 技能狀態管理器
 *
 * 管理技能樹的狀態邏輯，包括：
 * - 技能狀態定義和轉換
 * - 前置條件檢查
 * - 狀態計算邏輯
 * - 狀態持久化
 *
 * @author Claude
 * @version 2.1.4
 */

import { EventManager } from '../../../core/events/EventManager.js';

/**
 * 技能狀態枚舉
 */
export const SkillStatus = {
  MASTERED: 'mastered', // 已掌握 (金色發光)
  AVAILABLE: 'available', // 可學習 (藍色微光)
  LEARNING: 'learning', // 學習中 (綠色進度)
  LOCKED: 'locked', // 未解鎖 (暗沉)
};

/**
 * 技能狀態配置
 */
export const SkillStatusConfig = {
  [SkillStatus.MASTERED]: {
    name: '已掌握',
    symbol: '●',
    color: '#d4af37',
    glowColor: '#f4d03f',
    opacity: 1.0,
    clickable: true,
    showDetails: true,
  },
  [SkillStatus.AVAILABLE]: {
    name: '可學習',
    symbol: '◐',
    color: '#2980b9',
    glowColor: '#3498db',
    opacity: 0.8,
    clickable: true,
    showDetails: true,
  },
  [SkillStatus.LEARNING]: {
    name: '學習中',
    symbol: '◑',
    color: '#27ae60',
    glowColor: '#2ecc71',
    opacity: 0.7,
    clickable: true,
    showDetails: true,
  },
  [SkillStatus.LOCKED]: {
    name: '未解鎖',
    symbol: '○',
    color: '#666666',
    glowColor: null,
    opacity: 0.4,
    clickable: false,
    showDetails: false,
  },
};

export class SkillStateManager extends EventManager {
  constructor() {
    super();

    // 技能狀態存儲
    this.skillStates = new Map();

    // 技能樹配置數據
    this.skillTreeData = null;

    // 狀態變化監聽器
    this.stateChangeListeners = new Set();

    // 本地存儲鍵
    this.storageKey = 'skillTree_userProgress';

    // 初始化
    this.init();
  }

  /**
   * 初始化狀態管理器
   */
  init() {
    console.log('SkillStateManager: 初始化技能狀態管理器');

    // 載入持久化狀態
    this.loadPersistedState();

    // 綁定事件
    this.bindEvents();
  }

  /**
   * 設置技能樹配置數據
   */
  setSkillTreeData(data) {
    console.log('SkillStateManager: 設置技能樹數據');
    this.skillTreeData = data;

    // 初始化所有技能的狀態
    this.initializeSkillStates();

    // 計算初始狀態
    this.calculateAllStates();

    // 發送初始化完成事件
    this.emit('skill-states-initialized', {
      totalSkills: this.skillStates.size,
      states: this.getStatesCount(),
    });
  }

  /**
   * 初始化所有技能狀態
   */
  initializeSkillStates() {
    if (!this.skillTreeData) return;

    // 收集所有技能節點
    const allNodes = this.collectAllSkillNodes();

    allNodes.forEach(node => {
      // 如果沒有持久化狀態，使用配置中的初始狀態
      if (!this.skillStates.has(node.id)) {
        this.skillStates.set(node.id, {
          id: node.id,
          status: node.status || SkillStatus.LOCKED,
          level: node.level || 1,
          progress: 0,
          unlockedAt: node.status === SkillStatus.MASTERED ? Date.now() : null,
          lastUpdated: Date.now(),
        });
      }
    });

    console.log(
      `SkillStateManager: 初始化 ${this.skillStates.size} 個技能狀態`
    );
  }

  /**
   * 收集所有技能節點
   */
  collectAllSkillNodes() {
    if (!this.skillTreeData || !this.skillTreeData.tree) return [];

    const nodes = [];
    const tree = this.skillTreeData.tree;

    // 添加中心節點
    if (tree.center) {
      nodes.push(tree.center);
    }

    // 添加各環節點
    ['ring1', 'ring2', 'ring3'].forEach(ring => {
      if (tree[ring] && Array.isArray(tree[ring])) {
        nodes.push(...tree[ring]);
      }
    });

    return nodes;
  }

  /**
   * 計算所有技能狀態
   */
  calculateAllStates() {
    console.log('SkillStateManager: 計算所有技能狀態');

    const allNodes = this.collectAllSkillNodes();
    let hasChanges = false;

    // 多輪計算直到狀態穩定
    let rounds = 0;
    const maxRounds = 10; // 防止無限循環

    do {
      hasChanges = false;
      rounds++;

      allNodes.forEach(node => {
        const newStatus = this.calculateSkillStatus(node);
        const currentState = this.skillStates.get(node.id);

        if (currentState && currentState.status !== newStatus) {
          this.updateSkillStatus(node.id, newStatus, false); // 不發送事件避免過多通知
          hasChanges = true;
        }
      });
    } while (hasChanges && rounds < maxRounds);

    console.log(`SkillStateManager: 狀態計算完成，執行 ${rounds} 輪`);

    // 發送批量狀態更新事件
    this.emit('skill-states-recalculated', {
      rounds,
      states: this.getStatesCount(),
    });
  }

  /**
   * 計算單個技能的狀態
   */
  calculateSkillStatus(node) {
    const currentState = this.skillStates.get(node.id);
    if (!currentState) return SkillStatus.LOCKED;

    // 如果已經掌握，保持掌握狀態
    if (currentState.status === SkillStatus.MASTERED) {
      return SkillStatus.MASTERED;
    }

    // 檢查前置條件
    const prerequisites = node.prerequisites || [];

    // 沒有前置條件的技能 (通常是起始技能)
    if (prerequisites.length === 0) {
      return currentState.status; // 保持當前狀態
    }

    // 檢查所有前置技能是否已掌握
    const prerequisitesMet = prerequisites.every(prereqId => {
      const prereqState = this.skillStates.get(prereqId);
      return prereqState && prereqState.status === SkillStatus.MASTERED;
    });

    if (prerequisitesMet) {
      // 前置條件滿足
      if (currentState.status === SkillStatus.LOCKED) {
        return SkillStatus.AVAILABLE; // 解鎖為可學習
      }
      return currentState.status; // 保持當前狀態
    } else {
      // 前置條件不滿足
      if (
        currentState.status === SkillStatus.AVAILABLE ||
        currentState.status === SkillStatus.LEARNING
      ) {
        return SkillStatus.LOCKED; // 重新鎖定
      }
      return currentState.status;
    }
  }

  /**
   * 更新技能狀態
   */
  updateSkillStatus(skillId, newStatus, emitEvent = true) {
    const currentState = this.skillStates.get(skillId);
    if (!currentState) {
      console.warn(`SkillStateManager: 技能 ${skillId} 不存在`);
      return false;
    }

    const oldStatus = currentState.status;
    if (oldStatus === newStatus) {
      return false; // 狀態沒有變化
    }

    // 驗證狀態轉換是否有效
    if (!this.isValidStatusTransition(oldStatus, newStatus, skillId)) {
      console.warn(
        `SkillStateManager: 無效的狀態轉換 ${oldStatus} -> ${newStatus} for ${skillId}`
      );
      return false;
    }

    // 更新狀態
    const updatedState = {
      ...currentState,
      status: newStatus,
      lastUpdated: Date.now(),
    };

    // 設置解鎖時間
    if (
      newStatus === SkillStatus.MASTERED &&
      oldStatus !== SkillStatus.MASTERED
    ) {
      updatedState.unlockedAt = Date.now();
    }

    this.skillStates.set(skillId, updatedState);

    console.log(
      `SkillStateManager: ${skillId} 狀態更新 ${oldStatus} -> ${newStatus}`
    );

    // 保存到本地存儲
    this.persistState();

    // 重新計算相關技能狀態
    this.recalculateRelatedSkills(skillId);

    // 發送狀態變化事件
    if (emitEvent) {
      this.emit('skill-status-changed', {
        skillId,
        oldStatus,
        newStatus,
        state: updatedState,
      });
    }

    return true;
  }

  /**
   * 驗證狀態轉換是否有效
   */
  isValidStatusTransition(fromStatus, toStatus, _skillId) {
    // 定義有效的狀態轉換規則
    const validTransitions = {
      [SkillStatus.LOCKED]: [SkillStatus.AVAILABLE],
      [SkillStatus.AVAILABLE]: [
        SkillStatus.LEARNING,
        SkillStatus.MASTERED,
        SkillStatus.LOCKED,
      ],
      [SkillStatus.LEARNING]: [
        SkillStatus.MASTERED,
        SkillStatus.AVAILABLE,
        SkillStatus.LOCKED,
      ],
      [SkillStatus.MASTERED]: [], // 已掌握的技能通常不能回退
    };

    return validTransitions[fromStatus]?.includes(toStatus) || false;
  }

  /**
   * 重新計算相關技能狀態
   */
  recalculateRelatedSkills(skillId) {
    // 找到以此技能為前置條件的所有技能
    const allNodes = this.collectAllSkillNodes();
    const dependentSkills = allNodes.filter(
      node => node.prerequisites && node.prerequisites.includes(skillId)
    );

    dependentSkills.forEach(node => {
      const newStatus = this.calculateSkillStatus(node);
      this.updateSkillStatus(node.id, newStatus, false);
    });
  }

  /**
   * 獲取技能狀態
   */
  getSkillState(skillId) {
    return this.skillStates.get(skillId) || null;
  }

  /**
   * 獲取技能狀態配置
   */
  getSkillStatusConfig(skillId) {
    const state = this.getSkillState(skillId);
    if (!state) return null;

    return SkillStatusConfig[state.status] || null;
  }

  /**
   * 獲取所有技能狀態統計
   */
  getStatesCount() {
    const counts = {};

    Object.values(SkillStatus).forEach(status => {
      counts[status] = 0;
    });

    for (const state of this.skillStates.values()) {
      counts[state.status]++;
    }

    return counts;
  }

  /**
   * 檢查技能是否可以學習
   */
  canLearnSkill(skillId) {
    const state = this.getSkillState(skillId);
    return (
      state &&
      (state.status === SkillStatus.AVAILABLE ||
        state.status === SkillStatus.LEARNING)
    );
  }

  /**
   * 學習技能 (用戶交互)
   */
  learnSkill(skillId) {
    const state = this.getSkillState(skillId);
    if (!state || !this.canLearnSkill(skillId)) {
      return false;
    }

    const newStatus =
      state.status === SkillStatus.AVAILABLE
        ? SkillStatus.LEARNING
        : SkillStatus.MASTERED;

    return this.updateSkillStatus(skillId, newStatus);
  }

  /**
   * 重置技能狀態
   */
  resetSkillState(skillId) {
    const node = this.collectAllSkillNodes().find(n => n.id === skillId);
    if (!node) return false;

    // 重置為配置中的初始狀態
    const initialStatus = node.status || SkillStatus.LOCKED;
    return this.updateSkillStatus(skillId, initialStatus);
  }

  /**
   * 重置所有技能狀態
   */
  resetAllSkillStates() {
    console.log('SkillStateManager: 重置所有技能狀態');

    const allNodes = this.collectAllSkillNodes();
    allNodes.forEach(node => {
      const initialStatus = node.status || SkillStatus.LOCKED;
      this.skillStates.set(node.id, {
        id: node.id,
        status: initialStatus,
        level: node.level || 1,
        progress: 0,
        unlockedAt: initialStatus === SkillStatus.MASTERED ? Date.now() : null,
        lastUpdated: Date.now(),
      });
    });

    this.persistState();
    this.calculateAllStates();

    this.emit('skill-states-reset', {
      totalSkills: this.skillStates.size,
    });
  }

  /**
   * 持久化狀態到本地存儲
   */
  persistState() {
    try {
      const stateData = {
        version: '2.1.4',
        timestamp: Date.now(),
        states: Array.from(this.skillStates.entries()).map(([id, state]) => ({
          id,
          ...state,
        })),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(stateData));
      console.log(
        `SkillStateManager: 狀態已保存到本地存儲 (${stateData.states.length} 個技能)`
      );
    } catch (error) {
      console.error('SkillStateManager: 保存狀態失敗', error);
    }
  }

  /**
   * 從本地存儲載入狀態
   */
  loadPersistedState() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (!savedData) {
        console.log('SkillStateManager: 沒有找到保存的狀態數據');
        return;
      }

      const stateData = JSON.parse(savedData);

      // 版本兼容性檢查
      if (stateData.version !== '2.1.4') {
        console.warn('SkillStateManager: 狀態數據版本不匹配，跳過載入');
        return;
      }

      // 恢復狀態
      if (stateData.states && Array.isArray(stateData.states)) {
        stateData.states.forEach(state => {
          this.skillStates.set(state.id, {
            id: state.id,
            status: state.status,
            level: state.level,
            progress: state.progress,
            unlockedAt: state.unlockedAt,
            lastUpdated: state.lastUpdated,
          });
        });

        console.log(
          `SkillStateManager: 從本地存儲載入 ${stateData.states.length} 個技能狀態`
        );
      }
    } catch (error) {
      console.error('SkillStateManager: 載入保存的狀態失敗', error);
    }
  }

  /**
   * 清除持久化狀態
   */
  clearPersistedState() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('SkillStateManager: 清除本地存儲的狀態數據');
    } catch (error) {
      console.error('SkillStateManager: 清除狀態失敗', error);
    }
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 監聽頁面關閉前保存狀態
    window.addEventListener('beforeunload', () => {
      this.persistState();
    });
  }

  /**
   * 獲取學習進度統計
   */
  getProgressStats() {
    const states = this.getStatesCount();
    const total = this.skillStates.size;

    return {
      total,
      mastered: states[SkillStatus.MASTERED] || 0,
      available: states[SkillStatus.AVAILABLE] || 0,
      learning: states[SkillStatus.LEARNING] || 0,
      locked: states[SkillStatus.LOCKED] || 0,
      masteredPercentage:
        total > 0
          ? Math.round(((states[SkillStatus.MASTERED] || 0) / total) * 100)
          : 0,
      unlockedPercentage:
        total > 0
          ? Math.round(
              (((states[SkillStatus.MASTERED] || 0) +
                (states[SkillStatus.AVAILABLE] || 0) +
                (states[SkillStatus.LEARNING] || 0)) /
                total) *
                100
            )
          : 0,
    };
  }

  /**
   * 銷毀狀態管理器
   */
  destroy() {
    // 保存最終狀態
    this.persistState();

    // 清理監聽器
    this.stateChangeListeners.clear();

    // 清理狀態
    this.skillStates.clear();

    console.log('SkillStateManager: 狀態管理器已銷毀');
  }
}

export default SkillStateManager;
