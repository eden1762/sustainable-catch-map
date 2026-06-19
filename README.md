# Sustainable Catch Map - Clean Static HTML/CSS/JS Version

這份版本整理成「單一維護來源」的靜態網站架構：

- 維護人員只需要修改根目錄的 `index.html`、`home.css`、`home.js`、`site-i18n.js` 與 `pages/`。
- Repository 不提交 `public/`、`dist/`、`src/`。
- Vercel 部署時會執行 `npm run build`，由 `build-static.cjs` 自動產生 `public/` 作為部署輸出。
- `public/` 是部署暫存輸出，不是維護來源；若本機產生 `public/`，不要手動修改，也不要 commit。

## 本次完成內容

- 首頁 `/` 改成純 `index.html` + `home.css` + `home.js`。
- 首頁移除 model-viewer、Three.js、WebGL、720 度可旋轉背景與原本 3D 模組首頁設計。
- 三個首頁入口改為純 `input[type=button]`，保留原本三組文案與連結功能：
  - 我們的理念 / 看見永續初衷 / 3D眼睛導覽
  - 附近的友善海鮮地圖 / 找附近友善餐廳 / 3D友善小魚
  - AR互動與永續標籤 / 理解永續標籤 / 3D牛頓擺球組
- 首頁保留電腦版與手機版響應式設計。
- 保留 Instagram 與中英文切換功能。
- 保留 `api/webhook.js` Vercel Serverless Function。
- 不使用 JSX、Vite、React build、`dist/`。

## 檔案結構

```text
index.html              ← 首頁維護來源
home.css                ← 首頁樣式維護來源
home.js                 ← 首頁互動維護來源
site-i18n.js            ← 全站語系切換
pages/                  ← 子頁維護來源
api/                    ← Vercel Serverless Function
build-static.cjs        ← 部署時產生 public/
package.json
vercel.json
.gitignore              ← 忽略 public/，避免重複維護
```

## 本機預覽

直接預覽原始靜態檔：

```bash
python3 -m http.server 4173
```

然後開啟：

```text
http://localhost:4173/
```

## Vercel 部署

建議 Vercel 設定：

```text
Framework Preset: Other
Build Command: npm run build
Output Directory: public
Install Command: npm install --no-audit --no-fund
```

請不要設定 Output Directory 為 `dist`。
