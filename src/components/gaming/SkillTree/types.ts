/**
 * SkillTree 類型定義文件
 *
 * 定義技能樹系統中使用的所有數據結構和類型
 * 基於配置文件 skills.data.js 的結構設計
 *
 * @author Claude
 * @version 2.1.0 - 適配新配置系統
 */

import type { HexCoord } from './HexCoordSystem.js';

// 技能狀態類型
export type SkillStatus = 'mastered' | 'available' | 'learning' | 'locked';

// 技能類別類型
export type SkillCategory =
  | 'backend'
  | 'architecture'
  | 'database'
  | 'devops'
  | 'frontend'
  | 'soft';

// 單一技能定義（技能節點內的子技能）
export interface Skill {
  name: string;
  proficiency: number; // 0-100
}

// 學習資源定義
export interface LearningResource {
  type: 'book' | 'course' | 'tutorial' | 'documentation';
  title: string;
  url?: string;
}

// 技能類別定義
export interface SkillCategoryDefinition {
  name: string;
  color: string;
  icon: string;
  description: string;
}

// 技能節點數據結構（基於配置文件）
export interface SkillNode {
  // 基本信息
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-5
  status: SkillStatus;

  // 座標信息
  coordinates: HexCoord;

  // 學習依賴
  prerequisites?: string[]; // 前置技能 ID 數組

  // 描述信息
  description: string;

  // 子技能列表
  skills: Skill[];

  // 相關專案
  projects?: string[];

  // 學習資源
  learningResources?: LearningResource[];
}

// 學習路徑定義
export interface LearningPath {
  name: string;
  description: string;
  steps: string[]; // 技能節點 ID 的順序
  estimatedTimeMonths: number;
}

// 熟練度等級定義
export interface ProficiencyLevelDefinition {
  name: string;
  description: string;
}

// 技能樹元數據
export interface SkillTreeMetadata {
  version: string;
  lastUpdated: string;
  totalSkills: number;
  maxLevel: number;
  coordinateSystem: string;
}

// 技能樹結構
export interface SkillTreeStructure {
  center: SkillNode;
  ring1: SkillNode[];
  ring2: SkillNode[];
  ring3: SkillNode[];
}

// 視覺配置接口
export interface VisualConfig {
  nodeSize: number;
  gridSize: number;
  viewport: {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
  interaction: {
    enableDrag: boolean;
    enableZoom: boolean;
    enableNodeClick: boolean;
  };
  effects: {
    showGrid: boolean;
    showConnections: boolean;
    animationDuration: number;
  };
  accessibility: {
    responsive: boolean;
    animation: boolean;
    className: string;
  };
  debug: boolean;
}

// 完整的技能數據配置
export interface SkillsDataConfig {
  metadata: SkillTreeMetadata;
  categories: Record<SkillCategory, SkillCategoryDefinition>;
  tree: SkillTreeStructure;
  learningPaths: Record<string, LearningPath>;
  proficiencyLevels: Record<number, ProficiencyLevelDefinition>;
  visual: VisualConfig;
}

// 技能樹配置選項
export interface SkillTreeConfig {
  // 基本設置
  nodeSize?: number;
  gridSize?: number;

  // 視窗設置
  viewWidth?: number;
  viewHeight?: number;
  centerX?: number;
  centerY?: number;

  // 交互功能
  enableDrag?: boolean;
  enableZoom?: boolean;
  enableNodeClick?: boolean;

  // 視覺設置
  showGrid?: boolean;
  showConnections?: boolean;
  animationDuration?: number;

  // 數據源
  skillsData?: SkillsDataConfig;

  // 調試模式
  debug?: boolean;
}

// 渲染用的技能節點（包含計算後的視覺屬性）
export interface RenderedSkillNode extends SkillNode {
  // 像素座標
  x: number;
  y: number;

  // 視覺屬性
  isVisible: boolean;
  isClickable: boolean;
  opacity: number;

  // 連線信息
  connections: Array<{
    to: string;
    isActive: boolean;
  }>;
}

// 視窗配置
export interface ViewportConfig {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

// 交互狀態
export interface InteractionState {
  selectedNode: string | null;
  hoveredNode: string | null;
  isDragging: boolean;
  dragMode: boolean;
  lastPanPoint: { x: number; y: number };
  currentPan: { x: number; y: number };
}

// 技能樹選項（擴展配置）
export interface SkillTreeOptions extends SkillTreeConfig {
  container?: HTMLElement | string;
  theme?: 'dark' | 'light' | 'auto';
  language?: 'zh-TW' | 'en-US';
}

// 技能樹快照（用於保存/載入狀態）
export interface SkillTreeSnapshot {
  viewport: ViewportConfig;
  selectedNode: string | null;
  userProgress?: Record<string, SkillStatus>;
  timestamp: number;
}

// 技能樹事件類型
export interface SkillTreeEvents {
  'node:click': { node: SkillNode; event: MouseEvent };
  'node:hover': { node: SkillNode | null; event: MouseEvent };
  'viewport:change': { viewport: ViewportConfig };
  'data:loaded': { config: SkillsDataConfig };
  'render:complete': { nodesCount: number };
}

// 類型別名
export type Config = SkillTreeConfig;
export type RenderedNode = RenderedSkillNode;

// 默認配置值
export const DEFAULT_SKILL_TREE_CONFIG: Required<SkillTreeConfig> = {
  nodeSize: 30,
  gridSize: 20,
  viewWidth: 1200,
  viewHeight: 800,
  centerX: 600,
  centerY: 400,
  enableDrag: true,
  enableZoom: true,
  enableNodeClick: true,
  showGrid: false,
  showConnections: true,
  animationDuration: 300,
  skillsData: {} as SkillsDataConfig,
  debug: false,
};

// 技能狀態樣式映射
export const SKILL_STATUS_STYLES: Record<
  SkillStatus,
  {
    color: string;
    opacity: number;
    glow: boolean;
  }
> = {
  mastered: { color: 'var(--color-primary-gold)', opacity: 1.0, glow: true },
  available: { color: 'var(--color-primary-blue)', opacity: 0.8, glow: false },
  learning: { color: 'var(--color-primary-green)', opacity: 0.7, glow: false },
  locked: { color: 'var(--color-gray-600)', opacity: 0.4, glow: false },
};

// 技能類別顏色映射
export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  backend: 'var(--color-skill-backend)',
  architecture: 'var(--color-skill-architecture)',
  database: 'var(--color-skill-database)',
  devops: 'var(--color-skill-devops)',
  frontend: 'var(--color-skill-frontend)',
  soft: 'var(--color-skill-soft)',
};
