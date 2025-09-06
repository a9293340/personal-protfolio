/**
 * 專案重要性評分系統
 * 
 * 職責範圍：
 * - 基於多維度數據計算專案重要性分數
 * - 提供動態權重調整機制
 * - 支援不同評分策略和算法
 * - 整合行業標準和個人職涯發展階段
 * - 提供評分解釋和可視化數據
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class ImportanceScoring extends BaseComponent {
    constructor(config = {}) {
        super();
        this.config = this.mergeConfig(this.getDefaultConfig(), config);
        this.state = this.getInitialState();
        this.scoringHistory = [];
        this.industryBenchmarks = this.initializeIndustryBenchmarks();
    }

    getDefaultConfig() {
        return {
            // 評分策略
            strategy: {
                type: 'weighted_multi_factor',  // weighted_multi_factor, career_progression, portfolio_impact
                version: '1.0',
                updateInterval: 'quarterly'
            },

            // 核心評分維度權重
            dimensions: {
                technical: {
                    weight: 0.25,
                    factors: {
                        complexity: 0.4,        // 技術複雜度
                        innovation: 0.3,        // 技術創新性
                        scalability: 0.3       // 可擴展性
                    }
                },
                business: {
                    weight: 0.25,
                    factors: {
                        impact: 0.5,           // 業務影響力
                        utility: 0.3,          // 實用價值
                        marketRelevance: 0.2   // 市場相關性
                    }
                },
                career: {
                    weight: 0.20,
                    factors: {
                        skillDevelopment: 0.4,  // 技能發展
                        portfolioValue: 0.3,    // 作品集價值
                        networkImpact: 0.3      // 人脈影響
                    }
                },
                execution: {
                    weight: 0.15,
                    factors: {
                        deliveryQuality: 0.4,   // 交付品質
                        timeManagement: 0.3,    // 時間管理
                        resourceEfficiency: 0.3 // 資源效率
                    }
                },
                recognition: {
                    weight: 0.15,
                    factors: {
                        visibility: 0.4,        // 可見度
                        awards: 0.3,           // 獎項認可
                        communityImpact: 0.3   // 社群影響
                    }
                }
            },

            // 稀有度加成係數
            rarityMultipliers: {
                normal: 1.0,
                rare: 1.15,
                superRare: 1.35,
                legendary: 1.6
            },

            // 時間衰減設定
            temporalFactors: {
                enableDecay: true,
                decayRate: 0.05,        // 每年衰減 5%
                relevancePeriod: 5,     // 5年為相關期
                modernTechBonus: 0.2    // 現代技術加成
            },

            // 職涯階段調整
            careerStageAdjustments: {
                junior: {
                    learningWeight: 1.5,    // 學習經驗加權
                    complexityThreshold: 0.7 // 複雜度門檻調整
                },
                mid: {
                    balancedApproach: true,
                    leadershipBonus: 1.2
                },
                senior: {
                    architectureWeight: 1.4,
                    mentorshipBonus: 1.3,
                    innovationThreshold: 0.8
                }
            }
        };
    }

    getInitialState() {
        return {
            currentStrategy: 'weighted_multi_factor',
            careerStage: 'mid',
            scoringSession: null,
            lastUpdate: null,
            benchmarkData: null,
            calibrationFactors: {
                industryAverage: 6.5,
                personalBaseline: 7.0,
                competitiveThreshold: 8.5
            }
        };
    }

    /**
     * 初始化行業基準數據
     * @returns {Object} 行業基準配置
     */
    initializeIndustryBenchmarks() {
        return {
            backend: {
                averageComplexity: 6.8,
                highImpactThreshold: 8.0,
                keyTechnologies: ['microservices', 'distributed-systems', 'databases'],
                experienceMultipliers: {
                    '0-2': 0.8,
                    '2-5': 1.0,
                    '5-10': 1.2,
                    '10+': 1.4
                }
            },
            architecture: {
                averageComplexity: 8.2,
                highImpactThreshold: 9.0,
                keyTechnologies: ['system-design', 'scalability', 'performance'],
                experienceMultipliers: {
                    '0-2': 0.7,
                    '2-5': 0.9,
                    '5-10': 1.1,
                    '10+': 1.5
                }
            },
            fullstack: {
                averageComplexity: 7.0,
                highImpactThreshold: 8.2,
                keyTechnologies: ['frontend', 'backend', 'devops'],
                experienceMultipliers: {
                    '0-2': 0.9,
                    '2-5': 1.0,
                    '5-10': 1.1,
                    '10+': 1.3
                }
            },
            opensource: {
                averageComplexity: 6.5,
                highImpactThreshold: 8.5,
                keyTechnologies: ['community', 'collaboration', 'documentation'],
                experienceMultipliers: {
                    '0-2': 1.1,  // 開源對新手更有價值
                    '2-5': 1.2,
                    '5-10': 1.3,
                    '10+': 1.4
                }
            }
        };
    }

    /**
     * 計算專案重要性評分
     * @param {Object} project - 專案數據
     * @param {Object} context - 評分上下文 (職涯階段、時間等)
     * @returns {Object} 詳細評分結果
     */
    calculateImportanceScore(project, context = {}) {
        const strategy = context.strategy || this.config.strategy.type;
        const careerStage = context.careerStage || this.state.careerStage;

        console.log(`🧮 ImportanceScoring: 開始計算專案 ${project.id} 的重要性評分`);

        // 1. 基礎維度評分
        const dimensionScores = this.calculateDimensionScores(project);

        // 2. 應用權重計算綜合分數
        const weightedScore = this.calculateWeightedScore(dimensionScores);

        // 3. 稀有度加成
        const rarityAdjustedScore = this.applyRarityMultiplier(weightedScore, project.rarity);

        // 4. 時間因素調整
        const temporalAdjustedScore = this.applyTemporalAdjustments(
            rarityAdjustedScore, project.timeline
        );

        // 5. 職涯階段調整
        const careerAdjustedScore = this.applyCareerStageAdjustments(
            temporalAdjustedScore, careerStage, project
        );

        // 6. 行業基準校準
        const finalScore = this.calibrateWithIndustryBenchmarks(
            careerAdjustedScore, project.category
        );

        // 7. 生成評分解釋
        const explanation = this.generateScoringExplanation(
            project, dimensionScores, finalScore
        );

        const result = {
            finalScore: Math.round(finalScore * 100) / 100,
            maxScore: 10.0,
            normalizedScore: finalScore / 10.0,
            
            breakdown: {
                dimensions: dimensionScores,
                weightedBase: weightedScore,
                rarityAdjusted: rarityAdjustedScore,
                temporalAdjusted: temporalAdjustedScore,
                careerAdjusted: careerAdjustedScore,
                finalCalibrated: finalScore
            },
            
            metadata: {
                strategy: strategy,
                careerStage: careerStage,
                calculatedAt: new Date().toISOString(),
                version: this.config.strategy.version
            },
            
            explanation: explanation,
            
            recommendations: this.generateImprovementRecommendations(
                project, dimensionScores, finalScore
            )
        };

        // 記錄評分歷史
        this.scoringHistory.push({
            projectId: project.id,
            score: finalScore,
            timestamp: Date.now(),
            context: context
        });

        console.log(`✅ ImportanceScoring: 專案 ${project.id} 評分完成: ${finalScore}/10`);
        return result;
    }

    /**
     * 計算加權綜合分數
     * @param {Object} dimensionScores - 各維度分數
     * @returns {number} 加權綜合分數 (0-10)
     */
    calculateWeightedScore(dimensionScores) {
        const dimensions = this.config.dimensions;
        let totalWeight = 0;
        let weightedSum = 0;

        Object.entries(dimensions).forEach(([dimension, config]) => {
            const score = dimensionScores[dimension] || 0;
            const weight = config.weight;
            
            weightedSum += score * weight;
            totalWeight += weight;
        });

        // 標準化到 0-10 分數
        return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    }

    /**
     * 計算各維度評分
     * @param {Object} project - 專案數據
     * @returns {Object} 各維度評分
     */
    calculateDimensionScores(project) {
        const stats = project.stats || {};
        const technologies = project.technologies || [];
        const challenges = project.challenges || [];

        const scores = {
            technical: this.calculateTechnicalScore(project, stats, technologies, challenges),
            business: this.calculateBusinessScore(project, stats),
            career: this.calculateCareerScore(project, stats),
            execution: this.calculateExecutionScore(project, stats),
            recognition: this.calculateRecognitionScore(project, stats)
        };

        return scores;
    }

    /**
     * 計算技術維度評分
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @param {Array} technologies - 技術棧
     * @param {Array} challenges - 技術挑戰
     * @returns {number} 技術評分 (0-10)
     */
    calculateTechnicalScore(project, stats, technologies, challenges) {
        // 基礎複雜度分數
        const complexityScore = (stats.complexity || 5) / 10;
        
        // 創新程度分數
        const innovationScore = (stats.innovation || 5) / 10;
        
        // 可擴展性評估
        const scalabilityScore = this.assessScalability(project, technologies);
        
        // 技術挑戰加成
        const challengeBonus = Math.min(challenges.length * 0.1, 0.5);
        
        // 現代技術棧加成
        const modernTechBonus = this.assessModernTechnologyStack(technologies);

        const factors = this.config.dimensions.technical.factors;
        const score = (
            complexityScore * factors.complexity +
            innovationScore * factors.innovation +
            scalabilityScore * factors.scalability
        ) + challengeBonus + modernTechBonus;

        return Math.min(10, Math.max(0, score * 10));
    }

    /**
     * 計算業務維度評分
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 業務評分 (0-10)
     */
    calculateBusinessScore(project, stats) {
        // 業務影響力
        const impactScore = this.assessBusinessImpact(project, stats);
        
        // 實用價值
        const utilityScore = (stats.utility || 5) / 10;
        
        // 市場相關性
        const marketRelevanceScore = this.assessMarketRelevance(project);

        const factors = this.config.dimensions.business.factors;
        const score = 
            impactScore * factors.impact +
            utilityScore * factors.utility +
            marketRelevanceScore * factors.marketRelevance;

        return Math.min(10, Math.max(0, score * 10));
    }

    /**
     * 評估業務影響力
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 影響力分數 (0-1)
     */
    assessBusinessImpact(project, stats) {
        let impactScore = 0.5; // 基準分數

        // 團隊規模影響
        if (stats.teamSize) {
            impactScore += Math.min(stats.teamSize / 10, 0.3);
        }

        // 開發時間影響 (長期專案通常影響更大)
        if (stats.developmentTime) {
            const months = this.parseDevTime(stats.developmentTime);
            impactScore += Math.min(months / 12, 0.2);
        }

        // 代碼規模影響
        if (stats.linesOfCode) {
            const loc = this.parseLineCount(stats.linesOfCode);
            if (loc > 10000) impactScore += 0.2;
            if (loc > 50000) impactScore += 0.1;
        }

        // 性能指標加成
        if (stats.concurrentUsers || stats.messagesPerSecond) {
            impactScore += 0.3;
        }

        return Math.min(1, impactScore);
    }

    /**
     * 評估可擴展性
     * @param {Object} project - 專案數據
     * @param {Array} technologies - 技術棧
     * @returns {number} 可擴展性分數 (0-1)
     */
    assessScalability(project, technologies) {
        const scalabilityKeywords = [
            'microservices', 'kubernetes', 'docker', 'redis', 'mongodb',
            'postgresql', 'nginx', 'load-balancer', 'distributed', 'cluster'
        ];

        const techNames = technologies.map(tech => 
            tech.name ? tech.name.toLowerCase() : tech.toLowerCase()
        );

        let scalabilityScore = 0.3; // 基準分數

        // 檢查擴展性相關技術
        scalabilityKeywords.forEach(keyword => {
            if (techNames.some(tech => tech.includes(keyword))) {
                scalabilityScore += 0.1;
            }
        });

        // 微服務架構特別加成
        if (techNames.some(tech => tech.includes('microservice'))) {
            scalabilityScore += 0.2;
        }

        // 容器化技術加成
        if (techNames.some(tech => tech.includes('docker') || tech.includes('kubernetes'))) {
            scalabilityScore += 0.15;
        }

        return Math.min(1, scalabilityScore);
    }

    /**
     * 應用稀有度倍數
     * @param {number} baseScore - 基礎分數
     * @param {string} rarity - 稀有度
     * @returns {number} 調整後分數
     */
    applyRarityMultiplier(baseScore, rarity) {
        const multiplier = this.config.rarityMultipliers[rarity] || 1.0;
        return baseScore * multiplier;
    }

    /**
     * 應用時間因素調整
     * @param {number} score - 當前分數
     * @param {Object} timeline - 時間軸數據
     * @returns {number} 調整後分數
     */
    applyTemporalAdjustments(score, timeline) {
        if (!this.config.temporalFactors.enableDecay || !timeline) {
            return score;
        }

        const currentYear = new Date().getFullYear();
        const projectYear = timeline.coordinates ? timeline.coordinates.year : 
                           (timeline.startDate ? parseInt(timeline.startDate.split('-')[0]) : currentYear);
        
        const yearsSince = currentYear - projectYear;
        
        if (yearsSince <= 0) {
            return score; // 當前或未來專案，不衰減
        }

        // 時間衰減計算
        const decayRate = this.config.temporalFactors.decayRate;
        const decayFactor = Math.pow(1 - decayRate, yearsSince);
        
        // 相關期內的專案減少衰減
        const relevancePeriod = this.config.temporalFactors.relevancePeriod;
        const relevanceFactor = yearsSince <= relevancePeriod ? 0.9 : 1.0;
        
        return score * decayFactor * relevanceFactor;
    }

    /**
     * 應用職涯階段調整
     * @param {number} score - 當前分數
     * @param {string} careerStage - 職涯階段
     * @param {Object} project - 專案數據
     * @returns {number} 調整後分數
     */
    applyCareerStageAdjustments(score, careerStage, project) {
        const adjustments = this.config.careerStageAdjustments[careerStage];
        if (!adjustments) {
            return score;
        }

        let adjustedScore = score;

        // 學習經驗加權（針對初級階段）
        if (adjustments.learningWeight && project.category !== 'architecture') {
            adjustedScore *= adjustments.learningWeight;
        }

        // 架構權重（針對高級階段）
        if (adjustments.architectureWeight && project.category === 'architecture') {
            adjustedScore *= adjustments.architectureWeight;
        }

        // 領導力加成（針對中級階段）
        if (adjustments.leadershipBonus && project.stats && project.stats.teamSize > 3) {
            adjustedScore *= adjustments.leadershipBonus;
        }

        // 導師制加成（針對高級階段）
        if (adjustments.mentorshipBonus && project.category === 'opensource') {
            adjustedScore *= adjustments.mentorshipBonus;
        }

        return Math.min(10, adjustedScore);
    }

    /**
     * 校準行業基準
     * @param {number} score - 當前分數
     * @param {string} category - 專案類別
     * @returns {number} 校準後分數
     */
    calibrateWithIndustryBenchmarks(score, category) {
        const benchmark = this.industryBenchmarks[category];
        if (!benchmark) {
            return score;
        }

        const industryAverage = benchmark.averageComplexity;
        const calibrationFactor = this.state.calibrationFactors.industryAverage / industryAverage;
        
        return Math.min(10, score * calibrationFactor);
    }

    /**
     * 評估現代技術棧
     * @param {Array} technologies - 技術棧
     * @returns {number} 現代技術加成 (0-0.5)
     */
    assessModernTechnologyStack(technologies) {
        const modernTech = [
            'node.js', 'python', 'go', 'rust', 'typescript',
            'react', 'vue', 'docker', 'kubernetes', 'aws', 'gcp',
            'graphql', 'websocket', 'redis', 'elasticsearch'
        ];

        const techNames = technologies.map(tech => 
            tech.name ? tech.name.toLowerCase() : tech.toLowerCase()
        );

        let modernBonus = 0;
        let modernCount = 0;

        modernTech.forEach(tech => {
            if (techNames.some(t => t.includes(tech))) {
                modernCount++;
            }
        });

        // 基於現代技術使用比例給予加成
        modernBonus = Math.min(modernCount / modernTech.length * 0.5, 0.5);

        return modernBonus;
    }

    /**
     * 評估市場相關性
     * @param {Object} project - 專案數據
     * @returns {number} 市場相關性分數 (0-1)
     */
    assessMarketRelevance(project) {
        const marketTrends = {
            'ai': 0.9,
            'machine-learning': 0.9,
            'microservices': 0.8,
            'cloud': 0.8,
            'devops': 0.7,
            'real-time': 0.7,
            'e-commerce': 0.6,
            'cms': 0.5
        };

        let relevanceScore = 0.5; // 基準分數

        const projectText = (
            (project.name || '') + ' ' +
            (project.shortDescription || '') + ' ' +
            (project.category || '')
        ).toLowerCase();

        // 檢查市場熱門關鍵字
        Object.entries(marketTrends).forEach(([keyword, weight]) => {
            if (projectText.includes(keyword)) {
                relevanceScore = Math.max(relevanceScore, weight);
            }
        });

        return relevanceScore;
    }

    /**
     * 計算職涯維度評分
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 職涯評分 (0-10)
     */
    calculateCareerScore(project, stats) {
        // 技能發展價值
        const skillDevScore = this.assessSkillDevelopmentValue(project);
        
        // 作品集價值
        const portfolioScore = this.assessPortfolioValue(project, stats);
        
        // 人脈網路影響
        const networkScore = this.assessNetworkImpact(project, stats);

        const factors = this.config.dimensions.career.factors;
        const score = 
            skillDevScore * factors.skillDevelopment +
            portfolioScore * factors.portfolioValue +
            networkScore * factors.networkImpact;

        return Math.min(10, Math.max(0, score * 10));
    }

    /**
     * 評估技能發展價值
     * @param {Object} project - 專案數據
     * @returns {number} 技能發展分數 (0-1)
     */
    assessSkillDevelopmentValue(project) {
        const technologies = project.technologies || [];
        const challenges = project.challenges || [];

        let skillScore = 0.4; // 基準分數

        // 技術多樣性加成
        if (technologies.length > 5) skillScore += 0.2;
        if (technologies.length > 10) skillScore += 0.1;

        // 技術挑戰加成
        skillScore += Math.min(challenges.length * 0.1, 0.3);

        // 跨領域項目加成
        const categories = [...new Set(technologies.map(tech => tech.category))];
        if (categories.length > 3) skillScore += 0.2;

        return Math.min(1, skillScore);
    }

    /**
     * 生成評分解釋
     * @param {Object} project - 專案數據
     * @param {Object} dimensionScores - 維度分數
     * @param {number} finalScore - 最終分數
     * @returns {Object} 解釋資訊
     */
    generateScoringExplanation(project, dimensionScores, finalScore) {
        const explanation = {
            summary: this.generateScoreSummary(finalScore),
            strengths: [],
            improvements: [],
            keyFactors: [],
            comparison: this.generateIndustryComparison(project.category, finalScore)
        };

        // 分析優勢
        Object.entries(dimensionScores).forEach(([dimension, score]) => {
            if (score >= 7.5) {
                explanation.strengths.push({
                    dimension: dimension,
                    score: score,
                    reason: this.getStrengthReason(dimension, score)
                });
            } else if (score <= 5.0) {
                explanation.improvements.push({
                    dimension: dimension,
                    score: score,
                    suggestion: this.getImprovementSuggestion(dimension, score)
                });
            }
        });

        // 關鍵因素識別
        explanation.keyFactors = this.identifyKeyFactors(project, dimensionScores);

        return explanation;
    }

    /**
     * 生成改進建議
     * @param {Object} project - 專案數據
     * @param {Object} dimensionScores - 維度分數
     * @param {number} finalScore - 最終分數
     * @returns {Array} 改進建議列表
     */
    generateImprovementRecommendations(project, dimensionScores, finalScore) {
        const recommendations = [];

        // 基於維度分數生成建議
        Object.entries(dimensionScores).forEach(([dimension, score]) => {
            if (score < 6.0) {
                recommendations.push({
                    category: dimension,
                    priority: 'high',
                    suggestion: this.getDimensionImprovement(dimension, project),
                    impact: 'medium'
                });
            }
        });

        // 整體分數建議
        if (finalScore < 6.0) {
            recommendations.push({
                category: 'overall',
                priority: 'critical',
                suggestion: '考慮增加專案的技術複雜度和業務影響力',
                impact: 'high'
            });
        }

        return recommendations.slice(0, 5); // 限制建議數量
    }

    /**
     * 輔助方法：解析開發時間
     * @param {string} devTime - 開發時間字串
     * @returns {number} 月數
     */
    parseDevTime(devTime) {
        if (typeof devTime === 'string') {
            const months = devTime.match(/(\d+)\s*months?/i);
            if (months) return parseInt(months[1]);
            
            const years = devTime.match(/(\d+)\s*years?/i);
            if (years) return parseInt(years[1]) * 12;
        }
        return 3; // 預設3個月
    }

    /**
     * 輔助方法：解析代碼行數
     * @param {string} loc - 代碼行數字串
     * @returns {number} 行數
     */
    parseLineCount(loc) {
        if (typeof loc === 'string') {
            const match = loc.match(/(\d+(?:,\d+)*)/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        }
        return 0;
    }

    /**
     * 評估作品集價值
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 作品集價值分數 (0-1)
     */
    assessPortfolioValue(project, stats) {
        let portfolioScore = 0.5; // 基準分數

        // 視覺展示價值
        if (project.images && project.images.length > 0) {
            portfolioScore += 0.2;
        }
        
        // 完整度評估
        if (project.links && Object.keys(project.links).length > 2) {
            portfolioScore += 0.2;
        }
        
        // 文檔完整性
        if (project.fullDescription && project.fullDescription.length > 200) {
            portfolioScore += 0.1;
        }

        return Math.min(1, portfolioScore);
    }

    /**
     * 評估網路影響力
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 網路影響分數 (0-1)
     */
    assessNetworkImpact(project, stats) {
        let networkScore = 0.3; // 基準分數

        // 團隊合作規模
        if (stats.teamSize && stats.teamSize > 1) {
            networkScore += Math.min(stats.teamSize / 10, 0.3);
        }

        // 開源項目加分
        if (project.category === 'opensource' || 
            (project.links && project.links.github)) {
            networkScore += 0.2;
        }

        // 社群影響
        if (project.links && project.links.article) {
            networkScore += 0.2;
        }

        return Math.min(1, networkScore);
    }

    /**
     * 計算執行維度評分
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 執行評分 (0-10)
     */
    calculateExecutionScore(project, stats) {
        // 交付品質
        const deliveryScore = project.status === 'completed' ? 0.8 : 
                             project.status === 'inProgress' ? 0.6 : 0.4;
        
        // 時間管理
        let timeScore = 0.5;
        if (stats.developmentTime) {
            const months = this.parseDevTime(stats.developmentTime);
            // 合理開發週期得高分
            if (months >= 2 && months <= 8) {
                timeScore = 0.8;
            } else if (months > 8) {
                timeScore = 0.6; // 時間過長扣分
            }
        }
        
        // 資源效率
        let resourceScore = 0.5;
        if (stats.teamSize && stats.linesOfCode) {
            const loc = this.parseLineCount(stats.linesOfCode);
            const productivity = loc / stats.teamSize;
            if (productivity > 5000) resourceScore = 0.8;
            else if (productivity > 2000) resourceScore = 0.6;
        }

        const factors = this.config.dimensions.execution.factors;
        const score = 
            deliveryScore * factors.deliveryQuality +
            timeScore * factors.timeManagement +
            resourceScore * factors.resourceEfficiency;

        return Math.min(10, Math.max(0, score * 10));
    }

    /**
     * 計算認可維度評分
     * @param {Object} project - 專案數據
     * @param {Object} stats - 統計數據
     * @returns {number} 認可評分 (0-10)
     */
    calculateRecognitionScore(project, stats) {
        // 可見度評估
        let visibilityScore = 0.3;
        if (project.links && project.links.demo) visibilityScore += 0.2;
        if (project.links && project.links.github) visibilityScore += 0.2;
        if (project.links && project.links.article) visibilityScore += 0.3;
        
        // 獎項認可（基於稀有度）
        const rarityScore = {
            normal: 0.2,
            rare: 0.4,
            superRare: 0.6,
            legendary: 0.8
        }[project.rarity] || 0.2;
        
        // 社群影響
        let communityScore = 0.2;
        if (project.category === 'opensource') communityScore += 0.3;
        if (project.links && project.links.documentation) communityScore += 0.2;

        const factors = this.config.dimensions.recognition.factors;
        const score = 
            visibilityScore * factors.visibility +
            rarityScore * factors.awards +
            communityScore * factors.communityImpact;

        return Math.min(10, Math.max(0, score * 10));
    }

    /**
     * 生成評分總結
     * @param {number} finalScore - 最終分數
     * @returns {string} 評分總結
     */
    generateScoreSummary(finalScore) {
        if (finalScore >= 9) return "卓越專案 - 業界頂尖水準";
        if (finalScore >= 8) return "優秀專案 - 超越行業平均";
        if (finalScore >= 7) return "良好專案 - 達到行業標準";
        if (finalScore >= 6) return "合格專案 - 具備基本價值";
        if (finalScore >= 5) return "一般專案 - 有改進空間";
        return "待改進專案 - 需要重點優化";
    }

    /**
     * 獲取優勢原因
     * @param {string} dimension - 維度名稱
     * @param {number} score - 分數
     * @returns {string} 優勢原因
     */
    getStrengthReason(dimension, score) {
        const reasons = {
            technical: "技術複雜度高，創新性強",
            business: "業務影響力大，實用價值高",
            career: "技能發展價值顯著",
            execution: "交付品質優秀，執行效率高",
            recognition: "獲得良好的行業認可"
        };
        return reasons[dimension] || "表現優秀";
    }

    /**
     * 獲取改進建議
     * @param {string} dimension - 維度名稱
     * @param {number} score - 分數
     * @returns {string} 改進建議
     */
    getImprovementSuggestion(dimension, score) {
        const suggestions = {
            technical: "考慮增加技術複雜度或創新元素",
            business: "強化業務價值和實際應用場景",
            career: "增加新技術學習和跨領域經驗",
            execution: "優化項目管理和交付品質",
            recognition: "增加項目曝光度和社群參與"
        };
        return suggestions[dimension] || "需要進一步改進";
    }

    /**
     * 識別關鍵因素
     * @param {Object} project - 專案數據
     * @param {Object} dimensionScores - 維度分數
     * @returns {Array} 關鍵因素列表
     */
    identifyKeyFactors(project, dimensionScores) {
        const factors = [];
        
        // 找出得分最高的維度
        const topDimension = Object.entries(dimensionScores)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topDimension) {
            factors.push({
                type: 'strength',
                dimension: topDimension[0],
                score: topDimension[1],
                description: `${topDimension[0]} 表現突出`
            });
        }
        
        // 稀有度影響
        if (project.rarity === 'legendary') {
            factors.push({
                type: 'rarity',
                description: '傳說級專案大幅提升整體評分'
            });
        }
        
        return factors;
    }

    /**
     * 生成行業比較
     * @param {string} category - 專案類別
     * @param {number} finalScore - 最終分數
     * @returns {Object} 行業比較資訊
     */
    generateIndustryComparison(category, finalScore) {
        const benchmark = this.industryBenchmarks[category];
        if (!benchmark) {
            return { comparison: '無對應行業基準' };
        }
        
        const avgComplexity = benchmark.averageComplexity;
        const comparison = finalScore >= avgComplexity ? 'above' : 'below';
        const percentile = Math.round((finalScore / 10) * 100);
        
        return {
            category: category,
            industryAverage: avgComplexity,
            yourScore: finalScore,
            comparison: comparison,
            percentile: percentile,
            ranking: comparison === 'above' ? '優於平均' : '低於平均'
        };
    }

    /**
     * 獲取維度改進建議
     * @param {string} dimension - 維度名稱
     * @param {Object} project - 專案數據
     * @returns {string} 詳細改進建議
     */
    getDimensionImprovement(dimension, project) {
        const improvements = {
            technical: `考慮採用更複雜的架構模式，如微服務或事件驅動架構`,
            business: `增強項目的商業價值，例如添加用戶分析或ROI計算`,
            career: `擴展技術棧，學習當前熱門技術如AI/ML或雲原生技術`,
            execution: `改進項目管理流程，添加CI/CD和自動化測試`,
            recognition: `增加項目文檔，發表技術文章，參與開源社群`
        };
        return improvements[dimension] || '持續改進和學習';
    }

    /**
     * 計算分數分佈
     * @param {Array} scores - 分數陣列
     * @returns {Object} 分數分佈
     */
    calculateScoreDistribution(scores) {
        const distribution = {
            excellent: 0,  // 9-10
            good: 0,       // 7-8.9
            average: 0,    // 5-6.9
            poor: 0        // 0-4.9
        };
        
        scores.forEach(score => {
            if (score >= 9) distribution.excellent++;
            else if (score >= 7) distribution.good++;
            else if (score >= 5) distribution.average++;
            else distribution.poor++;
        });
        
        return distribution;
    }

    /**
     * 獲取評分歷史統計
     * @returns {Object} 歷史統計
     */
    getScoringStatistics() {
        if (this.scoringHistory.length === 0) {
            return null;
        }

        const scores = this.scoringHistory.map(entry => entry.score);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);

        return {
            totalEvaluations: this.scoringHistory.length,
            averageScore: Math.round(average * 100) / 100,
            highestScore: highest,
            lowestScore: lowest,
            scoreDistribution: this.calculateScoreDistribution(scores)
        };
    }

    /**
     * 銷毀組件
     */
    destroy() {
        this.scoringHistory = [];
        this.industryBenchmarks = null;
        super.destroy();
    }
}