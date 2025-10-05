# Resume 頁面配置文件使用說明

## 📋 Resume 頁面區塊與配置文件對應

Resume 頁面分為 5 個主要區塊，每個區塊使用不同的配置文件：

---

## 1️⃣ **About 區塊** (關於我)

### 使用的配置文件：
- `src/config/data/about/about.data.js`
  - `aboutHeaderConfig` - 頁面標題和描述
  - `careerGoalConfig` - 職涯目標（3個核心優勢）

- `src/config/data/about/character.data.js`
  - `characterConfig` - 角色基本資訊（職業、等級）
  - `attributesConfig` - 六大技能領域數據（繪製雷達圖）

- `src/config/data/about/timeline.data.js`
  - `timelineData` - 工作經歷時間軸數據

- `src/config/data/personal.config.js`
  - `personalConfig.name` - 姓名
  - `personalConfig.title` - 職稱
  - `personalConfig.bio` - 個人簡介

### Resume 中的展示位置：
- **Header 區域**: 個人照片 + 姓名 + 職稱 + 簡介
- **Summary 區域**: 核心優勢 + 技能雷達圖

---

## 2️⃣ **Skills 區塊** (技術技能)

### 使用的配置文件：
- `src/config/data/skills.data.js`
  - `skillsData` - 完整的技能樹數據
  - 技能分類、熟練度、學習狀態等

- `src/config/data/about/character.data.js`
  - `skillsTagsConfig` - 技能標籤和熟練度
  - `attributesConfig` - 六大技能領域評分

### Resume 中的展示位置：
- **Technical Skills 區域**: 按分類展示技能，帶熟練度進度條

---

## 3️⃣ **Work Projects 區塊** (工作專案)

### 使用的配置文件：
- `src/config/data/work-projects/projects.data.js`
  - `workProjectsData` - 工作專案完整數據
  - 專案名稱、描述、技術棧、時間、成果等

### Resume 中的展示位置：
- **Work Experience 區域**: 職涯時間軸 + 工作專案卡片
- **Key Projects 區域**: 精選工作專案 (Top 3-5)

---

## 4️⃣ **Personal Projects 區塊** (個人專案)

### 使用的配置文件：
- `src/config/data/personal-projects/projects.data.js`
  - `personalProjectsData` - 個人專案完整數據
  - 專案名稱、描述、技術棧、稀有度、連結等

### Resume 中的展示位置：
- **Key Projects 區域**: 精選個人專案 (legendary 和 superRare)

---

## 5️⃣ **Social/Contact 區塊** (聯絡方式)

### 使用的配置文件：
- `src/config/data/social.data.js`
  - `socialLinksData` - 社交連結數據
  - GitHub, LinkedIn, Email 等

- `src/config/data/contact/contact.config.js`
  - `contactConfig.email` - Email 聯絡方式
  - `contactConfig.phone` - 電話（可選）

### Resume 中的展示位置：
- **Header 區域**: Email, GitHub, LinkedIn 快速連結圖標
- **Footer 區域**: 完整聯絡資訊（可選）

---

## 🎯 數據流向圖

```
Resume Page
├── Header
│   ├── personal.config.js (name, title)
│   ├── social.data.js (聯絡圖標)
│   └── /images/resume/profile-photo.jpg (照片)
│
├── Summary
│   ├── about/about.data.js (careerGoalConfig)
│   └── about/character.data.js (attributesConfig - 雷達圖)
│
├── Work Experience
│   ├── about/timeline.data.js (timelineData)
│   └── work-projects/projects.data.js (專案詳情)
│
├── Key Projects
│   ├── work-projects/projects.data.js (工作專案)
│   └── personal-projects/projects.data.js (個人專案)
│
└── Technical Skills
    ├── skills.data.js (技能樹數據)
    └── about/character.data.js (skillsTagsConfig)
```

---

## ✅ 設計優勢

1. **完全 Config-Driven** - 所有數據來自現有配置文件
2. **數據統一** - 動態版和靜態版共用相同數據源
3. **易於維護** - 修改配置文件即可同步更新兩個版本
4. **資訊一致性** - 確保不會出現資訊不同步的問題

---

## 📝 備註

- Resume 頁面不需要額外的配置文件
- 所有數據都從現有的 5 個配置區塊讀取
- 只需要提供個人照片圖片即可開始建立頁面

---

**確認無誤後，請放入圖片並通知我開始建立 Resume 頁面！** 🚀
