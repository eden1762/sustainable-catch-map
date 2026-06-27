(function () {
  'use strict';

  var COPY = {
    zh: {
      title: '魚攤一句話攻略',
      helper: '點一下可複製，站在攤前直接問，不尷尬。',
      copied: '已複製，拿去問魚販剛剛好。',
      fallback: '請直接問魚販：這條魚今天哪裡來？適合怎麼煮？',
      questions: {
        crimsonBream: [
          '這批赤鯮今天哪裡來？',
          '適合清蒸還是乾煎？',
          '今天的漁法與大小穩嗎？'
        ],
        mackerel: [
          '這批鯖魚油脂夠嗎？',
          '鹽烤還是乾煎比較香？',
          '今晚煮幾人份比較剛好？'
        ],
        mahiMahi: [
          '這批鬼頭刀適合切片嗎？',
          '香煎怎麼做才不會乾？',
          '適合便當還是聚餐料理？'
        ]
      }
    },
    en: {
      title: 'Fish-stall cheat lines',
      helper: 'Tap to copy, then ask at the counter with zero awkward energy.',
      copied: 'Copied. Ready for the counter.',
      fallback: 'Ask: where is this fish from today, and how should I cook it?',
      questions: {
        crimsonBream: [
          'Where is this sea bream from today?',
          'Should I steam it or pan-fry it?',
          'Is today’s size and catch method a good pick?'
        ],
        mackerel: [
          'Is this mackerel fatty enough today?',
          'Would you grill it or pan-fry it?',
          'How much should I buy for dinner?'
        ],
        mahiMahi: [
          'Is this mahi-mahi good for fillets?',
          'How do I keep it juicy when searing?',
          'Is it better for a bowl or a shared plate?'
        ]
      }
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

  function activeKey() {
    var stage = document.querySelector('.ar-stage');
    var tone = stage && stage.dataset.fishTone;
    if (tone === 'mackerel') return 'mackerel';
    if (tone === 'mahi') return 'mahiMahi';
    return 'crimsonBream';
  }

  function renderCheatsheet() {
    var panel = document.querySelector('.ar-species-panel');
    if (!panel) return;
    var currentLang = lang();
    var key = activeKey();
    var signature = currentLang + ':' + key;
    var old = panel.querySelector('.ar-market-cheatsheet');
    if (old && old.dataset.signature === signature) return;

    var text = COPY[currentLang] || COPY.zh;
    var questions = text.questions[key] || [];
    if (old) old.remove();

    var box = document.createElement('div');
    box.className = 'ar-market-cheatsheet';
    box.dataset.signature = signature;
    box.innerHTML = [
      '<strong>' + esc(text.title) + '</strong>',
      '<p>' + esc(text.helper) + '</p>',
      '<div class="ar-question-row">',
      questions.map(function (question) {
        return '<button type="button" class="ar-question-chip" data-question="' + esc(question) + '">' + esc(question) + '</button>';
      }).join(''),
      '</div>'
    ].join('');
    panel.appendChild(box);
  }

  function toast(message) {
    var node = document.querySelector('[data-ar-toast]');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    window.setTimeout(function () { node.classList.remove('show'); }, 2200);
  }

  async function copyQuestion(question) {
    var text = COPY[lang()] || COPY.zh;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(question);
        toast(text.copied);
      } else {
        toast(question || text.fallback);
      }
    } catch (error) {
      toast(question || text.fallback);
    }
  }

  function bind() {
    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('.ar-question-chip');
      if (!button) return;
      copyQuestion(button.dataset.question || button.textContent || '');
    });
    document.addEventListener('scm-language-change', function () {
      window.setTimeout(renderCheatsheet, 120);
    });
  }

  function watchPanel() {
    var root = document.querySelector('.sustainability-layout .model-stage') || document.body;
    if (!root) return;
    var observer = new MutationObserver(function () { renderCheatsheet(); });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-fish-tone'] });
    renderCheatsheet();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bind(); watchPanel(); });
  } else {
    bind();
    watchPanel();
  }
})();
