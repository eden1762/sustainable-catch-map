(function () {
  'use strict';

  var SPECIES = {
    crimsonBream: {
      zhTitle: '赤鯮',
      enTitle: 'Crimson Sea Bream',
      zhBody: '紅亮魚身、肉質細緻，適合清蒸、乾煎與宴客餐桌。',
      enBody: 'A red-toned fish with delicate meat, great for steaming or pan-frying.',
      zhLook: '認魚重點：魚身偏紅、眼睛清亮、魚鰓鮮紅，肉細但要先問來源。',
      enLook: 'Look for: red body, clear eyes, bright gills, and ask about origin first.',
      zhStatus: '黃燈：看來源與漁法再下手',
      enStatus: 'Yellow: check origin and fishing method first',
      zhMethod: '現場問法：今天哪裡來？適合清蒸還是乾煎？',
      enMethod: 'Ask: where is it from today, and is it better steamed or pan-fried?',
      zhCook: '料理提示：薑絲清蒸 8～10 分鐘，少調味就能吃出甜味。',
      enCook: 'Cooking tip: steam with ginger for 8–10 minutes and keep seasoning light.',
      zhNext: '下一步：問清楚來源，買完到回饋小卡記一句原因。',
      enNext: 'Next: confirm origin, then leave one quick feedback note after buying.',
      src: '../assets/models/crimson-sea-bream.gltf',
      tone: 'bream',
      orbit: '68deg 80deg 4.1m',
      exposure: '1.08',
      shadow: '1.15'
    },
    mackerel: {
      zhTitle: '花腹鯖',
      enTitle: 'Pacific Mackerel',
      zhBody: '藍背銀腹、油脂香，適合乾煎、鹽烤，也很適合魚販一句話介紹。',
      enBody: 'A blue-backed oily fish, easy to recommend for grilling or pan-frying.',
      zhLook: '認魚重點：藍背銀腹、條紋清楚，摸起來有彈性，適合先推給新手。',
      enLook: 'Look for: blue back, silver belly, clear stripes, and springy flesh.',
      zhStatus: '綠燈：新手友善，適合日常餐桌',
      enStatus: 'Green: beginner-friendly for everyday meals',
      zhMethod: '現場問法：油脂夠嗎？今天適合鹽烤還是乾煎？',
      enMethod: 'Ask: is it fatty enough today, and should I grill or pan-fry it?',
      zhCook: '料理提示：魚身擦乾、鍋熱再下，乾煎到表皮酥就很香。',
      enCook: 'Cooking tip: pat dry, heat the pan first, and sear until the skin is crisp.',
      zhNext: '下一步：直接找買點，買完回報哪句介紹最有用。',
      enNext: 'Next: find a buying spot and report which recommendation helped most.',
      src: '../assets/models/pacific-mackerel.gltf',
      tone: 'mackerel',
      orbit: '70deg 82deg 4.3m',
      exposure: '1',
      shadow: '1.25'
    },
    mahiMahi: {
      zhTitle: '鬼頭刀',
      enTitle: 'Mahi-mahi',
      zhBody: '亮黃綠色、肉厚有存在感，適合香煎、烤魚與年輕人愛的餐盒料理。',
      enBody: 'A bright yellow-green fish with firm meat, good for searing, grilling, and bowls.',
      zhLook: '認魚重點：魚身亮黃綠、肉厚，切片時看肉色乾淨、沒有刺鼻味。',
      enLook: 'Look for: bright yellow-green body, firm cuts, clean color, and no harsh smell.',
      zhStatus: '綠燈：肉厚好料理，適合餐盒與聚餐',
      enStatus: 'Green: firm and easy for bowls or shared meals',
      zhMethod: '現場問法：這批適合切片嗎？香煎會不會太乾？',
      enMethod: 'Ask: is this batch good for fillets, and how do I keep it from drying out?',
      zhCook: '料理提示：中火香煎，起鍋前加檸檬或胡椒，味道很 clean。',
      enCook: 'Cooking tip: pan-sear on medium heat; finish with lemon or pepper for a clean taste.',
      zhNext: '下一步：看食譜再買，回饋大家最想煮哪一種做法。',
      enNext: 'Next: check the recipe before buying and share which cooking style you want.',
      src: '../assets/models/mahi-mahi.gltf',
      tone: 'mahi',
      orbit: '64deg 78deg 4.5m',
      exposure: '1.12',
      shadow: '1.1'
    }
  };

  var KEYS = ['crimsonBream', 'mackerel', 'mahiMahi'];
  var state = { activeKey: 'crimsonBream', arOn: false, stream: null, stage: null, video: null, model: null, toastTimer: 0 };

  function lang() {
    return localStorage.getItem('scm-language') === 'en' || document.documentElement.lang === 'en' ? 'en' : 'zh';
  }

  function pick(zh, en) {
    return lang() === 'en' ? en : zh;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function item() {
    return SPECIES[state.activeKey] || SPECIES.crimsonBream;
  }

  function waitForPage() {
    var modelStage = document.querySelector('.sustainability-layout .model-stage');
    var cards = document.querySelectorAll('.sustainability-copy .label-card');
    if (!modelStage || cards.length < 3) {
      window.setTimeout(waitForPage, 120);
      return;
    }
    init(modelStage, Array.prototype.slice.call(cards, 0, 3));
  }

  function init(modelStage, cards) {
    if (modelStage.dataset.arEnhanced === '1') return;
    modelStage.dataset.arEnhanced = '1';

    modelStage.innerHTML = '';
    var stage = document.createElement('div');
    stage.className = 'ar-stage';
    stage.innerHTML = [
      '<video class="ar-camera" playsinline muted></video>',
      '<div class="ar-ocean-glow" aria-hidden="true"></div>',
      '<model-viewer class="ar-model" camera-controls touch-action="pan-y" auto-rotate rotation-per-second="18deg" shadow-intensity="1" exposure="1" ar ar-modes="webxr scene-viewer quick-look" interaction-prompt="none" loading="eager" reveal="auto">',
      '  <button type="button" class="ar-action-btn ar-real-ar-btn" slot="ar-button" data-real-ar></button>',
      '</model-viewer>',
      '<div class="ar-model-fallback" data-model-fallback>3D 魚種載入中</div>',
      '<div class="ar-species-panel" aria-live="polite" data-species-panel></div>',
      '<div class="ar-toolbar">',
      '  <div class="ar-toolbar-left">',
      '    <div class="ar-title-pill" data-ar-title></div>',
      '    <button type="button" class="ar-action-btn ar-toggle-btn" data-ar-toggle></button>',
      '    <div class="ar-fish-options" data-fish-options></div>',
      '  </div>',
      '  <div class="ar-toolbar-right"><button type="button" class="ar-action-btn ar-photo-btn" data-ar-photo>📱</button></div>',
      '</div>',
      '<div class="ar-hint-pill" data-ar-hint></div>',
      '<div class="ar-toast" data-ar-toast></div>'
    ].join('');
    modelStage.appendChild(stage);

    state.stage = stage;
    state.video = stage.querySelector('.ar-camera');
    state.model = stage.querySelector('.ar-model');
    state.model.addEventListener('load', function () {
      stage.classList.add('is-model-ready');
      stage.classList.remove('is-model-error');
    });
    state.model.addEventListener('error', function () {
      stage.classList.remove('is-model-ready');
      stage.classList.add('is-model-error');
      var fish = item();
      showToast(pick(fish.zhTitle + ' 3D 模型暫時載入不了，先看認魚小卡與料理提示。', fish.enTitle + ' 3D model is not loading. Use the fish ID card and cooking tip first.'));
    });

    var options = stage.querySelector('[data-fish-options]');
    KEYS.forEach(function (key) {
      var fish = SPECIES[key];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ar-action-btn ar-fish-btn is-' + fish.tone;
      btn.dataset.fish = key;
      btn.addEventListener('click', function () { selectSpecies(key); });
      options.appendChild(btn);
    });

    cards.forEach(function (card, index) {
      var key = KEYS[index];
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.dataset.arOption = key;
      card.addEventListener('click', function () { selectSpecies(key); });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectSpecies(key);
        }
      });
    });

    stage.querySelector('[data-ar-toggle]').addEventListener('click', toggleAr);
    stage.querySelector('[data-ar-photo]').addEventListener('click', screenshotHint);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state.arOn) stopCamera(false);
    });
    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.language-toggle')) {
        window.setTimeout(updateLanguage, 80);
        window.setTimeout(updateLanguage, 280);
      }
    });

    selectSpecies('crimsonBream');
  }

  function selectSpecies(key) {
    if (!SPECIES[key]) return;
    state.activeKey = key;
    var fish = item();

    document.querySelectorAll('.sustainability-copy .label-card').forEach(function (card) {
      var cardFish = SPECIES[card.dataset.arOption] || fish;
      var selected = card.dataset.arOption === key;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
      card.innerHTML = '<h3>' + esc(pick(cardFish.zhTitle, cardFish.enTitle)) + '</h3><p>' + esc(pick(cardFish.zhBody, cardFish.enBody)) + '</p>';
    });

    state.stage.dataset.fishTone = fish.tone;
    state.stage.classList.remove('is-model-ready', 'is-model-error');
    state.stage.querySelectorAll('[data-fish]').forEach(function (btn) {
      var selected = btn.dataset.fish === key;
      btn.classList.toggle('is-selected', selected);
      btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    state.model.src = fish.src;
    state.model.alt = pick(fish.zhTitle + ' 3D 魚種模型：用來認魚、理解料理方向與現場問法', fish.enTitle + ' 3D fish model for recognition, cooking direction, and market questions');
    state.model.setAttribute('camera-orbit', fish.orbit);
    state.model.setAttribute('exposure', fish.exposure || '1');
    state.model.setAttribute('shadow-intensity', fish.shadow || '1');
    updateLanguage();
  }

  function updateLanguage() {
    if (!state.stage) return;
    var fish = item();
    state.stage.querySelector('[data-ar-title]').textContent = pick('真魚種 3D：' + fish.zhTitle, 'Real Fish 3D: ' + fish.enTitle);

    var toggle = state.stage.querySelector('[data-ar-toggle]');
    toggle.textContent = state.arOn ? pick('相機AR：開', 'Camera AR: On') : pick('相機AR：關', 'Camera AR: Off');
    toggle.classList.toggle('is-on', state.arOn);
    toggle.setAttribute('aria-pressed', state.arOn ? 'true' : 'false');

    var realAr = state.stage.querySelector('[data-real-ar]');
    if (realAr) realAr.textContent = pick('放到現場', 'View in AR');

    state.stage.querySelector('[data-ar-photo]').setAttribute('aria-label', pick('查看截圖提示', 'Show screenshot tip'));

    state.stage.querySelectorAll('[data-fish]').forEach(function (btn) {
      var fishOption = SPECIES[btn.dataset.fish];
      btn.textContent = pick(fishOption.zhTitle, fishOption.enTitle);
      btn.setAttribute('aria-label', pick('選擇' + fishOption.zhTitle, 'Select ' + fishOption.enTitle));
      btn.setAttribute('title', pick('選擇' + fishOption.zhTitle, 'Select ' + fishOption.enTitle));
    });

    var fallback = state.stage.querySelector('[data-model-fallback]');
    if (fallback) {
      fallback.textContent = state.stage.classList.contains('is-model-error')
        ? pick('模型暫時沒載入，先用小卡認魚', 'Model not loaded; use the ID card first')
        : pick(fish.zhTitle + ' 3D 魚種載入中', fish.enTitle + ' 3D fish loading');
    }

    var panel = state.stage.querySelector('[data-species-panel]');
    if (panel) {
      panel.innerHTML = [
        '<strong>' + esc(pick('認魚小卡', 'Fish ID card')) + '</strong>',
        '<span>' + esc(pick(fish.zhLook, fish.enLook)) + '</span>',
        '<span>' + esc(pick(fish.zhStatus, fish.enStatus)) + '</span>',
        '<span>' + esc(pick(fish.zhMethod, fish.enMethod)) + '</span>',
        '<span>' + esc(pick(fish.zhCook, fish.enCook)) + '</span>',
        '<em>' + esc(pick(fish.zhNext, fish.enNext)) + '</em>',
        '<div class="ar-next-links">',
        '  <a href="map.html">' + esc(pick('找買點', 'Find spot')) + '</a>',
        '  <a href="recipes.html">' + esc(pick('看做法', 'Cook it')) + '</a>',
        '  <a href="feedback.html">' + esc(pick('填回饋', 'Feedback')) + '</a>',
        '</div>'
      ].join('');
    }

    state.stage.querySelector('[data-ar-hint]').textContent = state.arOn
      ? pick('現在是「' + fish.zhTitle + '」。看魚身特徵、燈號、問法與料理提示，再決定要不要買。', 'Showing "' + fish.enTitle + '". Check appearance, guidance, questions, and cooking tip before buying.')
      : pick('選一種真實魚種，看 3D 模型與認魚小卡；打開相機後可疊在市場或校園現場。', 'Choose a real fish species to view the 3D model and ID card. Turn on camera to overlay it in the market or campus.');
  }

  async function toggleAr() {
    if (state.arOn) {
      stopCamera(true);
      return;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(pick('這台裝置無法開啟相機畫面。', 'This device cannot open the camera view.'));
        return;
      }
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      state.stream = stream;
      state.video.srcObject = stream;
      await state.video.play();
      state.arOn = true;
      state.stage.classList.add('is-ar-on');
      updateLanguage();
      showToast(pick('相機已開，請對準魚攤、餐桌或活動攤位，邊看模型邊看認魚小卡。', 'Camera is on. Point at the stall, table, or booth and use the fish ID card.'));
    } catch (err) {
      state.arOn = false;
      state.stage.classList.remove('is-ar-on');
      updateLanguage();
      showToast(pick('相機沒有開啟，請確認權限或換手機瀏覽器試試。', 'Camera did not open. Check permission or try another mobile browser.'));
    }
  }

  function stopCamera(showMessage) {
    if (state.stream) state.stream.getTracks().forEach(function (track) { track.stop(); });
    state.stream = null;
    if (state.video) state.video.srcObject = null;
    state.arOn = false;
    if (state.stage) state.stage.classList.remove('is-ar-on');
    updateLanguage();
    if (showMessage) showToast(pick('相機已關閉。', 'Camera is off.'));
  }

  function screenshotHint() {
    showToast(pick('要保存畫面，請用手機截圖；買完記得填回饋小卡，收一句真實原因。', 'Take a phone screenshot to save the view. After buying, leave a quick feedback note.'));
  }

  function showToast(message) {
    var toast = state.stage && state.stage.querySelector('[data-ar-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForPage);
  else waitForPage();
})();