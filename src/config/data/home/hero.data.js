/**
 * Hero 區域數據配置
 * Config-Driven Hero 文案設定
 */

export const heroData = {
  // 個人基本信息
  greeting: "👋 Hello, I'm",
  name: 'Backend Engineer',
  title: '後端工程師',
  subtitle: '系統架構師的專業軌跡',

  // 動態打字文字組合 (支援多句和重點字高亮)
  typingTexts: [
    {
      sentences: [
        '專精於 <highlight>Config-Driven</highlight> 架構設計',
        '追求 <highlight>高品質代碼</highlight> 與用戶體驗',
        '從 <highlight>後端工程師</highlight> 向 <highlight>系統架構師</highlight> 發展',
      ],
      speeds: [80, 120, 100], // 每句的打字速度
    },
    {
      sentences: [
        '熱衷於 <highlight>技術創新</highlight> 與團隊協作',
        '建構 <highlight>可擴展</highlight>、<highlight>可維護</highlight> 的系統',
        '持續學習新技術，<highlight>與時俱進</highlight>',
      ],
      speeds: [90, 110, 85],
    },
    {
      sentences: [
        '擅長 <highlight>微服務架構</highlight> 與 <highlight>雲端部署</highlight>',
        '注重 <highlight>性能優化</highlight> 與 <highlight>安全防護</highlight>',
        '相信技術能創造 <highlight>更美好的未來</highlight>',
      ],
      speeds: [95, 105, 75],
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
