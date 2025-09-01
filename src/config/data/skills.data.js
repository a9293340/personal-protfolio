/**
 * 技能數據配置
 * 
 * Config-Driven 技能樹結構和技能節點數據
 * 基於六角形座標系統的技能樹配置
 */

export const skillsDataConfig = {
  // 技能樹元數據
  metadata: {
    version: "1.0.0",
    lastUpdated: "2024-08-31",
    totalSkills: 45,
    maxLevel: 5,
    coordinateSystem: "hexagonal"
  },
  
  // 技能類別定義
  categories: {
    backend: {
      name: "後端開發",
      color: "var(--primary-blue)", 
      icon: "⚡",
      description: "服務器端開發與API設計"
    },
    architecture: {
      name: "系統架構",
      color: "var(--primary-gold)",
      icon: "🏗️", 
      description: "系統設計與架構規劃"
    },
    database: {
      name: "資料庫技術",
      color: "var(--bright-gold)",
      icon: "🗄️",
      description: "數據存儲與管理"
    },
    devops: {
      name: "DevOps",
      color: "var(--primary-green)",
      icon: "⚙️",
      description: "開發維運與自動化"
    },
    frontend: {
      name: "前端技術", 
      color: "var(--purple-500)",
      icon: "🎨",
      description: "用戶界面與體驗"
    },
    soft: {
      name: "軟技能",
      color: "var(--orange-500)", 
      icon: "🤝",
      description: "溝通協作與領導"
    }
  },
  
  // 技能樹結構 - 六角形座標系統
  tree: {
    // 中心技能節點
    center: {
      id: "backend-foundation",
      name: "後端開發基礎",
      category: "backend",
      level: 5,
      status: "mastered",
      coordinates: { q: 0, r: 0 },
      description: "紮實的後端開發基礎，包含程式語言、框架和基本概念",
      
      skills: [
        { name: "Python", proficiency: 90 },
        { name: "JavaScript/Node.js", proficiency: 85 },
        { name: "RESTful API", proficiency: 95 },
        { name: "MVC架構", proficiency: 90 }
      ],
      
      projects: ["personal-api", "blog-backend", "e-commerce-api"],
      learningResources: [
        { type: "book", title: "Effective Python" },
        { type: "course", title: "Node.js Complete Guide" }
      ]
    },
    
    // 第一層技能節點 (距離中心1格)
    ring1: [
      {
        id: "web-frameworks",
        name: "Web 框架",
        category: "backend", 
        level: 4,
        status: "mastered",
        coordinates: { q: 1, r: 0 },
        prerequisites: ["backend-foundation"],
        
        description: "主流Web框架的深度應用",
        skills: [
          { name: "Django", proficiency: 85 },
          { name: "FastAPI", proficiency: 80 },
          { name: "Express.js", proficiency: 78 },
          { name: "Flask", proficiency: 70 }
        ]
      },
      
      {
        id: "database-fundamentals",
        name: "資料庫基礎",
        category: "database",
        level: 4, 
        status: "mastered",
        coordinates: { q: 0, r: 1 },
        prerequisites: ["backend-foundation"],
        
        description: "關聯式與非關聯式資料庫技術",
        skills: [
          { name: "PostgreSQL", proficiency: 88 },
          { name: "MySQL", proficiency: 82 },
          { name: "MongoDB", proficiency: 75 },
          { name: "Redis", proficiency: 80 }
        ]
      },
      
      {
        id: "api-design",
        name: "API 設計",
        category: "backend",
        level: 4,
        status: "mastered", 
        coordinates: { q: -1, r: 1 },
        prerequisites: ["backend-foundation"],
        
        description: "RESTful API 和 GraphQL 設計最佳實務",
        skills: [
          { name: "RESTful設計", proficiency: 92 },
          { name: "GraphQL", proficiency: 70 },
          { name: "API文档", proficiency: 85 },
          { name: "版本控制", proficiency: 80 }
        ]
      },
      
      {
        id: "testing-fundamentals",
        name: "測試基礎",
        category: "backend",
        level: 3,
        status: "available",
        coordinates: { q: -1, r: 0 },
        prerequisites: ["backend-foundation"],
        
        description: "單元測試、整合測試與測試驅動開發",
        skills: [
          { name: "Unit Testing", proficiency: 75 },
          { name: "Integration Testing", proficiency: 68 },
          { name: "TDD", proficiency: 60 },
          { name: "測試覆蓋率", proficiency: 70 }
        ]
      },
      
      {
        id: "version-control",
        name: "版本控制",
        category: "devops", 
        level: 5,
        status: "mastered",
        coordinates: { q: -1, r: -1 },
        prerequisites: ["backend-foundation"],
        
        description: "Git 工作流程與協作開發",
        skills: [
          { name: "Git", proficiency: 92 },
          { name: "GitHub", proficiency: 90 },
          { name: "GitLab", proficiency: 78 },
          { name: "代碼審查", proficiency: 85 }
        ]
      },
      
      {
        id: "linux-basics",
        name: "Linux 基礎",
        category: "devops",
        level: 4,
        status: "mastered",
        coordinates: { q: 0, r: -1 },
        prerequisites: ["backend-foundation"],
        
        description: "Linux 系統管理與命令列操作",
        skills: [
          { name: "Bash Scripting", proficiency: 80 },
          { name: "系統管理", proficiency: 75 },
          { name: "檔案權限", proficiency: 85 },
          { name: "程序管理", proficiency: 78 }
        ]
      }
    ],
    
    // 第二層技能節點 (距離中心2格)  
    ring2: [
      {
        id: "microservices",
        name: "微服務架構",
        category: "architecture",
        level: 3,
        status: "available", 
        coordinates: { q: 2, r: 0 },
        prerequisites: ["web-frameworks", "api-design"],
        
        description: "微服務設計模式與實作",
        skills: [
          { name: "服務拆分", proficiency: 72 },
          { name: "服務通訊", proficiency: 68 },
          { name: "服務發現", proficiency: 60 },
          { name: "分散式追蹤", proficiency: 55 }
        ]
      },
      
      {
        id: "database-optimization",
        name: "資料庫優化",
        category: "database",
        level: 3,
        status: "available",
        coordinates: { q: 1, r: 1 },
        prerequisites: ["database-fundamentals"],
        
        description: "數據庫效能調優與索引設計",
        skills: [
          { name: "查詢優化", proficiency: 75 },
          { name: "索引設計", proficiency: 78 },
          { name: "效能監控", proficiency: 70 },
          { name: "分片策略", proficiency: 55 }
        ]
      },
      
      {
        id: "caching-strategies",
        name: "快取策略",
        category: "architecture",
        level: 3,
        status: "learning",
        coordinates: { q: -1, r: 2 },
        prerequisites: ["database-fundamentals"],
        
        description: "快取設計模式與實作策略", 
        skills: [
          { name: "Redis高級", proficiency: 70 },
          { name: "Memcached", proficiency: 45 },
          { name: "CDN", proficiency: 60 },
          { name: "快取淘汰", proficiency: 65 }
        ]
      },
      
      {
        id: "security-fundamentals", 
        name: "安全基礎",
        category: "backend",
        level: 2,
        status: "locked",
        coordinates: { q: -2, r: 1 },
        prerequisites: ["api-design", "testing-fundamentals"],
        
        description: "Web 應用程式安全與防護",
        skills: [
          { name: "身份認證", proficiency: 40 },
          { name: "授權機制", proficiency: 35 },
          { name: "HTTPS/TLS", proficiency: 50 },
          { name: "OWASP Top 10", proficiency: 30 }
        ]
      },
      
      {
        id: "ci-cd-pipeline",
        name: "CI/CD 流水線", 
        category: "devops",
        level: 3,
        status: "available",
        coordinates: { q: -2, r: 0 },
        prerequisites: ["version-control", "testing-fundamentals"],
        
        description: "持續整合與持續部署",
        skills: [
          { name: "Jenkins", proficiency: 65 },
          { name: "GitLab CI", proficiency: 70 },
          { name: "GitHub Actions", proficiency: 75 },
          { name: "部署策略", proficiency: 68 }
        ]
      },
      
      {
        id: "containerization",
        name: "容器化技術",
        category: "devops", 
        level: 3,
        status: "learning",
        coordinates: { q: -2, r: -1 },
        prerequisites: ["linux-basics"],
        
        description: "Docker 與容器編排技術",
        skills: [
          { name: "Docker", proficiency: 72 },
          { name: "Docker Compose", proficiency: 68 },
          { name: "Kubernetes", proficiency: 45 },
          { name: "容器優化", proficiency: 55 }
        ]
      },
      
      {
        id: "monitoring-logging",
        name: "監控與日誌",
        category: "devops",
        level: 2, 
        status: "locked",
        coordinates: { q: -1, r: -2 },
        prerequisites: ["linux-basics"],
        
        description: "系統監控、日誌管理與警報",
        skills: [
          { name: "ELK Stack", proficiency: 35 },
          { name: "Prometheus", proficiency: 30 },
          { name: "Grafana", proficiency: 25 },
          { name: "APM", proficiency: 20 }
        ]
      },
      
      {
        id: "cloud-platforms",
        name: "雲端平台",
        category: "devops",
        level: 3,
        status: "available",
        coordinates: { q: 0, r: -2 },
        prerequisites: ["linux-basics", "containerization"],
        
        description: "AWS、GCP、Azure 雲端服務",
        skills: [
          { name: "AWS", proficiency: 70 },
          { name: "GCP", proficiency: 60 },
          { name: "Azure", proficiency: 45 },
          { name: "Serverless", proficiency: 50 }
        ]
      }
    ],
    
    // 第三層技能節點 (距離中心3格) - 高級技能
    ring3: [
      {
        id: "system-design",
        name: "系統設計",
        category: "architecture",
        level: 2,
        status: "locked", 
        coordinates: { q: 3, r: 0 },
        prerequisites: ["microservices", "caching-strategies"],
        
        description: "大型分散式系統設計",
        skills: [
          { name: "架構模式", proficiency: 25 },
          { name: "可擴展性", proficiency: 30 },
          { name: "一致性理論", proficiency: 20 },
          { name: "系統權衡", proficiency: 15 }
        ]
      },
      
      {
        id: "event-driven-architecture",
        name: "事件驅動架構",
        category: "architecture",
        level: 1,
        status: "locked",
        coordinates: { q: 2, r: 1 },
        prerequisites: ["microservices"],
        
        description: "事件流處理與訊息佇列",
        skills: [
          { name: "Apache Kafka", proficiency: 10 },
          { name: "RabbitMQ", proficiency: 15 },
          { name: "Event Sourcing", proficiency: 5 },
          { name: "CQRS", proficiency: 8 }
        ]
      },
      
      {
        id: "advanced-databases",
        name: "進階資料庫",
        category: "database", 
        level: 1,
        status: "locked",
        coordinates: { q: 1, r: 2 },
        prerequisites: ["database-optimization"],
        
        description: "分散式資料庫與NewSQL",
        skills: [
          { name: "分散式DB", proficiency: 5 },
          { name: "Time Series DB", proficiency: 12 },
          { name: "Graph Database", proficiency: 8 },
          { name: "NewSQL", proficiency: 3 }
        ]
      }
    ]
  },
  
  // 學習路徑建議
  learningPaths: {
    "backend-to-architect": {
      name: "後端到架構師路徑",
      description: "從後端工程師成長為系統架構師的建議學習順序",
      steps: [
        "backend-foundation",
        "web-frameworks", 
        "database-fundamentals",
        "api-design",
        "microservices",
        "caching-strategies",
        "system-design"
      ],
      estimatedTimeMonths: 18
    },
    
    "devops-integration": {
      name: "DevOps 整合路徑", 
      description: "加強 DevOps 技能的學習路徑",
      steps: [
        "version-control",
        "linux-basics",
        "ci-cd-pipeline", 
        "containerization",
        "cloud-platforms",
        "monitoring-logging"
      ],
      estimatedTimeMonths: 12
    }
  },
  
  // 技能評估標準
  proficiencyLevels: {
    0: { name: "未接觸", description: "完全沒有經驗" },
    1: { name: "初學者", description: "基本概念理解" },
    20: { name: "入門", description: "能完成簡單任務" },
    40: { name: "進階", description: "能獨立完成工作" },
    60: { name: "熟練", description: "能處理複雜問題" },
    80: { name: "專家", description: "能指導他人" },
    95: { name: "大師", description: "業界認可的專家" }
  }
};

export default skillsDataConfig;