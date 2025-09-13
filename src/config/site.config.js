/**
 * 網站主配置文件
 *
 * 整合所有配置模組，提供全站統一配置管理
 */

// 導入各配置模組
import { homePageConfig } from './pages/home.config.js';
import { aboutPageConfig } from './pages/about.config.js';
import { skillsPageConfig } from './pages/skills.config.js';
import { portfolioPageConfig } from './pages/portfolio.config.js';
import { contactPageConfig } from './pages/contact.config.js';

import { personalDataConfig } from './data/personal.config.js';
import { skillsDataConfig } from './data/skills.data.js';
import { projectsDataConfig } from './data/work-projects/projects.data.js';
import { socialDataConfig } from './data/social.data.js';

import { colorsConfig } from './theme/colors.config.js';
import { typographyConfig } from './theme/typography.config.js';
import { spacingConfig } from './theme/spacing.config.js';
import { animationsConfig } from './theme/animations.config.js';

/**
 * 網站主配置
 */
export const siteConfig = {
  // 網站基本資訊
  meta: {
    title: '{{personal.name}} - Backend Engineer & System Architect',
    description: '遊戲化個人作品集，展現後端工程師向系統架構師發展的專業軌跡',
    keywords: [
      'Backend Engineer',
      'System Architect',
      'Full Stack',
      'Node.js',
      'Gaming Portfolio',
    ],
    author: '{{personal.name}}',
    language: 'zh-TW',
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',

    // 社群媒體和 SEO
    openGraph: {
      title: '{{personal.name}} - Professional Portfolio',
      description: '{{personal.bio}}',
      image: '{{personal.avatar}}',
      url: '{{site.baseUrl}}',
      type: 'website',
      locale: 'zh_TW',
    },

    twitter: {
      card: 'summary_large_image',
      title: '{{personal.name}} - Portfolio',
      description: '{{personal.bio}}',
      image: '{{personal.avatar}}',
      creator: '{{social.twitter.handle}}',
    },

    // 結構化數據
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: '{{personal.name}}',
      jobTitle: '{{personal.title}}',
      description: '{{personal.bio}}',
      image: '{{personal.avatar}}',
      url: '{{site.baseUrl}}',
      sameAs: [
        '{{social.github.url}}',
        '{{social.linkedin.url}}',
        '{{social.twitter.url}}',
      ],
    },
  },

  // 網站配置
  site: {
    name: 'Gaming Portfolio',
    baseUrl: 'https://your-domain.com',
    version: '1.0.0',
    buildDate: new Date().toISOString(),

    // 語言和地區
    locale: 'zh-TW',
    timezone: 'Asia/Taipei',

    // 功能開關
    features: {
      darkMode: true,
      animations: true,
      sound: false,
      accessibility: true,
      analytics: true,
      serviceWorker: true,
      lazyLoading: true,
      skillTree: true,
      gamingCards: true,
      characterPanel: true,
    },

    // 性能配置
    performance: {
      lazyLoadImages: true,
      enableWebP: true,
      minimizeCSS: true,
      minimizeJS: true,
      enableGzip: true,
      cacheStrategy: 'stale-while-revalidate',
    },

    // 無障礙配置
    accessibility: {
      highContrast: false,
      reduceMotion: false,
      focusVisible: true,
      skipLinks: true,
      ariaLabels: true,
    },
  },

  // 路由配置
  routing: {
    mode: 'hash', // hash | history
    base: '/',
    scrollBehavior: 'smooth',

    routes: [
      {
        path: '/',
        name: 'home',
        component: 'HomePage',
        meta: {
          title: '首頁',
          requiresAuth: false,
          keepAlive: true,
        },
      },
      {
        path: '/about',
        name: 'about',
        component: 'AboutPage',
        meta: {
          title: '關於我',
          requiresAuth: false,
        },
      },
      {
        path: '/skills',
        name: 'skills',
        component: 'SkillsPage',
        meta: {
          title: '技能樹',
          requiresAuth: false,
        },
      },
      {
        path: '/portfolio',
        name: 'portfolio',
        component: 'PortfolioPage',
        meta: {
          title: '作品集',
          requiresAuth: false,
        },
      },
      {
        path: '/contact',
        name: 'contact',
        component: 'ContactPage',
        meta: {
          title: '聯絡我',
          requiresAuth: false,
        },
      },
    ],

    // 導航選單
    navigation: {
      main: [
        { name: '首頁', path: '/', icon: 'home', order: 1 },
        { name: '關於', path: '/about', icon: 'user', order: 2 },
        { name: '技能', path: '/skills', icon: 'tree', order: 3 },
        { name: '作品', path: '/portfolio', icon: 'briefcase', order: 4 },
        { name: '聯絡', path: '/contact', icon: 'mail', order: 5 },
      ],

      social: [
        { name: 'GitHub', url: '{{social.github.url}}', icon: 'github' },
        { name: 'LinkedIn', url: '{{social.linkedin.url}}', icon: 'linkedin' },
        { name: 'Twitter', url: '{{social.twitter.url}}', icon: 'twitter' },
      ],
    },
  },

  // 頁面配置
  pages: {
    home: homePageConfig,
    about: aboutPageConfig,
    skills: skillsPageConfig,
    portfolio: portfolioPageConfig,
    contact: contactPageConfig,
  },

  // 數據配置
  data: {
    personal: personalDataConfig,
    skills: skillsDataConfig,
    projects: projectsDataConfig,
    social: socialDataConfig,
  },

  // 主題配置
  theme: {
    colors: colorsConfig,
    typography: typographyConfig,
    spacing: spacingConfig,
    animations: animationsConfig,

    // 主題模式
    defaultMode: 'dark',
    modes: ['dark', 'light', 'neon'],

    // 響應式斷點
    breakpoints: {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    // Z-index 層級
    zIndex: {
      dropdown: 1000,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
      navbar: 1030,
      sidebar: 1020,
    },
  },

  // 組件預設配置
  components: {
    // 技能樹配置
    skillTree: {
      enableZoom: true,
      enableDrag: true,
      initialZoom: 0.8,
      maxZoom: 2.0,
      minZoom: 0.3,
      centerOnLoad: true,
      enableMinimap: true,
      animationDuration: 300,

      // 節點配置
      node: {
        size: {
          mobile: 40,
          tablet: 48,
          desktop: 56,
        },
        spacing: {
          mobile: 80,
          tablet: 100,
          desktop: 120,
        },
        borderRadius: '50%',
        enableGlow: true,
      },

      // 連線配置
      connection: {
        strokeWidth: 2,
        strokeColor: 'var(--color-primary-gold)',
        animateOnReveal: true,
        drawSpeed: 500,
      },
    },

    // 專案卡片配置
    projectCards: {
      layout: 'masonry', // grid | masonry | carousel
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      gap: 'var(--space-6)',
      enableFilters: true,
      enableSearch: true,
      enableSort: true,

      // 卡片動畫
      animations: {
        hover: 'cardLift',
        appear: 'slideInUp',
        flip: 'cardFlip',
      },

      // 稀有度系統
      rarity: {
        normal: { border: '2px solid #8B4513', glow: false },
        rare: { border: '2px solid #C0C0C0', glow: true },
        superRare: { border: '2px solid #FFD700', glow: true },
        legendary: {
          border: '2px solid #FF6347',
          glow: true,
          holographic: true,
        },
      },
    },

    // 角色面板配置
    characterPanel: {
      enableAnimations: true,
      showLevelProgress: true,
      showExperienceBar: true,
      enableSkillPoints: true,

      // 屬性顯示
      attributes: {
        technical: { label: '技術實力', max: 100 },
        architecture: { label: '架構思維', max: 100 },
        leadership: { label: '領導能力', max: 100 },
        communication: { label: '溝通協作', max: 100 },
      },
    },

    // 表單配置
    forms: {
      contact: {
        enableValidation: true,
        showErrorMessages: true,
        submitAnimation: 'bounce',
        successMessage: '訊息已送出，我會盡快回覆您！',
        errorMessage: '送出失敗，請稍後再試',
      },
    },
  },

  // API 配置
  api: {
    baseUrl: 'http://localhost:3001', // 開發環境默認值
    // 生產環境可通過環境變數覆蓋
    timeout: 10000,
    retries: 3,

    endpoints: {
      contact: '/contact',
      analytics: '/analytics',
      feedback: '/feedback',
    },

    // API 功能開關
    features: {
      analytics: true,
      contactForm: true,
      feedback: false,
    },
  },

  // 分析和追蹤
  analytics: {
    google: {
      enabled: true,
      measurementId: 'G-XXXXXXXXXX',
    },

    // 自訂事件追蹤
    events: {
      skillNodeClick: { category: 'Skills', action: 'Node Click' },
      projectCardView: { category: 'Portfolio', action: 'Card View' },
      contactFormSubmit: { category: 'Contact', action: 'Form Submit' },
      themeToggle: { category: 'UI', action: 'Theme Toggle' },
    },
  },

  // 開發配置
  development: {
    enableDebugMode: true, // 開發環境默認值
    showConfigInConsole: true,
    enableHotReload: true,
    logLevel: 'info', // error | warn | info | debug

    // 測試數據
    useMockData: false,
    mockDelay: 1000,

    // 性能監控
    performanceMonitoring: {
      enabled: true,
      logSlowComponents: true,
      slowThreshold: 100, // ms
      memoryUsageAlert: 50, // MB
    },
  },

  // 建構配置
  build: {
    outputDir: 'dist',
    assetsDir: 'assets',
    publicPath: '/',

    // 優化配置
    optimization: {
      splitChunks: true,
      minimizeCSS: true,
      minimizeJS: true,
      generateSourceMap: false,
      enableTreeShaking: true,
    },

    // PWA 配置
    pwa: {
      enabled: false,
      name: 'Gaming Portfolio',
      shortName: 'Portfolio',
      description: '遊戲化個人作品集',
      themeColor: '#d4af37',
      backgroundColor: '#0a0a0a',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

  // 插值上下文
  context: {
    // 從各配置模組獲取數據
    personal: personalDataConfig,
    social: socialDataConfig,
    site: {
      baseUrl: 'https://your-domain.com',
    },

    // 動態計算的值
    computed: {
      totalSkills: () => skillsDataConfig.skills.length,
      totalProjects: () =>
        projectsDataConfig.featured.length + projectsDataConfig.other.length,
      experienceYears: () => {
        const startYear = new Date(
          personalDataConfig.career.startDate
        ).getFullYear();
        return new Date().getFullYear() - startYear;
      },
      currentLevel: () => Math.floor(Math.sqrt(100 * 10)) + 1, // 基於經驗計算等級
    },
  },

  // 配置版本和元數據
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  configSchema: 'site-config-v1',

  // 相容性檢查
  compatibility: {
    minNodeVersion: '16.0.0',
    supportedBrowsers: [
      'Chrome >= 88',
      'Firefox >= 85',
      'Safari >= 14',
      'Edge >= 88',
    ],
  },
};

// 導出各個子配置供單獨使用
export {
  homePageConfig,
  aboutPageConfig,
  skillsPageConfig,
  portfolioPageConfig,
  contactPageConfig,
  personalDataConfig,
  skillsDataConfig,
  projectsDataConfig,
  socialDataConfig,
  colorsConfig,
  typographyConfig,
  spacingConfig,
  animationsConfig,
};

// 便捷函數：獲取配置值
export function getConfigValue(path, fallback = null) {
  const keys = path.split('.');
  let value = siteConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return value;
}

// 便捷函數：檢查功能開關
export function isFeatureEnabled(feature) {
  return getConfigValue(`site.features.${feature}`, false);
}

// 便捷函數：獲取主題值
export function getThemeValue(path) {
  return getConfigValue(`theme.${path}`);
}

// 便捷函數：獲取響應式斷點
export function getBreakpoint(size) {
  return getConfigValue(`theme.breakpoints.${size}`, '0px');
}

export default siteConfig;
