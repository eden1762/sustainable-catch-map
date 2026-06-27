(function () {
  'use strict';

  var COPY = {
    bream: {
      zhTitle: '掃碼後 30 秒決策',
      enTitle: '30-second QR choice',
      zhBadge: '黃燈先問清楚',
      enBadge: 'Yellow: ask first',
      zhLead: '赤鯮適合想吃細緻口感的人，但先把來源與漁法問清楚，這餐才買得安心。',
      enLead: 'Crimson sea bream is a delicate dinner pick. Confirm origin and catch method before you commit.',
      zhSteps: ['綠：眼亮、鰓紅、來源說得清楚', '黃：魚況好，但產地或漁法還不明', '紅：鰓暗、魚身黏、味道不舒服'],
      enSteps: ['Green: clear eyes, bright gills, clear origin', 'Yellow: fish looks good, but origin or method is unclear', 'Red: dull gills, sticky skin, off smell'],
      zhAsk: '這尾赤鯮今天哪裡來？用什麼方式捕的？',
      enAsk: 'Where is this bream from today, and how was it caught?',
      zhVendor: '給魚販：先說「今天赤鯮肉細，清蒸最甜」，再補來源與漁法，客人會更敢買。',
      enVendor: 'For fishmongers: lead with “delicate, sweet when steamed,” then add origin and catch method to build trust.',
      zhVendorCta: '複製魚販說法',
      enVendorCta: 'Copy seller line',
      zhRecipe: '買了就走清蒸：蔥薑、少油，先吃魚甜味。',
      enRecipe: 'Bought it? Steam with scallion and ginger, then let the sweetness lead.',
      recipeHref: '/pages/recipes.html#steam'
    },
    mackerel: {
      zhTitle: '掃碼後 30 秒決策',
      enTitle: '30-second QR choice',
      zhBadge: '綠燈日常好煮',
      enBadge: 'Green: easy daily fish',
      zhLead: '花腹鯖最怕放太久。先看銀腹與條紋，再聞味道，適合就直接帶回家鹽烤。',
      enLead: 'Mackerel rewards fast decisions. Read the belly, stripes, and aroma, then take it home for a crisp grill.',
      zhSteps: ['綠：銀腹亮、條紋清、海味舒服', '黃：油脂夠，但離冰時間要再問', '紅：腥味重、魚腹軟、表面發暗'],
      enSteps: ['Green: silver belly, clear stripes, clean ocean aroma', 'Yellow: good fat, but ask time off ice', 'Red: heavy smell, soft belly, dull surface'],
      zhAsk: '這批花腹鯖剛離冰多久？今天適合鹽烤嗎？',
      enAsk: 'How long has this mackerel been off ice, and is it good for grilling today?',
      zhVendor: '給魚販：先說「這批花腹鯖油脂漂亮，擦乾鹽烤就香」，再提醒離冰時間。',
      enVendor: 'For fishmongers: say “good fat, crisp skin when grilled,” then share time off ice clearly.',
      zhVendorCta: '複製魚販說法',
      enVendorCta: 'Copy seller line',
      zhRecipe: '買了就走鹽烤：擦乾、薄鹽、魚皮煎香。',
      enRecipe: 'Bought it? Pat dry, salt lightly, and crisp the skin.',
      recipeHref: '/pages/recipes.html#grill'
    },
    mahi: {
      zhTitle: '掃碼後 30 秒決策',
      enTitle: '30-second QR choice',
      zhBadge: '綠燈厚切好料理',
      enBadge: 'Green: firm fillet win',
      zhLead: '鬼頭刀適合想要厚切、香煎、餐盒的人。先看切面與厚度，問保存時間再決定。',
      enLead: 'Mahi-mahi is a firm fillet win for searing and bowls. Check the cut surface and storage time first.',
      zhSteps: ['綠：切面乾淨、肉厚、沒有刺鼻味', '黃：看起來可買，但邊緣略乾要快煮', '紅：切面出水、顏色鈍、聞起來怪'],
      enSteps: ['Green: clean cut, thick flesh, no harsh smell', 'Yellow: buyable, but dry edges mean cook soon', 'Red: watery cut, dull color, strange smell'],
      zhAsk: '這片鬼頭刀切好多久？香煎會不會太乾？',
      enAsk: 'When was this mahi-mahi cut, and how do I sear it without drying it out?',
      zhVendor: '給魚販：先說「鬼頭刀厚切不易碎，香煎、便當都穩」，再講切片時間。',
      enVendor: 'For fishmongers: say “firm fillet, great for searing and bowls,” then share when it was cut.',
      zhVendorCta: '複製魚販說法',
      enVendorCta: 'Copy seller line',
      zhRecipe: '買了就走香煎：厚片先擦乾，中火煎到邊緣轉白。',
      enRecipe: 'Bought it? Sear a dry thick cut until the edges turn pearly.',
      recipeHref: '/pages/recipes.html#sear'
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
    var recipeLabel = lang() === 'en' ? 'Open zero-fail recipe' : '打開零失敗食譜';
    var vendorLabel = lang() === 'en' ? 'Fish stall trust line' : '魚攤成交短句';
    var card = stage.querySelector('[data-ar-qr-decision]');
    if (!card) {
      card = document.createElement('aside');
      card.className = 'ar-qr-decision';
      card.setAttribute('data-ar-qr-decision', '');
      card.setAttribute('aria-live', 'polite');
      var anchor = stage.querySelector('[data-ar-ice-clock]') || stage.querySelector('.ar-toolbar');
      stage.insertBefore(card, anchor || null);
    }

    card.innerHTML = [
      '<div class="ar-qr-decision__top">',
      '  <strong>' + esc(get(item, 'Title')) + '</strong>',
      '  <span>' + esc(get(item, 'Badge')) + '</span>',
      '</div>',
      '<p>' + esc(get(item, 'Lead')) + '</p>',
      '<ul class="ar-qr-decision__steps">' + get(item, 'Steps').map(function (step, index) {
        return '<li><b>' + (index + 1) + '</b><span>' + esc(step) + '</span></li>';
      }).join('') + '</ul>',
      '<button class="ar-qr-decision__ask" type="button">' + esc(get(item, 'Ask')) + '</button>',
      '<div class="ar-qr-decision__vendor">',
      '  <small>' + esc(vendorLabel) + '</small>',
      '  <p>' + esc(get(item, 'Vendor')) + '</p>',
      '  <button class="ar-qr-decision__vendor-copy" type="button" data-copy-text="' + esc(get(item, 'Vendor')) + '">' + esc(get(item, 'VendorCta')) + '</button>',
      '</div>',
      '<a class="ar-qr-decision__recipe" href="' + esc(item.recipeHref) + '">',
      '  <span>' + esc(get(item, 'Recipe')) + '</span>',
      '  <b>' + esc(recipeLabel) + '</b>',
      '</a>'
    ].join('');
  }

  function copyButton(button, text) {
    if (!button || !navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(text).then(function () {
      button.classList.add('is-copied');
      window.setTimeout(function () { button.classList.remove('is-copied'); }, 900);
    }).catch(function () {});
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
      var ask = event.target.closest && event.target.closest('.ar-qr-decision__ask');
      if (ask) copyButton(ask, ask.textContent.trim());
      var vendor = event.target.closest && event.target.closest('.ar-qr-decision__vendor-copy');
      if (vendor) copyButton(vendor, vendor.getAttribute('data-copy-text') || vendor.textContent.trim());
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();