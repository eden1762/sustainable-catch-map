const fs = require('fs');
const path = require('path');

const root = __dirname;
const publicDir = path.join(root, 'public');
const entriesToCopy = [
  'index.html',
  'home.css',
  'home.js',
  'site-i18n.js',
  'pages',
];

function rmrf(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

rmrf(publicDir);
ensureDir(publicDir);

for (const entry of entriesToCopy) {
  const src = path.join(root, entry);
  if (fs.existsSync(src)) copyRecursive(src, path.join(publicDir, entry));
}

console.log('Static site copied to public/ for Vercel outputDirectory.');
