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

  // 四個主要發展階段 (大方向概念)
  stages: [
    {
      id: 'learning-phase',
      period: '2019-2020',
      title: '學習探索期',
      concept: '技術基礎建立',
      icon: '🎓',
      status: 'completed',
      theme: {
        primaryColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderColor: 'rgba(52, 152, 219, 0.3)',
      },
      keyAchievements: [
        'HTML/CSS/JavaScript 基礎',
        '前端框架學習',
        '第一個網頁專案',
      ],
      description: '從零開始學習網頁開發技術，建立程式設計基礎能力',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      projectCount: 3,
      learningFocus: '前端技術入門',
    },

    {
      id: 'growth-phase',
      period: '2020-2022',
      title: '全面成長期',
      concept: '技術棧擴展',
      icon: '🚀',
      status: 'completed',
      theme: {
        primaryColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderColor: 'rgba(231, 76, 60, 0.3)',
      },
      keyAchievements: ['全端開發能力', '多個完整專案', '團隊協作經驗'],
      description: '擴展到後端技術，具備全端開發能力，參與多個實際專案',
      technologies: ['Node.js', 'Python', 'MongoDB', 'RESTful API'],
      projectCount: 8,
      learningFocus: '全端技術整合',
    },

    {
      id: 'specialization-phase',
      period: '2022-2024',
      title: '專精發展期',
      concept: '後端深度專精',
      icon: '🎯',
      status: 'current',
      theme: {
        primaryColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        borderColor: 'rgba(243, 156, 18, 0.3)',
      },
      keyAchievements: ['後端架構設計', '系統優化專家', '技術團隊領導'],
      description: '專注於後端系統設計與優化，成為團隊技術核心成員',
      technologies: ['FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
      projectCount: 12,
      learningFocus: '系統架構與優化',
    },

    {
      id: 'architecture-phase',
      period: '2024-未來',
      title: '架構師轉型期',
      concept: '系統架構設計',
      icon: '🏗️',
      status: 'target',
      theme: {
        primaryColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        borderColor: 'rgba(155, 89, 182, 0.3)',
      },
      keyAchievements: ['大型系統設計', '技術決策制定', '團隊技術指導'],
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
