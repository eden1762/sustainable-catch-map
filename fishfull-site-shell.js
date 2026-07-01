(function () {
  'use strict';

  var logoSrc = '/fishfull.jpg';
  var copyrightText = 'Copyright © 2026Fishfull漁有料版權所有';
  var cleanupStyleId = 'fishfull-shell-cleanup-style';
  var legacyBrandClass = ['brand', 'logo', 'img'].join('-');
  var generatedTrademarkSelector = [
    '[data-generated-logo]',
    '[data-generated-mark]',
    '[data-ai-logo]',
    '.generated-logo',
    '.generated-mark',
    '.ai-logo',
    '.ai-generated-logo',
    '.' + legacyBrandClass,
    'svg.' + legacyBrandClass,
    '.fish-logo',
    '.fish-icon',
    '.fish-badge',
    '.round-fish-logo',
    '.legacy-fishfull-mark'
  ].join(', ');
  var observerTimer = null;

  function currentLang() {
    return window.SCMLanguage && window.SCMLanguage.current ? window.SCMLanguage.current() : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function logoAlt() {
    return currentLang() === 'en' ? 'FishFull official logo' : 'FishFull 漁有料官方商標';
  }

  function installCleanupStyle() {
    if (!document.head || document.getElementById(cleanupStyleId)) return;
    var style = document.createElement('style');
    style.id = cleanupStyleId;
    style.textContent = [
      'footer.site-footer.fishfull-global-footer::before{content:none!important;display:none!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;}',
      'svg.' + legacyBrandClass + ',.' + legacyBrandClass + '[data-generated-logo],.generated-logo,.generated-mark,.ai-logo,.ai-generated-logo,.round-fish-logo,.legacy-fishfull-mark{display:none!important;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function isBrandContainer(node) {
    return !!(node && node.closest && node.closest('.brand-mark, .brand, .site-nav, .page-nav'));
  }

  function isLogoImage(img) {
    if (!img) return false;
    var src = img.getAttribute('src') || '';
    var alt = img.getAttribute('alt') || '';
    var className = img.className || '';
    return src.indexOf('fishfull') !== -1 || /logo|brand|商標/i.test(alt + ' ' + className) || isBrandContainer(img);
  }

  function hasOfficialLogo(node) {
    if (!node) return false;
    if (node.matches && node.matches('img') && node.getAttribute('src') === logoSrc) return true;
    return !!(node.querySelector && node.querySelector('img[src="' + logoSrc + '"]'));
  }

  function setOfficialLogo(holder) {
    if (!holder) return null;
    holder.classList.add('fishfull-logo-mark');
    holder.setAttribute('aria-hidden', 'false');
    var img = holder.querySelector('img');
    if (!img) {
      holder.textContent = '';
      img = document.createElement('img');
      img.width = 48;
      img.height = 48;
      img.loading = 'eager';
      img.decoding = 'async';
      holder.appendChild(img);
    }
    if (img.getAttribute('src') !== logoSrc) img.src = logoSrc;
    if (img.getAttribute('alt') !== logoAlt()) img.alt = logoAlt();
    Array.prototype.slice.call(holder.childNodes).forEach(function (node) {
      if (node !== img && node.nodeType !== 1) holder.removeChild(node);
    });
    Array.prototype.slice.call(holder.children).forEach(function (child) {
      if (child !== img) holder.removeChild(child);
    });
    return holder;
  }

  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function removeGeneratedTrademarkVisuals() {
    if (!document.querySelectorAll) return;
    Array.prototype.slice.call(document.querySelectorAll(generatedTrademarkSelector)).forEach(function (node) {
      if (!node || hasOfficialLogo(node)) return;
      removeNode(node);
    });
  }

  function removeAlternateTrademarkVisuals() {
    if (!document.querySelectorAll) return;
    Array.prototype.slice.call(document.querySelectorAll('img, svg')).forEach(function (node) {
      if (!node || hasOfficialLogo(node)) return;
      if (node.matches && node.matches('svg.' + legacyBrandClass)) {
        removeNode(node);
        return;
      }
      if (!node.matches || !node.matches('img')) return;
      if (!isLogoImage(node)) return;
      if (node.getAttribute('src') === logoSrc) return;
      var removable = node.closest && node.closest('.home-brand-logo, .brand-symbol, .brand-sun, .generated-logo, .generated-mark, .ai-logo, .ai-generated-logo, .' + legacyBrandClass + ', .fish-logo, .fish-icon, .fish-badge, .round-fish-logo, .legacy-fishfull-mark');
      removeNode(removable || node);
    });
  }

  function dedupeBrandLogos() {
    var containers = document.querySelectorAll('.brand-mark, .brand');
    Array.prototype.forEach.call(containers, function (container) {
      var holders = [];
      Array.prototype.slice.call(container.querySelectorAll('.fishfull-logo-mark, .home-brand-logo, .brand-symbol, .brand-sun')).forEach(function (holder) {
        if (holders.indexOf(holder) === -1) holders.push(holder);
      });
      Array.prototype.slice.call(container.querySelectorAll('img')).forEach(function (img) {
        if (!isLogoImage(img)) return;
        var holder = img.closest('.fishfull-logo-mark, .home-brand-logo, .brand-symbol, .brand-sun') || img;
        if (holders.indexOf(holder) === -1) holders.push(holder);
      });
      if (!holders.length) return;

      var keeper = holders.filter(function (holder) {
        var img = holder.matches && holder.matches('img') ? holder : holder.querySelector && holder.querySelector('img');
        return img && img.getAttribute('src') === logoSrc;
      })[0] || holders[0];
      if (keeper.matches && keeper.matches('img')) {
        var wrap = document.createElement('span');
        wrap.className = 'fishfull-logo-mark';
        keeper.parentNode.insertBefore(wrap, keeper);
        wrap.appendChild(keeper);
        keeper = wrap;
      }
      setOfficialLogo(keeper);

      holders.forEach(function (holder) {
        if (holder !== keeper && !keeper.contains(holder)) removeNode(holder);
      });
    });
  }

  function applyLogo() {
    var marks = document.querySelectorAll('.brand-sun, .brand-symbol, .brand-mark .fishfull-logo-mark, .brand .fishfull-logo-mark');
    Array.prototype.forEach.call(marks, setOfficialLogo);
    dedupeBrandLogos();
    removeAlternateTrademarkVisuals();
    removeGeneratedTrademarkVisuals();
  }

  function isGeneratedTrademarkVisual(node) {
    if (!node || !node.matches) return false;
    if (hasOfficialLogo(node)) return false;
    if (node.matches(generatedTrademarkSelector)) return true;
    var label = [
      node.getAttribute('class') || '',
      node.getAttribute('id') || '',
      node.getAttribute('aria-label') || '',
      node.getAttribute('alt') || '',
      node.getAttribute('src') || ''
    ].join(' ');
    return /(generated|ai[-_ ]?logo|round[-_ ]?fish|fish[-_ ]?(logo|icon|badge)|legacy[-_ ]?fishfull|brand[-_ ]?logo[-_ ]?img|brand[-_ ]?(fish|badge|icon))/i.test(label);
  }

  function removeGeneratedTrademarkContainers() {
    if (!document.querySelectorAll) return;
    Array.prototype.slice.call(document.querySelectorAll('[class], [id], [aria-label], img, svg')).forEach(function (node) {
      if (isGeneratedTrademarkVisual(node)) removeNode(node);
    });
  }

  function removeLegacyGlobalFooter() {
    if (!document.querySelectorAll) return;
    Array.prototype.slice.call(document.querySelectorAll('footer.fishfull-global-footer')).forEach(removeNode);
  }

  function footerParent() {
    return document.querySelector('.page-shell') || document.querySelector('.page-home') || document.getElementById('root') || document.body;
  }

  function removeDuplicateCopyrightText(footer) {
    if (!document.body || !window.TreeWalker) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf(copyrightText) === -1) return NodeFilter.FILTER_REJECT;
        if (footer && footer.contains(node.parentNode)) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (parent && parent.closest && parent.closest('script, style, template')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      node.nodeValue = node.nodeValue.split(copyrightText).join('').replace(/\s+/g, ' ').trim();
      var parent = node.parentElement;
      while (parent && parent !== document.body && parent !== footer && parent.textContent.trim() === '') {
        var next = parent.parentElement;
        removeNode(parent);
        parent = next;
      }
    });
  }

  function applyShell() {
    installCleanupStyle();
    removeLegacyGlobalFooter();
    removeGeneratedTrademarkContainers();
    applyLogo();
    removeDuplicateCopyrightText(null);
    footerParent();
  }

  function scheduleApply() {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(applyShell, 0);
    window.setTimeout(applyShell, 120);
  }

  function watchPageUpdates() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(scheduleApply).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    scheduleApply();
    watchPageUpdates();
  });
  document.addEventListener('scm-language-change', scheduleApply);
  window.addEventListener('load', scheduleApply);
})();
