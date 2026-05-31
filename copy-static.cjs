const fs = require("fs");
const path = require("path");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const root = __dirname;
const dist = path.join(root, "dist");

copyDir(path.join(root, "pages"), path.join(dist, "pages"));

copyFile(path.join(root, "home.js"), path.join(dist, "home.js"));
copyFile(path.join(root, "home.css"), path.join(dist, "home.css"));
copyFile(path.join(root, "site-i18n.js"), path.join(dist, "site-i18n.js"));

console.log("Static files copied to dist.");
