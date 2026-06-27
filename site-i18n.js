(function () {
  'use strict';

  var active = 'zh';

  function current() {
    return active;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function updateButtons() {
    var nextLabel = active === 'en' ? '中文' : 'EN';
    var title = active === 'en' ? '切換成中文' : '切換成英文';
    document.querySelectorAll('.language-toggle').forEach(function (button) {
      button.setAttribute('aria-label', title);
      button.setAttribute('title', title);
      var icon = button.querySelector('[data-lang-icon]');
      if (icon) icon.textContent = nextLabel;
      else button.textContent = nextLabel;
    });
  }

  function set(next) {
    active = next === 'en' ? 'en' : 'zh';
    document.documentElement.lang = active === 'en' ? 'en' : 'zh-Hant';
    updateButtons();
    document.dispatchEvent(new Event('fishfull-language-change'));
    document.dispatchEvent(new Event('scm-language-change'));
  }

  function toggle() {
    set(active === 'en' ? 'zh' : 'en');
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.language-toggle');
    if (!button) return;
    event.preventDefault();
    toggle();
  });

  window.FishFullLanguage = {
    current: current,
    set: set,
    toggle: toggle,
    escapeHtml: escapeHtml,
    site: 'FishFull Map'
  };
  window.SCMLanguage = window.FishFullLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { set(active); });
  } else {
    set(active);
  }
})();
