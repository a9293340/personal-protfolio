/**
 * SkillTree 類型定義文件
 * 
 * 定義技能樹系統中使用的所有數據結構和類型
 * 基於 POC-001 的配置結構遷移而來
 * 
 * @author Claude
 * @version 2.0.0
 */

import type { HexCoord } from './HexCoordSystem.js';

// 技能熟練度等級
export type ProficiencyLevel = 'O' | '*' | 'X';

// 技能等級類型
export type SkillLevel = 'major' | 'minor';

// 技能類型/領域
export type SkillType = 
  | 'frontend' 
  | 'backend' 
  | 'database' 
  | 'cloud-devops' 
  | 'ai' 
  | 'architecture';

// 熟練度定義
export interface ProficiencyDefinition {
  level: 'expert' | 'intermediate' | 'learning';
  name: string;
  opacity: number;
}

// 技能領域類型定義
export interface SkillTypeDefinition {
  color: string;
  direction: number; // 角度（0-360）
  name: string;
}

// 技能節點數據結構
export interface SkillNode {
  // 基本信息
  id: string;
  name: string;
  type: SkillType;
  skillLevel: SkillLevel;
  
  // 座標信息
  hexCoord: HexCoord;
  pixelCoord?: { x: number; y: number }; // 渲染時計算
  
  // 技能屬性
  difficulty?: number; // 難度等級，影響離中心的距離
  proficiency?: ProficiencyLevel; // 熟練度等級
  
  // 關聯關係
  relatedTo?: string[]; // 相關的技能 ID
  prerequisites?: string[]; // 前置技能 ID
  unlocks?: string[]; // 解鎖的技能 ID
  
  // 顯示狀態
  isVisible?: boolean;
  isUnlocked?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  
  // 描述信息
  description?: string;
  tags?: string[];
  experience?: string; // 經驗描述
  projects?: string[]; // 相關專案
}

// 技能樹配置結構
export interface SkillTreeConfig {
  // 技能領域定義
  types: Record<SkillType, SkillTypeDefinition>;
  
  // 熟練度等級定義
  proficiencyLevels: Record<ProficiencyLevel, ProficiencyDefinition>;
  
  // 所有技能節點
  skills: SkillNode[];
  
  // 版本信息
  version?: string;
  lastUpdated?: string;
  
  // 元數據
  metadata?: {
    totalSkills: number;
    skillTypes: SkillType[];
    maxDifficulty: number;
  };
}

// 技能連接定義
export interface SkillConnection {
  from: string; // 起始技能 ID
  to: string;   // 目標技能 ID
  type: 'prerequisite' | 'related' | 'progression';
  strength?: number; // 連接強度（影響視覺表現）
}

// 渲染用的技能節點
export interface RenderedSkillNode extends SkillNode {
  // 渲染屬性
  pixelCoord: { x: number; y: number };
  color: string;
  size: number;
  opacity: number;
  
  // 動畫屬性
  animationDelay?: number;
  isAnimating?: boolean;
  
  // SVG 元素引用
  element?: SVGElement;
  labelElement?: SVGElement;
}

// 技能樹視窗配置
export interface ViewportConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  minZoom: number;
  maxZoom: number;
  currentZoom: number;
}

// 技能樹互動狀態
export interface InteractionState {
  // 拖曳狀態
  isDragging: boolean;
  dragStartPos: { x: number; y: number };
  dragCurrentPos: { x: number; y: number };
  
  // 縮放狀態
  zoomLevel: number;
  zoomCenter: { x: number; y: number };
  
  // 選擇狀態
  selectedNodes: string[];
  hoveredNode: string | null;
  
  // 過濾狀態
  visibleTypes: SkillType[];
  difficultyFilter: [number, number]; // [min, max]
  proficiencyFilter: ProficiencyLevel[];
}

// 技能樹事件類型
export interface SkillTreeEvents {
  'node:click': { nodeId: string; node: SkillNode };
  'node:hover': { nodeId: string; node: SkillNode };
  'node:leave': { nodeId: string; node: SkillNode };
  'node:select': { nodeId: string; node: SkillNode };
  'node:deselect': { nodeId: string; node: SkillNode };
  'viewport:change': { viewport: ViewportConfig };
  'filter:change': { filters: Partial<InteractionState> };
  'tree:load': { config: SkillTreeConfig };
  'tree:error': { error: Error; context: string };
}

// 技能樹配置選項
export interface SkillTreeOptions {
  // 基本設置
  container: string | HTMLElement;
  width?: number;
  height?: number;
  
  // 視覺設置
  nodeSize?: number;
  showGrid?: boolean;
  showConnections?: boolean;
  animationDuration?: number;
  
  // 互動設置
  enableDrag?: boolean;
  enableZoom?: boolean;
  enableNodeClick?: boolean;
  enableKeyboardNav?: boolean;
  
  // 主題設置
  theme?: 'dark' | 'light' | 'neon';
  customColors?: Partial<Record<SkillType, string>>;
  
  // 無障礙設置
  ariaLabel?: string;
  tabIndex?: number;
  announceChanges?: boolean;
  
  // 性能設置
  enableVirtualization?: boolean;
  renderBatchSize?: number;
  maxVisibleNodes?: number;
}

// 技能樹狀態快照（用於狀態管理）
export interface SkillTreeSnapshot {
  timestamp: number;
  viewport: ViewportConfig;
  interaction: InteractionState;
  visibleNodes: string[];
  selectedNodes: string[];
}

// 匯出所有類型
export type {
  HexCoord,
  SkillNode as Skill,
  SkillTreeConfig as Config,
  RenderedSkillNode as RenderedNode,
};