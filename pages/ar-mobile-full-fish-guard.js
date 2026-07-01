(function () {
  'use strict';

  var timer = 0;
  var lastViewportKey = '';

  function viewportHeight() {
    if (window.visualViewport && window.visualViewport.height) return window.visualViewport.height;
    return window.innerHeight || 720;
  }

  function viewportWidth() {
    if (window.visualViewport && window.visualViewport.width) return window.visualViewport.width;
    return window.innerWidth || 390;
  }

  function viewportKey() {
    return Math.round(viewportWidth()) + 'x' + Math.round(viewportHeight());
  }

  function stageRect(model) {
    var stage = model && model.closest ? model.closest('.ar-stage, .model-stage, #fishfull-ar-stage') : null;
    return stage && stage.getBoundingClientRect ? stage.getBoundingClientRect() : null;
  }

  function isStageTight(model) {
    var rect = stageRect(model);
    return !!(rect && rect.height && rect.height < 590);
  }

  function stageRatio(model) {
    var rect = stageRect(model);
    if (!rect || !rect.width || !rect.height) return viewportWidth() / Math.max(viewportHeight(), 1);
    return rect.width / Math.max(rect.height, 1);
  }

  function isTightPhoneViewport(model) {
    var phoneQuery = window.matchMedia && window.matchMedia('(max-width: 640px), (max-height: 620px)').matches;
    return !!(phoneQuery || viewportHeight() < 680 || isStageTight(model));
  }

  function fishDistance(model) {
    var height = viewportHeight();
    var ratio = stageRatio(model);
    if (height < 520 || ratio > 0.78) return '4.6m';
    if (height < 560 || isStageTight(model)) return '4.35m';
    if (height < 680) return '4.05m';
    return '3.9m';
  }

  function fishFov(model) {
    var height = viewportHeight();
    var ratio = stageRatio(model);
    if (height < 520 || ratio > 0.78) return '36deg';
    if (height < 560) return '34deg';
    return '32deg';
  }

  function orbitWithDistance(orbit, distance) {
    var parts = String(orbit || '68deg 78deg 3.2m').split(' ');
    if (parts.length < 3) return '68deg 78deg ' + distance;
    parts[parts.length - 1] = distance;
    return parts.join(' ');
  }

  function rememberBaseView(model) {
    if (!model.dataset.fishfullBaseOrbit) {
      model.dataset.fishfullBaseOrbit = model.getAttribute('camera-orbit') || '68deg 78deg 3.2m';
      model.dataset.fishfullBaseFov = model.getAttribute('field-of-view') || '27deg';
      model.dataset.fishfullBaseTarget = model.getAttribute('camera-target') || '0m 0m 0m';
    }
  }

  function applyFullFishGuard() {
    var currentKey = viewportKey();
    var models = Array.prototype.slice.call(document.querySelectorAll('.page-ar-game model-viewer.ar-model'));
    models.forEach(function (model) {
      rememberBaseView(model);

      if (isTightPhoneViewport(model)) {
        model.setAttribute('camera-orbit', orbitWithDistance(model.dataset.fishfullBaseOrbit, fishDistance(model)));
        model.setAttribute('field-of-view', fishFov(model));
        model.setAttribute('camera-target', '0m 0.02m 0m');
        model.setAttribute('min-camera-orbit', 'auto auto 3.25m');
        model.setAttribute('max-camera-orbit', 'auto auto 6.4m');
        model.setAttribute('interaction-prompt', 'none');
        model.setAttribute('data-full-fish-guard', 'tight');
      } else {
        model.setAttribute('camera-orbit', model.dataset.fishfullBaseOrbit);
        model.setAttribute('field-of-view', model.dataset.fishfullBaseFov);
        model.setAttribute('camera-target', model.dataset.fishfullBaseTarget || '0m 0m 0m');
        model.setAttribute('min-camera-orbit', 'auto auto 2.4m');
        model.setAttribute('max-camera-orbit', 'auto auto 5m');
        model.setAttribute('data-full-fish-guard', 'comfortable');
      }

      if (!model.dataset.fishfullGuardLoadBound) {
        model.dataset.fishfullGuardLoadBound = 'true';
        model.addEventListener('load', scheduleGuard, { passive: true });
      }
    });
    lastViewportKey = currentKey;
  }

  function scheduleGuard() {
    window.clearTimeout(timer);
    timer = window.setTimeout(applyFullFishGuard, 90);
  }

  function scheduleGuardWhenViewportChanges() {
    var currentKey = viewportKey();
    if (currentKey === lastViewportKey) return;
    scheduleGuard();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleGuard);
  else scheduleGuard();

  window.addEventListener('resize', scheduleGuardWhenViewportChanges, { passive: true });
  window.addEventListener('orientationchange', scheduleGuard, { passive: true });
  window.addEventListener('pageshow', scheduleGuard, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleGuardWhenViewportChanges, { passive: true });
    window.visualViewport.addEventListener('scroll', scheduleGuardWhenViewportChanges, { passive: true });
  }
  new MutationObserver(scheduleGuard).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'camera-orbit', 'field-of-view', 'camera-target'] });
})();