/**
 * 間距配置
 *
 * Config-Driven 間距系統，基於 8px 網格設計
 */

export const spacingConfig = {
  // 基礎間距 (基於 8px 網格系統)
  base: {
    // 微小間距
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px

    // 常用間距
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px

    // 較大間距
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px

    // 特大間距
    40: '10rem', // 160px
    48: '12rem', // 192px
    56: '14rem', // 224px
    64: '16rem', // 256px
  },

  // 組件專用間距
  components: {
    // 按鈕內距
    button: {
      small: {
        x: 'var(--space-3)', // 12px
        y: 'var(--space-2)', // 8px
      },
      medium: {
        x: 'var(--space-4)', // 16px
        y: 'var(--space-2.5)', // 10px
      },
      large: {
        x: 'var(--space-6)', // 24px
        y: 'var(--space-4)', // 16px
      },
    },

    // 卡片內距
    card: {
      compact: 'var(--space-4)', // 16px
      comfortable: 'var(--space-6)', // 24px
      spacious: 'var(--space-8)', // 32px
    },

    // 表單元素
    form: {
      fieldSpacing: 'var(--space-4)', // 16px
      labelSpacing: 'var(--space-2)', // 8px
      inputPadding: {
        x: 'var(--space-3)', // 12px
        y: 'var(--space-2.5)', // 10px
      },
    },

    // 導航元素
    navigation: {
      itemPadding: {
        x: 'var(--space-4)', // 16px
        y: 'var(--space-3)', // 12px
      },
      itemSpacing: 'var(--space-2)', // 8px
    },
  },

  // 佈局間距
  layout: {
    // 頁面邊距
    page: {
      mobile: 'var(--space-4)', // 16px
      tablet: 'var(--space-6)', // 24px
      desktop: 'var(--space-8)', // 32px
    },

    // 區塊間距
    section: {
      small: 'var(--space-8)', // 32px
      medium: 'var(--space-12)', // 48px
      large: 'var(--space-16)', // 64px
      xlarge: 'var(--space-24)', // 96px
    },

    // 容器間距
    container: {
      maxWidth: '1200px',
      padding: {
        mobile: 'var(--space-4)', // 16px
        tablet: 'var(--space-6)', // 24px
        desktop: 'var(--space-8)', // 32px
      },
    },

    // 網格間距
    grid: {
      gap: {
        small: 'var(--space-2)', // 8px
        medium: 'var(--space-4)', // 16px
        large: 'var(--space-6)', // 24px
        xlarge: 'var(--space-8)', // 32px
      },
    },
  },

  // 遊戲化元素間距
  gaming: {
    // 技能樹節點間距
    skillTree: {
      nodeSpacing: {
        mobile: 'var(--space-16)', // 64px
        tablet: 'var(--space-20)', // 80px
        desktop: 'var(--space-24)', // 96px
      },
      nodeSize: {
        mobile: 'var(--space-10)', // 40px
        tablet: 'var(--space-12)', // 48px
        desktop: 'var(--space-14)', // 56px
      },
    },

    // 卡牌間距
    cards: {
      gap: 'var(--space-6)', // 24px
      padding: 'var(--space-4)', // 16px
      margin: 'var(--space-3)', // 12px
    },

    // 遊戲UI元素
    gameUI: {
      panelPadding: 'var(--space-6)', // 24px
      controlSpacing: 'var(--space-3)', // 12px
      iconSpacing: 'var(--space-2)', // 8px
    },
  },

  // 響應式間距
  responsive: {
    // 頁面主要間距
    pageMargin: {
      mobile: 'var(--space-4)', // 16px
      tablet: 'var(--space-8)', // 32px
      desktop: 'var(--space-12)', // 48px
    },

    // 內容區間距
    contentSpacing: {
      mobile: 'var(--space-6)', // 24px
      tablet: 'var(--space-10)', // 40px
      desktop: 'var(--space-16)', // 64px
    },

    // 組件間距調整
    componentGap: {
      mobile: 'var(--space-4)', // 16px
      tablet: 'var(--space-6)', // 24px
      desktop: 'var(--space-8)', // 32px
    },
  },

  // 特殊用途間距
  special: {
    // 分隔線間距
    divider: {
      before: 'var(--space-8)', // 32px
      after: 'var(--space-8)', // 32px
    },

    // 浮動元素間距
    floating: {
      offset: 'var(--space-4)', // 16px
      margin: 'var(--space-2)', // 8px
    },

    // 重疊元素間距
    overlap: {
      small: 'calc(-1 * var(--space-2))', // -8px
      medium: 'calc(-1 * var(--space-4))', // -16px
      large: 'calc(-1 * var(--space-6))', // -24px
    },
  },

  // CSS 變數映射
  cssVariables: {
    // 基礎間距
    '--space-0-5': '0.125rem',
    '--space-1': '0.25rem',
    '--space-1-5': '0.375rem',
    '--space-2': '0.5rem',
    '--space-2-5': '0.625rem',
    '--space-3': '0.75rem',
    '--space-4': '1rem',
    '--space-5': '1.25rem',
    '--space-6': '1.5rem',
    '--space-8': '2rem',
    '--space-10': '2.5rem',
    '--space-12': '3rem',
    '--space-14': '3.5rem',
    '--space-16': '4rem',
    '--space-20': '5rem',
    '--space-24': '6rem',
    '--space-32': '8rem',

    // 佈局間距
    '--layout-page-mobile': 'var(--space-4)',
    '--layout-page-tablet': 'var(--space-6)',
    '--layout-page-desktop': 'var(--space-8)',
    '--layout-section-small': 'var(--space-8)',
    '--layout-section-medium': 'var(--space-12)',
    '--layout-section-large': 'var(--space-16)',

    // 容器設定
    '--container-max-width': '1200px',
    '--container-padding-mobile': 'var(--space-4)',
    '--container-padding-desktop': 'var(--space-8)',
  },
};

export default spacingConfig;
