/**
 * Resume 專用配置 - 個人簡介與經歷概述
 * 此配置僅用於 Resume 頁面
 */

export const resumeSummaryConfig = {
  // 個人照片 (存放於 public/images/resume/)
  profileImage: '/images/resume/profile-photo.jpg',

  // 一句話簡介 (已存在於 personal.config.js，這裡可覆蓋)
  tagline: '擅長系統架構設計與高併發處理的後端工程師，致力於打造高品質且可擴展的系統架構',

  // 經歷概述 - 統整工作專案經驗
  careerSummary: `
    5+ 年後端開發經驗，從前端工程師成長為資深後端工程師。
    擅長 Node.js 生態系與高併發系統架構設計，曾主導企業級電商 SaaS 平台開發（API Service 300 RPS、Render Service 20 RPS）。
    熟悉微服務架構、快取策略、CI/CD 流程設計，並具備 AI 工具整合實戰經驗（AI Code Review 系統導入，團隊效率提升 30%）。
    專注於系統效能優化與架構演進，成功主導雲端遷移（AWS EKS → GCP Cloud Run）與架構轉型（Multi-deploy → Global Service）。
  `.trim(),

  // 核心競爭力摘要（可選，用於更精簡的版本）
  coreStrengths: [
    '高併發系統架構設計（日均 20 萬筆智慧連結處理）',
    '企業級 SaaS 平台開發經驗（300 RPS API Service）',
    'AI 工具整合實戰（Code Review 效率提升 30%）',
    '雲端架構遷移與成本優化（AWS → GCP）',
    '全端開發能力（Vue 3 + Node.js + MongoDB）',
  ],
};

export default resumeSummaryConfig;
