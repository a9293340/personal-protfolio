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
      url: 'https://github.com/username',
      username: '@username',
      description: '開源專案與代碼作品',
      color: '#333333',
      category: 'professional',
      priority: 1,

      stats: {
        followers: '500+',
        repositories: 45,
        contributions: '2k+',
        stars: '1.2k+',
      },

      highlights: [
        '45+ 開源專案',
        '2000+ commits',
        '多個 100+ stars 專案',
        '活躍開源貢獻者',
      ],
    },

    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/in/username',
      username: '張系統架構師',
      description: '專業經歷與技能背景',
      color: '#0077B5',
      category: 'professional',
      priority: 2,

      stats: {
        connections: '800+',
        endorsements: 150,
        recommendations: 25,
      },

      highlights: [
        '800+ 專業人脈',
        '技能背書 150+',
        '推薦信 25 封',
        '技術文章分享',
      ],
    },

    {
      id: 'medium',
      name: 'Medium',
      icon: '📝',
      url: 'https://medium.com/@username',
      username: '@username',
      description: '技術文章與經驗分享',
      color: '#00AB6C',
      category: 'content',
      priority: 3,

      stats: {
        followers: '300+',
        articles: 25,
        views: '50k+',
        claps: '2k+',
      },

      highlights: [
        '25 篇技術文章',
        '50k+ 總閱讀量',
        '系統架構專欄',
        '後端開發分享',
      ],
    },

    {
      id: 'stackoverflow',
      name: 'Stack Overflow',
      icon: '❓',
      url: 'https://stackoverflow.com/users/username',
      username: 'username',
      description: '技術問答與社群參與',
      color: '#F58025',
      category: 'community',
      priority: 4,

      stats: {
        reputation: '5k+',
        answers: 120,
        questions: 35,
        badges: 15,
      },

      highlights: [
        '聲望值 5000+',
        '120 個回答',
        'Python/Django 專家',
        '15 個徽章獲得',
      ],
    },

    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/username',
      username: '@username',
      description: '技術趨勢討論與生活分享',
      color: '#1DA1F2',
      category: 'social',
      priority: 5,

      stats: {
        followers: '200+',
        tweets: 800,
        engagement: 'high',
      },

      highlights: [
        '技術趨勢分享',
        '開發日常記錄',
        '社群互動參與',
        '業界動態追蹤',
      ],
    },

    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      url: 'mailto:architect@example.com',
      username: 'architect@example.com',
      description: '直接聯絡方式',
      color: '#EA4335',
      category: 'contact',
      priority: 6,

      responseTime: '24-48 hours',
      availability: '工作日優先回覆',

      contactTypes: [
        '職涯機會討論',
        '技術合作提案',
        '顧問諮詢服務',
        '演講邀請',
        '開源協作',
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
          type: 'code-repository',
          primaryUse: '代碼托管與開源協作',
        },
        {
          name: 'GitLab',
          url: 'https://gitlab.com/username',
          type: 'code-repository',
          primaryUse: '私人專案與 CI/CD',
        },
      ],
    },

    professional: {
      name: '職業網路',
      platforms: [
        {
          name: 'LinkedIn',
          type: 'professional-network',
          primaryUse: '職業發展與人脈建立',
        },
        {
          name: 'AngelList',
          url: 'https://angel.co/username',
          type: 'startup-network',
          primaryUse: '新創公司機會',
        },
      ],
    },

    content: {
      name: '內容創作',
      platforms: [
        {
          name: 'Medium',
          type: 'blog-platform',
          primaryUse: '長文技術分享',
        },
        {
          name: 'Dev.to',
          url: 'https://dev.to/username',
          type: 'dev-community',
          primaryUse: '開發者社群互動',
        },
      ],
    },

    learning: {
      name: '學習平台',
      platforms: [
        {
          name: 'Coursera',
          url: 'https://coursera.org/user/username',
          type: 'learning-platform',
          achievements: '5 個專業認證',
        },
        {
          name: 'Udemy',
          type: 'learning-platform',
          achievements: '15 門課程完成',
        },
      ],
    },
  },

  // 聯絡偏好設定
  contactPreferences: {
    primary: 'email',
    secondary: 'linkedin',

    responseTimeExpectations: {
      urgent: 'LinkedIn message - 4-8 hours',
      normal: 'Email - 24-48 hours',
      casual: 'Twitter/Social - 1-3 days',
    },

    preferredTopics: [
      '系統架構討論',
      '技術合作機會',
      '職涯發展諮詢',
      '開源專案協作',
      '演講邀請',
      '顧問服務',
    ],

    notPreferredTopics: ['銷售推銷', '無關技術話題', '緊急但非技術問題'],
  },

  // 社交媒體策略
  contentStrategy: {
    github: {
      focus: '高品質開源專案',
      frequency: '每週 3-5 commits',
      topics: ['backend', 'architecture', 'tools'],
    },

    medium: {
      focus: '深度技術文章',
      frequency: '每月 2-3 篇',
      topics: ['系統設計', '最佳實踐', '經驗總結'],
    },

    linkedin: {
      focus: '專業動態分享',
      frequency: '每週 1-2 次',
      topics: ['職涯發展', '技術趨勢', '團隊管理'],
    },

    twitter: {
      focus: '即時想法分享',
      frequency: '每天 1-2 次',
      topics: ['技術新聞', '開發心得', '生活感悟'],
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
