# Vercel 部署注意事項

這一版不是只改 `dist/`。

真正有改、且應該提交到 GitHub 的首頁檔案是：

- `index.html`
- `home.css`
- `home.js`
- `src/pages/HomePage.jsx`（備用：如果之後改回 React/Vite 路由入口，畫面也一致）
- `HOME_REDESIGN_NOTES.md`
- `VERCEL_DEPLOY_NOTES.md`

## 為什麼不要只看 dist？

Vercel 如果使用 Vite build，會在部署時重新執行：

```bash
npm run build
```

所以 `dist/` 會被重新產生。這包 zip 刻意不放 `dist/`，避免誤會成「只改 build 產物」。

## 如何確認部署到的是新版？

打開首頁原始碼，應該可以看到：

```html
<meta name="scm-redesign-version" content="ocean-lite-source-safe-v2" />
```

若看不到這行，代表 GitHub/Vercel 部署到的不是這一版原始碼，或瀏覽器/Vercel 快取還沒更新。

## 正確更新方式

1. 解壓縮後，把 `sustainable-catch-map-main` 裡面的檔案覆蓋到 GitHub repo 根目錄。
2. 不要只把整個資料夾丟進 repo 形成 `repo/sustainable-catch-map-main/index.html` 這種巢狀目錄。
3. commit 並 push。
4. 等 Vercel 重新部署。
5. 到首頁檢查原始碼是否有 `ocean-lite-source-safe-v2`。
