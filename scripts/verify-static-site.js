#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const OFFICIAL_LOGO = '/fishfull.jpg';
const COPYRIGHT = 'Copyright © 2026Fishfull漁有料版權所有';
const LEGACY_BRAND_CLASS = ['brand', 'logo', 'img'].join('-');
const GLOBAL_FOOTER_CLASS = 'fishfull-global-footer';
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.json']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '.vercel', 'public']);

function normalizeRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function fullPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function assertExists(relativePath) {
  if (!fs.existsSync(fullPath(relativePath))) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
}

function readText(relativePath) {
  assertExists(relativePath);
  return fs.readFileSync(fullPath(relativePath), 'utf8');
}

function assertContains(relativePath, needle, reason) {
  if (!readText(relativePath).includes(needle)) {
    throw new Error(`${relativePath}: missing ${reason}: ${needle}`);
  }
}

function walkFiles(dir = ROOT, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    const parts = normalizeRelative(target).split('/');
    if (parts.some((part) => SKIP_DIRS.has(part))) continue;

    if (entry.isDirectory()) {
      walkFiles(target, results);
      continue;
    }

    if (entry.isFile()) results.push(target);
  }
  return results;
}

function textFiles() {
  return walkFiles().filter((filePath) => TEXT_EXTENSIONS.has(path.extname(filePath))).sort();
}

function htmlFiles() {
  return textFiles().filter((filePath) => filePath.endsWith('.html'));
}

function assertRequiredFiles() {
  for (const requiredPath of [
    'index.html',
    'ar.html',
    'home.js',
    'fishfull.jpg',
    'fishfull-brand.css',
    'fishfull-site-shell.js',
    'site-i18n.js',
    'vercel.json',
    'pages/about.html',
    'pages/map.html',
    'pages/sustainability.html',
    'pages/ar-mobile-fish-fit.css',
    'pages/ar-ultra-small-phone.css',
    'pages/ar-safe-view.css',
    'pages/ar-stall-tap-safe.css',
    'pages/ar-official-model-only.css',
    'pages/ar-official-model-only.js',
    'pages/ar-no-generated-fish-visuals.css'
  ]) {
    assertExists(requiredPath);
  }
}

function assertValidVercelConfig() {
  const config = JSON.parse(readText('vercel.json'));
  const rewrites = Array.isArray(config.rewrites) ? config.rewrites : [];
  for (const destination of ['/pages/about.html', '/pages/map.html', '/pages/sustainability.html']) {
    if (!rewrites.some((rewrite) => rewrite.destination === destination)) {
      throw new Error(`vercel.json: missing rewrite destination ${destination}`);
    }
  }
}

function assertNoLegacyGeneratedMarkup() {
  const offenders = [];
  const legacySvgClass = new RegExp(`<svg\\b[^>]*class=["'][^"']*\\b${LEGACY_BRAND_CLASS}\\b`, 'i');
  const footerMarkup = new RegExp(`<footer\\b[^>]*class=["'][^"']*\\b${GLOBAL_FOOTER_CLASS}\\b`, 'i');

  for (const filePath of htmlFiles()) {
    const rel = normalizeRelative(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    if (legacySvgClass.test(content)) offenders.push(`${rel}: generated logo SVG`);
    if (footerMarkup.test(content)) offenders.push(`${rel}: legacy global footer markup`);
  }

  if (offenders.length) {
    throw new Error(`Generated logo/footer markup must be removed:\n${offenders.join('\n')}`);
  }
}

function assertOfficialLogoGuard() {
  const shell = readText('fishfull-site-shell.js');
  for (const term of [
    `var logoSrc = '${OFFICIAL_LOGO}'`,
    'legacyBrandClass',
    'generatedTrademarkSelector',
    'function removeGeneratedTrademarkVisuals',
    'function removeAlternateTrademarkVisuals',
    'function dedupeBrandLogos',
    'function removeDuplicateCopyrightText',
    'footer.site-footer.fishfull-global-footer::before',
    COPYRIGHT
  ]) {
    if (!shell.includes(term)) {
      throw new Error(`fishfull-site-shell.js missing official-logo guard term: ${term}`);
    }
  }

  for (const filePath of htmlFiles()) {
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
  assertContains('home.js', 'ar.html', 'root-level AR game entry');

  if (!readText('pages/ar-ultra-small-phone.css').includes('orientation: landscape')) {
    throw new Error('pages/ar-ultra-small-phone.css must protect mobile landscape AR view');
  }
  if (!readText('pages/ar-stall-tap-safe.css').includes('touch-action: manipulation')) {
    throw new Error('pages/ar-stall-tap-safe.css must keep mobile controls tappable');
  }
  if (!readText('pages/ar-official-model-only.js').includes('removeFallbackFish')) {
    throw new Error('pages/ar-official-model-only.js must remove substitute fish art');
  }
  if (!readText('pages/ar-no-generated-fish-visuals.css').includes('.phone-fish')) {
    throw new Error('pages/ar-no-generated-fish-visuals.css must guard generated hero fish visuals');
  }
}

function assertJavaScriptSyntax() {
  for (const filePath of textFiles().filter((target) => target.endsWith('.js'))) {
    execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' });
  }
}

function main() {
  assertRequiredFiles();
  assertValidVercelConfig();
  assertNoLegacyGeneratedMarkup();
  assertOfficialLogoGuard();
  assertArEntryIsPrimary();
  assertJavaScriptSyntax();
  console.log('FishFull static check passed.');
}

try {
  main();
} catch (error) {
  console.error(`FishFull static check failed: ${error.message}`);
  process.exit(1);
}
