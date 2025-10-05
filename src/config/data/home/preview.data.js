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
      name: 'Golang',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #00ADD8, #76E1FE)',
    },
    {
      name: 'PostgreSQL',
      level: 'advanced',
      color: 'linear-gradient(135deg, #336791, #8FBCBB)',
    },
    {
      name: 'Redis',
      level: 'advanced',
      color: 'linear-gradient(135deg, #DC382D, #ff9a9e)',
    },
    {
      name: 'Docker',
      level: 'advanced',
      color: 'linear-gradient(135deg, #2496ED, #4facfe)',
    },
    {
      name: 'GCP',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #4285F4, #34A853)',
    },
    {
      name: 'Microservices',
      level: 'advanced',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      name: 'AI Tools',
      level: 'intermediate',
      color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    },
  ],
  stats: {
    totalTech: '15+',
    experience: '5+',
  },
};

/**
 * 時間軸預覽配置 (最多4個時間點)
 */
export const timelinePreviewConfig = {
  maxItems: 4,
  timeline: [
    {
      year: '2023-Now',
      title: 'Senior Backend Engineer',
      description: 'AI 導入、高併發系統、SaaS 平台架構設計',
      importance: 'high',
    },
    {
      year: '2021-2023',
      title: 'Fullstack Engineer',
      description: '後端架構設計、AWS 雲服務、系統重構專案',
      importance: 'high',
    },
    {
      year: '2020-2021',
      title: 'Frontend & Desktop Developer',
      description: 'Scanner 工具開發、API 設計、前端開發',
      importance: 'medium',
    },
    {
      year: '2019-2020',
      title: 'Junior Developer',
      description: '資策會前端班結訓，開啟職涯旅程',
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
