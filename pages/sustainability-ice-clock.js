(function () {
  'use strict';

  var COPY = {
    bream: {
      zhTitle: '離冰快看',
      enTitle: 'Ice clock',
      zhBadge: '整尾鮮度',
      enBadge: 'Whole fish timer',
      zhLead: '赤鯮整尾離開冰面太久，魚眼與魚鰓會先露餡。請魚販幫你翻面看肚線，安心再買。',
      enLead: 'Whole bream loses clarity first around the eyes and gills. Ask your fishmonger to flip it and show the belly line before you buy.',
      zhSteps: ['離冰少於 5 分鐘：光澤最穩', '5–10 分鐘：看眼睛與鰓色', '超過 10 分鐘：請放回冰上再判斷'],
      enSteps: ['Under 5 min off ice: shine reads best', '5–10 min: check eyes and gills', 'Over 10 min: ask to re-chill before deciding'],
      zhAsk: '可以幫我放回冰上看一下魚眼跟鰓嗎？',
      enAsk: 'Could you set it back on ice so I can check the eyes and gills?'
    },
    mackerel: {
      zhTitle: '離冰快看',
      enTitle: 'Ice clock',
      zhBadge: '油脂保鮮',
      enBadge: 'Oil-rich fish',
      zhLead: '花腹鯖油脂多，離冰後味道變化快。先看銀腹亮不亮，再聞有沒有舒服海味。',
      enLead: 'Mackerel is oil-rich, so warmth changes its aroma fast. Read the silver belly first, then check for clean ocean smell.',
      zhSteps: ['離冰少於 3 分鐘：條紋最好看', '3–8 分鐘：聞味道、看銀腹', '超過 8 分鐘：請先回冰，別硬買'],
      enSteps: ['Under 3 min off ice: stripes read best', '3–8 min: smell and check silver belly', 'Over 8 min: re-chill first, no pressure buy'],
      zhAsk: '這尾剛離冰多久？可以靠近聞一下嗎？',
      enAsk: 'How long has this been off ice? May I check the aroma up close?'
    },
    mahi: {
      zhTitle: '離冰快看',
      enTitle: 'Ice clock',
      zhBadge: '切片狀態',
      enBadge: 'Cut fish timer',
      zhLead: '鬼頭刀切片要看切面水分與肉色。離冰久了邊緣會乾、顏色會鈍，料理口感也會掉。',
      enLead: 'For mahi-mahi cuts, read moisture and color on the cut surface. If edges dry out, texture drops at the pan.',
      zhSteps: ['離冰少於 5 分鐘：切面水亮', '5–12 分鐘：看邊緣是否乾白', '超過 12 分鐘：問保存時間再決定'],
      enSteps: ['Under 5 min off ice: cut surface glows', '5–12 min: check dry pale edges', 'Over 12 min: ask storage time first'],
      zhAsk: '這片切好多久？可以看一下邊緣跟厚度嗎？',
      enAsk: 'When was this cut? Could I check the edge and thickness?'
    }
  };

  function lang() {
    return localStorage.getItem('scm-language') === 'en' || document.documentElement.lang === 'en' ? 'en' : 'zh';
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function get(item, key) {
    return lang() === 'en' ? item['en' + key] : item['zh' + key];
  }

  function render(stage) {
    if (!stage) return;
    var tone = stage.dataset.fishTone || 'bream';
    var item = COPY[tone] || COPY.bream;
    var card = stage.querySelector('[data-ar-ice-clock]');
    if (!card) {
      card = document.createElement('aside');
      card.className = 'ar-ice-clock';
      card.setAttribute('data-ar-ice-clock', '');
      card.setAttribute('aria-live', 'polite');
      var anchor = stage.querySelector('[data-ar-light-check]') || stage.querySelector('.ar-toolbar');
      stage.insertBefore(card, anchor || null);
    }

    card.innerHTML = [
      '<div class="ar-ice-clock__dial" aria-hidden="true"><span></span></div>',
      '<div class="ar-ice-clock__body">',
      '  <div class="ar-ice-clock__head">',
      '    <strong>' + esc(get(item, 'Title')) + '</strong>',
      '    <span>' + esc(get(item, 'Badge')) + '</span>',
      '  </div>',
      '  <p>' + esc(get(item, 'Lead')) + '</p>',
      '  <ol>' + get(item, 'Steps').map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol>',
      '  <button class="ar-ice-clock__ask" type="button">' + esc(get(item, 'Ask')) + '</button>',
      '</div>'
    ].join('');
  }

  function boot() {
    var stage = document.querySelector('.ar-stage');
    if (!stage) {
      window.setTimeout(boot, 140);
      return;
    }
    render(stage);
    new MutationObserver(function (mutations) {
      if (mutations.some(function (mutation) { return mutation.attributeName === 'data-fish-tone'; })) render(stage);
    }).observe(stage, { attributes: true });
    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.language-toggle')) {
        window.setTimeout(function () { render(stage); }, 120);
        window.setTimeout(function () { render(stage); }, 320);
      }
      var ask = event.target.closest && event.target.closest('.ar-ice-clock__ask');
      if (ask && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ask.textContent.trim()).then(function () {
          ask.classList.add('is-copied');
          window.setTimeout(function () { ask.classList.remove('is-copied'); }, 900);
        }).catch(function () {});
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
