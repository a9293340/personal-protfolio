# 開發品質檢查流程

## 📋 每個開發階段完成後必須執行的檢查

### 🚨 強制通過的檢查項目

#### 1. ESLint 代碼品質檢查
```bash
npm run lint
```
**通過標準**: 0 errors (warnings 可接受)
- ❌ 有 errors 必須修復，不可繞過
- ✅ 只有 warnings 可以接受

#### 2. TypeScript 類型檢查  
```bash
npm run type-check
```
**通過標準**: 無類型錯誤
- ✅ 應該無任何輸出（表示通過）
- ❌ 有錯誤輸出需要修復

#### 3. 功能測試驗證
- ✅ 核心功能運作正常
- ✅ 移動端/桌面端兼容性確認
- ✅ 無 console 錯誤（warnings 可接受）

### 🔧 問題修復指南

#### ESLint 錯誤修復原則
1. **優先修復邏輯**：修復問題本身，不移除規則
2. **全局變量聲明**：使用 `/* global VariableName */` 
3. **case 聲明錯誤**：用大括號包圍 case 塊
4. **prototype 方法**：使用 `Object.prototype.hasOwnProperty.call()`

#### TypeScript 錯誤修復原則
1. **新文件**：使用嚴格類型檢查
2. **舊文件/POC移植**：可使用 `// @ts-nocheck`
3. **配置文件**：確保 `"checkJs": false` 避免檢查 JS 文件
4. **類型轉換**：使用 `as any as TargetType` 進行雙重斷言

### 🎯 實施標準

#### 開發流程
1. **功能開發** → 實現核心邏輯
2. **功能測試** → 驗證運作正常
3. **品質檢查** → 執行 lint 和 type-check
4. **問題修復** → 修復所有 errors
5. **版本控制** → 提交和推送

#### 不可妥協原則
- ❌ **絕不躲避問題**：不移除 ESLint 規則來避開錯誤
- ❌ **絕不降低標準**：不修改配置來忽略錯誤  
- ❌ **絕不跳過檢查**：每個階段都必須通過檢查
- ✅ **實用優先**：在不影響功能的前提下修復問題

### 📊 檢查指令快速參考

```bash
# 完整檢查流程
npm run lint && npm run type-check && echo "✅ 品質檢查通過"

# 自動修復可修復的 lint 問題
npm run lint:fix

# 檢查特定文件
npx eslint src/path/to/file.js
npx tsc --noEmit --checkJs src/path/to/file.js
```

### 🚦 CI/CD Pipeline 準備

目前的品質標準已為 Git Pipeline 做好準備：
- **ESLint**: 0 errors ✅
- **TypeScript**: 無類型錯誤 ✅  
- **功能完整性**: 通過手動測試 ✅

### 📝 問題記錄範本

當遇到檢查問題時，記錄格式：
```markdown
## 檢查問題記錄

**問題類型**: ESLint Error / TypeScript Error
**錯誤文件**: src/path/to/file.js
**錯誤信息**: [具體錯誤信息]
**修復方式**: [採用的修復方法]
**影響評估**: [是否影響邏輯/功能]
```

---

## 🎯 項目品質目標

- **零容忍 ESLint Errors**: 確保代碼品質
- **類型安全**: 新代碼使用 TypeScript
- **向後兼容**: 舊代碼漸進式改善
- **持續改善**: 每次開發提升整體品質

**最後更新**: 2025-09-06
**下次檢視**: 每個開發階段完成時