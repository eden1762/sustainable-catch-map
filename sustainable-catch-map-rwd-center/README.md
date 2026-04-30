# Sustainable Catch Map - Immersive Full Version

這份版本可直接覆蓋原本 GitHub repo 的前端，並保留 `api/webhook.js` 的 Vercel Serverless Function 架構。

## 已完成內容
- 沉浸式 3D 首頁 `/`
- 網站導覽 `/guide`
- 友善海鮮地圖 `/map`
- AR 與永續標籤 `/sustainability`
- 保留 LINE webhook `api/webhook.js`

## 安裝
```bash
npm install
npm run dev
```

## 部署到 Vercel
這份專案使用 Vite + React SPA 結構，已附 `vercel.json`，可支援 `/guide`、`/map`、`/sustainability` 這類前端路由。

## 建議下一步
1. 把 3D 幾何角色替換成真正 GLB 模型
2. 把 mapPoints.js 改成真實店家資料
3. 把 model-viewer 的魚模型改成自有資產
4. 若要保留 LIFF，可在 React 中額外補上 LIFF 初始化模組
