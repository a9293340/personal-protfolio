/**
 * 數據適配器 - 處理 projects.data.js 到時間軸格式的轉換
 *
 * 職責範圍：
 * - 解析真實專案數據的時間資訊
 * - 計算專案重要性評分和視覺層級
 * - 提供數據篩選和排序功能
 * - 支援智能佈局算法的數據準備
 */

import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class DataAdapter extends BaseComponent {
  constructor(config = {}) {
    super();
    this.config = this.mergeConfig(this.getDefaultConfig(), config);
    this.state = this.getInitialState();
    this.projectsData = null;
    this.adaptedData = null;
  }

  getDefaultConfig() {
    return {
      // 時間解析設定
      dateFormat: {
        inputFormat: 'YYYY-MM',
        yearOnly: true,
        monthPrecision: true,
      },

      // 重要性評分權重
      importanceWeights: {
        complexity: 0.3, // 技術複雜度權重
        innovation: 0.3, // 創新程度權重
        utility: 0.2, // 實用價值權重
        rarity: 0.2, // 稀有度權重
      },

      // 稀有度數值映射
      rarityScores: {
        normal: 1,
        rare: 2,
        superRare: 3,
        legendary: 4,
      },

      // 時間軸映射設定
      timeline: {
        minYear: 2020,
        maxYear: 2025,
        defaultDuration: 3, // 沒有結束日期時的預設長度(月)
      },

      // 篩選設定
      filters: {
        enableCategoryFilter: true,
        enableRarityFilter: true,
        enableDateRangeFilter: true,
        enableStatusFilter: true,
      },
    };
  }

  getInitialState() {
    return {
      loadedData: null,
      adaptedProjects: [],
      filters: {
        categories: [],
        rarities: [],
        dateRange: null,
        status: [],
      },
      sortBy: 'timeline', // timeline, importance, rarity
      sortOrder: 'asc',
    };
  }

  /**
   * 載入並解析專案數據
   * @param {Object} projectsDataConfig - 來自 projects.data.js 的數據配置
   * @returns {Promise<Array>} 適配後的專案數據陣列
   */
  async loadProjectsData(projectsDataConfig) {
    try {
      this.projectsData = projectsDataConfig;
      this.state.loadedData = projectsDataConfig;

      // 將專案物件轉換為陣列並適配格式
      const adaptedProjects = Object.values(projectsDataConfig.all)
        .map(project => this.adaptProjectData(project))
        .filter(project => project !== null)
        .sort((a, b) => this.compareProjects(a, b));

      this.state.adaptedProjects = adaptedProjects;
      this.adaptedData = adaptedProjects;

      console.log(
        `✅ DataAdapter: 成功載入並適配 ${adaptedProjects.length} 個專案`
      );
      return adaptedProjects;
    } catch (error) {
      console.error('❌ DataAdapter: 數據載入失敗', error);
      throw error;
    }
  }

  /**
   * 適配單一專案數據格式
   * @param {Object} project - 原始專案數據
   * @returns {Object|null} 適配後的專案數據
   */
  adaptProjectData(project) {
    try {
      // 解析時間資訊
      const timelineData = this.parseTimelineData(project.timeline);
      if (!timelineData) {
        console.warn(`⚠️ 跳過專案 ${project.id}: 時間資訊解析失敗`);
        return null;
      }

      // 計算重要性評分
      const importanceScore = this.calculateImportanceScore(project);

      // 適配為時間軸組件所需的格式
      const adaptedProject = {
        // 基本資訊 (保持與原 test 數據相容)
        id: project.id,
        title: project.name,
        date: timelineData.displayDate,
        category: project.category,
        status: timelineData.status,

        // 擴展的真實數據
        originalData: project,

        // 時間軸專用資訊
        timeline: {
          ...timelineData,
          importance: importanceScore,
          weight: this.calculateNodeWeight(project),
          displayPriority: this.calculateDisplayPriority(project),
        },

        // 視覺層級資訊
        visual: {
          rarity: project.rarity,
          rarityScore: this.config.rarityScores[project.rarity] || 1,
          nodeSize: this.calculateNodeSize(project),
          glowIntensity: this.calculateGlowIntensity(project),
        },

        // 詳細資訊 (供 ProjectCardModal 使用)
        details: {
          shortDescription: project.shortDescription,
          fullDescription: project.fullDescription,
          technologies: project.technologies || [],
          highlights: project.highlights || [],
          stats: project.stats || {},
          links: project.links || {},
          challenges: project.challenges || [],
        },
      };

      return adaptedProject;
    } catch (error) {
      console.error(`❌ 適配專案數據失敗: ${project.id}`, error);
      return null;
    }
  }

  /**
   * 解析時間軸數據
   * @param {Object} timeline - 原始時間軸資訊
   * @returns {Object|null} 解析後的時間資訊
   */
  parseTimelineData(timeline) {
    if (!timeline || !timeline.startDate) {
      return null;
    }

    try {
      // 解析開始日期
      const startDate = this.parseDate(timeline.startDate);
      const endDate = timeline.endDate
        ? this.parseDate(timeline.endDate)
        : null;

      // 計算專案持續時間
      const duration = endDate
        ? (endDate.year - startDate.year) * 12 +
          (endDate.month - startDate.month)
        : this.config.timeline.defaultDuration;

      // 計算時間軸位置 (0-1 的標準化位置)
      const timelinePosition = this.calculateTimelinePosition(startDate);

      return {
        startDate: startDate,
        endDate: endDate,
        duration: Math.max(1, duration), // 至少1個月
        displayDate: timeline.startDate, // 用於顯示的原始日期字串
        status: timeline.status || 'unknown',
        lastUpdate: timeline.lastUpdate,
        position: timelinePosition,

        // 時間軸座標計算
        coordinates: {
          x: timelinePosition,
          year: startDate.year,
          month: startDate.month,
        },
      };
    } catch (error) {
      console.error('時間解析錯誤:', timeline, error);
      return null;
    }
  }

  /**
   * 解析日期字串 (YYYY-MM 或 YYYY 格式)
   * @param {string} dateString - 日期字串
   * @returns {Object} { year, month }
   */
  parseDate(dateString) {
    const parts = dateString.split('-');
    const year = parseInt(parts[0]);
    const month = parts[1] ? parseInt(parts[1]) : 1;

    if (isNaN(year) || year < 1900 || year > 2100) {
      throw new Error(`無效的年份: ${dateString}`);
    }

    if (isNaN(month) || month < 1 || month > 12) {
      throw new Error(`無效的月份: ${dateString}`);
    }

    return { year, month };
  }

  /**
   * 計算時間軸標準化位置 (0-1)
   * @param {Object} date - { year, month }
   * @returns {number} 0-1 之間的位置值
   */
  calculateTimelinePosition(date) {
    const minYear = this.config.timeline.minYear;
    const maxYear = this.config.timeline.maxYear;
    const totalMonths = (maxYear - minYear + 1) * 12;

    const projectMonths = (date.year - minYear) * 12 + (date.month - 1);

    return Math.max(0, Math.min(1, projectMonths / totalMonths));
  }

  /**
   * 計算專案重要性評分
   * @param {Object} project - 專案數據
   * @returns {number} 0-10 的重要性評分
   */
  calculateImportanceScore(project) {
    const weights = this.config.importanceWeights;
    const stats = project.stats || {};
    const rarityScore = this.config.rarityScores[project.rarity] || 1;

    const scores = {
      complexity: (stats.complexity || 5) / 10, // 標準化到 0-1
      innovation: (stats.innovation || 5) / 10,
      utility: (stats.utility || 5) / 10,
      rarity: rarityScore / 4, // legendary = 1, normal = 0.25
    };

    const weightedScore =
      scores.complexity * weights.complexity +
      scores.innovation * weights.innovation +
      scores.utility * weights.utility +
      scores.rarity * weights.rarity;

    return Math.round(weightedScore * 10 * 100) / 100; // 0-10，保留兩位小數
  }

  /**
   * 計算節點權重 (影響佈局優先級)
   * @param {Object} project - 專案數據
   * @returns {number} 權重值
   */
  calculateNodeWeight(project) {
    const importanceScore = this.calculateImportanceScore(project);
    const rarityScore = this.config.rarityScores[project.rarity] || 1;
    const statusWeight = project.timeline?.status === 'completed' ? 1.2 : 1.0;

    return importanceScore * rarityScore * statusWeight;
  }

  /**
   * 計算節點大小
   * @param {Object} project - 專案數據
   * @returns {number} 節點大小 (px)
   */
  calculateNodeSize(project) {
    const rarityMultiplier = {
      normal: 1.0,
      rare: 1.2,
      superRare: 1.4,
      legendary: 1.6,
    };

    const baseSize = 16;
    const multiplier = rarityMultiplier[project.rarity] || 1.0;
    const importanceBonus = (this.calculateImportanceScore(project) / 10) * 0.3;

    return Math.round(baseSize * multiplier * (1 + importanceBonus));
  }

  /**
   * 計算發光強度
   * @param {Object} project - 專案數據
   * @returns {number} 0-1 的發光強度
   */
  calculateGlowIntensity(project) {
    const rarityIntensity = {
      normal: 0.3,
      rare: 0.5,
      superRare: 0.7,
      legendary: 1.0,
    };

    return rarityIntensity[project.rarity] || 0.3;
  }

  /**
   * 計算顯示優先級
   * @param {Object} project - 專案數據
   * @returns {number} 優先級分數
   */
  calculateDisplayPriority(project) {
    const importance = this.calculateImportanceScore(project);
    const rarityScore = this.config.rarityScores[project.rarity];
    const featuredBonus = this.projectsData?.featured?.includes(project.id)
      ? 2
      : 0;

    return importance + rarityScore + featuredBonus;
  }

  /**
   * 專案比較函數 (用於排序)
   * @param {Object} a - 專案 A
   * @param {Object} b - 專案 B
   * @returns {number} 比較結果
   */
  compareProjects(a, b) {
    const sortBy = this.state.sortBy;
    const order = this.state.sortOrder === 'desc' ? -1 : 1;

    switch (sortBy) {
      case 'timeline':
        return (a.timeline.position - b.timeline.position) * order;

      case 'importance':
        return (a.timeline.importance - b.timeline.importance) * order;

      case 'rarity':
        return (a.visual.rarityScore - b.visual.rarityScore) * order;

      default:
        return (
          (a.timeline.displayPriority - b.timeline.displayPriority) * order
        );
    }
  }

  /**
   * 應用篩選條件
   * @param {Object} filters - 篩選條件
   * @returns {Array} 篩選後的專案陣列
   */
  applyFilters(filters = {}) {
    if (!this.adaptedData) {
      console.warn('⚠️ DataAdapter: 尚未載入數據，無法應用篩選');
      return [];
    }

    this.state.filters = { ...this.state.filters, ...filters };

    let filteredProjects = [...this.adaptedData];

    // 類別篩選
    if (filters.categories && filters.categories.length > 0) {
      filteredProjects = filteredProjects.filter(project =>
        filters.categories.includes(project.category)
      );
    }

    // 稀有度篩選
    if (filters.rarities && filters.rarities.length > 0) {
      filteredProjects = filteredProjects.filter(project =>
        filters.rarities.includes(project.visual.rarity)
      );
    }

    // 時間範圍篩選
    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const startPos = this.calculateTimelinePosition(
        this.parseDate(filters.dateRange.start)
      );
      const endPos = this.calculateTimelinePosition(
        this.parseDate(filters.dateRange.end)
      );

      filteredProjects = filteredProjects.filter(
        project =>
          project.timeline.position >= startPos &&
          project.timeline.position <= endPos
      );
    }

    // 狀態篩選
    if (filters.status && filters.status.length > 0) {
      filteredProjects = filteredProjects.filter(project =>
        filters.status.includes(project.status)
      );
    }

    console.log(`🔍 DataAdapter: 篩選後剩餘 ${filteredProjects.length} 個專案`);
    return filteredProjects;
  }

  /**
   * 設定排序方式
   * @param {string} sortBy - 排序欄位
   * @param {string} sortOrder - 排序順序 'asc' | 'desc'
   */
  setSorting(sortBy, sortOrder = 'asc') {
    this.state.sortBy = sortBy;
    this.state.sortOrder = sortOrder;

    if (this.adaptedData) {
      this.adaptedData.sort((a, b) => this.compareProjects(a, b));
    }
  }

  /**
   * 獲取數據統計資訊
   * @returns {Object} 統計資訊
   */
  getDataStatistics() {
    if (!this.adaptedData) {
      return null;
    }

    const stats = {
      totalProjects: this.adaptedData.length,

      byCategory: {},
      byRarity: {},
      byStatus: {},

      timeRange: {
        earliest: null,
        latest: null,
      },

      importanceStats: {
        average: 0,
        highest: 0,
        lowest: 10,
      },
    };

    // 計算各類統計
    this.adaptedData.forEach(project => {
      // 類別統計
      stats.byCategory[project.category] =
        (stats.byCategory[project.category] || 0) + 1;

      // 稀有度統計
      stats.byRarity[project.visual.rarity] =
        (stats.byRarity[project.visual.rarity] || 0) + 1;

      // 狀態統計
      stats.byStatus[project.status] =
        (stats.byStatus[project.status] || 0) + 1;

      // 時間範圍
      const year = project.timeline.coordinates.year;
      if (!stats.timeRange.earliest || year < stats.timeRange.earliest) {
        stats.timeRange.earliest = year;
      }
      if (!stats.timeRange.latest || year > stats.timeRange.latest) {
        stats.timeRange.latest = year;
      }

      // 重要性統計
      const importance = project.timeline.importance;
      stats.importanceStats.average += importance;
      stats.importanceStats.highest = Math.max(
        stats.importanceStats.highest,
        importance
      );
      stats.importanceStats.lowest = Math.min(
        stats.importanceStats.lowest,
        importance
      );
    });

    stats.importanceStats.average =
      Math.round(
        (stats.importanceStats.average / this.adaptedData.length) * 100
      ) / 100;

    return stats;
  }

  /**
   * 重置篩選條件
   */
  clearFilters() {
    this.state.filters = {
      categories: [],
      rarities: [],
      dateRange: null,
      status: [],
    };
  }

  /**
   * 銷毀組件
   */
  destroy() {
    this.projectsData = null;
    this.adaptedData = null;
    this.state = this.getInitialState();
    super.destroy();
  }
}
