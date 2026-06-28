(function () {
  'use strict';

  var copy = {
    zh: {
      brandSmall: 'SUSTAINABLE CATCH MAP',
      brand: 'FishFull 漁有料',
      nav: [
        { label: '首頁', href: '/' },
        { label: 'AR 遊戲', href: '/ar.html' },
        { label: '主推魚', href: '/pages/fish.html' },
        { label: '去附近買魚', href: '/pages/map.html' },
        { label: '零失敗食譜', href: '/pages/recipes.html' },
        { label: '十秒回饋', href: '/pages/feedback.html' }
      ],
      metaTitle: 'FishFull 漁有料｜AR 遊戲',
      description: 'FishFull 漁有料 AR 遊戲：手機先看到完整 3D 魚，再開相機把魚放進市場、餐桌或活動現場，接著看新鮮度、問法、料理與回饋。',
      eyebrow: 'AR 遊戲｜先看魚，再敢買',
      headline: '手機先看到完整 3D 魚，買魚不再靠猜',
      lead: '選一種魚，先在手機上看完整魚身、眼睛、魚鰓和魚紋；想更有臨場感，就按「開相機看魚」或「放到現場」，把魚放進市場、餐桌或活動攤位。',
      badges: ['完整魚身優先', '手機可開相機', '一鍵放到現場', '買魚問法好懂'],
      primaryCta: '直接看 3D 魚',
      secondaryCta: '找附近買魚',
      visualTitle: 'AR 看魚三步驟',
      visualBody: '看魚身、開相機、問魚販。不用裝懂，也能買得更安心。',
      visualSteps: ['看完整魚身', '開相機合照', '帶著問法去買'],
      arEyebrow: '主推功能',
      arTitle: '先把魚放大看清楚',
      arBody: '這一區把 3D 魚放在主畫面，不讓卡片和按鈕遮住魚身。魚販介紹、料理提示與回饋入口會放在魚框下方，手機看起來更乾淨。',
      labels: [
        { title: '赤鯮', body: '紅亮魚身、肉細清甜，先看來源與漁法，再決定清蒸或乾煎。' },
        { title: '花腹鯖', body: '藍背銀腹、油脂香，適合鹽烤或乾煎，日常餐桌很可以。' },
        { title: '鬼頭刀', body: '肉厚有存在感，香煎、烤魚、餐盒料理都好搭。' }
      ],
      guideEyebrow: '現場怎麼用',
      guideTitle: '看完魚，下一步就能問、買、煮、回饋',
      guideBody: '給漁產消費者、魚販、漁業夥伴和年輕人使用：每個按鈕都接到真實行動，不用滑很久。',
      guideCards: [
        { icon: '👀', title: '先看完整魚身', body: '魚身要在手機畫面中間，不被卡片擋住。看眼睛、魚鰓、魚紋與整尾鮮度。' },
        { icon: '📱', title: '開相機放現場', body: '按「開相機看魚」可用手機相機做現場合照；支援的手機也能按「放到現場」。' },
        { icon: '🗣️', title: '帶一句去問', body: '例如：今天這條適合清蒸還是乾煎？兩個人吃夠嗎？來源說得清楚嗎？' },
        { icon: '🍳', title: '買了就接食譜', body: '選清蒸、乾煎、煮湯等簡單做法，讓新手也能把魚煮好。' }
      ],
      footer: '選魚、買魚、料理、回饋，讓好魚真的被帶回家。',
      openText: '打開'
    },
    en: {
      brandSmall: 'SUSTAINABLE CATCH MAP',
      brand: 'FishFull',
      nav: [
        { label: 'Home', href: '/' },
        { label: 'AR Game', href: '/ar.html' },
        { label: 'Featured Fish', href: '/pages/fish.html' },
        { label: 'Buy Nearby', href: '/pages/map.html' },
        { label: 'Easy Recipes', href: '/pages/recipes.html' },
        { label: 'Feedback', href: '/pages/feedback.html' }
      ],
      metaTitle: 'FishFull | AR fish game',
      description: 'FishFull AR game: view a full 3D fish on mobile, open the camera, place the fish in a market or dinner-table scene, then check freshness, questions, recipes, and feedback.',
      eyebrow: 'AR game | See the fish first',
      headline: 'See the whole 3D fish before you buy',
      lead: 'Pick a fish, view the full body, eyes, gills, and skin pattern on your phone. Want the real-scene vibe? Tap “Open Camera” or “View in AR” and place the fish at the market, dinner table, or booth.',
      badges: ['Full fish first', 'Mobile camera ready', 'View in AR', 'Market-friendly wording'],
      primaryCta: 'See the 3D fish',
      secondaryCta: 'Find a seafood spot',
      visualTitle: 'Three-step AR fish check',
      visualBody: 'See the fish, open the camera, ask the vendor. No awkward seafood guessing.',
      visualSteps: ['View the whole fish', 'Open camera shot', 'Ask better questions'],
      arEyebrow: 'Main feature',
      arTitle: 'Make the fish easy to see first',
      arBody: 'The 3D fish now owns the main frame, so cards and buttons do not block the body. Vendor talk, cooking tips, and feedback links stay below the fish frame for a cleaner mobile flow.',
      labels: [
        { title: 'Crimson Sea Bream', body: 'Red-toned, delicate, and great steamed or pan-fried. Check origin and catch method first.' },
        { title: 'Pacific Mackerel', body: 'Blue back, silver belly, rich oil, and easy to grill or pan-fry for everyday meals.' },
        { title: 'Mahi-mahi', body: 'Firm, bright, and great for searing, grilling, and seafood bowls.' }
      ],
      guideEyebrow: 'How to use it on-site',
      guideTitle: 'After viewing the fish, ask, buy, cook, and leave feedback',
      guideBody: 'Built for seafood shoppers, vendors, fisheries teams, and younger buyers: every tap leads to a real next step.',
      guideCards: [
        { icon: '👀', title: 'View the full fish', body: 'The fish stays centered on mobile, not buried under cards. Check eyes, gills, skin pattern, and overall look.' },
        { icon: '📱', title: 'Open the camera', body: 'Tap “Open Camera” for a live phone shot. Supported phones can also tap “View in AR.”' },
        { icon: '🗣️', title: 'Ask one clear question', body: 'Try: is this better steamed or pan-fried? Is it enough for two? Can you tell me today’s origin?' },
        { icon: '🍳', title: 'Cook it with confidence', body: 'Jump to simple steaming, pan-frying, or soup recipes so first-time buyers do not get stuck.' }
      ],
      footer: 'Choose fish, buy fish, cook fish, and bring better seafood home.',
      openText: 'Open'
    }
  };

  function lang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : 'zh';
  }

  function esc(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function list(items, fn) {
    return items.map(fn).join('');
  }

  function setMeta(text, currentLang) {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-Hant';
    document.title = text.metaTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', text.description);
  }

  function nav(text, currentLang) {
    return [
      '<header class="topbar">',
        '<a class="brand" href="/">',
          '<span class="brand-symbol" aria-hidden="true">◐</span>',
          '<span><small>' + esc(text.brandSmall) + '</small><strong>' + esc(text.brand) + '</strong></span>',
        '</a>',
        '<nav class="topnav" aria-label="' + esc(currentLang === 'en' ? 'Main navigation' : '主選單') + '">',
          list(text.nav, function (item) {
            return '<a href="' + esc(item.href) + '"' + (item.href === '/ar.html' ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a>';
          }),
        '</nav>',
        '<div class="nav-actions">',
          '<a class="circle-link" href="https://www.instagram.com/fishfull_2025/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>',
          '<button class="circle-link language-toggle" type="button" aria-label="' + esc(currentLang === 'en' ? '切換成中文' : '切換成英文') + '"><span data-lang-icon>' + esc(currentLang === 'en' ? '中文' : 'EN') + '</span></button>',
        '</div>',
      '</header>'
    ].join('');
  }

  function hero(text) {
    return [
      '<section class="page-hero ar-game-hero">',
        '<div class="hero-text">',
          '<p class="eyebrow">' + esc(text.eyebrow) + '</p>',
          '<h1>' + esc(text.headline) + '</h1>',
          '<p>' + esc(text.lead) + '</p>',
          '<div class="badge-row">' + list(text.badges, function (badge) { return '<span>' + esc(badge) + '</span>'; }) + '</div>',
          '<div class="ar-hero-actions">',
            '<a class="hero-link hero-link-primary" href="/ar.html#fishfull-ar-stage">' + esc(text.primaryCta) + ' →</a>',
            '<a class="hero-link" href="/pages/map.html">' + esc(text.secondaryCta) + '</a>',
          '</div>',
        '</div>',
        '<div class="hero-card ar-phone-card" aria-hidden="true">',
          '<span class="sun-dot"></span>',
          '<div class="phone-fish">',
            '<span class="phone-fish-tail"></span><span class="phone-fish-body"></span><span class="phone-fish-eye"></span>',
          '</div>',
          '<strong>' + esc(text.visualTitle) + '</strong>',
          '<em>' + esc(text.visualBody) + '</em>',
          '<div class="phone-step-row">' + list(text.visualSteps, function (step) { return '<span>' + esc(step) + '</span>'; }) + '</div>',
        '</div>',
      '</section>'
    ].join('');
  }

  function arSection(text) {
    return [
      '<section class="content-section sustainability-layout ar-focus-layout" id="fishfull-ar-stage">',
        '<div class="sustainability-copy ar-side-copy">',
          '<div class="section-heading">',
            '<p class="eyebrow">' + esc(text.arEyebrow) + '</p>',
            '<h2>' + esc(text.arTitle) + '</h2>',
            '<p>' + esc(text.arBody) + '</p>',
          '</div>',
          '<div class="label-grid">',
            list(text.labels, function (item) {
              return '<article class="label-card"><h3>' + esc(item.title) + '</h3><p>' + esc(item.body) + '</p></article>';
            }),
          '</div>',
        '</div>',
        '<section class="model-stage" aria-label="' + esc(lang() === 'en' ? '3D fish and AR camera' : '3D 魚與 AR 相機') + '"></section>',
      '</section>'
    ].join('');
  }

  function guide(text) {
    return [
      '<section class="content-section ar-quick-guide">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(text.guideEyebrow) + '</p>',
          '<h2>' + esc(text.guideTitle) + '</h2>',
          '<p>' + esc(text.guideBody) + '</p>',
        '</div>',
        '<div class="info-grid">',
          list(text.guideCards, function (card) {
            return '<article class="info-card"><span class="card-icon" aria-hidden="true">' + esc(card.icon) + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.body) + '</p></article>';
          }),
        '</div>',
      '</section>'
    ].join('');
  }

  function render() {
    var currentLang = lang();
    var text = copy[currentLang] || copy.zh;
    var root = document.getElementById('root');
    if (!root) return;
    setMeta(text, currentLang);
    root.innerHTML = [
      '<div class="page-shell page-sustainability page-ar-game">',
        nav(text, currentLang),
        '<main>',
          hero(text),
          arSection(text),
          guide(text),
        '</main>',
        '<footer class="site-footer"><strong>FishFull 漁有料</strong><span>' + esc(text.footer) + '</span></footer>',
      '</div>'
    ].join('');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  document.addEventListener('scm-language-change', render);
})();
