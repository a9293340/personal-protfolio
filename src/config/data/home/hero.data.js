/**
 * Hero 區域數據配置
 * Config-Driven Hero 文案設定
 */

export const heroData = {
  // 個人基本信息
  greeting: "👋 Hello, I'm",
  name: 'Eric Hung',
  title: 'Senior Backend Engineer',
  subtitle: '從代碼到架構，從問題到解決方案',

  // 動態打字文字組合 (支援多句和重點字高亮)
  typingTexts: [
    {
      sentences: [
        '打造 <highlight>日均 20 萬筆</highlight> 連結生成系統，<highlight>99.95%</highlight> 可用性',
        '導入 <highlight>AI Code Review</highlight>，團隊效率提升 <highlight>30%</highlight>',
        '從 <highlight>全端工程師</highlight> 深化為 <highlight>後端專家</highlight>，邁向系統架構師',
      ],
      speeds: [80, 90, 100],
    },
    {
      sentences: [
        '專精 <highlight>Node.js</highlight> 與 <highlight>Golang</highlight>，打造高效能後端服務',
        '擅長 <highlight>微服務架構</highlight> 與 <highlight>雲端部署</highlight> (GCP/AWS)',
        '建立 <highlight>代碼規範</highlight>，推動團隊 <highlight>技術文化</highlight> 提升',
      ],
      speeds: [85, 95, 90],
    },
    {
      sentences: [
        '5 年經驗，<highlight>18 個專案</highlight>，從桌面應用到 <highlight>SaaS 平台</highlight>',
        '不只寫代碼，更注重 <highlight>系統設計</highlight> 與 <highlight>架構思維</highlight>',
        '持續學習，與 <highlight>AI</highlight> 協作，探索技術的 <highlight>無限可能</highlight>',
      ],
      speeds: [75, 100, 85],
    },
  ],

  // CTA 按鈕組配置
  ctaButtons: [
    {
      text: '查看技能樹',
      icon: '🌟',
      action: 'skills',
      primary: true,
    },
    {
      text: '專案展示',
      icon: '🚀',
      action: 'projects',
      primary: false,
    },
  ],

  // 動畫配置
  animations: {
    sentencePause: 800, // 句子間暫停時間
    groupPause: 3000, // 組間暫停時間
    deleteSpeed: 30, // 刪除速度
    backspaceCount: 2, // 隨機回刪字符數(最多2個)
    backspaceProbability: 0.1, // 回刪機率(10%)
    fadeOutDuration: 1000, // 淡出持續時間
    loopDelay: 2000, // 重新開始循環延遲
  },
};

/**
 * 獲取 Hero 配置
 */
export function getHeroConfig() {
  return heroData;
}

/**
 * 獲取打字機文案
 */
export function getTypingTexts() {
  return heroData.typingTexts;
}

/**
 * 獲取 CTA 按鈕配置
 */
export function getCTAButtons() {
  return heroData.ctaButtons;
}

/**
 * 更新打字機文案 (運行時動態更新)
 */
export function updateTypingTexts(newTexts) {
  if (Array.isArray(newTexts)) {
    heroData.typingTexts = newTexts;
  }
}

// 導出默認配置
export default heroData;
