/**
 * About 頁面配置數據
 * Step 3.2.1: Config-Driven About Page
 */

/**
 * 頁面標題配置
 */
export const aboutHeaderConfig = {
  title: {
    icon: '👨‍💻',
    text: '關於我',
    subtitle: '後端工程師的成長軌跡'
  },
  description: '從技術探索者到系統架構師的專業發展歷程'
};

/**
 * 職業目標配置
 */
export const careerGoalConfig = {
  title: '🎯 職涯目標',
  goals: [
    {
      primary: '從後端工程師向系統架構師發展',
      description: '專注於大型分散式系統設計與實現'
    },
    {
      primary: '結合遊戲化思維',
      description: '將複雜的技術概念以直覺的方式呈現'
    },
    {
      primary: '持續學習與成長',
      description: '保持對新技術的敏銳度與學習熱忱'
    }
  ],
  theme: {
    bgColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: '#d4af37',
    titleColor: '#d4af37'
  }
};

/**
 * 技術專長配置
 */
export const technicalSkillsConfig = {
  title: '🛠️ 技術專長',
  categories: [
    {
      name: '後端開發',
      icon: '⚙️',
      color: '#2ecc71',
      skills: [
        'Node.js / Express',
        'Python / Django',
        'RESTful API 設計',
        'GraphQL 架構'
      ]
    },
    {
      name: '資料庫',
      icon: '💾',
      color: '#e67e22',
      skills: [
        'MySQL / PostgreSQL',
        'MongoDB / Redis',
        '資料庫優化',
        '分散式資料庫'
      ]
    },
    {
      name: '雲端服務',
      icon: '☁️',
      color: '#3498db',
      skills: [
        'AWS / Azure',
        'Docker / K8s',
        'CI/CD 流程',
        '微服務架構'
      ]
    },
    {
      name: '開發工具',
      icon: '🔧',
      color: '#9b59b6',
      skills: [
        'Git / GitHub',
        'Linux 系統管理',
        '監控與日誌',
        '效能調優'
      ]
    }
  ],
  theme: {
    bgColor: 'rgba(52, 152, 219, 0.1)',
    borderColor: '#3498db',
    titleColor: '#3498db'
  }
};

/**
 * 個人特質配置
 */
export const personalTraitsConfig = {
  title: '🌟 個人特質',
  traits: [
    {
      trait: '問題解決能力',
      description: '善於分析複雜問題並提出有效解決方案',
      level: 90,
      icon: '🧩'
    },
    {
      trait: '學習適應力',
      description: '快速掌握新技術，適應變化的技術環境',
      level: 85,
      icon: '📚'
    },
    {
      trait: '團隊協作',
      description: '積極參與團隊合作，有效溝通協調',
      level: 80,
      icon: '🤝'
    },
    {
      trait: '系統思維',
      description: '從整體架構角度思考和設計技術方案',
      level: 88,
      icon: '🏗️'
    }
  ],
  theme: {
    bgColor: 'rgba(46, 204, 113, 0.1)',
    borderColor: '#2ecc71',
    titleColor: '#2ecc71'
  }
};

/**
 * 頁面佈局配置
 */
export const aboutLayoutConfig = {
  maxWidth: '1200px',
  padding: '2rem',
  sections: [
    {
      id: 'header',
      component: 'AboutHeader',
      order: 1,
      config: aboutHeaderConfig
    },
    {
      id: 'career-goal',
      component: 'CareerGoal', 
      order: 2,
      config: careerGoalConfig
    },
    {
      id: 'technical-skills',
      component: 'TechnicalSkills',
      order: 3,
      config: technicalSkillsConfig
    },
    {
      id: 'personal-traits',
      component: 'PersonalTraits',
      order: 4,
      config: personalTraitsConfig
    }
  ]
};

/**
 * 響應式斷點配置
 */
export const aboutResponsiveConfig = {
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  },
  layout: {
    mobile: {
      padding: '1rem',
      skillColumns: 1,
      traitColumns: 1
    },
    tablet: {
      padding: '1.5rem',
      skillColumns: 2,
      traitColumns: 2
    },
    desktop: {
      padding: '2rem',
      skillColumns: 2,
      traitColumns: 2
    }
  }
};

/**
 * 成就徽章配置
 * Step 3.2.4: Achievement Badges System
 */
export const achievementBadgesConfig = {
  title: '🏆 職業成就',
  achievements: [
    {
      id: 'fullstack-mastery',
      name: '全端掌握者',
      description: '精通前端、後端及數據庫開發',
      icon: '🎯',
      rarity: 'legendary',
      date: '2023-12',
      category: 'technical',
      progress: 100,
      criteria: '掌握完整技術棧開發流程'
    },
    {
      id: 'system-architect',
      name: '系統架構師',
      description: '設計大型分散式系統架構',
      icon: '🏗️',
      rarity: 'epic',
      date: '2024-06',
      category: 'architecture',
      progress: 85,
      criteria: '完成3個以上大型系統架構設計'
    },
    {
      id: 'performance-optimizer',
      name: '效能優化專家',
      description: '系統效能提升超過300%',
      icon: '⚡',
      rarity: 'rare',
      date: '2024-03',
      category: 'optimization',
      progress: 100,
      criteria: '成功優化系統效能至業界標準'
    },
    {
      id: 'team-leader',
      name: '技術領導者',
      description: '帶領團隊完成關鍵專案',
      icon: '👥',
      rarity: 'epic',
      date: '2024-08',
      category: 'leadership',
      progress: 90,
      criteria: '成功領導跨功能團隊交付專案'
    },
    {
      id: 'innovation-pioneer',
      name: '創新先鋒',
      description: '引入創新技術解決方案',
      icon: '💡',
      rarity: 'rare',
      date: '2024-01',
      category: 'innovation',
      progress: 100,
      criteria: '成功導入新技術提升團隊效率'
    },
    {
      id: 'mentorship-master',
      name: '導師典範',
      description: '培養多名技術人才',
      icon: '📚',
      rarity: 'common',
      date: '2023-09',
      category: 'mentorship',
      progress: 75,
      criteria: '指導並培養初級開發者成長'
    }
  ],
  theme: {
    bgColor: 'rgba(155, 89, 182, 0.1)',
    borderColor: '#9b59b6',
    titleColor: '#9b59b6'
  },
  rarityColors: {
    common: '#95a5a6',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#f39c12'
  }
};

/**
 * 技能標籤雲配置
 * Step 3.2.4: Skills Tag Cloud System
 */
export const skillsTagCloudConfig = {
  title: '☁️ 技能星雲',
  description: '技術能力的全方位展現',
  tags: [
    // 後端技術 (大型標籤)
    { name: 'Node.js', level: 9, category: 'backend', color: '#8cc84b' },
    { name: 'Python', level: 8, category: 'backend', color: '#4b8bbe' },
    { name: 'Express', level: 9, category: 'backend', color: '#259dff' },
    { name: 'Django', level: 7, category: 'backend', color: '#44b78b' },
    
    // 資料庫技術 (中大型標籤)
    { name: 'MySQL', level: 8, category: 'database', color: '#5d9dc6' },
    { name: 'MongoDB', level: 7, category: 'database', color: '#6cc065' },
    { name: 'Redis', level: 8, category: 'database', color: '#e85649' },
    { name: 'PostgreSQL', level: 6, category: 'database', color: '#5a9fd4' },
    
    // 雲端與DevOps (中型標籤)
    { name: 'AWS', level: 7, category: 'cloud', color: '#ff9900' },
    { name: 'Docker', level: 8, category: 'devops', color: '#2496ed' },
    { name: 'Kubernetes', level: 6, category: 'devops', color: '#326ce5' },
    { name: 'CI/CD', level: 7, category: 'devops', color: '#fc6d26' },
    
    // 前端技術 (中小型標籤)
    { name: 'JavaScript', level: 9, category: 'frontend', color: '#f7df1e' },
    { name: 'React', level: 7, category: 'frontend', color: '#61dafb' },
    { name: 'Vue.js', level: 6, category: 'frontend', color: '#4fc08d' },
    { name: 'HTML5', level: 8, category: 'frontend', color: '#ff6c37' },
    { name: 'CSS3', level: 7, category: 'frontend', color: '#42a5f5' },
    
    // 工具與技術 (小型標籤)
    { name: 'Git', level: 9, category: 'tools', color: '#f05032' },
    { name: 'Linux', level: 8, category: 'tools', color: '#fcc624' },
    { name: 'GraphQL', level: 6, category: 'api', color: '#e535ab' },
    { name: 'RESTful', level: 9, category: 'api', color: '#85ea2d' },
    { name: 'Microservices', level: 7, category: 'architecture', color: '#ff6b6b' },
    { name: 'System Design', level: 8, category: 'architecture', color: '#4ecdc4' },
    
    // 新興技術 (小型標籤)
    { name: 'WebSocket', level: 7, category: 'realtime', color: '#00b4d8' },
    { name: 'Serverless', level: 5, category: 'cloud', color: '#fd8c00' },
    { name: 'Event Sourcing', level: 6, category: 'architecture', color: '#ff6384' }
  ],
  theme: {
    bgColor: 'rgba(52, 73, 94, 0.1)',
    borderColor: '#34495e',
    titleColor: '#34495e'
  },
  animation: {
    hover: {
      scale: 1.2,
      duration: '0.3s',
      easing: 'ease-out'
    },
    float: {
      enabled: true,
      amplitude: '5px',
      duration: '3s'
    }
  }
};

/**
 * 動畫配置
 */
export const aboutAnimationConfig = {
  fadeIn: {
    duration: '0.6s',
    easing: 'ease-out',
    delay: '0.1s'
  },
  slideUp: {
    duration: '0.5s',
    easing: 'ease-out',
    distance: '30px'
  },
  progressBar: {
    duration: '1.5s',
    easing: 'ease-out',
    delay: '0.3s'
  }
};

/**
 * 統一導出配置
 */
export default {
  header: aboutHeaderConfig,
  careerGoal: careerGoalConfig,
  technicalSkills: technicalSkillsConfig,
  personalTraits: personalTraitsConfig,
  achievementBadges: achievementBadgesConfig,
  skillsTagCloud: skillsTagCloudConfig,
  layout: aboutLayoutConfig,
  responsive: aboutResponsiveConfig,
  animation: aboutAnimationConfig
};