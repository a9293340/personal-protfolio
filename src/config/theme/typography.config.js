/**
 * 字體配置
 *
 * Config-Driven 字體系統，支援遊戲化設計風格
 */

export const typographyConfig = {
  // 字體族群
  fontFamilies: {
    // 主要字體
    heading: "'Cinzel', 'Noto Serif TC', serif", // 標題字體
    body: "'Inter', 'Noto Sans TC', sans-serif", // 內文字體
    code: "'Fira Code', 'JetBrains Mono', monospace", // 代碼字體
    gaming: "'Orbitron', 'Rajdhani', sans-serif", // 遊戲風格字體

    // 備用字體
    fallback: {
      serif: "Georgia, 'Times New Roman', serif",
      sansSerif: 'Arial, Helvetica, sans-serif',
      monospace: "'Courier New', monospace",
    },
  },

  // 字體大小系統 (基於 1rem = 16px)
  fontSize: {
    // 基礎尺寸
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px

    // 標題尺寸
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px

    // 特殊尺寸
    hero: '5rem', // 80px - 主標題
    display: '6rem', // 96px - 展示用

    // 響應式尺寸
    responsive: {
      hero: {
        mobile: '2.5rem', // 40px
        tablet: '3.5rem', // 56px
        desktop: '5rem', // 80px
      },
      display: {
        mobile: '3rem', // 48px
        tablet: '4.5rem', // 72px
        desktop: '6rem', // 96px
      },
    },
  },

  // 字重系統
  fontWeight: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },

  // 行高系統
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,

    // 特定用途
    heading: 1.2,
    body: 1.6,
    code: 1.4,
  },

  // 字距調整
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',

    // 遊戲風格
    gaming: '0.1em',
  },

  // 文字樣式預設組合
  textStyles: {
    // 標題樣式
    h1: {
      fontSize: 'var(--font-size-5xl)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 'var(--line-height-heading)',
      letterSpacing: 'var(--letter-spacing-tight)',
    },

    h2: {
      fontSize: 'var(--font-size-4xl)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--font-weight-semiBold)',
      lineHeight: 'var(--line-height-heading)',
    },

    h3: {
      fontSize: 'var(--font-size-3xl)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--font-weight-semiBold)',
      lineHeight: 'var(--line-height-heading)',
    },

    // 內文樣式
    body: {
      fontSize: 'var(--font-size-base)',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-body)',
    },

    bodyLarge: {
      fontSize: 'var(--font-size-lg)',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-relaxed)',
    },

    // 遊戲風格樣式
    gamingTitle: {
      fontSize: 'var(--font-size-4xl)',
      fontFamily: 'var(--font-gaming)',
      fontWeight: 'var(--font-weight-bold)',
      letterSpacing: 'var(--letter-spacing-gaming)',
      textTransform: 'uppercase',
    },

    // 代碼樣式
    code: {
      fontSize: 'var(--font-size-sm)',
      fontFamily: 'var(--font-code)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-code)',
    },

    // 特殊樣式
    caption: {
      fontSize: 'var(--font-size-sm)',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--font-weight-medium)',
      opacity: 0.8,
    },
  },

  // CSS 變數映射
  cssVariables: {
    // 字體族群
    '--font-heading': "'Cinzel', 'Noto Serif TC', serif",
    '--font-body': "'Inter', 'Noto Sans TC', sans-serif",
    '--font-code': "'Fira Code', 'JetBrains Mono', monospace",
    '--font-gaming': "'Orbitron', 'Rajdhani', sans-serif",

    // 字體大小
    '--font-size-xs': '0.75rem',
    '--font-size-sm': '0.875rem',
    '--font-size-base': '1rem',
    '--font-size-lg': '1.125rem',
    '--font-size-xl': '1.25rem',
    '--font-size-2xl': '1.5rem',
    '--font-size-3xl': '1.875rem',
    '--font-size-4xl': '2.25rem',
    '--font-size-5xl': '3rem',
    '--font-size-6xl': '3.75rem',

    // 字重
    '--font-weight-light': '300',
    '--font-weight-normal': '400',
    '--font-weight-medium': '500',
    '--font-weight-semiBold': '600',
    '--font-weight-bold': '700',

    // 行高
    '--line-height-tight': '1.25',
    '--line-height-normal': '1.5',
    '--line-height-relaxed': '1.625',
    '--line-height-heading': '1.2',
    '--line-height-body': '1.6',
    '--line-height-code': '1.4',

    // 字距
    '--letter-spacing-tight': '-0.025em',
    '--letter-spacing-normal': '0',
    '--letter-spacing-wide': '0.025em',
    '--letter-spacing-gaming': '0.1em',
  },
};

export default typographyConfig;
