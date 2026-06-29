(function () {
  'use strict';

  var copy = {
    zh: {
      eyebrow: '買魚小幫手',
      title: '下一步不只是一句話，而是今天就能試買的路線',
      body: '先掃 QR、看 AR 魚身、挑一條主推魚、找合作點、接一份零失敗食譜。FishFull 把這些步驟做成可點入口，讓消費者站在魚攤前不用猜，魚販也更好介紹。',
      cards: [
        ['掃碼開場', '魚攤、餐桌或社群貼文一掃就能進入，先看燈號、來源與料理方向。', '/pages/qr.html'],
        ['AR 選魚小教練', '手機先看完整 3D 魚身，再用綠／黃／紅燈號判斷，現場比較敢問也比較敢買。', '/pages/ar-game.html'],
        ['主推魚', '先看今天推薦哪一條，包含口感、份量、問法與料理搭配。', '/pages/fish.html'],
        ['去附近買魚', '找市場、魚市、餐廳與漁港合作點，把知道變成真的去買。', '/pages/map.html'],
        ['零失敗食譜', '清蒸、乾煎、煮湯都拆成簡單步驟，第一次煮魚也不容易翻車。', '/pages/recipes.html']
      ],
      cta: '從「掃碼 → AR 看魚 → 主推魚 → 合作點 → 食譜」走一輪，就能把不知道怎麼買，變成今天可以下手的一餐。'
    },
    en: {
      eyebrow: 'Seafood buying helper',
      title: 'The next step is now a real buying route',
      body: 'Scan a QR, view the AR fish, pick one featured catch, find a partner spot, and cook with an easy recipe. FishFull turns seafood shopping into a clear route for shoppers and vendors.',
      cards: [
        ['Scan to Start', 'Open the guide from a stall, table, or social post and see color guidance, source notes, and cooking direction.', '/pages/qr.html'],
        ['AR Fish Coach', 'View the full 3D fish on your phone, then use green/yellow/red guidance to ask better and buy smarter.', '/pages/ar-game.html'],
        ['Featured Fish', 'See one recommended fish with taste, portion, buying questions, and recipe pairing.', '/pages/fish.html'],
        ['Buy Nearby', 'Find partner markets, restaurants, fish markets, and ports.', '/pages/map.html'],
        ['Easy Recipes', 'Steam, pan-fry, or make soup with low-fail steps.', '/pages/recipes.html']
      ],
      cta: 'Run through “scan → AR fish → featured catch → partner spot → recipe” and turn seafood confusion into tonight’s dinner plan.'
    }
  };

  function currentLang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function escapeHtml(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function injectStyle() {
    if (document.getElementById('fishfull-iteration-style')) return;
    var style = document.createElement('style');
    style.id = 'fishfull-iteration-style';
    style.textContent = [
      '.fishfull-loop{grid-column:1/-1;margin:clamp(18px,4vw,34px) auto 0;width:100%;padding:clamp(18px,4vw,34px);border-radius:32px;background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(224,247,255,.86));box-shadow:0 24px 70px rgba(38,95,120,.16);border:1px solid rgba(66,148,178,.18)}',
      '.fishfull-loop__eyebrow{margin:0 0 10px;font-size:.82rem;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:#0f7898}',
      '.fishfull-loop h2{margin:0;font-size:clamp(1.8rem,4vw,3.1rem);line-height:1.08;color:#12354a}',
      '.fishfull-loop__body{max-width:900px;margin:14px 0 0;color:#3b5967;font-size:1.03rem;line-height:1.85;font-weight:700}',
      '.fishfull-loop__grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-top:22px}',
      '.fishfull-loop__card{display:block;padding:18px;border-radius:24px;background:rgba(255,255,255,.82);border:1px solid rgba(31,115,143,.12);text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease}',
      '.fishfull-loop__card:hover{transform:translateY(-3px);box-shadow:0 18px 36px rgba(31,92,120,.13)}',
      '.fishfull-loop__card:focus-visible{outline:3px solid rgba(15,120,152,.45);outline-offset:4px}',
      '.fishfull-loop__card strong{display:block;margin-bottom:8px;color:#0d4861;font-size:1.08rem}',
      '.fishfull-loop__card p{margin:0;color:#46616d;line-height:1.65;font-weight:650}',
      '.fishfull-loop__card[href$="ar-game.html"]{background:linear-gradient(150deg,rgba(255,255,255,.94),rgba(223,246,255,.92));border-color:rgba(16,132,168,.28);box-shadow:inset 0 0 0 1px rgba(255,255,255,.58)}',
      '.fishfull-loop__cta{margin:20px 0 0;padding:14px 16px;border-radius:18px;background:#12354a;color:#fff;font-weight:900;line-height:1.55}',
      '@media (max-width:1100px){.fishfull-loop__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:860px){.fishfull-loop__grid{grid-template-columns:1fr}.fishfull-loop{border-radius:24px}.fishfull-loop__card{min-height:auto}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderLoop() {
    var homeRoot = document.querySelector('.page-home .home-hero');
    if (!homeRoot) return;
    injectStyle();
    var text = copy[currentLang()] || copy.zh;
    var existing = document.getElementById('fishfull-behavior-loop');
    var html = [
      '<section class="fishfull-loop" id="fishfull-behavior-loop" aria-labelledby="fishfull-loop-title">',
        '<p class="fishfull-loop__eyebrow">' + escapeHtml(text.eyebrow) + '</p>',
        '<h2 id="fishfull-loop-title">' + escapeHtml(text.title) + '</h2>',
        '<p class="fishfull-loop__body">' + escapeHtml(text.body) + '</p>',
        '<div class="fishfull-loop__grid">',
          text.cards.map(function (item) {
            return '<a class="fishfull-loop__card" href="' + escapeHtml(item[2]) + '"><strong>' + escapeHtml(item[0]) + '</strong><p>' + escapeHtml(item[1]) + '</p></a>';
          }).join(''),
        '</div>',
        '<p class="fishfull-loop__cta">' + escapeHtml(text.cta) + '</p>',
      '</section>'
    ].join('');
    if (existing) existing.outerHTML = html;
    else homeRoot.insertAdjacentHTML('beforeend', html);
  }

  function scheduleRender() {
    window.requestAnimationFrame(function () {
      window.setTimeout(renderLoop, 0);
    });
  }

  document.addEventListener('DOMContentLoaded', scheduleRender);
  document.addEventListener('scm-language-change', scheduleRender);
  scheduleRender();
})();