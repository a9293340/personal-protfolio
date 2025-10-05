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
    // 稀有專案 (Rare)
    'powertool-3': {
      id: 'powertool-3',
      name: 'Powertool 3.0 - Scanner 管理工具',
      rarity: 'rare',
      category: 'fullstack',

      // 基本資訊
      shortDescription:
        'Scanner 設定與韌體更新工具，支援藍芽更新、斷點續傳、批量設定遷移，韌體更新效率提升 40%',
      fullDescription: `
        公司原有 Powertool 2.0 作為掃描器 (Scanner) 的設定工具，但因外包維護困難，
        決定自主開發新版本。我透過深入研讀原始 C 語言代碼，在 1 個月內完成 90% 功能分析，
        並成功將所有功能遷移到基於 Electron + Vue 3 的現代化桌面應用。

        新版本不僅提供更直觀的 UI/UX 設計，還大幅提升了韌體更新效率 (從 X-modem 升級至 Y-modem，
        速度提升 40%)，並新增藍芽更新、斷點續傳、批量設定遷移等功能。

        同時將設定檔從難以維護的 TXT 格式重構為 YAML，使得配置管理更加清晰，
        支援將設定好的 Scanner 配置同步遷移到多台設備。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/powertool-3/thumbnail.jpg',
      images: [
        '/assets/projects/powertool-3/main-interface.jpg',
        '/assets/projects/powertool-3/firmware-update.jpg',
        '/assets/projects/powertool-3/batch-migration.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Vue 3', category: 'frontend' },
        { name: 'TypeScript', category: 'language' },
        { name: 'Electron.js', category: 'desktop' },
        { name: 'Tailwind CSS', category: 'styling' },
        { name: 'YAML', category: 'config' },
        { name: 'Y-modem Protocol', category: 'firmware' },
        { name: 'C Language', category: 'analysis' },
      ],

      // 專案統計
      stats: {
        complexity: 7,
        innovation: 6,
        utility: 8,
        developmentTime: '17 months',
        migrationPhase: '7 months',
        featureDevelopment: '10 months',
        teamSize: 2,
        performanceImprovement: '+40%',
        codeAnalysisRate: '90% in 1 month',
      },

      // 技術亮點
      highlights: [
        '跨語言代碼遷移 - 從 C 語言成功轉譯至 JavaScript/TypeScript',
        'Electron 桌面應用開發 - 打造跨平台 Desktop 工具',
        '韌體通訊協議升級 - X-modem → Y-modem，效率提升 40%',
        '現代化配置管理 - TXT → YAML，提升可維護性',
        '斷點續傳機制 - 藍芽更新支援斷線重連，繼續進度',
        '批量設定遷移 - 支援同時配置多台 Scanner 設備',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: '語言障礙 - C 語言不熟悉',
          solution:
            '運用代碼理解能力與同事協助 (C 語言專家)，在 1 個月內完成原代碼 90% 掃描分析，生成完整的功能遷移規劃。展現快速學習與跨語言理解能力。',
        },
        {
          challenge: '韌體通訊協議陌生',
          solution:
            '深入研究 X-modem / Y-modem 協議本質 (數據切割、拆分、轉換)，仿照 C 語言指針式方法，使用 JavaScript 實現等效邏輯，成功完成協議升級。',
        },
        {
          challenge: '維護性與擴展性提升',
          solution:
            '重構設定檔格式 (TXT → YAML)，設計批量遷移功能，降低未來維護成本，提升工具的可擴展性與用戶體驗。',
        },
      ],

      // 連結
      links: {},

      // 時程資訊
      timeline: {
        startDate: '2020-08',
        endDate: '2022-03',
        status: 'completed',
        lastUpdate: '2022-03',
      },
    },

    // 超稀有專案 (Super Rare)
    'enterprise-cms': {
      id: 'enterprise-cms',
      name: '企業級 CMS - 內容管理與流程簽核系統',
      rarity: 'superRare',
      category: 'fullstack',

      // 基本資訊
      shortDescription:
        '企業級 CMS 系統，管理全公司參數、文件、流程簽核，採用 RBAC+ABAC 混合權限，整合 SSE 即時通知與工廠 Desktop Tool',
      fullDescription: `
        從零開始打造的企業級內容管理系統，負責管理公司所有重要參數、文件資料庫、作業流程簽核、工廠日誌及管理等核心業務。

        全程獨立完成用戶流程規劃、ER 模型設計、線框圖繪製、資料庫選型、前端介面開發、後端 API 實作。
        採用 RBAC (角色基礎) + ABAC (屬性基礎) 混合式權限管理架構，靈活處理複雜的組織權限需求
        (3 層角色：副總級/主管/員工 + 各部門屬性權限)，成功管理 100+ 用戶。

        整合 SSE (Server-Sent Events) 實現即時通知功能，簽核完成後立即推送給下一位審核者。
        為滿足工廠作業人員需求，額外開發 Desktop Tool，透過員工編號掃描登入，
        即時更新作業進度與紀錄日誌。

        系統上線後，工廠進度管理與出貨率顯著提升，各部門對於文件、重要資訊儲放更加直覺透明。
        此專案成為轉入全端工程師的重要里程碑，同時也是首次帶領團隊 (2 名實習生) 的技術領導經驗。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/enterprise-cms/thumbnail.jpg',
      images: [
        '/assets/projects/enterprise-cms/dashboard.jpg',
        '/assets/projects/enterprise-cms/workflow.jpg',
        '/assets/projects/enterprise-cms/permission-management.jpg',
        '/assets/projects/enterprise-cms/factory-tool.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Vue 3', category: 'frontend' },
        { name: 'Vite', category: 'build-tool' },
        { name: 'TypeScript', category: 'language' },
        { name: 'Tailwind CSS', category: 'styling' },
        { name: 'Express.js', category: 'backend' },
        { name: 'MongoDB', category: 'database' },
        { name: 'ER Model Design', category: 'database-design' },
        { name: 'SSE', category: 'realtime' },
        { name: 'RBAC + ABAC', category: 'authorization' },
        { name: 'Electron.js', category: 'desktop' },
        { name: 'Nginx', category: 'web-server' },
        { name: 'AWS EC2', category: 'hosting' },
        { name: 'ERP Integration', category: 'integration' },
      ],

      // 專案統計
      stats: {
        complexity: 8,
        innovation: 7,
        utility: 9,
        businessImpact: 10,
        developmentTime: '7 months',
        teamSize: 3,
        teamComposition: '1 正職 + 2 實習生',
        users: '100+',
        roles: '3 層級 (副總/主管/員工)',
        attributes: '多部門屬性權限',
        scope: 'Enterprise-wide System',
        phase: 'Phase 1 Completed & Deployed',
      },

      // 技術亮點
      highlights: [
        '從零開始系統設計 - 用戶流程規劃 → ER 模型 → 線框圖 → 開發 → 部署全流程負責',
        'RBAC + ABAC 混合權限架構 - 3層角色 + 多部門屬性，管理 100+ 用戶權限',
        'SSE 即時通知系統 - 流程簽核後立即推送，提升工廠出貨率',
        '多端解決方案 - Web CMS + Electron Desktop Tool 滿足不同場景需求',
        '企業級業務影響 - 工廠進度管理與出貨率顯著提升，文件管理更透明',
        '技術領導與人才培育 - 首次帶領 2 名實習生，展現專案管理與技術指導能力',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: '工廠人員無公司帳號但需使用系統',
          solution:
            '開發 Electron Desktop Tool，透過工廠員工編號掃描登入，繞過傳統帳號系統，直接完成日誌紀錄與進度更新。展現靈活的問題解決能力與跨平台開發經驗。',
        },
        {
          challenge: '複雜組織權限需求 (職位 + 部門細分)',
          solution:
            '設計 RBAC + ABAC 混合式權限系統，支援 3 層角色 (副總級/主管/員工) + 各部門屬性 (如:歐洲區/亞洲區業務)，並保留擴展性。成功管理 100+ 用戶的複雜權限需求，讓文件與資訊儲放更加直覺透明。',
        },
        {
          challenge: '即時通知與流程效率提升',
          solution:
            '整合 SSE (Server-Sent Events) 實現單向即時推送，簽核完成後立即通知下一位審核者，大幅提升流程處理效率與工廠出貨率。相較 WebSocket 更輕量，適合單向通知場景。',
        },
        {
          challenge: '首次團隊領導經驗',
          solution:
            '帶領 2 名實習生共同開發，負責任務拆分、代碼審查、技術指導。透過 Pair Programming 和 Code Review 培養實習生能力，成功在 7 個月內完成企業級系統第一階段並上線。展現技術領導與人才培育能力，為未來技術管理角色奠定基礎。',
        },
      ],

      // 連結
      links: {},

      // 時程資訊
      timeline: {
        startDate: '2022-07',
        endDate: '2023-02',
        status: 'completed',
        lastUpdate: '2023-02',
        milestone: '全端工程師職涯里程碑 + 首次技術領導',
        note: '與 Partner Portal (2021-05~08) 時間重疊，Portal 收尾階段同時啟動 CMS',
      },
    },

    // 普通專案 (Normal)
    'partner-portal': {
      id: 'partner-portal',
      name: 'Partner Portal - 合作夥伴文件管理平台',
      rarity: 'normal',
      category: 'fullstack',

      // 基本資訊
      shortDescription:
        '合作夥伴文件管理平台，提供多語言支援、權限分級、下載分析，採用 Config-Driven 設計便於 PM 管理',
      fullDescription: `
        為公司重要合作夥伴打造的文件管理與資訊分享平台，基於 Nuxt 3 框架開發。
        因客戶遍及世界各地，實作完整的 i18n 多語言系統，並建立具有權限分級的登入認證系統。

        採用 Config-Driven 架構設計，PM 只需透過後台上傳 CSV 文件，系統會自動透過 AWS Lambda
        將配置同步至 S3，並重新部署網站至 EC2。

        整合下載紀錄分析功能，將用戶行為數據儲存於 S3，提供給 PM 和業務團隊，
        有效提升對客戶需求的了解度，優化資源配置決策。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/partner-portal/thumbnail.jpg',
      images: [
        '/assets/projects/partner-portal/main-page.jpg',
        '/assets/projects/partner-portal/admin-panel.jpg',
        '/assets/projects/partner-portal/analytics.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Vue 3', category: 'frontend' },
        { name: 'Nuxt 3', category: 'framework' },
        { name: 'TypeScript', category: 'language' },
        { name: 'Tailwind CSS', category: 'styling' },
        { name: 'Custom i18n', category: 'internationalization' },
        { name: 'AWS EC2', category: 'hosting' },
        { name: 'AWS S3', category: 'storage' },
        { name: 'AWS Lambda', category: 'serverless' },
        { name: 'Nginx', category: 'web-server' },
        { name: 'YAML', category: 'config' },
      ],

      // 專案統計
      stats: {
        complexity: 5,
        innovation: 6,
        utility: 7,
        developmentTime: '4 months',
        teamSize: 1,
        features: 'i18n + Auth + Analytics',
      },

      // 技術亮點
      highlights: [
        '手刻 i18n 系統 - 自行實作多語言國際化解決方案',
        'Config-Driven 架構 - PM 透過 CSV 上傳即可動態更新網站內容',
        '自動化部署流程 - CSV → Lambda → S3 → EC2 自動化 pipeline',
        '下載紀錄分析 - 基於 S3 的輕量級數據分析系統',
        '權限分級系統 - 完整的登入認證與權限管理機制',
        '全端獨立開發 - 從前端到後端、從開發到部署一人完成',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: 'Config-Driven 設計的即時性與易用性平衡',
          solution:
            '設計小型後台系統，PM 上傳文件路徑 CSV → AWS Lambda 自動處理 → 同步至 S3 的 YAML 配置 → 觸發 EC2 網站重新部署。實現非技術人員也能輕鬆管理內容，同時保持系統穩定性。',
        },
        {
          challenge: '輕量級數據分析需求',
          solution:
            '考量數據量小，不採用雲端資料庫服務 (降低成本)，直接將下載紀錄儲存於 S3，提供簡單但足夠的分析數據給 PM 和業務團隊使用。展現成本效益考量與技術選型能力。',
        },
        {
          challenge: '國際化多語言支援',
          solution:
            '手刻 i18n 系統而非使用現成套件，深入理解多語言實作原理，並客製化符合專案需求的解決方案，提升維護彈性。',
        },
      ],

      // 連結
      links: {},

      // 時程資訊
      timeline: {
        startDate: '2022-03',
        endDate: '2022-07',
        status: 'completed',
        lastUpdate: '2022-07',
      },
    },

    // 傳說級專案 (Legendary)
    'enterprise-ecommerce-saas': {
      id: 'enterprise-ecommerce-saas',
      name: '企業級電商 SaaS 平台',
      rarity: 'legendary',
      category: 'architecture',

      // 基本資訊
      shortDescription:
        '可配置式電商 SaaS 平台，支援多品牌自由打造店商畫面與互動，API Service 300 RPS、Render Service 20 RPS，從 Multi-deploy 演進為 Global Service',
      fullDescription: `
        大型可配置式電商 SaaS 平台，服務 10+ 合作店商客戶（包含多個知名品牌），
        客戶可透過人性化操作自由打造各種店商畫面與互動體驗。

        前端採用 React 為基礎打造 Configurable 渲染核心，所有畫面皆可透過不同 Config 動態渲染。
        我主要負責後端架構設計與核心系統開發，包含:

        1. **核心 API 開發**: 設計並實作各式業務 API，目前 API Service 可支撐 300 RPS (Web + APP)

        2. **Extension 系統**: 預定排程系統，客戶可設定畫面改變生效時間，到達時間時自動渲染

        3. **Workflow 機制**: 架構師設計的自動化流程引擎（類似 n8n），透過 JSON 配置檔編寫流程，
           核心引擎可執行腳本或串接 API，支援條件判斷 (if/else) 與並行執行，
           提供客戶自定義動態操作與系統整合能力

        4. **Cache Refresher 機制**: 使用 MongoDB Change Stream 搭配訂閱，當後台發布頁面時，
           批次將需要 refresh 的 cache 重新渲染並快取，透過 Lua 腳本優化清洗效能

        5. **架構演進 - Multi-deploy → Global Service**:
           將原本多地部署架構轉換為 Global Service，簡化維運、降低成本、提升 release 效率

        6. **壓測與監控體系**: 建立壓測準則，每次壓測後找出弱點並改進。
           引入 Sentry 讓 benchmark 更明確，時刻關注 API 效能表現

        7. **雲端遷移**: 主導從 AWS EKS 遷移到 GCP Cloud Run，優化成本與部署效率

        8. **AI Code Review 導入**: 搭建 GitLab CI/CD 整合 AI Code Review，
           前後端開發效率提升約 30%

        目前系統穩定支撐 Render Service 20 RPS (Web)，已有 10+ 廠商使用（包含知名品牌），
        展現企業級 SaaS 平台的技術深度與業務價值。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/enterprise-ecommerce-saas/thumbnail.jpg',
      images: [
        '/assets/projects/enterprise-ecommerce-saas/architecture.jpg',
        '/assets/projects/enterprise-ecommerce-saas/workflow-engine.jpg',
        '/assets/projects/enterprise-ecommerce-saas/cache-refresher.jpg',
        '/assets/projects/enterprise-ecommerce-saas/monitoring.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Fastify', category: 'framework' },
        { name: 'MongoDB', category: 'database' },
        { name: 'MongoDB Change Stream', category: 'realtime' },
        { name: 'Redis', category: 'cache' },
        { name: 'Lua Script', category: 'scripting' },
        { name: 'GCP Cloud Run', category: 'cloud' },
        { name: 'AWS EKS', category: 'cloud-migration' },
        { name: 'Kubernetes', category: 'orchestration' },
        { name: 'GitLab CI/CD', category: 'cicd' },
        { name: 'Sentry', category: 'monitoring' },
        { name: 'AI Code Review', category: 'ai' },
        { name: 'Workflow Engine', category: 'automation' },
      ],

      // 專案統計
      stats: {
        complexity: 10,
        innovation: 9,
        utility: 10,
        businessImpact: 10,
        developmentTime: '10+ months (ongoing)',
        teamSize: 24,
        teamComposition: 'Frontend 8 + Backend 4 + Mobile 12 + SA 2',
        apiServiceRPS: '300 RPS',
        renderServiceRPS: '20 RPS',
        clients: '10+ 品牌 (含知名品牌)',
        platforms: 'Web + Mobile APP',
        aiCodeReviewEfficiency: '+30%',
        architectureMigration: 'Multi-deploy → Global Service',
        cloudMigration: 'AWS EKS → GCP Cloud Run',
      },

      // 技術亮點
      highlights: [
        'MongoDB Change Stream + Cache Refresher - 即時監聽資料變更，自動觸發 cache 更新',
        'Workflow Engine - JSON 配置驅動，支援條件判斷與並行執行，提供客戶自動化能力',
        'Extension 系統 - 預定排程機制，客戶可設定畫面改變生效時間',
        'Multi-deploy → Global Service - 架構演進簡化維運、降低成本、提升 release 效率',
        '完整壓測與監控體系 - 壓測準則 + Sentry 監控，精準掌握系統弱點',
        '雲端遷移專案 - AWS EKS → GCP Cloud Run，優化成本與部署效率',
        'AI Code Review 導入 - GitLab CI/CD 整合 AI，開發效率提升 30%',
        '高併發架構 - API Service 300 RPS、Render Service 20 RPS，穩定支撐 10+ 品牌',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: 'Cache Refresher 效能瓶頸',
          solution:
            'cache 清除時，目標頁面過龐大導致效能不佳，或 task 滯留(未執行完成)。透過 Lua 腳本優化 cache data 清洗邏輯，降低效能消耗，大幅提升 task 運作效率。使用 MongoDB Change Stream 搭配訂閱機制，實現即時監聽與批次更新。',
        },
        {
          challenge: 'Extension 資料結構設計複雜度',
          solution:
            'Configurable 複雜度過高，資料結構設計困難，前端串接困難。使用拆表方法，透過 Mapping 概念重新設計資料結構，讓 Extension 資料結構複雜度大幅降低，前端更容易串接功能，提升客戶使用體驗。',
        },
        {
          challenge: '大型壓測成本過高',
          solution:
            '完整壓測成本高昂，無法頻繁執行。引入 Sentry 監控系統，每次 release 都能觀測到異動的 API 效能表現，時刻關注危險部分，無需大型壓測也能持續優化系統效能。建立壓測準則，每次壓測後精準找出弱點並改進。',
        },
        {
          challenge: 'Multi-deploy 維運複雜度',
          solution:
            '多地部署架構導致維運成本高、release 流程複雜。主導架構演進，將 Multi-deploy 轉換為 Global Service，簡化維運流程、降低成本、提升 release 效率。同時完成 AWS EKS → GCP Cloud Run 雲端遷移，進一步優化成本與部署體驗。',
        },
      ],

      // 連結
      links: {},

      // 時程資訊
      timeline: {
        startDate: '2024-02',
        endDate: null,
        status: 'ongoing',
        lastUpdate: '2025-01',
        milestone: 'Senior Backend Engineer 代表專案',
        achievements: [
          'API Service 300 RPS 穩定運行',
          'Render Service 20 RPS 支撐 10+ 品牌',
          'AI Code Review 導入，效率提升 30%',
          'AWS → GCP 雲端遷移完成',
          'Multi-deploy → Global Service 架構演進',
        ],
      },
    },

    // 傳說級專案 (Legendary)
    'smart-deeplink-platform': {
      id: 'smart-deeplink-platform',
      name: '企業級智慧轉導服務',
      rarity: 'legendary',
      category: 'architecture',

      // 基本資訊
      shortDescription:
        '跨平台智慧轉導服務，突破 iOS Deep Link 與 SNS 環境限制，日均 20 萬筆連結生成，99.95% 可用性，支撐 1300+ 客戶與 20+ 內部服務',
      fullDescription: `
        企業級智慧轉導服務，專為解決跨平台 Deep Link 難題與 SNS 環境限制而生。

        在企業級電商 SaaS 開發期間，被調派獨立打造此核心基礎設施，負責系統全端開發 (Frontend + Backend)。
        從零開始完成系統架構設計、資料結構設計，並與 APP 團隊與系統架構師協作，
        成功突破 iOS Deep Link 困境與 SNS 環境限制 (LINE、Message 正常運作，WeChat 穩定)。

        **核心技術創新:**

        1. **Deferred Deep Link Service**:
           - 獨立開發 Deferred Deep Link 機制，成功突破 iOS 原生 Deep Link 限制
           - 透過自定義協議與前端協作，實現無縫的跨平台跳轉體驗

        2. **SNS 環境適配**:
           - 成功突破 LINE、Message 環境限制
           - WeChat 環境穩定運行 (中國地區重要渠道)

        3. **高可用架構設計**:
           - 日均 20 萬筆連結生成，穩定支撐 1300+ 外部客戶與 20+ 內部服務
           - 99.95% 可用性，確保企業級服務水準
           - p99 延遲 < 150ms (1000 RPS 壓測)

        4. **CDN 整合與效能優化**:
           - 整合 CDN 後，Visit RPS 達 400 RPS
           - 全球化部署策略，降低延遲、提升用戶體驗

        5. **多租戶架構**:
           - 支援 20+ 內部服務與 1300+ 外部客戶
           - 靈活的配置系統，滿足不同業務場景需求

        此專案展現從零開始設計系統、突破技術難題、獨立完成全端開發的能力，
        並成為 Senior Backend Engineer 核心成就之一。目前 Phase 1 已完成並穩定運行，
        Phase 2 規劃中，預計加強監控體系與擴展更多平台支援。
      `,

      // 視覺資料
      thumbnail: '/assets/projects/smart-deeplink-platform/thumbnail.jpg',
      images: [
        '/assets/projects/smart-deeplink-platform/architecture.jpg',
        '/assets/projects/smart-deeplink-platform/deferred-deeplink.jpg',
        '/assets/projects/smart-deeplink-platform/sns-support.jpg',
        '/assets/projects/smart-deeplink-platform/monitoring.jpg',
      ],

      // 技術資訊
      technologies: [
        { name: 'Node.js', category: 'backend' },
        { name: 'Fastify', category: 'framework' },
        { name: 'Vue 3', category: 'frontend' },
        { name: 'TypeScript', category: 'language' },
        { name: 'PostgreSQL', category: 'database' },
        { name: 'Redis', category: 'cache' },
        { name: 'GCP Cloud Run', category: 'cloud' },
        { name: 'GCP GLB', category: 'load-balancer' },
        { name: 'GCP Memory Store', category: 'cache-service' },
        { name: 'CDN', category: 'performance' },
        { name: 'Deferred Deep Link', category: 'innovation' },
        { name: 'GitLab CI/CD', category: 'cicd' },
      ],

      // 專案統計
      stats: {
        complexity: 10,
        innovation: 10,
        utility: 10,
        businessImpact: 10,
        developmentTime: '6 months',
        teamSize: 4,
        teamComposition: '1 全端 (本人) + 2 APP + 1 SA (指導)',
        role: '全端開發 (Frontend + Backend)',
        internalServices: '20+ 服務',
        externalClients: '1300+ 客戶',
        dailyLinkGeneration: '20 萬筆/天',
        visitRPSWithCDN: '400 RPS',
        latencyP99: '< 150ms (1000 RPS)',
        availability: '99.95%',
        platforms: 'iOS + Android + Web',
        snsSupport: 'LINE ✓ / Message ✓ / WeChat ✓',
      },

      // 技術亮點
      highlights: [
        '從零開始全端開發 - 獨立完成系統架構設計、資料結構設計、前後端開發',
        '突破 iOS Deep Link 困境 - 開發 Deferred Deep Link Service，解決原生限制',
        '突破 SNS 環境限制 - 成功突破 LINE、Message，WeChat 穩定運行',
        '日均 20 萬筆連結 + 99.95% 可用性 - 穩定支撐 1300+ 客戶與 20+ 內部服務',
        '高效能架構 - p99 延遲 < 150ms (1000 RPS)，CDN 加持後 Visit 達 400 RPS',
        '多租戶架構設計 - 靈活配置系統滿足不同業務場景需求',
        '企業級核心基礎設施 - 全公司重要服務依賴的轉導系統',
      ],

      // 挑戰與解決方案
      challenges: [
        {
          challenge: 'iOS Deep Link 原生限制',
          solution:
            'iOS 原生 Deep Link 機制無法滿足業務需求（需先安裝 APP 才能使用）。獨立開發 Deferred Deep Link Service，透過自定義協議與前端協作，實現"未安裝時導向商店，安裝後帶參數跳轉"的無縫體驗。展現深度技術創新與跨端協作能力。',
        },
        {
          challenge: 'SNS 環境 (LINE、Message、WeChat) 限制',
          solution:
            'SNS 平台對外部連結有嚴格限制，導致 Deep Link 失效。透過研究各平台限制機制，設計適配方案成功突破 LINE、Message 環境，並確保 WeChat (中國地區重要渠道) 穩定運行。展現問題分析與解決能力。',
        },
        {
          challenge: '高併發與高可用性需求',
          solution:
            '日均 20 萬筆連結生成，需保證 99.95% 可用性。採用 GCP Cloud Run + GLB + Memory Store 架構，整合 CDN 提升全球訪問速度 (Visit RPS 400)，並透過壓測優化至 p99 < 150ms (1000 RPS)。建立完善監控體系，確保系統穩定運行。',
        },
        {
          challenge: '多租戶與靈活配置需求',
          solution:
            '需支援 20+ 內部服務與 1300+ 外部客戶，每個客戶有不同配置需求。設計靈活的多租戶架構與配置系統，透過資料結構優化與前後端協作，滿足不同業務場景。展現系統設計與架構思維能力。',
        },
        {
          challenge: '獨立全端開發壓力',
          solution:
            '在企業級電商 SaaS 開發期間被調派開發此系統，需獨立完成全端開發 (Frontend + Backend)。透過與 APP 團隊與系統架構師密切協作，在 6 個月內完成 Phase 1 並成功上線。展現全端開發能力、時間管理與跨團隊協作能力。',
        },
      ],

      // 連結
      links: {},

      // 時程資訊
      timeline: {
        startDate: '2025-03',
        endDate: '2025-08',
        status: 'completed',
        phase: 'Phase 2 規劃中',
        lastUpdate: '2025-08',
        milestone: 'Senior Backend Engineer 核心成就',
        note: '與企業級電商 SaaS 開發期間被調派獨立開發此系統',
        achievements: [
          '日均 20 萬筆連結生成，99.95% 可用性',
          '突破 iOS Deep Link 限制 - Deferred Deep Link Service',
          '突破 SNS 環境限制 - LINE/Message/WeChat 穩定運行',
          '支撐 1300+ 客戶與 20+ 內部服務',
          'p99 延遲 < 150ms (1000 RPS)',
          'CDN 加持後 Visit RPS 400',
        ],
      },
    },

    // 更多專案將陸續添加...
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
