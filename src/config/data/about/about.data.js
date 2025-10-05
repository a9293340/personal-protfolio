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
    subtitle: '後端工程師的成長軌跡',
  },
  description: '從技術探索者到系統架構師的專業發展歷程',
};

/**
 * 職業目標配置
 */
export const careerGoalConfig = {
  title: '🎯 職涯目標',
  goals: [
    {
      primary: '從後端工程師向系統架構師發展',
      description: '專注於大型分散式系統設計與實現',
    },
    {
      primary: '結合遊戲化思維',
      description: '將複雜的技術概念以直覺的方式呈現',
    },
    {
      primary: '持續學習與成長',
      description: '保持對新技術的敏銳度與學習熱忱',
    },
  ],
  theme: {
    bgColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: '#d4af37',
    titleColor: '#d4af37',
  },
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
        'Node.js / Express / Fastify',
        'Go / Gin',
        'Python / Django',
        'RESTful API 設計',
        '後端架構設計',
        'Docker 容器化',
      ],
    },
    {
      name: '資料庫',
      icon: '💾',
      color: '#e67e22',
      skills: [
        'MySQL / PostgreSQL',
        'MongoDB / Redis',
        '資料庫優化',
        '分散式資料庫',
      ],
    },
    {
      name: '雲端服務',
      icon: '☁️',
      color: '#3498db',
      skills: ['AWS / GCP', 'Docker / K8s', 'CI/CD 流程', '微服務架構'],
    },
    {
      name: '開發工具',
      icon: '🔧',
      color: '#9b59b6',
      skills: ['Git / GitHub', 'Linux 系統管理', '監控與日誌', '效能調優'],
    },
  ],
  theme: {
    bgColor: 'rgba(52, 152, 219, 0.1)',
    borderColor: '#3498db',
    titleColor: '#3498db',
  },
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
      icon: '🧩',
    },
    {
      trait: '學習適應力',
      description: '快速掌握新技術，適應變化的技術環境',
      level: 85,
      icon: '📚',
    },
    {
      trait: '團隊協作',
      description: '積極參與團隊合作，有效溝通協調',
      level: 80,
      icon: '🤝',
    },
    {
      trait: '系統思維',
      description: '從整體架構角度思考和設計技術方案',
      level: 88,
      icon: '🏗️',
    },
  ],
  theme: {
    bgColor: 'rgba(46, 204, 113, 0.1)',
    borderColor: '#2ecc71',
    titleColor: '#2ecc71',
  },
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
      config: aboutHeaderConfig,
    },
    {
      id: 'career-goal',
      component: 'CareerGoal',
      order: 2,
      config: careerGoalConfig,
    },
    {
      id: 'technical-skills',
      component: 'TechnicalSkills',
      order: 3,
      config: technicalSkillsConfig,
    },
    {
      id: 'personal-traits',
      component: 'PersonalTraits',
      order: 4,
      config: personalTraitsConfig,
    },
  ],
};

/**
 * 響應式斷點配置
 */
export const aboutResponsiveConfig = {
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  layout: {
    mobile: {
      padding: '1rem',
      skillColumns: 1,
      traitColumns: 1,
    },
    tablet: {
      padding: '1.5rem',
      skillColumns: 2,
      traitColumns: 2,
    },
    desktop: {
      padding: '2rem',
      skillColumns: 2,
      traitColumns: 2,
    },
  },
};

/**
 * 成就徽章配置
 * Step 3.2.4: Achievement Badges System
 */
export const achievementBadgesConfig = {
  title: '🏆 職業成就',
  achievements: [
    {
      id: 'ai-pioneer',
      name: 'AI 導入先鋒',
      description: '成功導入 AI Code Review 系統，團隊效率提升 30%',
      icon: '🤖',
      rarity: 'legendary',
      date: '2025-08',
      category: 'innovation',
      progress: 100,
      criteria: '成功導入 AI 工具並量化提升團隊效率',
    },
    {
      id: 'high-concurrency-architect',
      name: '高併發架構設計者',
      description: '設計日均 20 萬筆連結生成系統，99.95% 可用性',
      icon: '⚡',
      rarity: 'legendary',
      date: '2025-07',
      category: 'architecture',
      progress: 100,
      criteria: '設計並實現高併發、高可用性系統',
    },
    {
      id: 'system-refactor-master',
      name: '系統重構大師',
      description: '重構內部管理系統，流程效率提升 2 倍',
      icon: '🔧',
      rarity: 'epic',
      date: '2023-06',
      category: 'optimization',
      progress: 100,
      criteria: '成功重構系統並顯著提升效能',
    },
    {
      id: 'code-quality-advocate',
      name: '代碼品質倡導者',
      description: '建立團隊代碼規範，推動 Code Review 文化，提升整體代碼品質',
      icon: '⚒️',
      rarity: 'rare',
      date: '2024-06',
      category: 'technical',
      progress: 100,
      criteria: '建立代碼標準並推動最佳實踐',
    },
    {
      id: 'problem-solver',
      name: '問題解決專家',
      description: '快速定位關鍵問題根因，提出系統性解決方案，預防問題再發生',
      icon: '🎯',
      rarity: 'rare',
      date: '2024-10',
      category: 'quality',
      progress: 100,
      criteria: '系統性解決問題並建立預防機制',
    },
    {
      id: 'documentation-master',
      name: '文檔達人',
      description: '撰寫 180+ 頁技術文檔，提升團隊協作效率',
      icon: '📚',
      rarity: 'uncommon',
      date: '2024-05',
      category: 'collaboration',
      progress: 100,
      criteria: '撰寫完整技術文檔協助團隊',
    },
  ],
  theme: {
    bgColor: 'rgba(155, 89, 182, 0.1)',
    borderColor: '#9b59b6',
    titleColor: '#9b59b6',
  },
  rarityColors: {
    common: '#95a5a6',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#f39c12',
  },
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
    { name: 'golang', level: 5, category: 'backend', color: '#4b8bbe' },
    { name: 'Express', level: 8, category: 'backend', color: '#259dff' },
    { name: 'Fastify', level: 8.5, category: 'backend', color: '#44b78b' },

    // 資料庫技術 (中大型標籤)
    { name: 'MySQL', level: 7, category: 'database', color: '#5d9dc6' },
    { name: 'MongoDB', level: 8, category: 'database', color: '#6cc065' },
    { name: 'Redis', level: 8, category: 'database', color: '#e85649' },
    { name: 'PostgreSQL', level: 6, category: 'database', color: '#5a9fd4' },

    // 雲端與DevOps (中型標籤)
    { name: 'AWS', level: 5, category: 'cloud', color: '#ff9900' },
    { name: 'GCP', level: 8, category: 'cloud', color: '#ff9900' },
    { name: 'Docker', level: 8, category: 'devops', color: '#2496ed' },
    { name: 'Kubernetes', level: 6, category: 'devops', color: '#326ce5' },
    { name: 'CI/CD', level: 7, category: 'devops', color: '#fc6d26' },

    // 前端技術 (中小型標籤)
    { name: 'JavaScript', level: 9, category: 'frontend', color: '#f7df1e' },
    { name: 'React', level: 4, category: 'frontend', color: '#61dafb' },
    { name: 'Vue.js', level: 8, category: 'frontend', color: '#4fc08d' },
    { name: 'HTML5', level: 7, category: 'frontend', color: '#ff6c37' },
    { name: 'CSS3', level: 7, category: 'frontend', color: '#42a5f5' },

    // 工具與技術 (小型標籤)
    { name: 'Git', level: 9, category: 'tools', color: '#f05032' },
    { name: 'Linux', level: 7, category: 'tools', color: '#fcc624' },
    { name: 'GraphQL', level: 6, category: 'api', color: '#e535ab' },
    { name: 'RESTful', level: 9, category: 'api', color: '#85ea2d' },
    {
      name: 'Microservices',
      level: 6,
      category: 'architecture',
      color: '#ff6b6b',
    },
    {
      name: 'System Design',
      level: 7.5,
      category: 'architecture',
      color: '#4ecdc4',
    },

    // 新興技術 (小型標籤)
    { name: 'WebSocket', level: 7, category: 'realtime', color: '#00b4d8' },
    { name: 'Serverless', level: 6, category: 'cloud', color: '#fd8c00' },
    {
      name: 'Event Sourcing',
      level: 6,
      category: 'architecture',
      color: '#ff6384',
    },
  ],
  theme: {
    bgColor: 'rgba(52, 73, 94, 0.1)',
    borderColor: '#34495e',
    titleColor: '#34495e',
  },
  animation: {
    hover: {
      scale: 1.2,
      duration: '0.3s',
      easing: 'ease-out',
    },
    float: {
      enabled: true,
      amplitude: '5px',
      duration: '3s',
    },
  },
};

/**
 * 動畫配置
 */
export const aboutAnimationConfig = {
  fadeIn: {
    duration: '0.6s',
    easing: 'ease-out',
    delay: '0.1s',
  },
  slideUp: {
    duration: '0.5s',
    easing: 'ease-out',
    distance: '30px',
  },
  progressBar: {
    duration: '1.5s',
    easing: 'ease-out',
    delay: '0.3s',
  },
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
  animation: aboutAnimationConfig,
};
