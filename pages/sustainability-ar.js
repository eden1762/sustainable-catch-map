(function () {
  'use strict';

  var OBJECTS = {
    redFish: {
      key: 'redFish',
      type: 'fish',
      zhTitle: '紅色魚',
      enTitle: 'Red Fish',
      zhObject: '紅色 3D 魚',
      enObject: 'red 3D fish',
      zhAction: '游動',
      enAction: 'swims',
      color: '#ec3446',
      accent: '#ff9aa4'
    },
    blueFish: {
      key: 'blueFish',
      type: 'fish',
      zhTitle: '藍色魚',
      enTitle: 'Blue Fish',
      zhObject: '藍色 3D 魚',
      enObject: 'blue 3D fish',
      zhAction: '游動',
      enAction: 'swims',
      color: '#1789e8',
      accent: '#82d6ff'
    },
    goldFish: {
      key: 'goldFish',
      type: 'fish',
      zhTitle: '金色魚',
      enTitle: 'Gold Fish',
      zhObject: '金色 3D 魚',
      enObject: 'gold 3D fish',
      zhAction: '游動',
      enAction: 'swims',
      color: '#d6a326',
      accent: '#ffe184'
    },
    boat: {
      key: 'boat',
      type: 'boat',
      zhTitle: '資源狀態',
      enTitle: 'Resource Status',
      zhObject: '3D 船',
      enObject: '3D boat',
      zhAction: '漂浮',
      enAction: 'floats',
      color: '#25a6d9',
      accent: '#ffe2a8'
    },
    book: {
      key: 'book',
      type: 'book',
      zhTitle: '漁法資訊',
      enTitle: 'Fishing Method Information',
      zhObject: '3D 翻頁中的書',
      enObject: '3D page-turning book',
      zhAction: '翻頁',
      enAction: 'turns its pages',
      color: '#8b6fe8',
      accent: '#fff0b8'
    },
    footprint: {
      key: 'footprint',
      type: 'footprint',
      zhTitle: '產地與足跡',
      enTitle: 'Origin and Footprint',
      zhObject: '3D 足跡',
      enObject: '3D footprint',
      zhAction: '踩踏',
      enAction: 'steps forward',
      color: '#91683a',
      accent: '#ffd79a'
    }
  };

  var CARD_OBJECTS = ['boat', 'book', 'footprint'];
  var FISH_OBJECTS = ['redFish', 'blueFish', 'goldFish'];

  var state = {
    activeKey: 'redFish',
    arOn: false,
    stream: null,
    animationId: 0,
    startedAt: performance.now(),
    stage: null,
    video: null,
    canvas: null,
    ctx: null,
    toastTimer: 0
  };

  function lang() {
    return localStorage.getItem('scm-language') === 'en' || document.documentElement.lang === 'en' ? 'en' : 'zh';
  }

  function text(zh, en) {
    return lang() === 'en' ? en : zh;
  }

  function currentObject() {
    return OBJECTS[state.activeKey] || OBJECTS.redFish;
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
      '<canvas class="ar-fish-canvas"></canvas>',
      '<div class="ar-toolbar">',
      '  <div class="ar-toolbar-left">',
      '    <div class="ar-title-pill" data-ar-title></div>',
      '    <button type="button" class="ar-action-btn ar-toggle-btn" data-ar-toggle></button>',
      '    <div class="ar-fish-options" data-fish-options>',
      '      <button type="button" class="ar-action-btn ar-fish-btn is-red" data-fish="redFish"></button>',
      '      <button type="button" class="ar-action-btn ar-fish-btn is-blue" data-fish="blueFish"></button>',
      '      <button type="button" class="ar-action-btn ar-fish-btn is-gold" data-fish="goldFish"></button>',
      '    </div>',
      '  </div>',
      '  <div class="ar-toolbar-right">',
      '    <button type="button" class="ar-action-btn ar-photo-btn" data-ar-photo aria-label="拍照" title="拍照">📷</button>',
      '  </div>',
      '</div>',
      '<div class="ar-hint-pill" data-ar-hint></div>',
      '<div class="ar-toast" data-ar-toast></div>'
    ].join('');
    modelStage.appendChild(stage);

    state.stage = stage;
    state.video = stage.querySelector('.ar-camera');
    state.canvas = stage.querySelector('.ar-fish-canvas');
    state.ctx = state.canvas.getContext('2d');

    cards.forEach(function (card, index) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.dataset.arOption = CARD_OBJECTS[index];
      card.addEventListener('click', function () { selectObject(CARD_OBJECTS[index]); });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectObject(CARD_OBJECTS[index]);
        }
      });
    });

    stage.querySelector('[data-ar-toggle]').addEventListener('click', toggleAr);
    stage.querySelector('[data-ar-photo]').addEventListener('click', takePhoto);
    stage.querySelectorAll('[data-fish]').forEach(function (btn) {
      btn.addEventListener('click', function () { selectObject(btn.dataset.fish); });
    });

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state.arOn) stopCamera(false);
    });
    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.language-toggle')) {
        window.setTimeout(updateLanguage, 80);
        window.setTimeout(updateLanguage, 280);
      }
    });

    resizeCanvas();
    selectObject('redFish');
    updateLanguage();
    drawLoop();
  }

  function selectObject(key) {
    if (!OBJECTS[key]) return;
    state.activeKey = key;

    document.querySelectorAll('.sustainability-copy .label-card').forEach(function (card) {
      var selected = card.dataset.arOption === key;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    if (state.stage) {
      state.stage.querySelectorAll('[data-fish]').forEach(function (btn) {
        var selected = btn.dataset.fish === key;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    }
    updateLanguage();
  }

  function updateLanguage() {
    if (!state.stage) return;
    var item = currentObject();
    var title = state.stage.querySelector('[data-ar-title]');
    var hint = state.stage.querySelector('[data-ar-hint]');
    var toggle = state.stage.querySelector('[data-ar-toggle]');
    var photo = state.stage.querySelector('[data-ar-photo]');

    // 隱藏 AR 區塊上方標題文字，保留 AR 開關、拍照與互動功能不變。
    title.textContent = '';
    title.hidden = true;
    title.setAttribute('aria-hidden', 'true');

    toggle.textContent = state.arOn ? text('AR：開啟', 'AR: On') : text('AR：關閉', 'AR: Off');
    toggle.classList.toggle('is-on', state.arOn);
    toggle.setAttribute('aria-pressed', state.arOn ? 'true' : 'false');
    toggle.setAttribute('aria-label', state.arOn ? text('關閉 AR 相機', 'Turn off AR camera') : text('開啟 AR 相機', 'Turn on AR camera'));

    photo.setAttribute('aria-label', text('拍照', 'Take photo'));
    photo.setAttribute('title', text('拍照', 'Take photo'));

    var fishLabels = {
      redFish: [text('紅色魚', 'Red Fish'), text('選擇紅色魚', 'Select Red Fish')],
      blueFish: [text('藍色魚', 'Blue Fish'), text('選擇藍色魚', 'Select Blue Fish')],
      goldFish: [text('金色魚', 'Gold Fish'), text('選擇金色魚', 'Select Gold Fish')]
    };
    state.stage.querySelectorAll('[data-fish]').forEach(function (btn) {
      var pair = fishLabels[btn.dataset.fish];
      btn.textContent = pair[0];
      btn.setAttribute('aria-label', pair[1]);
      btn.setAttribute('title', pair[1]);
    });

    var cardTitle = lang() === 'en' ? item.enTitle : item.zhTitle;
    var objectName = lang() === 'en' ? item.enObject : item.zhObject;
    var action = lang() === 'en' ? item.enAction : item.zhAction;
    hint.textContent = state.arOn
      ? text('目前顯示「' + cardTitle + '」：' + objectName + '正在' + action + '，會顯示在相機鏡頭畫面前。點拍照可擷取相機鏡頭與 3D 物件合成畫面。', 'Showing "' + cardTitle + '": the ' + objectName + ' ' + action + ' in front of the camera view. Tap the camera button to capture the camera view with the 3D object.')
      : text('目前顯示「' + cardTitle + '」：' + objectName + '正在' + action + '，會顯示在網頁背景色上。點拍照可擷取此框內的 3D 物件與背景畫面。', 'Showing "' + cardTitle + '": the ' + objectName + ' ' + action + ' over the page background. Tap the camera button to capture the 3D object with the background inside this frame.');
  }

  function resizeCanvas() {
    if (!state.canvas || !state.stage) return;
    var rect = state.stage.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(rect.width * ratio));
    var h = Math.max(1, Math.round(rect.height * ratio));
    if (state.canvas.width !== w || state.canvas.height !== h) {
      state.canvas.width = w;
      state.canvas.height = h;
    }
  }

  async function toggleAr() {
    if (state.arOn) {
      stopCamera(true);
      return;
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(text('此瀏覽器不支援相機 AR。', 'This browser does not support camera-based AR.'));
        return;
      }
      var stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      state.stream = stream;
      state.video.srcObject = stream;
      await state.video.play();
      state.arOn = true;
      state.stage.classList.add('is-ar-on');
      updateLanguage();
    } catch (err) {
      state.arOn = false;
      state.stage.classList.remove('is-ar-on');
      updateLanguage();
      showToast(text('無法開啟相機，請確認瀏覽器權限與 HTTPS 網址。', 'Camera could not be opened. Please check browser permission and HTTPS access.'));
    }
  }

  function stopCamera(showMessage) {
    if (state.stream) {
      state.stream.getTracks().forEach(function (track) { track.stop(); });
    }
    state.stream = null;
    if (state.video) state.video.srcObject = null;
    state.arOn = false;
    if (state.stage) state.stage.classList.remove('is-ar-on');
    updateLanguage();
    if (showMessage) showToast(text('AR 已關閉。', 'AR is off.'));
  }

  function drawLoop(now) {
    resizeCanvas();
    drawScene(state.ctx, state.canvas.width, state.canvas.height, now || performance.now(), false);
    state.animationId = window.requestAnimationFrame(drawLoop);
  }

  function drawBackground(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#dff7ff');
    g.addColorStop(.46, '#eef8ff');
    g.addColorStop(1, '#f8efff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = .28;
    for (var i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(w * ((i * 127) % 1000) / 1000, h * ((i * 251 + 130) % 1000) / 1000, Math.min(w, h) * (0.045 + (i % 3) * .018), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawScene(ctx, w, h, now, includeVideo) {
    if (!ctx || !w || !h) return;
    ctx.clearRect(0, 0, w, h);

    if (includeVideo && state.arOn && state.video && state.video.readyState >= 2) {
      drawCoverVideo(ctx, state.video, w, h);
    } else if (!state.arOn) {
      drawBackground(ctx, w, h);
    }

    drawObject(ctx, w, h, now, currentObject());
  }

  function drawCoverVideo(ctx, video, w, h) {
    var vw = video.videoWidth || w;
    var vh = video.videoHeight || h;
    var scale = Math.max(w / vw, h / vh);
    var dw = vw * scale;
    var dh = vh * scale;
    var dx = (w - dw) / 2;
    var dy = (h - dh) / 2;
    ctx.drawImage(video, dx, dy, dw, dh);
    ctx.save();
    ctx.fillStyle = 'rgba(5, 42, 66, .08)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawObject(ctx, w, h, now, item) {
    if (item.type === 'boat') drawBoat(ctx, w, h, now, item);
    else if (item.type === 'book') drawBook(ctx, w, h, now, item);
    else if (item.type === 'footprint') drawFootprint(ctx, w, h, now, item);
    else drawFish(ctx, w, h, now, item);
  }

  function drawFish(ctx, w, h, now, item) {
    var t = (now - state.startedAt) / 1000;
    var swim = (Math.sin(t * .82) + 1) / 2;
    var x = w * (.18 + .64 * swim);
    var y = h * (.52 + Math.sin(t * 1.65) * .09);
    var scale = Math.min(w, h) / 500 * (1 + Math.sin(t * 2.2) * .045);
    var facing = Math.cos(t * .82) >= 0 ? 1 : -1;
    var tailWave = Math.sin(t * 8);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    drawShadow(ctx, 0, 76, 118, 20);

    ctx.save();
    ctx.translate(-116, 0);
    ctx.rotate(tailWave * .18);
    var tailGradient = ctx.createLinearGradient(-80, -56, 0, 56);
    tailGradient.addColorStop(0, item.accent);
    tailGradient.addColorStop(.54, item.color);
    tailGradient.addColorStop(1, shade(item.color, -.35));
    ctx.fillStyle = tailGradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-72, -62, -82, -8);
    ctx.quadraticCurveTo(-50, 0, -82, 58);
    ctx.quadraticCurveTo(-54, 48, 0, 0);
    ctx.fill();
    ctx.restore();

    var bodyGradient = ctx.createRadialGradient(32, -38, 12, 10, 4, 128);
    bodyGradient.addColorStop(0, '#ffffff');
    bodyGradient.addColorStop(.18, item.accent);
    bodyGradient.addColorStop(.62, item.color);
    bodyGradient.addColorStop(1, shade(item.color, -.42));
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 128, 62, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.clip();
    ctx.globalAlpha = .18;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    for (var i = -72; i <= 74; i += 30) {
      ctx.beginPath();
      ctx.arc(i, 4, 34, -1.2, 1.2);
      ctx.stroke();
    }
    ctx.globalAlpha = .32;
    ctx.beginPath();
    ctx.ellipse(36, -27, 54, 14, -.24, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = shade(item.color, -.18);
    ctx.beginPath();
    ctx.moveTo(-8, -50);
    ctx.quadraticCurveTo(30, -104, 68, -44);
    ctx.quadraticCurveTo(28, -60, -8, -50);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 46);
    ctx.quadraticCurveTo(34, 98, 72, 52);
    ctx.quadraticCurveTo(38, 60, 8, 46);
    ctx.fill();

    ctx.fillStyle = shade(item.color, -.28);
    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.quadraticCurveTo(36, 34, 76, 18);
    ctx.quadraticCurveTo(38, 58, -8, 14);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(82, -18, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#153247';
    ctx.beginPath();
    ctx.arc(86, -17, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(50, 28, 35, .45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(113, 7, 13, .1, .9);
    ctx.stroke();

    ctx.save();
    ctx.scale(facing, 1);
    ctx.globalAlpha = .46;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    for (var b = 0; b < 4; b++) {
      var bx = 138 + b * 25 + Math.sin(t * 2 + b) * 5;
      var by = -38 - b * 16 + Math.cos(t * 2.4 + b) * 6;
      ctx.beginPath();
      ctx.arc(bx, by, 6 + b * 1.8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  function drawBoat(ctx, w, h, now, item) {
    var t = (now - state.startedAt) / 1000;
    var x = w * (.5 + Math.sin(t * .48) * .12);
    var y = h * (.55 + Math.sin(t * 1.2) * .035);
    var scale = Math.min(w, h) / 520;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 1.2) * .045);
    ctx.scale(scale, scale);

    drawShadow(ctx, 0, 82, 150, 20);

    ctx.strokeStyle = 'rgba(255,255,255,.72)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (var i = -190; i <= 190; i += 18) {
      var py = 95 + Math.sin(t * 3 + i * .04) * 8;
      if (i === -190) ctx.moveTo(i, py); else ctx.lineTo(i, py);
    }
    ctx.stroke();

    var hull = ctx.createLinearGradient(0, -20, 0, 80);
    hull.addColorStop(0, '#ffffff');
    hull.addColorStop(.45, item.color);
    hull.addColorStop(1, shade(item.color, -.42));
    ctx.fillStyle = hull;
    ctx.beginPath();
    ctx.moveTo(-150, 14);
    ctx.quadraticCurveTo(-104, 86, -6, 90);
    ctx.quadraticCurveTo(96, 88, 154, 12);
    ctx.lineTo(126, 60);
    ctx.lineTo(-126, 60);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff4d6';
    ctx.fillRect(-90, -48, 136, 56);
    ctx.fillStyle = '#5abde2';
    for (var p = -68; p <= 18; p += 38) {
      ctx.beginPath();
      ctx.roundRect(p, -34, 24, 22, 6);
      ctx.fill();
    }
    ctx.fillStyle = '#7b4b34';
    ctx.fillRect(-16, -154, 9, 150);
    var sail = ctx.createLinearGradient(-12, -150, 92, -25);
    sail.addColorStop(0, '#ffffff');
    sail.addColorStop(1, item.accent);
    ctx.fillStyle = sail;
    ctx.beginPath();
    ctx.moveTo(-6, -150);
    ctx.quadraticCurveTo(92, -94, 66, -12);
    ctx.lineTo(-6, -12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(18,48,71,.18)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function drawBook(ctx, w, h, now, item) {
    var t = (now - state.startedAt) / 1000;
    var x = w * .5;
    var y = h * (.54 + Math.sin(t * .8) * .035);
    var scale = Math.min(w, h) / 520;
    var flip = (Math.sin(t * 2.2) + 1) / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * .9) * .035);
    ctx.scale(scale, scale);

    drawShadow(ctx, 0, 114, 160, 22);
    ctx.fillStyle = shade(item.color, -.18);
    ctx.beginPath();
    ctx.roundRect(-170, -78, 340, 210, 24);
    ctx.fill();

    ctx.fillStyle = '#fff9e8';
    ctx.beginPath();
    ctx.roundRect(-156, -96, 148, 205, 18);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(8, -96, 148, 205, 18);
    ctx.fill();

    ctx.strokeStyle = 'rgba(54,42,80,.14)';
    ctx.lineWidth = 4;
    for (var i = -62; i <= 66; i += 32) {
      ctx.beginPath();
      ctx.moveTo(-130, i);
      ctx.lineTo(-38, i + Math.sin(t + i) * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(38, i);
      ctx.lineTo(130, i + Math.cos(t + i) * 2);
      ctx.stroke();
    }

    var pageW = 132 * (1 - flip * .78);
    var pageX = 8 - pageW;
    var pageGradient = ctx.createLinearGradient(pageX, -100, 10, 108);
    pageGradient.addColorStop(0, '#ffffff');
    pageGradient.addColorStop(.7, item.accent);
    pageGradient.addColorStop(1, '#fff3d7');
    ctx.fillStyle = pageGradient;
    ctx.beginPath();
    ctx.moveTo(8, -96);
    ctx.quadraticCurveTo(pageX - 34, -70, pageX, 12);
    ctx.quadraticCurveTo(pageX - 14, 76, 8, 108);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(54,42,80,.18)';
    ctx.stroke();

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(0, 8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFootprint(ctx, w, h, now, item) {
    var t = (now - state.startedAt) / 1000;
    var step = Math.floor(t * 1.8) % 2;
    var pulse = (Math.sin(t * Math.PI * 1.8) + 1) / 2;
    var x = w * (.5 + Math.sin(t * .7) * .07);
    var y = h * (.55 + Math.cos(t * .9) * .025);
    var scale = Math.min(w, h) / 520;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 118, 132, 22);

    for (var i = 0; i < 5; i++) {
      var side = i % 2 === 0 ? -1 : 1;
      var yy = 110 - i * 68;
      var xx = side * 48;
      var alpha = .18 + i * .09;
      if (i === 0) alpha = .42 + pulse * .45;
      drawSingleFootprint(ctx, xx, yy, side * -.18, item, alpha, i === 0 ? 1 + pulse * .14 : .9);
    }

    ctx.save();
    ctx.globalAlpha = .26;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.setLineDash([16, 18]);
    ctx.beginPath();
    ctx.moveTo(-80, 145);
    ctx.bezierCurveTo(64, 68, -72, -16, 72, -126);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  function drawSingleFootprint(ctx, x, y, rot, item, alpha, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    var g = ctx.createRadialGradient(-10, -12, 4, 0, 0, 82);
    g.addColorStop(0, item.accent);
    g.addColorStop(.45, item.color);
    g.addColorStop(1, shade(item.color, -.38));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 18, 38, 58, .08, 0, Math.PI * 2);
    ctx.fill();
    for (var i = 0; i < 5; i++) {
      var tx = -31 + i * 15;
      var ty = -42 - Math.abs(i - 2) * 6;
      ctx.beginPath();
      ctx.ellipse(tx, ty, 8 + (2 - Math.abs(i - 2)) * 1.6, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawShadow(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.globalAlpha = .22;
    ctx.fillStyle = '#0b3148';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function shade(hex, amount) {
    var c = hex.replace('#', '');
    var n = parseInt(c, 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + Math.round(255 * amount)));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + Math.round(255 * amount)));
    var b = Math.max(0, Math.min(255, (n & 255) + Math.round(255 * amount)));
    return '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
  }

  async function takePhoto() {
    if (!state.stage || !state.canvas) return;
    var rect = state.stage.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var output = document.createElement('canvas');
    output.width = Math.max(1, Math.round(rect.width * ratio));
    output.height = Math.max(1, Math.round(rect.height * ratio));
    var ctx = output.getContext('2d');
    drawScene(ctx, output.width, output.height, performance.now(), true);

    output.toBlob(async function (blob) {
      if (!blob) {
        showToast(text('拍照失敗，請再試一次。', 'Capture failed. Please try again.'));
        return;
      }
      var filename = 'sustainable-ar-' + currentObject().key + '-' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
      var file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({ files: [file], title: text('永續漁獲 AR 照片', 'Sustainable Catch AR photo') });
          showToast(text('照片已送出，可在手機選單中儲存。', 'Photo is ready. Save it from your phone share menu.'));
          return;
        } catch (err) {
          // User may cancel the share sheet. Fall back to download below.
        }
      }
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      showToast(text('照片已下載。手機可從下載項目儲存至相簿。', 'Photo downloaded. On mobile, save it to Photos from Downloads.'));
    }, 'image/png');
  }

  function showToast(message) {
    if (!state.stage) return;
    var toast = state.stage.querySelector('[data-ar-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      r = Math.min(r || 0, Math.abs(w) / 2, Math.abs(h) / 2);
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForPage);
  } else {
    waitForPage();
  }
})();
