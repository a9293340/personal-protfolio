/**
 * SkillTree - 技能樹組件
 * 
 * 基於 POC-001 遷移而來的技能樹系統
 * 整合到新的 Config-Driven 架構中
 * 
 * 核心功能：
 * - 六角形網格座標系統
 * - 技能節點渲染和狀態管理
 * - 拖曳和縮放互動
 * - 配置驅動的技能數據
 * 
 * @author Claude
 * @version 2.0.0 (基於 POC-001 v1.0.0)
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';
import type { ComponentConfig, ComponentState } from '../../../core/components/BaseComponent.js';
import { HexCoordSystem } from './HexCoordSystem.js';
import type { HexCoord } from './HexCoordSystem.js';
import type { 
  SkillTreeConfig, 
  SkillNode, 
  SkillsDataConfig,
  RenderedSkillNode 
} from './types.js';

// SkillTree 特定的配置接口
export interface SkillTreeComponentConfig extends ComponentConfig {
  // 技能樹基本設置
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
  
  // 數據源（保持與 ConfigValue 兼容）
  skillData?: any;
}

// SkillTree 組件狀態
export interface SkillTreeState extends ComponentState {
  // 視窗狀態
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // 拖曳狀態
  isDragging: boolean;
  dragMode: boolean;
  lastPanPoint: { x: number; y: number };
  currentPan: { x: number; y: number };
  
  // 技能樹數據
  nodes: SkillNode[];
  connections: Array<{ from: string; to: string }>;
  
  // 選中狀態
  selectedNode: string | null;
  hoveredNode: string | null;
  
  // 載入狀態
  isLoaded: boolean;
  isRendering: boolean;
}

export class SkillTree extends BaseComponent {
  protected hexSystem!: HexCoordSystem;
  protected svg!: SVGElement;
  declare protected config: SkillTreeComponentConfig;
  declare protected state: SkillTreeState;
  
  /**
   * 獲取默認配置
   */
  protected getDefaultConfig(): SkillTreeComponentConfig {
    return {
      // 基本設置
      nodeSize: 30,
      gridSize: 20,
      
      // 視窗設置
      viewWidth: 1200,
      viewHeight: 800,
      centerX: 600,
      centerY: 400,
      
      // 交互功能
      enableDrag: true,
      enableZoom: true,
      enableNodeClick: true,
      
      // 視覺設置
      showGrid: true,
      showConnections: true,
      animationDuration: 300,
      
      // 響應式和無障礙
      responsive: true,
      animation: true,
      
      // 基礎配置
      className: 'skill-tree-container',
      debug: false,
    };
  }

  /**
   * 獲取初始狀態
   */
  protected getInitialState(): SkillTreeState {
    return {
      // 視窗狀態
      viewBox: {
        x: 0,
        y: 0,
        width: this.config.viewWidth || 1200,
        height: this.config.viewHeight || 800,
      },
      
      // 拖曳狀態
      isDragging: false,
      dragMode: false,
      lastPanPoint: { x: 0, y: 0 },
      currentPan: { x: 0, y: 0 },
      
      // 技能樹數據
      nodes: [],
      connections: [],
      
      // 選中狀態
      selectedNode: null,
      hoveredNode: null,
      
      // 載入狀態
      isLoaded: false,
      isRendering: false,
    };
  }

  /**
   * 初始化組件（重寫父類的 init 方法）
   */
  async init(): Promise<void> {
    console.log('[SkillTree] 組件初始化開始...');
    
    try {
      // 初始化六角形座標系統
      this.hexSystem = new HexCoordSystem(this.config.nodeSize || 30);
      
      // 創建 SVG 元素
      this.createSVGElement();
      
      // 載入技能樹數據
      await this.loadSkillTreeData();
      
      // 生成技能樹結構
      this.generateSkillTree();
      
      // 設置事件監聽
      this.setupEventListeners();
      
      this.setState({ isLoaded: true });
      console.log('[SkillTree] 組件初始化完成');
      
    } catch (error) {
      console.error('[SkillTree] 組件初始化失敗:', error);
      throw error;
    }
  }

  /**
   * 實現 BaseComponent 的抽象渲染方法
   */
  protected doRender(context: any): HTMLElement {
    // 創建 SVG 元素作為主要渲染元素
    this.createSVGElement();
    return this.svg as any;
  }

  /**
   * 實現 BaseComponent 的抽象事件綁定方法
   */
  protected bindComponentEvents(): void {
    this.setupEventListeners();
  }

  /**
   * 渲染組件
   */
  protected async render(): Promise<void> {
    if (!this.container) {
      throw new Error('SkillTree: 容器元素不存在');
    }

    this.setState({ isRendering: true });
    
    try {
      // 清空容器
      this.container.innerHTML = '';
      
      // 添加 CSS 類名
      this.container.className = this.config.className || 'skill-tree-container';
      
      // 添加 SVG 到容器
      this.container.appendChild(this.svg);
      
      // 渲染背景網格（如果啟用）
      if (this.config.showGrid) {
        this.renderHexGrid();
      }
      
      // 渲染技能節點
      this.renderSkillNodes();
      
      // 渲染連接線（如果啟用）
      if (this.config.showConnections) {
        this.renderConnections();
      }
      
      this.setState({ isRendering: false });
      console.log('[SkillTree] 組件渲染完成');
      
    } catch (error) {
      this.setState({ isRendering: false });
      console.error('[SkillTree] 組件渲染失敗:', error);
      throw error;
    }
  }

  /**
   * 創建 SVG 元素
   */
  private createSVGElement(): void {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', String(this.config.viewWidth));
    this.svg.setAttribute('height', String(this.config.viewHeight));
    this.svg.setAttribute('viewBox', `0 0 ${this.config.viewWidth} ${this.config.viewHeight}`);
    this.svg.setAttribute('class', 'skill-tree-svg');
    
    // 添加無障礙標籤
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', '技能樹圖表');
  }

  /**
   * 載入技能樹數據
   */
  private async loadSkillTreeData(): Promise<void> {
    console.log('[SkillTree] 載入技能樹數據...');
    
    try {
      // 動態載入技能數據配置
      const skillDataModule = await import('../../../config/data/skills.data.js');
      const skillsData = skillDataModule.skillsDataConfig || skillDataModule.default;
      
      if (!skillsData) {
        throw new Error('技能數據配置未找到');
      }
      
      // 將配置數據轉換為組件可用的節點數據
      const allNodes = [
        skillsData.tree.center,
        ...skillsData.tree.ring1,
        ...skillsData.tree.ring2,
        ...skillsData.tree.ring3
      ] as SkillNode[];
      
      // 驗證數據完整性
      this.validateSkillData(allNodes);
      
      // 更新組件狀態
      this.setState({ 
        nodes: allNodes,
        isLoaded: true 
      });
      
      console.log(`[SkillTree] 成功載入 ${allNodes.length} 個技能節點`);
      
      // 觸發數據載入完成事件
      this.emit('data:loaded', { config: skillsData });
      
    } catch (error) {
      console.error('[SkillTree] 技能數據載入失敗:', error);
      throw new Error(`技能數據載入失敗: ${error.message}`);
    }
  }

  /**
   * 驗證技能數據完整性
   */
  private validateSkillData(nodes: SkillNode[]): void {
    console.log('[SkillTree] 驗證技能數據...');
    
    const errors: string[] = [];
    
    nodes.forEach((node, index) => {
      // 驗證必要欄位
      if (!node.id) errors.push(`節點 ${index}: 缺少 id`);
      if (!node.name) errors.push(`節點 ${index}: 缺少 name`);
      if (!node.category) errors.push(`節點 ${index}: 缺少 category`);
      if (!node.status) errors.push(`節點 ${index}: 缺少 status`);
      if (!node.coordinates) errors.push(`節點 ${index}: 缺少 coordinates`);
      
      // 驗證座標格式
      if (node.coordinates) {
        if (typeof node.coordinates.q !== 'number') {
          errors.push(`節點 ${node.id}: coordinates.q 必須是數字`);
        }
        if (typeof node.coordinates.r !== 'number') {
          errors.push(`節點 ${node.id}: coordinates.r 必須是數字`);
        }
      }
      
      // 驗證技能陣列
      if (!Array.isArray(node.skills)) {
        errors.push(`節點 ${node.id}: skills 必須是陣列`);
      }
    });
    
    if (errors.length > 0) {
      console.error('[SkillTree] 數據驗證失敗:', errors);
      throw new Error(`數據驗證失敗: ${errors.join('; ')}`);
    }
    
    console.log(`[SkillTree] 數據驗證通過，共 ${nodes.length} 個節點`);
  }

  /**
   * 生成技能樹結構
   */
  private generateSkillTree(): void {
    console.log('[SkillTree] 生成技能樹結構...');
    
    const { nodes } = this.state;
    
    if (!nodes || nodes.length === 0) {
      console.warn('[SkillTree] 沒有技能節點數據，跳過結構生成');
      return;
    }
    
    // 生成連接關係
    const connections = this.generateConnections(nodes);
    this.setState({ connections });
    
    console.log(`[SkillTree] 技能樹結構生成完成: ${nodes.length} 節點, ${connections.length} 連接`);
  }

  /**
   * 生成技能節點之間的連接關係
   */
  private generateConnections(nodes: SkillNode[]): Array<{ from: string; to: string }> {
    const connections: Array<{ from: string; to: string }> = [];
    
    nodes.forEach(node => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach(prereqId => {
          // 檢查前置技能是否存在
          const prereqNode = nodes.find(n => n.id === prereqId);
          if (prereqNode) {
            connections.push({
              from: prereqId,
              to: node.id
            });
          } else {
            console.warn(`[SkillTree] 前置技能不存在: ${prereqId} -> ${node.id}`);
          }
        });
      }
    });
    
    return connections;
  }

  /**
   * 渲染六角形背景網格
   */
  private renderHexGrid(): void {
    // TODO: 實現背景網格渲染
    console.log('[SkillTree] 渲染背景網格...');
  }

  /**
   * 渲染技能節點
   */
  private renderSkillNodes(): void {
    // TODO: 實現技能節點渲染
    console.log('[SkillTree] 渲染技能節點...');
  }

  /**
   * 渲染連接線
   */
  private renderConnections(): void {
    // TODO: 實現連接線渲染
    console.log('[SkillTree] 渲染連接線...');
  }

  /**
   * 設置事件監聽
   */
  private setupEventListeners(): void {
    if (!this.config.enableDrag && !this.config.enableZoom && !this.config.enableNodeClick) {
      return;
    }
    
    console.log('[SkillTree] 設置事件監聽器...');
    
    // TODO: 實現事件監聽設置
    // 包括拖曳、縮放、點擊等互動功能
  }

  /**
   * 清理資源
   */
  protected cleanup(): void {
    // 移除事件監聽器
    // 清理 SVG 元素
    // 重置狀態
    
    console.log('[SkillTree] 組件清理完成');
  }

  // 公開方法用於外部控制
  
  /**
   * 重置視窗到初始位置
   */
  public resetView(): void {
    this.setState({
      currentPan: { x: 0, y: 0 },
      selectedNode: null,
      hoveredNode: null,
    });
    
    // TODO: 實現視窗重置動畫
    console.log('[SkillTree] 視窗已重置');
  }

  /**
   * 聚焦到特定技能節點
   */
  public focusNode(nodeId: string): void {
    // TODO: 實現節點聚焦功能
    console.log(`[SkillTree] 聚焦節點: ${nodeId}`);
  }

  /**
   * 獲取當前選中的節點
   */
  public getSelectedNode(): string | null {
    return this.state.selectedNode;
  }
}