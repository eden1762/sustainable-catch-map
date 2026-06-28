(function () {
  'use strict';

  var copy = {
    zh: {
      eyebrow: '掃碼即玩',
      title: '魚攤前 10 秒開局，不用研究就能開始',
      body: '掃到 FishFull QR 後，先看完整魚身，再照著四個現場按鈕走：看魚、問一句、接食譜、留回饋。魚販可以更好介紹，消費者也比較敢買。',
      actions: [
        { label: '看完整 3D 魚', href: '/ar.html#fishfull-ar-stage', hint: '先確認魚身、眼睛、魚鰓與魚紋' },
        { label: '帶一句去問', href: '/ar.html#fishfull-mission', hint: '直接用綠黃紅任務卡開口' },
        { label: '買了接食譜', href: '/pages/recipes.html', hint: '清蒸、乾煎、煮湯都能快速上手' },
        { label: '吃完十秒回饋', href: '/pages/feedback.html', hint: '幫好魚攤與友善通路被更多人看見' }
      ]
    },
    en: {
      eyebrow: 'Scan and play',
      title: 'Start at the fish stall in 10 seconds',
      body: 'After scanning a FishFull QR code, shoppers see the full fish first, then follow four on-site taps: view, ask, cook, and leave feedback. Fishmongers explain faster; buyers feel less lost.',
      actions: [
        { label: 'View the full 3D fish', href: '/ar.html#fishfull-ar-stage', hint: 'Check body, eyes, gills, and skin pattern' },
        { label: 'Ask one clear question', href: '/ar.html#fishfull-mission', hint: 'Use the green, yellow, and red mission cards' },
        { label: 'Open easy recipes', href: '/pages/recipes.html', hint: 'Steam, pan-fry, or soup without overthinking' },
        { label: 'Leave 10-sec feedback', href: '/pages/feedback.html', hint: 'Help good stalls and friendly channels get discovered' }
      ]
    }
  };

  function lang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : 'zh';
  }

  function esc(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function render() {
    var root = document.getElementById('root');
    if (!root) return;
    var main = root.querySelector('main');
    var hero = root.querySelector('.ar-game-hero');
    if (!main || !hero) return;

    var current = copy[lang()] || copy.zh;
    var existing = root.querySelector('.ar-qr-stall-panel');
    if (existing) existing.remove();

    var section = document.createElement('section');
    section.className = 'content-section ar-qr-stall-panel';
    section.innerHTML = [
      '<div class="ar-qr-stall-copy">',
        '<p class="eyebrow">' + esc(current.eyebrow) + '</p>',
        '<h2>' + esc(current.title) + '</h2>',
        '<p>' + esc(current.body) + '</p>',
      '</div>',
      '<div class="ar-qr-stall-actions">',
        current.actions.map(function (action, index) {
          return [
            '<a class="ar-qr-action" href="' + esc(action.href) + '">',
              '<span>' + String(index + 1).padStart(2, '0') + '</span>',
              '<strong>' + esc(action.label) + '</strong>',
              '<em>' + esc(action.hint) + '</em>',
            '</a>'
          ].join('');
        }).join(''),
      '</div>'
    ].join('');

    hero.insertAdjacentElement('afterend', section);
  }

  function scheduleRender() {
    window.setTimeout(render, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleRender);
  else scheduleRender();
  document.addEventListener('scm-language-change', scheduleRender);
})();