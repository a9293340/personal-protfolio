/**
 * 動畫配置
 *
 * Config-Driven 動畫系統，支援 GSAP 和 CSS 動畫
 */

export const animationsConfig = {
  // 動畫時長
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',

    // 特殊動畫時長
    pageTransition: '400ms',
    modalTransition: '250ms',
    tooltipTransition: '200ms',
    hoverTransition: '150ms',
  },

  // 緩動函數
  easing: {
    // CSS 標準緩動
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // 自定義貝塞爾曲線
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

    // 遊戲化緩動
    gaming: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    heroic: 'cubic-bezier(0.19, 1, 0.22, 1)',
    magical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // 基礎動畫效果
  effects: {
    // 淡入淡出
    fadeIn: {
      keyframes: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    fadeOut: {
      keyframes: {
        from: { opacity: 1 },
        to: { opacity: 0 },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    // 滑動效果
    slideInUp: {
      keyframes: {
        from: {
          opacity: 0,
          transform: 'translateY(30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    slideInDown: {
      keyframes: {
        from: {
          opacity: 0,
          transform: 'translateY(-30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    slideInLeft: {
      keyframes: {
        from: {
          opacity: 0,
          transform: 'translateX(-30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateX(0)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    slideInRight: {
      keyframes: {
        from: {
          opacity: 0,
          transform: 'translateX(30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateX(0)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    // 縮放效果
    scaleIn: {
      keyframes: {
        from: {
          opacity: 0,
          transform: 'scale(0.9)',
        },
        to: {
          opacity: 1,
          transform: 'scale(1)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-bouncy)',
    },

    scaleOut: {
      keyframes: {
        from: {
          opacity: 1,
          transform: 'scale(1)',
        },
        to: {
          opacity: 0,
          transform: 'scale(0.9)',
        },
      },
      duration: 'var(--animation-normal)',
      easing: 'var(--easing-smooth)',
    },

    // 彈跳效果
    bounce: {
      keyframes: {
        '0%, 20%, 53%, 80%, 100%': {
          transform: 'translate3d(0, 0, 0)',
        },
        '40%, 43%': {
          transform: 'translate3d(0, -30px, 0)',
        },
        '70%': {
          transform: 'translate3d(0, -15px, 0)',
        },
        '90%': {
          transform: 'translate3d(0, -4px, 0)',
        },
      },
      duration: 'var(--animation-slowest)',
      easing: 'var(--easing-bouncy)',
    },

    // 搖擺效果
    shake: {
      keyframes: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
      },
      duration: 'var(--animation-slow)',
      easing: 'var(--easing-linear)',
    },
  },

  // 遊戲化動畫效果
  gamingEffects: {
    // 技能樹動畫
    skillNodeReveal: {
      keyframes: {
        '0%': {
          opacity: 0,
          transform: 'scale(0.3) rotate(-10deg)',
        },
        '50%': {
          opacity: 0.8,
          transform: 'scale(1.1) rotate(5deg)',
        },
        '100%': {
          opacity: 1,
          transform: 'scale(1) rotate(0deg)',
        },
      },
      duration: 'var(--animation-slow)',
      easing: 'var(--easing-magical)',
    },

    // 技能連線動畫
    skillConnectionDraw: {
      keyframes: {
        from: { strokeDashoffset: '100%' },
        to: { strokeDashoffset: '0%' },
      },
      duration: 'var(--animation-slower)',
      easing: 'var(--easing-smooth)',
    },

    // 技能升級動畫
    skillLevelUp: {
      keyframes: {
        '0%': {
          transform: 'scale(1)',
          filter: 'brightness(1) saturate(1)',
        },
        '25%': {
          transform: 'scale(1.2)',
          filter: 'brightness(1.5) saturate(1.5)',
        },
        '50%': {
          transform: 'scale(1.1)',
          filter: 'brightness(2) saturate(2)',
        },
        '75%': {
          transform: 'scale(1.15)',
          filter: 'brightness(1.5) saturate(1.5)',
        },
        '100%': {
          transform: 'scale(1)',
          filter: 'brightness(1.2) saturate(1.2)',
        },
      },
      duration: 'var(--animation-slowest)',
      easing: 'var(--easing-heroic)',
    },

    // 卡牌翻轉動畫
    cardFlip: {
      keyframes: {
        '0%': { transform: 'rotateY(0deg)' },
        '50%': { transform: 'rotateY(90deg)' },
        '100%': { transform: 'rotateY(180deg)' },
      },
      duration: 'var(--animation-slow)',
      easing: 'var(--easing-smooth)',
      transformStyle: 'preserve-3d',
    },

    // 卡牌召喚動畫
    cardSummon: {
      keyframes: {
        '0%': {
          opacity: 0,
          transform: 'translateY(100px) scale(0.5) rotateX(90deg)',
        },
        '30%': {
          opacity: 0.7,
          transform: 'translateY(-20px) scale(1.1) rotateX(-10deg)',
        },
        '70%': {
          opacity: 0.9,
          transform: 'translateY(10px) scale(0.95) rotateX(5deg)',
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0) scale(1) rotateX(0deg)',
        },
      },
      duration: 'var(--animation-slowest)',
      easing: 'var(--easing-magical)',
    },

    // 魔法圓陣動畫
    magicalCircle: {
      keyframes: {
        '0%': {
          transform: 'scale(0) rotate(0deg)',
          opacity: 0,
        },
        '50%': {
          transform: 'scale(1.2) rotate(180deg)',
          opacity: 0.8,
        },
        '100%': {
          transform: 'scale(1) rotate(360deg)',
          opacity: 1,
        },
      },
      duration: 'var(--animation-slowest)',
      easing: 'var(--easing-magical)',
    },

    // 發光效果動畫
    glow: {
      keyframes: {
        '0%, 100%': {
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
        },
        '50%': {
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)',
        },
      },
      duration: 'var(--animation-slower)',
      easing: 'var(--easing-smooth)',
      iterationCount: 'infinite',
    },

    // 粒子飄散動畫
    particles: {
      keyframes: {
        '0%': {
          opacity: 1,
          transform: 'translateY(0) scale(0.5)',
        },
        '100%': {
          opacity: 0,
          transform: 'translateY(-100px) scale(1.5)',
        },
      },
      duration: 'var(--animation-slowest)',
      easing: 'var(--easing-smooth)',
    },
  },

  // 頁面轉場動畫
  pageTransitions: {
    fadeSlideUp: {
      enter: 'slideInUp',
      exit: 'fadeOut',
    },
    fadeSlideDown: {
      enter: 'slideInDown',
      exit: 'fadeOut',
    },
    scaleSlide: {
      enter: 'scaleIn',
      exit: 'slideOutLeft',
    },
  },

  // 懸浮互動動畫
  hover: {
    // 按鈕懸浮
    buttonLift: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'all var(--animation-fast) var(--easing-smooth)',
    },

    // 卡片懸浮
    cardLift: {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      transition: 'all var(--animation-normal) var(--easing-smooth)',
    },

    // 圖標懸浮
    iconBounce: {
      transform: 'scale(1.1)',
      transition: 'transform var(--animation-fast) var(--easing-bouncy)',
    },

    // 發光懸浮
    glowHover: {
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
      transition: 'box-shadow var(--animation-normal) var(--easing-smooth)',
    },
  },

  // CSS 變數映射
  cssVariables: {
    // 動畫時長
    '--animation-instant': '0ms',
    '--animation-fast': '150ms',
    '--animation-normal': '300ms',
    '--animation-slow': '500ms',
    '--animation-slower': '750ms',
    '--animation-slowest': '1000ms',

    // 緩動函數
    '--easing-linear': 'linear',
    '--easing-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--easing-bouncy': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    '--easing-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--easing-gaming': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '--easing-heroic': 'cubic-bezier(0.19, 1, 0.22, 1)',
    '--easing-magical': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export default animationsConfig;
