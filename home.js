(function () {
  'use strict';

  var copy = {
    "zh": {
        "brand": "FishFull 漁有料",
        "kicker": "SUSTAINABLE CATCH MAP",
        "nav": [
            {
                "label": "我們的理念",
                "href": "/pages/about.html"
            },
            {
                "label": "友善海鮮地圖",
                "href": "/pages/map.html"
            },
            {
                "label": "AR 永續小任務",
                "href": "/pages/sustainability.html"
            }
        ],
        "eyebrow": "買魚不盲選・看漁法・會料理・玩任務",
        "headline": "買對一條魚，也能讓海更有魚",
        "intro": "FishFull 漁有料是一個掃 QR Code 就能用的買魚小幫手：用紅黃綠燈看懂魚種狀態，了解漁法、產地與當季料理；魚販與店家可以把好魚故事說清楚，消費者也能把每一次購買變成支持友善漁業的行動。",
        "noSpin": "適合魚市場、餐廳、校園與社群活動：畫面輕、載入快、按鈕清楚，現場網路不穩也能快速打開。",
        "visualTitle": "海風、沙灘、陽光感的輕量首頁",
        "visualText": "讓大家一進站就知道：怎麼挑魚、去哪裡買、完成什麼永續小任務。",
        "visualTags": [
            "掃碼即用",
            "市場好讀",
            "手機友善"
        ],
        "actionTitle": "今天想怎麼開始？",
        "actionHint": "三個入口對應三種需求：了解理念、找到友善店家、用互動任務學會辨識標籤。",
        "actions": [
            {
                "tone": "blue",
                "href": "/pages/about.html",
                "number": "01",
                "title": "我們的理念",
                "subtitle": "用漁業知識，幫大家買到更安心的當季好魚",
                "badge": "先懂再買",
                "description": "把「不知道怎麼挑、怎麼煮」說成簡單選魚方法：看魚種、看漁法、看季節，讓消費者買得安心，魚販也更容易介紹好漁獲。"
            },
            {
                "tone": "orange",
                "href": "/pages/map.html",
                "number": "02",
                "title": "友善海鮮地圖",
                "subtitle": "找魚攤、餐廳與社區合作點，把好魚帶到你身邊",
                "badge": "就近採買",
                "description": "把合作魚攤、餐廳、社區與校園標在地圖上，搭配推薦魚種、料理建議與購買回饋，讓好選擇更容易被看見。"
            },
            {
                "tone": "pink",
                "href": "/pages/sustainability.html",
                "number": "03",
                "title": "AR 永續小任務",
                "subtitle": "用遊戲感學會看標籤，拍照分享再完成購買回饋",
                "badge": "玩中學",
                "description": "把紅黃綠燈、產地故事、漁法知識做成徽章任務，讓年輕人願意停下來、懂得選，也願意分享給朋友。"
            }
        ],
        "stats": [
            {
                "value": "3秒",
                "label": "看懂魚種狀態"
            },
            {
                "value": "免下載",
                "label": "掃碼直接用"
            },
            {
                "value": "買後回饋",
                "label": "知道大家怎麼選"
            }
        ]
    },
    "en": {
        "brand": "FishFull",
        "kicker": "SUSTAINABLE CATCH MAP",
        "nav": [
            {
                "label": "Our Idea",
                "href": "/pages/about.html"
            },
            {
                "label": "Seafood Map",
                "href": "/pages/map.html"
            },
            {
                "label": "AR Missions",
                "href": "/pages/sustainability.html"
            }
        ],
        "eyebrow": "Choose smarter · Know the catch · Cook with confidence · Play missions",
        "headline": "Choose the right fish, and help keep the ocean full",
        "intro": "FishFull is a QR Code seafood helper for real buying moments. Shoppers can read traffic-light fish status, fishing method, origin, and easy cooking ideas; vendors and restaurants can tell better catch stories, and every purchase can support friendly fisheries.",
        "noSpin": "Made for seafood markets, restaurants, campuses, and social events: light pages, fast loading, clear buttons, and readable content even when the network is weak.",
        "visualTitle": "A light beach-and-sun homepage",
        "visualText": "A clear 2D visual replaces dizzy rotation, so visitors immediately know how to choose fish, where to buy, and which sustainability mission to try.",
        "visualTags": [
            "Scan to use",
            "Market friendly",
            "Mobile friendly"
        ],
        "actionTitle": "How would you like to start?",
        "actionHint": "Three entrances match three needs: understand the idea, find friendly stores, and learn labels through interactive missions.",
        "actions": [
            {
                "tone": "blue",
                "href": "/pages/about.html",
                "number": "01",
                "title": "Our Idea",
                "subtitle": "Use fisheries knowledge to help people buy better seasonal seafood",
                "badge": "Know then buy",
                "description": "Turn “I do not know how to choose or cook fish” into simple buying guidance: species, fishing method, and season, so shoppers feel confident and vendors can explain good catches clearly."
            },
            {
                "tone": "orange",
                "href": "/pages/map.html",
                "number": "02",
                "title": "Seafood Map",
                "subtitle": "Find stalls, restaurants, and community spots that bring good catches closer",
                "badge": "Buy nearby",
                "description": "Partner stalls, restaurants, communities, and campuses are shown on the map with recommended species, cooking ideas, and purchase feedback."
            },
            {
                "tone": "pink",
                "href": "/pages/sustainability.html",
                "number": "03",
                "title": "AR Missions",
                "subtitle": "Learn labels with game-like tasks, photo sharing, and purchase feedback",
                "badge": "Learn by playing",
                "description": "Traffic lights, origin stories, and fishing-method knowledge become badge missions that help younger visitors stop, learn, choose, and share."
            }
        ],
        "stats": [
            {
                "value": "3 sec",
                "label": "Read fish status"
            },
            {
                "value": "No app",
                "label": "Scan and use"
            },
            {
                "value": "Feedback",
                "label": "Learn what people choose"
            }
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
    document.title = currentLang === 'en'
      ? 'FishFull | Choose seafood with confidence'
      : 'FishFull 漁有料｜買對一條魚，也能讓海更有魚';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', text.intro);
  }

  function render() {
    var root = document.getElementById('root');
    if (!root) return;

    var currentLang = lang();
    var text = copy[currentLang];
    setMeta(text, currentLang);

    root.innerHTML = [
      '<div class="page-home">',
        '<header class="site-nav" aria-label="Main navigation">',
          '<a class="brand-mark" href="/" aria-label="' + escapeHtml(text.brand) + '">',
            '<span class="brand-sun" aria-hidden="true"></span>',
            '<span class="brand-text">',
              '<span class="brand-kicker">' + escapeHtml(text.kicker) + '</span>',
              '<strong>' + escapeHtml(text.brand) + '</strong>',
            '</span>',
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
            '<div class="coast-sky" aria-hidden="true">',
              '<span class="static-sun"></span>',
              '<span class="cloud cloud-one"></span>',
              '<span class="cloud cloud-two"></span>',
            '</div>',
            '<div class="coast-water" aria-hidden="true"></div>',
            '<div class="coast-sand" aria-hidden="true"></div>',
            '<div class="coast-card">',
              '<h2>' + escapeHtml(text.visualTitle) + '</h2>',
              '<p>' + escapeHtml(text.visualText) + '</p>',
              '<div class="coast-tags">' + tagsTemplate(text.visualTags) + '</div>',
            '</div>',
          '</section>',
          '<section class="route-panel" aria-labelledby="route-title">',
            '<div class="route-heading">',
              '<p class="eyebrow">SELECT ROUTE</p>',
              '<h2 id="route-title">' + escapeHtml(text.actionTitle) + '</h2>',
              '<p>' + escapeHtml(text.actionHint) + '</p>',
            '</div>',
            '<div class="route-grid">' + actionsTemplate(text.actions) + '</div>',
          '</section>',
        '</main>',
      '</div>'
    ].join('');
  }

  function goTo(href) {
    if (href) window.location.href = href;
  }

  document.addEventListener('click', function (event) {
    var input = event.target.closest && event.target.closest('input[type="button"][data-href]');
    if (input) {
      goTo(input.getAttribute('data-href'));
      return;
    }

    var card = event.target.closest && event.target.closest('.route-card[data-href]');
    if (card) goTo(card.getAttribute('data-href'));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var card = event.target.closest && event.target.closest('.route-card[data-href]');
    if (!card || event.target.matches('input, button, a')) return;
    event.preventDefault();
    goTo(card.getAttribute('data-href'));
  });

  document.addEventListener('scm-language-change', render);
  render();
})();
