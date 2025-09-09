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
  layout: aboutLayoutConfig,
  responsive: aboutResponsiveConfig,
  animation: aboutAnimationConfig
};