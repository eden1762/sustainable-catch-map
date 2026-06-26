(function () {
  'use strict';

  var copy = {
    zh: {
      brand: 'FishFull 漁有料',
      kicker: 'SUSTAINABLE CATCH MAP',
      nav: [
        { label: '我們的理念', href: '/pages/about.html' },
        { label: '主推魚', href: '/pages/fish.html' },
        { label: '去附近買魚', href: '/pages/map.html' },
        { label: '零失敗食譜', href: '/pages/recipes.html' },
        { label: '十秒回饋', href: '/pages/feedback.html' },
        { label: '看現場紀錄', href: '/pages/field.html' }
      ],
      eyebrow: '掃碼選魚・主推魚・合作點地圖・零失敗料理・10 秒回饋',
      headline: '買對一條魚，也能讓海更有魚',
      intro: 'FishFull 漁有料把友善海鮮變成今天就能做的小行動：先看一條主推魚，找到附近合作點，帶走一份零失敗食譜，買完或沒買都能用十秒留下回饋。',
      noSpin: '最短路線：看主推魚 → 找合作點 → 選食譜 → 今天試買 → 留十秒回饋。',
      visualTitle: '一條好魚的行動路線',
      visualText: '消費者敢買，魚販好介紹，漁業夥伴看見需求，社區與校園把行動擴散出去。',
      visualTags: ['主推魚', '合作點', '零失敗食譜', '十秒回饋'],
      actionTitle: '今天先完成哪一步？',
      actionHint: '每個入口都接到實際頁面，不再只有文字說明。看完下一步，就能直接點進去行動。',
      actions: [
        { tone: 'blue', href: '/pages/fish.html', number: '01', title: '主推魚', subtitle: '先把選擇縮成一條今天能試買的魚', badge: '先看這條', description: '用口感、份量、問法與料理搭配，讓第一次買友善魚的人少一點猶豫。' },
        { tone: 'orange', href: '/pages/map.html', number: '02', title: '去附近買魚', subtitle: '找市場、魚市、餐廳與漁港合作點', badge: '直接行動', description: '把可買、可吃、可認識漁獲的地點整理在地圖上，點地址就能去。' },
        { tone: 'pink', href: '/pages/recipes.html', number: '03', title: '零失敗食譜', subtitle: '清蒸、乾煎、煮湯，今晚就能上桌', badge: '不翻車', description: '買之前先知道怎麼煮，讓客人從「我不會」變成「我可以試」。' },
        { tone: 'blue', href: '/pages/feedback.html', number: '04', title: '十秒回饋', subtitle: '買或沒買都能回一句現場真話', badge: '快速記錄', description: '回饋集中在獨立頁，不再每頁重複出現，店家也比較好整理。' },
        { tone: 'orange', href: '/pages/field.html', number: '05', title: '看現場紀錄', subtitle: '看魚販怎麼講、客人怎麼問', badge: '真實現場', description: '把合作店家、活動、問答與採買反應整理成大家看得懂的紀錄。' },
        { tone: 'pink', href: '/pages/sustainability.html', number: '06', title: '玩標籤', subtitle: '用任務感學會看漁法、產地與料理', badge: '年輕好懂', description: '把標籤變成掃碼、拍照、選魚、料理與回饋的小任務。' }
      ],
      stats: [
        { value: '1條魚', label: '先主推一條好魚' },
        { value: '1張圖', label: '找到合作點' },
        { value: '10秒', label: '留下買魚回饋' }
      ]
    },
    en: {
      brand: 'FishFull',
      kicker: 'SUSTAINABLE CATCH MAP',
      nav: [
        { label: 'Idea', href: '/pages/about.html' },
        { label: 'Featured Fish', href: '/pages/fish.html' },
        { label: 'Buy Nearby', href: '/pages/map.html' },
        { label: 'Easy Recipes', href: '/pages/recipes.html' },
        { label: 'Feedback', href: '/pages/feedback.html' },
        { label: 'Field Notes', href: '/pages/field.html' }
      ],
      eyebrow: 'Featured fish · Partner map · Easy recipe · 10-second feedback',
      headline: 'Choose the right fish, and help keep the ocean full',
      intro: 'FishFull turns friendly seafood into a practical buying route: start with one featured fish, find a nearby partner spot, pick an easy recipe, then leave quick feedback after buying or almost buying.',
      noSpin: 'Shortest path: featured fish → partner spot → easy recipe → try buying today → leave feedback.',
      visualTitle: 'One good-fish action route',
      visualText: 'Shoppers buy with confidence, vendors explain clearly, fisheries partners see demand, and communities spread the action.',
      visualTags: ['Featured fish', 'Partner spot', 'Easy recipe', 'Feedback'],
      actionTitle: 'Which step will you take today?',
      actionHint: 'Each entrance now leads to a real page, not only a sentence.',
      actions: [
        { tone: 'blue', href: '/pages/fish.html', number: '01', title: 'Featured Fish', subtitle: 'Start with one fish people can try today', badge: 'Start here', description: 'Use taste, portion, vendor talk, and recipe pairing to reduce first-time buying stress.' },
        { tone: 'orange', href: '/pages/map.html', number: '02', title: 'Buy Nearby', subtitle: 'Find markets, restaurants, ports, and fish markets', badge: 'Take action', description: 'Real seafood spots are organized on a map with address links for navigation.' },
        { tone: 'pink', href: '/pages/recipes.html', number: '03', title: 'Easy Recipes', subtitle: 'Steam, pan-fry, or make soup tonight', badge: 'Low fail', description: 'A recipe before buying helps shoppers move from “I cannot cook fish” to “I can try.”' },
        { tone: 'blue', href: '/pages/feedback.html', number: '04', title: '10-sec Feedback', subtitle: 'Save one real buying note', badge: 'Quick note', description: 'Feedback now lives on one page instead of repeating everywhere.' },
        { tone: 'orange', href: '/pages/field.html', number: '05', title: 'Field Notes', subtitle: 'See how vendors talk and shoppers ask', badge: 'Real field', description: 'Partner stores, activities, questions, and buying responses are kept together.' },
        { tone: 'pink', href: '/pages/sustainability.html', number: '06', title: 'Label Missions', subtitle: 'Learn methods, origin, and cooking through tasks', badge: 'Youth friendly', description: 'Labels become small missions that connect scanning, choosing, cooking, and feedback.' }
      ],
      stats: [
        { value: '1 fish', label: 'Start with one good catch' },
        { value: '1 map', label: 'Find partner spots' },
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

  function setMeta(text, currentLang) {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hant';
    document.title = currentLang === 'en' ? 'FishFull | Choose seafood with confidence' : 'FishFull 漁有料｜買對一條魚，也能讓海更有魚';
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
            '<span class="brand-sun" aria-hidden="true"></span>',
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
            '<div class="hero-stats" aria-label="FishFull metrics">' + statsTemplate(text.stats) + '</div>',
          '</section>',
          '<section class="coast-panel" aria-label="Static coastal design summary">',
            '<div class="coast-sky" aria-hidden="true"><span class="static-sun"></span><span class="cloud cloud-one"></span><span class="cloud cloud-two"></span></div>',
            '<div class="coast-water" aria-hidden="true"></div>',
            '<div class="coast-sand" aria-hidden="true"></div>',
            '<div class="coast-card"><h2>' + escapeHtml(text.visualTitle) + '</h2><p>' + escapeHtml(text.visualText) + '</p><div class="coast-tags">' + tagsTemplate(text.visualTags) + '</div></div>',
          '</section>',
          '<section class="route-panel" aria-labelledby="route-title">',
            '<div class="route-heading"><p class="eyebrow">SELECT ROUTE</p><h2 id="route-title">' + escapeHtml(text.actionTitle) + '</h2><p>' + escapeHtml(text.actionHint) + '</p></div>',
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
