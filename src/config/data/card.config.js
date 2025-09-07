/**
 * 遊戲王風格卡牌系統配置
 * 
 * 基於 projects.data.js 的專案數據，轉換為遊戲王風格的卡牌展示系統
 */

/**
 * 卡牌稀有度系統配置
 */
export const cardRarityConfig = {
  normal: {
    name: "普通",
    nameEn: "Normal", 
    color: "#8a8a8a",
    borderColor: "#666666",
    glowColor: "rgba(138, 138, 138, 0.3)",
    particleCount: 800,
    animationIntensity: 1.0,
    cardFrame: "/assets/cards/frames/normal-frame.png",
    effectDescription: "基礎專案，展現扎實的技術基礎"
  },
  rare: {
    name: "稀有",
    nameEn: "Rare",
    color: "#4a90e2", 
    borderColor: "#2e5bba",
    glowColor: "rgba(74, 144, 226, 0.5)",
    particleCount: 1500,
    animationIntensity: 1.3,
    cardFrame: "/assets/cards/frames/rare-frame.png",
    effectDescription: "優質專案，具有創新思維與技術深度"
  },
  superRare: {
    name: "超稀有",
    nameEn: "Super Rare",
    color: "#d4af37",
    borderColor: "#b8941f", 
    glowColor: "rgba(212, 175, 55, 0.7)",
    particleCount: 2500,
    animationIntensity: 1.6,
    cardFrame: "/assets/cards/frames/super-rare-frame.png",
    effectDescription: "卓越專案，展現系統架構師級別的技術實力"
  },
  legendary: {
    name: "傳說",
    nameEn: "Legendary",
    color: "#ff6b6b",
    borderColor: "#e55656",
    glowColor: "rgba(255, 107, 107, 0.9)",
    particleCount: 3500,
    animationIntensity: 2.0,
    cardFrame: "/assets/cards/frames/legendary-frame.png", 
    effectDescription: "傳說級專案，業界頂尖的架構設計與技術創新"
  }
};

/**
 * 卡牌屬性類型系統
 */
export const cardAttributeConfig = {
  // 專案類型對應遊戲王屬性
  backend: {
    name: "後端",
    nameEn: "Backend",
    icon: "⚡", 
    color: "#ff4757",
    element: "雷",
    description: "後端系統開發，資料處理與API設計的核心力量"
  },
  architecture: {
    name: "架構",
    nameEn: "Architecture", 
    icon: "🏛️",
    color: "#3742fa",
    element: "光",
    description: "系統架構設計，統籌全局的戰略規劃能力"
  },
  fullstack: {
    name: "全端",
    nameEn: "Full Stack",
    icon: "🌟",
    color: "#2ed573", 
    element: "風",
    description: "全端開發技能，前後端整合的完整解決方案"
  },
  opensource: {
    name: "開源",
    nameEn: "Open Source",
    icon: "🔓",
    color: "#ffa502",
    element: "地",
    description: "開源專案貢獻，技術社群的知識分享與協作"
  },
  devops: {
    name: "DevOps",
    nameEn: "DevOps", 
    icon: "⚙️",
    color: "#833471",
    element: "暗",
    description: "DevOps 工程，自動化部署與維運的專業能力"
  },
  ai: {
    name: "人工智能",
    nameEn: "AI",
    icon: "🤖",
    color: "#00d4ff",
    element: "光",
    description: "人工智能技術，機器學習與智能系統的前沿探索"
  },
  blockchain: {
    name: "區塊鏈",
    nameEn: "Blockchain",
    icon: "⛓️",
    color: "#f39c12",
    element: "暗",
    description: "區塊鏈技術，去中心化金融與加密貨幣的創新應用"
  }
};

/**
 * 卡牌數值計算公式
 */
export const cardStatsFormula = {
  // 攻擊力 = 複雜度 × 200 + 創新度 × 100
  attack: (complexity, innovation) => {
    return Math.min(3000, complexity * 200 + innovation * 100);
  },
  
  // 防禦力 = 實用價值 × 250 + 複雜度 × 50
  defense: (utility, complexity) => {
    return Math.min(3000, utility * 250 + complexity * 50);  
  },
  
  // 等級 = 基於整體評分的1-12等級
  level: (complexity, innovation, utility) => {
    const totalScore = complexity + innovation + utility;
    if (totalScore >= 28) return 12;      // 傳說級
    if (totalScore >= 24) return 10;      // 超稀有
    if (totalScore >= 20) return 8;       // 稀有  
    if (totalScore >= 16) return 6;       // 稀有
    if (totalScore >= 12) return 4;       // 普通
    return 2;                             // 普通
  }
};

/**
 * 遊戲王風格效果描述生成器
 */
export const cardEffectGenerator = {
  /**
   * 生成卡牌效果描述
   */
  generateEffect(projectData) {
    const { stats, category, highlights, rarity } = projectData;
    const templates = this.getEffectTemplates(category, rarity);
    
    // 選擇適合的模板
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 替換模板變數
    return template
      .replace('{complexity}', stats.complexity)
      .replace('{innovation}', stats.innovation)
      .replace('{utility}', stats.utility)
      .replace('{teamSize}', stats.teamSize)
      .replace('{developmentTime}', stats.developmentTime)
      .replace('{mainTech}', this.getMainTechnology(projectData.technologies))
      .replace('{keyFeature}', highlights[0] || '技術創新');
  },

  /**
   * 獲取效果描述模板
   */
  getEffectTemplates(category, rarity) {
    const baseTemplates = {
      backend: [
        "【後端魔法】這張卡召喚時，可以從卡組搜索1張「API設計」魔法卡加入手牌。",
        "【資料庫連結】每回合1次，可以將1張「SQL查詢」從墓地加入手牌。",
        "【微服務召喚】可以特殊召喚任意數量的「服務節點」衍生物（攻擊力/防禦力各500）。"
      ],
      architecture: [
        "【系統設計】場上每有1個其他「架構」類型怪獸，這張卡的攻擊力上升300點。",
        "【架構展開】這張卡召喚成功時，可以從卡組特殊召喚1隻4星以下的「組件」類型怪獸。",
        "【設計模式】1回合1次，可以無效對方1個怪獸效果的發動。"
      ],
      fullstack: [
        "【全端整合】這張卡可以當作「前端」或「後端」類型怪獸使用。",
        "【技術棧融合】可以將手牌中1張「前端」和1張「後端」怪獸融合召喚。",
        "【跨域通訊】雙方玩家每次抽卡時，你可以抽取1張額外卡牌。"
      ],
      opensource: [
        "【開源貢獻】這張卡在墓地存在時，你每回合可以額外召喚1隻怪獸。",
        "【社群協作】這張卡召喚時，雙方玩家可以各自從卡組抽取1張卡牌。",
        "【知識共享】場上每有1隻其他怪獸，你每回合可以多抽1張卡。"
      ]
    };

    let templates = baseTemplates[category] || baseTemplates.backend;
    
    // 根據稀有度添加額外效果
    if (rarity === 'legendary') {
      templates = templates.map(t => t + " 【傳說效果】這張卡不會被戰鬥或效果破壞。");
    } else if (rarity === 'superRare') {
      templates = templates.map(t => t + " 【超稀有效果】這張卡的效果無法被無效化。");
    }
    
    return templates;
  },

  /**
   * 獲取主要技術
   */
  getMainTechnology(technologies) {
    if (!technologies || technologies.length === 0) return "未知技術";
    return technologies[0].name || "技術框架";
  }
};

/**
 * 卡牌視覺效果配置
 */
export const cardVisualConfig = {
  // 卡牌尺寸配置
  dimensions: {
    width: 300,
    height: 420,
    borderRadius: 12,
    borderWidth: 3
  },
  
  // 動畫效果配置
  animations: {
    hover: {
      scale: 1.05,
      rotateY: 5,
      duration: 0.3,
      ease: "power2.out"
    },
    summon: {
      duration: 8000, // 8秒召喚動畫
      phases: {
        materialize: 1000,    // 卡牌實體化
        reveal: 2000,         // 卡牌翻轉顯示
        glow: 1500,          // 稀有度發光
        stabilize: 1000       // 穩定顯示
      }
    },
    rarity: {
      normal: { glowIntensity: 0.2, pulseSpeed: 2 },
      rare: { glowIntensity: 0.4, pulseSpeed: 1.5 },
      superRare: { glowIntensity: 0.6, pulseSpeed: 1.2 },
      legendary: { glowIntensity: 0.9, pulseSpeed: 0.8 }
    }
  },
  
  // 粒子效果配置 
  particles: {
    normal: { count: 50, speed: 1, size: 2 },
    rare: { count: 100, speed: 1.2, size: 2.5 },
    superRare: { count: 200, speed: 1.5, size: 3 },
    legendary: { count: 350, speed: 2, size: 4 }
  }
};

/**
 * 卡牌數據轉換器
 */
export class CardDataConverter {
  /**
   * 將專案數據轉換為卡牌數據
   */
  static convertProjectToCard(projectData) {
    const { stats, category, rarity } = projectData;
    
    return {
      // 基礎卡牌信息
      id: projectData.id,
      name: projectData.name,
      rarity: rarity,
      attribute: category,
      
      // 遊戲王數值
      attack: cardStatsFormula.attack(stats.complexity, stats.innovation),
      defense: cardStatsFormula.defense(stats.utility, stats.complexity), 
      level: cardStatsFormula.level(stats.complexity, stats.innovation, stats.utility),
      
      // 稀有度配置
      rarityConfig: cardRarityConfig[rarity],
      attributeConfig: cardAttributeConfig[category],
      
      // 卡牌效果
      effect: cardEffectGenerator.generateEffect(projectData),
      flavorText: this.generateFlavorText(projectData),
      
      // 視覺配置
      visualConfig: {
        ...cardVisualConfig,
        rarity: cardVisualConfig.animations.rarity[rarity],
        particles: cardVisualConfig.particles[rarity]
      },
      
      // 原始專案數據引用
      originalData: projectData
    };
  }
  
  /**
   * 生成風味文本
   */
  static generateFlavorText(projectData) {
    const templates = [
      `"${projectData.shortDescription}"`,
      `"在 ${projectData.stats.developmentTime} 的開發歷程中，展現了卓越的技術實力。"`,
      `"使用 ${projectData.technologies?.[0]?.name || '先進技術'} 構建的創新解決方案。"`,
      `"這是一個改變遊戲規則的 ${projectData.category} 專案。"`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  /**
   * 批量轉換所有專案
   */
  static convertAllProjects(projectsData) {
    const cards = {};
    
    for (const [projectId, projectData] of Object.entries(projectsData.all)) {
      cards[projectId] = this.convertProjectToCard(projectData);
    }
    
    return {
      metadata: {
        ...projectsData.metadata,
        totalCards: Object.keys(cards).length,
        cardsByRarity: this.groupCardsByRarity(cards)
      },
      featured: projectsData.featured,
      cards: cards
    };
  }
  
  /**
   * 按稀有度分組卡牌
   */
  static groupCardsByRarity(cards) {
    const groups = { normal: [], rare: [], superRare: [], legendary: [] };
    
    for (const card of Object.values(cards)) {
      groups[card.rarity].push(card.id);
    }
    
    return groups;
  }
}

export default {
  cardRarityConfig,
  cardAttributeConfig,
  cardStatsFormula,
  cardEffectGenerator,
  cardVisualConfig,
  CardDataConverter
};