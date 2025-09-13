/**
 * 個人資料配置
 *
 * Config-Driven 個人基本資訊和統計數據
 */

export const personalDataConfig = {
  // 基本資訊
  personal: {
    displayName: '張系統架構師',
    fullName: '張○○',
    jobTitle: 'Senior Backend Engineer → System Architect',
    jobTitleShort: '系統架構師',
    email: 'architect@example.com',
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
      具備 {{totalExperience}} 年軟體開發經驗的後端工程師，專精於系統架構設計、微服務開發和團隊技術領導。
      曾主導多個大型系統的架構設計與重構，擅長將複雜的業務需求轉化為穩固的技術解決方案。
      持續關注技術趨勢，致力於團隊技術成長與最佳實務的推廣。
    `,

    // 職涯資訊
    totalExperience: '6+ 年',
    experienceLevel: 85, // 1-100
    careerStartYear: 2018,
    currentRole: {
      title: 'Senior Backend Engineer',
      company: 'TechCorp Solutions',
      startDate: '2022-03',
      description: '負責微服務架構設計、API 開發與系統效能優化',
    },
  },

  // 統計數據
  stats: {
    // 技能評分 (1-100)
    technical: 88,
    architecture: 82,
    teamwork: 90,
    problemSolving: 85,
    leadership: 78,

    // 專案統計
    projectCount: 25,
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
    totalLinesOfCode: '150k',
    coffeeConsumed: 1200,
    bugsFixed: 2500,
    documentationPages: 180,
    codeReviewsCompleted: 800,

    // 學習統計
    technicalBooksRead: 35,
    onlineCoursesCompleted: 28,
    techTalksAttended: 120,
    opensourceContributions: 45,
  },

  // 職涯發展軌跡
  careerPath: {
    current: 'Senior Backend Engineer',
    target: 'System Architect / Technical Lead',
    progression: [
      {
        level: 'Junior Developer',
        period: '2018-2019',
        focus: '基礎程式設計、框架學習',
        achieved: true,
      },
      {
        level: 'Backend Engineer',
        period: '2020-2021',
        focus: 'API 設計、資料庫優化',
        achieved: true,
      },
      {
        level: 'Senior Backend Engineer',
        period: '2022-現在',
        focus: '架構設計、系統優化、團隊指導',
        achieved: true,
      },
      {
        level: 'System Architect',
        period: '2024-目標',
        focus: '整體架構規劃、技術決策、跨團隊協作',
        achieved: false,
      },
      {
        level: 'Technical Lead',
        period: '2025-目標',
        focus: '技術策略、團隊建構、業務對接',
        achieved: false,
      },
    ],
  },

  // 工作偏好
  workPreferences: {
    workStyle: ['remote-friendly', 'hybrid', 'collaborative'],
    projectTypes: ['backend-systems', 'microservices', 'architecture-design'],
    teamSize: 'medium', // small (2-5), medium (6-12), large (13+)
    industryInterests: ['fintech', 'e-commerce', 'saas', 'startup'],

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
    email: 'architect@example.com',
    phone: '+886-9XX-XXX-XXX', // 隱私保護
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
      '開源專案參與',
      '技術文章撰寫',
      '程式設計競賽',
    ],
    personal: [
      '桌遊策略分析',
      '咖啡品嚐研究',
      '攝影構圖學習',
      '登山健行探索',
      '科幻小說閱讀',
    ],
    learning: [
      '雲端架構認證',
      '領導管理技能',
      '產品思維培養',
      '商業分析能力',
      '英語溝通提升',
    ],
  },

  // 成就和里程碑
  achievements: {
    certifications: [
      {
        name: 'AWS Solutions Architect',
        level: 'Associate',
        year: 2023,
        verification: 'https://verify.aws.com/xxx',
      },
      {
        name: 'Google Cloud Professional',
        level: 'Cloud Architect',
        year: 2022,
        verification: 'https://verify.gcp.com/xxx',
      },
    ],

    awards: [
      {
        title: '最佳技術創新獎',
        organization: 'TechCorp Solutions',
        year: 2023,
        description: '微服務架構優化專案',
      },
      {
        title: '團隊協作卓越獎',
        organization: 'Previous Company',
        year: 2021,
        description: '跨部門 API 整合專案',
      },
    ],

    badges: [
      { name: '架構大師', icon: '🏗️', rarity: 'legendary' },
      { name: 'Bug終結者', icon: '🐛', rarity: 'rare' },
      { name: '代碼工匠', icon: '⚒️', rarity: 'epic' },
      { name: '團隊導師', icon: '👥', rarity: 'rare' },
      { name: '文檔之王', icon: '📚', rarity: 'uncommon' },
    ],
  },
};

export default personalDataConfig;
