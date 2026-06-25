(function () {
  'use strict';

  var copy = {
    zh: {
      eyebrow: '低碳好魚循環',
      title: '掃碼不是終點，重點是讓好魚真的被買走',
      body: 'FishFull 把一件事做到最短：掃 QR Code 看紅黃綠燈、選一種零失敗料理、在店家完成購買，再用 10 秒回饋讓魚販與漁業夥伴知道哪種友善漁獲更有市場。這不是只衝流量，而是把「看懂」變成「願意買」。',
      loop: [
        ['消費者', '少踩雷：看懂魚種狀態、漁法、產地與料理方式，敢把友善海鮮帶回家。'],
        ['魚販 / 餐飲店', '好介紹：用 QR 牌卡說清楚好魚故事，記錄詢問、試買與回購狀況。'],
        ['漁業從業者', '有誘因：看見低碳漁法魚種的需求變化，讓好做法有機會被市場支持。'],
        ['推廣者 / 年輕人', '玩中學：用地圖、AR 任務、拍照分享，把永續選魚變成可以揪朋友一起做的行動。']
      ],
      measuresTitle: '這一輪開始量「行為改變」',
      measures: ['QR 掃描數', '食譜點擊', '友善魚種詢問量', '實際購買 / 回購', '店家觀察紀錄', '消費者 10 秒回饋'],
      evidenceTitle: '現場證據放哪裡？',
      evidence: ['MOU / 合作意向', '魚販與漁業訪談紀錄', '市場或餐廳現場照片', '社區與校園試用回饋', '6–11 月每月進度截圖'],
      cta: '下一步：到合作點位放 QR Code 牌卡，先跑一條魚、一家店、一份食譜的最小實測。',
      pulseTitle: '10 秒買魚回饋',
      pulseBody: '先不用做很重的問卷。現場只問三件事，就能判斷使用者是不是從「看看而已」往「真的購買」前進。',
      pulseQuestions: [
        ['01', '今天有買這條魚嗎？', '已購買 / 考慮中 / 沒買，想先學料理'],
        ['02', '是什麼讓你敢買？', '紅黃綠燈、店家推薦、零失敗食譜、價格或產地'],
        ['03', '下次還會回來買嗎？', '會 / 可能會 / 需要更清楚的料理或價格資訊']
      ],
      pulseNote: '店家只要每天記錄 3–5 筆，就能比較 QR 牌卡前後的詢問量、試買量與回購感覺，讓永續不只好聽，而是有生意感。',
      pulseButton: '我買了，留下 10 秒回饋'
    },
    en: {
      eyebrow: 'Low-carbon seafood loop',
      title: 'A scan is not the goal. Real purchase change is.',
      body: 'FishFull keeps the path short: scan a QR Code, read traffic-light seafood guidance, pick a zero-failure recipe, buy at the store, then leave 10-second feedback so vendors and fisheries partners know which friendly catches have real demand.',
      loop: [
        ['Shoppers', 'Choose with less anxiety: species status, method, origin, and cooking ideas are clear at the buying moment.'],
        ['Vendors / restaurants', 'Explain better with QR cards, then track questions, trial purchases, and repeat demand.'],
        ['Fisheries workers', 'See whether low-carbon methods create demand, so better practices get market support.'],
        ['Promoters / young users', 'Learn by doing through maps, AR missions, photos, and shareable buying actions.']
      ],
      measuresTitle: 'Measure behavior, not only traffic',
      measures: ['QR scans', 'Recipe clicks', 'Friendly-species questions', 'Purchases / repeat buys', 'Store notes', '10-second shopper feedback'],
      evidenceTitle: 'Field proof slots',
      evidence: ['MOU / partner intent', 'Vendor and fisheries interviews', 'Market or restaurant photos', 'Community and campus pilot feedback', 'June–November monthly progress screenshots'],
      cta: 'Next move: place QR cards at partner points and test one fish, one store, and one recipe first.',
      pulseTitle: '10-second purchase feedback',
      pulseBody: 'Skip heavy surveys at the start. Ask only three questions on site to see whether users move from “just looking” to real purchase action.',
      pulseQuestions: [
        ['01', 'Did you buy this fish today?', 'Bought / Thinking / Not yet, I need cooking help'],
        ['02', 'What made you more ready to buy?', 'Traffic light, vendor tip, zero-failure recipe, price, or origin'],
        ['03', 'Would you come back for it?', 'Yes / Maybe / Need clearer recipe or price info']
      ],
      pulseNote: 'If a store records only 3–5 notes a day, FishFull can compare questions, trial purchases, and repeat-buy signals before and after QR cards. Sustainability becomes useful for business, not just nice words.',
      pulseButton: 'I bought it — leave 10-second feedback'
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
      '.fishfull-loop{margin:clamp(28px,5vw,64px) auto 0;max-width:1120px;padding:clamp(22px,4vw,42px);border-radius:32px;background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(224,247,255,.86));box-shadow:0 24px 70px rgba(38,95,120,.16);border:1px solid rgba(66,148,178,.18)}',
      '.fishfull-loop__eyebrow{margin:0 0 10px;font-size:.82rem;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#0f7898}',
      '.fishfull-loop h2{margin:0;font-size:clamp(1.8rem,4vw,3.1rem);line-height:1.08;color:#12354a}',
      '.fishfull-loop__body{max-width:820px;margin:16px 0 0;color:#3b5967;font-size:1.03rem;line-height:1.85}',
      '.fishfull-loop__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:24px}',
      '.fishfull-loop__card{padding:18px;border-radius:24px;background:rgba(255,255,255,.78);border:1px solid rgba(31,115,143,.12)}',
      '.fishfull-loop__card strong{display:block;margin-bottom:8px;color:#0d4861;font-size:1.05rem}',
      '.fishfull-loop__card p{margin:0;color:#46616d;line-height:1.65}',
      '.fishfull-loop__proof{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}',
      '.fishfull-loop__proof-box{padding:18px;border-radius:24px;background:rgba(255,255,255,.6);border:1px dashed rgba(15,120,152,.25)}',
      '.fishfull-loop__proof-box h3{margin:0 0 12px;color:#12354a;font-size:1.05rem}',
      '.fishfull-loop__chips{display:flex;flex-wrap:wrap;gap:10px}',
      '.fishfull-loop__chips span{padding:8px 12px;border-radius:999px;background:#fff;color:#24576a;font-weight:700;font-size:.9rem;box-shadow:0 8px 20px rgba(31,92,120,.08)}',
      '.fishfull-loop__cta{margin:22px 0 0;padding:14px 16px;border-radius:18px;background:#12354a;color:#fff;font-weight:800;line-height:1.55}',
      '.fishfull-pulse{margin-top:22px;padding:20px;border-radius:26px;background:rgba(255,250,235,.9);border:1px solid rgba(222,151,54,.22)}',
      '.fishfull-pulse h3{margin:0;color:#6a3d09;font-size:1.3rem}',
      '.fishfull-pulse p{margin:10px 0 0;color:#684f2d;line-height:1.7}',
      '.fishfull-pulse__questions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}',
      '.fishfull-pulse__question{padding:14px;border-radius:20px;background:#fff;box-shadow:0 10px 24px rgba(129,84,27,.08)}',
      '.fishfull-pulse__question span{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:#ffefc8;color:#714507;font-weight:900}',
      '.fishfull-pulse__question strong{display:block;margin-top:10px;color:#3b2b16}',
      '.fishfull-pulse__question small{display:block;margin-top:6px;color:#765f3d;line-height:1.5}',
      '.fishfull-pulse__button{display:inline-flex;margin-top:16px;padding:11px 16px;border-radius:999px;background:#f29b2e;color:#fff;text-decoration:none;font-weight:900;box-shadow:0 10px 24px rgba(242,155,46,.24)}',
      '@media (max-width:860px){.fishfull-loop__grid,.fishfull-loop__proof,.fishfull-pulse__questions{grid-template-columns:1fr}.fishfull-loop{border-radius:24px}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderLoop() {
    injectStyle();
    var root = document.querySelector('.page-home .home-hero') || document.querySelector('.page-shell main') || document.querySelector('main') || document.getElementById('root');
    if (!root) return;

    var text = copy[currentLang()];
    var existing = document.getElementById('fishfull-behavior-loop');
    var cards = text.loop.map(function (item) {
      return '<article class="fishfull-loop__card"><strong>' + escapeHtml(item[0]) + '</strong><p>' + escapeHtml(item[1]) + '</p></article>';
    }).join('');
    var measures = text.measures.map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    var evidence = text.evidence.map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    var pulseQuestions = text.pulseQuestions.map(function (item) {
      return '<article class="fishfull-pulse__question"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong><small>' + escapeHtml(item[2]) + '</small></article>';
    }).join('');

    var html = [
      '<section class="fishfull-loop" id="fishfull-behavior-loop" aria-labelledby="fishfull-loop-title">',
        '<p class="fishfull-loop__eyebrow">' + escapeHtml(text.eyebrow) + '</p>',
        '<h2 id="fishfull-loop-title">' + escapeHtml(text.title) + '</h2>',
        '<p class="fishfull-loop__body">' + escapeHtml(text.body) + '</p>',
        '<div class="fishfull-loop__grid">' + cards + '</div>',
        '<div class="fishfull-loop__proof">',
          '<div class="fishfull-loop__proof-box"><h3>' + escapeHtml(text.measuresTitle) + '</h3><div class="fishfull-loop__chips">' + measures + '</div></div>',
          '<div class="fishfull-loop__proof-box"><h3>' + escapeHtml(text.evidenceTitle) + '</h3><div class="fishfull-loop__chips">' + evidence + '</div></div>',
        '</div>',
        '<section class="fishfull-pulse" aria-labelledby="fishfull-pulse-title">',
          '<h3 id="fishfull-pulse-title">' + escapeHtml(text.pulseTitle) + '</h3>',
          '<p>' + escapeHtml(text.pulseBody) + '</p>',
          '<div class="fishfull-pulse__questions">' + pulseQuestions + '</div>',
          '<p>' + escapeHtml(text.pulseNote) + '</p>',
          '<a class="fishfull-pulse__button" href="/pages/map.html#fishfull-osm-map">' + escapeHtml(text.pulseButton) + '</a>',
        '</section>',
        '<p class="fishfull-loop__cta">' + escapeHtml(text.cta) + '</p>',
      '</section>'
    ].join('');

    if (existing) {
      existing.outerHTML = html;
    } else {
      root.insertAdjacentHTML('beforeend', html);
    }
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
