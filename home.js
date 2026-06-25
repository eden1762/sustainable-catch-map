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
        "eyebrow": "掃碼選魚・看燈號・零失敗料理・10 秒回饋",
        "headline": "買對一條魚，也能讓海更有魚",
        "intro": "FishFull 漁有料是一個掃 QR Code 就能用的買魚小幫手：用紅黃綠燈看懂魚種狀態，搭配漁法、產地與零失敗料理，讓想買友善海鮮的人少一點焦慮、多一點行動。",
        "noSpin": "最短路線：掃 QR → 看紅黃綠燈 → 選零失敗食譜 → 到合作點購買 → 留 10 秒回饋。",
        "visualTitle": "一條好魚的低碳循環",
        "visualText": "消費者敢買，魚販好介紹，漁業夥伴看見需求，社區與校園把行動擴散出去。",
        "visualTags": [
            "掃碼即用",
            "市場好讀",
            "買後可量測"
        ],
        "actionTitle": "今天先完成哪一步？",
        "actionHint": "把網站入口收斂成三個真實行動：先懂怎麼選、找到哪裡買、用小任務降低料理與標籤焦慮。",
        "actions": [
            {
                "tone": "blue",
                "href": "/pages/about.html",
                "number": "01",
                "title": "先懂怎麼選",
                "subtitle": "用紅黃綠燈與漁法故事，先把魚看懂",
                "badge": "少踩雷",
                "description": "把「不知道怎麼挑、怎麼煮」變成簡單判斷：看魚種、看漁法、看季節，再用零失敗料理讓第一次購買更有把握。"
            },
            {
                "tone": "orange",
                "href": "/pages/map.html",
                "number": "02",
                "title": "去附近買魚",
                "subtitle": "找魚攤、餐廳與社區合作點，把好魚帶回家",
                "badge": "直接行動",
                "description": "把合作魚攤、餐廳、社區與校園標在地圖上，搭配推薦魚種、料理建議與購買回饋，讓好選擇更容易被真的買走。"
            },
            {
                "tone": "pink",
                "href": "/pages/sustainability.html",
                "number": "03",
                "title": "玩任務學標籤",
                "subtitle": "用遊戲感學會看標籤，拍照分享再完成購買回饋",
                "badge": "玩中學",
                "description": "把紅黃綠燈、產地故事、漁法知識做成徽章任務，讓年輕人願意停下來、懂得選，也願意揪朋友一起完成低碳好魚任務。"
            }
        ],
        "stats": [
            {
                "value": "3秒",
                "label": "看懂魚種狀態"
            },
            {
                "value": "1條魚",
                "label": "先跑最小實測"
            },
            {
                "value": "10秒",
                "label": "買後留下回饋"
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
        "eyebrow": "Scan · Read traffic lights · Cook with confidence · Leave feedback",
        "headline": "Choose the right fish, and help keep the ocean full",
        "intro": "FishFull is a QR Code seafood helper for real buying moments. Shoppers read traffic-light fish status, fishing method, origin, and zero-failure cooking ideas, so sustainable seafood feels less risky and more doable.",
        "noSpin": "Shortest path: scan QR → read traffic lights → choose an easy recipe → buy at a partner spot → leave 10-second feedback.",
        "visualTitle": "One good-fish low-carbon loop",
        "visualText": "Shoppers buy with confidence, vendors explain clearly, fisheries partners see demand, and communities or campuses spread the action.",
        "visualTags": [
            "Scan to use",
            "Market friendly",
            "Purchase measurable"
        ],
        "actionTitle": "Which step will you take today?",
        "actionHint": "The homepage now points to three real actions: understand the choice, find where to buy, and use missions to reduce label and cooking anxiety.",
        "actions": [
            {
                "tone": "blue",
                "href": "/pages/about.html",
                "number": "01",
                "title": "Learn how to choose",
                "subtitle": "Read traffic lights and fishing stories before buying",
                "badge": "Less guesswork",
                "description": "Turn “I do not know how to choose or cook fish” into simple judgment: species, method, season, and a zero-failure recipe for the first purchase."
            },
            {
                "tone": "orange",
                "href": "/pages/map.html",
                "number": "02",
                "title": "Buy nearby",
                "subtitle": "Find stalls, restaurants, and community spots that bring good catches closer",
                "badge": "Take action",
                "description": "Partner stalls, restaurants, communities, and campuses are shown on the map with recommended species, cooking ideas, and purchase feedback so good choices are actually bought."
            },
            {
                "tone": "pink",
                "href": "/pages/sustainability.html",
                "number": "03",
                "title": "Play label missions",
                "subtitle": "Learn labels with game-like tasks, photo sharing, and purchase feedback",
                "badge": "Learn by playing",
                "description": "Traffic lights, origin stories, and fishing-method knowledge become badge missions that help younger visitors stop, learn, choose, and invite friends into low-carbon seafood action."
            }
        ],
        "stats": [
            {
                "value": "3 sec",
                "label": "Read fish status"
            },
            {
                "value": "1 fish",
                "label": "Start with the smallest test"
            },
            {
                "value": "10 sec",
                "label": "Leave purchase feedback"
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
