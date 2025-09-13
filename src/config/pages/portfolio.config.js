/**
 * 作品集頁面配置
 *
 * Config-Driven 專案展示和遊戲王卡牌系統配置
 */

export const portfolioPageConfig = {
  meta: {
    title: '作品集 | Portfolio - 專業專案與技術實踐',
    description:
      '遊戲王風格的專案展示，包含後端系統、架構設計和技術創新的完整作品集',
    keywords:
      'portfolio, projects, backend systems, architecture design, technical innovation',
  },

  layout: {
    type: 'masonry-grid',
    maxWidth: '1400px',
    columns: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    gap: 'var(--space-6)',
  },

  sections: [
    {
      id: 'portfolio-header',
      type: 'section-hero',
      position: { order: 1 },
      config: {
        title: '專案作品集',
        subtitle: '技術實踐與架構創新的展示',
        description: '每個專案都是一張獨特的卡牌，記錄著技術成長的足跡',
        background: {
          type: 'animated-gradient',
          colors: ['var(--primary-dark)', 'var(--secondary-dark)'],
        },
      },
    },

    {
      id: 'project-filters',
      type: 'gaming-filter-tabs',
      position: { order: 2 },
      config: {
        style: 'yugioh-deck-tabs',
        filters: [
          {
            id: 'all',
            label: '全部卡牌',
            icon: '🃏',
            description: '顯示所有專案',
          },
          {
            id: 'backend',
            label: '後端系統',
            icon: '⚡',
            description: '後端開發相關專案',
            color: 'var(--primary-blue)',
          },
          {
            id: 'architecture',
            label: '系統架構',
            icon: '🏗️',
            description: '架構設計相關專案',
            color: 'var(--primary-gold)',
          },
          {
            id: 'fullstack',
            label: '全端開發',
            icon: '🚀',
            description: '全端技術整合專案',
            color: 'var(--bright-gold)',
          },
          {
            id: 'opensource',
            label: '開源專案',
            icon: '❤️',
            description: '開源貢獻與社群專案',
            color: 'var(--primary-red)',
          },
        ],
        defaultFilter: 'all',
        animation: 'slide-highlight',
      },
    },

    {
      id: 'project-showcase',
      type: 'yugioh-card-grid',
      position: { order: 3 },
      config: {
        projects: '{{data.projects.all}}',
        cardStyle: {
          rarity: {
            normal: 'bronze-border',
            rare: 'silver-border',
            superRare: 'gold-border',
            legendary: 'holographic-border',
          },
          animations: {
            hover: 'card-lift-glow',
            flip: '3d-card-flip',
            summon: 'magical-circle-summon',
          },
          effects: {
            holofoil: true,
            sparkle: true,
            shadowDepth: 3,
          },
        },

        // 卡牌內容模板
        cardTemplate: {
          header: {
            title: '{{project.name}}',
            rarity: '{{project.rarity}}',
            category: '{{project.category}}',
          },
          image: {
            src: '{{project.thumbnail}}',
            alt: '{{project.name}} 專案截圖',
            fallback: '/assets/images/project-placeholder.jpg',
          },
          stats: [
            {
              label: '技術複雜度',
              value: '{{project.complexity}}',
              max: 10,
              icon: '⭐',
            },
            {
              label: '創新程度',
              value: '{{project.innovation}}',
              max: 10,
              icon: '💡',
            },
            {
              label: '實用價值',
              value: '{{project.utility}}',
              max: 10,
              icon: '🎯',
            },
          ],
          description: '{{project.shortDescription}}',
          techStack: '{{project.technologies}}',
          links: {
            demo: '{{project.demoUrl}}',
            github: '{{project.githubUrl}}',
            article: '{{project.articleUrl}}',
          },
        },

        // 排序選項
        sorting: {
          options: [
            { key: 'date', label: '最新優先', icon: '📅' },
            { key: 'complexity', label: '複雜度', icon: '⭐' },
            { key: 'popularity', label: '熱門度', icon: '❤️' },
            { key: 'rarity', label: '稀有度', icon: '💎' },
          ],
          defaultSort: 'date',
        },

        // 載入動畫
        loadAnimation: {
          type: 'stagger-summon',
          delay: '100ms',
          duration: '800ms',
        },
      },
    },

    {
      id: 'project-detail-modal',
      type: 'yugioh-detail-modal',
      config: {
        style: 'fullscreen-overlay',
        background: 'magical-field',
        sections: [
          {
            type: 'project-gallery',
            title: '專案展示',
            layout: 'carousel',
          },
          {
            type: 'technical-details',
            title: '技術細節',
            sections: [
              'architecture-diagram',
              'technology-stack',
              'key-features',
              'challenges-solutions',
            ],
          },
          {
            type: 'project-metrics',
            title: '專案數據',
            metrics: [
              'development-time',
              'team-size',
              'code-lines',
              'performance-stats',
            ],
          },
          {
            type: 'lessons-learned',
            title: '經驗總結',
          },
        ],
        animations: {
          open: 'modal-summon-ritual',
          close: 'modal-banish-effect',
          sectionTransition: 'page-flip',
        },
      },
    },
  ],

  // 特殊效果配置
  effects: {
    cardSummonRitual: {
      enabled: true,
      triggerOn: 'cardFirstView',
      particleEffect: 'golden-sparkles',
      soundEffect: 'summon-chant.mp3',
      duration: '2s',
    },

    deckShuffle: {
      enabled: true,
      triggerOn: 'filterChange',
      animation: 'cards-shuffle-reorder',
      duration: '1s',
    },

    holofoilReflection: {
      enabled: true,
      followMouse: true,
      intensity: 'medium',
    },
  },

  // 響應式配置
  responsive: {
    mobile: {
      layout: {
        type: 'single-column-stack',
        gap: 'var(--space-4)',
      },
      sections: {
        'project-showcase': {
          config: {
            cardStyle: {
              animations: {
                hover: 'simple-highlight',
                flip: 'fade-transition',
              },
            },
          },
        },
        'project-detail-modal': {
          config: {
            style: 'fullscreen-slide-up',
            animations: {
              open: 'slide-up-fade',
              close: 'slide-down-fade',
            },
          },
        },
      },
    },
  },

  // SEO 和分享配置
  sharing: {
    enableProjectSharing: true,
    ogImageTemplate: '/og-templates/project-{{project.slug}}.jpg',
    twitterCardType: 'summary_large_image',
  },
};

export default portfolioPageConfig;
