(function () {
  'use strict';

  var TIPS = {
    bream: {
      zhTitle: '拍赤鯮：先抓紅亮魚身',
      enTitle: 'Shoot bream: catch the red shine',
      zhBody: '手機斜一點，讓魚眼、魚鰓、魚身光澤同框；買前照著問，魚販也更好回答。',
      enBody: 'Tilt the phone a bit so the eye, gills, and skin shine land in one shot. It makes the counter chat way easier.',
      zhSteps: ['魚眼在右上', '魚鰓要清楚', '魚身留反光'],
      enSteps: ['Eye near top-right', 'Show the gills', 'Keep skin shine']
    },
    mackerel: {
      zhTitle: '拍花腹鯖：先抓藍背銀腹',
      enTitle: 'Shoot mackerel: get blue back, silver belly',
      zhBody: '鏡頭不要太近，讓條紋、魚腹與手指按壓位置都看得到，買回家比較不踩雷。',
      enBody: 'Do not go too close. Keep the stripes, belly, and press-test spot visible so the buy feels low-risk.',
      zhSteps: ['條紋放中間', '魚腹要亮', '留按壓位置'],
      enSteps: ['Center the stripes', 'Show bright belly', 'Leave press spot']
    },
    mahi: {
      zhTitle: '拍鬼頭刀：先抓切面乾淨感',
      enTitle: 'Shoot mahi-mahi: show the clean cut',
      zhBody: '切片時把肉色、出水狀態與厚度拍清楚；想香煎或做餐盒，直接問這批會不會乾。',
      enBody: 'For fillets, show color, moisture, and thickness. If you want bowls or searing, ask if this batch stays juicy.',
      zhSteps: ['切面要乾淨', '厚度拍出來', '避開濕爛反光'],
      enSteps: ['Clean cut', 'Show thickness', 'Avoid wet glare']
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

  function currentTone(stage) {
    return stage && stage.dataset && stage.dataset.fishTone ? stage.dataset.fishTone : 'bream';
  }

  function render(stage, coach) {
    var tip = TIPS[currentTone(stage)] || TIPS.bream;
    var isEn = lang() === 'en';
    var steps = isEn ? tip.enSteps : tip.zhSteps;
    coach.innerHTML = [
      '<strong>' + esc(isEn ? tip.enTitle : tip.zhTitle) + '</strong>',
      '<p>' + esc(isEn ? tip.enBody : tip.zhBody) + '</p>',
      '<ol>' + steps.map(function (step) { return '<li>' + esc(step) + '</li>'; }).join('') + '</ol>'
    ].join('');
  }

  function mount() {
    var stage = document.querySelector('.ar-stage');
    if (!stage || stage.dataset.angleCoach === '1') return false;
    stage.dataset.angleCoach = '1';

    var coach = document.createElement('div');
    coach.className = 'ar-angle-coach';
    coach.setAttribute('aria-live', 'polite');
    stage.appendChild(coach);
    render(stage, coach);

    var observer = new MutationObserver(function () { render(stage, coach); });
    observer.observe(stage, { attributes: true, attributeFilter: ['data-fish-tone', 'class'] });

    document.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.language-toggle')) {
        window.setTimeout(function () { render(stage, coach); }, 80);
        window.setTimeout(function () { render(stage, coach); }, 280);
      }
    });

    return true;
  }

  function wait() {
    if (!mount()) window.setTimeout(wait, 120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wait);
  else wait();
})();
