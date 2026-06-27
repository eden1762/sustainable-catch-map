(function () {
  'use strict';

  var SPECIES = {
    crimsonBream: {
      zhTitle: '赤鯮',
      enTitle: 'Crimson Sea Bream',
      zhBody: '紅亮魚身、肉質細緻，清蒸、乾煎都很適合，宴客也有面子。',
      enBody: 'A red-toned fish with delicate meat, great for steaming, pan-frying, and a clean dinner flex.',
      zhLook: '認魚重點：魚身偏紅、眼睛清亮、魚鰓鮮紅；下手前先問來源與今天漁法。',
      enLook: 'Look for: red body, clear eyes, bright gills; ask origin and catch method before you buy.',
      zhStatus: '黃燈：看來源與漁法再下手',
      enStatus: 'Yellow: check origin and catch method first',
      zhFresh: ['眼睛清亮', '魚鰓鮮紅', '魚身有光澤'],
      enFresh: ['Clear eyes', 'Bright red gills', 'Glossy skin'],
      zhMethod: '現場問法：今天哪裡來？適合清蒸還是乾煎？',
      enMethod: 'Ask at the counter: where is it from today, and is it better steamed or pan-fried?',
      zhCook: '料理提示：薑絲清蒸 8～10 分鐘，少調味就能吃出甜味。',
      enCook: 'Cooking tip: steam with ginger for 8–10 minutes and keep seasoning light.',
      zhNext: '下一步：問清楚來源，買完到回饋小卡記一句原因。',
      enNext: 'Next: confirm origin, then leave one quick feedback note after buying.',
      src: '../assets/models/crimson-sea-bream.gltf',
      tone: 'bream',
      orbit: '68deg 78deg 3.2m',
      exposure: '1.18',
      shadow: '1.25',
      color: '#df4b57'
    },
    mackerel: {
      zhTitle: '花腹鯖',
      enTitle: 'Pacific Mackerel',
      zhBody: '藍背銀腹、油脂香，乾煎、鹽烤都好懂，魚販一句話就能推。',
      enBody: 'A blue-backed oily fish that is easy to recommend for grilling or pan-frying.',
      zhLook: '認魚重點：藍背銀腹、條紋清楚，摸起來有彈性，新手也好挑。',
      enLook: 'Look for: blue back, silver belly, clear stripes, and springy flesh.',
      zhStatus: '綠燈：新手友善，適合日常餐桌',
      enStatus: 'Green: beginner-friendly for everyday meals',
      zhFresh: ['魚腹銀亮', '條紋清楚', '按壓會回彈'],
      enFresh: ['Silver belly', 'Clear stripes', 'Springy touch'],
      zhMethod: '現場問法：油脂夠嗎？今天適合鹽烤還是乾煎？',
      enMethod: 'Ask: is it fatty enough today, and should I grill or pan-fry it?',
      zhCook: '料理提示：魚身擦乾、鍋熱再下，乾煎到表皮酥就很香。',
      enCook: 'Cooking tip: pat dry, heat the pan first, and sear until the skin is crisp.',
      zhNext: '下一步：直接找買點，買完回報哪句介紹最有用。',
      enNext: 'Next: find a buying spot and report which recommendation helped most.',
      src: '../assets/models/pacific-mackerel.gltf',
      tone: 'mackerel',
      orbit: '70deg 80deg 3.35m',
      exposure: '1.08',
      shadow: '1.28',
      color: '#1789c8'
    },
    mahiMahi: {
      zhTitle: '鬼頭刀',
      enTitle: 'Mahi-mahi',
      zhBody: '亮黃綠色、肉厚有存在感，香煎、烤魚與餐盒料理都很可以。',
      enBody: 'A bright yellow-green fish with firm meat, great for searing, grilling, and seafood bowls.',
      zhLook: '認魚重點：魚身亮黃綠、肉厚；切片肉色乾淨、不要有刺鼻味。',
      enLook: 'Look for: bright yellow-green body, firm cuts, clean color, and no harsh smell.',
      zhStatus: '綠燈：肉厚好料理，適合餐盒與聚餐',
      enStatus: 'Green: firm, easy, and great for bowls or shared meals',
      zhFresh: ['色澤乾淨', '沒有刺鼻味', '切面不出水'],
      enFresh: ['Clean color', 'No harsh smell', 'Dry, firm cut'],
      zhMethod: '現場問法：這批適合切片嗎？香煎會不會太乾？',
      enMethod: 'Ask: is this batch good for fillets, and how do I keep it from drying out?',
      zhCook: '料理提示：中火香煎，起鍋前加檸檬或胡椒，味道很 clean。',
      enCook: 'Cooking tip: pan-sear on medium heat; finish with lemon or pepper for a clean bite.',
      zhNext: '下一步：看食譜再買，回饋大家最想煮哪一種做法。',
      enNext: 'Next: check the recipe before buying and share which cooking style you want.',
      src: '../assets/models/mahi-mahi.gltf',
      tone: 'mahi',
      orbit: '64deg 76deg 3.45m',
      exposure: '1.2',
      shadow: '1.18',
      color: '#d9a42a'
    }
  };

  var KEYS = ['crimsonBream', 'mackerel', 'mahiMahi'];
  var state = {
    activeKey: 'crimsonBream',
    arOn: false,
    stream: null,
    stage: null,
    video: null,
    model: null,
    fallbackFish: null,
    toastTimer: 0,
    photoBusy: false,
    lastPhotoUrl: ''
  };

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
      '<div class="ar-fallback-fish" aria-hidden="true" data-fallback-fish><span class="fish-body"></span><span class="fish-tail"></span><span class="fish-fin fish-fin-top"></span><span class="fish-fin fish-fin-bottom"></span><span class="fish-eye"></span><span class="fish-shine"></span><span class="fish-gill"></span><span class="fish-scale scale-one"></span><span class="fish-scale scale-two"></span><span class="fish-scale scale-three"></span></div>',
      '<model-viewer class="ar-model" camera-controls touch-action="pan-y" auto-rotate rotation-per-second="16deg" shadow-intensity="1.2" exposure="1.1" camera-target="0m 0m 0m" field-of-view="27deg" min-camera-orbit="auto auto 2.4m" max-camera-orbit="auto auto 5m" ar ar-modes="webxr scene-viewer quick-look" interaction-prompt="none" loading="eager" reveal="auto">',
      '  <button type="button" class="ar-action-btn ar-real-ar-btn" slot="ar-button" data-real-ar></button>',
      '</model-viewer>',
      '<div class="ar-model-fallback" data-model-fallback>3D 魚種載入中</div>',
      '<div class="ar-fresh-strip" aria-live="polite" data-fresh-strip></div>',
      '<div class="ar-species-panel" aria-live="polite" data-species-panel></div>',
      '<div class="ar-toolbar">',
      '  <div class="ar-toolbar-left">',
      '    <div class="ar-title-pill" data-ar-title></div>',
      '    <button type="button" class="ar-action-btn ar-toggle-btn" data-ar-toggle></button>',
      '    <div class="ar-fish-options" data-fish-options></div>',
      '  </div>',
      '  <div class="ar-toolbar-right"><button type="button" class="ar-action-btn ar-photo-btn" data-ar-photo></button></div>',
      '</div>',
      '<div class="ar-hint-pill" data-ar-hint></div>',
      '<div class="ar-toast" data-ar-toast></div>'
    ].join('');
    modelStage.appendChild(stage);

    state.stage = stage;
    state.video = stage.querySelector('.ar-camera');
    state.model = stage.querySelector('.ar-model');
    state.fallbackFish = stage.querySelector('[data-fallback-fish]');

    state.model.addEventListener('load', function () {
      stage.classList.add('is-model-ready');
      stage.classList.remove('is-model-error');
      updateLanguage();
    });
    state.model.addEventListener('error', function () {
      stage.classList.remove('is-model-ready');
      stage.classList.add('is-model-error');
      var fish = item();
      showToast(pick(fish.zhTitle + ' 3D 模型暫時沒載入，已先顯示可拍照的 3D 魚影。', fish.enTitle + ' model is not loading, so a photo-ready 3D fish layer is shown.'));
      updateLanguage();
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
    stage.querySelector('[data-ar-photo]').addEventListener('click', takePhoto);
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
    if (!SPECIES[key] || !state.stage) return;
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
    state.model.setAttribute('poster', '');

    if (state.fallbackFish) state.fallbackFish.style.setProperty('--fish-color', fish.color);

    window.setTimeout(function () {
      if (!state.stage || state.stage.classList.contains('is-model-ready') || state.stage.classList.contains('is-model-error')) return;
      var fallback = state.stage.querySelector('[data-model-fallback]');
      if (fallback) fallback.textContent = pick('3D 魚正在出現；手機網路慢時會先顯示魚影。', '3D fish is coming in; on slow mobile networks the fish layer appears first.');
    }, 1400);

    updateLanguage();
  }

  function updateLanguage() {
    if (!state.stage) return;
    var fish = item();
    state.stage.querySelector('[data-ar-title]').textContent = pick('3D 魚：' + fish.zhTitle, '3D Fish: ' + fish.enTitle);

    var toggle = state.stage.querySelector('[data-ar-toggle]');
    toggle.textContent = state.arOn ? pick('相機開啟', 'Camera On') : pick('開相機看魚', 'Open Camera');
    toggle.classList.toggle('is-on', state.arOn);
    toggle.setAttribute('aria-pressed', state.arOn ? 'true' : 'false');

    var realAr = state.stage.querySelector('[data-real-ar]');
    if (realAr) realAr.textContent = pick('放到現場', 'View in AR');

    var photoButton = state.stage.querySelector('[data-ar-photo]');
    photoButton.textContent = pick('拍照', 'Photo');
    photoButton.setAttribute('aria-label', pick('替我拍一張 3D 魚合照', 'Take a 3D fish photo for me'));
    photoButton.setAttribute('title', pick('替我拍照，不用自己截圖', 'Take a photo, no screenshot needed'));

    state.stage.querySelectorAll('[data-fish]').forEach(function (btn) {
      var fishOption = SPECIES[btn.dataset.fish];
      btn.textContent = pick(fishOption.zhTitle, fishOption.enTitle);
      btn.setAttribute('aria-label', pick('選擇' + fishOption.zhTitle, 'Select ' + fishOption.enTitle));
      btn.setAttribute('title', pick('選擇' + fishOption.zhTitle, 'Select ' + fishOption.enTitle));
    });

    var fallback = state.stage.querySelector('[data-model-fallback]');
    if (fallback) {
      fallback.textContent = state.stage.classList.contains('is-model-error')
        ? pick('模型暫時沒載入，已用 3D 魚影接上', 'Model did not load, so the 3D fish layer is shown')
        : pick(fish.zhTitle + ' 3D 魚載入中', fish.enTitle + ' 3D fish loading');
    }

    var freshStrip = state.stage.querySelector('[data-fresh-strip]');
    if (freshStrip) {
      var checks = pick(fish.zhFresh, fish.enFresh);
      freshStrip.innerHTML = ['<strong>' + esc(pick('新鮮度快看', 'Freshness check')) + '</strong>']
        .concat(checks.map(function (text) { return '<span>' + esc(text) + '</span>'; }))
        .join('');
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
      ? pick('現在是「' + fish.zhTitle + '」。可直接按「拍照」保存合照，再看新鮮度、問法與料理提示。', 'Showing "' + fish.enTitle + '". Tap Photo to save the shot, then check freshness, questions, and cooking tips.')
      : pick('選一種魚，看 3D 模型、新鮮度快看與認魚小卡；開相機後可疊在市場、餐桌或活動現場。', 'Choose a fish, view the 3D model, freshness check, and ID card, then open the camera at the market, table, or booth.');
  }

  async function toggleAr() {
    if (state.arOn) {
      stopCamera(true);
      return;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(pick('這台裝置不能開相機，但仍可直接拍 3D 魚圖。', 'This device cannot open the camera, but you can still take a 3D fish image.'));
        return;
      }
      var stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      state.stream = stream;
      state.video.srcObject = stream;
      await state.video.play();
      state.arOn = true;
      state.stage.classList.add('is-ar-on');
      updateLanguage();
      showToast(pick('相機已開。先對準魚眼、魚鰓、魚身光澤，再按「拍照」留存。', 'Camera is on. Check eyes, gills, and glossy skin first, then tap Photo.'));
    } catch (err) {
      state.arOn = false;
      state.stage.classList.remove('is-ar-on');
      updateLanguage();
      showToast(pick('相機沒有開啟，仍可先拍一張 3D 魚圖；若要合照請允許相機權限。', 'Camera did not open. You can still take a 3D fish image; allow camera permission for a live shot.'));
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

  function drawCover(ctx, source, x, y, width, height) {
    var sw = source.videoWidth || source.naturalWidth || source.width || width;
    var sh = source.videoHeight || source.naturalHeight || source.height || height;
    var scale = Math.max(width / sw, height / sh);
    var dw = sw * scale;
    var dh = sh * scale;
    ctx.drawImage(source, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh);
  }

  function roundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawFallbackScene(ctx, width, height) {
    var gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ddf8ff');
    gradient.addColorStop(0.55, '#f5fcff');
    gradient.addColorStop(1, '#fff0d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,.52)';
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.18, width * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(25,140,190,.1)';
    ctx.beginPath();
    ctx.ellipse(width * 0.74, height * 0.66, width * 0.34, height * 0.17, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFishShape(ctx, width, height, fish) {
    ctx.save();
    ctx.translate(width * 0.52, height * 0.46);
    ctx.rotate(-0.08);
    var size = Math.min(width, height) * 0.34;
    var color = fish.color || '#df4b57';
    var bodyGradient = ctx.createLinearGradient(-size, -size * 0.3, size, size * 0.35);
    bodyGradient.addColorStop(0, '#ffffff');
    bodyGradient.addColorStop(0.18, color);
    bodyGradient.addColorStop(1, '#123047');

    ctx.shadowColor = 'rgba(2,22,35,.28)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 18;
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.52, size * 0.92, size * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;

    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(-size * 0.04, 0, size * 0.92, size * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size * 0.86, 0);
    ctx.lineTo(-size * 1.32, -size * 0.38);
    ctx.lineTo(-size * 1.18, 0);
    ctx.lineTo(-size * 1.32, size * 0.38);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.beginPath();
    ctx.ellipse(size * 0.14, -size * 0.12, size * 0.52, size * 0.09, -0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,.36)';
    ctx.lineWidth = Math.max(3, size * 0.012);
    for (var i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(-size * (0.18 + i * 0.18), size * 0.02, size * 0.17, -0.95, 0.95);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(230,45,55,.65)';
    ctx.lineWidth = Math.max(4, size * 0.018);
    ctx.beginPath();
    ctx.arc(size * 0.42, size * 0.03, size * 0.14, -1.2, 1.2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,.78)';
    ctx.beginPath();
    ctx.arc(size * 0.62, -size * 0.08, size * 0.075, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#123047';
    ctx.beginPath();
    ctx.arc(size * 0.645, -size * 0.08, size * 0.032, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPanel(ctx, width, height, fish) {
    var isEn = lang() === 'en';
    var margin = Math.max(24, width * 0.045);
    var panelHeight = Math.min(height * 0.3, 250);
    var y = height - panelHeight - margin;
    roundRect(ctx, margin, y, width - margin * 2, panelHeight, 28);
    ctx.fillStyle = 'rgba(255,255,255,.86)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#123047';
    ctx.font = '900 ' + Math.round(width * 0.035) + 'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(isEn ? fish.enTitle : fish.zhTitle, margin + 26, y + 44);
    ctx.font = '700 ' + Math.round(width * 0.018) + 'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#0d6f92';
    ctx.fillText(isEn ? fish.enStatus : fish.zhStatus, margin + 26, y + 78);
    ctx.fillStyle = 'rgba(18,48,71,.78)';
    wrapText(ctx, (isEn ? 'Fresh: ' : '新鮮度：') + (isEn ? fish.enFresh : fish.zhFresh).join(isEn ? ' · ' : '、'), margin + 26, y + 108, width - margin * 2 - 52, Math.round(width * 0.023));
    ctx.fillStyle = 'rgba(18,48,71,.78)';
    wrapText(ctx, isEn ? fish.enMethod : fish.zhMethod, margin + 26, y + 146, width - margin * 2 - 52, Math.round(width * 0.026));
    ctx.fillStyle = 'rgba(18,48,71,.92)';
    ctx.font = '900 ' + Math.round(width * 0.018) + 'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(isEn ? 'FishFull · seafood made easy' : 'FishFull 漁有料 · 選魚買魚更簡單', margin + 26, y + panelHeight - 24);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(/\s+/);
    var line = '';
    if (lang() !== 'en') words = String(text).split('');
    words.forEach(function (word, index) {
      var testLine = line + (lang() === 'en' && line ? ' ' : '') + word;
      if (ctx.measureText(testLine).width > maxWidth && index > 0) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = testLine;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) { resolve(blob); }, 'image/png', 0.92);
      } else {
        resolve(null);
      }
    });
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  async function modelImage() {
    if (!state.model || typeof state.model.toDataURL !== 'function') return null;
    try {
      return await state.model.toDataURL('image/png');
    } catch (error) {
      return null;
    }
  }

  async function takePhoto() {
    if (state.photoBusy) return;
    state.photoBusy = true;
    var button = state.stage && state.stage.querySelector('[data-ar-photo]');
    if (button) button.classList.add('is-busy');

    try {
      var fish = item();
      var canvas = document.createElement('canvas');
      var rect = state.stage.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(960, Math.round(rect.width * ratio));
      var height = Math.max(1280, Math.round(rect.height * ratio));
      if (width > height) height = Math.round(width * 1.2);
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');

      if (state.arOn && state.video && state.video.readyState >= 2) drawCover(ctx, state.video, 0, 0, width, height);
      else drawFallbackScene(ctx, width, height);

      var dataUrl = await modelImage();
      if (dataUrl) {
        try {
          var img = await loadImage(dataUrl);
          var modelWidth = width * 0.92;
          var modelHeight = height * 0.5;
          ctx.save();
          ctx.shadowColor = 'rgba(2,22,35,.25)';
          ctx.shadowBlur = 28;
          ctx.shadowOffsetY = 18;
          ctx.drawImage(img, (width - modelWidth) / 2, height * 0.09, modelWidth, modelHeight);
          ctx.restore();
        } catch (error) {
          drawFishShape(ctx, width, height, fish);
        }
      } else {
        drawFishShape(ctx, width, height, fish);
      }

      drawPanel(ctx, width, height, fish);
      await saveCanvas(canvas, fish);
      showToast(pick('照片已做好，沒有請你自己截圖。', 'Photo is ready. No screenshot needed.'));
    } catch (error) {
      showToast(pick('拍照暫時失敗，請再按一次。', 'Photo failed for now. Please tap again.'));
    } finally {
      state.photoBusy = false;
      if (button) button.classList.remove('is-busy');
    }
  }

  async function saveCanvas(canvas, fish) {
    if (state.lastPhotoUrl) {
      URL.revokeObjectURL(state.lastPhotoUrl);
      state.lastPhotoUrl = '';
    }
    var filename = 'fishfull-' + fish.enTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-photo.png';
    var blob = await canvasToBlob(canvas);
    var href = blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/png');
    if (blob) state.lastPhotoUrl = href;
    var link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (!('download' in link)) window.open(href, '_blank', 'noopener');
  }

  function showToast(message) {
    var toast = state.stage && state.stage.querySelector('[data-ar-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', waitForPage);
  else waitForPage();
})();