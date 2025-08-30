# Config-Driven 系統配置範例

## 1. 配置文件範例完整指南

### 1.1 全站配置 (site.config.js)

```javascript
// src/config/site.config.js
export default {
  // 網站基本資訊
  meta: {
    title: "遊戲化個人作品集",
    description: "融合流亡黯道與遊戲王風格的創新個人網站",
    author: "Your Name",
    url: "https://yourdomain.com",
    language: "zh-TW",
    charset: "UTF-8"
  },

  // 路由配置
  routes: {
    "/": "home",
    "/about": "about",
    "/skills": "skills",
    "/portfolio": "portfolio",
    "/projects": "projects",
    "/contact": "contact",
    "/404": "notFound"
  },

  // 全站導航
  navigation: {
    main: [
      {
        id: "home",
        label: "首頁",
        icon: "home",
        path: "/",
        hotkey: "h"
      },
      {
        id: "about",
        label: "關於我",
        icon: "user",
        path: "/about",
        hotkey: "a"
      },
      {
        id: "skills",
        label: "技能樹",
        icon: "tree",
        path: "/skills",
        hotkey: "s"
      },
      {
        id: "portfolio",
        label: "工作產值",
        icon: "briefcase",
        path: "/portfolio",
        hotkey: "p"
      },
      {
        id: "projects",
        label: "個人專案",
        icon: "cards",
        path: "/projects",
        hotkey: "j"
      },
      {
        id: "contact",
        label: "聯絡方式",
        icon: "envelope",
        path: "/contact",
        hotkey: "c"
      }
    ]
  },

  // 全站設定
  settings: {
    // 動畫設定
    animations: {
      enabled: true,
      reducedMotion: false,
      defaultDuration: 300,
      defaultEasing: "ease-out"
    },

    // 音效設定
    audio: {
      enabled: true,
      volume: 0.3,
      soundFiles: {
        welcome: "/assets/sounds/welcome.mp3",
        hover: "/assets/sounds/hover.mp3",
        click: "/assets/sounds/click.mp3",
        cardFlip: "/assets/sounds/card-flip.mp3",
        levelUp: "/assets/sounds/level-up.mp3",
        error: "/assets/sounds/error.mp3"
      }
    },

    // 視覺效果設定
    effects: {
      particles: {
        enabled: true,
        count: 50,
        followCursor: true
      },
      
      backgroundVideo: {
        enabled: false,
        src: "/assets/videos/background.mp4"
      },

      lighting: {
        enabled: true,
        ambientIntensity: 0.4,
        pointLights: true
      }
    }
  },

  // 分析與追蹤
  analytics: {
    googleAnalytics: process.env.GA_TRACKING_ID,
    hotjar: process.env.HOTJAR_ID,
    
    events: {
      pageView: true,
      skillTreeInteraction: true,
      cardHover: true,
      projectView: true
    }
  },

  // 社群分享
  socialShare: {
    platforms: ["twitter", "facebook", "linkedin"],
    defaultTitle: "查看我的遊戲化作品集",
    defaultDescription: "體驗創新的互動式個人網站設計"
  }
};
```

### 1.2 個人資料配置 (data/personal.config.js)

```javascript
// src/config/data/personal.config.js
export default {
  // 基本資料
  basic: {
    name: "張三",
    englishName: "John Chang",
    title: "Senior Backend Engineer → Solution Architect",
    subtitle: "Crafting scalable systems with AI integration",
    avatar: "/assets/images/avatar.jpg",
    location: "台北, 台灣",
    timezone: "Asia/Taipei",
    languages: ["繁體中文", "English"],
    
    // 聯絡資訊
    contact: {
      email: "john.chang@example.com",
      phone: "+886-912-345-678",
      website: "https://johnchang.dev"
    }
  },

  // 職業發展軌跡
  career: {
    current: {
      position: "Senior Backend Engineer",
      company: "Tech Innovation Co.",
      level: 5,
      experience: "6+ 年",
      nextGoal: "Solution Architect"
    },

    // RPG 角色屬性
    attributes: {
      technicalSkills: {
        value: 85,
        description: "後端技術與架構設計能力"
      },
      architectureThinking: {
        value: 78,
        description: "系統架構思維與設計模式"
      },
      teamCollaboration: {
        value: 82,
        description: "團隊協作與溝通能力"
      },
      problemSolving: {
        value: 88,
        description: "問題分析與解決能力"
      },
      aiIntegration: {
        value: 75,
        description: "AI 技術整合與應用"
      },
      leadership: {
        value: 70,
        description: "技術領導與指導能力"
      }
    },

    // 職涯時間軸
    timeline: [
      {
        id: "career-start",
        period: "2018-2019",
        position: "Junior Developer",
        company: "StartupTech",
        type: "first-job",
        achievements: [
          "完成 10+ 個網站開發專案",
          "學習現代前後端技術棧",
          "建立良好的程式設計基礎"
        ],
        skills: ["HTML/CSS", "JavaScript", "PHP", "MySQL"]
      },
      
      {
        id: "backend-focus",
        period: "2019-2021", 
        position: "Backend Developer",
        company: "MidTech Solutions",
        type: "growth",
        achievements: [
          "主導微服務架構遷移專案",
          "系統性能提升 300%",
          "建立 CI/CD 自動化部署流程"
        ],
        skills: ["Java", "Spring Boot", "Docker", "Kubernetes", "AWS"]
      },

      {
        id: "senior-role",
        period: "2021-2023",
        position: "Senior Backend Engineer", 
        company: "Enterprise Corp",
        type: "expertise",
        achievements: [
          "設計高併發交易系統",
          "處理每日千萬級請求量",
          "指導 3 位 junior 開發者成長"
        ],
        skills: ["System Design", "Redis", "Kafka", "Microservices"]
      },

      {
        id: "ai-integration",
        period: "2023-現在",
        position: "Senior Backend Engineer (AI Focus)",
        company: "Tech Innovation Co.",
        type: "current",
        achievements: [
          "整合 LLM 到企業級應用",
          "建立 AI 驅動的智慧客服系統",
          "開發 Prompt Engineering 最佳實務"
        ],
        skills: ["OpenAI API", "LangChain", "Vector Database", "RAG"]
      },

      {
        id: "future-architect",
        period: "2024 目標",
        position: "Solution Architect",
        company: "目標職位",
        type: "goal",
        objectives: [
          "主導企業級架構設計",
          "建立技術標準與最佳實務",
          "培養下一代技術領導者"
        ],
        skills: ["Enterprise Architecture", "Team Leadership", "Strategic Thinking"]
      }
    ]
  },

  // 成就與徽章
  achievements: [
    {
      id: "first-production",
      name: "首次上線",
      description: "成功部署第一個生產環境系統",
      icon: "rocket",
      unlockedAt: "2018-08",
      rarity: "common"
    },
    
    {
      id: "performance-master",
      name: "效能優化大師",
      description: "將系統回應時間優化超過 50%",
      icon: "tachometer-alt",
      unlockedAt: "2020-03",
      rarity: "rare"
    },
    
    {
      id: "microservices-architect",
      name: "微服務架構師",
      description: "成功設計並實施微服務架構",
      icon: "sitemap",
      unlockedAt: "2021-09",
      rarity: "epic"
    },
    
    {
      id: "ai-pioneer",
      name: "AI 應用先驅",
      description: "率先將 LLM 整合到企業應用",
      icon: "robot",
      unlockedAt: "2023-06",
      rarity: "legendary"
    }
  ],

  // 個人特質
  personality: {
    traits: [
      "喜歡解決複雜的技術挑戰",
      "重視代碼品質與系統穩定性", 
      "熱衷學習新技術與趨勢",
      "享受團隊協作與知識分享",
      "對 AI 技術充滿好奇與熱情"
    ],
    
    workStyle: {
      approach: "結合理論基礎與實務經驗",
      philosophy: "追求技術卓越，注重用戶體驗",
      communication: "清晰表達技術概念，善於聆聽需求"
    }
  },

  // 興趣愛好
  interests: {
    technical: [
      "系統架構設計",
      "AI/ML 技術研究", 
      "開源專案貢獻",
      "技術文章撰寫"
    ],
    
    personal: [
      "策略遊戲", 
      "科幻小說閱讀",
      "健身運動",
      "攝影"
    ]
  }
};
```

### 1.3 技能樹完整配置 (data/skills.data.js)

```javascript
// src/config/data/skills.data.js
export default {
  // 技能樹視覺配置
  treeConfig: {
    center: { x: 0, y: 0 },
    hexSize: 40,
    connectionStyle: "golden",
    zoomLevels: {
      min: 0.3,
      max: 2.0,
      default: 1.0
    },
    
    viewport: {
      width: "100%",
      height: "100vh",
      background: "radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%)"
    }
  },

  // 技能節點定義
  nodes: [
    // 中央核心節點
    {
      id: "backend-foundation",
      position: { q: 0, r: 0 },
      type: "keystone",
      name: "後端開發基礎",
      shortName: "後端核心",
      description: "後端開發的核心知識與基礎技能",
      status: "mastered",
      icon: "server",
      
      // 連接的子節點
      children: [
        "programming-languages",
        "database-fundamentals", 
        "api-design",
        "version-control"
      ],

      // 詳細資訊
      details: {
        masteredAt: "2018-12",
        proficiency: 95,
        experience: "6+ 年",
        
        keySkills: [
          "伺服器端程式設計",
          "資料庫操作",
          "API 設計與實作",
          "系統架構理解"
        ],
        
        projects: ["project-1", "project-2", "project-3"],
        certifications: [],
        
        learningResources: [
          {
            type: "book",
            title: "Clean Code",
            author: "Robert C. Martin"
          },
          {
            type: "course", 
            title: "Backend Development Fundamentals",
            platform: "Coursera"
          }
        ]
      }
    },

    // 程式語言分支
    {
      id: "programming-languages",
      position: { q: -1, r: 0 },
      type: "notable",
      name: "程式語言精通",
      shortName: "程式語言",
      description: "掌握多種程式語言的語法與應用",
      status: "mastered",
      icon: "code",
      prerequisites: ["backend-foundation"],
      children: ["java-mastery", "python-proficiency", "javascript-skills"],
      
      details: {
        masteredAt: "2019-06",
        proficiency: 88,
        
        languages: [
          {
            name: "Java",
            proficiency: 95,
            experience: "5+ 年",
            version: "Java 17",
            frameworks: ["Spring Boot", "Spring Cloud", "Hibernate"]
          },
          {
            name: "Python", 
            proficiency: 82,
            experience: "3+ 年",
            version: "Python 3.11",
            frameworks: ["FastAPI", "Django", "Pandas"]
          },
          {
            name: "JavaScript/TypeScript",
            proficiency: 78,
            experience: "4+ 年", 
            version: "ES2022",
            frameworks: ["Node.js", "Express", "NestJS"]
          },
          {
            name: "Go",
            proficiency: 65,
            experience: "1+ 年",
            version: "Go 1.21",
            status: "learning"
          }
        ]
      }
    },

    // Java 專精節點
    {
      id: "java-mastery",
      position: { q: -2, r: -1 },
      type: "normal",
      name: "Java 企業開發",
      description: "Java 企業級應用開發專家",
      status: "mastered",
      icon: "java",
      prerequisites: ["programming-languages"],
      children: ["spring-ecosystem", "jvm-optimization"],
      
      details: {
        proficiency: 95,
        specializations: [
          "Spring Boot 微服務開發",
          "JPA/Hibernate ORM",
          "Maven/Gradle 建構工具",
          "JUnit 單元測試",
          "JVM 性能調優"
        ],
        
        majorProjects: [
          {
            name: "電商微服務平台",
            description: "使用 Spring Boot 重構單體電商應用",
            techStack: ["Java 11", "Spring Boot", "Spring Cloud", "MySQL"],
            impact: "處理效能提升 40%，部署時間縮短 80%"
          }
        ]
      }
    },

    // 資料庫技能分支
    {
      id: "database-fundamentals", 
      position: { q: 0, r: -1 },
      type: "notable",
      name: "資料庫設計與管理",
      shortName: "資料庫",
      description: "關聯式與非關聯式資料庫的設計與優化",
      status: "mastered",
      icon: "database",
      prerequisites: ["backend-foundation"],
      children: ["sql-mastery", "nosql-proficiency", "database-optimization"],
      
      details: {
        proficiency: 90,
        technologies: [
          {
            category: "關聯式資料庫",
            items: ["MySQL", "PostgreSQL", "Oracle"],
            proficiency: 92
          },
          {
            category: "NoSQL 資料庫", 
            items: ["MongoDB", "Redis", "Elasticsearch"],
            proficiency: 85
          },
          {
            category: "資料倉儲",
            items: ["Apache Spark", "Hadoop", "ClickHouse"],
            proficiency: 70
          }
        ],
        
        specialSkills: [
          "資料庫架構設計",
          "查詢性能優化",
          "索引策略規劃",
          "資料遷移與同步",
          "備份與災難恢復"
        ]
      }
    },

    // 系統架構分支 - 右上方向發展
    {
      id: "system-architecture",
      position: { q: 1, r: -1 },
      type: "keystone",
      name: "系統架構設計",
      shortName: "系統架構",
      description: "大型分散式系統的架構設計與實施",
      status: "learning",
      icon: "sitemap",
      prerequisites: ["backend-foundation", "database-fundamentals"],
      children: ["microservices-design", "distributed-systems", "scalability-patterns"],
      
      details: {
        proficiency: 78,
        currentFocus: "微服務架構與雲原生應用",
        
        architecturePatterns: [
          {
            pattern: "微服務架構 (Microservices)",
            proficiency: 85,
            experience: "2+ 年實戰經驗",
            projects: ["電商平台重構", "支付系統分離"]
          },
          {
            pattern: "事件驅動架構 (Event-Driven)",
            proficiency: 75,
            experience: "1+ 年",
            projects: ["訂單處理系統", "庫存管理系統"]
          },
          {
            pattern: "CQRS + Event Sourcing",
            proficiency: 65,
            experience: "學習中",
            projects: ["審計日誌系統"]
          }
        ],
        
        designPrinciples: [
          "單一職責原則",
          "開閉原則",
          "依賴倒置原則",
          "介面隔離原則",
          "DDD 領域驅動設計"
        ]
      }
    },

    // 雲端技術分支 - 右方發展
    {
      id: "cloud-technologies",
      position: { q: 2, r: 0 },
      type: "notable", 
      name: "雲端架構與 DevOps",
      shortName: "雲端技術",
      description: "雲端服務整合與 DevOps 實踐",
      status: "proficient",
      icon: "cloud",
      prerequisites: ["system-architecture"],
      children: ["aws-services", "containerization", "cicd-pipeline"],
      
      details: {
        proficiency: 82,
        cloudPlatforms: [
          {
            platform: "Amazon Web Services (AWS)",
            proficiency: 85,
            certifications: ["AWS Solutions Architect Associate"],
            services: [
              "EC2, ECS, EKS",
              "RDS, DynamoDB",
              "Lambda, API Gateway", 
              "S3, CloudFront",
              "VPC, Route 53"
            ]
          },
          {
            platform: "Google Cloud Platform (GCP)",
            proficiency: 70,
            services: ["Compute Engine", "Cloud Storage", "BigQuery"]
          }
        ],
        
        devOpsTools: [
          {
            category: "容器化",
            tools: ["Docker", "Kubernetes", "Helm"],
            proficiency: 88
          },
          {
            category: "CI/CD",
            tools: ["Jenkins", "GitLab CI", "GitHub Actions"],
            proficiency: 85
          },
          {
            category: "監控",
            tools: ["Prometheus", "Grafana", "ELK Stack"],
            proficiency: 80
          }
        ]
      }
    },

    // AI/ML 工程分支 - 左上方向發展
    {
      id: "ai-ml-engineering",
      position: { q: -1, r: -1 },
      type: "keystone",
      name: "AI/ML 工程應用",
      shortName: "AI 工程",
      description: "人工智慧與機器學習的工程化應用",
      status: "learning",
      icon: "robot",
      prerequisites: ["programming-languages"],
      children: ["llm-development", "prompt-engineering", "ai-integration"],
      
      details: {
        proficiency: 75,
        focusAreas: [
          "大型語言模型 (LLM) 應用開發",
          "Prompt Engineering 最佳實踐", 
          "RAG (Retrieval-Augmented Generation)",
          "AI Agent 開發框架",
          "MLOps 流程建立"
        ],
        
        technologies: [
          {
            category: "LLM 平台",
            items: ["OpenAI GPT", "Claude", "Gemini"],
            proficiency: 85
          },
          {
            category: "開發框架",
            items: ["LangChain", "LlamaIndex", "Semantic Kernel"],
            proficiency: 80
          },
          {
            category: "向量資料庫",
            items: ["Pinecone", "Weaviate", "Chroma"],
            proficiency: 75
          }
        ],
        
        currentProjects: [
          {
            name: "企業智慧客服系統",
            description: "整合 GPT-4 的多輪對話客服機器人",
            status: "進行中",
            techStack: ["OpenAI API", "LangChain", "FastAPI", "Redis"]
          }
        ]
      }
    },

    // LLM 開發專精
    {
      id: "llm-development",
      position: { q: -2, r: -2 },
      type: "normal",
      name: "LLM 應用開發",
      description: "大型語言模型的企業級應用開發",
      status: "proficient",
      icon: "brain",
      prerequisites: ["ai-ml-engineering"],
      children: ["rag-systems", "ai-agents"],
      
      details: {
        proficiency: 82,
        specializations: [
          "多輪對話系統設計",
          "上下文管理與記憶",
          "Prompt 模板設計",
          "輸出格式控制",
          "成本優化策略"
        ],
        
        bestPractices: [
          "設計有效的 Prompt 策略",
          "實作錯誤處理與重試機制",
          "建立評估與監控指標",
          "優化 API 調用成本",
          "確保輸出內容安全性"
        ]
      }
    },

    // 技術領導力分支 - 中心向外環繞
    {
      id: "technical-leadership",
      position: { q: 0, r: 1 },
      type: "keystone",
      name: "技術領導力",
      shortName: "技術領導",
      description: "技術團隊領導與架構決策能力",
      status: "developing",
      icon: "users",
      prerequisites: ["system-architecture", "ai-ml-engineering"],
      children: ["team-mentoring", "architecture-decisions", "tech-strategy"],
      
      details: {
        proficiency: 70,
        developingSkills: [
          "技術決策制定",
          "架構評估與選型", 
          "團隊技術指導",
          "跨部門溝通協調",
          "技術債務管理"
        ],
        
        leadershipExperience: [
          {
            role: "技術導師",
            scope: "指導 3 位 Junior 開發者",
            achievements: [
              "協助團隊成員技術成長",
              "建立代碼審查機制",
              "制定開發規範標準"
            ]
          },
          {
            role: "架構決策參與者",
            scope: "參與重要技術決策討論",
            contributions: [
              "微服務拆分策略建議",
              "技術選型分析報告",
              "性能優化方案設計"
            ]
          }
        ],
        
        futureGoals: [
          "成為 Solution Architect",
          "建立技術標準與最佳實踐",
          "培養下一代技術領導者"
        ]
      }
    }
  ],

  // 技能分支定義
  branches: [
    {
      id: "backend-mastery",
      name: "後端技術精通",
      description: "從初級到資深的後端開發技能路線",
      color: "#d4af37",
      nodes: [
        "backend-foundation",
        "programming-languages", 
        "database-fundamentals",
        "api-design",
        "java-mastery"
      ]
    },
    
    {
      id: "architecture-track",
      name: "系統架構師軌跡", 
      description: "系統架構設計與大型分散式系統",
      color: "#3498db",
      nodes: [
        "system-architecture",
        "microservices-design",
        "distributed-systems",
        "scalability-patterns",
        "performance-optimization"
      ]
    },
    
    {
      id: "cloud-native",
      name: "雲原生應用開發",
      description: "雲端技術與 DevOps 實踐路線",
      color: "#2ecc71", 
      nodes: [
        "cloud-technologies",
        "containerization",
        "kubernetes-orchestration", 
        "cicd-pipeline",
        "monitoring-observability"
      ]
    },
    
    {
      id: "ai-engineering",
      name: "AI 工程師軌跡",
      description: "人工智慧技術的工程化應用",
      color: "#9b59b6",
      nodes: [
        "ai-ml-engineering",
        "llm-development", 
        "prompt-engineering",
        "rag-systems",
        "ai-agents"
      ]
    },
    
    {
      id: "leadership-path",
      name: "技術領導發展",
      description: "從個人貢獻者到技術領導者",
      color: "#e67e22",
      nodes: [
        "technical-leadership",
        "team-mentoring",
        "architecture-decisions",
        "tech-strategy",
        "solution-architect"
      ]
    }
  ],

  // 學習路線推薦
  learningPaths: {
    "junior-to-senior": {
      name: "初級到資深後端工程師",
      description: "適合有 1-3 年經驗的開發者",
      estimatedTime: "2-3 年",
      difficulty: "中級",
      
      milestones: [
        {
          phase: "基礎鞏固",
          duration: "6-12 個月", 
          skills: ["programming-languages", "database-fundamentals", "api-design"],
          projects: ["建立個人專案組合", "參與開源專案"]
        },
        {
          phase: "架構理解",
          duration: "6-12 個月",
          skills: ["system-architecture", "microservices-design"],
          projects: ["重構既有專案", "設計小型分散式系統"]
        },
        {
          phase: "雲端整合",
          duration: "6-12 個月", 
          skills: ["cloud-technologies", "containerization"],
          projects: ["部署雲端應用", "建立 CI/CD 流程"]
        }
      ]
    },
    
    "senior-to-architect": {
      name: "資深工程師到解決方案架構師",
      description: "適合有 5+ 年經驗的資深開發者",
      estimatedTime: "2-4 年",
      difficulty: "高級",
      
      milestones: [
        {
          phase: "深度架構",
          duration: "12-18 個月",
          skills: ["distributed-systems", "scalability-patterns"],
          projects: ["設計高可用系統", "處理大規模併發"]
        },
        {
          phase: "AI 整合",
          duration: "6-12 個月",
          skills: ["ai-ml-engineering", "llm-development"],
          projects: ["整合 AI 功能", "建立智慧系統"]
        },
        {
          phase: "領導力",
          duration: "12-24 個月",
          skills: ["technical-leadership", "architecture-decisions"],
          projects: ["帶領架構變革", "指導技術團隊"]
        }
      ]
    }
  },

  // 技能評估標準
  proficiencyLevels: {
    beginner: {
      name: "初學者",
      range: [0, 30],
      color: "#95a5a6",
      description: "剛開始學習，了解基本概念",
      criteria: [
        "了解基本概念和術語",
        "能在指導下完成簡單任務",
        "需要大量學習和練習"
      ]
    },
    
    intermediate: {
      name: "中級",
      range: [31, 60], 
      color: "#3498db",
      description: "能夠獨立完成中等複雜度的任務",
      criteria: [
        "掌握核心概念和技能",
        "能獨立解決常見問題",
        "開始理解最佳實踐"
      ]
    },
    
    advanced: {
      name: "高級", 
      range: [61, 85],
      color: "#f39c12",
      description: "在該領域有深入理解和豐富經驗",
      criteria: [
        "深入理解原理和架構",
        "能解決複雜技術問題", 
        "能指導他人學習"
      ]
    },
    
    expert: {
      name: "專家",
      range: [86, 100],
      color: "#d4af37", 
      description: "該領域的權威專家",
      criteria: [
        "對技術有深刻洞察",
        "能設計創新解決方案",
        "被業界認可為專家"
      ]
    }
  }
};
```

### 1.4 專案展示配置範例

```javascript
// src/config/pages/portfolio.config.js
export default {
  meta: {
    title: "工作產值展示 - 專業項目作品集",
    description: "展示我在職業生涯中參與的重要專案與技術成果",
    keywords: ["專案作品集", "系統架構", "後端開發", "微服務"]
  },

  layout: {
    type: "container",
    maxWidth: "1400px", 
    backgroundType: "gradient",
    padding: "2rem"
  },

  sections: [
    {
      id: "portfolio-header",
      type: "section-header",
      order: 1,
      config: {
        animation: "fadeInUp",
        delay: 0
      },
      content: {
        title: "工作產值展示",
        subtitle: "professional projects & achievements",
        description: "在職業生涯中參與設計與開發的重要專案，展現系統架構與技術實力"
      }
    },

    {
      id: "project-filter",
      type: "filter-tabs", 
      order: 2,
      config: {
        style: "gaming",
        defaultFilter: "all"
      },
      content: {
        filters: [
          { id: "all", label: "全部專案", icon: "th" },
          { id: "system-architecture", label: "系統架構", icon: "sitemap" },
          { id: "backend-development", label: "後端開發", icon: "server" },
          { id: "ai-integration", label: "AI 整合", icon: "robot" },
          { id: "performance-optimization", label: "性能優化", icon: "tachometer-alt" }
        ]
      }
    },

    {
      id: "featured-projects",
      type: "project-showcase",
      order: 3,
      config: {
        layout: "masonry",
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        cardStyle: "3d-flip",
        animationDelay: 100
      },
      content: {
        projects: "{{projects.portfolio}}" // 引用數據配置
      }
    },

    {
      id: "achievements-summary",
      type: "achievements-grid",
      order: 4,
      config: {
        style: "stats",
        animation: "countUp"
      },
      content: {
        achievements: [
          {
            metric: "專案總數",
            value: 15,
            suffix: "+",
            icon: "project-diagram",
            description: "參與的重要專案數量"
          },
          {
            metric: "系統性能提升",
            value: 300,
            suffix: "%",
            icon: "chart-line",
            description: "平均系統性能改善幅度"
          },
          {
            metric: "團隊協作",
            value: 50,
            suffix: "+",
            icon: "users",
            description: "合作過的團隊成員"
          },
          {
            metric: "技術選型",
            value: 20,
            suffix: "+",
            icon: "cog",
            description: "主導或參與的技術決策"
          }
        ]
      }
    }
  ],

  interactions: {
    cardHover: {
      enabled: true,
      effects: ["tilt", "glow", "scale"],
      sound: "cardHover"
    },
    
    filterTransition: {
      animation: "slideAndFade",
      duration: 400,
      stagger: 50
    },
    
    modalTrigger: {
      event: "cardClick", 
      modal: "project-detail",
      animation: "zoomIn"
    }
  }
};
```

### 1.5 主題配置系統

```javascript
// src/config/theme/animations.config.js
export default {
  // 全域動畫設定
  global: {
    duration: {
      fast: 150,
      normal: 300, 
      slow: 500,
      slower: 800
    },
    
    easing: {
      easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      backOut: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)'
    }
  },

  // 頁面轉場動畫
  pageTransitions: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 500,
      easing: 'easeOut'
    },
    
    slideFromRight: {
      from: { opacity: 0, transform: 'translateX(100px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
      duration: 600,
      easing: 'backOut'
    },
    
    scaleAndFade: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
      duration: 400,
      easing: 'easeOut'
    }
  },

  // 組件動畫
  components: {
    skillTree: {
      nodeReveal: {
        duration: 600,
        easing: 'bounceOut',
        stagger: 100
      },
      
      connectionDraw: {
        duration: 800,
        easing: 'easeInOut',
        delay: 200
      },
      
      hoverEffect: {
        scale: 1.1,
        duration: 200,
        easing: 'easeOut'
      }
    },

    projectCard: {
      flip: {
        duration: 600,
        easing: 'easeInOut',
        transformStyle: 'preserve-3d'
      },
      
      hover: {
        translateY: -5,
        scale: 1.02,
        duration: 200,
        easing: 'easeOut'
      }
    },

    yugiohCard: {
      summon: {
        duration: 1200,
        easing: 'backOut',
        keyframes: [
          { transform: 'scale(0.8) rotate(0deg)', opacity: 0.8 },
          { transform: 'scale(1.2) rotate(360deg)', opacity: 1 },
          { transform: 'scale(1) rotate(360deg)', opacity: 1 }
        ]
      }
    }
  },

  // 載入動畫
  loading: {
    spinner: {
      duration: 1000,
      easing: 'linear',
      infinite: true
    },
    
    skeleton: {
      duration: 1500,
      easing: 'linear',
      infinite: true,
      direction: 'alternate'
    }
  },

  // 微互動動畫
  microInteractions: {
    buttonClick: {
      scale: 0.95,
      duration: 150,
      easing: 'easeOut',
      yoyo: true
    },
    
    iconBounce: {
      translateY: -3,
      duration: 200,
      easing: 'bounceOut'
    },
    
    rippleEffect: {
      scale: [0, 1],
      opacity: [0.5, 0],
      duration: 500,
      easing: 'easeOut'
    }
  }
};
```

## 2. 配置使用範例

### 2.1 組件中使用配置

```javascript
// src/components/gaming/SkillTree/SkillTree.js
import { BaseComponent } from '@core/components/BaseComponent.js';
import { configManager } from '@core/config/ConfigManager.js';

export class SkillTree extends BaseComponent {
  getDefaultConfig() {
    return {
      // 從配置系統獲取預設值
      ...configManager.get('theme.components.skillTree'),
      interactive: true,
      zoomEnabled: true,
      minimap: true
    };
  }

  async render() {
    // 獲取技能數據
    const skillData = configManager.get('data.skills');
    const nodes = skillData.nodes;
    const branches = skillData.branches;

    // 渲染技能樹
    this.renderNodes(nodes);
    this.renderConnections(nodes);
    this.applyThemeStyles();
  }

  renderNodes(nodes) {
    nodes.forEach(node => {
      const nodeElement = this.createNodeElement(node);
      
      // 應用配置中的樣式
      const nodeConfig = this.config.nodeStyles[node.type] || {};
      Object.assign(nodeElement.style, nodeConfig);
      
      this.container.appendChild(nodeElement);
    });
  }

  applyThemeStyles() {
    // 應用主題配置
    const colors = configManager.get('theme.colors');
    const animations = configManager.get('theme.animations.components.skillTree');
    
    this.container.style.setProperty('--skill-mastered-color', colors.gaming.skillStatus.mastered);
    this.container.style.setProperty('--skill-available-color', colors.gaming.skillStatus.available);
    this.container.style.setProperty('--animation-duration', animations.nodeReveal.duration + 'ms');
  }
}
```

### 2.2 動態配置更新

```javascript
// src/systems/ThemeManager/ThemeManager.js
export class ThemeManager {
  constructor() {
    this.currentTheme = 'default';
    this.themes = new Map();
  }

  async switchTheme(themeName) {
    try {
      // 載入新主題配置
      const themeConfig = await import(`@config/theme/${themeName}.config.js`);
      
      // 更新配置管理器
      configManager.set('theme', themeConfig.default);
      
      // 觸發重新渲染
      this.applyThemeToDOM(themeConfig.default);
      
      // 保存使用者偏好
      localStorage.setItem('preferred-theme', themeName);
      
      this.currentTheme = themeName;
    } catch (error) {
      console.error('主題切換失敗:', error);
    }
  }

  applyThemeToDOM(theme) {
    const root = document.documentElement;
    
    // 應用色彩變數
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    
    // 應用字體變數 
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
    
    // 應用間距變數
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--space-${key}`, value);
    });
  }
}
```

### 2.3 配置驗證範例

```javascript
// src/core/config/ConfigValidator.js
export class ConfigValidator {
  constructor() {
    this.schemas = new Map();
    this.initSchemas();
  }

  initSchemas() {
    // 頁面配置 Schema
    this.schemas.set('page', {
      required: ['meta', 'sections'],
      properties: {
        meta: {
          required: ['title'],
          properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } }
          }
        },
        sections: {
          type: 'array',
          items: {
            required: ['id', 'type'],
            properties: {
              id: { type: 'string', pattern: '^[a-z-]+$' },
              type: { type: 'string' },
              order: { type: 'number' },
              visible: { type: 'boolean' }
            }
          }
        }
      }
    });

    // 技能數據 Schema
    this.schemas.set('skills', {
      required: ['nodes', 'branches'],
      properties: {
        nodes: {
          type: 'array',
          items: {
            required: ['id', 'name', 'position', 'status'],
            properties: {
              id: { type: 'string', pattern: '^[a-z-]+$' },
              name: { type: 'string', minLength: 1 },
              position: {
                required: ['q', 'r'],
                properties: {
                  q: { type: 'number' },
                  r: { type: 'number' }
                }
              },
              status: {
                type: 'string',
                enum: ['mastered', 'learning', 'planned', 'locked']
              }
            }
          }
        }
      }
    });
  }

  async validateConfig(type, config) {
    const schema = this.schemas.get(type);
    if (!schema) {
      throw new Error(`未知的配置類型: ${type}`);
    }

    const errors = [];
    this.validateObject(config, schema, errors, type);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateObject(obj, schema, errors, path) {
    // 檢查必填欄位
    if (schema.required) {
      schema.required.forEach(field => {
        if (!(field in obj)) {
          errors.push({
            path: `${path}.${field}`,
            message: `缺少必填欄位: ${field}`
          });
        }
      });
    }

    // 檢查屬性類型
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([field, fieldSchema]) => {
        if (field in obj) {
          this.validateField(obj[field], fieldSchema, errors, `${path}.${field}`);
        }
      });
    }
  }

  validateField(value, schema, errors, path) {
    // 類型檢查
    if (schema.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== schema.type) {
        errors.push({
          path,
          message: `類型錯誤: 期望 ${schema.type}, 實際 ${actualType}`
        });
        return;
      }
    }

    // 字串檢查
    if (schema.type === 'string') {
      if (schema.minLength && value.length < schema.minLength) {
        errors.push({
          path,
          message: `字串長度不足: 最少 ${schema.minLength} 字元`
        });
      }
      
      if (schema.pattern) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          errors.push({
            path,
            message: `格式錯誤: 不符合模式 ${schema.pattern}`
          });
        }
      }
      
      if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
          path,
          message: `值錯誤: 必須是 ${schema.enum.join(', ')} 之一`
        });
      }
    }

    // 陣列檢查
    if (schema.type === 'array' && schema.items) {
      value.forEach((item, index) => {
        this.validateField(item, schema.items, errors, `${path}[${index}]`);
      });
    }

    // 物件檢查
    if (schema.type === 'object' || schema.properties) {
      this.validateObject(value, schema, errors, path);
    }
  }
}
```

這個完整的配置系統範例展示了如何通過配置文件驅動整個網站的內容和行為，讓您可以輕鬆地：

1. **修改頁面內容**：編輯對應的配置文件即可更新頁面
2. **添加新技能**：在 skills.data.js 中添加新的技能節點
3. **展示新專案**：在 projects.data.js 中添加新的專案資料
4. **調整視覺主題**：修改主題配置文件改變網站外觀
5. **擴展功能**：通過配置添加新的組件和互動效果

這種 Config-Driven 的架構讓您的網站具備了極高的靈活性和可維護性。

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "\u5206\u6790\u73fe\u6709\u5c08\u6848\u7d50\u69cb\u548c\u914d\u7f6e", "status": "completed", "activeForm": "\u5206\u6790\u73fe\u6709\u5c08\u6848\u7d50\u69cb\u548c\u914d\u7f6e"}, {"content": "\u8a2d\u8a08 Config-Driven \u7cfb\u7d71\u67b6\u69cb", "status": "completed", "activeForm": "\u8a2d\u8a08 Config-Driven \u7cfb\u7d71\u67b6\u69cb"}, {"content": "\u751f\u6210\u6280\u8853\u67b6\u69cb\u6587\u4ef6", "status": "completed", "activeForm": "\u751f\u6210\u6280\u8853\u67b6\u69cb\u6587\u4ef6"}, {"content": "\u8a2d\u8a08\u9801\u9762\u914d\u7f6e\u7cfb\u7d71\u7bc4\u4f8b", "status": "completed", "activeForm": "\u8a2d\u8a08\u9801\u9762\u914d\u7f6e\u7cfb\u7d71\u7bc4\u4f8b"}]