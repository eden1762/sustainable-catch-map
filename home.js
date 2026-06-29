(function () {
  'use strict';

  var copy = {
    zh: {
      brand: 'FishFull 漁有料',
      kicker: 'SUSTAINABLE CATCH MAP',
      nav: [
        { label: '掃碼試用', href: '#qr-demo' },
        { label: 'AR 遊戲', href: '/ar.html' },
        { label: '我們的理念', href: '/pages/about.html' },
        { label: '主推魚', href: '/pages/fish.html' },
        { label: '去附近買魚', href: '/pages/map.html' },
        { label: '零失敗食譜', href: '/pages/recipes.html' },
        { label: '十秒回饋', href: '/pages/feedback.html' }
      ],
      eyebrow: '掃碼試用・AR 遊戲・找魚種・合作點地圖・食譜回饋',
      headline: '掃一下，知道這條魚怎麼買、怎麼煮',
      intro: 'FishFull 漁有料把買魚現場變成一條好懂路線：掃 QR Code 先看魚貨小卡，知道來源與料理建議；想買某種魚，就看主推魚與附近合作點，再接到優惠、AR 遊戲集點、零失敗食譜與十秒回饋。',
      noSpin: '兩種最快玩法：掃 QR Code 試用魚貨小卡，或直接進 AR 遊戲看魚、集點、找料理。',
      qrTitle: '現場先掃這張 QR Code',
      qrBody: '試用範例會帶你看：魚貨履歷小卡、AR 遊戲集點、推薦商家、優惠提醒、料理食譜與回饋入口。魚攤、店家、活動牌卡都可以放這張。',
      qrCta: '打開 AR 試用 →',
      qrAlt: 'FishFull 漁有料試用 QR Code，連到 AR 遊戲體驗',
      qrHref: '/ar.html?demo=qr',
      qrSteps: ['掃碼看履歷', '玩 AR 看魚', '找合作點', '帶食譜回家', '10 秒回饋'],
      visualTitle: '一條好魚的現場路線',
      visualText: '消費者敢問敢買，魚販好介紹，漁業夥伴看見需求，社區與校園把友善海鮮變成今天就能做的行動。',
      visualTags: ['QR 試用', 'AR 遊戲', '魚種推薦', '合作點', '零失敗食譜'],
      actionTitle: '你現在想怎麼開始？',
      actionHint: '買魚現場不用讀很久。掃碼、玩 AR、找魚、找店、看食譜與回饋，都整理成可以立刻點的入口。',
      routeEyebrow: 'START HERE',
      actions: [
        { tone: 'blue', href: '/ar.html?demo=qr', number: '01', title: '掃碼試用', subtitle: '先看魚貨履歷範例與 AR 遊戲', badge: '最快上手', description: '適合魚攤、店家、活動現場。掃一下就知道這套服務怎麼幫客人看懂魚、找到料理與留下回饋。' },
        { tone: 'orange', href: '/ar.html', number: '02', title: '玩 AR 遊戲', subtitle: '看完整 3D 魚、集點、學會怎麼問', badge: '主推功能', description: '把標籤變成拍照、選魚、料理與集點小任務。手機上先看到完整魚模型，再決定要不要買。' },
        { tone: 'pink', href: '/pages/fish.html', number: '03', title: '找想買的魚', subtitle: '不知道買哪條，就先看今日主推魚', badge: '選魚不尷尬', description: '用口感、份量、問法與料理搭配，讓第一次買友善魚的人少一點猶豫。' },
        { tone: 'blue', href: '/pages/map.html', number: '04', title: '找附近合作點', subtitle: '看市場、魚市、餐廳與漁港', badge: '直接去買', description: '把可買、可吃、可認識漁獲的地點整理在地圖上，想買就能直接導航。' },
        { tone: 'orange', href: '/pages/recipes.html', number: '05', title: '拿零失敗食譜', subtitle: '清蒸、乾煎、煮湯，今晚就能上桌', badge: '不翻車', description: '買之前先知道怎麼煮，讓客人從「我不會」變成「我可以試」。' },
        { tone: 'pink', href: '/pages/feedback.html', number: '06', title: '留下十秒回饋', subtitle: '買或沒買都能回一句現場真話', badge: '快速記錄', description: '回饋集中在獨立頁，店家與活動夥伴比較好整理，也能讓下一輪推薦更準。' }
      ],
      stats: [
        { value: '1掃', label: '看魚貨小卡' },
        { value: 'AR', label: '完整看魚集點' },
        { value: '10秒', label: '留下買魚回饋' }
      ]
    },
    en: {
      brand: 'FishFull',
      kicker: 'SUSTAINABLE CATCH MAP',
      nav: [
        { label: 'QR Demo', href: '#qr-demo' },
        { label: 'AR Game', href: '/ar.html' },
        { label: 'Idea', href: '/pages/about.html' },
        { label: 'Featured Fish', href: '/pages/fish.html' },
        { label: 'Buy Nearby', href: '/pages/map.html' },
        { label: 'Easy Recipes', href: '/pages/recipes.html' },
        { label: 'Feedback', href: '/pages/feedback.html' }
      ],
      eyebrow: 'QR demo · AR game · Fish finder · Partner map · Recipes · Feedback',
      headline: 'Scan once, then know what to buy and cook',
      intro: 'FishFull turns seafood buying into a clear route: scan a QR code for a sample catch card, check origin and cooking ideas, find a featured fish or nearby partner spot, then continue to offers, AR game points, easy recipes, and quick feedback.',
      noSpin: 'Fastest path: scan the demo QR code, or jump into the AR game to see the fish, collect points, and get cooking ideas.',
      qrTitle: 'Scan this demo QR code',
      qrBody: 'The sample route shows a catch card, AR game mission, partner spots, offer prompt, easy recipe, and feedback entrance. It works for fish stalls, stores, markets, and event cards.',
      qrCta: 'Open AR demo →',
      qrAlt: 'FishFull demo QR code linking to the AR game experience',
      qrHref: '/ar.html?demo=qr',
      qrSteps: ['Catch card', 'AR fish view', 'Partner spot', 'Recipe', 'Feedback'],
      visualTitle: 'A good-fish field route',
      visualText: 'Shoppers ask and buy with confidence, vendors explain clearly, fisheries partners see demand, and communities turn friendly seafood into action.',
      visualTags: ['QR demo', 'AR game', 'Fish finder', 'Partner spot', 'Easy recipe'],
      actionTitle: 'How do you want to start?',
      actionHint: 'The buying flow is split into quick entrances: scan, play AR, find fish, find spots, cook, and leave feedback.',
      routeEyebrow: 'START HERE',
      actions: [
        { tone: 'blue', href: '/ar.html?demo=qr', number: '01', title: 'Scan Demo', subtitle: 'Try a sample catch card and AR game', badge: 'Fastest start', description: 'Useful for fish stalls, stores, markets, and events. One scan shows how FishFull helps shoppers understand a fish, cook it, and leave feedback.' },
        { tone: 'orange', href: '/ar.html', number: '02', title: 'Play AR Game', subtitle: 'See the full 3D fish, collect points, and ask better questions', badge: 'Main feature', description: 'Labels become small missions that connect scanning, choosing, cooking, points, and feedback. On phones, the whole fish stays visible before you buy.' },
        { tone: 'pink', href: '/pages/fish.html', number: '03', title: 'Find a Fish', subtitle: 'Start with one featured fish for today', badge: 'Less awkward', description: 'Use taste, portion, vendor talk, and recipe pairing to reduce first-time buying stress.' },
        { tone: 'blue', href: '/pages/map.html', number: '04', title: 'Find Partner Spots', subtitle: 'See markets, restaurants, ports, and fish markets', badge: 'Go buy', description: 'Real seafood spots are organized on a map with address links for navigation.' },
        { tone: 'orange', href: '/pages/recipes.html', number: '05', title: 'Get Easy Recipes', subtitle: 'Steam, pan-fry, or make soup tonight', badge: 'Low fail', description: 'A recipe before buying helps shoppers move from “I cannot cook fish” to “I can try.”' },
        { tone: 'pink', href: '/pages/feedback.html', number: '06', title: 'Leave Feedback', subtitle: 'Save one real buying note in seconds', badge: 'Quick note', description: 'Feedback now lives on one page so partners can collect and review notes more easily.' }
      ],
      stats: [
        { value: '1 scan', label: 'Open a catch card' },
        { value: 'AR', label: 'See the fish first' },
        { value: '10 sec', label: 'Leave feedback' }
      ]
    }
  };

  function lang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function escapeHtml(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value);
  }

  function logoAlt(currentLang) {
    return currentLang === 'en' ? 'FishFull official logo' : 'FishFull 漁有料官方商標';
  }

  function navTemplate(items) {
    return items.map(function (item) {
      return '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a>';
    }).join('');
  }

  function actionsTemplate(actions) {
    return actions.map(function (item) {
      var aria = item.title + ' / ' + item.subtitle + ' / ' + item.badge;
      return [
        '<article class="route-card route-' + escapeHtml(item.tone) + '" data-href="' + escapeHtml(item.href) + '" tabindex="0">',
          '<div class="route-meta">',
            '<span class="route-number">' + escapeHtml(item.number) + '</span>',
            '<span class="route-badge">' + escapeHtml(item.badge) + '</span>',
          '</div>',
          '<input type="button" class="route-button" value="' + escapeHtml(item.title) + '" aria-label="' + escapeHtml(aria) + '" data-href="' + escapeHtml(item.href) + '">',
          '<h2>' + escapeHtml(item.subtitle) + '</h2>',
          '<p>' + escapeHtml(item.description) + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }

  function statsTemplate(stats) {
    return stats.map(function (item) {
      return '<div class="stat-pill"><strong>' + escapeHtml(item.value) + '</strong><span>' + escapeHtml(item.label) + '</span></div>';
    }).join('');
  }

  function tagsTemplate(tags) {
    return tags.map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
  }

  function qrStepsTemplate(steps) {
    return steps.map(function (step) {
      return '<span>' + escapeHtml(step) + '</span>';
    }).join('');
  }

  function qrDemoTemplate(text) {
    return [
      '<section class="qr-demo-card" id="qr-demo" aria-label="' + escapeHtml(text.qrTitle) + '">',
        '<a class="qr-image-link" href="' + escapeHtml(text.qrHref) + '" aria-label="' + escapeHtml(text.qrCta) + '">',
          '<img src="/assets/fishfull-demo-qr.svg" width="164" height="164" loading="eager" decoding="async" alt="' + escapeHtml(text.qrAlt) + '">',
        '</a>',
        '<div class="qr-demo-copy">',
          '<p class="qr-label">QR DEMO</p>',
          '<h2>' + escapeHtml(text.qrTitle) + '</h2>',
          '<p>' + escapeHtml(text.qrBody) + '</p>',
          '<div class="qr-step-row">' + qrStepsTemplate(text.qrSteps) + '</div>',
          '<a class="qr-demo-link" href="' + escapeHtml(text.qrHref) + '">' + escapeHtml(text.qrCta) + '</a>',
        '</div>',
      '</section>'
    ].join('');
  }

  function setMeta(text, currentLang) {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hant';
    document.title = currentLang === 'en' ? 'FishFull | QR demo, AR game, seafood guide' : 'FishFull 漁有料｜掃碼試用、AR 遊戲、找魚買魚';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', text.intro);
  }

  function render() {
    var root = document.getElementById('root');
    if (!root) return;
    var currentLang = lang();
    var text = copy[currentLang] || copy.zh;
    setMeta(text, currentLang);
    root.innerHTML = [
      '<div class="page-home">',
        '<header class="site-nav" aria-label="Main navigation">',
          '<a class="brand-mark" href="/" aria-label="' + escapeHtml(text.brand) + '">',
            '<span class="fishfull-logo-mark home-brand-logo"><img src="/fishfull.jpg" width="44" height="44" loading="eager" decoding="async" alt="' + escapeHtml(logoAlt(currentLang)) + '"></span>',
            '<span class="brand-text"><span class="brand-kicker">' + escapeHtml(text.kicker) + '</span><strong>' + escapeHtml(text.brand) + '</strong></span>',
          '</a>',
          '<nav class="nav-links" aria-label="Homepage links">' + navTemplate(text.nav) + '</nav>',
        '</header>',
        '<main class="home-hero">',
          '<section class="hero-copy" aria-labelledby="home-title">',
            '<p class="eyebrow">' + escapeHtml(text.eyebrow) + '</p>',
            '<h1 id="home-title">' + escapeHtml(text.headline) + '</h1>',
            '<p class="hero-intro">' + escapeHtml(text.intro) + '</p>',
            '<div class="no-spin-note">' + escapeHtml(text.noSpin) + '</div>',
            qrDemoTemplate(text),
            '<div class="hero-stats" aria-label="FishFull metrics">' + statsTemplate(text.stats) + '</div>',
          '</section>',
          '<section class="coast-panel" aria-label="Static coastal design summary">',
            '<div class="coast-sky" aria-hidden="true"><span class="static-sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span></div>',
            '<div class="coast-water" aria-hidden="true"></div>',
            '<div class="coast-sand" aria-hidden="true"></div>',
            '<div class="coast-card"><h2>' + escapeHtml(text.visualTitle) + '</h2><p>' + escapeHtml(text.visualText) + '</p><div class="coast-tags">' + tagsTemplate(text.visualTags) + '</div></div>',
          '</section>',
          '<section class="route-panel" aria-labelledby="route-title">',
            '<div class="route-heading"><p class="eyebrow">' + escapeHtml(text.routeEyebrow) + '</p><h2 id="route-title">' + escapeHtml(text.actionTitle) + '</h2><p>' + escapeHtml(text.actionHint) + '</p></div>',
            '<div class="route-grid">' + actionsTemplate(text.actions) + '</div>',
          '</section>',
        '</main>',
      '</div>'
    ].join('');
  }

  function bindRoutes() {
    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-href]');
      if (!target) return;
      window.location.href = target.getAttribute('data-href');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var target = event.target.closest('.route-card[data-href]');
      if (!target) return;
      event.preventDefault();
      window.location.href = target.getAttribute('data-href');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    bindRoutes();
  });
  document.addEventListener('scm-language-change', render);
})();