/**
 * 色彩配置
 * 
 * Config-Driven 色彩系統，支援遊戲化設計風格
 */

export const colorsConfig = {
  // 主色調 - 遊戲風格配色
  primary: {
    // 主要暗色調 - 背景色系
    dark: "#0a0a0a",           // 主背景色
    "dark-lighter": "#141414",  // 稍亮背景
    "dark-secondary": "#1a1a2e", // 卡片背景
    "dark-tertiary": "#16213e",  // 懸浮元素背景
    
    // 主要金色系 - 強調色系
    gold: "#d4af37",           // 主要金色
    "gold-bright": "#f4d03f",  // 明亮金色
    "gold-dark": "#b8860b",    // 深色金色
    "gold-light": "#f7dc6f",   // 淺色金色
    
    // 主要藍色系 - 次要強調
    blue: "#2980b9",           // 主藍色
    "blue-bright": "#3498db",  // 明亮藍色
    "blue-dark": "#1f4e79",    // 深藍色
    "blue-light": "#85c1e9",   // 淺藍色
    
    // 警告與狀態色
    red: "#8b0000",            // 警告紅色
    "red-bright": "#e74c3c",   // 明亮紅色
    green: "#27ae60",          // 成功綠色
    "green-bright": "#2ecc71", // 明亮綠色
    
    // 中性色系
    gray: {
      900: "#1a1a1a",
      800: "#2d2d2d", 
      700: "#404040",
      600: "#666666",
      500: "#808080",
      400: "#999999",
      300: "#b3b3b3",
      200: "#cccccc",
      100: "#e6e6e6",
      50: "#f5f5f5"
    }
  },
  
  // 遊戲化色彩主題
  gaming: {
    // 稀有度色彩 (遊戲王風格)
    rarity: {
      normal: {
        primary: "#8B4513",      // 銅色
        secondary: "#A0522D",
        accent: "#DEB887",
        glow: "rgba(139, 69, 19, 0.3)"
      },
      rare: {
        primary: "#C0C0C0",      // 銀色
        secondary: "#A9A9A9", 
        accent: "#E5E5E5",
        glow: "rgba(192, 192, 192, 0.4)"
      },
      superRare: {
        primary: "#FFD700",      // 金色
        secondary: "#DAA520",
        accent: "#FFFF99",
        glow: "rgba(255, 215, 0, 0.5)"
      },
      legendary: {
        primary: "#FF6347",      // 全息彩虹色
        secondary: "#FF4500",
        accent: "#FFB6C1",
        glow: "rgba(255, 99, 71, 0.6)",
        holographic: "linear-gradient(45deg, #ff6347, #ffd700, #32cd32, #1e90ff, #ff69b4)"
      }
    },
    
    // 技能樹色彩
    skillTree: {
      mastered: "#d4af37",       // 已掌握 - 金色
      available: "#2980b9",      // 可學習 - 藍色
      locked: "#666666",         // 未解鎖 - 灰色
      learning: "#f39c12",       // 學習中 - 橙色
      connecting: "#d4af37",     // 連接線 - 金色
      
      // 技能類別色彩
      backend: "#2980b9",        // 後端 - 藍色
      architecture: "#d4af37",   // 架構 - 金色
      database: "#f4d03f",       // 資料庫 - 亮金色
      devops: "#27ae60",         // DevOps - 綠色
      frontend: "#9b59b6",       // 前端 - 紫色
      soft: "#e67e22"            // 軟技能 - 橙色
    },
    
    // UI 狀態色彩
    status: {
      success: "#27ae60",
      warning: "#f39c12",
      error: "#e74c3c",
      info: "#3498db",
      neutral: "#95a5a6"
    }
  },
  
  // 漸層色系
  gradients: {
    // 主要漸層
    primary: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    secondary: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    
    // 金色漸層  
    gold: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    goldDark: "linear-gradient(135deg, #b8860b 0%, #d4af37 100%)",
    
    // 藍色漸層
    blue: "linear-gradient(135deg, #2980b9 0%, #3498db 100%)",
    blueDark: "linear-gradient(135deg, #1f4e79 0%, #2980b9 100%)",
    
    // 特效漸層
    neon: "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
    sunset: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    aurora: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)",
    
    // 遊戲化特效
    holographic: "linear-gradient(45deg, #ff6347, #ffd700, #32cd32, #1e90ff, #ff69b4)",
    magicalCircle: "conic-gradient(from 0deg, #d4af37, #f4d03f, #d4af37, #b8860b, #d4af37)"
  },
  
  // 陰影色系
  shadows: {
    // 標準陰影
    small: "0 2px 4px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.4)",
    large: "0 8px 16px rgba(0, 0, 0, 0.5)",
    
    // 色彩陰影
    gold: "0 4px 8px rgba(212, 175, 55, 0.3)",
    blue: "0 4px 8px rgba(41, 128, 185, 0.3)",
    red: "0 4px 8px rgba(231, 76, 60, 0.3)",
    
    // 發光效果
    glow: {
      gold: "0 0 20px rgba(212, 175, 55, 0.5)",
      blue: "0 0 20px rgba(41, 128, 185, 0.5)", 
      red: "0 0 20px rgba(231, 76, 60, 0.5)",
      green: "0 0 20px rgba(39, 174, 96, 0.5)"
    },
    
    // 內部陰影
    inset: {
      light: "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
      dark: "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
    }
  },
  
  // 透明度變體
  opacity: {
    // 背景透明度
    background: {
      light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.1)", 
      strong: "rgba(255, 255, 255, 0.15)"
    },
    
    // 覆蓋層透明度
    overlay: {
      light: "rgba(0, 0, 0, 0.3)",
      medium: "rgba(0, 0, 0, 0.5)",
      strong: "rgba(0, 0, 0, 0.7)"
    },
    
    // 色彩透明度
    colors: {
      gold: {
        10: "rgba(212, 175, 55, 0.1)",
        20: "rgba(212, 175, 55, 0.2)",
        30: "rgba(212, 175, 55, 0.3)",
        50: "rgba(212, 175, 55, 0.5)"
      },
      blue: {
        10: "rgba(41, 128, 185, 0.1)",
        20: "rgba(41, 128, 185, 0.2)",
        30: "rgba(41, 128, 185, 0.3)",
        50: "rgba(41, 128, 185, 0.5)"
      }
    }
  },
  
  // 主題模式
  themes: {
    dark: {
      name: "Dark Gaming Theme",
      background: "#0a0a0a",
      foreground: "#ffffff",
      accent: "#d4af37",
      secondary: "#1a1a2e"
    },
    
    light: {
      name: "Light Gaming Theme", 
      background: "#f5f5f5",
      foreground: "#1a1a1a",
      accent: "#b8860b",
      secondary: "#e6e6e6"
    },
    
    neon: {
      name: "Cyberpunk Neon",
      background: "#0d1117", 
      foreground: "#00ff9f",
      accent: "#ff006e",
      secondary: "#161b22"
    }
  },
  
  // CSS 變數映射
  cssVariables: {
    // 主要色彩
    "--color-primary-dark": "#0a0a0a",
    "--color-secondary-dark": "#1a1a2e", 
    "--color-primary-gold": "#d4af37",
    "--color-bright-gold": "#f4d03f",
    "--color-primary-blue": "#2980b9",
    "--color-primary-red": "#8b0000",
    
    // 漸層
    "--gradient-primary": "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    "--gradient-gold": "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    "--gradient-blue": "linear-gradient(135deg, #2980b9 0%, #3498db 100%)",
    
    // 陰影
    "--shadow-small": "0 2px 4px rgba(0, 0, 0, 0.3)",
    "--shadow-medium": "0 4px 8px rgba(0, 0, 0, 0.4)",
    "--shadow-glow-gold": "0 0 20px rgba(212, 175, 55, 0.5)"
  }
};

export default colorsConfig;