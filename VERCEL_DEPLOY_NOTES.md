# Vercel 部署說明

這一版保留原本 zip 中已打包完成的首頁、子頁、地圖、AR/永續標籤與 LINE webhook 回覆邏輯，並調整成比較穩定的 Vercel 靜態部署版本。

## 已修正重點

1. 移除原本會讓 Vercel 安裝大量 React / Three / Vite 依賴的部署路徑。
2. 固定 Node.js 為 22.x，避免 Node 24 / npm 安裝階段出現 `Exit handler never called!`。
3. `npm run build` 改成只複製目前可執行的靜態檔案到 `dist/`。
4. `vercel.json` 明確指定：
   - `installCommand`
   - `buildCommand`
   - `outputDirectory: dist`
   - `/about`、`/map`、`/sustainability` 路由 rewrite
5. LINE webhook 改成不依賴 `@line/bot-sdk`，改用 Node 22 內建 `fetch` 呼叫 LINE Reply API，因此 Vercel 不需要額外安裝套件。
6. 原本的 `src/` 與 `vite.config.js` 已移到 `source_reference_only/`，避免 Vercel 或維護者誤以為目前部署入口是 Vite/React 原始碼。這一版真正部署入口是根目錄 `index.html`、`home.js`、`home.css` 與 `pages/`。

## 建議部署方式

```bash
git add .
git commit -m "Fix Vercel static deployment"
git push origin main
```

到 Vercel 後建議執行：

```text
Redeploy → Clear Build Cache
```

## Vercel 環境變數

如果需要 LINE webhook 正常回覆，請在 Vercel Project Settings → Environment Variables 設定：

```text
LINE_CHANNEL_ACCESS_TOKEN
LINE_CHANNEL_SECRET
```

目前 webhook 回覆只需要 `LINE_CHANNEL_ACCESS_TOKEN`；`LINE_CHANNEL_SECRET` 保留給後續若要加簽章驗證使用。

## 本機測試

```bash
npm install
npm run build
npm run preview
```

開啟：

```text
http://localhost:4173
```
