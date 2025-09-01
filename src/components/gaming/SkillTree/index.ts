/**
 * SkillTree 組件模組入口
 * 
 * 統一匯出技能樹相關的所有類別和類型
 * 基於新的 Config-Driven 架構設計
 * 
 * @author Claude
 * @version 2.1.0 - 適配新配置系統
 */

// 主要組件類別
export { SkillTree } from './SkillTree.js';
export type { 
  SkillTreeComponentConfig, 
  SkillTreeState 
} from './SkillTree.js';

// 六角形座標系統
export { HexCoordSystem, HEX_DIRECTIONS } from './HexCoordSystem.js';
export type { 
  HexCoord, 
  PixelCoord 
} from './HexCoordSystem.js';

// 類型定義
export type {
  // 基本類型
  SkillStatus,
  SkillCategory,
  
  // 數據結構
  SkillNode,
  SkillTreeConfig,
  SkillsDataConfig,
  RenderedSkillNode,
  SkillCategoryDefinition,
  ProficiencyLevelDefinition,
  LearningPath,
  
  // 配置和狀態
  ViewportConfig,
  InteractionState,
  SkillTreeOptions,
  SkillTreeSnapshot,
  
  // 事件
  SkillTreeEvents,
  
  // 別名
  Skill,
  Config,
  RenderedNode,
} from './types.js';

// 預設配置常數（從 types.js 導入）
export { DEFAULT_SKILL_TREE_CONFIG } from './types.js';

// 技能狀態樣式和類別色彩
export { 
  SKILL_STATUS_STYLES, 
  SKILL_CATEGORY_COLORS 
} from './types.js';

// 工具函數
export const SkillTreeUtils = {
  /**
   * 驗證技能節點配置
   */
  validateSkillNode(node: any): boolean {
    return !!(
      node.id &&
      node.name &&
      node.category &&
      node.status &&
      node.coordinates &&
      typeof node.coordinates.q === 'number' &&
      typeof node.coordinates.r === 'number'
    );
  },

  /**
   * 計算技能樹統計信息
   */
  getSkillTreeStats(config: any) {
    const allNodes = [
      config.tree.center,
      ...config.tree.ring1,
      ...config.tree.ring2,
      ...config.tree.ring3
    ];

    const stats = {
      totalSkills: allNodes.length,
      skillsByCategory: {} as Record<string, number>,
      skillsByStatus: {} as Record<string, number>,
      skillsByLevel: {} as Record<string, number>,
    };

    allNodes.forEach(skill => {
      // 按類別統計
      stats.skillsByCategory[skill.category] = (stats.skillsByCategory[skill.category] || 0) + 1;
      
      // 按狀態統計
      stats.skillsByStatus[skill.status] = (stats.skillsByStatus[skill.status] || 0) + 1;
      
      // 按等級統計
      stats.skillsByLevel[skill.level] = (stats.skillsByLevel[skill.level] || 0) + 1;
    });

    return stats;
  },

  /**
   * 根據類別過濾技能
   */
  filterSkillsByCategory(skills: any[], categories: string[]): any[] {
    return skills.filter(skill => categories.includes(skill.category));
  },

  /**
   * 根據狀態過濾技能
   */
  filterSkillsByStatus(skills: any[], statuses: string[]): any[] {
    return skills.filter(skill => statuses.includes(skill.status));
  },

  /**
   * 獲取技能節點的依賴鏈
   */
  getDependencyChain(skillId: string, allSkills: any[]): string[] {
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill || !skill.prerequisites) return [skillId];
    
    const dependencies: string[] = [];
    for (const prereq of skill.prerequisites) {
      dependencies.push(...this.getDependencyChain(prereq, allSkills));
    }
    dependencies.push(skillId);
    
    return [...new Set(dependencies)]; // 去重
  },

  /**
   * 檢查技能是否可以解鎖
   */
  canUnlockSkill(skillId: string, allSkills: any[], unlockedSkills: Set<string>): boolean {
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill || !skill.prerequisites) return true;
    
    return skill.prerequisites.every((prereqId: string) => unlockedSkills.has(prereqId));
  },
} as const;