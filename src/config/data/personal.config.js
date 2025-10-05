/**
 * 個人資料配置
 *
 * Config-Driven 個人基本資訊和統計數據
 */

export const personalDataConfig = {
  // 基本資訊
  personal: {
    displayName: '資深後端工程師',
    fullName: '洪雋倫',
    jobTitle: 'Senior Backend Engineer',
    jobTitleShort: '後端工程師',
    email: 'f102041332@gmail.com',
    location: '台北, 台灣',
    timezone: 'Asia/Taipei (UTC+8)',

    // 頭像和圖片
    avatarImage: '/assets/images/avatar-professional.jpg',
    avatarImageGaming: '/assets/images/avatar-gaming-character.png',
    profileBanner: '/assets/images/profile-banner.jpg',

    // 個人描述
    tagline: '從程式碼到架構，從問題到解決方案',
    shortBio:
      '專精於後端系統設計與架構優化的工程師，致力於打造高可用性、可擴展的系統解決方案。',
    fullBio: `
      具備 {{totalExperience}} 年軟體開發經驗，從全端工程師（2年）深化為後端專家（3年），專精於系統架構設計、微服務開發與桌面應用程式。

      核心專案經驗包含：Scanner 配置工具（Desktop App）、公司內部管理系統（CMS）、智慧連結轉導系統（Deeplink & 短網址服務，日均 20 萬筆連結生成）。

      現任公司 AI Owner，負責部門 AI Code Review 系統導入、Prompt 與 Rules 管理，成功提升團隊工作效率 30%。

      目前專注於自定義電商平台（SaaS）開發，擔任後端架構設計核心角色，負責 API 設計、前後端協作、效能優化與雲端系統架構強化。
    `,

    // 職涯資訊
    totalExperience: '5+ 年',
    experienceLevel: 85, // 1-100
    careerStartYear: 2018,
    currentRole: {
      title: 'Senior Backend Engineer',
      company: 'TechCorp Solutions',
      startDate: '2022-03',
      description: '負責後端及系統架構設計、API 開發與系統效能優化',
    },
  },

  // 統計數據
  stats: {
    // 技能評分 (1-100)
    technical: 88,
    architecture: 82,
    teamwork: 87,
    problemSolving: 85,
    leadership: 78,

    // 專案統計
    projectCount: 18,
    majorProjectCount: 8,
    techStackCount: 15,
    maxTeamSize: 12,

    // 技能進度
    skillProgress: {
      overall: 82,
      backend: 90,
      architecture: 75,
      devops: 70,
      frontend: 45,
    },

    // 趣味統計
    totalLinesOfCode: '300k+',
    coffeeConsumed: 1200,
    bugsFixed: 1500,
    documentationPages: 180,
    codeReviewsCompleted: 800,

    // 學習統計
    technicalBooksRead: 35,
    onlineCoursesCompleted: 28,
    techTalksAttended: 120,
    opensourceContributions: 20,
  },

  // 職涯發展軌跡
  careerPath: {
    current: 'Senior Backend Engineer',
    target: 'System Architect / Technical Lead',
    progression: [
      {
        level: 'Junior Developer',
        period: '2019-2020',
        focus: '基礎程式設計、框架學習，並於資策會結訓(前端班)',
        achieved: true,
      },
      {
        level: 'Frontend Engineer & Desktop App Developer',
        period: '2020-2021',
        focus: '前端開發、API 設計、資料庫優化',
        achieved: true,
      },
      {
        level: 'Fullstack Engineer',
        period: '2021-2023',
        focus: '後端架構設計、開始嘗試接觸雲服務系統(AWS)',
        achieved: true,
      },
      {
        level: 'Senior Backend Engineer',
        period: '2023-2025',
        focus: '後端架構設計、雲服務整合、大型專案負責人、Ai 導入專案',
        achieved: true,
      },
      {
        level: 'System Architect',
        period: '未來',
        focus: '系統架構設計、技術決策、跨團隊協作',
        achieved: false,
      },
    ],
  },

  // 工作偏好
  workPreferences: {
    workStyle: ['remote-friendly', 'hybrid', 'collaborative'],
    projectTypes: [
      'backend-systems',
      'microservices',
      'architecture-design',
      'ai-application',
    ],
    teamSize: 'medium', // small (2-5), medium (6-12), large (13+)
    industryInterests: ['fintech', 'e-commerce', 'saas', 'startup', 'ai'],

    idealRole: {
      responsibilities: [
        '系統架構設計與規劃',
        '技術選型與決策制定',
        '團隊技術指導與成長',
        '跨部門技術協作',
        '系統效能監控與優化',
      ],
      environment: '創新導向的技術團隊',
      growthOpportunities: [
        '架構設計經驗累積',
        '技術領導能力培養',
        '業務理解深度提升',
        '跨領域技術學習',
      ],
    },
  },

  // 聯絡資訊
  contact: {
    email: 'f102041332@gmail.com',
    phone: '+886-921-442-663', // 隱私保護
    preferredContactMethod: 'email',
    responseTime: '24-48 hours',
    availability: {
      timezone: 'Asia/Taipei',
      workingHours: '09:00-18:00',
      flexibleMeeting: true,
    },
  },

  // 興趣和嗜好
  interests: {
    technical: [
      '系統架構模式研究',
      '新興技術趨勢追蹤',
      '開發 side project，讓程式與生活接軌',
      '研究新語言、新框架，目前正在與 golang 糾纏中',
      'AI 應用開發，時常與 AI 打交道，學習、寫 code、探索各種應用，幾乎比老婆還更常聊',
    ],
    personal: ['集換式卡牌遊戲', '出國旅遊', '烹飪', '科幻小說閱讀'],
    learning: [
      '雲端架構認證',
      '專案管理技能',
      '產品思維培養',
      '商業分析能力',
      '英語溝通提升',
    ],
  },

  // 成就和里程碑
  achievements: {
    // 技能認證
    certifications: [
      {
        name: '資策會前端工程師結訓',
        type: 'training',
        year: 2019,
        description: '完成前端開發專業培訓課程',
      },
      {
        name: '公司內部 AI Owner 認證',
        type: 'internal',
        year: 2024,
        description: '負責部門 AI 工具導入與優化，提升團隊效率 30%',
      },
    ],

    // 重大專案成就
    majorAchievements: [
      {
        title: '🤖 AI 導入先鋒',
        description: '成功導入 AI Code Review 系統，改善部門開發流程',
        year: 2024,
        impact: 'high',
        metrics: '團隊工作效率提升 30%',
      },
      {
        title: '⚡ 高併發智慧連結系統',
        description:
          '設計並實現智慧連結轉導與短網址服務，支援日均 20 萬筆連結生成，提供完整導流追蹤分析',
        year: 2025,
        impact: 'high', // 從 medium 提升到 high（日均 20 萬筆很亮眼）
        metrics:
          '99.95% 成功率、P99 延遲 < 100ms、90% 轉導成功率、完整漏斗追蹤',
      },
      {
        title: '🔧 系統重構大師',
        description: '重構公司內部管理系統，提升系統穩定性與維護性',
        year: 2023,
        impact: 'medium',
        metrics: '公司內部行政流程效率提升 2 倍，並改善部門溝通效率',
      },
    ],

    // 成就徽章（遊戲化風格）
    badges: [
      {
        name: 'AI 導入先鋒',
        icon: '🤖',
        rarity: 'legendary',
        description: '成功導入 AI Code Review 系統，團隊效率提升 30%',
      },
      {
        name: '高併發架構師',
        icon: '⚡',
        rarity: 'legendary',
        description: '設計日均 20 萬筆連結生成系統，99.95% 可用性',
      },
      {
        name: '系統重構大師',
        icon: '🔧',
        rarity: 'epic',
        description: '重構內部管理系統，流程效率提升 2 倍',
      },
      {
        name: '代碼品質倡導者',
        icon: '⚒️',
        rarity: 'rare',
        description: '建立團隊代碼規範，推動 Code Review 文化',
      },
      {
        name: '問題解決專家',
        icon: '🎯',
        rarity: 'rare',
        description: '快速定位根因，提出系統性解決方案',
      },
      {
        name: '文檔達人',
        icon: '📚',
        rarity: 'uncommon',
        description: '撰寫 180+ 頁技術文檔，提升團隊協作效率',
      },
    ],
  },
};

export default personalDataConfig;
