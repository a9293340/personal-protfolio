/**
 * SkillTreeStateManager - 簡化的技能樹狀態管理器（用於測試）
 *
 * 提供基本的技能狀態管理功能，不依賴外部配置文件
 *
 * @author Claude
 * @version 2.1.5-test
 */

import { EventManager } from '../../../core/events/EventManager.js';

/**
 * 技能狀態枚舉
 */
export const SkillStatus = {
  LOCKED: 'locked', // 未解鎖
  AVAILABLE: 'available', // 可學習
  LEARNING: 'learning', // 學習中
  MASTERED: 'mastered', // 已掌握
};

export class SkillTreeStateManager extends EventManager {
  constructor() {
    super();

    // 初始狀態
    this.state = {
      skillStates: new Map(),
      initialized: false,
    };

    // 初始化
    this.init();
  }

  /**
   * 初始化狀態管理器
   */
  init() {
    console.log('SkillTreeStateManager: 初始化狀態管理器');

    // 設置默認狀態
    this.setupDefaultStates();

    this.state.initialized = true;
    this.emit('state-manager-initialized');
  }

  /**
   * 設置默認狀態
   */
  setupDefaultStates() {
    // 這些狀態對應測試頁面中的技能
    const defaultStates = {
      'html-basics': SkillStatus.MASTERED,
      'css-fundamentals': SkillStatus.MASTERED,
      'javascript-core': SkillStatus.AVAILABLE,
      'react-basics': SkillStatus.AVAILABLE,
      'vue-framework': SkillStatus.LOCKED,
      'nodejs-runtime': SkillStatus.MASTERED,
      'express-framework': SkillStatus.MASTERED,
      'fastify-framework': SkillStatus.AVAILABLE,
      'graphql-api': SkillStatus.LEARNING,
      microservices: SkillStatus.LOCKED,
      'sql-basics': SkillStatus.MASTERED,
      'postgresql-db': SkillStatus.MASTERED,
      'mongodb-nosql': SkillStatus.AVAILABLE,
      'redis-cache': SkillStatus.AVAILABLE,
      'docker-containers': SkillStatus.MASTERED,
      'kubernetes-orch': SkillStatus.LEARNING,
      'aws-cloud': SkillStatus.AVAILABLE,
      'terraform-iac': SkillStatus.LOCKED,
    };

    for (const [skillId, status] of Object.entries(defaultStates)) {
      this.state.skillStates.set(skillId, status);
    }
  }

  /**
   * 獲取技能狀態
   * @param {string} skillId 技能ID
   * @returns {string} 技能狀態
   */
  getSkillStatus(skillId) {
    return this.state.skillStates.get(skillId) || SkillStatus.LOCKED;
  }

  /**
   * 設置技能狀態
   * @param {string} skillId 技能ID
   * @param {string} status 新狀態
   */
  setSkillStatus(skillId, status) {
    const oldStatus = this.getSkillStatus(skillId);

    if (oldStatus === status) return;

    this.state.skillStates.set(skillId, status);

    this.emit('skill-status-changed', {
      skillId,
      oldStatus,
      newStatus: status,
    });

    console.log(
      `SkillTreeStateManager: ${skillId} 狀態變更 ${oldStatus} -> ${status}`
    );
  }

  /**
   * 切換技能狀態（用於測試）
   * @param {string} skillId 技能ID
   */
  toggleSkillStatus(skillId) {
    const currentStatus = this.getSkillStatus(skillId);

    // 簡單的狀態循環：locked -> available -> learning -> mastered -> locked
    const statusCycle = {
      [SkillStatus.LOCKED]: SkillStatus.AVAILABLE,
      [SkillStatus.AVAILABLE]: SkillStatus.LEARNING,
      [SkillStatus.LEARNING]: SkillStatus.MASTERED,
      [SkillStatus.MASTERED]: SkillStatus.LOCKED,
    };

    const nextStatus = statusCycle[currentStatus] || SkillStatus.AVAILABLE;
    this.setSkillStatus(skillId, nextStatus);
  }

  /**
   * 獲取所有技能狀態
   * @returns {Map} 所有技能狀態
   */
  getAllSkillStates() {
    return new Map(this.state.skillStates);
  }

  /**
   * 獲取狀態統計
   * @returns {Object} 狀態統計
   */
  getStatusStats() {
    const stats = {
      total: 0,
      [SkillStatus.LOCKED]: 0,
      [SkillStatus.AVAILABLE]: 0,
      [SkillStatus.LEARNING]: 0,
      [SkillStatus.MASTERED]: 0,
    };

    for (const status of this.state.skillStates.values()) {
      stats[status] = (stats[status] || 0) + 1;
      stats.total++;
    }

    return stats;
  }

  /**
   * 重置所有狀態
   */
  resetAllStates() {
    this.state.skillStates.clear();
    this.setupDefaultStates();
    this.emit('all-states-reset');
  }

  /**
   * 銷毀狀態管理器
   */
  destroy() {
    this.state.skillStates.clear();
    this.removeAllListeners();
    console.log('SkillTreeStateManager: 狀態管理器已銷毀');
  }
}

export default SkillTreeStateManager;
