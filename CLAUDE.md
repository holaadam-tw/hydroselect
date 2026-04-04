# HydroSelect - 液壓系統智能選型平台

## 專案概述
HydroSelect 是一個液壓系統智能選型計算器，幫助工程師根據需求參數（推力、壓力、速度、行程等）自動計算並推薦油壓缸、油壓泵、電機和閥件的規格與品牌。

## 技術棧
- **前端框架**: React 19.2 (Create React App 5.0)
- **語言**: JavaScript (JSX)
- **樣式**: CSS-in-JS (inline styles) + 少量 CSS 檔案
- **字型**: Noto Sans TC (Google Fonts CDN)
- **測試**: Jest + React Testing Library
- **建置工具**: react-scripts (Webpack)
- **套件管理**: npm

## 專案結構
```
src/
  App.js          # 主要應用元件（表單、計算引擎、結果顯示）
  App.css         # 預設 CRA 樣式（未使用）
  index.js        # React 進入點
  index.css       # 全域基礎樣式
  setupTests.js   # 測試設定
public/
  index.html      # HTML 模板
```

## 架構設計
- **單檔架構**: 所有邏輯集中在 `src/App.js`，包含常數定義、計算引擎、樣式物件和 UI 元件
- **計算引擎**: `calcSystem()` 函式根據輸入參數計算油壓缸、泵、電機和閥件的規格
- **品牌資料庫**: 內建台灣/日本/美國/中國品牌推薦（分預算型/標準型/旗艦型三個等級）
- **應用場景預設**: 吹瓶機、裁斷機、彎管機三種預設 + 自定義

## 開發指令
```bash
npm start       # 啟動開發伺服器 (localhost:3000)
npm run build   # 建置生產版本
npm test        # 執行測試
```

## 開發注意事項
- 所有 UI 文字使用繁體中文
- 暗色主題設計（背景 #080b0e）
- 支援異步電機和伺服電機兩種模式
- 標準規格自動向上取整（缸徑、排量、功率等）
