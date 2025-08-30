/**
 * 網站主配置文件
 * 包含網站基本信息、SEO、路由等全域設定
 */

import type { ConfigObject } from '@/types/config.js';

export const siteConfig: ConfigObject = {
  // 網站基本信息
  site: {
    name: '遊戲化個人作品集',
    title: 'Backend Engineer | System Architect',
    description: '展現後端工程師向系統架構師發展的專業軌跡，融合流亡黯道與遊戲王風格的遊戲化作品集網站',
    url: 'https://your-domain.com',
    author: {
      name: 'Your Name',
      title: 'Backend Engineer',
      email: 'your.email@example.com',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername'
    },
    version: '1.0.0',
    buildTime: '{{time.isoString}}',
    environment: '{{env.NODE_ENV}}'
  },
  
  // SEO 配置
  seo: {
    defaultTitle: '{{site.title}} - {{site.name}}',
    titleTemplate: '%s | {{site.name}}',
    description: '{{site.description}}',
    keywords: [
      '後端工程師',
      '系統架構師',
      'Node.js',
      'TypeScript',
      'Config-Driven',
      '遊戲化設計',
      '個人作品集',
      'Full Stack Developer'
    ],
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: '{{site.name}}',
      title: '{{seo.defaultTitle}}',
      description: '{{seo.description}}',
      images: [
        {
          url: '{{site.url}}/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: '{{site.name}} - Open Graph Image'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@yourusername',
      creator: '@yourusername',
      title: '{{seo.defaultTitle}}',
      description: '{{seo.description}}',
      image: '{{site.url}}/images/twitter-card.jpg'
    },
    additionalMetaTags: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover'
      },
      {
        name: 'theme-color',
        content: '{{config.theme.colors.primary}}'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      }
    ]
  },
  
  // 路由配置
  routing: {
    basePath: '',
    trailingSlash: false,
    caseSensitive: false,
    
    // 頁面路由定義
    routes: [
      {
        path: '/',
        name: 'home',
        title: '首頁',
        component: 'HomePage',
        exact: true,
        meta: {
          description: '歡迎來到遊戲化個人作品集',
          showInNavigation: true,
          order: 1
        }
      },
      {
        path: '/skills',
        name: 'skills',
        title: '技能樹',
        component: 'SkillsPage',
        exact: true,
        meta: {
          description: '以流亡黯道風格展示技術技能發展路徑',
          showInNavigation: true,
          order: 2
        }
      },
      {
        path: '/projects',
        name: 'projects',
        title: '專案作品',
        component: 'ProjectsPage',
        exact: true,
        meta: {
          description: '以遊戲王卡牌形式展示專案作品',
          showInNavigation: true,
          order: 3
        }
      },
      {
        path: '/about',
        name: 'about',
        title: '關於我',
        component: 'AboutPage',
        exact: true,
        meta: {
          description: '了解我的技術背景與職涯發展',
          showInNavigation: true,
          order: 4
        }
      },
      {
        path: '/contact',
        name: 'contact',
        title: '聯絡方式',
        component: 'ContactPage',
        exact: true,
        meta: {
          description: '聯絡方式與社交媒體',
          showInNavigation: true,
          order: 5
        }
      }
    ],
    
    // 重定向規則
    redirects: [
      {
        from: '/skill-tree',
        to: '/skills',
        permanent: true
      },
      {
        from: '/portfolio',
        to: '/projects',
        permanent: true
      }
    ],
    
    // 404 頁面配置
    notFound: {
      component: 'NotFoundPage',
      title: '頁面不存在',
      description: '您訪問的頁面不存在或已被移除'
    }
  },
  
  // 導航配置
  navigation: {
    // 主導航
    main: [
      {
        name: '首頁',
        path: '/',
        icon: 'home',
        exact: true
      },
      {
        name: '技能樹',
        path: '/skills',
        icon: 'skill-tree',
        description: 'Path of Exile 風格技能展示'
      },
      {
        name: '專案作品',
        path: '/projects',
        icon: 'cards',
        description: '遊戲王卡牌風格作品展示'
      },
      {
        name: '關於我',
        path: '/about',
        icon: 'user',
        description: '個人背景與經歷'
      },
      {
        name: '聯絡',
        path: '/contact',
        icon: 'contact',
        description: '聯絡方式'
      }
    ],
    
    // 社交媒體連結
    social: [
      {
        name: 'GitHub',
        url: '{{site.author.github}}',
        icon: 'github',
        newTab: true
      },
      {
        name: 'LinkedIn',
        url: '{{site.author.linkedin}}',
        icon: 'linkedin',
        newTab: true
      },
      {
        name: 'Email',
        url: 'mailto:{{site.author.email}}',
        icon: 'email',
        newTab: false
      }
    ],
    
    // 行為配置
    behavior: {
      highlightActive: true,
      smoothScroll: true,
      collapseOnMobile: true,
      showBreadcrumbs: false
    }
  },
  
  // 功能開關配置
  features: {
    // 核心功能
    skillTree: {
      enabled: true,
      useHexagonalLayout: true,
      enableAnimations: true,
      enableZoom: true,
      enableTooltips: true
    },
    
    projectCards: {
      enabled: true,
      use3DEffects: true,
      enableFilters: true,
      enableSearch: true,
      cardsPerPage: 12
    },
    
    // 遊戲化元素
    gamification: {
      showLevelProgress: true,
      enableAchievements: true,
      showExperiencePoints: false,
      enableSoundEffects: '{{env.DEV}}'
    },
    
    // 視覺效果
    visualEffects: {
      particleBackground: '{{config.theme.effects.particles.enabled}}',
      cursorTrail: '{{config.theme.effects.cursorTrail.enabled}}',
      backgroundGrid: '{{config.theme.effects.grid.enabled}}',
      smoothAnimations: true,
      reducedMotion: false // 會被用戶偏好設定覆蓋
    },
    
    // 開發工具
    devTools: {
      showFPS: '{{env.DEV}}',
      enableDebugMode: '{{env.DEV}}',
      showConfigPanel: '{{env.DEV}}',
      enableHotReload: '{{env.DEV}}'
    },
    
    // 分析追蹤
    analytics: {
      enabled: '{{env.PROD}}',
      googleAnalytics: false,
      customEvents: true,
      heatmaps: false
    }
  },
  
  // 效能配置
  performance: {
    // 載入策略
    loading: {
      lazyLoadImages: true,
      preloadCriticalAssets: true,
      enableServiceWorker: '{{env.PROD}}',
      cacheStrategy: 'stale-while-revalidate'
    },
    
    // 資源優化
    optimization: {
      bundleSplitting: true,
      treeShaking: true,
      imageOptimization: true,
      fontOptimization: true
    },
    
    // 監控閾值
    thresholds: {
      // Core Web Vitals
      LCP: 2.5, // Largest Contentful Paint (秒)
      FID: 0.1, // First Input Delay (秒)
      CLS: 0.1, // Cumulative Layout Shift
      // 自定義指標
      TTI: 3.5, // Time to Interactive (秒)
      FCP: 1.5  // First Contentful Paint (秒)
    }
  },
  
  // 響應式配置
  responsive: {
    // 斷點配置 (繼承自主題，但可覆蓋)
    breakpoints: '{{config.theme.breakpoints}}',
    
    // 不同裝置的行為
    mobile: {
      enableTouchGestures: true,
      simplifyAnimations: true,
      reducedParticles: true,
      largerTouchTargets: true
    },
    
    tablet: {
      enableTouchGestures: true,
      showSideNavigation: false,
      adaptiveLayout: true
    },
    
    desktop: {
      enableAdvancedEffects: true,
      showAllFeatures: true,
      enableKeyboardShortcuts: true
    }
  },
  
  // 本地化配置
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en-US'],
    
    // 語言切換
    languageSwitcher: {
      enabled: false, // 暫時關閉多語言
      showInNavigation: false,
      persistChoice: true
    },
    
    // 日期時間格式
    dateTimeFormat: {
      'zh-TW': {
        date: 'YYYY年MM月DD日',
        time: 'HH:mm:ss',
        dateTime: 'YYYY年MM月DD日 HH:mm'
      },
      'en-US': {
        date: 'MMM DD, YYYY',
        time: 'HH:mm:ss',
        dateTime: 'MMM DD, YYYY HH:mm'
      }
    }
  },
  
  // API 配置
  api: {
    // 如果有後端 API
    baseUrl: '{{env.NODE_ENV === "production" ? "https://api.your-domain.com" : "http://localhost:3001"}}',
    timeout: 10000,
    retries: 3,
    
    // 端點配置
    endpoints: {
      contact: '/api/contact',
      analytics: '/api/analytics',
      feedback: '/api/feedback'
    }
  },
  
  // 錯誤處理配置
  errorHandling: {
    // 錯誤頁面
    showStackTrace: '{{env.DEV}}',
    enableErrorBoundary: true,
    
    // 錯誤報告
    enableErrorReporting: '{{env.PROD}}',
    errorReportingService: null, // Sentry, LogRocket 等
    
    // 回退策略
    fallbackEnabled: true,
    fallbackMessage: '抱歉，發生了一些問題。請重新整理頁面或稍後再試。'
  }
};

export default siteConfig;