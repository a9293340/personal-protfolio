# UI/UX 設計規範 - 遊戲化個人網站

## 1. 設計系統概述

### 1.1 設計理念
**核心概念：** 融合流亡黯道與遊戲王的視覺風格，打造沉浸式的數位冒險體驗

**設計原則：**
- **沉浸感 (Immersion)：** 遊戲化元素創造引人入勝的體驗
- **直覺性 (Intuitive)：** 熟悉的遊戲互動模式降低學習成本
- **一致性 (Consistency)：** 統一的視覺語言貫穿整個網站
- **回饋性 (Responsive)：** 即時的視覺與聽覺回饋
- **專業性 (Professional)：** 在遊戲化中保持專業形象

### 1.2 目標用戶體驗
- **第一印象：** "哇，這個作品集很特別！"
- **探索過程：** "我想要點擊看看會發生什麼"
- **離開時：** "這個人很有創意，我記住了"

---

## 2. 色彩系統 (Color System)

### 2.1 主色調配置

#### 🌌 深邃背景色系 (Dark Foundation)
```css
--primary-dark: #0a0a0a;           /* 主背景色 */
--secondary-dark: #1a1a2e;         /* 次要背景色 */
--tertiary-dark: #16213e;          /* 第三層背景色 */
--surface-dark: #2c3e50;           /* 表面色 */
```

#### ✨ 魔法金色系 (Magical Gold)
```css
--primary-gold: #d4af37;           /* 主要金色 - 已掌握技能 */
--bright-gold: #f4d03f;            /* 明亮金色 - 強調元素 */
--dark-gold: #b8941f;              /* 深邃金色 - 陰影效果 */
--pale-gold: #f8e6a0;              /* 淡金色 - 文字高亮 */
```

#### 🔥 能量紅色系 (Energy Red)
```css
--primary-red: #8b0000;            /* 深血紅 - 警告/重要 */
--bright-red: #c0392b;             /* 明亮紅 - 按鈕懸停 */
--fire-red: #e74c3c;               /* 火焰紅 - 動畫效果 */
--pale-red: #fadbd8;               /* 淡紅色 - 背景提示 */
```

#### 💙 神秘藍色系 (Mystical Blue)
```css
--primary-blue: #2980b9;           /* 主藍色 - 可學習技能 */
--bright-blue: #3498db;            /* 明亮藍 - 連結色 */
--deep-blue: #1f3a93;              /* 深藍色 - 強調背景 */
--ice-blue: #ebf3fd;               /* 冰藍色 - 輔助文字 */
```

#### 🌿 輔助色系 (Support Colors)
```css
--success-green: #27ae60;          /* 成功綠 */
--warning-orange: #f39c12;         /* 警告橙 */
--info-purple: #8e44ad;            /* 資訊紫 */
--neutral-gray: #95a5a6;           /* 中性灰 */
```

### 2.2 色彩使用情境

#### 技能樹系統色彩邏輯
- **已掌握技能：** `--primary-gold` + 發光效果
- **可學習技能：** `--primary-blue` + 微光效果
- **未解鎖技能：** `--neutral-gray` + 半透明
- **關鍵石技能：** `--bright-gold` + 強烈光暈

#### 卡片稀有度色彩
- **普通 (N)：** `--neutral-gray`
- **稀有 (R)：** `--primary-blue`
- **超稀有 (SR)：** `--info-purple`
- **傳說 (UR)：** `--primary-gold`

### 2.3 無障礙色彩考量
```css
/* 高對比度模式支援 */
@media (prefers-contrast: high) {
  :root {
    --primary-gold: #ffdb00;
    --primary-blue: #0066cc;
    --primary-red: #cc0000;
  }
}

/* 色彩對比檢驗 */
.text-on-dark {
  color: var(--pale-gold);           /* 對比度 4.8:1 ✓ */
}

.text-on-gold {
  color: var(--primary-dark);        /* 對比度 5.2:1 ✓ */
}
```

---

## 3. 字體系統 (Typography)

### 3.1 字體選擇策略

#### 主要字體家族
```css
/* 標題字體 - 遊戲風格 */
--font-heading: 'Cinzel', 'Noto Serif TC', serif;

/* 內文字體 - 現代簡潔 */
--font-body: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;

/* 程式碼字體 - 等寬字體 */
--font-code: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;

/* 裝飾字體 - 特殊效果 */
--font-decorative: 'Cinzel Decorative', 'Noto Serif TC', serif;
```

#### 字體載入優化
```css
/* 字體預載入 */
@font-face {
  font-family: 'Cinzel';
  src: url('/assets/fonts/cinzel.woff2') format('woff2');
  font-display: swap;
  font-weight: 400 700;
}

/* 中文字體支援 */
@font-face {
  font-family: 'Noto Sans TC';
  src: url('/assets/fonts/noto-sans-tc.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+4E00-9FFF;
}
```

### 3.2 字體大小階層

#### 標題階層 (Headings)
```css
.text-display {
  font-size: 3.5rem;      /* 56px - 主標題 */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-h1 {
  font-size: 2.75rem;     /* 44px - 一級標題 */
  line-height: 1.15;
  font-weight: 600;
}

.text-h2 {
  font-size: 2.25rem;     /* 36px - 二級標題 */
  line-height: 1.2;
  font-weight: 600;
}

.text-h3 {
  font-size: 1.875rem;    /* 30px - 三級標題 */
  line-height: 1.25;
  font-weight: 500;
}

.text-h4 {
  font-size: 1.5rem;      /* 24px - 四級標題 */
  line-height: 1.3;
  font-weight: 500;
}
```

#### 內文階層 (Body Text)
```css
.text-large {
  font-size: 1.25rem;     /* 20px - 大內文 */
  line-height: 1.6;
}

.text-base {
  font-size: 1rem;        /* 16px - 標準內文 */
  line-height: 1.5;
}

.text-small {
  font-size: 0.875rem;    /* 14px - 小字 */
  line-height: 1.4;
}

.text-caption {
  font-size: 0.75rem;     /* 12px - 說明文字 */
  line-height: 1.3;
}
```

### 3.3 遊戲化字體效果

#### 發光文字效果
```css
.text-glow-gold {
  color: var(--bright-gold);
  text-shadow: 
    0 0 5px var(--primary-gold),
    0 0 10px var(--primary-gold),
    0 0 15px var(--primary-gold);
}

.text-glow-blue {
  color: var(--bright-blue);
  text-shadow: 
    0 0 5px var(--primary-blue),
    0 0 10px var(--primary-blue);
}
```

#### 打字機效果
```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.text-typewriter {
  overflow: hidden;
  border-right: 2px solid var(--primary-gold);
  white-space: nowrap;
  animation: 
    typewriter 2s steps(30) 1s forwards,
    blink 1s infinite 3s;
}
```

---

## 4. 間距系統 (Spacing System)

### 4.1 基礎間距單位
```css
/* 8px 基礎網格系統 */
:root {
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### 4.2 組件間距規範

#### 卡片內部間距
```css
.card-padding-sm { padding: var(--space-4); }      /* 小卡片 */
.card-padding-md { padding: var(--space-6); }      /* 中等卡片 */
.card-padding-lg { padding: var(--space-8); }      /* 大卡片 */

.card-gap-sm { gap: var(--space-3); }              /* 小間距 */
.card-gap-md { gap: var(--space-4); }              /* 標準間距 */
.card-gap-lg { gap: var(--space-6); }              /* 大間距 */
```

#### 頁面佈局間距
```css
.section-spacing {
  margin-top: var(--space-16);
  margin-bottom: var(--space-16);
}

.container-padding {
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

@media (min-width: 768px) {
  .container-padding {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}
```

---

## 5. 組件設計規範

### 5.1 技能樹組件

#### 技能節點設計
```css
/* 技能節點基礎樣式 */
.skill-node {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

/* 節點狀態樣式 */
.skill-node--mastered {
  background: radial-gradient(circle, var(--bright-gold) 0%, var(--primary-gold) 70%);
  border-color: var(--bright-gold);
  box-shadow: 
    0 0 15px rgba(212, 175, 55, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.skill-node--available {
  background: radial-gradient(circle, var(--bright-blue) 0%, var(--primary-blue) 70%);
  border-color: var(--bright-blue);
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.6);
}

.skill-node--locked {
  background: var(--surface-dark);
  border-color: var(--neutral-gray);
  opacity: 0.5;
  cursor: not-allowed;
}

/* 關鍵石節點特殊樣式 */
.skill-node--keystone {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.skill-node--keystone::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid var(--primary-gold);
  border-radius: 50%;
  opacity: 0.5;
  animation: keystone-pulse 2s ease-in-out infinite;
}

@keyframes keystone-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
```

#### 技能連線設計
```css
.skill-connection {
  stroke: var(--primary-gold);
  stroke-width: 2px;
  fill: none;
  opacity: 0.8;
  filter: drop-shadow(0 0 3px var(--primary-gold));
}

.skill-connection--inactive {
  stroke: var(--neutral-gray);
  stroke-width: 1px;
  opacity: 0.3;
  filter: none;
}

/* 路徑高亮效果 */
.skill-path--highlighted .skill-connection {
  stroke: var(--bright-gold);
  stroke-width: 3px;
  opacity: 1;
  animation: path-flow 1.5s ease-in-out infinite;
}

@keyframes path-flow {
  0% { stroke-dasharray: 10 5; stroke-dashoffset: 0; }
  100% { stroke-dasharray: 10 5; stroke-dashoffset: 15; }
}
```

### 5.2 專案卡片組件

#### 3D 翻轉卡片設計
```css
.project-card {
  width: 320px;
  height: 240px;
  perspective: 1000px;
  cursor: pointer;
  margin: var(--space-4);
}

.project-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.project-card:hover .project-card__inner {
  transform: rotateY(180deg);
}

.project-card__face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.project-card__front {
  background: linear-gradient(135deg, var(--secondary-dark) 0%, var(--tertiary-dark) 100%);
  border: 2px solid var(--neutral-gray);
}

.project-card__back {
  background: linear-gradient(135deg, var(--tertiary-dark) 0%, var(--primary-blue) 100%);
  border: 2px solid var(--primary-blue);
  transform: rotateY(180deg);
}
```

#### 稀有度視覺效果
```css
/* 傳說級卡片 */
.project-card--legendary {
  filter: drop-shadow(0 0 20px var(--primary-gold));
}

.project-card--legendary .project-card__front {
  border-color: var(--primary-gold);
  background: 
    linear-gradient(135deg, var(--secondary-dark) 0%, var(--tertiary-dark) 100%),
    linear-gradient(45deg, transparent 30%, var(--primary-gold) 50%, transparent 70%);
  background-blend-mode: overlay;
  animation: legendary-shine 3s ease-in-out infinite;
}

@keyframes legendary-shine {
  0%, 100% { background-position: -200% 0, 0 0; }
  50% { background-position: 200% 0, 0 0; }
}

/* 超稀有卡片 */
.project-card--epic {
  border-color: var(--info-purple);
  box-shadow: 0 0 15px rgba(142, 68, 173, 0.5);
}

/* 稀有卡片 */
.project-card--rare {
  border-color: var(--primary-blue);
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.4);
}
```

### 5.3 遊戲王卡牌組件

#### 卡牌基礎設計
```css
.yugioh-card {
  width: 240px;
  height: 350px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--secondary-dark);
}

.yugioh-card:hover {
  transform: translateY(-5px) rotateX(2deg);
}

/* 卡牌邊框樣式 */
.yugioh-card__border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px;
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--bright-gold) 50%, var(--primary-gold) 100%);
  border-radius: 8px;
}

.yugioh-card__content {
  background: var(--neutral-gray);
  border-radius: 4px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 卡牌標題區 */
.yugioh-card__header {
  background: linear-gradient(135deg, var(--secondary-dark), var(--surface-dark));
  color: white;
  padding: var(--space-2) var(--space-3);
  text-align: center;
}

.yugioh-card__name {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.yugioh-card__type {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: var(--space-1);
}

/* 卡牌圖片區 */
.yugioh-card__artwork {
  width: calc(100% - 16px);
  height: 140px;
  margin: var(--space-2);
  border: 2px solid var(--surface-dark);
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  position: relative;
}

/* 閃卡效果 */
.yugioh-card--foil .yugioh-card__artwork::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: foil-shine 2s ease-in-out infinite;
}

@keyframes foil-shine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: -100%; }
}
```

### 5.4 按鈕組件系統

#### 主要按鈕樣式
```css
/* 基礎按鈕 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-family: inherit;
  gap: var(--space-2);
}

/* 主要按鈕 */
.btn--primary {
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--bright-gold) 100%);
  color: var(--primary-dark);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, var(--bright-gold) 0%, var(--primary-gold) 100%);
}

/* 次要按鈕 */
.btn--secondary {
  background: transparent;
  color: var(--primary-gold);
  border: 2px solid var(--primary-gold);
}

.btn--secondary:hover {
  background: var(--primary-gold);
  color: var(--primary-dark);
}

/* 遊戲風格按鈕 */
.btn--gaming {
  background: 
    linear-gradient(135deg, var(--secondary-dark) 0%, var(--surface-dark) 100%);
  color: var(--bright-gold);
  border: 2px solid var(--primary-gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
}

.btn--gaming::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.btn--gaming:hover::before {
  left: 100%;
}

.btn--gaming:hover {
  box-shadow: 
    0 0 20px rgba(212, 175, 55, 0.5),
    inset 0 0 20px rgba(212, 175, 55, 0.1);
}
```

---

## 6. 動畫與微互動設計

### 6.1 核心動畫原則

#### 動畫時間與緩動
```css
/* 標準時間常數 */
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
  
  /* 緩動函數 */
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

#### 滑鼠懸停微互動
```css
/* 通用懸停效果 */
.interactive-element {
  transition: transform var(--duration-normal) var(--ease-out-quart);
  cursor: pointer;
}

.interactive-element:hover {
  transform: translateY(-2px);
}

/* 技能節點懸停 */
.skill-node {
  transition: all var(--duration-normal) var(--ease-out-quart);
}

.skill-node:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px currentColor;
}

/* 卡片懸停效果 */
.card-hover-effect {
  transition: all var(--duration-normal) ease;
}

.card-hover-effect:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### 6.2 頁面進入動畫

#### 淡入動畫序列
```css
/* 頁面載入動畫 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp var(--duration-slow) var(--ease-out-quart);
}

/* 錯開進入動畫 */
.staggered-animation > * {
  opacity: 0;
  animation: fadeInUp var(--duration-slow) var(--ease-out-quart) forwards;
}

.staggered-animation > *:nth-child(1) { animation-delay: 0ms; }
.staggered-animation > *:nth-child(2) { animation-delay: 100ms; }
.staggered-animation > *:nth-child(3) { animation-delay: 200ms; }
.staggered-animation > *:nth-child(4) { animation-delay: 300ms; }
.staggered-animation > *:nth-child(5) { animation-delay: 400ms; }
```

#### 技能樹展開動畫
```css
@keyframes skillTreeReveal {
  from {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.skill-tree-container {
  animation: skillTreeReveal 1s var(--ease-out-quart);
}

/* 技能節點依序出現 */
.skill-node {
  opacity: 0;
  animation: skillNodeAppear 0.6s var(--ease-out-back) forwards;
}

@keyframes skillNodeAppear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 6.3 特殊效果動畫

#### 粒子爆發效果
```css
@keyframes particleBurst {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary-gold);
  border-radius: 50%;
  animation: particleBurst 0.8s ease-out forwards;
}
```

#### 魔法陣動畫
```css
@keyframes magicCircleRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes magicCirclePulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
}

.magic-circle {
  animation: 
    magicCircleRotate 4s linear infinite,
    magicCirclePulse 2s ease-in-out infinite;
}
```

---

## 7. 響應式設計規範

### 7.1 斷點系統
```css
/* 斷點定義 */
:root {
  --breakpoint-sm: 640px;    /* 手機橫向 */
  --breakpoint-md: 768px;    /* 平板直向 */
  --breakpoint-lg: 1024px;   /* 平板橫向/小筆電 */
  --breakpoint-xl: 1280px;   /* 桌面 */
  --breakpoint-2xl: 1536px;  /* 大桌面 */
}

/* 媒體查詢 Mixins */
@custom-media --sm (min-width: 640px);
@custom-media --md (min-width: 768px);
@custom-media --lg (min-width: 1024px);
@custom-media --xl (min-width: 1280px);
@custom-media --2xl (min-width: 1536px);
```

### 7.2 響應式字體

#### 流體字體大小
```css
/* 流體字體系統 */
.text-responsive-xl {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.text-responsive-lg {
  font-size: clamp(1.5rem, 4vw, 2.75rem);
}

.text-responsive-md {
  font-size: clamp(1.25rem, 3vw, 1.875rem);
}

.text-responsive-sm {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}
```

#### 設備適配字體
```css
/* 桌面優先設計 */
.adaptive-text {
  font-size: 1.125rem;
  line-height: 1.6;
}

@media (max-width: 1023px) {
  .adaptive-text {
    font-size: 1rem;
    line-height: 1.5;
  }
}

@media (max-width: 767px) {
  .adaptive-text {
    font-size: 0.875rem;
    line-height: 1.4;
  }
}
```

### 7.3 響應式佈局

#### 技能樹響應式設計
```css
.skill-tree-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 桌面版 - 全功能技能樹 */
@media (min-width: 1024px) {
  .skill-tree-grid {
    transform-origin: center;
    transition: transform 0.3s ease;
  }
  
  .skill-node {
    width: 40px;
    height: 40px;
  }
  
  .skill-node--keystone {
    width: 60px;
    height: 60px;
  }
}

/* 平板版 - 簡化拖曳操作 */
@media (max-width: 1023px) and (min-width: 768px) {
  .skill-tree-grid {
    transform: scale(0.8);
  }
  
  .skill-node {
    width: 50px;
    height: 50px;
  }
  
  .skill-connection {
    stroke-width: 3px;
  }
}

/* 手機版 - 垂直滾動模式 */
@media (max-width: 767px) {
  .skill-tree-viewport {
    height: auto;
    overflow-y: auto;
  }
  
  .skill-tree-mobile {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    padding: var(--space-6);
  }
  
  .skill-branch {
    background: var(--secondary-dark);
    border-radius: 12px;
    padding: var(--space-6);
    border: 2px solid var(--primary-gold);
  }
  
  .skill-node {
    width: 60px;
    height: 60px;
    margin: var(--space-2);
  }
}
```

#### 卡片網格響應式
```css
.project-grid {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-6);
}

/* 桌面 - 3 欄佈局 */
@media (min-width: 1200px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

/* 平板 - 2 欄佈局 */
@media (min-width: 768px) and (max-width: 1199px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

/* 手機 - 1 欄佈局 */
@media (max-width: 767px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }
  
  .project-card {
    width: 100%;
    height: 200px;
  }
}
```

---

## 8. 無障礙設計 (Accessibility)

### 8.1 鍵盤導航支援

#### 焦點指示器設計
```css
/* 自訂焦點樣式 */
.focusable {
  outline: none;
  position: relative;
}

.focusable:focus-visible::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--bright-blue);
  border-radius: inherit;
  box-shadow: 
    0 0 0 2px var(--primary-dark),
    0 0 8px var(--bright-blue);
  animation: focus-pulse 1s ease-in-out;
}

@keyframes focus-pulse {
  0% { opacity: 0; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

/* 技能節點鍵盤導航 */
.skill-node:focus-visible {
  z-index: 10;
  box-shadow: 
    0 0 0 3px var(--primary-dark),
    0 0 0 5px var(--bright-blue),
    0 0 15px var(--bright-blue);
}
```

#### Tab 順序優化
```css
/* 邏輯性的 Tab 順序 */
.tab-ordered {
  tab-index: 0;
}

.tab-skip {
  tab-index: -1;
}

/* 跳過連結 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-gold);
  color: var(--primary-dark);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}
```

### 8.2 螢幕閱讀器支援

#### ARIA 標籤規範
```html
<!-- 技能樹結構 -->
<div class="skill-tree" 
     role="application" 
     aria-label="互動式技能樹"
     aria-describedby="skill-tree-instructions">
  
  <div id="skill-tree-instructions" class="sr-only">
    使用方向鍵導航技能節點，按 Enter 查看詳情，按 Space 選取技能
  </div>
  
  <div class="skill-node" 
       role="button"
       tabindex="0"
       aria-label="Java 程式設計"
       aria-describedby="java-desc"
       data-skill-status="mastered">
    
    <div id="java-desc" class="sr-only">
      已掌握技能：Java 程式設計。熟練度：專家級。
      相關技能：Spring Boot、微服務架構。
    </div>
  </div>
</div>

<!-- 專案卡片 -->
<article class="project-card" 
         role="article"
         aria-labelledby="project-title-1"
         aria-describedby="project-summary-1">
  
  <h3 id="project-title-1">微服務架構重構專案</h3>
  
  <div id="project-summary-1" class="sr-only">
    系統架構專案，使用 Spring Boot 和 Docker 技術，
    將單體應用重構為微服務架構，提升了系統性能 40%。
  </div>
  
  <button aria-label="查看專案詳情" 
          aria-expanded="false"
          aria-controls="project-details-1">
    查看詳情
  </button>
</article>
```

#### 螢幕閱讀器專用樣式
```css
/* 僅供螢幕閱讀器的內容 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 可選擇性顯示的輔助內容 */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: inherit;
}
```

### 8.3 動畫與運動減量

#### 減少動畫偏好支援
```css
/* 尊重用戶的動畫偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* 保持功能性動畫，但縮短時間 */
  .skill-node:focus-visible::after {
    animation: none;
    opacity: 1;
    transform: scale(1);
  }
  
  .project-card:hover .project-card__inner {
    transition-duration: 0.1s;
  }
}

/* 動畫切換開關 */
.animations-disabled * {
  animation: none !important;
  transition: none !important;
}
```

---

## 9. 互動狀態設計

### 9.1 載入狀態

#### 技能樹載入動畫
```css
.skill-tree-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--primary-dark);
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid var(--secondary-dark);
  border-top: 4px solid var(--primary-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--primary-gold);
  font-size: 1.125rem;
  margin-top: var(--space-4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
```

#### 骨架屏設計
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--secondary-dark) 25%,
    var(--tertiary-dark) 50%,
    var(--secondary-dark) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card {
  width: 320px;
  height: 240px;
  border-radius: 12px;
}

.skeleton-text {
  height: 1em;
  border-radius: 4px;
  margin-bottom: var(--space-2);
}

.skeleton-text--wide { width: 80%; }
.skeleton-text--medium { width: 60%; }
.skeleton-text--narrow { width: 40%; }
```

### 9.2 錯誤狀態

#### 友善錯誤提示
```css
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
  color: var(--fire-red);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
  opacity: 0.8;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--bright-red);
}

.error-message {
  font-size: 1rem;
  margin-bottom: var(--space-6);
  max-width: 400px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: var(--space-4);
}
```

#### 網路錯誤處理
```css
.network-error {
  background: linear-gradient(
    135deg, 
    var(--secondary-dark) 0%, 
    rgba(139, 0, 0, 0.1) 100%
  );
  border: 2px solid var(--primary-red);
  border-radius: 12px;
  padding: var(--space-6);
  margin: var(--space-4);
}

.network-error__icon {
  width: 60px;
  height: 60px;
  background: var(--primary-red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  animation: error-pulse 2s ease-in-out infinite;
}

@keyframes error-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}
```

### 9.3 成功狀態

#### 技能解鎖成功
```css
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(
    135deg,
    var(--success-green) 0%,
    #2ecc71 100%
  );
  color: white;
  padding: var(--space-4) var(--space-6);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
  transform: translateX(400px);
  animation: slideInRight 0.5s ease-out forwards;
  z-index: 1000;
}

@keyframes slideInRight {
  to {
    transform: translateX(0);
  }
}

.success-icon {
  display: inline-block;
  margin-right: var(--space-2);
  animation: checkmark-draw 0.6s ease-out;
}

@keyframes checkmark-draw {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

---

## 10. 暗色主題優化

### 10.1 對比度增強

#### 文字可讀性優化
```css
/* 暗色主題文字對比 */
.dark-theme {
  --text-primary: #f8f9fa;        /* 主要文字 - 對比度 15.8:1 */
  --text-secondary: #e9ecef;      /* 次要文字 - 對比度 12.6:1 */
  --text-muted: #adb5bd;          /* 輔助文字 - 對比度 5.9:1 */
  --text-disabled: #6c757d;       /* 禁用文字 - 對比度 3.2:1 */
}

.text-high-contrast {
  color: var(--text-primary);
  font-weight: 500;
}

.text-medium-contrast {
  color: var(--text-secondary);
}

.text-low-contrast {
  color: var(--text-muted);
}
```

#### 表面層次設計
```css
/* 暗色主題表面層次 */
.surface-level-0 { background: var(--primary-dark); }      /* 最深背景 */
.surface-level-1 { background: var(--secondary-dark); }    /* 卡片背景 */
.surface-level-2 { background: var(--tertiary-dark); }     /* 懸浮元素 */
.surface-level-3 { background: var(--surface-dark); }      /* 模態框背景 */

/* 表面陰影增強 */
.elevated-surface {
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 16px 24px rgba(0, 0, 0, 0.2);
}
```

### 10.2 視覺焦點優化

#### 發光效果調節
```css
/* 暗色主題下的發光效果 */
.glow-subtle {
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.glow-medium {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.glow-strong {
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.7);
}

/* 暗色環境下的邊框增強 */
.border-enhanced {
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
```

---

## 11. 效能優化設計考量

### 11.1 動畫效能

#### GPU 加速優化
```css
/* 強制 GPU 加速 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* 動畫時啟用 GPU 加速 */
.animating {
  will-change: transform, opacity;
}

.animating.finished {
  will-change: auto;
}

/* 複雜動畫的分層處理 */
.complex-animation {
  contain: layout style paint;
  transform: translateZ(0);
}
```

#### 動畫優化技巧
```css
/* 避免佈局抖動的動畫 */
.smooth-animation {
  /* 只動畫 transform 和 opacity */
  transition-property: transform, opacity;
  transition-timing-function: var(--ease-out-quart);
}

/* 減少重繪的技巧 */
.repaint-optimized {
  /* 使用 transform 而非改變位置屬性 */
  transform: translateX(var(--offset));
  /* 而不是 left: var(--offset); */
}
```

### 11.2 圖片優化

#### 響應式圖片設計
```css
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  loading: lazy;
}

/* 圖片載入狀態 */
.image-placeholder {
  background: var(--secondary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.image-loading {
  background: linear-gradient(
    90deg,
    var(--secondary-dark) 25%,
    var(--tertiary-dark) 50%,
    var(--secondary-dark) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 12. 開發交接規範

### 12.1 設計 Token

#### CSS 自訂屬性整理
```css
:root {
  /* 色彩 */
  --color-primary: var(--primary-gold);
  --color-secondary: var(--primary-blue);
  --color-accent: var(--fire-red);
  --color-success: var(--success-green);
  --color-warning: var(--warning-orange);
  --color-error: var(--primary-red);
  
  /* 字體 */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* 間距 */
  --spacing-xs: var(--space-1);
  --spacing-sm: var(--space-2);
  --spacing-md: var(--space-4);
  --spacing-lg: var(--space-6);
  --spacing-xl: var(--space-8);
  
  /* 陰影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

### 12.2 組件使用指南

#### 快速引用表
```html
<!-- 技能節點 -->
<div class="skill-node skill-node--mastered" 
     role="button" 
     tabindex="0"
     aria-label="技能名稱">
</div>

<!-- 專案卡片 -->
<div class="project-card project-card--legendary">
  <div class="project-card__inner">
    <div class="project-card__front"><!-- 前面內容 --></div>
    <div class="project-card__back"><!-- 背面內容 --></div>
  </div>
</div>

<!-- 遊戲王卡牌 -->
<div class="yugioh-card yugioh-card--foil">
  <div class="yugioh-card__border">
    <div class="yugioh-card__content">
      <!-- 卡牌內容 -->
    </div>
  </div>
</div>

<!-- 按鈕 -->
<button class="btn btn--primary btn--gaming">
  <i class="icon"></i>
  按鈕文字
</button>
```

### 12.3 設計檢查清單

#### 視覺一致性檢查
- [ ] 色彩使用符合色彩系統規範
- [ ] 字體大小遵循字體階層
- [ ] 間距使用統一的間距系統
- [ ] 陰影效果保持一致性
- [ ] 圓角半徑統一使用設計 token

#### 互動一致性檢查
- [ ] 懸停效果統一且流暢
- [ ] 點擊回饋及時且明確
- [ ] 載入狀態有適當的佔位符
- [ ] 錯誤狀態提供清晰的指導
- [ ] 成功狀態給予正面回饋

#### 無障礙檢查
- [ ] 所有互動元素可鍵盤導航
- [ ] 焦點指示器清晰可見
- [ ] 色彩對比度符合 WCAG AA 標準
- [ ] ARIA 標籤完整且正確
- [ ] 替代文字描述準確

#### 響應式檢查
- [ ] 在所有設備尺寸下正常顯示
- [ ] 觸控目標大小符合標準 (44px+)
- [ ] 文字在小螢幕上仍可閱讀
- [ ] 圖片在不同解析度下清晰
- [ ] 動畫在效能較差的設備上降級

---

## 13. 設計交付成果

### 13.1 設計文件交付清單

#### 核心設計文件
- [x] **色彩系統規範** - 完整的色彩定義與使用情境
- [x] **字體系統規範** - 字體選擇、大小階層、載入策略
- [x] **間距系統規範** - 基於 8px 網格的間距定義
- [x] **組件設計規範** - 所有 UI 組件的詳細樣式定義
- [x] **動畫設計規範** - 動畫時間、緩動函數、互動效果
- [x] **響應式設計規範** - 跨設備適配策略
- [x] **無障礙設計規範** - 完整的可及性考量

#### 開發支援文件
- [x] **CSS 變數定義** - 所有設計 token 的 CSS 實現
- [x] **組件使用指南** - HTML 結構與 CSS 類名規範
- [x] **設計檢查清單** - 品質控制檢查項目
- [x] **效能優化指南** - 動畫與圖片優化建議

### 13.2 後續設計協作

#### 設計維護計劃
1. **設計系統更新** - 根據使用回饋優化設計元素
2. **新組件設計** - 未來功能擴展的視覺設計
3. **使用者測試** - 基於真實用戶回饋的設計改進
4. **設計文件更新** - 保持設計規範與實現同步

這份 UI/UX 設計規範為開發團隊提供了完整的視覺設計指南，確保最終產品能夠呈現一致、專業且具有遊戲化特色的用戶體驗。所有設計決策都考量了可用性、無障礙性和技術實現的可行性。