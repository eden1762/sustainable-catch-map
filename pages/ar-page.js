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
      loopEyebrow: '遊戲路線',
      loopTitle: '四步驟玩完一輪，從看魚直接接到購買行動',
      loopBody: 'AR 不是只看帥圖，而是把「看懂魚、敢開口、知道怎麼煮、願意回饋」串成一條短路線。手機版這一段放在魚模型下方，不會遮住完整魚身。',
      loopSteps: [
        { number: '01', title: '選魚', body: '先挑赤鯮、花腹鯖或鬼頭刀，看完整魚身和重點特徵。' },
        { number: '02', title: '看燈號', body: '用綠、黃、紅判斷今天要安心買、多問一句，還是先換選擇。' },
        { number: '03', title: '問魚販', body: '直接帶一句好懂問法到魚攤，讓魚販更快介紹來源、大小和料理方式。' },
        { number: '04', title: '煮完回饋', body: '買回家接零失敗食譜，吃完用十秒回饋幫好通路加分。' }
      ],
      missionEyebrow: '魚攤 30 秒任務',
      missionTitle: '看完魚身，照著三張任務卡做就不慌',
      missionBody: 'AR 遊戲不是只拿來拍照；它要幫消費者在魚攤前快速看懂、敢問、敢買，也讓魚販更好介紹好魚。',
      missionCards: [
        { tone: 'green', tag: '綠燈', title: '可以安心問下一步', body: '魚眼清亮、魚鰓鮮紅、魚身有光澤時，先問來源與今日建議料理。', ask: '這條今天最適合清蒸還是乾煎？', href: '/pages/recipes.html', action: '接零失敗食譜' },
        { tone: 'yellow', tag: '黃燈', title: '先多問一句再決定', body: '看起來不錯但不確定來源、大小或保存時間時，請魚販補一句重點。', ask: '這條是今天進的嗎？兩個人吃會不會太多？', href: '/pages/fish.html', action: '看主推魚資訊' },
        { tone: 'red', tag: '紅燈', title: '不懂就先別硬買', body: '魚身乾、氣味重、說不清來源，先換一條或改買更熟悉的魚。', ask: '有沒有更適合今天煮湯或香煎的選擇？', href: '/pages/map.html', action: '找友善通路' }
      ],
      handoffEyebrow: '魚販接球',
      handoffTitle: '把手機拿給魚販看，30 秒完成介紹',
      handoffBody: '消費者不用尷尬背知識；魚販也不用從零開始說明。AR 看完魚後，照著三句話就能把來源、料理、份量講清楚，讓好魚更容易成交。',
      handoffCards: [
        { icon: '🌊', title: '來源一句話', body: '今天這批從哪裡來？適合想支持在地漁業的人嗎？' },
        { icon: '🧊', title: '鮮度一句話', body: '魚眼、魚鰓、魚身哪裡最該看？請魚販直接指給你看。' },
        { icon: '🍽️', title: '份量一句話', body: '一人、兩人、家庭晚餐各買多大？避免買太多也避免不夠吃。' }
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
      loopEyebrow: 'Game route',
      loopTitle: 'Finish one quick round, from viewing the fish to buying with confidence',
      loopBody: 'AR is not just a cool visual. It turns seeing, asking, cooking, and feedback into one short route. On mobile, this stays below the fish model so the full body remains visible.',
      loopSteps: [
        { number: '01', title: 'Pick a fish', body: 'Choose crimson sea bream, Pacific mackerel, or mahi-mahi and view the full body first.' },
        { number: '02', title: 'Read the light', body: 'Use green, yellow, and red cues to decide whether to buy, ask more, or switch fish.' },
        { number: '03', title: 'Ask the fishmonger', body: 'Bring one clear question to the stall so origin, size, and cooking style are easier to explain.' },
        { number: '04', title: 'Cook and feedback', body: 'Open an easy recipe after purchase, then leave quick feedback to support better seafood spots.' }
      ],
      missionEyebrow: '30-second fish-stall mission',
      missionTitle: 'After viewing the fish, follow three cards and buy with less guesswork',
      missionBody: 'The AR game is not just a photo moment. It helps shoppers read the fish, ask better questions, and gives fishmongers an easier way to explain good seafood.',
      missionCards: [
        { tone: 'green', tag: 'Green', title: 'Good to ask the next step', body: 'Clear eyes, red gills, and glossy skin? Ask about origin and the best cooking style today.', ask: 'Is this better steamed or pan-fried today?', href: '/pages/recipes.html', action: 'Open easy recipes' },
        { tone: 'yellow', tag: 'Yellow', title: 'Ask one more question first', body: 'Looks okay but origin, size, or holding time feels unclear? Ask the fishmonger for one practical detail.', ask: 'Did this arrive today, and is it enough for two?', href: '/pages/fish.html', action: 'View featured fish' },
        { tone: 'red', tag: 'Red', title: 'Do not force the buy', body: 'Dry body, strong smell, or unclear origin? Switch fish or choose something more familiar.', ask: 'Do you have a better fish for soup or pan-searing?', href: '/pages/map.html', action: 'Find friendly channels' }
      ],
      handoffEyebrow: 'Fishmonger handoff',
      handoffTitle: 'Show the phone and get a 30-second explanation',
      handoffBody: 'Shoppers do not need to memorize seafood facts, and fishmongers do not need to start from zero. After the AR fish view, these three prompts make origin, freshness, and serving size easier to explain.',
      handoffCards: [
        { icon: '🌊', title: 'Origin in one line', body: 'Where did this batch come from, and is it a good pick for local-seafood supporters?' },
        { icon: '🧊', title: 'Freshness in one line', body: 'Which eye, gill, or skin detail should I look at? Ask the fishmonger to point it out.' },
        { icon: '🍽️', title: 'Serving size in one line', body: 'What size works for one person, two people, or a family dinner without overbuying?' }
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

  function playLoop(text) {
    return [
      '<section class="content-section ar-game-loop">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(text.loopEyebrow) + '</p>',
          '<h2>' + esc(text.loopTitle) + '</h2>',
          '<p>' + esc(text.loopBody) + '</p>',
        '</div>',
        '<div class="ar-loop-track" aria-label="' + esc(lang() === 'en' ? 'AR game route' : 'AR 遊戲路線') + '">',
          list(text.loopSteps, function (step) {
            return [
              '<article class="ar-loop-step">',
                '<span>' + esc(step.number) + '</span>',
                '<h3>' + esc(step.title) + '</h3>',
                '<p>' + esc(step.body) + '</p>',
              '</article>'
            ].join('');
          }),
        '</div>',
      '</section>'
    ].join('');
  }

  function mission(text) {
    return [
      '<section class="content-section ar-market-mission" id="fishfull-mission">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(text.missionEyebrow) + '</p>',
          '<h2>' + esc(text.missionTitle) + '</h2>',
          '<p>' + esc(text.missionBody) + '</p>',
        '</div>',
        '<div class="ar-mission-grid">',
          list(text.missionCards, function (card) {
            return [
              '<article class="ar-mission-card mission-' + esc(card.tone) + '">',
                '<span class="mission-tag">' + esc(card.tag) + '</span>',
                '<h3>' + esc(card.title) + '</h3>',
                '<p>' + esc(card.body) + '</p>',
                '<div class="mission-ask"><span>Q</span><strong>' + esc(card.ask) + '</strong></div>',
                '<a href="' + esc(card.href) + '">' + esc(card.action) + ' →</a>',
              '</article>'
            ].join('');
          }),
        '</div>',
      '</section>'
    ].join('');
  }

  function handoff(text) {
    return [
      '<section class="content-section ar-vendor-handoff">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(text.handoffEyebrow) + '</p>',
          '<h2>' + esc(text.handoffTitle) + '</h2>',
          '<p>' + esc(text.handoffBody) + '</p>',
        '</div>',
        '<div class="ar-handoff-grid">',
          list(text.handoffCards, function (card) {
            return '<article class="ar-handoff-card"><span aria-hidden="true">' + esc(card.icon) + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.body) + '</p></article>';
          }),
        '</div>',
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
          playLoop(text),
          mission(text),
          handoff(text),
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