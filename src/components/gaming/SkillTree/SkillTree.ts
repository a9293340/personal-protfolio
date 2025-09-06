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
  RenderedSkillNode,
  VisualConfig 
} from './types.js';

// SkillTree 特定的配置接口
export interface SkillTreeComponentConfig extends ComponentConfig {
  // 配置數據來源路徑
  configPath?: string;
  
  // 運行時配置覆寫
  overrides?: {
    nodeSize?: number;
    gridSize?: number;
    viewWidth?: number;
    viewHeight?: number;
    enableDrag?: boolean;
    enableZoom?: boolean;
    showGrid?: boolean;
    debug?: boolean;
  };
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
  protected skillsConfig!: SkillsDataConfig;
  declare protected config: SkillTreeComponentConfig;
  declare protected state: SkillTreeState;
  
  /**
   * 獲取默認配置
   */
  protected getDefaultConfig(): SkillTreeComponentConfig {
    return {
      // 配置文件路徑
      configPath: '../../../config/data/skills.data.js',
      
      // 基礎配置
      className: 'skill-tree-container',
      responsive: true,
      animation: true,
      
      // 運行時覆寫（可選）
      overrides: {}
    };
  }

  /**
   * 從配置中獲取視覺設定
   */
  private getVisualConfig<K extends keyof VisualConfig>(key: K): any {
    if (!this.skillsConfig?.visual) return null;
    
    // 檢查是否有運行時覆寫
    const override = this.config.overrides?.[key as string];
    if (override !== undefined) {
      return override;
    }
    
    // 返回配置值或默認值
    return this.skillsConfig.visual[key];
  }

  /**
   * 初始化基於配置的系統設定
   */
  private initializeFromConfig(): void {
    if (!this.skillsConfig?.visual) {
      throw new Error('技能樹視覺配置未載入');
    }

    // 初始化六角形座標系統
    const nodeSize = Number(this.getVisualConfig('nodeSize') || 30);
    this.hexSystem = new HexCoordSystem(nodeSize);

    // 更新視窗狀態
    const viewport = this.skillsConfig.visual.viewport;
    this.setState({
      viewBox: {
        x: 0,
        y: 0,
        width: Number(viewport.width),
        height: Number(viewport.height)
      }
    });
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
        width: 1200,
        height: 800,
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
   * 覆寫父類的 beforeInit 方法以載入技能數據
   */
  protected async beforeInit(): Promise<void> {
    // 先執行父類的 beforeInit
    await super.beforeInit();
    
    try {
      if (this.config.debug) {
        console.log('[SkillTree] 開始初始化組件...');
      }
      
      // 載入技能數據
      await this.loadSkillTreeData();
      
      // 基於配置初始化系統
      this.initializeFromConfig();
      
      // 生成技能樹結構
      this.generateSkillTree();
      
      // 標記為已載入
      this.setState({ isLoaded: true });
      
      if (this.skillsConfig?.visual?.debug) {
        console.log('[SkillTree] 組件初始化完成，數據已載入');
      }
      
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
    
    // 渲染所有視覺內容 (數據在 beforeInit 已載入)
    this.renderAllContent();
    
    // 將 SVG 添加到容器
    if (this.container && this.svg) {
      this.container.appendChild(this.svg);
    }
    
    return this.svg as unknown as HTMLElement;
  }

  /**
   * 渲染所有視覺內容
   */
  private renderAllContent(): void {
    if (!this.svg || !this.state.isLoaded) return;

    // 渲染背景網格（如果啟用）
    if (this.skillsConfig.visual.effects.showGrid) {
      this.renderHexGrid();
    }
    
    // 渲染技能節點
    this.renderSkillNodes();
    
    // 渲染連接線（如果啟用）
    if (this.skillsConfig.visual.effects.showConnections) {
      this.renderConnections();
    }
    
    if (this.skillsConfig.visual.debug) {
      console.log('[SkillTree] 所有視覺內容渲染完成');
    }
  }

  /**
   * 實現 BaseComponent 的抽象事件綁定方法
   */
  protected bindComponentEvents(): void {
    this.setupEventListeners();
  }


  /**
   * 創建 SVG 元素
   */
  private createSVGElement(): void {
    const viewport = this.skillsConfig.visual.viewport;
    
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', String(viewport.width));
    this.svg.setAttribute('height', String(viewport.height));
    this.svg.setAttribute('viewBox', `0 0 ${viewport.width} ${viewport.height}`);
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
      
      // 保存配置數據
      this.skillsConfig = skillsData as any as SkillsDataConfig;
      
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
    
    if (this.getVisualConfig('debug')) {
      console.log(`[SkillTree] 數據驗證通過，共 ${nodes.length} 個節點`);
    }
  }

  /**
   * 生成技能樹結構
   */
  private generateSkillTree(): void {
    const { nodes } = this.state;
    
    if (!nodes || nodes.length === 0) {
      if (this.getVisualConfig('debug')) {
        console.warn('[SkillTree] 沒有技能節點數據，跳過結構生成');
      }
      return;
    }
    
    // 生成連接關係
    const connections = this.generateConnections(nodes);
    this.setState({ connections });
    
    if (this.getVisualConfig('debug')) {
      console.log(`[SkillTree] 技能樹結構生成完成: ${nodes.length} 節點, ${connections.length} 連接`);
    }
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
    if (!this.svg || !this.hexSystem) return;
    
    const viewport = this.skillsConfig.visual.viewport;
    const gridSize = this.skillsConfig.visual.gridSize;
    
    // 創建網格組
    let gridGroup = this.svg.querySelector('.hex-grid') as SVGGElement;
    if (!gridGroup) {
      gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridGroup.setAttribute('class', 'hex-grid');
      gridGroup.setAttribute('opacity', '0.1');
      this.svg.appendChild(gridGroup);
    }
    
    // 清空現有網格
    gridGroup.innerHTML = '';
    
    // 計算需要渲染的網格範圍
    const centerX = viewport.centerX;
    const centerY = viewport.centerY;
    const maxRadius = Math.max(viewport.width, viewport.height) / this.hexSystem.getSize() + 2;
    
    // 渲染網格線
    this.renderGridLines(gridGroup, centerX, centerY, maxRadius);
    
    if (this.skillsConfig.visual.debug) {
      console.log(`[SkillTree] 背景網格渲染完成，半徑: ${maxRadius}`);
    }
  }

  /**
   * 渲染網格線
   */
  private renderGridLines(gridGroup: SVGGElement, centerX: number, centerY: number, maxRadius: number): void {
    const hexSize = this.hexSystem.getSize();
    
    // 獲取所有需要渲染的六角形座標
    const gridHexes = this.hexSystem.getHexesInRange({ q: 0, r: 0 }, Math.ceil(maxRadius));
    
    gridHexes.forEach(hex => {
      const pixelCoord = this.hexSystem.hexToPixel(hex);
      
      // 調整到視窗中心
      const x = centerX + pixelCoord.x;
      const y = centerY + pixelCoord.y;
      
      // 只渲染在視窗範圍內的網格
      if (this.isInViewport(x, y)) {
        this.createHexagonOutline(gridGroup, x, y, hexSize);
      }
    });
  }

  /**
   * 檢查座標是否在視窗範圍內
   */
  private isInViewport(x: number, y: number): boolean {
    const viewport = this.skillsConfig.visual.viewport;
    const margin = this.hexSystem.getSize() * 2; // 添加邊距
    
    return x >= -margin && 
           x <= viewport.width + margin && 
           y >= -margin && 
           y <= viewport.height + margin;
  }

  /**
   * 創建六角形輪廓
   */
  private createHexagonOutline(parent: SVGElement, x: number, y: number, size: number): void {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // 計算六角形的六個頂點 (flat-top orientation)
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i; // 60度間隔
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      points.push(i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`);
    }
    points.push('Z'); // 閉合路徑
    
    path.setAttribute('d', points.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#333333');
    path.setAttribute('stroke-width', '0.5');
    path.setAttribute('opacity', '0.3');
    
    parent.appendChild(path);
  }

  /**
   * 渲染技能節點
   */
  private renderSkillNodes(): void {
    if (!this.svg || !this.hexSystem || !this.state.nodes?.length) return;

    const viewport = this.skillsConfig.visual.viewport;
    
    // 創建節點組
    let nodesGroup = this.svg.querySelector('.skill-nodes') as SVGGElement;
    if (!nodesGroup) {
      nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodesGroup.setAttribute('class', 'skill-nodes');
      this.svg.appendChild(nodesGroup);
    }
    
    // 清空現有節點
    nodesGroup.innerHTML = '';
    
    // 渲染每個技能節點
    this.state.nodes.forEach(node => {
      const pixelCoord = this.hexSystem.hexToPixel(node.coordinates);
      const x = viewport.centerX + pixelCoord.x;
      const y = viewport.centerY + pixelCoord.y;
      
      this.renderSkillNode(nodesGroup, node, x, y);
    });
    
    if (this.skillsConfig.visual.debug) {
      console.log(`[SkillTree] 技能節點渲染完成，共 ${this.state.nodes.length} 個節點`);
    }
  }

  /**
   * 渲染單個技能節點
   */
  private renderSkillNode(parent: SVGElement, node: SkillNode, x: number, y: number): void {
    const nodeSize = this.hexSystem.getSize();
    
    // 創建節點組
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeGroup.setAttribute('class', `skill-node skill-node-${node.status}`);
    nodeGroup.setAttribute('data-node-id', node.id);
    nodeGroup.setAttribute('transform', `translate(${x}, ${y})`);
    
    // 根據狀態獲取樣式
    const statusStyle = this.getNodeStatusStyle(node.status);
    const categoryColor = this.getCategoryColor(node.category);
    
    // 渲染節點背景（六角形）
    this.renderNodeBackground(nodeGroup, nodeSize, statusStyle, categoryColor);
    
    // 渲染節點內容
    this.renderNodeContent(nodeGroup, node, nodeSize);
    
    // 添加互動事件
    this.addNodeInteraction(nodeGroup, node);
    
    parent.appendChild(nodeGroup);
  }

  /**
   * 獲取節點狀態樣式
   */
  private getNodeStatusStyle(status: string): { color: string; opacity: number; glow: boolean } {
    const statusMap = {
      mastered: { color: '#d4af37', opacity: 1.0, glow: true },
      available: { color: '#2980b9', opacity: 0.8, glow: false },
      learning: { color: '#27ae60', opacity: 0.7, glow: false },
      locked: { color: '#666666', opacity: 0.4, glow: false }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.locked;
  }

  /**
   * 獲取類別顏色
   */
  private getCategoryColor(category: string): string {
    return this.skillsConfig.categories[category as keyof typeof this.skillsConfig.categories]?.color || '#666666';
  }

  /**
   * 渲染節點背景
   */
  private renderNodeBackground(parent: SVGElement, size: number, statusStyle: any, categoryColor: string): void {
    // 外圈（類別色彩）
    const outerHex = this.createHexagon(size * 1.1, 'none', categoryColor, 2);
    outerHex.setAttribute('opacity', String(statusStyle.opacity * 0.6));
    parent.appendChild(outerHex);
    
    // 內圈（狀態色彩）
    const innerHex = this.createHexagon(size * 0.9, statusStyle.color, 'none', 0);
    innerHex.setAttribute('opacity', String(statusStyle.opacity));
    parent.appendChild(innerHex);
    
    // 發光效果（僅對 mastered 狀態）
    if (statusStyle.glow) {
      const glowHex = this.createHexagon(size * 1.2, 'none', statusStyle.color, 3);
      glowHex.setAttribute('opacity', '0.3');
      glowHex.setAttribute('filter', 'blur(3px)');
      parent.insertBefore(glowHex, parent.firstChild);
    }
  }

  /**
   * 創建六角形 SVG 元素
   */
  private createHexagon(size: number, fill: string, stroke: string, strokeWidth: number): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = size * Math.cos(angle);
      const py = size * Math.sin(angle);
      points.push(i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`);
    }
    points.push('Z');
    
    path.setAttribute('d', points.join(' '));
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', String(strokeWidth));
    
    return path;
  }

  /**
   * 渲染節點內容
   */
  private renderNodeContent(parent: SVGElement, node: SkillNode, size: number): void {
    // 節點名稱
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#ffffff');
    text.textContent = node.name.length > 8 ? node.name.substring(0, 6) + '...' : node.name;
    
    parent.appendChild(text);
  }

  /**
   * 添加節點互動事件
   */
  private addNodeInteraction(nodeGroup: SVGElement, node: SkillNode): void {
    if (!this.skillsConfig.visual.interaction.enableNodeClick) return;
    
    nodeGroup.style.cursor = 'pointer';
    
    nodeGroup.addEventListener('click', (event) => {
      event.stopPropagation();
      this.handleNodeClick(node, event as MouseEvent);
    });
    
    nodeGroup.addEventListener('mouseenter', (event) => {
      this.handleNodeHover(node, event as MouseEvent);
    });
    
    nodeGroup.addEventListener('mouseleave', () => {
      this.handleNodeLeave(node);
    });
  }

  /**
   * 處理節點點擊
   */
  private handleNodeClick(node: SkillNode, event: MouseEvent): void {
    this.setState({ selectedNode: node.id });
    this.emit('node:click', { node, event });
    
    if (this.skillsConfig.visual.debug) {
      console.log(`[SkillTree] 節點點擊: ${node.name}`);
    }
  }

  /**
   * 處理節點懸停
   */
  private handleNodeHover(node: SkillNode, event: MouseEvent): void {
    this.setState({ hoveredNode: node.id });
    this.emit('node:hover', { node, event });
  }

  /**
   * 處理節點離開
   */
  private handleNodeLeave(node: SkillNode): void {
    this.setState({ hoveredNode: null });
    this.emit('node:hover', { node: null, event: null });
  }

  /**
   * 渲染連接線
   */
  private renderConnections(): void {
    if (!this.svg || !this.hexSystem || !this.state.connections?.length) return;

    const viewport = this.skillsConfig.visual.viewport;
    
    // 創建連接線組
    let connectionsGroup = this.svg.querySelector('.skill-connections') as SVGGElement;
    if (!connectionsGroup) {
      connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      connectionsGroup.setAttribute('class', 'skill-connections');
      // 確保連接線在節點之下
      this.svg.insertBefore(connectionsGroup, this.svg.querySelector('.skill-nodes'));
    }
    
    // 清空現有連接線
    connectionsGroup.innerHTML = '';
    
    // 渲染每條連接線
    this.state.connections.forEach(connection => {
      const fromNode = this.state.nodes.find(n => n.id === connection.from);
      const toNode = this.state.nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        this.renderConnection(connectionsGroup, fromNode, toNode, viewport);
      }
    });
    
    if (this.skillsConfig.visual.debug) {
      console.log(`[SkillTree] 連接線渲染完成，共 ${this.state.connections.length} 條連線`);
    }
  }

  /**
   * 渲染單條連接線
   */
  private renderConnection(parent: SVGElement, fromNode: SkillNode, toNode: SkillNode, viewport: any): void {
    const fromPixel = this.hexSystem.hexToPixel(fromNode.coordinates);
    const toPixel = this.hexSystem.hexToPixel(toNode.coordinates);
    
    const x1 = viewport.centerX + fromPixel.x;
    const y1 = viewport.centerY + fromPixel.y;
    const x2 = viewport.centerX + toPixel.x;
    const y2 = viewport.centerY + toPixel.y;
    
    // 創建連接線
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', '#4a5568');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('opacity', '0.6');
    line.setAttribute('class', `connection-${fromNode.id}-${toNode.id}`);
    
    // 根據目標節點狀態調整連接線樣式
    if (toNode.status === 'available') {
      line.setAttribute('stroke', '#2980b9');
      line.setAttribute('opacity', '0.8');
    } else if (toNode.status === 'mastered') {
      line.setAttribute('stroke', '#d4af37');
      line.setAttribute('opacity', '1.0');
    } else if (toNode.status === 'learning') {
      line.setAttribute('stroke', '#27ae60');
      line.setAttribute('opacity', '0.7');
    }
    
    parent.appendChild(line);
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
    
    if (this.getVisualConfig && this.getVisualConfig('debug')) {
      console.log('[SkillTree] 組件清理完成');
    }
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