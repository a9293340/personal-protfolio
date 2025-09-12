/**
 * personal-projects.data.js - 個人專案數據配置
 * 
 * 包含所有個人專案的詳細資訊：
 * - 基本資訊（標題、描述、類型、狀態）
 * - 遊戲王卡牌數據（攻擊力、防禦力、等級）
 * - 技術棧和工具
 * - 專案圖片和截圖
 * - 相關連結
 * - 稀有度和重要性評分
 */

export const personalProjectsData = [
  {
    id: 'personal-ai-chat-assistant',
    title: '🌟 AI 智能聊天助手',
    description: '基於 OpenAI GPT 模型的智能對話系統，支援多輪對話、上下文理解、情感分析和個性化回應。整合語音識別和文字轉語音功能。',
    category: 'ai',
    rarity: 'legendary',
    status: 'completed',
    importance: 10,
    completedDate: '2024-08',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 9,    // 技術複雜度 (1-10)
      innovation: 8,    // 創新程度 (1-10)
      utility: 9        // 實用價值 (1-10)
    },
    
    // 遊戲王卡牌數據
    cardData: {
      attack: 3200,
      defense: 2800,
      level: 10,
      attribute: 'LIGHT',
      type: 'AI/Synchro/Effect'
    },
    
    // 技術棧
    technologies: [
      'React', 'Node.js', 'OpenAI API', 'WebSocket', 
      'Speech Recognition', 'Text-to-Speech', 'Redis', 'MongoDB'
    ],
    
    // 專案圖片
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/ai-chat/screenshot-1.jpg',
        '/images/personal-projects/ai-chat/screenshot-2.jpg',
        '/images/personal-projects/ai-chat/screenshot-3.jpg'
      ]
    },
    
    // 相關連結
    links: {
      demo: 'https://ai-chat-demo.example.com',
      github: 'https://github.com/user/ai-chat-assistant',
      article: 'https://blog.example.com/building-ai-chat-assistant'
    },
    
    // 專案亮點
    highlights: [
      '支援 20+ 語言的多語言對話',
      '整合 OpenAI GPT-4 和 Claude',
      '實時語音對話功能',
      '個性化記憶和學習能力',
      '情感分析和情境適應'
    ]
  },

  {
    id: 'personal-crypto-portfolio-tracker',
    title: '⚡ 加密貨幣投資組合追蹤器',
    description: '全功能加密貨幣投資組合管理應用，支援多交易所 API 整合、實時價格追蹤、收益分析、風險評估和自動化交易策略。',
    category: 'blockchain',
    rarity: 'legendary',
    status: 'completed',
    importance: 9,
    completedDate: '2024-06',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8,    // 技術複雜度 (1-10)
      innovation: 9,    // 創新程度 (1-10)
      utility: 8        // 實用價值 (1-10)
    },
    
    cardData: {
      attack: 3000,
      defense: 2600,
      level: 9,
      attribute: 'DARK',
      type: 'Crypto/Fusion/Effect'
    },
    
    technologies: [
      'Vue.js', 'TypeScript', 'Web3.js', 'Ethers.js',
      'Chart.js', 'WebSocket', 'Express.js', 'PostgreSQL', 'Docker'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: []
    },
    
    links: {
      demo: 'https://crypto-tracker-demo.example.com',
      github: 'https://github.com/user/crypto-portfolio-tracker'
    },
    
    highlights: [
      '整合 15+ 主要加密貨幣交易所',
      'DeFi 協議收益追蹤',
      '自動化再平衡策略',
      '稅務報告生成',
      'NFT 收藏品管理'
    ]
  },

  {
    id: 'personal-fitness-ai-coach',
    title: '💪 AI 健身私人教練',
    description: 'React Native 開發的智能健身應用，使用電腦視覺技術分析動作姿態，提供即時反饋和個人化訓練計畫。',
    category: 'mobile',
    rarity: 'superRare',
    status: 'completed',
    importance: 8,
    completedDate: '2024-04',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8,    // 技術複雜度：AI視覺識別+移動開發
      innovation: 7,    // 創新程度：結合AI和健身指導
      utility: 9        // 實用價值：個人健康管理實用性高
    },
    
    cardData: {
      attack: 2800,
      defense: 2200,
      level: 8,
      attribute: 'EARTH',
      type: 'Mobile/Xyz/Effect'
    },
    
    technologies: [
      'React Native', 'TensorFlow.js', 'Firebase', 'Redux Toolkit',
      'React Native Vision Camera', 'Pose Detection', 'Chart.js', 'Stripe'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/fitness-ai/workout.jpg',
        '/images/personal-projects/fitness-ai/analysis.jpg'
      ]
    },
    
    links: {
      github: 'https://github.com/user/fitness-ai-coach',
      store: 'https://apps.apple.com/app/fitness-ai-coach'
    },
    
    highlights: [
      'AI 動作姿態分析',
      '個人化訓練計畫生成',
      '營養建議和卡路里追蹤',
      '社群挑戰和排行榜',
      '穿戴裝置整合'
    ]
  },

  {
    id: 'personal-portfolio-website',
    title: '🎮 遊戲化個人作品集網站',
    description: '融合流亡黯道技能樹和遊戲王召喚系統的創新作品集網站，展現全端開發技能和創意設計能力。',
    category: 'frontend',
    rarity: 'legendary',
    status: 'inProgress',
    importance: 10,
    completedDate: '2024-09',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 9,    // 技術複雜度：複雜動畫系統+遊戲化設計
      innovation: 10,   // 創新程度：創新的遊戲化作品集概念
      utility: 8        // 實用價值：展示專業技能和創意
    },
    
    cardData: {
      attack: 3500,
      defense: 3000,
      level: 10,
      attribute: 'LIGHT',
      type: 'Portfolio/Synchro/Effect'
    },
    
    technologies: [
      'Vanilla JavaScript', 'GSAP', 'Three.js', 'Vite',
      'CSS3', 'HTML5', 'Canvas API', 'Web Audio API'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/portfolio/skill-tree.jpg',
        '/images/personal-projects/portfolio/timeline.jpg',
        '/images/personal-projects/portfolio/summoning.jpg'
      ]
    },
    
    links: {
      demo: 'https://portfolio.example.com',
      github: 'https://github.com/user/gaming-portfolio'
    },
    
    highlights: [
      '流亡黯道風格六角形技能樹',
      '遊戲王召喚特效系統',
      '互動式專案時間軸',
      '響應式遊戲化設計',
      'Config-Driven 架構'
    ]
  },

  {
    id: 'personal-realtime-collaboration-tool',
    title: '🤝 即時協作白板工具',
    description: '多人即時協作的數位白板應用，支援繪圖、文字、圖片、視訊通話，適用於遠程會議、教學和創意發想。',
    category: 'fullstack',
    rarity: 'superRare',
    status: 'completed',
    importance: 7,
    completedDate: '2024-02',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8,    // 技術複雜度：即時協作+視訊+Canvas
      innovation: 7,    // 創新程度：整合多媒體協作功能
      utility: 9        // 實用價值：遠程協作需求高
    },
    
    cardData: {
      attack: 2600,
      defense: 2400,
      level: 7,
      attribute: 'WIND',
      type: 'Collaboration/Sync/Effect'
    },
    
    technologies: [
      'Next.js', 'Socket.io', 'Canvas API', 'WebRTC',
      'PostgreSQL', 'Redis', 'AWS S3', 'Docker'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/whiteboard/collaboration.jpg',
        '/images/personal-projects/whiteboard/tools.jpg'
      ]
    },
    
    links: {
      demo: 'https://whiteboard-demo.example.com',
      github: 'https://github.com/user/realtime-whiteboard'
    },
    
    highlights: [
      '支援 50+ 人同時協作',
      '即時同步繪圖和編輯',
      '內建視訊和語音通話',
      '豐富的繪圖工具集',
      '歷史版本和恢復功能'
    ]
  },

  {
    id: 'personal-smart-home-dashboard',
    title: '🏠 智慧家居控制面板',
    description: '整合多品牌智慧家居設備的統一控制面板，支援場景自動化、語音控制、能源監控和安全警報。',
    category: 'fullstack',
    rarity: 'rare',
    status: 'completed',
    importance: 6,
    completedDate: '2023-11',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 7,    // 技術複雜度：IoT整合+自動化系統
      innovation: 6,    // 創新程度：整合現有IoT技術
      utility: 8        // 實用價值：家居自動化實用性高
    },
    
    cardData: {
      attack: 2400,
      defense: 2000,
      level: 6,
      attribute: 'EARTH',
      type: 'IoT/Link/Effect'
    },
    
    technologies: [
      'React', 'Node.js', 'MQTT', 'InfluxDB',
      'Grafana', 'Home Assistant', 'Docker', 'Nginx'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/smart-home/dashboard.jpg',
        '/images/personal-projects/smart-home/automation.jpg'
      ]
    },
    
    links: {
      demo: 'https://smart-home-demo.example.com',
      github: 'https://github.com/user/smart-home-dashboard'
    },
    
    highlights: [
      '統一管理 20+ 品牌設備',
      '智能場景自動化',
      '能源使用分析',
      '安全監控和警報',
      '語音助手整合'
    ]
  },

  {
    id: 'personal-stock-analysis-bot',
    title: '📈 AI 股票分析機器人',
    description: '使用機器學習和自然語言處理技術分析股市新聞、財報和技術指標，提供投資建議和風險評估。',
    category: 'ai',
    rarity: 'superRare',
    status: 'completed',
    importance: 8,
    completedDate: '2023-09',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 8,    // 技術複雜度：ML模型+數據分析
      innovation: 8,    // 創新程度：結合多種AI技術
      utility: 7        // 實用價值：投資輔助工具
    },
    
    cardData: {
      attack: 2900,
      defense: 2300,
      level: 8,
      attribute: 'LIGHT',
      type: 'AI/Ritual/Effect'
    },
    
    technologies: [
      'Python', 'TensorFlow', 'NLTK', 'Pandas',
      'Flask', 'Redis', 'PostgreSQL', 'Alpha Vantage API'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/stock-bot/analysis.jpg',
        '/images/personal-projects/stock-bot/predictions.jpg'
      ]
    },
    
    links: {
      github: 'https://github.com/user/stock-analysis-bot',
      article: 'https://blog.example.com/ai-stock-analysis'
    },
    
    highlights: [
      '新聞情感分析',
      '技術指標自動化分析',
      '風險評估模型',
      '投資組合優化建議',
      '即時市場監控'
    ]
  },

  {
    id: 'personal-recipe-recommendation-app',
    title: '🍳 AI 食譜推薦應用',
    description: 'Flutter 開發的智能食譜推薦應用，根據用戶偏好、營養需求、現有食材和健康目標推薦個性化料理。',
    category: 'mobile',
    rarity: 'rare',
    status: 'completed',
    importance: 5,
    completedDate: '2023-07',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 6,    // 技術複雜度：推薦系統+移動開發
      innovation: 6,    // 創新程度：個人化食譜推薦
      utility: 8        // 實用價值：日常烹飪幫助
    },
    
    cardData: {
      attack: 2200,
      defense: 1800,
      level: 5,
      attribute: 'WATER',
      type: 'Mobile/Normal/Effect'
    },
    
    technologies: [
      'Flutter', 'Dart', 'Firebase', 'TensorFlow Lite',
      'Cloud Functions', 'Firestore', 'ML Kit'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/recipe-app/recommendations.jpg',
        '/images/personal-projects/recipe-app/cooking.jpg'
      ]
    },
    
    links: {
      github: 'https://github.com/user/recipe-recommendation-app',
      store: 'https://play.google.com/store/apps/details?id=com.example.recipe'
    },
    
    highlights: [
      '個性化食譜推薦',
      '營養成分分析',
      '購物清單生成',
      '烹飪步驟語音導航',
      '社群分享和評價'
    ]
  },

  {
    id: 'personal-markdown-blog-engine',
    title: '📝 靜態部落格生成器',
    description: 'Go 語言開發的高性能靜態部落格生成器，支援 Markdown、主題系統、SEO 優化和多語言內容管理。',
    category: 'backend',
    rarity: 'rare',
    status: 'completed',
    importance: 4,
    completedDate: '2023-05',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 5,    // 技術複雜度：靜態網站生成
      innovation: 4,    // 創新程度：常見部落格系統
      utility: 7        // 實用價值：內容發佈工具
    },
    
    cardData: {
      attack: 2000,
      defense: 2200,
      level: 4,
      attribute: 'EARTH',
      type: 'Tool/Normal/Effect'
    },
    
    technologies: [
      'Go', 'Hugo', 'YAML', 'SCSS',
      'GitHub Actions', 'Netlify', 'Markdown'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/blog-engine/admin.jpg',
        '/images/personal-projects/blog-engine/themes.jpg'
      ]
    },
    
    links: {
      demo: 'https://blog-demo.example.com',
      github: 'https://github.com/user/markdown-blog-engine'
    },
    
    highlights: [
      '極快的生成速度',
      '可視化主題編輯器',
      '自動 SEO 優化',
      '多語言支援',
      'CI/CD 自動部署'
    ]
  },

  {
    id: 'personal-password-manager',
    title: '🔐 跨平台密碼管理器',
    description: '使用 Electron 和 React 開發的安全密碼管理應用，支援端到端加密、生物識別解鎖和多設備同步。',
    category: 'fullstack',
    rarity: 'normal',
    status: 'completed',
    importance: 3,
    completedDate: '2023-03',
    
    // 專案統計數據 (用於卡牌數值計算)
    stats: {
      complexity: 6,    // 技術複雜度：加密安全+跨平台開發
      innovation: 5,    // 創新程度：常見密碼管理工具
      utility: 9        // 實用價值：安全管理必需
    },
    
    cardData: {
      attack: 1800,
      defense: 2400,
      level: 3,
      attribute: 'DARK',
      type: 'Security/Defensive/Effect'
    },
    
    technologies: [
      'Electron', 'React', 'SQLite', 'CryptoJS',
      'Node.js', 'Biometric API'
    ],
    
    images: {
      thumbnail: null, // 使用預設圖標
      screenshots: [
        '/images/personal-projects/password-manager/vault.jpg'
      ]
    },
    
    links: {
      github: 'https://github.com/user/password-manager'
    },
    
    highlights: [
      'AES-256 端到端加密',
      '指紋和臉部解鎖',
      '安全密碼生成器',
      '自動填充功能',
      '離線使用支援'
    ]
  }
];

// 導出統計資訊
export const personalProjectsStats = {
  total: personalProjectsData.length,
  byCategory: personalProjectsData.reduce((stats, project) => {
    stats[project.category] = (stats[project.category] || 0) + 1;
    return stats;
  }, {}),
  byRarity: personalProjectsData.reduce((stats, project) => {
    stats[project.rarity] = (stats[project.rarity] || 0) + 1;
    return stats;
  }, {}),
  byStatus: personalProjectsData.reduce((stats, project) => {
    stats[project.status] = (stats[project.status] || 0) + 1;
    return stats;
  }, {}),
  averageImportance: personalProjectsData.reduce((sum, project) => sum + project.importance, 0) / personalProjectsData.length
};

// 導出類別和稀有度映射
export const projectCategories = {
  frontend: { label: '前端開發', icon: '🎨', color: '#61dafb' },
  backend: { label: '後端開發', icon: '⚙️', color: '#68a063' },
  fullstack: { label: '全端開發', icon: '🔧', color: '#f7df1e' },
  mobile: { label: '移動開發', icon: '📱', color: '#a4c639' },
  ai: { label: 'AI/機器學習', icon: '🧠', color: '#ff6f00' },
  blockchain: { label: '區塊鏈', icon: '⛓️', color: '#f7931a' }
};

export const projectRarities = {
  normal: { label: '普通', icon: '⚪', color: '#8e8e8e' },
  rare: { label: '稀有', icon: '🔸', color: '#4169e1' },
  superRare: { label: '超稀有', icon: '💎', color: '#9400d3' },
  legendary: { label: '傳說', icon: '⭐', color: '#ffd700' }
};