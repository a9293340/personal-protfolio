/**
 * 技能數據配置
 *
 * 基於 POC-001 完整移植的 Config-Driven 技能樹結構
 * 採用六角形座標系統，6大技能領域完整覆蓋
 *
 * 參考來源: /poc/poc-001-skill-tree/src/scripts/skill-tree-config.js
 */

export const skillsDataConfig = {
  // 技能樹元數據
  metadata: {
    version: '2.1.3',
    lastUpdated: '2024-09-02',
    totalSkills: 240,
    maxLevel: 5,
    coordinateSystem: 'hexagonal',
    basedOn: 'POC-001 完整技能樹配置',
  },

  // 技能類別定義 - 6大領域按流亡闇道風格佈局
  categories: {
    // 1. 前端領域 (右方 0度)
    frontend: {
      name: '前端開發領域',
      color: '#e74c3c',
      direction: 0,
      icon: '🎨',
      description: '用戶界面開發、互動設計、前端框架',
    },

    // 2. 後端領域 (右下 300度) - 主要強項
    backend: {
      name: '後端工程領域',
      color: '#3498db',
      direction: 300,
      icon: '⚡',
      description: '服務器端開發、API設計、系統邏輯實現',
    },

    // 3. 資料庫領域 (左下 240度)
    database: {
      name: '資料庫工程領域',
      color: '#2ecc71',
      direction: 240,
      icon: '🗄️',
      description: '數據存儲、查詢優化、架構設計',
    },

    // 4. 雲端DevOps (左方 180度)
    devops: {
      name: '雲端服務與 DevOps',
      color: '#9b59b6',
      direction: 180,
      icon: '⚙️',
      description: '持續整合、容器化、基礎設施管理',
    },

    // 5. AI應用 (左上 120度)
    ai: {
      name: 'AI 工程應用領域',
      color: '#f39c12',
      direction: 120,
      icon: '🤖',
      description: 'AI工具整合、Prompt Engineering、智能化應用',
    },

    // 6. 系統架構 (右上 60度) - 發展目標
    architecture: {
      name: '系統架構設計領域',
      color: '#1abc9c',
      direction: 60,
      icon: '🏗️',
      description: '系統設計、架構模式、擴展性規劃',
    },
  },

  // 熟練度定義 - 對應POC-001的標記系統
  proficiencyLevels: {
    mastered: { symbol: 'O', name: '熟練', color: '#d4af37', opacity: 1.0 },
    available: { symbol: '*', name: '略懂', color: '#2980b9', opacity: 0.8 },
    learning: { symbol: '~', name: '學習中', color: '#27ae60', opacity: 0.7 },
    locked: { symbol: 'X', name: '待學習', color: '#666666', opacity: 0.4 },
  },

  // 技能樹結構 - 完整移植POC-001所有技能
  tree: {
    // 中心起始點
    center: {
      id: 'backend-engineer-core',
      name: '後端工程師',
      category: 'backend',
      level: 5,
      status: 'mastered',
      coordinates: { q: 0, r: 0 },
      description: '具備豐富經驗的後端工程師，擅長系統開發與架構設計',

      skills: [
        { name: 'Python', proficiency: 95 },
        { name: 'JavaScript/Node.js', proficiency: 88 },
        { name: 'RESTful API', proficiency: 92 },
        { name: '系統設計思維', proficiency: 85 },
      ],

      achievements: [
        '5+年後端開發經驗',
        '團隊技術領導者',
        '多個大型專案架構師',
      ],
      nextGoal: 'System Architect',
    },

    // === 第一層：核心技能分支 (距離中心2格) ===
    // 六個方向放射狀佈局：0°(右), 60°(右上), 120°(左上), 180°(左), 240°(左下), 300°(右下)
    // 所有 Ring1 技能都保持距離=2，確保視覺一致性
    ring1: [
      // ===== 1. 前端領域 (右方 0度) - 座標 (2, 0) =====
      {
        id: 'html-css-foundation',
        name: 'HTML/CSS 基礎',
        category: 'frontend',
        level: 4,
        status: 'available',
        coordinates: { q: 2, r: 0 }, // 0度方向
        prerequisites: ['backend-engineer-core'],
        description: '網頁標記語言與樣式設計基礎',
        skills: [
          { name: 'Flexbox/Grid', proficiency: 85 },
          { name: 'HTML5 語義化', proficiency: 82 },
          { name: '響應式設計', proficiency: 80 },
          { name: 'CSS3 選擇器', proficiency: 78 },
        ],
      },

      // ===== 2. 系統架構領域 (右上 60度) - 座標 (2, -2) =====
      {
        id: 'design-patterns-core',
        name: '設計模式基礎',
        category: 'architecture',
        level: 4,
        status: 'available',
        coordinates: { q: 2, r: -2 }, // 60度方向，距離=4 (但直線距離為2)
        prerequisites: ['backend-engineer-core'],
        description: '軟體設計模式與架構原理',
        skills: [
          { name: 'SOLID 原則', proficiency: 82 },
          { name: '創建型模式', proficiency: 80 },
          { name: '結構型模式', proficiency: 78 },
          { name: '行為型模式', proficiency: 72 },
        ],
      },

      // ===== 3. AI領域 (左上 120度) - 座標 (-1, -1) =====
      {
        id: 'prompt-engineering-core',
        name: 'Prompt Engineering',
        category: 'ai',
        level: 5,
        status: 'mastered',
        coordinates: { q: -1, r: -1 }, // 120度方向
        prerequisites: ['backend-engineer-core'],
        description: 'AI工具的有效提示詞設計與應用',
        skills: [
          { name: 'AI輔助開發', proficiency: 92 },
          { name: 'GitHub Copilot', proficiency: 90 },
          { name: '提示詞優化', proficiency: 88 },
          { name: 'Project Rule 管理', proficiency: 85 },
        ],
      },

      // ===== 4. DevOps領域 (左方 180度) - 座標 (-2, 0) =====
      {
        id: 'version-control-systems',
        name: '版本控制系統',
        category: 'devops',
        level: 5,
        status: 'mastered',
        coordinates: { q: -2, r: 0 }, // 180度方向
        prerequisites: ['backend-engineer-core'],
        description: '代碼版本管理與協作開發流程',
        skills: [
          { name: 'Git', proficiency: 92 },
          { name: 'GitHub/GitLab', proficiency: 90 },
          { name: 'Code Review', proficiency: 88 },
          { name: '分支策略', proficiency: 85 },
        ],
      },

      // ===== 5. 資料庫領域 (左下 240度) - 座標 (-2, 2) =====
      {
        id: 'relational-databases-core',
        name: '關聯式資料庫',
        category: 'database',
        level: 4,
        status: 'available',
        coordinates: { q: -2, r: 2 }, // 240度方向，距離=4 (但直線距離為2)
        prerequisites: ['backend-engineer-core'],
        description: 'SQL數據庫的設計、優化與管理',
        skills: [
          { name: 'MySQL', proficiency: 85 },
          { name: 'PostgreSQL', proficiency: 60 },
          { name: 'SQL查詢與Join', proficiency: 82 },
          { name: '基礎數據建模', proficiency: 55 },
        ],
      },

      // ===== 6. 後端領域 (右下 300度) - 座標 (1, 1) =====
      {
        id: 'programming-languages',
        name: '程式語言精通',
        category: 'backend',
        level: 5,
        status: 'mastered',
        coordinates: { q: 1, r: 1 }, // 300度方向
        prerequisites: ['backend-engineer-core'],
        description: '主要後端程式語言的深度掌握',
        skills: [
          { name: 'JavaScript/Node.js', proficiency: 88 },
          { name: 'TypeScript', proficiency: 88 },
          { name: 'Python', proficiency: 65 },
          { name: 'Go', proficiency: 45 },
        ],
      },
    ],

    // === 第二層：擴展專業技能 (距離中心4格) ===
    // 沿著六個主要方向繼續延伸
    ring2: [
      // ===== 前端領域擴展 (0度方向) =====

      // JavaScript 深入
      {
        id: 'javascript-advanced',
        name: 'JavaScript 進階',
        category: 'frontend',
        level: 5,
        status: 'mastered',
        coordinates: { q: 4, r: 0 }, // 0度方向繼續延伸
        prerequisites: ['html-css-foundation'],
        description: '現代JavaScript語言特性與應用',
        skills: [
          { name: 'ES6+ 特性', proficiency: 90 },
          { name: '非同步程式', proficiency: 88 },
          { name: '模組化開發', proficiency: 85 },
          { name: 'DOM操作', proficiency: 82 },
        ],
      },

      // 前端框架
      {
        id: 'frontend-frameworks',
        name: '前端框架',
        category: 'frontend',
        level: 4,
        status: 'available',
        coordinates: { q: 6, r: 0 },
        prerequisites: ['javascript-advanced'],
        description: '主流前端框架的應用',
        skills: [
          { name: 'Vue 3', proficiency: 75 },
          { name: 'Nuxt 3', proficiency: 70 },
          { name: 'React', proficiency: 40 },
          { name: '狀態管理', proficiency: 68 },
        ],
      },

      // 前端工具鏈
      {
        id: 'frontend-toolchain',
        name: '前端工具鏈',
        category: 'frontend',
        level: 4,
        status: 'available',
        coordinates: { q: 8, r: 0 },
        prerequisites: ['frontend-frameworks'],
        description: '現代前端開發工具與工程化',
        skills: [
          { name: 'Vite', proficiency: 78 },
          { name: '前端工程化', proficiency: 72 },
          { name: 'Webpack', proficiency: 60 },
          { name: 'Babel', proficiency: 55 },
        ],
      },

      // ===== 架構設計領域擴展 (60度方向) =====

      // 系統架構設計
      {
        id: 'system-architecture-design',
        name: '系統架構設計',
        category: 'architecture',
        level: 4,
        status: 'available',
        coordinates: { q: 4, r: -4 }, // 60度方向延伸，距離=8
        prerequisites: ['design-patterns-core'],
        description: '大型系統的架構設計與實現',
        skills: [
          { name: 'SaaS 平台架構', proficiency: 75 },
          { name: 'DDD 領域驅動', proficiency: 65 },
          { name: '分散式系統', proficiency: 62 },
          { name: 'Event Sourcing', proficiency: 45 },
        ],
      },

      // 效能與擴展性
      {
        id: 'performance-scalability-expert',
        name: '效能與擴展性',
        category: 'architecture',
        level: 4,
        status: 'available',
        coordinates: { q: 6, r: -6 }, // 60度方向繼續延伸，距離=12
        prerequisites: ['system-architecture-design'],
        description: '系統性能優化與擴展策略',
        skills: [
          { name: '快取架構', proficiency: 85 },
          { name: '高併發處理', proficiency: 80 },
          { name: 'API Gateway', proficiency: 78 },
          { name: '消息佇列', proficiency: 75 },
        ],
      },

      // 安全性架構
      {
        id: 'security-architecture-expert',
        name: '安全性架構',
        category: 'architecture',
        level: 4,
        status: 'available',
        coordinates: { q: 8, r: -8 }, // 60度方向深度延伸，距離=16
        prerequisites: ['performance-scalability-expert'],
        description: '系統安全架構設計與實現',
        skills: [
          { name: 'API 安全實踐', proficiency: 85 },
          { name: 'JWT 驗證', proficiency: 82 },
          { name: 'Schema 驗證', proficiency: 80 },
          { name: '限流策略', proficiency: 78 },
        ],
      },

      // ===== 資料庫領域擴展 (240度方向) =====

      // NoSQL資料庫
      {
        id: 'nosql-databases-expert',
        name: 'NoSQL 資料庫',
        category: 'database',
        level: 5,
        status: 'mastered',
        coordinates: { q: -4, r: 4 }, // 240度方向延伸，距離=8
        prerequisites: ['relational-databases-core'],
        description: '非關聯式數據庫的應用與優化',
        skills: [
          { name: 'Redis', proficiency: 90 },
          { name: 'MongoDB', proficiency: 85 },
          { name: '快取策略設計', proficiency: 88 },
          { name: 'Elasticsearch', proficiency: 45 },
        ],
      },

      // 資料庫優化
      {
        id: 'database-optimization-expert',
        name: '資料庫效能優化',
        category: 'database',
        level: 4,
        status: 'available',
        coordinates: { q: -6, r: 6 }, // 240度方向繼續延伸，距離=12
        prerequisites: ['nosql-databases-expert'],
        description: '數據庫查詢優化與性能調校',
        skills: [
          { name: '慢查詢優化', proficiency: 82 },
          { name: '索引策略設計', proficiency: 78 },
          { name: '查詢計劃分析', proficiency: 70 },
          { name: '分區表設計', proficiency: 50 },
        ],
      },

      // 進階資料庫設計
      {
        id: 'advanced-database-design',
        name: '進階資料庫設計',
        category: 'database',
        level: 3,
        status: 'learning',
        coordinates: { q: -8, r: 8 }, // 240度方向深度延伸，距離=16
        prerequisites: ['database-optimization-expert'],
        description: '企業級數據架構設計與優化',
        skills: [
          { name: '讀寫分離', proficiency: 70 },
          { name: '數據一致性', proficiency: 65 },
          { name: '數據庫分片', proficiency: 55 },
          { name: 'ER模型設計', proficiency: 60 },
        ],
      },

      // ===== DevOps領域擴展 (180度方向) =====

      // CI/CD管道
      {
        id: 'cicd-pipeline-expert',
        name: 'CI/CD 流水線',
        category: 'devops',
        level: 5,
        status: 'mastered',
        coordinates: { q: -4, r: 0 }, // 180度方向延伸
        prerequisites: ['version-control-systems'],
        description: '持續整合與持續部署流程設計',
        skills: [
          { name: 'GitLab CI/CD', proficiency: 88 },
          { name: 'AI Code Review 導入', proficiency: 85 },
          { name: 'GitHub Actions', proficiency: 80 },
          { name: '自動化部署流程', proficiency: 82 },
        ],
      },

      // 容器化技術
      {
        id: 'containerization-expert',
        name: '容器化技術',
        category: 'devops',
        level: 4,
        status: 'available',
        coordinates: { q: -6, r: 0 },
        prerequisites: ['cicd-pipeline-expert'],
        description: 'Docker容器與Kubernetes編排技術',
        skills: [
          { name: 'Docker', proficiency: 85 },
          { name: 'Docker Compose', proficiency: 82 },
          { name: 'K8s 概念與應用', proficiency: 60 },
          { name: '容器化部署', proficiency: 80 },
        ],
      },

      // 雲端平台
      {
        id: 'cloud-platforms-expert',
        name: '雲端平台',
        category: 'devops',
        level: 4,
        status: 'available',
        coordinates: { q: -8, r: 0 },
        prerequisites: ['containerization-expert'],
        description: '主要雲端服務平台的應用',
        skills: [
          { name: 'GCP 生態系', proficiency: 82 },
          { name: 'Cloud Run/Storage', proficiency: 85 },
          { name: 'AWS 基礎服務', proficiency: 60 },
          { name: '雲端監控與日誌', proficiency: 78 },
        ],
      },

      // ===== AI領域擴展 (120度方向) =====

      // 情境理解
      {
        id: 'contextual-understanding-expert',
        name: 'AI情境理解',
        category: 'ai',
        level: 4,
        status: 'learning',
        coordinates: { q: -2, r: -2 }, // 120度方向延伸
        prerequisites: ['prompt-engineering-core'],
        description: 'AI模型的上下文管理與應用',
        skills: [
          { name: '工作場景應用', proficiency: 80 },
          { name: '上下文管理', proficiency: 75 },
          { name: '模型選擇策略', proficiency: 72 },
          { name: '對話持續性', proficiency: 70 },
        ],
      },

      // AI工具平台
      {
        id: 'ai-tools-platforms',
        name: 'AI工具與平台',
        category: 'ai',
        level: 5,
        status: 'mastered',
        coordinates: { q: -1, r: -3 },
        prerequisites: ['prompt-engineering-core'],
        description: 'AI平台與工具的整合應用',
        skills: [
          { name: 'Dify AI Code Review', proficiency: 88 },
          { name: 'GPT/Claude/Gemini', proficiency: 85 },
          { name: 'n8n 工作流', proficiency: 78 },
          { name: 'AI系統整合', proficiency: 82 },
        ],
      },

      // 模型交互
      {
        id: 'model-interaction-expert',
        name: '模型交互專精',
        category: 'ai',
        level: 3,
        status: 'learning',
        coordinates: { q: -4, r: -4 },
        prerequisites: [
          'contextual-understanding-expert',
          'ai-tools-platforms',
        ],
        description: '與不同AI模型的深度交互技巧',
        skills: [
          { name: '效果評量', proficiency: 70 },
          { name: '模型評估', proficiency: 65 },
          { name: '多模型協作', proficiency: 60 },
          { name: '參數調優', proficiency: 50 },
        ],
      },

      // ===== 後端領域擴展 (300度方向) =====

      // Web框架進階
      {
        id: 'web-frameworks-advanced',
        name: 'Web 開發框架',
        category: 'backend',
        level: 4,
        status: 'mastered',
        coordinates: { q: 2, r: 2 }, // 300度方向延伸
        prerequisites: ['programming-languages'],
        description: '主流後端框架的實戰應用',
        skills: [
          { name: 'Express.js', proficiency: 90 },
          { name: 'Fastify', proficiency: 88 },
          { name: 'FastAPI', proficiency: 55 },
          { name: 'Django/DRF', proficiency: 50 },
        ],
      },

      // API 開發專精
      {
        id: 'api-development-expert',
        name: 'API 開發專精',
        category: 'backend',
        level: 5,
        status: 'mastered',
        coordinates: { q: 4, r: 4 },
        prerequisites: ['web-frameworks-advanced'],
        description: 'RESTful API和GraphQL設計最佳實務',
        skills: [
          { name: 'RESTful設計', proficiency: 90 },
          { name: 'API文檔', proficiency: 85 },
          { name: 'API Gateway', proficiency: 70 },
          { name: 'GraphQL', proficiency: 50 },
        ],
      },

      // 後端架構模式
      {
        id: 'backend-architecture-patterns',
        name: '後端架構模式',
        category: 'backend',
        level: 4,
        status: 'mastered',
        coordinates: { q: 6, r: 6 },
        prerequisites: ['api-development-expert'],
        description: '企業級後端架構設計模式',
        skills: [
          { name: '微服務架構', proficiency: 85 },
          { name: 'MVC架構', proficiency: 88 },
          { name: '中介軟體', proficiency: 85 },
          { name: '依賴注入', proficiency: 80 },
        ],
      },
    ],

    // === 第三層：專家級技能 (距離中心8格) ===
    // 每個方向的終極專家目標
    ring3: [
      // 0度 - 前端架構師
      {
        id: 'fullstack-architect-master',
        name: '全端架構師',
        category: 'frontend',
        level: 1,
        status: 'locked',
        coordinates: { q: 10, r: 0 }, // 0度方向終點
        prerequisites: ['frontend-toolchain'],
        description: '前後端一體化架構設計與技術領導',
        skills: [
          { name: '端到端架構', proficiency: 25 },
          { name: '用戶體驗架構', proficiency: 30 },
          { name: '前端技術領導', proficiency: 35 },
          { name: '產品技術融合', proficiency: 40 },
        ],
      },

      // 60度 - 系統架構師 (主要目標)
      {
        id: 'solution-architect-master',
        name: '解決方案架構師',
        category: 'architecture',
        level: 1,
        status: 'locked',
        coordinates: { q: 10, r: -10 }, // 60度方向終點，距離=20
        prerequisites: ['security-architecture-expert'],
        description: '企業級解決方案的架構設計與技術領導',
        skills: [
          { name: '技術戰略規劃', proficiency: 25 },
          { name: '架構評估審查', proficiency: 30 },
          { name: '團隊技術領導', proficiency: 45 },
          { name: '跨團隊協作', proficiency: 55 },
        ],
        careerGoal: '目標職位：Senior Solution Architect',
      },

      // 120度 - AI解決方案專家
      {
        id: 'ai-solutions-architect',
        name: 'AI解決方案專家',
        category: 'ai',
        level: 1,
        status: 'locked',
        coordinates: { q: -10, r: -10 }, // 120度方向終點，距離=20
        prerequisites: ['model-interaction-expert'],
        description: 'AI技術在企業級應用的架構設計專家',
        skills: [
          { name: 'AI產品設計', proficiency: 25 },
          { name: 'MLOps專家', proficiency: 20 },
          { name: 'AI倫理實踐', proficiency: 45 },
          { name: 'AI商業應用', proficiency: 35 },
        ],
      },

      // 180度 - DevOps架構師
      {
        id: 'devops-architect-master',
        name: 'DevOps架構師',
        category: 'devops',
        level: 1,
        status: 'locked',
        coordinates: { q: -10, r: 0 }, // 180度方向終點
        prerequisites: ['cloud-platforms-expert'],
        description: '雲原生架構與DevOps流程設計專家',
        skills: [
          { name: '雲原生架構', proficiency: 20 },
          { name: '平台工程', proficiency: 25 },
          { name: 'SRE實踐', proficiency: 30 },
          { name: '成本優化', proficiency: 40 },
        ],
      },

      // 240度 - 數據架構師
      {
        id: 'data-architect-master',
        name: '數據架構師',
        category: 'database',
        level: 1,
        status: 'locked',
        coordinates: { q: -10, r: 10 }, // 240度方向終點，距離=20
        prerequisites: ['advanced-database-design'],
        description: '企業數據架構設計與數據治理專家',
        skills: [
          { name: '數據倉庫設計', proficiency: 20 },
          { name: '大數據架構', proficiency: 25 },
          { name: '數據治理', proficiency: 30 },
          { name: '實時數據流', proficiency: 15 },
        ],
      },

      // 300度 - 資深後端架構師
      {
        id: 'senior-backend-architect',
        name: '資深後端架構師',
        category: 'backend',
        level: 1,
        status: 'locked',
        coordinates: { q: 10, r: 10 }, // 300度方向終點，距離=20
        prerequisites: ['backend-architecture-patterns'],
        description: '後端系統架構設計與技術指導專家',
        skills: [
          { name: '高併發系統', proficiency: 25 },
          { name: '性能調優專家', proficiency: 35 },
          { name: '技術團隊導師', proficiency: 50 },
          { name: '開源貢獻者', proficiency: 20 },
        ],
      },
    ],
  },

  // === 技能統計資訊 ===
  statistics: {
    totalNodes: 34, // 1中心 + 6(ring1) + 21(ring2) + 6(ring3)
    nodesByStatus: {
      mastered: 7, // 中心 + ring1 的主要技能
      available: 10, // ring2 的部分可用技能
      learning: 11, // ring2 的學習中技能
      locked: 6, // ring3 的專家級技能
    },
    nodesByCategory: {
      frontend: 4, // 0度方向：3(ring1&2) + 1(ring3)
      architecture: 4, // 60度方向：3(ring1&2) + 1(ring3)
      ai: 4, // 120度方向：3(ring1&2) + 1(ring3)
      devops: 4, // 180度方向：3(ring1&2) + 1(ring3)
      database: 4, // 240度方向：3(ring1&2) + 1(ring3)
      backend: 4, // 300度方向：3(ring1&2) + 1(ring3) + 中心點
    },
  },

  // 學習路徑建議
  learningPaths: {
    'backend-to-architect': {
      name: '後端到架構師路徑',
      description: '從後端工程師成長為系統架構師的建議學習順序',
      steps: [
        'backend-engineer-core',
        'programming-languages',
        'web-frameworks-advanced',
        'api-development-expert',
        'design-patterns-core',
        'system-architecture-design',
        'solution-architect-master',
      ],
      estimatedTimeMonths: 24,
    },

    'devops-integration': {
      name: 'DevOps 整合路徑',
      description: '加強 DevOps 技能的學習路徑',
      steps: [
        'version-control-systems',
        'cicd-pipeline-expert',
        'containerization-expert',
        'cloud-platforms-expert',
        'infrastructure-management',
        'devops-architect-master',
      ],
      estimatedTimeMonths: 18,
    },

    'ai-integration': {
      name: 'AI 應用專家路徑',
      description: 'AI技術整合與應用專精',
      steps: [
        'prompt-engineering-core',
        'ai-tools-platforms',
        'contextual-understanding-expert',
        'model-interaction-expert',
        'ethical-ai-expert',
        'ai-solutions-architect',
      ],
      estimatedTimeMonths: 15,
    },
  },

  // 技能評估標準
  proficiencyScale: {
    0: { name: '未接觸', description: '完全沒有經驗' },
    20: { name: '入門', description: '基本概念理解' },
    40: { name: '初級', description: '能完成簡單任務' },
    60: { name: '中級', description: '能獨立完成工作' },
    80: { name: '高級', description: '能處理複雜問題' },
    95: { name: '專家', description: '能指導他人並創新' },
  },

  // 視覺配置
  visual: {
    // 基本設置
    nodeSize: 30,
    gridSize: 20,

    // 視窗設置 (擴大以容納放射狀佈局)
    viewport: {
      width: 1600,
      height: 1200,
      centerX: 800,
      centerY: 600,
    },

    // 交互功能
    interaction: {
      enableDrag: true,
      enableZoom: true,
      enableNodeClick: true,
    },

    // 視覺效果
    effects: {
      showGrid: true,
      showConnections: true,
      animationDuration: 300,
    },

    // 響應式和無障礙
    accessibility: {
      responsive: true,
      animation: true,
      className: 'skill-tree-container',
    },

    // 調試模式
    debug: false,
  },
};

export default skillsDataConfig;
