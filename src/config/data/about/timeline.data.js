/**
 * 概念型時間軸配置數據
 * Step 3.2.3: Career Timeline - Conceptual Overview
 * 作為專案頁面完整時間軸的前情提要
 */

/**
 * 職涯發展概念時間軸配置
 */
export const careerTimelineConfig = {
  // 時間軸元數據
  metadata: {
    title: '職涯發展歷程',
    subtitle: '從學習探索到系統架構的專業成長軌跡',
    type: 'conceptual-overview',
    linkToDetails: '/projects', // 未來跳轉到完整專案頁面
    version: '1.0.0',
  },

  // 五個主要發展階段 (對應 personal.config.js 的 careerPath)
  stages: [
    {
      id: 'junior-developer',
      period: '2019-2020',
      title: '初級開發者',
      concept: '技術基礎建立',
      icon: '🎓',
      status: 'completed',
      theme: {
        primaryColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderColor: 'rgba(52, 152, 219, 0.3)',
      },
      keyAchievements: [
        '資策會前端班結訓',
        '基礎程式設計能力',
        '前端框架學習',
      ],
      description: '從零開始學習程式設計，於資策會完成前端開發培訓',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      projectCount: 2,
      learningFocus: '前端技術入門',
    },

    {
      id: 'frontend-desktop-developer',
      period: '2020-2021',
      title: '前端與桌面應用開發者',
      concept: '前端開發與 API 整合',
      icon: '🎨',
      status: 'completed',
      theme: {
        primaryColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderColor: 'rgba(231, 76, 60, 0.3)',
      },
      keyAchievements: [
        'Scanner 配置工具開發',
        'API 設計與整合',
        '資料庫優化經驗',
      ],
      description: '專注於前端開發與桌面應用程式，建立完整開發經驗',
      technologies: ['React', 'Electron', 'RESTful API', 'MySQL'],
      projectCount: 4,
      learningFocus: '前端開發與 API 設計',
    },

    {
      id: 'fullstack-engineer',
      period: '2021-2023',
      title: '全端工程師',
      concept: '後端架構與雲服務',
      icon: '🔧',
      status: 'completed',
      theme: {
        primaryColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderColor: 'rgba(46, 204, 113, 0.3)',
      },
      keyAchievements: [
        '後端架構設計能力',
        'AWS 雲服務接觸',
        '公司內部管理系統重構',
      ],
      description: '深入後端架構設計，開始接觸雲服務系統，完成系統重構專案',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'AWS', 'Docker'],
      projectCount: 6,
      learningFocus: '後端架構與雲服務',
    },

    {
      id: 'senior-backend-engineer',
      period: '2023-2025',
      title: '資深後端工程師',
      concept: '高併發系統與 AI 導入',
      icon: '⚡',
      status: 'current',
      theme: {
        primaryColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        borderColor: 'rgba(243, 156, 18, 0.3)',
      },
      keyAchievements: [
        '智慧連結系統 (日均 20 萬筆)',
        'AI Code Review 導入 (效率提升 30%)',
        '自定義電商平台架構設計',
      ],
      description: '擔任大型專案負責人，成功導入 AI 工具，設計高併發系統架構',
      technologies: ['Node.js', 'PostgreSQL', 'Redis', 'AWS', 'AI Tools'],
      projectCount: 8,
      learningFocus: '系統架構、AI 導入、大型專案',
    },

    {
      id: 'system-architect',
      period: '未來',
      title: '系統架構師',
      concept: '系統架構設計與技術決策',
      icon: '🏗️',
      status: 'target',
      theme: {
        primaryColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        borderColor: 'rgba(155, 89, 182, 0.3)',
      },
      keyAchievements: [
        '大型系統架構設計',
        '技術決策與選型',
        '跨團隊技術協作',
      ],
      description: '轉型為系統架構師，負責大型系統的設計與技術決策',
      technologies: ['Microservices', 'K8s', 'System Design', 'Leadership'],
      projectCount: 0, // 未來目標
      learningFocus: '架構設計與領導力',
    },
  ],

  // 視覺配置 - 低調優雅風格
  visual: {
    // 整體風格
    style: 'minimal-conceptual',
    layout: 'horizontal',

    // 配色系統 - 偏灰色調，不搶RPG面板風頭
    colors: {
      background: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: {
        primary: 'rgba(255, 255, 255, 0.9)',
        secondary: 'rgba(255, 255, 255, 0.7)',
        muted: 'rgba(255, 255, 255, 0.5)',
      },
      timeline: {
        line: 'rgba(255, 255, 255, 0.2)',
        completed: 'rgba(46, 204, 113, 0.6)',
        current: 'rgba(241, 196, 15, 0.8)',
        target: 'rgba(52, 152, 219, 0.5)',
      },
    },

    // 尺寸設定
    dimensions: {
      containerHeight: '200px',
      nodeSize: '60px',
      lineThickness: '2px',
      spacing: '120px',
    },

    // 動畫配置 - 輕量化
    animations: {
      enabled: true,
      duration: '0.8s',
      easing: 'ease-out',
      staggerDelay: 200, // 每個節點延遲200ms
      hover: {
        scale: 1.05,
        duration: '0.3s',
      },
    },
  },

  // 互動功能
  interactions: {
    // 懸停顯示詳情
    hover: {
      enabled: true,
      showTooltip: true,
      showTechnologies: true,
    },

    // 點擊行為 - 為未來專案頁面做準備
    click: {
      enabled: true,
      action: 'show_preview', // 'navigate_to_projects' 未來實作
      previewContent: {
        showKeyAchievements: true,
        showProjectCount: true,
        showCallToAction: true,
        callToActionText: '查看詳細專案 →',
      },
    },
  },

  // 響應式配置
  responsive: {
    breakpoints: {
      mobile: '768px',
      tablet: '1024px',
    },
    mobileBehavior: {
      layout: 'vertical-compact',
      showOnlyIcons: true,
      reduceSpacing: true,
    },
  },
};

export default {
  timeline: careerTimelineConfig,
};
