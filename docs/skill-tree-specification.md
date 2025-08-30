# 個人天賦技能樹 - 設計規範文檔

## 📋 概述

基於流亡黯道 (Path of Exile) 風格的個人技能樹系統，以六角形網格為基礎，展現後端工程師向系統架構師發展的技術軌跡。採用 Config-Driven 設計，支援動態內容更新。

**設計完成時間**: 2024年8月  
**POC 驗證**: ✅ 已完成  
**實作狀態**: 可直接進入 Vue + TailwindCSS 開發階段  

---

## 🎯 核心設計理念

### 視覺風格
- **遊戲風格**: 流亡黯道被動技能樹
- **色彩主題**: 深色背景 + 六色領域主題
- **佈局設計**: 六角形網格座標系統
- **動畫效果**: 發光、粒子、漸變動畫

### 功能理念
- **數據驅動**: 基於真實技能數據 (`我的天賦.md`)
- **互動體驗**: 拖曳、縮放、懸停、點擊
- **響應式設計**: 桌面和移動端完整支援
- **信息架構**: 六大技能領域 + 三級熟練度分類

---

## 🎨 視覺設計規範

### 色彩系統
```css
/* 主色調 */
--primary-dark: #0a0a0a;           /* 主背景 */
--secondary-dark: #1a1a2e;         /* 卡片/面板背景 */
--accent-gold: #d4af37;            /* 主要金色（中心點、邊框） */
--bright-gold: #f4d03f;            /* 強調金色（發光效果） */

/* 六大領域主題色 */
--frontend-color: #e74c3c;         /* 前端領域 - 紅色 */
--architecture-color: #1abc9c;     /* 架構規劃 - 青綠色 */
--ai-color: #f39c12;               /* AI 使用 - 橙色 */
--cloud-color: #9b59b6;            /* 雲端/DevOps - 紫色 */
--database-color: #2ecc71;         /* 資料庫 - 綠色 */
--backend-color: #3498db;          /* 後端領域 - 藍色 */

/* 熟練度指示色 */
--expert-color: #4caf50;           /* 熟練 (O) - 綠色 */
--intermediate-color: #ff9800;     /* 略懂 (*) - 橙色 */
--learning-color: #f44336;         /* 待學習 (X) - 紅色 */
```

### 字體系統
```css
--font-heading: 'Cinzel', 'Noto Serif TC', serif;        /* 標題字體 */
--font-body: 'Inter', 'Noto Sans TC', sans-serif;        /* 內文字體 */
--font-code: 'Fira Code', 'JetBrains Mono', monospace;   /* 程式碼字體 */
```

### 間距系統
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
```

---

## 🏗️ 技術架構設計

### 座標系統
```javascript
/**
 * 六角形座標系統 - 軸向座標 (Axial Coordinates)
 * q: 橫軸 (水平方向)
 * r: 縱軸 (垂直-60度方向)
 */
class HexCoordSystem {
  constructor(size = 30) {
    this.size = size;                    // 六角形半徑
    this.width = size * 2;               // 六角形寬度
    this.height = Math.sqrt(3) * size;   // 六角形高度
  }

  // 六角形座標 → 像素座標
  hexToPixel(hex) {
    const x = this.size * (3/2 * hex.q);
    const y = this.size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
  }

  // 計算六角形距離
  hexDistance(a, b) {
    return (Math.abs(a.q - b.q) + 
            Math.abs(a.q + a.r - b.q - b.r) + 
            Math.abs(a.r - b.r)) / 2;
  }
}
```

### 技能樹佈局策略
```
技能樹結構 (六芒星佈局):
                 AI領域 (120°)
                      ▲
                      │
架構規劃 (60°) ◄──── 中心點 ────► 前端領域 (0°)
                      │
                      ▼
    雲端/DevOps (180°) ──── 資料庫 (240°) ──── 後端領域 (300°)

每個方向的技能排列:
中心點 → 大技能1 (距離2) → 大技能2 (距離4) → 大技能3 (距離6)
         │              │              │
    ┌────┴──────┐  ┌────┴──────┐  ┌────┴──────┐
   小技能群1    小技能群2    小技能群3
```

---

## 📊 數據結構規範

### 技能配置結構
```javascript
const SKILL_TREE_CONFIG = {
  // 技能領域定義
  types: {
    'frontend': { 
      color: '#e74c3c', 
      direction: 0,     // 0度 - 右方
      name: '前端領域'
    }
    // ... 其他五個領域
  },

  // 熟練度等級定義
  proficiencyLevels: {
    'O': { level: 'expert', name: '熟練', opacity: 1.0 },
    '*': { level: 'intermediate', name: '略懂', opacity: 0.7 },
    'X': { level: 'learning', name: '待學習', opacity: 0.4 }
  },

  // 技能節點定義
  skills: [
    {
      id: 'html-css',              // 唯一識別
      name: 'HTML/CSS',            // 顯示名稱
      type: 'frontend',            // 所屬領域
      skillLevel: 'major',         // 大技能/小技能
      hexCoord: { q: 2, r: 0 },   // 六角座標
      difficulty: 1,               // 難度等級 (用於排序)
      proficiency: 'O',            // 熟練度 (O/*/X)
      description: '...',          // 技能描述
      relatedTo: ['other-skill']   // 關聯技能
    }
  ]
}
```

### 節點類型分類
```javascript
// 節點層級
const NODE_LEVELS = {
  center: 'center',       // 中心點 (金色，大小10px)
  major: 'major',         // 大技能 (領域色，大小7px)
  minor: 'minor'          // 小技能 (領域色，大小4px，依熟練度調整)
};

// 連接線類型
const CONNECTION_TYPES = {
  'center-to-major': {    // 中心→大技能
    strokeWidth: 3,
    opacity: 0.8
  },
  'major-to-major': {     // 大技能→大技能
    strokeWidth: 2,
    opacity: 0.7
  },
  'major-to-minor': {     // 大技能→小技能
    strokeWidth: 1.5,
    opacity: 0.6
  }
};
```

---

## 🎮 互動功能規範

### 基礎互動
1. **節點懸停** - 顯示技能詳情卡片 + 右上角領域名稱
2. **節點點擊** - 記錄點擊事件 (可擴展為技能詳情頁)
3. **背景點擊** - 隱藏所有懸停效果

### 拖曳功能
```javascript
// 拖曳模式狀態管理
const dragModes = {
  normal: 'normal',       // 正常模式 - 可懸停查看技能
  dragging: 'dragging'    // 拖曳模式 - 可平移視窗
};

// 拖曳控制
class DragController {
  toggleDragMode() {
    this.dragMode = !this.dragMode;
    this.updateCursor();
    this.updateButtonState();
  }
  
  updateViewBox() {
    const viewBoxX = -this.currentPan.x;
    const viewBoxY = -this.currentPan.y;
    this.svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} 1200 800`);
  }
}
```

### 技能總攬功能
```javascript
// 技能總攬結構
const skillOverview = {
  tabs: [                    // 六個領域頁籤
    'frontend', 'backend', 'database', 
    'cloud-devops', 'ai', 'architecture'
  ],
  
  proficiencySections: {     // 每個頁籤內的熟練度分段
    'O': [],                 // 熟練技能列表
    '*': [],                 // 略懂技能列表  
    'X': []                  // 待學習技能列表
  }
};
```

---

## 📱 響應式設計規範

### 斷點系統
```css
/* 手機直向 */
@media (max-width: 480px) {
  .function-btn { width: 40px; height: 40px; }
  .info-panel { max-width: 180px; }
}

/* 手機橫向 / 小平板 */
@media (max-width: 768px) {
  .function-btn { width: 45px; height: 45px; }
  .modal-content { width: 95%; }
}

/* 平板 */
@media (max-width: 1024px) {
  .function-btn { width: 50px; height: 50px; }
  .modal-content { width: 90%; }
}

/* 桌面 */
@media (min-width: 1025px) {
  .function-btn { width: 50px; height: 50px; }
  .modal-content { width: 90%; max-width: 800px; }
}
```

### 觸摸優化
- **觸摸目標**: 最小 44px × 44px (符合 WCAG 標準)
- **拖曳支援**: 同時支援滑鼠和觸摸事件
- **滑動慣性**: 添加滑動慣性效果 (可選)
- **縮放支援**: 雙指縮放 (未來功能)

---

## 🛠️ Vue + TailwindCSS 實作指南

### 組件架構
```vue
<!-- 主容器組件 -->
<SkillTreeContainer>
  <SkillTreeBackground />               <!-- 六角網格背景 -->
  <SkillTreeSVG>                       <!-- SVG 主畫布 -->
    <SkillTreeConnections />           <!-- 連接線群組 -->
    <SkillTreeNodes />                 <!-- 技能節點群組 -->
  </SkillTreeSVG>
  
  <!-- UI 控制層 -->
  <SkillTypeIndicator />               <!-- 右上角領域顯示 -->
  <SkillInfoPanel />                   <!-- 左上角資訊面板 -->
  <SkillFunctionPanel>                 <!-- 右下角功能按鈕 -->
    <DragToggleButton />
    <OverviewToggleButton />
  </SkillFunctionPanel>
  
  <!-- 彈窗層 -->
  <SkillDetailCard v-if="hoveredSkill" />
  <SkillOverviewModal v-if="showOverview" />
</SkillTreeContainer>
```

### 狀態管理
```javascript
// Pinia Store 結構建議
const useSkillTreeStore = defineStore('skillTree', {
  state: () => ({
    // 核心數據
    skillConfig: SKILL_TREE_CONFIG,
    processedNodes: [],
    processedConnections: [],
    
    // UI 狀態
    dragMode: false,
    currentPan: { x: 0, y: 0 },
    hoveredSkill: null,
    hoveredType: null,
    showOverview: false,
    
    // 系統狀態
    viewBox: { x: 0, y: 0, width: 1200, height: 800 }
  }),
  
  actions: {
    initializeSkillTree() { /* 初始化邏輯 */ },
    redistributeSkills() { /* 位置計算邏輯 */ },
    toggleDragMode() { /* 拖曳模式切換 */ },
    updateViewBox() { /* 視窗更新 */ }
  }
});
```

### TailwindCSS 配置
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'skill-tree': {
          'dark': '#0a0a0a',
          'secondary': '#1a1a2e',
          'gold': '#d4af37',
          'gold-bright': '#f4d03f'
        },
        'skill': {
          'frontend': '#e74c3c',
          'backend': '#3498db',
          'database': '#2ecc71',
          'cloud': '#9b59b6',
          'ai': '#f39c12',
          'architecture': '#1abc9c'
        },
        'proficiency': {
          'expert': '#4caf50',
          'intermediate': '#ff9800',
          'learning': '#f44336'
        }
      },
      fontFamily: {
        'heading': ['Cinzel', 'Noto Serif TC', 'serif'],
        'body': ['Inter', 'Noto Sans TC', 'sans-serif'],
        'code': ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      animation: {
        'skill-glow': 'skill-glow 2s ease-in-out infinite alternate',
        'connection-draw': 'connection-draw 0.5s ease-out'
      }
    }
  }
}
```

---

## 🎯 可直接移植的核心模組

### 1. HexCoordSystem.js (100% 可移植)
```javascript
// 完整的六角形座標系統
// 可直接用於 Vue 組件中
class HexCoordSystem {
  hexToPixel(hex) { /* 座標轉換邏輯 */ }
  pixelToHex(pixel) { /* 反向轉換邏輯 */ }
  hexDistance(a, b) { /* 距離計算邏輯 */ }
  getNeighbors(hex) { /* 鄰居查找邏輯 */ }
}
```

### 2. 技能分佈演算法 (需適配)
```javascript
// redistributeSkillsByDirection 核心邏輯
// 需要改寫為 Vue 響應式數據處理
const redistributeSkills = (skillConfig) => {
  // 1. 按類型分組技能
  // 2. 計算六角方向座標
  // 3. 智能防重疊分配
  // 4. 回傳處理後的節點和連接
};
```

### 3. 連接線生成邏輯 (需適配)
```javascript  
// generateConnections 核心邏輯
// 需要改寫為 Vue 組件渲染邏輯
const generateConnections = (nodes, config) => {
  // 1. 中心點到各領域主要技能
  // 2. 主要技能間按難度連接
  // 3. 主要技能延伸到相關小技能
  // 4. 回傳連接線數據
};
```

---

## 🎨 設計資產

### 圖標資源
- **拖曳按鈕**: ✋ (Unicode: U+270B)
- **統計按鈕**: 📊 (Unicode: U+1F4CA)  
- **關閉按鈕**: × (Times character)
- **熟練度符號**: ⭐ (Expert), ⚡ (Intermediate), ❓ (Learning)

### 動畫效果
```css
/* 技能節點發光效果 */
@keyframes skill-glow {
  from { 
    filter: drop-shadow(0 0 3px currentColor); 
  }
  to { 
    filter: drop-shadow(0 0 8px currentColor); 
  }
}

/* 連接線繪製效果 */
@keyframes connection-draw {
  from { 
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000; 
  }
  to { 
    stroke-dasharray: 1000;
    stroke-dashoffset: 0; 
  }
}

/* 節點懸停放大 */
.skill-node:hover {
  transform: scale(1.4);
  transition: transform 0.2s ease;
}
```

---

## 🚀 實作優先級

### Phase 1: 核心渲染 (1-2 天)
1. ✅ 六角形座標系統移植
2. ✅ 基礎 SVG 渲染
3. ✅ 技能節點和連接線顯示
4. ✅ Config-Driven 數據載入

### Phase 2: 互動功能 (2-3 天)  
1. ✅ 懸停效果和詳情卡片
2. ✅ 拖曳功能實作
3. ✅ 技能總攬彈窗
4. ✅ 響應式適配

### Phase 3: 優化增強 (1-2 天)
1. 🔄 動畫效果優化
2. 🔄 效能優化 (虛擬化渲染)
3. 🔄 無障礙功能支援
4. 🔄 快取和預載入機制

### Phase 4: 進階功能 (可選)
1. 📋 縮放功能 (滾輪/雙指)
2. 📋 技能路徑高亮
3. 📋 搜尋和篩選功能
4. 📋 分享和匯出功能

---

## 📝 注意事項

### 效能考量
- **節點數量**: 當前140+節點，未來可能增加至200+
- **渲染優化**: 考慮視窗外節點的延遲渲染
- **記憶體管理**: 避免事件監聽器洩漏
- **動畫效能**: 使用 `transform` 和 `opacity` 最佳化

### 維護性
- **配置驅動**: 技能數據完全由配置文件控制
- **組件模組化**: 每個功能區塊獨立組件
- **樣式一致性**: 統一的設計系統和變數管理
- **類型安全**: TypeScript 類型定義 (建議)

### 擴展性
- **多語言支援**: i18n 國際化準備
- **主題切換**: 支援不同視覺主題
- **數據同步**: 可與後端 API 同步技能數據
- **外掛機制**: 支援自訂技能類型和效果

---

**文檔版本**: 1.0  
**最後更新**: 2024年8月29日  
**POC 驗證**: ✅ 完成  
**可實作性**: 🟢 高 - 可直接進入正式開發階段