/**
 * 首頁配置
 *
 * Config-Driven 首頁內容和佈局配置
 */

export const homePageConfig = {
  meta: {
    title: '遊戲化個人作品集 | Gaming Portfolio',
    description:
      '融合遊戲元素的個人作品集網站，展現後端工程師向系統架構師發展的專業軌跡',
    keywords:
      'portfolio, backend engineer, system architect, gaming, skill tree, config-driven',
    ogImage: '/og-images/home.jpg',
  },

  layout: {
    type: 'hero-centered',
    maxWidth: '1400px',
    padding: {
      top: 'var(--space-8)',
      bottom: 'var(--space-8)',
      horizontal: 'var(--space-4)',
    },
  },

  sections: [
    {
      id: 'hero-section',
      type: 'hero-banner',
      position: { order: 1 },
      config: {
        title: {
          main: '後端工程師的',
          highlight: '遊戲化轉職',
          subtitle: '從 Backend Engineer 到 System Architect 的技能成長軌跡',
        },
        background: {
          type: 'particle-animation',
          theme: 'tech-matrix',
          intensity: 'medium',
        },
        cta: {
          primary: {
            text: '探索技能樹',
            link: '/skills',
            animation: 'glow-pulse',
          },
          secondary: {
            text: '查看作品',
            link: '/portfolio',
            animation: 'slide-in',
          },
        },
      },
    },

    {
      id: 'character-overview',
      type: 'character-status-card',
      position: { order: 2 },
      config: {
        character: {
          name: '{{personal.displayName}}',
          title: '{{personal.jobTitle}}',
          level: '{{personal.experienceLevel}}',
          avatar: '{{personal.avatarImage}}',
        },
        stats: [
          {
            name: '技術實力',
            value: '{{stats.technical}}',
            max: 100,
            color: 'var(--primary-blue)',
          },
          {
            name: '架構思維',
            value: '{{stats.architecture}}',
            max: 100,
            color: 'var(--primary-gold)',
          },
          {
            name: '團隊協作',
            value: '{{stats.teamwork}}',
            max: 100,
            color: 'var(--bright-gold)',
          },
        ],
      },
    },

    {
      id: 'latest-projects',
      type: 'project-showcase-cards',
      position: { order: 3 },
      config: {
        title: '精選專案',
        subtitle: '最新的技術實踐與架構設計',
        displayCount: 3,
        cardStyle: '3d-flip',
        animation: 'stagger-fade-in',
        projects: '{{data.projects.featured}}',
      },
    },

    {
      id: 'skill-preview',
      type: 'mini-skill-tree',
      position: { order: 4 },
      config: {
        title: '技能樹預覽',
        subtitle: '點擊探索完整的技能發展路徑',
        previewNodes: 12,
        centerSkill: 'backend-foundation',
        interactionHint: true,
      },
    },
  ],

  animations: {
    pageEnter: 'fade-slide-up',
    pageExit: 'fade-slide-down',
    sectionReveal: 'intersection-observer',
    duration: {
      fast: 'var(--animation-fast)',
      normal: 'var(--animation-normal)',
      slow: 'var(--animation-slow)',
    },
  },

  responsive: {
    mobile: {
      layout: {
        type: 'single-column',
        padding: {
          horizontal: 'var(--space-2)',
        },
      },
      sections: {
        'character-overview': {
          simplified: true,
          statsLayout: 'horizontal',
        },
        'skill-preview': {
          previewNodes: 6,
        },
      },
    },
    tablet: {
      sections: {
        'latest-projects': {
          displayCount: 2,
        },
      },
    },
  },
};

export default homePageConfig;
