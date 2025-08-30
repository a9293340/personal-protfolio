/**
 * 3D 卡片系統數據配置
 * 包含不同類型和稀有度的卡片數據
 */

// 稀有度定義
const RARITY_CONFIG = {
  normal: {
    name: '普通',
    color: '#8a92b2',
    probability: 0.6
  },
  rare: {
    name: '稀有',
    color: '#3498db',
    probability: 0.25
  },
  epic: {
    name: '超稀有',
    color: '#9b59b6',
    probability: 0.12
  },
  legendary: {
    name: '傳說',
    color: '#f39c12',
    probability: 0.03
  }
};

// 稀有度展示卡片
const RARITY_DEMO_CARDS = [
  {
    id: 'normal-demo',
    title: '基礎技能',
    subtitle: '普通稀有度',
    icon: '🔧',
    rarity: 'normal',
    description: '基本的開發技能，是每個程式設計師的基礎。包含基本語法、工具使用等核心能力。',
    stats: [
      { icon: '⭐', label: '等級', value: '1' },
      { icon: '📈', label: '經驗', value: '100' }
    ],
    tags: ['HTML', 'CSS', 'JavaScript']
  },
  {
    id: 'rare-demo',
    title: '框架專精',
    subtitle: '稀有稀有度',
    icon: '⚡',
    rarity: 'rare',
    description: '深入掌握主流開發框架，能夠運用框架快速建構高品質應用程式。',
    stats: [
      { icon: '⭐', label: '等級', value: '3' },
      { icon: '📈', label: '經驗', value: '750' }
    ],
    tags: ['React', 'Vue.js', 'Node.js']
  },
  {
    id: 'epic-demo',
    title: '架構設計',
    subtitle: '超稀有稀有度',
    icon: '🏗️',
    rarity: 'epic',
    description: '具備系統架構設計能力，能夠設計可擴展、高效能的大型系統架構。',
    stats: [
      { icon: '⭐', label: '等級', value: '5' },
      { icon: '📈', label: '經驗', value: '2000' }
    ],
    tags: ['微服務', '分散式', 'DevOps']
  },
  {
    id: 'legendary-demo',
    title: '技術領導',
    subtitle: '傳說稀有度',
    icon: '👑',
    rarity: 'legendary',
    description: '頂級技術專家，具備技術領導力，能夠帶領團隊解決最複雜的技術挑戰。',
    stats: [
      { icon: '⭐', label: '等級', value: '10' },
      { icon: '📈', label: '經驗', value: '10000' }
    ],
    tags: ['Tech Lead', 'Mentor', 'Innovation']
  }
];

// 專案作品集卡片
const PROJECT_CARDS = [
  {
    id: 'project-1',
    title: '個人作品集網站',
    subtitle: '全端開發專案',
    icon: '🌐',
    rarity: 'epic',
    description: '採用現代化技術棧打造的個人作品集網站，具備響應式設計和豐富的互動效果。',
    stats: [
      { icon: '👀', label: '瀏覽', value: '1.2k' },
      { icon: '⭐', label: 'GitHub', value: '45' }
    ],
    tags: ['Vue.js', 'TailwindCSS', 'Three.js']
  },
  {
    id: 'project-2',
    title: 'E-Commerce 平台',
    subtitle: '企業級專案',
    icon: '🛒',
    rarity: 'legendary',
    description: '高效能電商平台，支援大流量、多語言、多貨幣，採用微服務架構。',
    stats: [
      { icon: '👥', label: '用戶', value: '50k+' },
      { icon: '💰', label: 'GMV', value: '$2M+' }
    ],
    tags: ['Spring Boot', 'Redis', 'MongoDB']
  },
  {
    id: 'project-3',
    title: 'AI 聊天機器人',
    subtitle: 'AI 整合專案',
    icon: '🤖',
    rarity: 'rare',
    description: '整合大語言模型的智能客服系統，提供自然語言理解和多輪對話能力。',
    stats: [
      { icon: '💬', label: '對話', value: '10k+' },
      { icon: '🎯', label: '準確率', value: '94%' }
    ],
    tags: ['Python', 'LangChain', 'OpenAI']
  },
  {
    id: 'project-4',
    title: '實時監控系統',
    subtitle: 'DevOps 工具',
    icon: '📊',
    rarity: 'rare',
    description: '企業級系統監控平台，提供實時指標收集、告警和視覺化儀表板。',
    stats: [
      { icon: '⚡', label: 'QPS', value: '100k+' },
      { icon: '📈', label: '指標', value: '500+' }
    ],
    tags: ['Go', 'Prometheus', 'Grafana']
  },
  {
    id: 'project-5',
    title: '區塊鏈錢包',
    subtitle: 'Web3 專案',
    icon: '💎',
    rarity: 'epic',
    description: '支援多鏈的去中心化錢包應用，具備 DeFi 功能和 NFT 管理能力。',
    stats: [
      { icon: '🔗', label: '鏈數', value: '8' },
      { icon: '💼', label: '資產', value: '$100k+' }
    ],
    tags: ['Solidity', 'Web3.js', 'MetaMask']
  },
  {
    id: 'project-6',
    title: '物聯網管理平台',
    subtitle: 'IoT 解決方案',
    icon: '🔌',
    rarity: 'normal',
    description: '工業級物聯網設備管理平台，支援大規模設備接入和數據處理。',
    stats: [
      { icon: '📡', label: '設備', value: '1000+' },
      { icon: '📊', label: '數據點', value: '1M+' }
    ],
    tags: ['MQTT', 'InfluxDB', 'Docker']
  }
];

// 技能認證卡片
const CERTIFICATION_CARDS = [
  {
    id: 'cert-1',
    title: 'AWS Solutions Architect',
    subtitle: '雲端架構認證',
    icon: '☁️',
    rarity: 'legendary',
    description: 'Amazon Web Services 解決方案架構師專業級認證，驗證雲端架構設計能力。',
    stats: [
      { icon: '📅', label: '獲得', value: '2023' },
      { icon: '⏱️', label: '有效期', value: '3年' }
    ],
    tags: ['AWS', 'Cloud', 'Architecture']
  },
  {
    id: 'cert-2',
    title: 'Google Cloud Professional',
    subtitle: 'GCP 專業認證',
    icon: '🔴',
    rarity: 'epic',
    description: 'Google Cloud Platform 專業雲端架構師認證，展現多雲環境expertise。',
    stats: [
      { icon: '📅', label: '獲得', value: '2023' },
      { icon: '⏱️', label: '有效期', value: '2年' }
    ],
    tags: ['GCP', 'Kubernetes', 'BigQuery']
  },
  {
    id: 'cert-3',
    title: 'MongoDB Developer',
    subtitle: '資料庫專業認證',
    icon: '🍃',
    rarity: 'rare',
    description: 'MongoDB 開發者認證，精通 NoSQL 資料庫設計和優化。',
    stats: [
      { icon: '📅', label: '獲得', value: '2022' },
      { icon: '⏱️', label: '有效期', value: '3年' }
    ],
    tags: ['MongoDB', 'NoSQL', 'Database']
  }
];

// 壓力測試用的卡片生成函數
function generateStressTestCards(count = 50) {
  const cards = [];
  const titles = [
    '微服務架構', '容器化部署', 'CI/CD 流水線', '負載均衡', '分散式快取',
    '訊息佇列', '資料庫優化', 'API 設計', '安全防護', '效能調優',
    '監控告警', '日誌分析', '容災備份', '自動化測試', '程式碼審查'
  ];
  const icons = ['⚙️', '🐳', '🔄', '⚖️', '🚀', '📨', '🗄️', '🔌', '🔒', '📊'];
  const rarities = ['normal', 'rare', 'epic', 'legendary'];
  
  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length];
    const icon = icons[i % icons.length];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    cards.push({
      id: `stress-${i}`,
      title: `${title} #${i + 1}`,
      subtitle: '壓力測試卡片',
      icon: icon,
      rarity: rarity,
      description: `這是第 ${i + 1} 張壓力測試卡片，用於驗證大量 3D 卡片的渲染效能和互動響應。`,
      stats: [
        { icon: '🔢', label: '編號', value: `${i + 1}` },
        { icon: '⚡', label: '效能', value: `${Math.floor(Math.random() * 100)}%` }
      ],
      tags: ['測試', '效能', '3D']
    });
  }
  
  return cards;
}

// 隨機選擇稀有度
function getRandomRarity() {
  const rand = Math.random();
  let accumulated = 0;
  
  for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
    accumulated += config.probability;
    if (rand <= accumulated) {
      return rarity;
    }
  }
  
  return 'normal';
}

// 導出配置
window.CARD_CONFIG = {
  RARITY_CONFIG,
  RARITY_DEMO_CARDS,
  PROJECT_CARDS,
  CERTIFICATION_CARDS,
  generateStressTestCards,
  getRandomRarity
};