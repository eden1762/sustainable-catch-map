(function () {
  'use strict';

  var STYLE_ID = 'fishfull-ar-safe-status-style';

  function isEnglish() {
    return document.documentElement.lang === 'en';
  }

  function text() {
    return isEnglish() ? 'Keep the whole fish in view' : '完整魚身留在框內';
  }

  function statusText(state) {
    if (state === 'ready') return isEnglish() ? '3D fish ready. Spin, zoom, then ask one smart question at the stall.' : '3D 魚已準備好。先轉動看清楚，再帶一句好問題去魚攤。';
    if (state === 'slow') return isEnglish() ? 'Still loading the fish. Start with the color cards below, then come back for the 3D view.' : '魚模型還在載入。可以先用下方顏色卡選魚，等等再回來看 3D。';
    if (state === 'error') return isEnglish() ? 'The fish view is taking a break. Use the green, yellow, and red cards below first.' : '魚模型暫時沒出現，先看下方綠、黃、紅任務卡也能開始選魚。';
    return isEnglish() ? 'Bringing up the full fish. Slow connection? You can still use the cards below.' : '完整魚身準備中。網路慢也沒關係，可以先看下方任務卡。';
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.ar-safe-status{position:absolute;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:7;max-width:min(86%,380px);padding:8px 12px;border:1px solid rgba(8,93,117,.16);border-radius:999px;background:rgba(255,255,255,.9);color:#085d75;font-size:12px;font-weight:800;line-height:1.45;text-align:center;box-shadow:0 10px 24px rgba(7,54,77,.1);pointer-events:none;transition:opacity .22s ease,transform .22s ease}',
      '.ar-safe-status[data-state="ready"]{opacity:.86}',
      '.ar-safe-status[data-state="ready"][data-faded="1"]{opacity:0;transform:translate(-50%,8px)}',
      '.ar-safe-status[data-state="slow"]{border-color:rgba(255,159,28,.3);color:#7a4d07;background:rgba(255,250,237,.94)}',
      '.ar-safe-status[data-state="error"]{border-color:rgba(213,91,91,.26);color:#8f3f3f;background:rgba(255,248,246,.94)}',
      '@media(max-width:560px){.ar-safe-status{bottom:calc(6px + env(safe-area-inset-bottom));max-width:calc(100% - 28px);font-size:11px;border-radius:16px;padding:7px 10px}}',
      '@media(max-height:620px){.ar-safe-status{position:relative;left:auto;bottom:auto;transform:none;margin:6px auto 0}.ar-safe-status[data-state="ready"][data-faded="1"]{transform:translateY(6px)}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function setLabel(frame) {
    var label = frame.querySelector('.ar-safe-view__label');
    if (!label) return;
    label.textContent = text();
  }

  function setStatus(stage, state) {
    ensureStyle();
    var status = stage.querySelector('[data-ar-safe-status]');
    if (!status) {
      status = document.createElement('p');
      status.className = 'ar-safe-status';
      status.setAttribute('data-ar-safe-status', '1');
      status.setAttribute('aria-live', 'polite');
      stage.appendChild(status);
    }
    if (stage._fishfullArReadyStatusTimer) window.clearTimeout(stage._fishfullArReadyStatusTimer);
    status.removeAttribute('data-faded');
    status.removeAttribute('aria-hidden');
    status.setAttribute('data-state', state);
    status.textContent = statusText(state);
    if (state === 'ready') {
      stage._fishfullArReadyStatusTimer = window.setTimeout(function () {
        status.setAttribute('data-faded', '1');
        status.setAttribute('aria-hidden', 'true');
      }, 4200);
    }
  }

  function bindModelPowerGuard(stage, model) {
    if (model.dataset.powerGuardBound === '1') return;
    model.dataset.powerGuardBound = '1';
    var hadAutoRotate = model.hasAttribute('auto-rotate');
    var stageIsVisible = true;

    function syncRotation() {
      if (!hadAutoRotate) return;
      if (document.hidden || !stageIsVisible) model.removeAttribute('auto-rotate');
      else model.setAttribute('auto-rotate', '');
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        stageIsVisible = entries.some(function (entry) {
          return entry.isIntersecting && entry.intersectionRatio >= 0.34;
        });
        syncRotation();
      }, { threshold: [0, 0.34, 0.7] });
      observer.observe(stage);
    }

    document.addEventListener('visibilitychange', syncRotation);
    window.addEventListener('pagehide', syncRotation);
    window.addEventListener('pageshow', syncRotation);
    syncRotation();
  }

  function watchModel(stage) {
    var model = stage.querySelector('model-viewer');
    if (!model) {
      setStatus(stage, 'loading');
      window.setTimeout(function () { watchModel(stage); }, 220);
      return;
    }
    bindModelPowerGuard(stage, model);
    if (model.dataset.safeStatusBound === '1') return;
    model.dataset.safeStatusBound = '1';
    setStatus(stage, model.loaded ? 'ready' : 'loading');
    var slowTimer = window.setTimeout(function () {
      if (!model.loaded) setStatus(stage, 'slow');
    }, 5200);
    model.addEventListener('load', function () {
      window.clearTimeout(slowTimer);
      setStatus(stage, 'ready');
    });
    model.addEventListener('error', function () {
      window.clearTimeout(slowTimer);
      setStatus(stage, 'error');
    });
  }

  function run() {
    var stage = document.querySelector('.ar-stage');
    if (!stage) {
      window.setTimeout(run, 160);
      return;
    }

    var frame = stage.querySelector('[data-ar-safe-view]');
    if (!frame) {
      frame = document.createElement('div');
      frame.className = 'ar-safe-view';
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('data-ar-safe-view', '1');
      frame.innerHTML = '<span class="ar-safe-view__corner"></span><span class="ar-safe-view__corner"></span><span class="ar-safe-view__corner"></span><span class="ar-safe-view__line"></span><span class="ar-safe-view__label"></span>';
      stage.appendChild(frame);
    }

    setLabel(frame);
    watchModel(stage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('scm-language-change', run);
})();