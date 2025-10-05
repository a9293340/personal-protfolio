# 🚀 部署指南 - GitHub Pages 自動化部署

## 📋 部署配置說明

本專案使用 GitHub Actions 自動化部署到 GitHub Pages。

### 🌐 部署 URL
```
https://a9293340.github.io/personal-protfolio/
```

---

## ⚙️ 配置文件說明

### 1. Vite 配置 (`vite.config.js`)
```javascript
base: process.env.NODE_ENV === 'production'
  ? '/personal-protfolio/'  // GitHub Pages 路徑
  : './',                    // 開發環境使用相對路徑
```

### 2. GitHub Actions 工作流 (`.github/workflows/deploy.yml`)
- **觸發條件**：push 到 main 分支時自動部署
- **品質檢查**：部署前執行 `type-check` 和 `lint`
- **建置流程**：自動執行 `npm run build`
- **部署目標**：GitHub Pages

---

## 🔧 首次設定步驟

### 1. 啟用 GitHub Pages
1. 前往 Repository Settings
2. 左側選單點擊 **Pages**
3. **Source** 選擇：`GitHub Actions`
4. 儲存設定

### 2. 推送代碼觸發部署
```bash
git add .
git commit -m "feat: 設定 GitHub Pages 自動化部署"
git push origin main
```

### 3. 查看部署狀態
1. 前往 Repository 的 **Actions** 頁籤
2. 查看 "Deploy to GitHub Pages" 工作流執行狀態
3. 等待部署完成（約 1-2 分鐘）

### 4. 訪問網站
部署成功後，訪問：
```
https://a9293340.github.io/personal-protfolio/
```

---

## 📦 本地建置測試

在推送前可以先本地測試建置結果：

```bash
# 建置專案
npm run build

# 預覽建置結果
npm run preview
```

預覽伺服器會在 `http://localhost:5173` 啟動。

---

## 🔍 部署檢查清單

部署前請確認：

- [ ] `npm run type-check` 無錯誤
- [ ] `npm run lint` 無錯誤（warnings 可接受）
- [ ] `npm run build` 成功建置
- [ ] 圖片路徑正確（使用 `/images/...` 絕對路徑）
- [ ] Hash Router 正常運作（使用 `#/` 路由）

---

## 🐛 常見問題

### Q1: 部署後頁面空白或 404？
**A:** 檢查：
1. `vite.config.js` 的 `base` 設定是否正確
2. GitHub Pages Settings 的 Source 是否設為 `GitHub Actions`
3. 查看 Actions 執行日誌是否有錯誤

### Q2: CSS/JS 載入失敗？
**A:** 確認：
1. Build 時 `NODE_ENV=production` 是否正確設置
2. 資源路徑是否包含正確的 base path

### Q3: 圖片無法顯示？
**A:** 檢查：
1. 圖片是否在 `public/images/` 目錄
2. 配置文件中使用絕對路徑 `/images/...`
3. Build 後 `dist/images/` 目錄是否存在

### Q4: 如何手動觸發部署？
**A:** 前往 Actions 頁籤：
1. 選擇 "Deploy to GitHub Pages" workflow
2. 點擊 "Run workflow"
3. 選擇 branch (main)
4. 點擊 "Run workflow" 按鈕

---

## 📝 更新部署流程

每次推送到 main 分支都會自動觸發部署：

```bash
# 1. 開發完成後
git add .
git commit -m "feat: 新功能描述"

# 2. 推送到 GitHub（自動觸發部署）
git push origin main

# 3. 查看部署狀態
# 前往 GitHub Actions 頁面查看進度
```

---

## 🎯 效能優化建議

### 圖片優化
- 壓縮圖片檔案大小
- 使用 WebP 格式（需調整配置）
- 實作 lazy loading

### 代碼分割
- 已配置 vendor chunk 分離
- 可進一步分割大型組件

### 快取策略
- GitHub Pages 自動啟用瀏覽器快取
- 檔案名稱包含 hash，支援長期快取

---

## 📊 監控與分析

### 查看部署歷史
- 前往 Actions 頁籤查看所有部署記錄
- 每次部署都有完整日誌

### 效能監控建議
- 使用 Lighthouse 測試效能
- 檢查 Core Web Vitals
- 監控頁面載入時間

---

## 🔐 安全性

### GitHub Token
- Workflow 使用內建的 `GITHUB_TOKEN`
- 自動管理，無需手動配置
- 權限範圍僅限於當前 Repository

### 環境變數
目前未使用敏感環境變數。如需添加：
1. Repository Settings → Secrets and variables → Actions
2. 新增 Secret
3. 在 workflow 中引用 `${{ secrets.SECRET_NAME }}`

---

## 📚 相關資源

- [GitHub Pages 文檔](https://docs.github.com/pages)
- [GitHub Actions 文檔](https://docs.github.com/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ 驗證部署成功

部署成功後，確認以下功能：

- [ ] 首頁正常顯示
- [ ] 所有頁面路由正常（技能樹、關於我、專案等）
- [ ] CV 頁面正常（Resume）
- [ ] 所有圖片正確載入
- [ ] ProjectModal 彈窗正常運作
- [ ] 深色模式切換正常
- [ ] 響應式設計在手機上正常顯示

---

**🎉 部署配置完成！每次推送 main 分支都會自動更新網站。**
