(function () {
  'use strict';

  var active = (function () {
    try { return localStorage.getItem('fishfull-language') || localStorage.getItem('scm-language') || 'zh'; }
    catch (error) { return 'zh'; }
  })();
  active = active === 'en' ? 'en' : 'zh';

  var copyrightZh = 'Copyright © 2026Fishfull漁有料版權所有';
  var copyrightEn = 'Copyright © 2026 Fishfull 漁有料. All rights reserved.';

  var pageNames = {
    about: ['Idea', 'Green seafood, made practical', 'FishFull turns seafood shopping into a clear path: pick a friendly fish, find a nearby seafood spot, cook it with less stress, and leave one real note.'],
    fish: ['Featured Fish', 'Start with one fish and skip the guesswork', 'A simple fish pick helps shoppers ask better questions and helps fishmongers explain taste, portion, freshness, and cooking in plain words.'],
    map: ['Buy Nearby', 'Find a good seafood spot near you', 'Open real seafood locations, bring a recipe, and make the buying route easy on mobile.'],
    recipes: ['Easy Recipes', 'Pick a recipe before buying', 'Steam, pan-fry, or make soup with short steps and rescue tips, so tonight’s seafood dinner feels doable.'],
    feedback: ['Quick Feedback', 'Bought or not, one real note is enough', 'Capture what helped, what blocked the buy, and one honest quote from the seafood counter.'],
    field: ['Field Notes', 'Good fish should be seen, bought, cooked, and remembered', 'On-site notes keep the action short: scan, ask, buy, cook, and share feedback.'],
    sustainability: ['Label Missions', 'Turn seafood labels into buying missions', 'Make origin, catch method, fish status, recipes, and feedback easy to understand and useful at the counter.']
  };

  function current() { return active; }
  function escapeHtml(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;'); }

  function updateButtons() {
    var nextLabel = active === 'en' ? '中文' : 'EN';
    var title = active === 'en' ? '切換成中文' : 'Switch to English';
    document.querySelectorAll('.language-toggle').forEach(function (button) {
      button.setAttribute('aria-label', title);
      button.setAttribute('title', title);
      var icon = button.querySelector('[data-lang-icon]');
      if (icon && icon.textContent !== nextLabel) icon.textContent = nextLabel;
      else if (!icon && button.textContent !== nextLabel) button.textContent = nextLabel;
    });
  }

  function injectTheme() {
    if (document.getElementById('fishfull-blue-green-theme')) return;
    var style = document.createElement('style');
    style.id = 'fishfull-blue-green-theme';
    style.textContent = [
      ':root{--fishfull-blue:#006d77;--fishfull-green:#168a49;--fishfull-white:#ffffff;--fishfull-mint:#e8fbf8;--fishfull-ink:#0b3034;--ink:var(--fishfull-ink)!important;--ink-soft:#2e5d61!important;--sea:var(--fishfull-blue)!important;--sea-deep:#005b63!important;--sky:#e6fbff!important;--sun:var(--fishfull-green)!important;--sand:#f4fffd!important;--sand-deep:#c9f2e7!important;--paper:rgba(255,255,255,.88)!important;--paper-solid:#ffffff!important;--line:rgba(0,109,119,.14)!important;--shadow:0 26px 70px rgba(0,109,119,.18)!important;}',
      'body{background:#f6fffd!important;color:var(--fishfull-ink)!important;}',
      'footer.site-footer.fishfull-global-footer::before{content:none!important;display:none!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important;}',
      '.page-home{background:radial-gradient(circle at 78% 12%,rgba(255,255,255,.98) 0 10%,rgba(255,255,255,0) 24%),linear-gradient(135deg,#ffffff 0%,#eefdfa 34%,#b9eee6 68%,#006d77 100%)!important;}',
      '.page-home::before{background:linear-gradient(120deg,rgba(255,255,255,.86),rgba(232,251,248,.38) 45%,rgba(0,109,119,.16))!important;}.page-home::after{background:linear-gradient(90deg,rgba(255,255,255,.72),rgba(0,109,119,.16),rgba(22,138,73,.16))!important;}',
      '.site-nav,.topbar,.mobile-social-dock,.desktop-social-dock{background:rgba(255,255,255,.86)!important;border-color:rgba(0,109,119,.16)!important;box-shadow:0 18px 46px rgba(0,109,119,.14)!important;}',
      '.brand-sun,.brand-symbol,.sun-dot{display:none!important;}.brand-mark,.brand{gap:12px!important;}',
      '.brand-text strong,.brand strong,.brand-mark strong{color:var(--fishfull-ink)!important;}.brand-kicker,.brand small,.eyebrow{color:var(--fishfull-blue)!important;}',
      '.nav-links a,.topnav a{background:rgba(255,255,255,.72)!important;border-color:rgba(0,109,119,.12)!important;color:#0c545c!important;}.nav-links a:hover,.topnav a:hover,.topnav a[aria-current="page"]{background:#e8fbf8!important;color:#005b63!important;}',
      '.hero-copy,.coast-panel,.route-panel,.page-hero,.content-section,.hero-card,.info-card,.action-card,.recipe-card,.location-card,.spotlight-main,.spotlight-facts article,.feedback-form{background:rgba(255,255,255,.92)!important;border-color:rgba(0,109,119,.14)!important;box-shadow:0 20px 58px rgba(0,109,119,.13)!important;}',
      '.coast-sky{background:linear-gradient(180deg,#e6fbff,#ffffff)!important;}.static-sun{background:radial-gradient(circle at 35% 30%,#fff 0 16%,#8de0cd 17% 58%,#168a49 100%)!important;box-shadow:0 20px 60px rgba(22,138,73,.28)!important;}.coast-water{background:linear-gradient(180deg,#51c8d2,#006d77)!important;}.coast-sand{background:linear-gradient(180deg,#ffffff,#e8fbf8)!important;}',
      '.route-blue,.route-orange,.route-pink{background:linear-gradient(180deg,#f7fffe,#ffffff 58%,#e8fbf8)!important;}.route-blue .route-button,.route-orange .route-button,.route-pink .route-button,.feedback-save,.map-action{background:linear-gradient(135deg,#006d77,#168a49)!important;color:#fff!important;}',
      '.route-badge,.coast-tags span,.badge-row span,.filter-chip,.card-icon,.mini-link{background:#e8fbf8!important;color:#006d77!important;border-color:rgba(0,109,119,.14)!important;}.filter-chip.is-active,.social-instagram,.circle-link{background:linear-gradient(135deg,#006d77,#168a49)!important;color:#fff!important;}.social-language{background:#fff!important;color:#006d77!important;border:1px solid rgba(0,109,119,.18)!important;}',
      '.site-footer,.site-footer strong,.site-footer span,.fishfull-global-footer strong,.fishfull-global-footer span{display:block;color:#0b545c!important;}.page-shell .site-footer,.page-shell .fishfull-global-footer{max-width:1180px;}.page-home .fishfull-global-footer{max-width:min(1180px,calc(100% - 28px));margin-bottom:26px;}',
      '.fishfull-en-page .info-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));}.fishfull-en-page .link-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));}'
      
    ].join('');
    document.head.appendChild(style);
  }

    function enhanceBrandNodes() {
        document.querySelectorAll('.brand-mark,.brand').forEach(function (brand) {
            var small = brand.querySelector('.brand-kicker,.brand small');
            if (small && small.textContent !== 'Green Seafood') small.textContent = 'Green Seafood';
        });
    }

  

  function renderEnglishContentPage() {
    if (active !== 'en') return;
    var key = document.body && document.body.dataset ? document.body.dataset.page : '';
    if (!key || key === 'ar-game' || !pageNames[key]) return;
    var root = document.getElementById('root');
    if (!root || (root.dataset.fishfullRuntimeLang === 'en' && root.dataset.fishfullRuntimePage === key)) return;
    var page = pageNames[key];
    document.title = 'FishFull | ' + page[0];
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', page[2]);
    root.innerHTML = '<div class="page-shell fishfull-en-page page-' + escapeHtml(key) + '"><header class="topbar"><a class="brand" href="/"><span><small>Green Seafood</small><strong>FishFull</strong></span></a><nav class="topnav" aria-label="Main navigation"><a href="/">Home</a><a href="/ar.html">AR Game</a><a href="/pages/fish.html">Featured Fish</a><a href="/pages/map.html">Buy Nearby</a><a href="/pages/recipes.html">Easy Recipes</a><a href="/pages/feedback.html">Feedback</a></nav><div class="nav-actions"><a class="circle-link" href="https://www.instagram.com/fishfull_2025/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a><button class="circle-link language-toggle" type="button"><span data-lang-icon>中文</span></button></div></header><main><section class="page-hero"><div class="hero-text"><p class="eyebrow">' + escapeHtml(page[0]) + '</p><h1>' + escapeHtml(page[1]) + '</h1><p>' + escapeHtml(page[2]) + '</p><div class="badge-row"><span>Seafood made easy</span><span>Market-ready</span><span>Phone-friendly</span><span>No guesswork</span></div></div><div class="hero-card" aria-hidden="true"><strong>' + escapeHtml(page[0]) + '</strong><em>FishFull Green Seafood</em><div class="wave-lines"><i></i><i></i><i></i></div></div></section><section class="content-section"><div class="section-heading"><p class="eyebrow">Start here</p><h2>Ask, buy, cook, and share one note</h2><p>FishFull keeps the wording friendly for seafood shoppers, fishmongers, fisheries teams, and younger buyers in the US and Europe.</p></div><div class="link-grid"><a class="action-card" href="/ar.html"><span class="card-icon">🎮</span><h3>AR Game</h3><p>View the whole fish first and ask better questions at the counter.</p><strong>Open →</strong></a><a class="action-card" href="/pages/map.html"><span class="card-icon">📍</span><h3>Buy Nearby</h3><p>Find real seafood spots and open the address for navigation.</p><strong>Open →</strong></a><a class="action-card" href="/pages/recipes.html"><span class="card-icon">🍳</span><h3>Easy Recipes</h3><p>Choose a low-stress cooking route before buying.</p><strong>Open →</strong></a></div></section></main><footer class="site-footer"><strong>FishFull Green Seafood</strong><span>' + escapeHtml(copyrightEn) + '</span></footer></div>';
    root.dataset.fishfullRuntimeLang = 'en';
    root.dataset.fishfullRuntimePage = key;
  }

  var decorateTimer = 0;
  function decorateSoon() { clearTimeout(decorateTimer); decorateTimer = window.setTimeout(decorate, 0); }
  function decorate() { injectTheme(); renderEnglishContentPage(); enhanceBrandNodes(); updateButtons(); }
  function set(next) {
    active = next === 'en' ? 'en' : 'zh';
    try { localStorage.setItem('fishfull-language', active); localStorage.setItem('scm-language', active); } catch (error) {}
    document.documentElement.lang = active === 'en' ? 'en' : 'zh-Hant';
    updateButtons();
    document.dispatchEvent(new Event('fishfull-language-change'));
    document.dispatchEvent(new Event('scm-language-change'));
    decorateSoon();
  }
  function toggle() { set(active === 'en' ? 'zh' : 'en'); }
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.language-toggle');
    if (!button) return;
    event.preventDefault();
    toggle();
  });

  window.FishFullLanguage = { current: current, set: set, toggle: toggle, escapeHtml: escapeHtml, site: 'FishFull Map' };
  window.SCMLanguage = window.FishFullLanguage;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { set(active); decorateSoon(); });
  else { set(active); decorateSoon(); }
})();