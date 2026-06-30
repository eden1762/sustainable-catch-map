(function () {
  'use strict';

  var copy = {
    zh: [
      { tone: 'green', tag: '綠燈', title: '眼亮、鰓紅、來源清楚', body: '可以安心問料理與份量，接著決定要不要買。' },
      { tone: 'yellow', tag: '黃燈', title: '看起來可以，但資訊還少', body: '先問今天進貨、保存方式與兩人份大小。' },
      { tone: 'red', tag: '紅燈', title: '氣味重、魚身乾、來源不清', body: '先換一條，或找更熟悉的友善通路。' }
    ],
    en: [
      { tone: 'green', tag: 'Green', title: 'Bright eyes, red gills, clear origin', body: 'Ask about cooking style and serving size, then decide.' },
      { tone: 'yellow', tag: 'Yellow', title: 'Looks fine, but details are thin', body: 'Ask when it arrived, how it was kept, and if it fits two people.' },
      { tone: 'red', tag: 'Red', title: 'Strong smell, dry body, unclear origin', body: 'Switch fish or choose a more trusted friendly channel.' }
    ]
  };

  function lang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function esc(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function card(item) {
    return [
      '<article class="ar-buy-light-card" data-tone="' + esc(item.tone) + '">',
        '<em>' + esc(item.tag) + '</em>',
        '<strong>' + esc(item.title) + '</strong>',
        '<span>' + esc(item.body) + '</span>',
      '</article>'
    ].join('');
  }

  function render() {
    var side = document.querySelector('.page-ar-game .ar-side-copy');
    var heading = side ? side.querySelector('.section-heading') : null;
    if (!side || !heading) return;

    var existing = side.querySelector('.ar-buy-light-cues');
    var current = lang();
    var items = copy[current] || copy.zh;
    var html = items.map(card).join('');

    if (!existing) {
      existing = document.createElement('div');
      existing.className = 'ar-buy-light-cues';
      existing.setAttribute('aria-label', current === 'en' ? 'Buy-light seafood cues' : '買魚紅黃綠判斷');
      heading.insertAdjacentElement('afterend', existing);
    }

    existing.setAttribute('aria-label', current === 'en' ? 'Buy-light seafood cues' : '買魚紅黃綠判斷');
    if (existing.innerHTML !== html) existing.innerHTML = html;
  }

  function schedule() {
    window.requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();
  document.addEventListener('scm-language-change', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
