# Vercel 部署注意事項

本版改成「單一維護來源」：Repository 內只保留根目錄 HTML/CSS/JS 原始檔，不提交 `public/`。

部署流程如下：

1. 維護人員修改根目錄檔案：`index.html`、`home.css`、`home.js`、`site-i18n.js`、`pages/`。
2. Vercel 執行 `npm run build`。
3. `build-static.cjs` 自動產生 `public/`。
4. Vercel 以 `public/` 作為 Output Directory 部署。

## Vercel 正確設定

```text
Framework Preset: Other
Build Command: npm run build
Output Directory: public
Install Command: npm install --no-audit --no-fund
```

`vercel.json` 已設定：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public"
}
```

## 重要提醒

- 不要使用 `dist`。
- 不要提交 `public/`。
- 不要修改 `public/index.html`；它是 build 產物。
- 若 Vercel 最新 deployment 是 ERROR，production 會停在上一個成功部署，因此網站看起來會完全沒變。
