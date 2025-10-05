/**
 * personal-projects.data.js - 個人專案數據配置
 *
 * 包含所有個人專案的詳細資訊：
 * - 基本資訊（標題、描述、類型、狀態）
 * - 遊戲王卡牌數據（攻擊力、防禦力、等級）
 * - 技術棧和工具
 * - 專案圖片和截圖
 * - 相關連結
 * - 稀有度和重要性評分
 */

export const personalProjectsData = [
  {
    id: 'personal-gaming-portfolio',
    title: '🎮 Gaming Portfolio - 遊戲化個人作品集網站',
    description:
      '融合流亡黯道技能樹與遊戲王卡牌風格的創新作品集網站，採用 Config-Driven 架構設計，實現動態互動版與靜態 CV 版雙模式。透過 100% 原生 JS 技術棧打造複雜動畫系統，展現從後端工程師向系統架構師發展的專業軌跡，並整合 GitHub Actions 實現自動化部署。',
    category: 'frontend',
    rarity: 'legendary',
    status: 'completed',
    importance: 10,
    completedDate: '2024-10',

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 9, // 技術複雜度：Config-Driven 架構 + 複雜動畫系統 + 雙模式設計
      innovation: 10, // 創新程度：遊戲化設計 + Meta 概念（作品集展示作品集）
      utility: 9, // 實用價值：實戰級作品集 + 面試利器
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 3400, // 基於 complexity(9) + innovation(10) 計算
      defense: 2800, // 基於 utility(9) 計算
      level: 10,
      attribute: 'LIGHT',
      type: 'Frontend/Effect/Ritual',
    },

    // 技術棧
    technologies: [
      'Vite',
      'Vanilla JavaScript',
      'ES6+ Modules',
      'GSAP',
      'CSS3 Transform',
      'HTML5',
      'GitHub Actions',
      'GitHub Pages',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/gaming-portfolio/main1.png',
        '/images/personal-projects/gaming-portfolio/main2.png',
        '/images/personal-projects/gaming-portfolio/main3.png',
        '/images/personal-projects/gaming-portfolio/main4.png',
      ],
    },

    // 相關連結
    links: {
      demo: 'https://a9293340.github.io/personal-protfolio/',
      github: 'https://github.com/a9293340/personal-protfolio',
    },

    // 專案亮點
    highlights: [
      'Config-Driven 架構 - 所有內容與結構通過配置文件統一管理，實現高度可維護性',
      '遊戲化設計創新 - 融合流亡黯道技能樹與遊戲王卡牌系統，打造獨特視覺體驗',
      '雙模式並存 - 動態互動版展現技術深度，靜態 CV 版適合面試與列印，一站滿足所有需求',
      '100% 原生 JS - 零框架依賴，完全掌控代碼品質，bundle size 最小化',
      'GSAP 動畫系統 - 流暢的技能樹互動、卡牌召喚特效、頁面轉場動畫',
      '完整 RWD 優化 - 雙斷點響應式設計（768px + 480px），手機端完美適配',
      '圖片資源統一管理 - public/ 目錄集中管理，CV 版與動態版共用資源，降低維護成本',
      'GitHub Actions CI/CD - 自動化部署流程，type-check + lint 品質檢查，確保代碼品質',
      'ProjectModal 彈窗系統 - 工作專案與個人專案分離渲染，支援圖片輪播功能',
      '深色模式支援 - CV 版獨立深色模式，localStorage 持久化偏好設定',
    ],
  },
  {
    id: 'personal-3d-portfolio-v1',
    title: '🎨 3D 互動個人作品集（舊版）',
    description:
      '基於 Vue 3 打造的沉浸式個人作品集網站，整合 Three.js 3D 場景與 Cannon.js 物理引擎，手刻自適應輪播元件，根據螢幕尺寸動態調整特效與互動體驗。',
    category: 'frontend',
    rarity: 'rare',
    status: 'completed',
    importance: 7,
    completedDate: '2023-09',

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 7, // 技術複雜度：Three.js + Cannon.js + 手刻輪播
      innovation: 7, // 創新程度：3D 背景在個人網站中較少見
      utility: 8, // 實用價值：個人品牌展示價值高
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 2400, // 基於 complexity(7) + innovation(7) 計算
      defense: 2200, // 基於 utility(8) 計算
      level: 7,
      attribute: 'LIGHT',
      type: 'Frontend/Xyz/Effect',
    },

    // 技術棧
    technologies: [
      'Vue 3',
      'Vite',
      'Three.js',
      'Cannon.js',
      'TypeScript',
      'Tailwind CSS',
      'Vercel',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/3d-portfolio-v1/home.PNG',
        '/images/personal-projects/3d-portfolio-v1/about.PNG',
        '/images/personal-projects/3d-portfolio-v1/portfolio.PNG',
      ],
    },

    // 相關連結
    links: {
      demo: 'https://persional-website.vercel.app/portfolio',
      github: 'https://github.com/a9293340/persional-website',
    },

    // 專案亮點
    highlights: [
      'Three.js + Cannon.js 3D 物理場景 - 打造沉浸式背景特效',
      '手刻自適應 3D 輪播元件 - 根據螢幕尺寸動態調整效果',
      '響應式視覺優化 - 針對不同設備優化 3D 渲染效能',
      '現代前端技術棧 - Vite + Vue 3 + TypeScript + Tailwind CSS',
      'Vercel 無縫部署 - CI/CD 自動化部署流程',
    ],
  },
  {
    id: 'personal-house-view-log',
    title: '🏠 看房筆記本 - 房產評論社群平台',
    description:
      '基於 Nuxt 3 全端架構打造的房產筆記與評論平台，整合 Google Maps API 提供地圖化搜尋體驗，支援富文本筆記、圖片上傳、社群留言，解決看房資訊分散與記錄不便的痛點。',
    category: 'fullstack',
    rarity: 'superRare',
    status: 'completed',
    importance: 8,
    completedDate: '2023-12',

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8, // 技術複雜度：Nuxt 3 全端 + MongoDB + Google Maps API
      innovation: 8, // 創新程度：地圖化房產筆記創新應用
      utility: 9, // 實用價值：解決真實看房痛點
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 2800, // 基於 complexity(8) + innovation(8) 計算
      defense: 2600, // 基於 utility(9) 計算
      level: 8,
      attribute: 'EARTH',
      type: 'Fullstack/Fusion/Effect',
    },

    // 技術棧
    technologies: [
      'Nuxt 3',
      'Vue 3',
      'Nitro',
      'MongoDB',
      'TypeScript',
      'Tailwind CSS',
      'Google Maps API',
      'TinyMCE',
      'Vercel',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/house-view-log/login.PNG',
        '/images/personal-projects/house-view-log/main1.PNG',
        '/images/personal-projects/house-view-log/main2.PNG',
      ],
    },

    // 相關連結
    links: {
      demo: 'https://house-view-log.vercel.app/map',
      github: 'https://github.com/a9293340/house-view-log',
    },

    // 專案亮點
    highlights: [
      'Nuxt 3 全端架構 - 前端 SSR/CSR + Nitro 後端 API，單一框架完成全端開發',
      'Google Maps API 深度整合 - 地圖標記、物件搜尋、位置視覺化',
      '社群驅動的房產評論系統 - 用戶註冊、留言分享、看房心得建立信任社群',
      '富文本筆記功能 - TinyMCE 編輯器支援圖文並茂的看房記錄',
      'MongoDB NoSQL 架構 - 靈活的資料結構，支援複雜的物件與評論關聯',
      '解決實際痛點 - 看房資訊分散、記錄不便，提供一站式解決方案',
    ],
  },
  {
    id: 'personal-ygo-card-time',
    title: '🎴 卡壇 Card Time - 遊戲王卡牌資訊平台',
    description:
      '服務卡牌愛好者的完整全端平台，從 V1 到 V2 展現架構演進與技術深化能力。V1 建立完整全端架構（前台、後台 CMS、API、爬蟲系統），V2 透過 Monorepo 重構、Fastify + Redis 效能優化、GCP Cloud Run 雲端遷移、Cloud Scheduler + Batch 成本優化，並整合 Line Bot 提升用戶體驗。',
    category: 'fullstack',
    rarity: 'legendary',
    status: 'inProgress',
    importance: 10,
    completedDate: '2024-06', // V1 完成，V2 持續開發中

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 9, // 技術複雜度：Monorepo + 多服務整合 + 雲端遷移
      innovation: 8, // 創新程度：架構演進 + 成本優化策略
      utility: 9, // 實用價值：服務真實用戶社群
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 3200, // 基於 complexity(9) + innovation(8) 計算
      defense: 2800, // 基於 utility(9) 計算
      level: 10,
      attribute: 'DARK',
      type: 'Fullstack/Synchro/Effect',
    },

    // 技術棧
    technologies: [
      // V1 技術棧
      'Vue 3',
      'Vue 2',
      'Vite',
      'TypeScript',
      'Express.js',
      'MongoDB',
      'PM2',
      // V2 技術棧
      'Nuxt 3',
      'Fastify',
      'Redis',
      'Monorepo',
      'GCP Cloud Run',
      'GCP Cloud Scheduler',
      'GCP Cloud Batch',
      'Line Bot API',
      'Google Drive API',
      'GitHub Actions',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/ygo-card-time/frontend-first.PNG',
        '/images/personal-projects/ygo-card-time/frontend-ArticleList.PNG',
        '/images/personal-projects/ygo-card-time/backend-first.PNG',
        '/images/personal-projects/ygo-card-time/backend-ArticleList.PNG',
      ],
    },

    // 相關連結
    links: {
      demo: 'https://cardtime.tw/',
      github: 'https://github.com/ygo-tw/ygo-card-time', // V2 Monorepo
      githubV1Frontend: 'https://github.com/a9293340/ygo_frontend',
      githubV1Backend: 'https://github.com/a9293340/ygo_express',
      githubV1Admin: 'https://github.com/alex1234567639/Yu-Gi-Oh-admin',
    },

    // 專案亮點
    highlights: [
      '架構演進展現技術深度 - V1 奠基 → V2 Monorepo 重構，完整技術思維',
      'Monorepo 架構管理 - 統一管理前後端與共享庫，提升代碼複用性',
      '效能與成本雙優化 - Fastify + Redis 提升速度，Cloud Batch 降低爬蟲成本 70%+',
      '全棧 TypeScript 化 - 前後端全面 TS，提升代碼品質與可維護性',
      '每日自動化價格追蹤 - 爬蟲系統建立卡片價格資料庫，提升市場透明度',
      'Nuxt 3 SSR 優化 - 提升 SEO 與首屏載入速度',
      'Line Bot 整合 - 官方帳號提供便捷查詢，提升用戶黏性',
      'GCP 雲端遷移 - 自租伺服器 → Cloud Run，提升可擴展性與可靠性',
      '團隊協作與持續維護 - 與友人合作，已上線並持續迭代優化',
    ],

    // V1 vs V2 對比
    versions: {
      v1: {
        completedDate: '2024-06',
        features: [
          '完整全端架構 - 前台(Vite+Vue3) + 後台(Vue2) + API(Express)',
          '自動化爬蟲系統 - PM2 + Schedule 每日定時爬取卡片價格',
          '內容創作平台 - 用戶可申請成為部落客，後台撰寫文章',
          'GitHub Actions 自動部署至自租伺服器',
        ],
        tech: 'Vue3, Vue2, Express, MongoDB, PM2',
      },
      v2: {
        startDate: '2024-09',
        status: 'in-progress',
        improvements: [
          'Monorepo 架構 - 統一管理前後端與共享庫',
          'Fastify + Redis - 大幅提升 API 效能',
          '全棧 TypeScript - 前後端完全 TS 化',
          'Nuxt 3 SSR - 優化 SEO 與首屏載入',
          'Cloud Scheduler + Batch - 爬蟲成本降低 70%+（取代常駐運行）',
          'GCP Cloud Run - 雲端遷移，提升可擴展性',
          'Line Bot - 官方帳號整合，便捷查詢體驗',
          'Vue2 → Vue3 遷移 - 後台現代化',
        ],
        tech: 'Nuxt3, Fastify, Redis, Monorepo, GCP, Line Bot API',
      },
    },
  },
  {
    id: 'personal-money-flow',
    title: '💰 Money Flow - 跨平台個人財務管理應用',
    description:
      '文檔驅動、AI 協作開發的跨平台財務管理應用。採用 Nuxt 3 全端架構 + Tauri 2 移動端，支援 Web、iOS、Android 三平台，提供收支記錄、預算規劃、AI 智能分析等功能。透過 Vibe Coding 與 AI 深度協作，在保持代碼品質與安全性的前提下，快速實現 90% 核心功能，展現現代化 AI 輔助開發模式。',
    category: 'fullstack',
    rarity: 'legendary',
    status: 'inProgress',
    importance: 10,
    completedDate: '2025-08', // 已完成 90%，持續優化中

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 9, // 技術複雜度：Nuxt 3 全端 + Tauri 跨平台 + AI 整合
      innovation: 9, // 創新程度：文檔驅動 + AI 協作開發模式
      utility: 9, // 實用價值：完整的財務管理解決方案
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 3300, // 基於 complexity(9) + innovation(9) 計算
      defense: 2900, // 基於 utility(9) 計算
      level: 10,
      attribute: 'LIGHT',
      type: 'Fullstack/Ritual/Effect',
    },

    // 技術棧
    technologies: [
      'Nuxt 3',
      'Vue 3',
      'TypeScript',
      'Tailwind CSS',
      'Tauri 2',
      'MongoDB',
      'Mongoose ODM',
      'Pinia',
      'GCP Cloud Run',
      'Docker',
      'JWT Authentication',
      'Vitest',
      'Playwright',
      'AI-Assisted Development',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/money-flow/main1.png',
        '/images/personal-projects/money-flow/main2.png',
        '/images/personal-projects/money-flow/main3.png',
        '/images/personal-projects/money-flow/main4.png',
      ],
    },

    // 相關連結
    links: {
      demo: 'https://personal-finance-manager-266039927960.asia-east1.run.app/',
      github: 'https://github.com/a9293340/money-flow',
    },

    // 專案亮點
    highlights: [
      'AI 協作開發（Vibe Coding）- 與 AI 深度協作快速實現 90% 核心功能，人工把關代碼品質、安全性與方向',
      '文檔驅動開發（DDD）- 15+ 完整文檔，涵蓋架構、API、用戶故事、上架指南等',
      '跨平台三端支援 - Web + iOS + Android，Tauri 2 實現原生應用體驗',
      'Nuxt 3 全端架構 - SSR/SSG + Server API，前後端統一技術棧',
      'AI 智能財務分析 - 收入預測、支出分析、儲蓄目標規劃',
      '完整產品開發流程 - 從規劃、開發、測試到 App Store 上架準備',
      'GCP Cloud Run 部署 - Serverless 架構，Docker 容器化',
      '嚴格的工程規範 - TypeScript 全棧、Commit 規範、測試覆蓋',
      '豐富的財務功能 - 收支記錄、分類管理、預算監控、多幣別支援、資料匯入匯出',
    ],

    // AI 協作開發特色
    aiCollaboration: {
      model: 'Vibe Coding with Claude',
      approach: 'AI 輔助快速開發 + 人工品質把關',
      responsibilities: {
        ai: [
          '快速生成代碼骨架與實現',
          '文檔撰寫與維護',
          '測試案例生成',
          '技術方案建議',
        ],
        human: [
          '架構設計與技術決策',
          '代碼審查與品質把關',
          '機敏資訊管理（API Key、環境變數）',
          '方向導正與需求確認',
          '安全性與效能優化',
        ],
      },
      benefits: [
        '開發速度提升 70%+',
        '文檔完整度極高（15+ 文檔）',
        '代碼品質可控（人工 Review）',
        '快速迭代與調整',
      ],
    },

    // 核心功能
    features: {
      completed: [
        '收支記錄管理（CRUD）',
        '分類系統與自定義分類',
        '基礎統計圖表',
        '月度/年度報告',
        '預算規劃與監控',
        '多幣別支援與匯率轉換',
        '資料匯入/匯出',
        '搜尋與篩選',
        'JWT 認證系統',
        'Web + iOS + Android 多平台 Build',
        'AI 智能收入預測',
        '儲蓄目標設定',
      ],
      inProgress: [
        'App Store 上架流程',
        'Google Play 上架流程',
        '效能優化與測試',
        '用戶體驗細節調整',
      ],
    },

    // 技術架構亮點
    architecture: {
      frontend: 'Nuxt 3 (SSR/SSG) + Vue 3 Composition API + Pinia',
      backend: 'Nuxt 3 Server API + MongoDB + Mongoose',
      mobile: 'Tauri 2 (跨平台原生應用)',
      deployment: 'GCP Cloud Run + Docker',
      testing: 'Vitest (單元測試) + Playwright (E2E 測試)',
      documentation: '15+ 完整文檔（架構、API、用戶故事、上架指南等）',
    },

    // 開發時程
    timeline: {
      startDate: '2025-06',
      endDate: '2025-08',
      progress: '90%',
      status: '核心功能完成，優化與上架準備中',
    },
  },
  {
    id: 'personal-smart-survey-pro',
    title: '📋 SmartSurvey Pro - 企業級智能問卷平台',
    description:
      '以學習為核心驅動的企業級智能問卷建構與分析平台，旨在打造比 Google Forms 更專業、比 SurveyMonkey 更易用的解決方案。採用 Nuxt 3 Monorepo 架構，整合自由畫布設計、AI 問卷生成、企業協作等創新功能，展現從 0 到 1 構建 SaaS 產品的完整能力。',
    category: 'fullstack',
    rarity: 'legendary',
    status: 'inProgress',
    importance: 10,
    completedDate: null, // 預計 2025-03 完成

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 10, // 技術複雜度：Monorepo + 拖放編輯器 + AI 整合 + 雲端架構
      innovation: 9, // 創新程度：自由畫布設計 + AI 問卷生成
      utility: 9, // 實用價值：完整 SaaS 產品，解決企業問卷需求
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 3500, // 基於 complexity(10) + innovation(9) 計算
      defense: 3000, // 基於 utility(9) 計算
      level: 10,
      attribute: 'DIVINE',
      type: 'Fullstack/Pendulum/Effect',
    },

    // 技術棧
    technologies: [
      // 前端技術
      'Nuxt 3',
      'Vue 3',
      'TypeScript',
      'Pinia',
      'Tailwind CSS',
      'VueUse',
      // 後端技術
      'Nitro',
      'MongoDB Atlas',
      'Redis Cloud',
      // 工具鏈
      'Turborepo',
      'PNPM',
      // 部署與雲端
      'Google Cloud Run',
      'Docker',
      // AI 整合
      'OpenAI API',
      'LangChain',
      // 開發工具
      'ESLint',
      'Prettier',
      'Vitest',
      'GitHub Actions',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/smart-survey-pro/main1.png',
        '/images/personal-projects/smart-survey-pro/main2.png',
        '/images/personal-projects/smart-survey-pro/main3.png',
      ],
    },

    // 相關連結
    links: {
      demo: null, // 上線後補充
      github: 'https://github.com/a9293340/SmartSurveyPro',
    },

    // 專案亮點
    highlights: [
      '學習驅動開發 - 重視理解與掌握每個技術細節，而非快速完成',
      'Monorepo 架構 - Turborepo + PNPM 管理多套件專案',
      '自由畫布設計 - 突破傳統線性問卷限制，提供創新的視覺化編輯體驗',
      'AI 智能問卷生成 - 整合 AI 快速生成符合需求的問卷框架',
      '企業協作功能 - 團隊管理、權限控制、協同編輯',
      '完整的開發文檔 - 文檔即代碼，所有決策與架構完整記錄',
      '嚴格的工程規範 - TypeScript 嚴格模式、Commit 規範、測試覆蓋',
      'GCP Cloud Run 部署 - Serverless 架構，自動擴展',
      '三階段漸進式開發 - MVP → 核心功能 → 進階特性',
    ],

    // 核心功能模組
    features: {
      phase1: {
        name: 'MVP 基礎建設',
        period: '2025-08 ~ 2025-09',
        status: 'in-progress',
        items: [
          '專案基礎架構建立 (Nuxt 3 + Turborepo)',
          '用戶認證系統 (註冊/登入/JWT)',
          '問卷 CRUD 基本功能',
          '拖放式編輯器基礎版',
          '基本問題類型 (單選/多選/文字)',
          '填答收集與儲存',
        ],
      },
      phase2: {
        name: '核心功能擴展',
        period: '2025-10 ~ 2025-11',
        status: 'planned',
        items: [
          '進階問題類型 (評分/矩陣/檔案上傳)',
          '邏輯跳轉引擎',
          '資料驗證機制',
          '即時統計圖表',
          '資料匯出 (Excel/CSV/PDF)',
        ],
      },
      phase3: {
        name: '進階功能與 AI',
        period: '2025-12 ~ 2026-01',
        status: 'planned',
        items: [
          '團隊管理與權限控制',
          'AI 問卷生成',
          'AI 智能分析與洞察',
          '協同編輯功能',
          '訂閱付費系統',
        ],
      },
    },

    // 技術架構亮點
    architecture: {
      frontend: 'Nuxt 3 (SSR/SSG) + Vue 3 Composition API + Pinia',
      backend: 'Nitro Server + MongoDB Atlas + Redis Cloud',
      infrastructure: 'Google Cloud Run + Docker + GitHub Actions CI/CD',
      monorepo: 'Turborepo + PNPM Workspaces',
      documentation: '完整的 CLAUDE.md、ROADMAP.md、技術決策文檔',
    },

    // 開發理念
    developmentPhilosophy: {
      approach: '學習驅動 + 文檔即代碼 + 漸進式開發',
      collaboration: 'Claude 提供架構 + 人工實作核心邏輯 + 協作審查改進',
      principles: [
        '重視學習而非快速完成',
        '所有決策都要有文檔記錄',
        'TypeScript 嚴格類型檢查',
        '完整的 README 管理',
        '持續優化與迭代',
      ],
    },

    // 開發時程
    timeline: {
      startDate: '2025-08',
      targetLaunch: '2025-03',
      currentPhase: 'Phase 1: MVP 基礎建設',
      progress: '15%',
      status: '正在建立專案基礎架構與認證系統',
    },

    // 學習目標
    learningGoals: [
      '深入理解 Monorepo 架構設計與管理',
      '掌握拖放編輯器的實作原理',
      '學習 AI 與前端應用的深度整合',
      '實踐完整 SaaS 產品從 0 到 1 的開發流程',
      '提升雲端架構設計與部署能力',
      '建立嚴謹的工程文化與開發規範',
    ],

    // 預期目標
    goals: {
      technical: '建立可擴展的企業級 SaaS 架構',
      product: '打造比現有方案更易用的問卷平台',
      learning: '全面提升全端開發與系統設計能力',
      community: '開源分享，幫助其他開發者學習',
    },
  },
  {
    id: 'personal-earthquake-map',
    title: '🌍 台灣地震 3D 視覺化系統',
    description:
      '以學習 Golang 與 React 為目標的地震數據 3D 視覺化專案。採用 AI 導師帶領模式，從零開始手寫每一行代碼，通過構建完整的前後端分離系統（Go RESTful API + React + Three.js 3D 渲染），深度學習 Golang 後端開發、PostgreSQL + PostGIS 地理資訊處理、WebSocket 即時通訊等核心技術。',
    category: 'fullstack',
    rarity: 'superRare',
    status: 'onHold',
    importance: 8,
    completedDate: null,

    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8, // 技術複雜度：Golang 後端 + PostgreSQL/PostGIS + Three.js 3D + WebSocket
      innovation: 7, // 創新程度：3D 地震視覺化 + 即時資料推送
      utility: 8, // 實用價值：學習導向的完整全端專案
    },

    // 遊戲王卡牌數據
    cardData: {
      attack: 2600, // 基於 complexity(8) + innovation(7) 計算
      defense: 2400, // 基於 utility(8) 計算
      level: 8,
      attribute: 'EARTH',
      type: 'Fullstack/Xyz/Effect',
    },

    // 技術棧
    technologies: [
      // 後端技術
      'Go 1.21+',
      'Gin Framework',
      'PostgreSQL 15+',
      'PostGIS',
      'Redis 7+',
      // 前端技術
      'React 18',
      'TypeScript',
      'Three.js',
      'Mapbox GL JS',
      'Zustand',
      // 工具與部署
      'Docker',
      'Docker Compose',
      'Google Cloud Run',
      'GitHub Actions',
      'Makefile',
    ],

    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        // TODO: 開發完成後補充截圖
      ],
    },

    // 相關連結
    links: {
      demo: null, // 開發完成後補充
      github: 'https://github.com/a9293340/earthquake-map',
    },

    // 專案亮點
    highlights: [
      'AI 導師帶領學習模式 - 逐步手寫每一行代碼，深度理解而非複製貼上',
      'Golang 後端深度學習 - 模組化架構、依賴注入、RESTful API 設計',
      'PostgreSQL + PostGIS 地理資訊處理 - 空間資料索引與查詢',
      'Three.js 3D 地球視覺化 - WebGL 渲染地震事件的深度與規模',
      'WebSocket 即時資料推送 - 實現地震資料即時更新',
      'Microservices 架構設計 - 資料爬蟲、API 服務、3D 視覺化分離',
      'Docker 容器化部署 - 本地開發與雲端部署一致性',
      'GCP Cloud Run Serverless 部署 - 成本優化與自動擴展',
    ],

    // 核心功能模組
    features: {
      backend: {
        status: 'partially-completed',
        progress: '70%',
        items: [
          '✅ 模組化架構設計與依賴注入',
          '✅ RESTful API 端點（地震列表、詳情、統計）',
          '✅ PostgreSQL + PostGIS 資料庫設計',
          '✅ Redis 快取層',
          '✅ 完整的錯誤處理與日誌系統',
          '🚧 USGS API 資料爬蟲（進行中）',
          '⏸️ WebSocket 即時資料推送（暫停）',
        ],
      },
      frontend: {
        status: 'not-started',
        progress: '0%',
        items: [
          '⏸️ React + TypeScript 專案建置',
          '⏸️ Three.js 3D 地球渲染',
          '⏸️ Mapbox GL JS 地圖整合',
          '⏸️ 互動式時間軸控制',
          '⏸️ 地震資訊面板',
          '⏸️ 響應式設計',
        ],
      },
      deployment: {
        status: 'planned',
        items: [
          '✅ Docker Compose 本地開發環境',
          '⏸️ GCP Cloud Run 部署',
          '⏸️ GitHub Actions CI/CD',
          '⏸️ 效能監控與錯誤追蹤',
        ],
      },
    },

    // 學習導向的開發模式
    learningApproach: {
      model: 'AI 導師帶領 + 手寫代碼 + Code Review',
      process: [
        'AI 提供技術指導與架構建議',
        '開發者手寫每一行代碼（不複製貼上）',
        'AI Review 代碼並提供改進建議',
        '反覆迭代直到理解核心概念',
      ],
      focus: [
        '深入理解 Golang 語法與設計模式',
        '掌握 RESTful API 設計原則',
        '學習地理資訊系統（GIS）處理',
        '實作 WebSocket 即時通訊',
        '理解 Three.js 3D 渲染原理',
      ],
      benefits: [
        '扎實的技術基礎建立',
        '培養獨立解決問題能力',
        '深度理解每個技術細節',
        '建立完整的全端開發思維',
      ],
    },

    // 技術架構亮點
    architecture: {
      backend: 'Go + Gin + PostgreSQL/PostGIS + Redis',
      frontend: 'React 18 + TypeScript + Three.js + Zustand',
      deployment: 'Docker + GCP Cloud Run + GitHub Actions',
      pattern: 'Microservices 架構 + 依賴注入 + 模組化設計',
      cost: '$0-$15/月（使用免費/低成本雲端服務）',
    },

    // 專案當前狀態
    currentStatus: {
      phase: '暫停開發，專注 Golang 基礎學習',
      reason: '開發過程中發現需要更扎實的 Golang 底子',
      action: '目前以系統化課程學習為主',
      plan: '完成 Golang 課程後將接續開發',
    },

    // 開發時程
    timeline: {
      startDate: '2024-09',
      pausedDate: '2024-10',
      currentPhase: '暫停開發，學習 Golang 基礎',
      backendProgress: '70%',
      frontendProgress: '0%',
      overallProgress: '35%',
    },

    // 學習目標
    learningGoals: [
      '掌握 Golang 語法、並發模型、錯誤處理',
      '理解 RESTful API 設計最佳實踐',
      '學習 PostgreSQL + PostGIS 地理資訊處理',
      '實作 WebSocket 即時通訊機制',
      '掌握 Three.js 3D 視覺化技術',
      '建立完整的全端系統思維',
    ],

    // 未來規劃
    futurePlans: [
      '完成 Golang 課程學習',
      '接續完成後端資料爬蟲模組',
      '實作 WebSocket 即時資料推送',
      '開發 React + Three.js 前端視覺化',
      '整合前後端並部署到 GCP',
      '優化效能與使用者體驗',
    ],
  },
];

// 導出統計資訊
export const personalProjectsStats = {
  total: personalProjectsData.length,
  byCategory: personalProjectsData.reduce((stats, project) => {
    stats[project.category] = (stats[project.category] || 0) + 1;
    return stats;
  }, {}),
  byRarity: personalProjectsData.reduce((stats, project) => {
    stats[project.rarity] = (stats[project.rarity] || 0) + 1;
    return stats;
  }, {}),
  byStatus: personalProjectsData.reduce((stats, project) => {
    stats[project.status] = (stats[project.status] || 0) + 1;
    return stats;
  }, {}),
  averageImportance:
    personalProjectsData.reduce((sum, project) => sum + project.importance, 0) /
    personalProjectsData.length,
};

// 導出類別和稀有度映射
export const projectCategories = {
  frontend: { label: '前端開發', icon: '🎨', color: '#61dafb' },
  backend: { label: '後端開發', icon: '⚙️', color: '#68a063' },
  fullstack: { label: '全端開發', icon: '🔧', color: '#f7df1e' },
  mobile: { label: '移動開發', icon: '📱', color: '#a4c639' },
  ai: { label: 'AI/機器學習', icon: '🧠', color: '#ff6f00' },
  blockchain: { label: '區塊鏈', icon: '⛓️', color: '#f7931a' },
};

export const projectRarities = {
  normal: { label: '普通', icon: '⚪', color: '#8e8e8e' },
  rare: { label: '稀有', icon: '🔸', color: '#4169e1' },
  superRare: { label: '超稀有', icon: '💎', color: '#9400d3' },
  legendary: { label: '傳說', icon: '⭐', color: '#ffd700' },
};
