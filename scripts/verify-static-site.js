#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OFFICIAL_LOGO = '/fishfull.jpg';
const COPYRIGHT = 'Copyright © 2026Fishfull漁有料版權所有';
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '.vercel']);
const LEGACY_BRAND_CLASS = ['brand', 'logo', 'img'].join('-');

function normalizeRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function read(relativePath) {
  const target = path.join(ROOT, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function assertContains(relativePath, needle, reason) {
  if (!read(relativePath).includes(needle)) {
    throw new Error(`${relativePath}: missing ${reason}: ${needle}`);
  }
}

function walkTextFiles(dir = ROOT, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    const rel = normalizeRelative(target);
    const parts = rel.split('/');
    if (parts.some((part) => SKIP_DIRS.has(part))) continue;

    if (entry.isDirectory()) {
      walkTextFiles(target, results);
      continue;
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(target);
    }
  }
  return results;
}

function listHtmlFiles() {
  const files = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.join(ROOT, entry.name));
    }
  }

  const pagesDir = path.join(ROOT, 'pages');
  if (fs.existsSync(pagesDir)) {
    for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(pagesDir, entry.name));
      }
    }
  }
  return files.sort();
}

function assertNoStaticGeneratedLogoFragments() {
  const offenders = [];
  const generatedSvgPattern = new RegExp(`<svg\\b[^>]*class=["'][^"']*\\b${LEGACY_BRAND_CLASS}\\b[^"']*["'][^>]*>`, 'i');
  const legacyFooterPattern = /<footer\b[^>]*class=["'][^"']*\bfishfull-global-footer\b[^"']*["'][^>]*>/i;

  for (const filePath of listHtmlFiles()) {
    const rel = normalizeRelative(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    if (generatedSvgPattern.test(content)) offenders.push(`${rel}: contains generated brand logo SVG`);
    if (legacyFooterPattern.test(content)) offenders.push(`${rel}: contains footer.fishfull-global-footer`);
  }

  if (offenders.length) {
    throw new Error(`Generated logo/footer fragments must not be checked in:\n${offenders.join('\n')}`);
  }
}

function assertNoBannedLiteral() {
  const bannedLiteral = LEGACY_BRAND_CLASS;
  const offenders = [];
  for (const filePath of walkTextFiles()) {
    const rel = normalizeRelative(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    if (rel === 'scripts/verify-static-site.js') continue;
    if (content.includes(bannedLiteral)) offenders.push(rel);
  }
  if (offenders.length) {
    throw new Error(`Banned legacy brand class literal found in:\n${offenders.join('\n')}`);
  }
}

function assertOfficialLogoGuard() {
  const shell = read('fishfull-site-shell.js');
  const requiredTerms = [
    `var logoSrc = '${OFFICIAL_LOGO}'`,
    'legacyBrandClass',
    'generatedTrademarkSelector',
    'function removeGeneratedTrademarkVisuals',
    'function removeAlternateTrademarkVisuals',
    'function dedupeBrandLogos',
    'function removeDuplicateCopyrightText',
    'footer.site-footer.fishfull-global-footer::before',
    COPYRIGHT,
  ];

  for (const term of requiredTerms) {
    if (!shell.includes(term)) {
      throw new Error(`fishfull-site-shell.js missing official-logo guard term: ${term}`);
    }
  }

  for (const filePath of listHtmlFiles()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = normalizeRelative(filePath);
    const logoTags = content.match(/<img[^>]+(?:brand|logo|商標)[^>]*>/gi) || [];
    for (const tag of logoTags) {
      if (!tag.includes(OFFICIAL_LOGO)) {
        throw new Error(`${rel}: brand/logo image must use ${OFFICIAL_LOGO}: ${tag}`);
      }
    }
    const copyrightCount = content.split(COPYRIGHT).length - 1;
    if (copyrightCount > 1) {
      throw new Error(`${rel}: static copyright statement appears ${copyrightCount} times`);
    }
  }
}

function assertArEntryIsPrimary() {
  assertContains('ar.html', 'data-page="ar-game"', 'root-level AR game page marker');
  assertContains('ar.html', '/pages/ar-mobile-fish-fit.css', 'mobile AR full-fish fit guard');
  assertContains('ar.html', '/pages/ar-ultra-small-phone.css', 'ultra-small phone and landscape AR guard');
  assertContains('ar.html', '/pages/ar-safe-view.css', 'AR safe-view frame');
  assertContains('ar.html', '/pages/ar-stall-tap-safe.css', 'fish-stall tap-safe mobile controls');
  assertContains('ar.html', '/pages/ar-official-model-only.css', 'AR official 3D model only styles');
  assertContains('ar.html', '/pages/ar-official-model-only.js', 'AR official 3D model only behavior');
  assertContains('ar.html', '/pages/ar-no-generated-fish-visuals.css', 'AR generated fish visual guard');
  assertContains('ar.html', 'Back to the full 3D fish', 'English full-fish return action');

  if (!read('pages/ar-ultra-small-phone.css').includes('orientation: landscape')) {
    throw new Error('pages/ar-ultra-small-phone.css must protect mobile landscape AR view');
  }
  if (!read('pages/ar-stall-tap-safe.css').includes('touch-action: manipulation')) {
    throw new Error('pages/ar-stall-tap-safe.css must keep mobile controls tappable');
  }
  if (!read('pages/ar-official-model-only.js').includes('removeFallbackFish')) {
    throw new Error('pages/ar-official-model-only.js must remove substitute fish art');
  }
  if (!read('pages/ar-no-generated-fish-visuals.css').includes('.phone-fish')) {
    throw new Error('pages/ar-no-generated-fish-visuals.css must guard generated hero fish visuals');
  }
  if (!read('home.js').includes('ar.html')) {
    throw new Error('home.js must expose the root-level AR game entry');
  }
}

function assertRequiredFiles() {
  for (const requiredPath of [
    'index.html',
    'ar.html',
    'home.js',
    'fishfull.jpg',
    'fishfull-brand.css',
    'fishfull-site-shell.js',
    'pages/ar-mobile-fish-fit.css',
    'pages/ar-ultra-small-phone.css',
    'pages/ar-safe-view.css',
    'pages/ar-stall-tap-safe.css',
    'pages/ar-official-model-only.css',
    'pages/ar-official-model-only.js',
    'pages/ar-no-generated-fish-visuals.css',
  ]) {
    read(requiredPath);
  }
}

function main() {
  assertRequiredFiles();
  assertNoStaticGeneratedLogoFragments();
  assertNoBannedLiteral();
  assertOfficialLogoGuard();
  assertArEntryIsPrimary();

  for (const filePath of walkTextFiles()) {
    fs.readFileSync(filePath, 'utf8');
  }

  console.log('FishFull static check passed.');
}

try {
  main();
} catch (error) {
  console.error(`FishFull static check failed: ${error.message}`);
  process.exit(1);
}
