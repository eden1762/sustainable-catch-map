#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SKIP_DIRS = new Set(['.git', '.vercel', 'node_modules', 'public', 'scripts', 'api']);
const STATIC_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.webp',
  '.gif',
  '.ico',
  '.json',
  '.gltf',
  '.glb',
  '.bin',
  '.txt',
  '.xml',
  '.webmanifest'
]);

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function shouldCopyFile(filePath) {
  return STATIC_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function copyFile(source) {
  if (!shouldCopyFile(source)) return;
  const destination = path.join(PUBLIC_DIR, relative(source));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function copyTree(dir = ROOT) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const source = path.join(dir, entry.name);
    const parts = relative(source).split('/');
    if (parts.some((part) => SKIP_DIRS.has(part))) continue;

    if (entry.isDirectory()) {
      copyTree(source);
      continue;
    }

    if (entry.isFile()) copyFile(source);
  }
}

function main() {
  execFileSync(process.execPath, [path.join(__dirname, 'verify-static-site.js')], { stdio: 'inherit' });
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  copyTree();
  fs.writeFileSync(path.join(PUBLIC_DIR, '.vercel-output-ready'), 'FishFull static output generated.\n', 'utf8');
  console.log('FishFull public output generated.');
}

try {
  main();
} catch (error) {
  console.error(`FishFull static build failed: ${error.message}`);
  process.exit(1);
}
