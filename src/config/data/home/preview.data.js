/**
 * PreviewSection 預覽區塊配置數據
 * Step 3.1.4: Config-Driven PreviewSection
 */

export const previewSectionConfig = {
  // 區塊標題配置
  header: {
    title: {
      icon: '✨',
      text: '核心特色',
    },
    subtitle: '探索我的專業能力與項目成就',
  },

  // 卡片配置
  sections: [
    {
      id: 'skills-preview',
      title: '技能樹',
      subtitle: '探索我的技術成長之路',
      icon: '🌟',
      action: '/skills',
      bgColor: 'rgba(41, 128, 185, 0.1)',
      borderColor: '#3498db',
      type: 'skills',
    },
    {
      id: 'timeline-preview',
      title: '專業經歷',
      subtitle: '見證我的職涯發展軌跡',
      icon: '📅',
      action: '/projects',
      bgColor: 'rgba(46, 204, 113, 0.1)',
      borderColor: '#2ecc71',
      type: 'timeline',
    },
    {
      id: 'projects-preview',
      title: '專案展示',
      subtitle: '查看我的作品與成就',
      icon: '🚀',
      action: '/projects',
      bgColor: 'rgba(212, 175, 55, 0.1)',
      borderColor: '#d4af37',
      type: 'projects',
    },
  ],
};

/**
 * 技能預覽配置 (最多8個技術標籤)
 */
export const skillsPreviewConfig = {
  maxTags: 8,
  skills: [
    {
      name: 'Node.js',
      level: 'advanced',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      name: 'TypeScript',
      level: 'advanced',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      name: 'Docker',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      name: 'K8s',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
    {
      name: 'AWS',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #fa709a, #fee140)',
    },
    {
      name: 'PostgreSQL',
      level: 'advanced',
      color: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    },
    {
      name: 'Redis',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    },
    {
      name: 'GraphQL',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    },
  ],
  stats: {
    totalTech: '15+',
    experience: '8+',
  },
};

/**
 * 時間軸預覽配置 (最多4個時間點)
 */
export const timelinePreviewConfig = {
  maxItems: 4,
  timeline: [
    {
      year: '2024',
      title: '系統架構師',
      description: '負責系統架構設計與技術選型',
      importance: 'high',
    },
    {
      year: '2022',
      title: '資深後端工程師',
      description: '領導後端團隊開發核心服務',
      importance: 'high',
    },
    {
      year: '2020',
      title: '後端工程師',
      description: '專注於 API 開發與資料庫優化',
      importance: 'medium',
    },
    {
      year: '2018',
      title: '初級開發工程師',
      description: '開始職涯，學習基礎開發技能',
      importance: 'low',
    },
  ],
};

/**
 * 專案預覽配置 (最多3個迷你卡片)
 */
export const projectsPreviewConfig = {
  maxCards: 3,
  projects: [
    {
      id: 'gaming-platform',
      name: '遊戲化平台',
      icon: '🎮',
      description: '基於微服務架構的遊戲化學習平台',
      tech: ['Node.js', 'Docker', 'K8s'],
      status: 'production',
    },
    {
      id: 'data-analysis',
      name: '數據分析系統',
      icon: '📊',
      description: '實時數據處理與視覺化分析系統',
      tech: ['Python', 'Apache Kafka', 'PostgreSQL'],
      status: 'production',
    },
    {
      id: 'ai-assistant',
      name: 'AI 助理服務',
      icon: '🤖',
      description: '基於 LLM 的智能客服助理系統',
      tech: ['FastAPI', 'OpenAI', 'Vector DB'],
      status: 'development',
    },
  ],
  stats: {
    totalProjects: '20+',
    completedProjects: '18',
    inProgress: '2',
  },
};

/**
 * 預覽內容限制規則
 */
export const previewLimits = {
  skills: {
    maxTags: 8,
    maxStatsItems: 2,
    minTags: 3,
  },
  timeline: {
    maxItems: 4,
    maxTitleLength: 20,
    minItems: 2,
  },
  projects: {
    maxCards: 3,
    maxNameLength: 15,
    maxDescriptionLength: 50,
    maxTechTags: 3,
    minCards: 2,
  },
};

/**
 * 配置驗證 Schema
 */
export const previewConfigSchema = {
  required: ['header', 'sections'],
  properties: {
    header: {
      type: 'object',
      required: ['title', 'subtitle'],
      properties: {
        title: {
          type: 'object',
          required: ['icon', 'text'],
        },
        subtitle: {
          type: 'string',
          maxLength: 100,
        },
      },
    },
    sections: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      items: {
        type: 'object',
        required: ['id', 'title', 'subtitle', 'icon', 'action', 'type'],
        properties: {
          title: { type: 'string', maxLength: 20 },
          subtitle: { type: 'string', maxLength: 50 },
          icon: { type: 'string', maxLength: 5 },
        },
      },
    },
  },
};

// 導出所有配置
export default {
  section: previewSectionConfig,
  skills: skillsPreviewConfig,
  timeline: timelinePreviewConfig,
  projects: projectsPreviewConfig,
  limits: previewLimits,
  schema: previewConfigSchema,
};
