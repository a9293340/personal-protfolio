/**
 * RPG 角色系統配置數據
 * Step 3.2.2: RPG Character Panel Configuration
 */

/**
 * 角色基本信息配置
 */
export const characterInfoConfig = {
  // 多階段職業發展系統
  careerProgression: {
    title: '職業發展歷程',
    stages: [
      {
        job: 'Junior Developer',
        icon: '🎓',
        level: 1,
        period: '2019-2020',
        status: 'completed',
        description: '基礎程式設計、框架學習，資策會前端班結訓',
      },
      {
        job: 'Frontend Engineer & Desktop App Developer',
        icon: '🎨',
        level: 3,
        period: '2020-2021',
        status: 'completed',
        description: '前端開發、API 設計、資料庫優化',
      },
      {
        job: 'Fullstack Engineer',
        icon: '🔧',
        level: 5,
        period: '2021-2023',
        status: 'completed',
        description: '後端架構設計、開始嘗試接觸雲服務系統 (AWS)',
      },
      {
        job: 'Senior Backend Engineer',
        icon: '👨‍💻',
        level: 8,
        period: '2023-2025',
        status: 'current',
        description:
          '後端架構設計、雲服務整合(GCP)、大型專案負責人、AI 導入專案',
      },
      {
        job: 'System Architect',
        icon: '🏗️',
        level: 1,
        period: '未來',
        status: 'target',
        description: '系統架構設計、技術決策、跨團隊協作',
      },
    ],
    transitionDate: '2025-01-15',
  },

  // 整體角色經驗系統 (用於職業轉換)
  overallExperience: {
    current: 23500, // 總經驗值
    required: 30000, // 下次轉職所需
    gainRate: 200, // 每月獲得經驗
    sources: [
      { type: 'project_completion', exp: 800, description: '完成專案' },
      { type: 'skill_mastery', exp: 500, description: '掌握新技能' },
      { type: 'mentoring', exp: 300, description: '指導團隊' },
      { type: 'innovation', exp: 600, description: '技術創新' },
    ],
  },

  // 六大技能領域系統 (基於 skills.data.js)
  skillDomains: {
    title: '六大技能領域',
    domains: {
      backend: {
        name: '後端工程領域',
        icon: '⚡',
        color: '#3498db',
        currentLevel: 6,
        maxLevel: 10,
        experience: 7500,
        maxExperience: 10000,
        description: '服務器端開發、API設計、系統邏輯實現',
      },
      architecture: {
        name: '系統架構設計領域',
        icon: '🏗️',
        color: '#1abc9c',
        currentLevel: 3,
        maxLevel: 10,
        experience: 2800,
        maxExperience: 5000,
        description: '系統設計、架構模式、擴展性規劃',
      },
      database: {
        name: '資料庫工程領域',
        icon: '🗄️',
        color: '#2ecc71',
        currentLevel: 5,
        maxLevel: 10,
        experience: 4200,
        maxExperience: 7500,
        description: '數據存儲、查詢優化、架構設計',
      },
      devops: {
        name: '雲端服務與 DevOps',
        icon: '⚙️',
        color: '#9b59b6',
        currentLevel: 4,
        maxLevel: 10,
        experience: 3600,
        maxExperience: 6000,
        description: '持續整合、容器化、基礎設施管理',
      },
      ai: {
        name: 'AI 工程應用領域',
        icon: '🤖',
        color: '#f39c12',
        currentLevel: 4,
        maxLevel: 10,
        experience: 3200,
        maxExperience: 6000,
        description: 'AI工具整合、Prompt Engineering、智能化應用',
      },
      frontend: {
        name: '前端開發領域',
        icon: '🎨',
        color: '#e74c3c',
        currentLevel: 4,
        maxLevel: 10,
        experience: 3000,
        maxExperience: 6000,
        description: '用戶界面開發、互動設計、前端框架',
      },
    },
  },
};

/**
 * RPG 屬性系統配置
 */
export const characterAttributesConfig = {
  attributes: {
    attack: {
      value: 85,
      name: '攻擊力',
      description: '代碼實現能力',
      icon: '⚔️',
      color: '#e74c3c',
      category: 'technical',
      baseValue: 70,
      bonuses: [
        { source: 'Node.js 精通', bonus: 8 },
        { source: 'API 設計經驗', bonus: 5 },
        { source: '優化實戰', bonus: 2 },
      ],
    },
    defense: {
      value: 90,
      name: '防禦力',
      description: '系統穩定性',
      icon: '🛡️',
      color: '#3498db',
      category: 'technical',
      baseValue: 75,
      bonuses: [
        { source: '錯誤處理', bonus: 8 },
        { source: '測試覆蓋', bonus: 4 },
        { source: '監控告警', bonus: 3 },
      ],
    },
    agility: {
      value: 88,
      name: '敏捷度',
      description: '學習適應力',
      icon: '⚡',
      color: '#f39c12',
      category: 'personal',
      baseValue: 80,
      bonuses: [
        { source: '快速學習', bonus: 5 },
        { source: '技術敏感度', bonus: 3 },
      ],
    },
    intelligence: {
      value: 92,
      name: '智力',
      description: '架構思維',
      icon: '🧠',
      color: '#9b59b6',
      category: 'mental',
      baseValue: 85,
      bonuses: [
        { source: '系統思維', bonus: 4 },
        { source: '抽象能力', bonus: 3 },
      ],
    },
    charisma: {
      value: 85,
      name: '魅力',
      description: '團隊協作',
      icon: '🤝',
      color: '#2ecc71',
      category: 'social',
      baseValue: 75,
      bonuses: [
        { source: '溝通能力', bonus: 6 },
        { source: '領導經驗', bonus: 4 },
      ],
    },
    luck: {
      value: 90,
      name: '幸運',
      description: '問題解決',
      icon: '🎯',
      color: '#1abc9c',
      category: 'special',
      baseValue: 82,
      bonuses: [
        { source: 'Debug 直覺', bonus: 5 },
        { source: '解決方案靈感', bonus: 3 },
      ],
    },
  },

  // 屬性成長配置
  growth: {
    perLevel: {
      attack: 2,
      defense: 3,
      agility: 1,
      intelligence: 3,
      charisma: 2,
      luck: 1,
    },
    caps: {
      attack: 100,
      defense: 100,
      agility: 100,
      intelligence: 100,
      charisma: 100,
      luck: 100,
    },
  },
};

/**
 * 職業特色技能配置
 */
export const jobSkillsConfig = {
  // 後端工程師技能樹
  backendEngineer: {
    jobName: '後端工程師',
    coreSkills: [
      'API 設計與實現',
      '資料庫設計與優化',
      '服務端架構',
      'RESTful 服務開發',
    ],
    specialization: [
      'Node.js 生態系統',
      'Python 全端開發',
      'Docker 容器化',
      'Redis 快取策略',
    ],
    achievements: [
      '完成 15+ 後端專案',
      'API 響應時間優化 60%',
      '資料庫查詢效能提升 3倍',
      '團隊代碼規範制定',
    ],
  },

  // 系統架構師技能樹
  systemArchitect: {
    jobName: '系統架構師',
    coreSkills: [
      '分散式系統設計',
      '微服務架構',
      '系統容量規劃',
      '技術選型決策',
    ],
    developing: [
      'K8s 容器編排',
      '服務網格架構',
      '事件驅動架構',
      '雲原生設計模式',
    ],
    plannedSkills: [
      '大數據架構',
      '機器學習基礎設施',
      'DevOps 流程設計',
      '性能監控體系',
    ],
  },
};

/**
 * 等級系統配置
 */
export const levelSystemConfig = {
  experienceTable: [
    { level: 1, required: 0, total: 0 },
    { level: 2, required: 10000, total: 10000 },
    { level: 3, required: 15000, total: 25000 },
    { level: 4, required: 22000, total: 47000 },
    { level: 5, required: 30000, total: 77000 },
    { level: 6, required: 40000, total: 117000 },
    { level: 7, required: 50000, total: 167000 },
    { level: 8, required: 65000, total: 232000 },
    { level: 9, required: 80000, total: 312000 },
    { level: 10, required: 100000, total: 412000 },
  ],

  // 升級獎勵
  levelRewards: {
    2: { skillPoints: 2, attributeBonus: { intelligence: 1 } },
    3: { skillPoints: 2, attributeBonus: { defense: 1 } },
    4: { skillPoints: 3, attributeBonus: { attack: 1, charisma: 1 } },
    5: { skillPoints: 3, specialAbility: 'architecture_insight' },
  },

  // 轉職要求
  jobTransition: {
    requirements: {
      level: 8,
      keySkills: ['系統思維', 'API 設計', '團隊協作'],
      experience: 232000,
      projects: 15,
    },
    benefits: {
      newSkillTree: 'systemArchitect',
      attributeReset: false,
      bonusSkillPoints: 5,
      specialAbilities: ['系統設計', '架構評估'],
    },
  },
};

/**
 * 視覺效果配置
 */
export const visualEffectsConfig = {
  // 色彩主題
  colorTheme: {
    primary: '#d4af37', // 主要金色
    secondary: '#f4d03f', // 亮金色
    background: 'rgba(26, 26, 46, 0.95)',
    cardBackground: 'rgba(212, 175, 55, 0.1)',

    // 屬性色彩
    attributeColors: {
      attack: '#e74c3c',
      defense: '#3498db',
      agility: '#f39c12',
      intelligence: '#9b59b6',
      charisma: '#2ecc71',
      luck: '#1abc9c',
    },

    // 經驗條顏色
    experienceBar: {
      background: 'rgba(255, 255, 255, 0.1)',
      fill: 'linear-gradient(90deg, #00ff88 0%, #00cc66 100%)',
      glow: '0 0 10px #00ff88',
    },

    // 技能點顏色
    skillPoints: {
      used: '#d4af37',
      available: '#ffffff',
      next: '#00ff88',
    },
  },

  // 動畫配置
  animations: {
    attributeBars: {
      duration: '1.5s',
      easing: 'ease-out',
      delay: 200,
      glowDelay: 1000,
    },
    experienceBar: {
      duration: '2s',
      easing: 'ease-out',
      delay: 500,
    },
    radarChart: {
      drawSpeed: 50,
      pulseSpeed: 2000,
    },
    levelUp: {
      duration: '3s',
      particles: 20,
      sparkleColors: ['#d4af37', '#f4d03f', '#ffffff'],
    },
  },

  // 特效設定
  effects: {
    glow: {
      enabled: true,
      intensity: 0.8,
      color: '#d4af37',
    },
    particles: {
      enabled: true,
      count: 15,
      speed: 0.5,
    },
    screenShake: {
      enabled: false, // 升級時啟用
      intensity: 5,
    },
  },
};

/**
 * 統一配置導出
 */
export default {
  character: characterInfoConfig,
  attributes: characterAttributesConfig,
  jobSkills: jobSkillsConfig,
  levelSystem: levelSystemConfig,
  visual: visualEffectsConfig,
};
