/**
 * 社交連結數據配置
 *
 * Config-Driven 社交平台和專業檔案連結配置
 */

export const socialDataConfig = {
  // 主要社交平台
  platforms: [
    {
      id: 'github',
      name: 'GitHub',
      icon: '💻',
      url: 'https://github.com/a9293340',
      username: '@a9293340',
      description: '個人專案與代碼作品',
      color: '#333333',
      category: 'professional',
      priority: 1,

      stats: {
        repositories: '10+',
        contributions: '持續貢獻中',
      },

      highlights: [
        '10+ 個人專案',
        '持續學習與實踐',
        '涵蓋前後端開發',
        '展現技術廣度',
      ],
    },

    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://www.linkedin.com/in/eric-hong-cv/',
      username: '洪雋倫 (Eric Hung)',
      description: '專業經歷與技能背景',
      color: '#0077B5',
      category: 'professional',
      priority: 2,

      highlights: [
        '5+ 年軟體開發經驗',
        '後端工程師 → 系統架構師',
        '完整技術棧展現',
        '職業發展歷程',
      ],
    },

    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      url: 'mailto:f102041332@gmail.com',
      username: 'f102041332@gmail.com',
      description: '直接聯絡方式',
      color: '#EA4335',
      category: 'contact',
      priority: 3,

      responseTime: '24-48 hours',
      availability: '工作日優先回覆',

      contactTypes: [
        '工作機會討論',
        '技術合作提案',
        '技術諮詢服務',
        '專案協作',
      ],
    },
  ],

  // 專業檔案分類
  professionalProfiles: {
    development: {
      name: '開發平台',
      platforms: [
        {
          name: 'GitHub',
          url: 'https://github.com/a9293340',
          type: 'code-repository',
          primaryUse: '個人專案展示與代碼作品',
        },
      ],
    },

    professional: {
      name: '職業網路',
      platforms: [
        {
          name: 'LinkedIn',
          url: 'https://www.linkedin.com/in/eric-hong-cv/',
          type: 'professional-network',
          primaryUse: '職業發展與專業經歷',
        },
      ],
    },
  },

  // 聯絡偏好設定
  contactPreferences: {
    primary: 'email',
    secondary: 'linkedin',

    responseTimeExpectations: {
      urgent: 'LinkedIn message - 當日回覆',
      normal: 'Email - 24-48 hours',
    },

    preferredTopics: [
      '工作機會討論',
      '技術合作提案',
      '系統架構諮詢',
      '專案協作',
    ],

    notPreferredTopics: ['銷售推銷', '無關技術話題'],
  },

  // 社交媒體策略
  contentStrategy: {
    github: {
      focus: '個人專案與技術實踐',
      topics: ['backend', 'frontend', 'fullstack'],
    },

    linkedin: {
      focus: '職業發展與專業經歷',
      topics: ['職涯發展', '技術成長', '專案經驗'],
    },
  },

  // 隱私設定
  privacySettings: {
    publicProfile: true,
    showEmail: true,
    showPhone: false,
    showLocation: true, // 城市層級
    showDetailedLocation: false, // 具體地址

    dataSharing: {
      allowContactExport: false,
      allowAnalytics: true,
      allowRecommendations: true,
    },
  },
};

export default socialDataConfig;
