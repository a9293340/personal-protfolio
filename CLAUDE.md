# CLAUDE.md - 遊戲化個人網站開發指南

## 專案概述

這是一個融合流亡黯道與遊戲王風格的遊戲化個人作品集網站，採用 Config-Driven 架構設計，展現後端工程師向系統架構師發展的專業軌跡。

## 核心設計原則與開發規範

### 1. 代碼共用原則
- **組件化設計**：所有 UI 元素都應封裝為可重用組件
- **工具函數共用**：相同邏輯的代碼必須抽取為共用函數
- **樣式系統統一**：使用 CSS 變數和 Design Token 確保視覺一致性
- **配置數據集中**：所有內容數據通過配置文件統一管理

### 2. 避免寫死原則
- **配置驅動**：頁面結構、內容、樣式都通過配置文件控制
- **動態載入**：組件和資源採用動態載入機制
- **參數化設計**：所有可變參數都應該可配置
- **環境適配**：根據設備和環境自動調整行為

### 3. 代碼品質檢查
每次完成功能後必須執行：
```bash
# TypeScript 類型檢查
npm run type-check

# ESLint 代碼檢查
npm run lint

# 修復可自動修復的問題
npm run lint:fix

# 執行測試
npm run test
```

### 4. Git 提交管理
- Git commit 和 push 由用戶決定時機
- 未明確禁止的 git 操作可以自行執行
- 每個功能完成後建議執行 `git status` 檢查狀態

### 5. 實作權限控制 ⚠️ 重要原則
- **未經明確指示不得開始實作**
- 只能進行分析、規劃、討論，不可直接建立檔案或目錄
- 用戶說"開始"或明確要求實作時才能動手
- 避免過於主動，須等待用戶明確指令

## 技術架構

### 建構工具
- **Vite** - 現代化建構工具
- **原生技術棧**：HTML5, CSS3, ES6+ JavaScript
- **動畫庫**：GSAP (Green Sock Animation Platform)
- **3D效果**：CSS3 Transform + 選擇性 Three.js

### 專案結構
```
src/
├── config/                     # 配置文件 - 所有內容數據
│   ├── pages/                  # 頁面配置
│   ├── data/                   # 數據配置
│   ├── theme/                  # 主題配置
│   └── site.config.js          # 全站配置
├── core/                       # 核心系統
│   ├── config/                 # 配置管理器
│   ├── router/                 # SPA 路由
│   ├── state/                  # 狀態管理
│   ├── events/                 # 事件系統
│   └── components/             # 基礎組件類
├── components/                 # 可重用組件
│   ├── common/                 # 通用組件
│   ├── gaming/                 # 遊戲風格組件
│   └── layout/                 # 佈局組件
├── pages/                      # 頁面組件
├── systems/                    # 功能系統
│   ├── AudioManager/           # 音效管理
│   ├── AnimationManager/       # 動畫管理
│   └── PreloadManager/         # 預載管理
└── assets/                     # 靜態資源
```

## 核心功能模組

### 1. 技能樹系統 (SkillTree)
**風格**：流亡黯道被動技能樹
- **座標系統**：六角形網格，從中心放射擴展
- **節點狀態**：已掌握(金色發光) / 可學習(藍色微光) / 未解鎖(暗沉)
- **互動功能**：拖曳、縮放、點擊查看詳情
- **連線系統**：技能點之間的學習路徑連線

### 2. 專案卡片系統 (ProjectCards) 
**風格**：3D 翻轉卡片展示
- **稀有度系統**：普通/稀有/超稀有/傳說 (不同邊框特效)
- **翻轉動畫**：CSS 3D Transform 實現
- **分類篩選**：按技術領域篩選專案
- **詳情展示**：模態框顯示完整專案資訊

### 3. 遊戲王卡牌系統 (YugiohCards)
**風格**：遊戲王卡牌收藏冊
- **卡牌設計**：完整還原遊戲王卡牌視覺
- **召喚動畫**：魔法陣特效 + 粒子系統
- **閃卡效果**：光線流動動畫
- **卡組管理**：不同技術領域的卡組分類

### 4. 角色狀態面板 (CharacterPanel)
**風格**：RPG 角色屬性界面  
- **職業展示**：後端工程師 → 系統架構師
- **等級系統**：基於工作年資動態計算
- **屬性面板**：技術實力、架構思維、團隊協作等
- **成就徽章**：重要專案里程碑展示

## 設計系統

### 色彩系統
```css
/* 主色調 */
--primary-dark: #0a0a0a;           /* 主背景 */
--secondary-dark: #1a1a2e;         /* 卡片背景 */
--primary-gold: #d4af37;           /* 主要金色 */
--bright-gold: #f4d03f;            /* 強調金色 */
--primary-blue: #2980b9;           /* 主藍色 */
--primary-red: #8b0000;            /* 警告紅色 */
```

### 字體系統
```css
/* 主要字體 */
--font-heading: 'Cinzel', 'Noto Serif TC', serif;        /* 標題 */
--font-body: 'Inter', 'Noto Sans TC', sans-serif;        /* 內文 */
--font-code: 'Fira Code', 'JetBrains Mono', monospace;   /* 代碼 */
```

### 間距系統
基於 8px 網格：
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
```

## 開發工作流程

### 1. 功能開發流程
1. **需求分析** - 理解功能需求和用戶體驗目標
2. **配置設計** - 設計對應的配置文件結構
3. **組件開發** - 實現可重用的組件
4. **集成測試** - 驗證功能完整性
5. **品質檢查** - 執行 lint、type-check、test
6. **性能優化** - 確保動畫流暢度和載入速度

### 2. 配置驅動開發
所有頁面內容和結構都通過配置文件控制：

```javascript
// 範例：頁面配置文件
export const aboutPageConfig = {
  meta: {
    title: "About - Backend Engineer",
    description: "了解我的技術背景與職涯發展"
  },
  layout: {
    type: "three-column",
    maxWidth: "1200px"
  },
  sections: [
    {
      id: "character-panel",
      type: "character-status", 
      position: { column: 1, order: 1 },
      config: {
        // 組件特定配置
      }
    }
  ]
};
```

### 3. 組件開發規範
所有組件都應繼承基礎組件類：

```javascript
import { BaseComponent } from '../../../core/components/BaseComponent.js';

export class SkillTree extends BaseComponent {
  getDefaultConfig() {
    return {
      interactive: true,
      enableZoom: true,
      animationDuration: 300
    };
  }
  
  getInitialState() {
    return {
      selectedSkill: null,
      viewport: { x: 0, y: 0, scale: 1 }
    };
  }
  
  // 實現具體功能...
}
```

## 性能與優化

### 動畫性能
- 優先使用 `transform` 和 `opacity` 屬性
- 啟用 GPU 加速：`transform: translateZ(0)`
- 目標幀率：桌面 60fps，移動 30fps+

### 載入優化
- 圖片懶載入和響應式圖片
- 組件和配置文件動態載入
- 音效和字體預載入

### 響應式設計
```css
/* 斷點系統 */
--breakpoint-sm: 640px;    /* 手機橫向 */
--breakpoint-md: 768px;    /* 平板直向 */
--breakpoint-lg: 1024px;   /* 平板橫向 */
--breakpoint-xl: 1280px;   /* 桌面 */
```

## 無障礙設計 (A11y)

### 鍵盤導航
- 所有互動元素支援 Tab 導航
- 技能樹支援方向鍵導航
- 明確的焦點指示器

### 螢幕閱讀器支援
- 完整的 ARIA 標籤
- 語意化 HTML 結構
- 替代文字和描述

### 色彩對比
- 文字對比度符合 WCAG AA 標準
- 提供高對比度模式支援

## 測試策略

### 單元測試
- 配置載入和驗證
- 組件狀態管理
- 工具函數邏輯

### 整合測試
- 頁面渲染流程
- 組件間通訊
- 路由導航

### 視覺測試
- 跨瀏覽器兼容性
- 響應式設計驗證
- 動畫效果確認

## 部署與維護

### 建構配置
- Vite 生產環境優化
- 資源壓縮和分割
- Service Worker 快取

### 部署平台
- GitHub Pages (主要)
- 支援自訂域名
- 自動化 CI/CD 流程

### 監控指標
- Core Web Vitals
- 使用者互動指標
- 錯誤追蹤

## 常用指令

```bash
# 開發環境
npm run dev

# 建構生產版本
npm run build

# 預覽建構結果
npm run preview

# 代碼檢查
npm run lint
npm run lint:fix

# 類型檢查
npm run type-check

# 測試
npm run test
npm run test:ui

# 配置驗證
npm run config:validate

# 分析建構產物
npm run analyze
```

## 開發注意事項

1. **效能優先**：每個動畫都要考慮效能影響
2. **響應式優先**：所有功能都要考慮多設備適配
3. **無障礙優先**：確保所有用戶都能正常使用
4. **配置驅動**：新功能都要考慮配置化可能性
5. **組件復用**：避免重複代碼，提高維護性

這個專案將展現深度技術實力、創新設計思維和用戶體驗關注，是一個技術與藝術完美結合的作品集網站。