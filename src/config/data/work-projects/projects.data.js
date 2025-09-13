/**
 * 專案數據配置
 *
 * Config-Driven 專案作品集數據，包含遊戲王風格的稀有度分類
 */

export const projectsDataConfig = {
  // 專案元數據
  metadata: {
    totalProjects: 15,
    featuredCount: 6,
    categories: ['backend', 'architecture', 'fullstack', 'opensource'],
    rarityLevels: ['normal', 'rare', 'superRare', 'legendary'],
  },

  // 精選專案
  featured: [
    'microservices-ecommerce',
    'real-time-chat-system',
    'config-driven-cms',
    'distributed-task-queue',
    'gaming-portfolio',
    'open-source-orm',
  ],

  // 所有專案數據
  all: {
    // 傳說級專案 (Legendary)
    'microservices-ecommerce': {
      id: 'microservices-ecommerce',
      name: '微服務電商系統',
      rarity: 'legendary',
      category: 'architecture',

      // 基本資訊
      shortDescription:
        '大型電商平台的微服務架構設計與實現，支援高併發與彈性擴展',
      fullDescription: `
        從零開始設計並實現的大型電商平台微服務架構，採用 Domain-Driven Design (DDD) 
        進行服務拆分，實現了用戶管理、商品管理、訂單處理、支付系統、庫存管理等核心服務。
        
        系統能夠處理每秒 10,000+ 的請求量，支援水平擴展，並具備完整的監控、日誌和災難恢復機制。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/ecommerce-microservices/thumbnail.jpg',
      images: [
        '/assets/projects/ecommerce-microservices/architecture-diagram.png',
        '/assets/projects/ecommerce-microservices/dashboard.jpg',
        '/assets/projects/ecommerce-microservices/monitoring.jpg',
        '/assets/projects/ecommerce-microservices/performance.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Python/Django', category: 'backend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Redis', category: 'cache' },
        { name: 'RabbitMQ', category: 'messaging' },
        { name: 'Docker', category: 'containerization' },
        { name: 'Kubernetes', category: 'orchestration' },
        { name: 'Nginx', category: 'proxy' },
        { name: 'Prometheus', category: 'monitoring' },
        { name: 'Grafana', category: 'visualization' },
      ],

      // 專案統計
      stats: {
        complexity: 10,
        innovation: 9,
        utility: 10,
        developmentTime: '8 months',
        teamSize: 6,
        linesOfCode: '45,000+',
        services: 12,
        apis: 35,
      },

      // 技術亮點
      highlights: [
        '微服務架構設計與實現',
        '分散式交易一致性處理',
        '高併發系統優化',
        '容器化部署與編排',
        '完整的 CI/CD 流程',
        '監控與警報系統',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: '分散式交易一致性',
          solution: '實現 Saga 模式進行分散式事務管理',
        },
        {
          challenge: '服務間通訊複雜性',
          solution: '設計統一的 API Gateway 和服務網格',
        },
        {
          challenge: '數據一致性保障',
          solution: '採用 Event Sourcing 確保數據完整性',
        },
      ],

      // 連結
      links: {
        github: 'https://github.com/username/microservices-ecommerce',
        demo: 'https://ecommerce-demo.example.com',
        documentation: 'https://docs.example.com/ecommerce',
        article:
          'https://medium.com/@username/microservices-ecommerce-architecture',
      },

      // 時程資訊
      timeline: {
        startDate: '2023-01',
        endDate: '2023-08',
        status: 'completed',
        lastUpdate: '2024-03',
      },
    },

    // 超稀有專案 (Super Rare)
    'real-time-chat-system': {
      id: 'real-time-chat-system',
      name: '即時聊天系統',
      rarity: 'superRare',
      category: 'backend',

      shortDescription: '支援百萬用戶同時在線的分散式即時聊天系統',
      fullDescription: `
        基於 WebSocket 和訊息佇列技術構建的大規模即時聊天系統，支援文字、圖片、檔案分享，
        群組聊天，以及豐富的表情和互動功能。
        
        系統採用水平分片架構，能夠支援百萬級別的同時在線用戶，並具備完整的訊息持久化、
        歷史記錄查詢和多設備同步功能。
      `,

      thumbnail: '/assets/projects/chat-system/thumbnail.jpg',
      images: [
        '/assets/projects/chat-system/architecture.png',
        '/assets/projects/chat-system/chat-interface.jpg',
        '/assets/projects/chat-system/admin-panel.jpg',
      ],

      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Socket.io', category: 'realtime' },
        { name: 'Redis', category: 'cache' },
        { name: 'MongoDB', category: 'database' },
        { name: 'RabbitMQ', category: 'messaging' },
        { name: 'React', category: 'frontend' },
        { name: 'Nginx', category: 'proxy' },
      ],

      stats: {
        complexity: 8,
        innovation: 7,
        utility: 9,
        developmentTime: '4 months',
        teamSize: 3,
        linesOfCode: '25,000+',
        concurrentUsers: '100k+',
        messagesPerSecond: '50k+',
      },

      highlights: [
        'WebSocket 長連接管理',
        '分散式訊息同步',
        '百萬級用戶支援',
        '實時訊息推送',
        '多設備同步機制',
      ],

      links: {
        github: 'https://github.com/username/realtime-chat',
        demo: 'https://chat-demo.example.com',
        article: 'https://blog.example.com/building-scalable-chat-system',
      },

      timeline: {
        startDate: '2023-09',
        endDate: '2023-12',
        status: 'completed',
      },
    },

    // 稀有專案 (Rare)
    'config-driven-cms': {
      id: 'config-driven-cms',
      name: '配置驅動內容管理系統',
      rarity: 'rare',
      category: 'fullstack',

      shortDescription:
        '完全配置驅動的無頭 CMS 系統，支援動態表單和內容類型定義',

      thumbnail: '/assets/projects/config-cms/thumbnail.jpg',
      technologies: [
        { name: 'FastAPI', category: 'backend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Vue.js', category: 'frontend' },
        { name: 'Docker', category: 'deployment' },
      ],

      stats: {
        complexity: 7,
        innovation: 8,
        utility: 8,
        developmentTime: '3 months',
        teamSize: 2,
        linesOfCode: '18,000+',
      },

      highlights: [
        '動態表單生成',
        '配置驅動架構',
        'RESTful API 設計',
        '響應式管理介面',
      ],

      links: {
        github: 'https://github.com/username/config-cms',
        demo: 'https://cms-demo.example.com',
      },

      timeline: {
        startDate: '2024-01',
        endDate: '2024-03',
        status: 'completed',
      },
    },

    // 普通專案 (Normal)
    'task-management-api': {
      id: 'task-management-api',
      name: '任務管理 API',
      rarity: 'normal',
      category: 'backend',

      shortDescription: 'RESTful 任務管理 API，支援團隊協作和進度追蹤',

      thumbnail: '/assets/projects/task-api/thumbnail.jpg',
      technologies: [
        { name: 'Django', category: 'backend' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Redis', category: 'cache' },
        { name: 'Celery', category: 'async' },
      ],

      stats: {
        complexity: 5,
        innovation: 4,
        utility: 7,
        developmentTime: '2 months',
        teamSize: 1,
        linesOfCode: '8,000+',
      },

      highlights: [
        'RESTful API 設計',
        '用戶權限管理',
        '異步任務處理',
        '數據分析報表',
      ],

      links: {
        github: 'https://github.com/username/task-management-api',
        documentation: 'https://docs.example.com/task-api',
      },

      timeline: {
        startDate: '2023-06',
        endDate: '2023-07',
        status: 'completed',
      },
    },

    // 更多專案可以繼續添加...
  },

  // 專案分類
  categories: {
    backend: {
      name: '後端系統',
      description: '服務器端開發與 API 設計專案',
      icon: '⚡',
      color: 'var(--primary-blue)',
      projects: [
        'real-time-chat-system',
        'task-management-api',
        'distributed-task-queue',
      ],
    },

    architecture: {
      name: '系統架構',
      description: '大型系統架構設計與實現專案',
      icon: '🏗️',
      color: 'var(--primary-gold)',
      projects: ['microservices-ecommerce', 'event-driven-platform'],
    },

    fullstack: {
      name: '全端開發',
      description: '前後端完整技術棧專案',
      icon: '🚀',
      color: 'var(--bright-gold)',
      projects: ['config-driven-cms', 'gaming-portfolio'],
    },

    opensource: {
      name: '開源專案',
      description: '開源社群貢獻與協作專案',
      icon: '❤️',
      color: 'var(--primary-red)',
      projects: ['open-source-orm', 'python-toolkit'],
    },
  },

  // 稀有度定義
  raritySystem: {
    normal: {
      name: '普通',
      description: '基礎技術實踐專案',
      color: '#8B4513',
      borderStyle: 'bronze-border',
      minComplexity: 1,
    },
    rare: {
      name: '稀有',
      description: '中等複雜度創新專案',
      color: '#C0C0C0',
      borderStyle: 'silver-border',
      minComplexity: 6,
    },
    superRare: {
      name: '超稀有',
      description: '高複雜度技術突破專案',
      color: '#FFD700',
      borderStyle: 'gold-border',
      minComplexity: 8,
    },
    legendary: {
      name: '傳說',
      description: '頂級架構設計與實現專案',
      color: '#FF6347',
      borderStyle: 'holographic-border',
      minComplexity: 9,
    },
  },
};

export default projectsDataConfig;
