/**
 * Resume 專用配置 - 學歷與工作經歷
 * 此配置僅用於 Resume 頁面，動態版不使用
 */

export const educationConfig = [
  {
    id: 'iii-frontend',
    institution: 'Institute for Information Industry',
    institutionZh: '資策會',
    degree: 'Front-End Engineer Job Readiness Program',
    degreeZh: '前端工程師就業養成班',
    period: '2020/01 - 2020/07',
    startDate: '2020-01',
    endDate: '2020-07',
    type: 'training',
    highlights: [
      '完成前端開發專業培訓課程',
      '掌握 HTML5、CSS3、JavaScript 基礎',
      '學習 Vue.js、React 等現代前端框架',
    ],
  },
  {
    id: 'ncu-geology',
    institution: 'National Central University',
    institutionZh: '國立中央大學',
    degree: 'Applied Geology',
    degreeZh: '應用地質研究所',
    period: '2012/09 - 2014/07',
    startDate: '2012-09',
    endDate: '2014-07',
    type: 'graduate',
    highlights: [
      '碩士學位',
      '地質學專業研究',
    ],
  },
];

export const workExperienceConfig = [
  {
    id: '91app-senior-backend',
    company: '91APP_九易宇軒股份有限公司',
    companyEn: '91APP Inc.',
    position: 'Senior Backend Engineer',
    positionZh: '資深後端工程師',
    period: '2024/02 - now',
    startDate: '2024-02',
    endDate: null,
    type: 'fulltime',
    department: '技術部',
    achievements: [
      '設計並實現高併發智慧連結系統（日均 20 萬筆），API Service 300 RPS、Render Service 20 RPS',
      '導入 AI Code Review 系統（GitLab CI/CD + Dify），前後端開發效率提升約 30%',
      '主導企業級電商 SaaS 平台架構演進：從 Multi-deploy 轉換為 Global Service，簡化維運、降低成本、提升 release 效率',
      '主導雲端遷移：從 AWS EKS 遷移到 GCP Cloud Run，優化成本與部署效率',
      '建立壓測與監控體系：引入 Sentry benchmark，持續優化 API 效能',
    ],
    technologies: ['Node.js', 'Fastify', 'MongoDB', 'Redis', 'GCP', 'Docker', 'K8s', 'AI Integration'],
    relatedProjects: ['smart-deeplink-platform', 'enterprise-ecommerce-saas'],
  },
  {
    id: 'wes-engineer',
    company: '偉斯股份有限公司',
    companyEn: 'WES Corporation',
    position: 'Frontend Engineer → Fullstack Engineer',
    positionZh: '前端工程師 → 全端工程師',
    period: '2020/08 - 2024/01',
    startDate: '2020-08',
    endDate: '2024-01',
    type: 'fulltime',
    department: '技術部',
    achievements: [
      '開發 Powertool 3.0 Scanner 管理工具（Electron + Vue 3）',
      '韌體更新效率提升 40%（X-modem → Y-modem）',
      '重構內部管理系統，流程效率提升 2 倍',
      '重構設定檔格式（TXT → YAML），提升維護性',
    ],
    technologies: ['Vue 3', 'TypeScript', 'Electron', 'Node.js', 'Express', 'Fastify', 'MongoDB', 'Redis', 'MySQL', 'GCP', 'Docker'],
  },
  {
    id: 'yehsing-engineer',
    company: '業興環境科技股份有限公司',
    companyEn: 'Yeh Shing Environmental Technology',
    position: 'Environmental Engineer',
    positionZh: '環境工程師',
    period: '2018/04 - 2020/02',
    startDate: '2018-04',
    endDate: '2020-02',
    type: 'fulltime',
    department: '工程部',
    responsibilities: [
      '協助政府專案開發',
      '地下水文模型平台前端開發（Vue 2）',
      '環境數據分析與視覺化',
    ],
    achievements: [
      '成功交付地下水文模型平台前端系統',
      '實現複雜地理數據視覺化功能',
    ],
    technologies: ['Vue 2', 'JavaScript', 'D3.js', 'GIS'],
  },
  {
    id: 'ruichang-pm',
    company: '瑞昶科技股份有限公司',
    companyEn: 'Ruichang Technology',
    position: 'Project Manager',
    positionZh: '專案經理',
    period: '2016/03 - 2018/02',
    startDate: '2016-03',
    endDate: '2018-02',
    type: 'fulltime',
    department: '專案管理部',
    responsibilities: [
      '專案規劃與進度管理',
      '客戶需求溝通與協調',
      '團隊資源調度',
    ],
    achievements: [
      '成功管理多個專案交付',
      '累積跨部門協作經驗',
    ],
    technologies: [],
  },
];

export default {
  education: educationConfig,
  workExperience: workExperienceConfig,
};
