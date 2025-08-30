/**
 * 主題配置文件
 * 定義整個網站的視覺主題
 */

import type { ConfigObject } from '@/types/config.js';

export const themeConfig: ConfigObject = {
  meta: {
    name: 'Gaming Portfolio Theme',
    description: '遊戲化個人作品集主題配置',
    version: '1.0.0',
    author: 'Backend Engineer'
  },
  
  // 色彩系統
  colors: {
    // 主色調
    primary: '#d4af37',      // 主要金色
    secondary: '#1a1a2e',    // 深藍色背景
    accent: '#f4d03f',       // 強調金色
    
    // 背景色彩
    background: {
      primary: '#0a0a0a',    // 主背景 (黑色)
      secondary: '#1a1a2e',  // 次背景 (深藍)
      card: '#2c2c54',       // 卡片背景
      overlay: 'rgba(26, 26, 46, 0.9)' // 覆蓋層
    },
    
    // 文字色彩
    text: {
      primary: '#ffffff',    // 主要文字 (白色)
      secondary: '#b8b8b8',  // 次要文字 (灰色)
      accent: '#d4af37',     // 強調文字 (金色)
      muted: '#6c757d'       // 靜音文字 (深灰)
    },
    
    // 狀態色彩
    status: {
      success: '#28a745',    // 成功 (綠色)
      warning: '#ffc107',    // 警告 (黃色)
      error: '#dc3545',      // 錯誤 (紅色)
      info: '#17a2b8'        // 資訊 (藍色)
    },
    
    // 技能領域色彩 (對應技能樹)
    domains: {
      frontend: '#e74c3c',
      backend: '#3498db',
      database: '#2ecc71',
      'cloud-devops': '#9b59b6',
      ai: '#f39c12',
      architecture: '#1abc9c'
    }
  },
  
  // 字體系統
  typography: {
    // 字體家族
    fontFamily: {
      heading: '"Cinzel", "Noto Serif TC", serif',
      body: '"Inter", "Noto Sans TC", sans-serif',
      mono: '"Fira Code", "JetBrains Mono", monospace',
      gaming: '"Orbitron", "Noto Sans TC", sans-serif'
    },
    
    // 字體大小 (響應式)
    fontSize: {
      xs: 'clamp(0.75rem, 2vw, 0.875rem)',
      sm: 'clamp(0.875rem, 2.5vw, 1rem)',
      base: 'clamp(1rem, 3vw, 1.125rem)',
      lg: 'clamp(1.125rem, 3.5vw, 1.25rem)',
      xl: 'clamp(1.25rem, 4vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 5vw, 2rem)',
      '3xl': 'clamp(2rem, 6vw, 2.5rem)',
      '4xl': 'clamp(2.5rem, 8vw, 3rem)'
    },
    
    // 字體粗細
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900
    },
    
    // 行高
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    }
  },
  
  // 間距系統 (基於 8px 網格)
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    40: '10rem',     // 160px
    48: '12rem',     // 192px
    56: '14rem',     // 224px
    64: '16rem'      // 256px
  },
  
  // 響應式斷點
  breakpoints: {
    sm: '640px',     // 手機橫向
    md: '768px',     // 平板直向
    lg: '1024px',    // 平板橫向
    xl: '1280px',    // 桌面
    '2xl': '1536px'  // 大桌面
  },
  
  // 陰影系統
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // 遊戲風格發光效果
    glow: '0 0 20px rgba(212, 175, 55, 0.5)',
    glowLarge: '0 0 40px rgba(212, 175, 55, 0.3)'
  },
  
  // 邊框半徑
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px'     // 完全圓形
  },
  
  // 動畫配置
  animation: {
    // 持續時間
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
      slowest: '1s'
    },
    
    // 緩動函數
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // 遊戲風格彈性動畫
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    
    // 預定義動畫
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      slideUp: {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 }
      },
      glow: {
        '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
        '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' }
      },
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' }
      }
    }
  },
  
  // Z-index 層級
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    tooltip: 1700,
    notification: 1800
  },
  
  // 組件特定樣式
  components: {
    // 按鈕樣式
    button: {
      primary: {
        background: 'linear-gradient(135deg, {{colors.primary}}, {{colors.accent}})',
        color: '{{colors.background.primary}}',
        border: 'none',
        borderRadius: '{{borderRadius.md}}',
        padding: '{{spacing.3}} {{spacing.6}}',
        fontSize: '{{typography.fontSize.base}}',
        fontWeight: '{{typography.fontWeight.semibold}}',
        cursor: 'pointer',
        transition: 'all {{animation.duration.normal}} {{animation.easing.easeInOut}}',
        boxShadow: '{{shadows.md}}'
      },
      
      secondary: {
        background: 'transparent',
        color: '{{colors.primary}}',
        border: '2px solid {{colors.primary}}',
        borderRadius: '{{borderRadius.md}}',
        padding: '{{spacing.3}} {{spacing.6}}'
      }
    },
    
    // 卡片樣式
    card: {
      background: '{{colors.background.card}}',
      borderRadius: '{{borderRadius.xl}}',
      padding: '{{spacing.6}}',
      boxShadow: '{{shadows.lg}}',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    
    // 輸入框樣式
    input: {
      background: '{{colors.background.secondary}}',
      color: '{{colors.text.primary}}',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '{{borderRadius.md}}',
      padding: '{{spacing.3}} {{spacing.4}}',
      fontSize: '{{typography.fontSize.base}}'
    }
  },
  
  // 特殊效果配置
  effects: {
    // 粒子效果
    particles: {
      enabled: '{{env.DEV}}', // 開發環境啟用，生產環境可選
      count: 50,
      color: '{{colors.primary}}',
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 2 },
      opacity: { min: 0.1, max: 0.5 }
    },
    
    // 背景網格
    grid: {
      enabled: true,
      color: 'rgba(255, 255, 255, 0.05)',
      size: 50,
      opacity: 0.3
    },
    
    // 游標軌跡
    cursorTrail: {
      enabled: '{{browser.isDesktop}}', // 僅桌面啟用
      color: '{{colors.primary}}',
      length: 20,
      opacity: 0.6
    }
  }
};

export default themeConfig;