/**
 * 智能時間軸佈局算法引擎
 * 
 * 職責範圍：
 * - 計算節點在時間軸上的最佳位置
 * - 避免節點重疊和碰撞偵測
 * - 根據重要性調整節點分佈密度
 * - 支援不同的佈局策略和視覺化模式
 * - 響應式佈局適配
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class TimelineLayoutEngine extends BaseComponent {
    constructor(config = {}) {
        super();
        this.config = this.mergeConfig(this.getDefaultConfig(), config);
        this.state = this.getInitialState();
        this.layoutCache = new Map(); // 佈局快取
        this.collisionGrid = null;    // 碰撞偵測網格
    }

    getDefaultConfig() {
        return {
            // 基本佈局參數
            layout: {
                type: 'adaptive',      // adaptive, timeline, importance, spiral
                timelineHeight: 600,   // 時間軸總高度
                timelineWidth: 800,    // 時間軸總寬度
                centerY: 300,          // 時間軸中心線 Y 座標
                nodeSpacing: {
                    minDistance: 30,   // 節點間最小距離
                    preferredDistance: 50, // 節點間偏好距離
                    verticalRange: 200 // 垂直分佈範圍
                }
            },

            // 碰撞偵測設定
            collision: {
                enableDetection: true,
                gridSize: 25,          // 碰撞偵測網格大小
                maxIterations: 100,    // 位置調整最大迭代次數
                forceStrength: 0.8,    // 排斥力強度
                damping: 0.95          // 阻尼係數
            },

            // 重要性分佈策略
            importance: {
                strategy: 'weighted',   // weighted, linear, exponential
                centerBias: 0.7,       // 中心線偏好權重 (重要專案靠近中心)
                scatterRange: 0.8,     // 散布範圍係數
                clusterTolerance: 40   // 聚類容忍距離
            },

            // 響應式設定
            responsive: {
                mobile: {
                    nodeSpacing: { minDistance: 20, preferredDistance: 35, verticalRange: 150 },
                    collision: { gridSize: 20 }
                },
                tablet: {
                    nodeSpacing: { minDistance: 25, preferredDistance: 40, verticalRange: 175 },
                    collision: { gridSize: 22 }
                },
                desktop: {
                    nodeSpacing: { minDistance: 30, preferredDistance: 50, verticalRange: 200 },
                    collision: { gridSize: 25 }
                }
            },

            // 動畫和過渡
            animation: {
                enableLayoutTransition: true,
                transitionDuration: 0.8,
                staggerDelay: 0.05,
                easing: 'power2.inOut'
            }
        };
    }

    getInitialState() {
        return {
            currentLayout: null,
            layoutNodes: [],
            viewport: {
                width: 800,
                height: 600,
                scale: 1,
                centerX: 400,
                centerY: 300
            },
            collisionMap: null,
            layoutHistory: [],
            currentBreakpoint: 'desktop',
            isDirty: false         // 是否需要重新計算佈局
        };
    }

    /**
     * 計算時間軸佈局
     * @param {Array} projects - 適配後的專案數據陣列
     * @param {Object} viewport - 視窗參數
     * @returns {Array} 包含位置資訊的節點陣列
     */
    calculateLayout(projects, viewport = {}) {
        if (!projects || projects.length === 0) {
            console.warn('⚠️ TimelineLayoutEngine: 沒有專案數據可供佈局');
            return [];
        }

        // 更新視窗參數
        this.updateViewport(viewport);
        
        // 清除佈局快取 (如果數據有變更)
        if (this.state.isDirty) {
            this.layoutCache.clear();
            this.state.isDirty = false;
        }

        const cacheKey = this.generateCacheKey(projects, viewport);
        
        // 檢查快取
        if (this.layoutCache.has(cacheKey)) {
            console.log('📋 TimelineLayoutEngine: 使用快取佈局');
            return this.layoutCache.get(cacheKey);
        }

        console.log(`🧮 TimelineLayoutEngine: 開始計算 ${projects.length} 個專案的佈局`);
        
        // 執行佈局計算
        const layoutNodes = this.computeLayout(projects);
        
        // 快取結果
        this.layoutCache.set(cacheKey, layoutNodes);
        this.state.currentLayout = layoutNodes;
        this.state.layoutNodes = layoutNodes;

        console.log(`✅ TimelineLayoutEngine: 佈局計算完成，生成 ${layoutNodes.length} 個節點`);
        
        return layoutNodes;
    }

    /**
     * 執行核心佈局計算
     * @param {Array} projects - 專案數據
     * @returns {Array} 佈局節點
     */
    computeLayout(projects) {
        const layout = this.config.layout;
        
        // 1. 初始化節點位置 (基於時間軸)
        let nodes = this.initializeTimelinePositions(projects);
        
        // 2. 根據重要性調整垂直位置
        nodes = this.adjustImportancePositions(nodes);
        
        // 3. 碰撞偵測和位置優化
        if (this.config.collision.enableDetection) {
            nodes = this.resolveCollisions(nodes);
        }
        
        // 4. 應用佈局策略特殊調整
        nodes = this.applyLayoutStrategy(nodes);
        
        // 5. 邊界檢查和修正
        nodes = this.applyBoundaryConstraints(nodes);

        // 6. 計算連接線和路徑
        nodes = this.calculateConnectionPaths(nodes);

        return nodes;
    }

    /**
     * 初始化時間軸位置 (水平分佈)
     * @param {Array} projects - 專案數據
     * @returns {Array} 包含初始位置的節點
     */
    initializeTimelinePositions(projects) {
        const viewport = this.state.viewport;
        const timelineWidth = viewport.width;
        const centerY = viewport.height / 2;

        return projects.map((project, index) => {
            // 基於時間軸位置計算 X 座標
            const timelineX = project.timeline.position * timelineWidth;
            
            // 初始 Y 座標設為中心線
            const initialY = centerY;

            return {
                id: project.id,
                index: index,
                project: project,
                
                // 位置資訊
                position: {
                    x: timelineX,
                    y: initialY,
                    z: 0  // 用於層級控制
                },
                
                // 原始時間軸位置 (用於參考)
                timelinePosition: {
                    x: timelineX,
                    y: centerY,
                    normalized: project.timeline.position
                },
                
                // 節點屬性
                nodeSize: project.visual.nodeSize,
                importance: project.timeline.importance,
                weight: project.timeline.weight,
                rarity: project.visual.rarity,
                
                // 佈局狀態
                layoutState: {
                    isColliding: false,
                    adjustmentIterations: 0,
                    finalPosition: false
                }
            };
        });
    }

    /**
     * 根據重要性調整垂直位置
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 調整後的節點陣列
     */
    adjustImportancePositions(nodes) {
        const viewport = this.state.viewport;
        const centerY = viewport.height / 2;
        const verticalRange = this.config.layout.nodeSpacing.verticalRange;
        const strategy = this.config.importance.strategy;
        const centerBias = this.config.importance.centerBias;

        return nodes.map(node => {
            const importance = node.importance / 10; // 標準化為 0-1
            const weight = node.weight;
            
            let verticalOffset = 0;

            switch (strategy) {
                case 'weighted':
                    // 重要專案靠近中心，普通專案分散
                    const centerPull = (1 - importance) * centerBias;
                    const randomScatter = (Math.random() - 0.5) * (1 - centerPull);
                    verticalOffset = randomScatter * verticalRange;
                    break;

                case 'linear':
                    // 線性分佈：重要性高的在上方
                    verticalOffset = (importance - 0.5) * verticalRange;
                    break;

                case 'exponential':
                    // 指數分佈：突出最重要的專案
                    const expFactor = Math.pow(importance, 2);
                    verticalOffset = (expFactor - 0.5) * verticalRange;
                    break;

                default:
                    // 隨機分佈
                    verticalOffset = (Math.random() - 0.5) * verticalRange;
            }

            node.position.y = centerY + verticalOffset;
            return node;
        });
    }

    /**
     * 解決節點碰撞
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 解決碰撞後的節點陣列
     */
    resolveCollisions(nodes) {
        const maxIterations = this.config.collision.maxIterations;
        const forceStrength = this.config.collision.forceStrength;
        const damping = this.config.collision.damping;
        const minDistance = this.config.layout.nodeSpacing.minDistance;

        let iteration = 0;
        let hasCollisions = true;

        while (hasCollisions && iteration < maxIterations) {
            hasCollisions = false;

            // 檢測所有節點對的碰撞
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const nodeA = nodes[i];
                    const nodeB = nodes[j];

                    const distance = this.calculateDistance(nodeA.position, nodeB.position);
                    const requiredDistance = (nodeA.nodeSize + nodeB.nodeSize) / 2 + minDistance;

                    if (distance < requiredDistance) {
                        hasCollisions = true;
                        
                        // 計算排斥力向量
                        const repulsionForce = this.calculateRepulsionForce(
                            nodeA, nodeB, distance, requiredDistance, forceStrength
                        );

                        // 應用力到兩個節點
                        this.applyForce(nodeA, repulsionForce, damping);
                        this.applyForce(nodeB, { 
                            x: -repulsionForce.x, 
                            y: -repulsionForce.y 
                        }, damping);

                        nodeA.layoutState.isColliding = true;
                        nodeB.layoutState.isColliding = true;
                        nodeA.layoutState.adjustmentIterations++;
                        nodeB.layoutState.adjustmentIterations++;
                    }
                }
            }

            iteration++;
        }

        // 標記碰撞解決完成
        nodes.forEach(node => {
            node.layoutState.finalPosition = true;
            if (iteration >= maxIterations && node.layoutState.isColliding) {
                console.warn(`⚠️ 節點 ${node.id} 在 ${maxIterations} 次迭代後仍有碰撞`);
            }
        });

        console.log(`🔧 碰撞解決完成，共進行 ${iteration} 次迭代`);
        return nodes;
    }

    /**
     * 計算兩點間距離
     * @param {Object} posA - 位置 A
     * @param {Object} posB - 位置 B
     * @returns {number} 距離
     */
    calculateDistance(posA, posB) {
        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 計算排斥力
     * @param {Object} nodeA - 節點 A
     * @param {Object} nodeB - 節點 B
     * @param {number} distance - 實際距離
     * @param {number} requiredDistance - 需要的距離
     * @param {number} forceStrength - 力的強度
     * @returns {Object} 力向量 {x, y}
     */
    calculateRepulsionForce(nodeA, nodeB, distance, requiredDistance, forceStrength) {
        if (distance === 0) {
            // 避免除零錯誤，給一個隨機方向
            const angle = Math.random() * Math.PI * 2;
            return {
                x: Math.cos(angle) * forceStrength,
                y: Math.sin(angle) * forceStrength
            };
        }

        const overlap = requiredDistance - distance;
        const forceIntensity = overlap * forceStrength;
        
        // 單位向量 (從 B 指向 A)
        const unitX = (nodeA.position.x - nodeB.position.x) / distance;
        const unitY = (nodeA.position.y - nodeB.position.y) / distance;

        // 考慮節點重要性：重要節點更不容易被推移
        const weightA = nodeA.weight || 1;
        const weightB = nodeB.weight || 1;
        const weightFactor = weightB / (weightA + weightB); // A 受到的力的比例

        return {
            x: unitX * forceIntensity * weightFactor,
            y: unitY * forceIntensity * weightFactor
        };
    }

    /**
     * 對節點施加力
     * @param {Object} node - 節點
     * @param {Object} force - 力向量
     * @param {number} damping - 阻尼係數
     */
    applyForce(node, force, damping) {
        // 限制垂直位移，保持時間軸的水平特性
        const maxVerticalDisplacement = this.config.layout.nodeSpacing.verticalRange * 0.1;
        
        node.position.x += force.x * damping;
        node.position.y += Math.max(-maxVerticalDisplacement, 
                                   Math.min(maxVerticalDisplacement, force.y * damping));
    }

    /**
     * 應用特定的佈局策略
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 調整後的節點陣列
     */
    applyLayoutStrategy(nodes) {
        const layoutType = this.config.layout.type;

        switch (layoutType) {
            case 'spiral':
                return this.applySpiralLayout(nodes);
            
            case 'importance':
                return this.applyImportanceBasedLayout(nodes);
            
            case 'timeline':
                // 標準時間軸佈局，已在前面步驟完成
                return nodes;
            
            case 'adaptive':
            default:
                // 自適應佈局：根據數據密度動態調整
                return this.applyAdaptiveLayout(nodes);
        }
    }

    /**
     * 螺旋佈局策略
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 調整後的節點陣列
     */
    applySpiralLayout(nodes) {
        const viewport = this.state.viewport;
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        const spiralRadius = Math.min(viewport.width, viewport.height) * 0.3;

        return nodes.map((node, index) => {
            // 螺旋角度計算
            const angle = index * (Math.PI * 2 / nodes.length) * 2; // 兩圈螺旋
            const radius = spiralRadius * (0.3 + 0.7 * (index / nodes.length)); // 從30%到100%半徑
            
            // 計算螺旋位置
            node.position.x = centerX + Math.cos(angle) * radius;
            node.position.y = centerY + Math.sin(angle) * radius * 0.8; // 稍微壓扁
            
            return node;
        });
    }

    /**
     * 重要性佈局策略
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 調整後的節點陣列
     */
    applyImportanceBasedLayout(nodes) {
        const viewport = this.state.viewport;
        const centerY = viewport.height / 2;
        
        // 按重要性排序
        const sortedNodes = [...nodes].sort((a, b) => b.importance - a.importance);
        
        return nodes.map(node => {
            const importance = node.importance / 10; // 標準化
            
            // 重要的專案靠近中心線，不重要的遠離
            const verticalOffset = (1 - importance) * (viewport.height * 0.3) * (Math.random() - 0.5) * 2;
            node.position.y = centerY + verticalOffset;
            
            return node;
        });
    }

    /**
     * 自適應佈局策略
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 調整後的節點陣列
     */
    applyAdaptiveLayout(nodes) {
        const viewport = this.state.viewport;
        const timelineWidth = viewport.width;
        
        // 分析時間軸上的密度分佈
        const densityMap = this.analyzeDensityDistribution(nodes, timelineWidth);
        
        // 根據密度調整節點位置
        return nodes.map(node => {
            const segment = Math.floor((node.position.x / timelineWidth) * 10); // 分10段
            const segmentDensity = densityMap[segment] || 1;
            
            // 在高密度區域增加垂直分佈
            if (segmentDensity > 3) {
                const extraVerticalRange = (segmentDensity - 3) * 20;
                const randomOffset = (Math.random() - 0.5) * extraVerticalRange;
                node.position.y += randomOffset;
            }
            
            return node;
        });
    }

    /**
     * 分析密度分佈
     * @param {Array} nodes - 節點陣列
     * @param {number} timelineWidth - 時間軸寬度
     * @returns {Object} 密度映射
     */
    analyzeDensityDistribution(nodes, timelineWidth) {
        const segments = 10;
        const densityMap = {};
        
        nodes.forEach(node => {
            const segment = Math.floor((node.position.x / timelineWidth) * segments);
            densityMap[segment] = (densityMap[segment] || 0) + 1;
        });
        
        return densityMap;
    }

    /**
     * 邊界約束檢查
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 修正後的節點陣列
     */
    applyBoundaryConstraints(nodes) {
        const viewport = this.state.viewport;
        const margin = 30;

        return nodes.map(node => {
            const nodeRadius = node.nodeSize / 2;
            
            // X 軸邊界約束
            node.position.x = Math.max(margin + nodeRadius, 
                               Math.min(viewport.width - margin - nodeRadius, node.position.x));
            
            // Y 軸邊界約束
            node.position.y = Math.max(margin + nodeRadius,
                               Math.min(viewport.height - margin - nodeRadius, node.position.y));
            
            return node;
        });
    }

    /**
     * 計算連接路徑
     * @param {Array} nodes - 節點陣列
     * @returns {Array} 包含路徑資訊的節點陣列
     */
    calculateConnectionPaths(nodes) {
        // 按時間順序排序
        const sortedNodes = [...nodes].sort((a, b) => 
            a.timelinePosition.normalized - b.timelinePosition.normalized
        );

        // 為每個節點計算到時間軸的連接路徑
        return nodes.map(node => {
            const timelineY = this.state.viewport.height / 2;
            
            node.connectionPath = {
                // 從節點到時間軸中心線的路徑
                toTimeline: {
                    start: { x: node.position.x, y: node.position.y },
                    end: { x: node.timelinePosition.x, y: timelineY },
                    pathType: 'curved' // curved, straight, arc
                },
                
                // 時間軸上的錨點
                timelineAnchor: {
                    x: node.timelinePosition.x,
                    y: timelineY
                }
            };

            return node;
        });
    }

    /**
     * 更新視窗參數
     * @param {Object} viewport - 新的視窗參數
     */
    updateViewport(viewport) {
        this.state.viewport = { ...this.state.viewport, ...viewport };
        this.state.isDirty = true; // 標記需要重新計算
    }

    /**
     * 更新響應式斷點
     * @param {string} breakpoint - 斷點名稱
     */
    updateBreakpoint(breakpoint) {
        if (this.state.currentBreakpoint !== breakpoint) {
            this.state.currentBreakpoint = breakpoint;
            
            // 應用響應式配置
            const responsiveConfig = this.config.responsive[breakpoint];
            if (responsiveConfig) {
                this.config = this.mergeConfig(this.config, responsiveConfig);
                this.state.isDirty = true;
                this.layoutCache.clear();
            }
        }
    }

    /**
     * 生成快取鍵值
     * @param {Array} projects - 專案數據
     * @param {Object} viewport - 視窗參數
     * @returns {string} 快取鍵值
     */
    generateCacheKey(projects, viewport) {
        const projectIds = projects.map(p => p.id).sort().join(',');
        const viewportKey = `${viewport.width || 800}x${viewport.height || 600}`;
        const configKey = `${this.config.layout.type}_${this.state.currentBreakpoint}`;
        
        return `${projectIds}_${viewportKey}_${configKey}`;
    }

    /**
     * 獲取佈局統計資訊
     * @returns {Object} 統計資訊
     */
    getLayoutStatistics() {
        const nodes = this.state.layoutNodes;
        if (!nodes || nodes.length === 0) {
            return null;
        }

        const stats = {
            totalNodes: nodes.length,
            collisions: nodes.filter(n => n.layoutState.isColliding).length,
            averageIterations: 0,
            positionDistribution: {
                topHalf: 0,
                bottomHalf: 0,
                centerBand: 0
            },
            densityAnalysis: {}
        };

        const centerY = this.state.viewport.height / 2;
        const centerBandHeight = this.config.layout.nodeSpacing.verticalRange * 0.3;

        let totalIterations = 0;

        nodes.forEach(node => {
            totalIterations += node.layoutState.adjustmentIterations;
            
            if (node.position.y < centerY - centerBandHeight / 2) {
                stats.positionDistribution.topHalf++;
            } else if (node.position.y > centerY + centerBandHeight / 2) {
                stats.positionDistribution.bottomHalf++;
            } else {
                stats.positionDistribution.centerBand++;
            }
        });

        stats.averageIterations = Math.round(totalIterations / nodes.length * 100) / 100;

        return stats;
    }

    /**
     * 清除佈局快取
     */
    clearCache() {
        this.layoutCache.clear();
        this.state.isDirty = true;
    }

    /**
     * 銷毀組件
     */
    destroy() {
        this.layoutCache.clear();
        this.collisionGrid = null;
        this.state = this.getInitialState();
        super.destroy();
    }
}