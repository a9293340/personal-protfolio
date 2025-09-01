/**
 * SkillTree 組件模組入口
 * 
 * 統一匯出技能樹相關的所有類別和類型
 * 基於 POC-001 遷移到新架構的技能樹系統
 * 
 * @author Claude
 * @version 2.0.0
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
  ProficiencyLevel,
  SkillLevel,
  SkillType,
  
  // 數據結構
  SkillNode,
  SkillTreeConfig,
  SkillConnection,
  RenderedSkillNode,
  ProficiencyDefinition,
  SkillTypeDefinition,
  
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

// 預設配置常數
export const DEFAULT_SKILL_TREE_CONFIG = {
  nodeSize: 30,
  viewWidth: 1200,
  viewHeight: 800,
  enableDrag: true,
  enableZoom: true,
  enableNodeClick: true,
  showGrid: true,
  showConnections: true,
  animationDuration: 300,
} as const;

// 技能類型顏色主題
export const SKILL_TYPE_COLORS = {
  frontend: '#e74c3c',    // 紅色
  backend: '#3498db',     // 藍色
  database: '#2ecc71',    // 綠色
  'cloud-devops': '#9b59b6',  // 紫色
  ai: '#f39c12',          // 橙色
  architecture: '#1abc9c', // 青色
} as const;

// 熟練度等級配置
export const PROFICIENCY_CONFIGS = {
  'O': { level: 'expert', name: '熟練', opacity: 1.0 },
  '*': { level: 'intermediate', name: '略懂', opacity: 0.7 },
  'X': { level: 'learning', name: '待學習', opacity: 0.4 },
} as const;

// 工具函數
export const SkillTreeUtils = {
  /**
   * 驗證技能節點配置
   */
  validateSkillNode(node: any): boolean {
    return !!(
      node.id &&
      node.name &&
      node.type &&
      node.skillLevel &&
      node.hexCoord &&
      typeof node.hexCoord.q === 'number' &&
      typeof node.hexCoord.r === 'number'
    );
  },

  /**
   * 計算技能樹統計信息
   */
  getSkillTreeStats(config: any) {
    const stats = {
      totalSkills: config.skills.length,
      skillsByType: {} as Record<string, number>,
      skillsByLevel: {} as Record<string, number>,
      skillsByProficiency: {} as Record<string, number>,
    };

    config.skills.forEach(skill => {
      // 按類型統計
      stats.skillsByType[skill.type] = (stats.skillsByType[skill.type] || 0) + 1;
      
      // 按等級統計
      stats.skillsByLevel[skill.skillLevel] = (stats.skillsByLevel[skill.skillLevel] || 0) + 1;
      
      // 按熟練度統計
      if (skill.proficiency) {
        stats.skillsByProficiency[skill.proficiency] = (stats.skillsByProficiency[skill.proficiency] || 0) + 1;
      }
    });

    return stats;
  },

  /**
   * 根據類型過濾技能
   */
  filterSkillsByType(skills: any[], types: string[]): any[] {
    return skills.filter(skill => types.includes(skill.type));
  },

  /**
   * 根據熟練度過濾技能
   */
  filterSkillsByProficiency(skills: any[], proficiencies: string[]): any[] {
    return skills.filter(skill => 
      skill.proficiency && proficiencies.includes(skill.proficiency)
    );
  },
} as const;