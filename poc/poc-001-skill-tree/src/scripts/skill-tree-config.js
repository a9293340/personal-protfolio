/**
 * 基於實際天賦的技能樹配置
 * 熟練度等級: O(熟練) / *(略懂) / X(待學習)
 * 顏色深淺表示熟練程度
 */
const SKILL_TREE_CONFIG = {
  // 6個技能領域 (按照 MD 文件結構)
  types: {
    'frontend': { 
      color: '#e74c3c', 
      direction: 0,    // 0度 - 右
      name: '前端領域'
    },
    'backend': { 
      color: '#3498db', 
      direction: 300,  // 300度 - 右下
      name: '後端領域'
    },
    'database': { 
      color: '#2ecc71', 
      direction: 240,  // 240度 - 左下
      name: '資料庫領域'
    },
    'cloud-devops': { 
      color: '#9b59b6', 
      direction: 180,  // 180度 - 左
      name: '雲端服務與 DevOps'
    },
    'ai': { 
      color: '#f39c12', 
      direction: 120,  // 120度 - 左上
      name: 'AI 使用領域'
    },
    'architecture': { 
      color: '#1abc9c', 
      direction: 60,   // 60度 - 右上
      name: '架構規劃領域'
    }
  },

  // 技能熟練度定義
  proficiencyLevels: {
    'O': { level: 'expert', name: '熟練', opacity: 1.0 },
    '*': { level: 'intermediate', name: '略懂', opacity: 0.7 },
    'X': { level: 'learning', name: '待學習', opacity: 0.4 }
  },

  skills: [
    // ===== 1. 前端領域 (右方 0度) =====
    
    // 大技能 - HTML/CSS (基本)
    {
      id: 'html-css',
      name: 'HTML/CSS',
      type: 'frontend',
      skillLevel: 'major',
      hexCoord: { q: 2, r: 0 },
      difficulty: 1 // 基本技能，離中心最近
    },
    // HTML/CSS 小技能
    {
      id: 'html5-semantic',
      name: 'HTML5 語義化標籤',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: -1 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },
    {
      id: 'css3-selectors',
      name: 'CSS3 進階選擇器',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 0 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },
    {
      id: 'flexbox-grid',
      name: 'Flexbox 與 Grid 佈局',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 1 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },
    {
      id: 'rwd',
      name: '響應式設計 (RWD)',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -1 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },
    {
      id: 'css-preprocessor',
      name: 'CSS 預處理器 (Sass/Less)',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: 1 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 1, r: 0 },
      proficiency: 'O',
      relatedTo: ['html-css']
    },

    // 大技能 - JavaScript (基本)
    {
      id: 'javascript',
      name: 'JavaScript',
      type: 'frontend',
      skillLevel: 'major',
      hexCoord: { q: 4, r: 0 },
      difficulty: 2
    },
    // JavaScript 小技能
    {
      id: 'es6-features',
      name: 'ES6+ 新語法特性',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: -1 },
      proficiency: 'O',
      relatedTo: ['javascript']
    },
    {
      id: 'async-programming',
      name: '非同步程式設計',
      description: 'Promise/Async-Await',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 0 },
      proficiency: 'O',
      relatedTo: ['javascript']
    },
    {
      id: 'modular-development',
      name: '模組化開發',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 1 },
      proficiency: 'O',
      relatedTo: ['javascript']
    },
    {
      id: 'dom-manipulation',
      name: 'DOM 操作與事件處理',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: -1 },
      proficiency: 'O',
      relatedTo: ['javascript']
    },
    {
      id: 'browser-api',
      name: '瀏覽器 API 使用',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 1 },
      proficiency: 'O',
      relatedTo: ['javascript']
    },

    // 大技能 - 前端框架 (進階)
    {
      id: 'frontend-frameworks',
      name: '前端框架',
      type: 'frontend',
      skillLevel: 'major',
      hexCoord: { q: 6, r: 0 },
      difficulty: 3
    },
    {
      id: 'react',
      name: 'React',
      description: '組件生命週期、Hooks、狀態管理、Context API',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 7, r: -1 },
      proficiency: '*',
      relatedTo: ['frontend-frameworks']
    },
    {
      id: 'vuejs',
      name: 'Vue.js',
      description: '指令系統、組件通訊、Vuex、Vue Router',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 7, r: 0 },
      proficiency: 'O',
      relatedTo: ['frontend-frameworks']
    },
    {
      id: 'angular',
      name: 'Angular',
      description: '依賴注入、服務、路由、RxJS',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 7, r: 1 },
      proficiency: 'X',
      relatedTo: ['frontend-frameworks']
    },

    // 大技能 - 前端工具鏈 (高階)
    {
      id: 'frontend-tools',
      name: '前端工具鏈',
      type: 'frontend',
      skillLevel: 'major',
      hexCoord: { q: 8, r: 0 },
      difficulty: 4
    },
    {
      id: 'webpack',
      name: 'Webpack',
      description: '模組打包、程式碼分割、優化配置',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 9, r: -1 },
      proficiency: '*',
      relatedTo: ['frontend-tools']
    },
    {
      id: 'vite',
      name: 'Vite',
      description: '快速建構工具',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 9, r: 0 },
      proficiency: 'O',
      relatedTo: ['frontend-tools']
    },
    {
      id: 'babel',
      name: 'Babel',
      description: 'JavaScript 轉譯',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 9, r: 1 },
      proficiency: '*',
      relatedTo: ['frontend-tools']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      description: '型別系統、介面定義',
      type: 'frontend',
      skillLevel: 'minor',
      hexCoord: { q: 8, r: 1 },
      proficiency: 'O',
      relatedTo: ['frontend-tools']
    },

    // ===== 2. 後端領域 (右上 60度) =====
    
    // 大技能 - 程式語言 (基本)
    {
      id: 'backend-languages',
      name: '程式語言',
      type: 'backend',
      skillLevel: 'major',
      hexCoord: { q: 1, r: -2 },
      difficulty: 1
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Express/Koa 框架、中介軟體、非同步處理',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -3 },
      proficiency: 'O',
      relatedTo: ['backend-languages']
    },
    {
      id: 'python',
      name: 'Python',
      description: 'Django/Flask 框架、ORM 使用',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 1, r: -3 },
      proficiency: '*',
      relatedTo: ['backend-languages']
    },
    {
      id: 'java',
      name: 'Java',
      description: 'Spring Boot、Spring Security、JPA',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 0, r: -2 },
      proficiency: 'X',
      relatedTo: ['backend-languages']
    },
    {
      id: 'csharp',
      name: 'C#',
      description: 'ASP.NET Core、Entity Framework',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 0, r: -3 },
      proficiency: '*',
      relatedTo: ['backend-languages']
    },
    {
      id: 'golang',
      name: 'Go',
      description: 'Gin/Echo 框架、併發程式設計',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -2 },
      proficiency: '*',
      relatedTo: ['backend-languages']
    },

    // 大技能 - API 開發 (中階)
    {
      id: 'api-development',
      name: 'API 開發',
      type: 'backend',
      skillLevel: 'major',
      hexCoord: { q: 2, r: -4 },
      difficulty: 2
    },
    {
      id: 'restful-api',
      name: 'RESTful API 設計原則',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: -5 },
      proficiency: 'O',
      relatedTo: ['api-development']
    },
    {
      id: 'graphql',
      name: 'GraphQL 查詢語言',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -5 },
      proficiency: '*',
      relatedTo: ['api-development']
    },
    {
      id: 'websocket',
      name: 'WebSocket 即時通訊',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 1, r: -4 },
      proficiency: 'O',
      relatedTo: ['api-development']
    },
    {
      id: 'api-versioning',
      name: 'API 版本控制',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 1, r: -5 },
      proficiency: 'O',
      relatedTo: ['api-development']
    },
    {
      id: 'swagger',
      name: '文件自動生成 (Swagger)',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: -4 },
      proficiency: 'O',
      relatedTo: ['api-development']
    },

    // 大技能 - 後端架構模式 (高階)
    {
      id: 'backend-architecture',
      name: '後端架構模式',
      type: 'backend',
      skillLevel: 'major',
      hexCoord: { q: 3, r: -6 },
      difficulty: 3
    },
    {
      id: 'mvc-pattern',
      name: 'MVC 架構模式',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: -7 },
      proficiency: 'O',
      relatedTo: ['backend-architecture']
    },
    {
      id: 'dependency-injection',
      name: '依賴注入',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: -7 },
      proficiency: 'O',
      relatedTo: ['backend-architecture']
    },
    {
      id: 'middleware-pattern',
      name: '中介軟體模式',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -6 },
      proficiency: 'O',
      relatedTo: ['backend-architecture']
    },
    {
      id: 'microservices',
      name: '微服務架構',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: -6 },
      proficiency: '*',
      relatedTo: ['backend-architecture']
    },
    {
      id: 'event-driven',
      name: '事件驅動架構',
      type: 'backend',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: -7 },
      proficiency: '*',
      relatedTo: ['backend-architecture']
    },

    // ===== 3. 資料庫領域 (左上 120度) =====
    
    // 大技能 - 關聯式資料庫 (基本)
    {
      id: 'relational-db',
      name: '關聯式資料庫',
      type: 'database',
      skillLevel: 'major',
      hexCoord: { q: -1, r: -2 },
      difficulty: 1
    },
    {
      id: 'mysql',
      name: 'MySQL',
      description: 'SQL 語法、索引優化、查詢調優',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -2 },
      proficiency: 'O',
      relatedTo: ['relational-db']
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      description: '進階查詢、觸發器、函數',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -1, r: -3 },
      proficiency: '*',
      relatedTo: ['relational-db']
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      description: 'T-SQL、預存程序',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -3 },
      proficiency: 'X',
      relatedTo: ['relational-db']
    },
    {
      id: 'normalization',
      name: '資料庫正規化',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -1, r: -1 },
      proficiency: '*',
      relatedTo: ['relational-db']
    },
    {
      id: 'acid-transactions',
      name: '交易處理 (ACID)',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -1 },
      proficiency: '*',
      relatedTo: ['relational-db']
    },

    // 大技能 - NoSQL 資料庫 (中階)
    {
      id: 'nosql-db',
      name: 'NoSQL 資料庫',
      type: 'database',
      skillLevel: 'major',
      hexCoord: { q: -2, r: -4 },
      difficulty: 2
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: '文件模型、聚合管道、索引策略',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: -4 },
      proficiency: 'O',
      relatedTo: ['nosql-db']
    },
    {
      id: 'redis',
      name: 'Redis',
      description: '快取策略、資料結構、持久化',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -5 },
      proficiency: 'O',
      relatedTo: ['nosql-db']
    },
    {
      id: 'elasticsearch',
      name: 'Elasticsearch',
      description: '全文搜尋、分析查詢',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: -5 },
      proficiency: '*',
      relatedTo: ['nosql-db']
    },
    {
      id: 'cassandra',
      name: 'Cassandra',
      description: '分散式架構、資料建模',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -1, r: -4 },
      proficiency: 'X',
      relatedTo: ['nosql-db']
    },

    // 大技能 - 資料庫設計與優化 (高階)
    {
      id: 'db-optimization',
      name: '資料庫設計與優化',
      type: 'database',
      skillLevel: 'major',
      hexCoord: { q: -3, r: -6 },
      difficulty: 3
    },
    {
      id: 'er-modeling',
      name: 'ER 模型設計',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: -6 },
      proficiency: 'O',
      relatedTo: ['db-optimization']
    },
    {
      id: 'indexing-strategy',
      name: '索引策略',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: -7 },
      proficiency: 'O',
      relatedTo: ['db-optimization']
    },
    {
      id: 'query-optimization',
      name: '查詢效能調優',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -6 },
      proficiency: 'O',
      relatedTo: ['db-optimization']
    },
    {
      id: 'sharding',
      name: '資料庫分片',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: -7 },
      proficiency: '*',
      relatedTo: ['db-optimization']
    },
    {
      id: 'read-write-split',
      name: '讀寫分離',
      type: 'database',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: -7 },
      proficiency: 'O',
      relatedTo: ['db-optimization']
    },

    // ===== 4. 雲端服務與 DevOps (左方 180度) =====
    
    // 大技能 - 雲端平台 (基本)
    {
      id: 'cloud-platforms',
      name: '雲端平台',
      type: 'cloud-devops',
      skillLevel: 'major',
      hexCoord: { q: -3, r: 0 },
      difficulty: 1
    },
    {
      id: 'aws',
      name: 'AWS',
      description: 'EC2、S3、RDS、Lambda、CloudFormation',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: 0 },
      proficiency: '*',
      relatedTo: ['cloud-platforms']
    },
    {
      id: 'azure',
      name: 'Azure',
      description: 'App Service、Azure SQL、Functions、ARM Templates',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: 1 },
      proficiency: 'X',
      relatedTo: ['cloud-platforms']
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      description: 'Compute Engine、Cloud Storage、BigQuery',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: -1 },
      proficiency: 'O',
      relatedTo: ['cloud-platforms']
    },

    // 大技能 - 容器化技術 (中階)
    {
      id: 'containerization',
      name: '容器化技術',
      type: 'cloud-devops',
      skillLevel: 'major',
      hexCoord: { q: -5, r: 0 },
      difficulty: 2
    },
    {
      id: 'docker',
      name: 'Docker',
      description: '映像檔建立、多階段建構、網路配置',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -6, r: 0 },
      proficiency: 'O',
      relatedTo: ['containerization']
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      description: 'Pod 管理、Service、Ingress、ConfigMap',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -5, r: 1 },
      proficiency: '*',
      relatedTo: ['containerization']
    },
    {
      id: 'container-orchestration',
      name: '容器編排策略',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -5, r: -1 },
      proficiency: '*',
      relatedTo: ['containerization']
    },
    {
      id: 'microservices-deployment',
      name: '微服務部署',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -6, r: 1 },
      proficiency: '*',
      relatedTo: ['containerization']
    },

    // 大技能 - CI/CD 工具 (中高階)
    {
      id: 'cicd-tools',
      name: 'CI/CD 工具',
      type: 'cloud-devops',
      skillLevel: 'major',
      hexCoord: { q: -7, r: 0 },
      difficulty: 3
    },
    {
      id: 'jenkins',
      name: 'Jenkins',
      description: 'Pipeline 配置、外掛管理',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -8, r: 0 },
      proficiency: '*',
      relatedTo: ['cicd-tools']
    },
    {
      id: 'gitlab-ci',
      name: 'GitLab CI/CD',
      description: 'YAML 配置、Runner 設定',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -7, r: 1 },
      proficiency: 'O',
      relatedTo: ['cicd-tools']
    },
    {
      id: 'github-actions',
      name: 'GitHub Actions',
      description: 'Workflow 自動化',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -7, r: -1 },
      proficiency: 'O',
      relatedTo: ['cicd-tools']
    },
    {
      id: 'automated-testing',
      name: '自動化測試整合',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -8, r: 1 },
      proficiency: 'O',
      relatedTo: ['cicd-tools']
    },
    {
      id: 'deployment-strategies',
      name: '部署策略',
      description: '藍綠部署、滾動更新',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -8, r: -1 },
      proficiency: 'O',
      relatedTo: ['cicd-tools']
    },

    // 大技能 - 基礎設施管理 (高階)
    {
      id: 'infrastructure',
      name: '基礎設施管理',
      type: 'cloud-devops',
      skillLevel: 'major',
      hexCoord: { q: -9, r: 0 },
      difficulty: 4
    },
    {
      id: 'terraform',
      name: 'Terraform',
      description: '基礎設施即程式碼',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -10, r: 0 },
      proficiency: 'X',
      relatedTo: ['infrastructure']
    },
    {
      id: 'ansible',
      name: 'Ansible',
      description: '配置管理、自動化部署',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -9, r: 1 },
      proficiency: '*',
      relatedTo: ['infrastructure']
    },
    {
      id: 'monitoring',
      name: '監控與日誌',
      description: 'Prometheus、Grafana、ELK Stack',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -9, r: -1 },
      proficiency: 'O',
      relatedTo: ['infrastructure']
    },
    {
      id: 'security-scanning',
      name: '安全掃描與合規',
      type: 'cloud-devops',
      skillLevel: 'minor',
      hexCoord: { q: -10, r: 1 },
      proficiency: 'X',
      relatedTo: ['infrastructure']
    },

    // ===== 5. AI 使用領域 (左下 240度) =====
    
    // 大技能 - Prompt Engineering (基本)
    {
      id: 'prompt-engineering',
      name: 'Prompt Engineering',
      type: 'ai',
      skillLevel: 'major',
      hexCoord: { q: -1, r: 2 },
      difficulty: 1
    },
    {
      id: 'effective-prompts',
      name: '如何撰寫有效的提示詞',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: 2 },
      proficiency: 'O',
      relatedTo: ['prompt-engineering']
    },
    {
      id: 'prompt-optimization',
      name: '調整提示詞以獲得最佳結果',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -1, r: 3 },
      proficiency: 'O',
      relatedTo: ['prompt-engineering']
    },
    {
      id: 'context-enhancement',
      name: '使用上下文來增強模型的回應',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: 3 },
      proficiency: 'O',
      relatedTo: ['prompt-engineering']
    },

    // 大技能 - Contextual Understanding (中階)
    {
      id: 'contextual-understanding',
      name: 'Contextual Understanding',
      type: 'ai',
      skillLevel: 'major',
      hexCoord: { q: -2, r: 4 },
      difficulty: 2
    },
    {
      id: 'context-limits',
      name: '理解模型的上下文限制',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: 4 },
      proficiency: '*',
      relatedTo: ['contextual-understanding']
    },
    {
      id: 'background-info',
      name: '使用背景資訊來改善模型的輸出',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -2, r: 5 },
      proficiency: '*',
      relatedTo: ['contextual-understanding']
    },
    {
      id: 'context-continuity',
      name: '管理對話的上下文持續性',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: 5 },
      proficiency: '*',
      relatedTo: ['contextual-understanding']
    },

    // 大技能 - Model Interaction (中高階)
    {
      id: 'model-interaction',
      name: 'Model Interaction',
      type: 'ai',
      skillLevel: 'major',
      hexCoord: { q: -3, r: 6 },
      difficulty: 3
    },
    {
      id: 'model-selection',
      name: '如何與不同的 AI 模型互動',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: 6 },
      proficiency: '*',
      relatedTo: ['model-interaction']
    },
    {
      id: 'model-matching',
      name: '選擇合適的模型以滿足特定需求',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -3, r: 7 },
      proficiency: '*',
      relatedTo: ['model-interaction']
    },
    {
      id: 'response-evaluation',
      name: '評估模型回應的質量',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: 7 },
      proficiency: '*',
      relatedTo: ['model-interaction']
    },

    // 大技能 - Ethical AI Use (高階)
    {
      id: 'ethical-ai',
      name: 'Ethical AI Use',
      type: 'ai',
      skillLevel: 'major',
      hexCoord: { q: -4, r: 8 },
      difficulty: 4
    },
    {
      id: 'ai-ethics',
      name: '理解 AI 使用的倫理考量',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -5, r: 8 },
      proficiency: '*',
      relatedTo: ['ethical-ai']
    },
    {
      id: 'privacy-security',
      name: '確保 AI 使用符合隱私和安全標準',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -4, r: 9 },
      proficiency: 'O',
      relatedTo: ['ethical-ai']
    },
    {
      id: 'bias-fairness',
      name: '處理偏見和公平性問題',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -5, r: 9 },
      proficiency: '*',
      relatedTo: ['ethical-ai']
    },

    // 大技能 - AI Tools and Platforms (應用)
    {
      id: 'ai-tools',
      name: 'AI Tools and Platforms',
      type: 'ai',
      skillLevel: 'major',
      hexCoord: { q: -1, r: 4 },
      difficulty: 2
    },
    {
      id: 'ai-platforms',
      name: '使用 AI 平台進行模型調用',
      description: 'OpenAI、Hugging Face',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: -1, r: 5 },
      proficiency: '*',
      relatedTo: ['ai-tools']
    },
    {
      id: 'ai-integration',
      name: '整合 AI 工具到現有系統中',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: 0, r: 4 },
      proficiency: 'O',
      relatedTo: ['ai-tools']
    },
    {
      id: 'platform-evaluation',
      name: '評估不同平台的優勢和限制',
      type: 'ai',
      skillLevel: 'minor',
      hexCoord: { q: 0, r: 5 },
      proficiency: 'O',
      relatedTo: ['ai-tools']
    },

    // ===== 6. 架構規劃領域 (右下 300度) =====
    
    // 大技能 - 設計模式 (基本)
    {
      id: 'design-patterns',
      name: '設計模式',
      type: 'architecture',
      skillLevel: 'major',
      hexCoord: { q: 1, r: 2 },
      difficulty: 1
    },
    {
      id: 'creational-patterns',
      name: '創建型模式',
      description: '單例、工廠、建造者',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: 2 },
      proficiency: 'O',
      relatedTo: ['design-patterns']
    },
    {
      id: 'structural-patterns',
      name: '結構型模式',
      description: '適配器、裝飾者、外觀',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 1, r: 3 },
      proficiency: 'O',
      relatedTo: ['design-patterns']
    },
    {
      id: 'behavioral-patterns',
      name: '行為型模式',
      description: '觀察者、策略、命令',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: 3 },
      proficiency: '*',
      relatedTo: ['design-patterns']
    },
    {
      id: 'architectural-patterns',
      name: '架構模式',
      description: 'MVC、MVP、MVVM',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 0, r: 2 },
      proficiency: 'O',
      relatedTo: ['design-patterns']
    },

    // 大技能 - 系統架構設計 (中高階)
    {
      id: 'system-architecture',
      name: '系統架構設計',
      type: 'architecture',
      skillLevel: 'major',
      hexCoord: { q: 2, r: 4 },
      difficulty: 3
    },
    {
      id: 'ddd',
      name: '領域驅動設計 (DDD)',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 4 },
      proficiency: '*',
      relatedTo: ['system-architecture']
    },
    {
      id: 'cqrs-event-sourcing',
      name: 'CQRS 與 Event Sourcing',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 2, r: 5 },
      proficiency: '*',
      relatedTo: ['system-architecture']
    },
    {
      id: 'distributed-systems',
      name: '分散式系統設計',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 5 },
      proficiency: '*',
      relatedTo: ['system-architecture']
    },

    // 大技能 - 效能與擴展性 (中階)
    {
      id: 'performance-scalability',
      name: '效能與擴展性',
      type: 'architecture',
      skillLevel: 'major',
      hexCoord: { q: 3, r: 2 },
      difficulty: 2
    },
    {
      id: 'load-balancing',
      name: '負載均衡策略',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 2 },
      proficiency: 'O',
      relatedTo: ['performance-scalability']
    },
    {
      id: 'cache-architecture',
      name: '快取架構設計',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 3 },
      proficiency: 'O',
      relatedTo: ['performance-scalability']
    },
    {
      id: 'cdn-optimization',
      name: 'CDN 配置與優化',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 3 },
      proficiency: 'O',
      relatedTo: ['performance-scalability']
    },
    {
      id: 'database-scaling',
      name: '資料庫分片與複製',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 1 },
      proficiency: 'O',
      relatedTo: ['performance-scalability']
    },
    {
      id: 'horizontal-vertical-scaling',
      name: '水平與垂直擴展',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 3, r: 1 },
      proficiency: 'O',
      relatedTo: ['performance-scalability']
    },

    // 大技能 - 安全性架構 (中高階)
    {
      id: 'security-architecture',
      name: '安全性架構',
      type: 'architecture',
      skillLevel: 'major',
      hexCoord: { q: 4, r: 4 },
      difficulty: 3
    },
    {
      id: 'auth-authorization',
      name: '身份驗證與授權',
      description: 'OAuth2、JWT',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 4 },
      proficiency: 'O',
      relatedTo: ['security-architecture']
    },
    {
      id: 'api-security',
      name: 'API 安全設計',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 5 },
      proficiency: 'O',
      relatedTo: ['security-architecture']
    },
    {
      id: 'data-encryption',
      name: '資料加密與保護',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 5 },
      proficiency: 'O',
      relatedTo: ['security-architecture']
    },
    {
      id: 'secure-coding',
      name: '安全編碼實踐',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 3 },
      proficiency: '*',
      relatedTo: ['security-architecture']
    },
    {
      id: 'threat-modeling',
      name: '威脅建模與風險評估',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 4, r: 6 },
      proficiency: '*',
      relatedTo: ['security-architecture']
    },

    // 大技能 - 架構治理 (高階)
    {
      id: 'architecture-governance',
      name: '架構治理',
      type: 'architecture',
      skillLevel: 'major',
      hexCoord: { q: 5, r: 6 },
      difficulty: 4
    },
    {
      id: 'technical-debt',
      name: '技術債務管理',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 6, r: 6 },
      proficiency: '*',
      relatedTo: ['architecture-governance']
    },
    {
      id: 'architecture-decisions',
      name: '架構決策記錄 (ADR)',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 7 },
      proficiency: 'X',
      relatedTo: ['architecture-governance']
    },
    {
      id: 'code-quality',
      name: '程式碼品質管控',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 6, r: 7 },
      proficiency: '*',
      relatedTo: ['architecture-governance']
    },
    {
      id: 'performance-monitoring',
      name: '效能監控與分析',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 6, r: 5 },
      proficiency: '*',
      relatedTo: ['architecture-governance']
    },
    {
      id: 'disaster-recovery',
      name: '災難復原規劃',
      type: 'architecture',
      skillLevel: 'minor',
      hexCoord: { q: 5, r: 8 },
      proficiency: '*',
      relatedTo: ['architecture-governance']
    }
  ]
};

// 導出配置
if (typeof window !== 'undefined') {
  window.SKILL_TREE_CONFIG = SKILL_TREE_CONFIG;
}