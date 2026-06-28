(function () {
  'use strict';

  var copy = {
    zh: {
      eyebrow: 'AR 選魚小教練',
      title: '看完 3D 魚，直接知道下一步怎麼買、怎麼煮',
      body: '在魚攤前先選今天的情境，FishFull 會同步切換上方 3D 魚，再把魚種、燈號、問法和零失敗料理接起來。手機上這一段固定放在魚模型下方，不會蓋住完整魚身。',
      pickLabel: '今天比較像哪一種？',
      syncNote: '已同步上方 3D 魚，先看完整魚身再開口問。',
      bodyCheckTitle: '完整魚身先看這 3 點',
      stallBadge: '攤',
      copyAskLabel: '一鍵帶去問',
      copiedAskLabel: '已準備好，可以拿給魚販看',
      missionTitle: '現場三步驟任務',
      missionHint: '點一下代表完成，買魚更有節奏。',
      missionDone: '已完成 {count}/3，下一步更清楚。',
      missionComplete: '三步都完成，可以安心把魚帶回家。',
      missionSteps: ['看完整魚身', '問來源與鮮度', '接料理做法'],
      options: [
        {
          key: 'safe',
          fishKey: 'crimsonBream',
          tone: 'green',
          label: '第一次買，想穩穩煮好',
          fish: '赤鯮',
          light: '綠燈',
          lightText: '魚眼清亮、魚鰓鮮紅、魚身有光澤就可以安心往下一步。',
          bodyChecks: ['眼睛清亮不霧', '鰓色偏紅不灰', '魚身挺、鱗片有光'],
          stallLine: '可以請魚販直接補一句：這條怎麼料理最穩、幾人份最剛好。',
          ask: '這條今天適合清蒸還是乾煎？兩個人吃大概挑多大？',
          cook: '建議先走清蒸或乾煎，調味簡單，魚肉甜味比較不會被蓋掉。',
          cta: '接零失敗食譜',
          href: '/pages/recipes.html'
        },
        {
          key: 'daily',
          fishKey: 'mackerel',
          tone: 'yellow',
          label: '想買日常好吃又不踩雷',
          fish: '花腹鯖',
          light: '黃燈',
          lightText: '油脂香很適合日常餐桌，但要多問保存時間、來源與今天建議做法。',
          bodyChecks: ['背部花紋清楚', '肚腹不軟塌', '聞起來是海味不是腥味'],
          stallLine: '可以請魚販幫你確認保存狀態，再推薦今天最不容易失手的煎、烤做法。',
          ask: '這批是今天進的嗎？回家鹽烤或乾煎哪個更穩？',
          cook: '建議鹽烤、乾煎或氣炸，先把表面水分擦乾，香氣會更漂亮。',
          cta: '看主推魚資訊',
          href: '/pages/fish.html'
        },
        {
          key: 'pause',
          fishKey: 'mackerel',
          tone: 'red',
          label: '資訊不清楚，先不要衝動買',
          fish: '先暫停確認',
          light: '紅燈',
          lightText: '來源、保存、魚身狀態說不清楚時，先問清楚再決定，別讓晚餐變踩雷現場。',
          bodyChecks: ['眼睛混濁或凹陷', '鰓色偏灰或有異味', '魚身軟塌、表面黏膩'],
          stallLine: '可以請魚販補上來源、進貨時間與建議料理；講得清楚再買，講不清楚就換一尾。',
          ask: '這條來源、進貨時間和保存方式可以再跟我說清楚嗎？如果不適合今天吃，有沒有更穩的選擇？',
          cook: '如果狀態不明，先不要硬煮。改挑資訊清楚、氣味乾淨、魚身有彈性的魚，餐桌會更安心。',
          cta: '看燈號怎麼判斷',
          href: '/pages/sustainability.html'
        },
        {
          key: 'party',
          fishKey: 'mahiMahi',
          tone: 'green',
          label: '想做有存在感的一餐',
          fish: '鬼頭刀',
          light: '綠燈',
          lightText: '肉厚、口感明顯，適合做香煎、烤魚、餐盒或多人分享。',
          bodyChecks: ['魚皮光澤乾淨', '肉面有彈性', '厚切部位不出水'],
          stallLine: '可以請魚販幫你挑厚度平均的部位，回家比較好煎，也更有桌面氣勢。',
          ask: '這塊適合切厚煎嗎？今天有沒有更適合多人吃的部位？',
          cook: '建議香煎或烤魚，搭檸檬、胡椒、橄欖油就很有餐廳感。',
          cta: '找友善通路',
          href: '/pages/map.html'
        }
      ]
    },
    en: {
      eyebrow: 'AR buying coach',
      title: 'After the 3D fish view, know what to buy and how to cook it',
      body: 'Pick your market moment and FishFull switches the 3D fish above, then connects fish choice, color cue, fishmonger question, and an easy cooking next step. On mobile, this stays below the fish model, so it never covers the full body.',
      pickLabel: 'What are you buying for today?',
      syncNote: 'The 3D fish above is synced. View the full body first, then ask at the counter.',
      bodyCheckTitle: 'Check these 3 full-body cues first',
      stallBadge: 'Shop',
      copyAskLabel: 'One-tap question',
      copiedAskLabel: 'Ready to show your fishmonger',
      missionTitle: 'Three-step market mission',
      missionHint: 'Tap each step when done, so buying feels easier.',
      missionDone: '{count}/3 done. Your next move is clearer.',
      missionComplete: 'All three steps are done. You are ready to bring the fish home.',
      missionSteps: ['View the whole fish', 'Ask origin and freshness', 'Open the cooking move'],
      options: [
        {
          key: 'safe',
          fishKey: 'crimsonBream',
          tone: 'green',
          label: 'First-time buy, keep it foolproof',
          fish: 'Crimson sea bream',
          light: 'Green',
          lightText: 'Clear eyes, red gills, and glossy skin? You are good to ask the next step.',
          bodyChecks: ['Clear, bright eyes', 'Red gills, not gray', 'Firm body with glossy scales'],
          stallLine: 'Ask the fishmonger for the safest cooking style and the right size for your table.',
          ask: 'Is this better steamed or pan-fried today, and what size works for two?',
          cook: 'Start with steaming or pan-frying. Keep seasoning simple so the sweet, delicate meat can shine.',
          cta: 'Open easy recipes',
          href: '/pages/recipes.html'
        },
        {
          key: 'daily',
          fishKey: 'mackerel',
          tone: 'yellow',
          label: 'Everyday tasty, low-risk dinner',
          fish: 'Pacific mackerel',
          light: 'Yellow',
          lightText: 'Rich and great for daily meals, but ask about holding time, origin, and the best cooking style today.',
          bodyChecks: ['Sharp back pattern', 'Belly is not mushy', 'Clean sea smell, not harsh'],
          stallLine: 'Ask the fishmonger to confirm handling and point you to the least risky grill or pan-fry move.',
          ask: 'Did this arrive today? Would grilling or pan-frying be the safer move?',
          cook: 'Try grilling, pan-frying, or air-frying. Pat it dry first for better aroma and texture.',
          cta: 'View featured fish',
          href: '/pages/fish.html'
        },
        {
          key: 'pause',
          fishKey: 'mackerel',
          tone: 'red',
          label: 'Info is unclear, pause before buying',
          fish: 'Pause and confirm',
          light: 'Red',
          lightText: 'When origin, handling, or body cues are unclear, ask before you buy. No dinner-table jump scares.',
          bodyChecks: ['Cloudy or sunken eyes', 'Gray gills or off smell', 'Soft body or sticky surface'],
          stallLine: 'Ask for origin, arrival time, and handling. If the answer is fuzzy, pick a cleaner, clearer option.',
          ask: 'Can you tell me the origin, arrival time, and handling for this fish? If it is not ideal for tonight, what is the safer pick?',
          cook: 'Do not force it if the cues feel off. Choose a fish with clear info, clean aroma, and firm body instead.',
          cta: 'Learn the color cues',
          href: '/pages/sustainability.html'
        },
        {
          key: 'party',
          fishKey: 'mahiMahi',
          tone: 'green',
          label: 'Make a dinner-table moment',
          fish: 'Mahi-mahi',
          light: 'Green',
          lightText: 'Firm, meaty, and easy to share. Great for searing, roasting, bowls, and group meals.',
          bodyChecks: ['Clean, glossy skin', 'Springy flesh surface', 'Thick cuts are not watery'],
          stallLine: 'Ask for an even, thick piece so it sears cleanly and lands with real table presence.',
          ask: 'Is this good for thick-cut searing, and do you have a better piece for sharing?',
          cook: 'Sear or roast it with lemon, pepper, and olive oil for a clean restaurant-style vibe.',
          cta: 'Find friendly channels',
          href: '/pages/map.html'
        }
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

  function bodyCheck(option, text) {
    return [
      '<div class="ar-coach-bodycheck">',
        '<strong>' + esc(text.bodyCheckTitle) + '</strong>',
        '<ul>',
          option.bodyChecks.map(function (item) {
            return '<li>' + esc(item) + '</li>';
          }).join(''),
        '</ul>',
      '</div>'
    ].join('');
  }

  function askCard(option, text) {
    return [
      '<div class="ar-coach-detail ar-coach-ask-card">',
        '<strong>Q</strong>',
        '<div>',
          '<p>' + esc(option.ask) + '</p>',
          '<button type="button" class="ar-coach-copy-ask" data-copy-ask="' + esc(option.ask) + '" data-copy-label="' + esc(text.copyAskLabel) + '" data-copied-label="' + esc(text.copiedAskLabel) + '">' + esc(text.copyAskLabel) + '</button>',
        '</div>',
      '</div>'
    ].join('');
  }

  function mission(option, text) {
    return [
      '<div class="ar-coach-mission" data-mission="' + esc(option.key) + '">',
        '<div>',
          '<strong>' + esc(text.missionTitle) + '</strong>',
          '<p>' + esc(text.missionHint) + '</p>',
        '</div>',
        '<div class="ar-coach-mission-steps">',
          text.missionSteps.map(function (step, index) {
            return '<button type="button" data-mission-step="' + index + '" aria-pressed="false"><span>' + (index + 1) + '</span>' + esc(step) + '</button>';
          }).join(''),
        '</div>',
        '<p class="ar-coach-progress" aria-live="polite">' + esc(text.missionDone.replace('{count}', '0')) + '</p>',
      '</div>'
    ].join('');
  }

  function card(option, text) {
    return [
      '<div class="ar-coach-result" data-result="' + esc(option.key) + '" data-tone="' + esc(option.tone || 'green') + '">',
        '<div class="ar-coach-main">',
          '<span>' + esc(option.light) + '</span>',
          '<h3>' + esc(option.fish) + '</h3>',
          '<p>' + esc(option.lightText) + '</p>',
        '</div>',
        '<div class="ar-coach-detail ar-coach-sync">',
          '<strong>🐟</strong>',
          '<p>' + esc(text.syncNote) + '</p>',
        '</div>',
        bodyCheck(option, text),
        '<div class="ar-coach-detail ar-coach-stall-line">',
          '<strong>' + esc(text.stallBadge) + '</strong>',
          '<p>' + esc(option.stallLine) + '</p>',
        '</div>',
        askCard(option, text),
        '<div class="ar-coach-detail">',
          '<strong>🍳</strong>',
          '<p>' + esc(option.cook) + '</p>',
        '</div>',
        mission(option, text),
        '<a href="' + esc(option.href) + '">' + esc(option.cta) + ' →</a>',
      '</div>'
    ].join('');
  }

  function syncFishModel(fishKey) {
    if (!fishKey) return;
    var tries = 0;
    function attempt() {
      var button = document.querySelector('[data-fish="' + fishKey + '"]');
      if (button) {
        if (button.getAttribute('aria-pressed') !== 'true') button.click();
        return;
      }
      tries += 1;
      if (tries < 8) window.setTimeout(attempt, 120);
    }
    attempt();
  }

  function bindMission(section, text) {
    Array.prototype.slice.call(section.querySelectorAll('.ar-coach-mission')).forEach(function (missionBlock) {
      var progress = missionBlock.querySelector('.ar-coach-progress');
      var steps = Array.prototype.slice.call(missionBlock.querySelectorAll('[data-mission-step]'));
      function update() {
        var count = steps.filter(function (step) { return step.getAttribute('aria-pressed') === 'true'; }).length;
        progress.textContent = count === steps.length ? text.missionComplete : text.missionDone.replace('{count}', String(count));
      }
      steps.forEach(function (step) {
        step.addEventListener('click', function () {
          var isDone = step.getAttribute('aria-pressed') === 'true';
          step.setAttribute('aria-pressed', isDone ? 'false' : 'true');
          update();
        });
      });
      update();
    });
  }

  function copyAskText(button) {
    var value = button.getAttribute('data-copy-ask') || '';
    var copiedLabel = button.getAttribute('data-copied-label') || button.textContent;
    var resetLabel = button.getAttribute('data-copy-label') || button.textContent;

    function markCopied() {
      button.textContent = copiedLabel;
      button.setAttribute('aria-live', 'polite');
      window.setTimeout(function () {
        button.textContent = resetLabel;
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(markCopied).catch(markCopied);
      return;
    }

    markCopied();
  }

  function bindCopyAsk(section) {
    Array.prototype.slice.call(section.querySelectorAll('[data-copy-ask]')).forEach(function (button) {
      button.addEventListener('click', function () {
        copyAskText(button);
      });
    });
  }

  function bind(section, text) {
    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-coach-pick]'));
    var results = Array.prototype.slice.call(section.querySelectorAll('[data-result]'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-coach-pick');
        buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
        results.forEach(function (item) { item.hidden = item.getAttribute('data-result') !== key; });
        syncFishModel(button.getAttribute('data-coach-fish'));
      });
    });
    bindMission(section, text);
    bindCopyAsk(section);
  }

  function render() {
    var root = document.getElementById('root');
    if (!root) return;
    var stage = root.querySelector('#fishfull-ar-stage');
    if (!stage || root.querySelector('.ar-fish-coach')) return;

    var text = copy[lang()] || copy.zh;
    var section = document.createElement('section');
    section.className = 'content-section ar-fish-coach';
    section.innerHTML = [
      '<div class="section-heading">',
        '<p class="eyebrow">' + esc(text.eyebrow) + '</p>',
        '<h2>' + esc(text.title) + '</h2>',
        '<p>' + esc(text.body) + '</p>',
      '</div>',
      '<div class="ar-coach-panel">',
        '<div class="ar-coach-picks" aria-label="' + esc(text.pickLabel) + '">',
          '<strong>' + esc(text.pickLabel) + '</strong>',
          text.options.map(function (option, index) {
            return '<button type="button" data-coach-pick="' + esc(option.key) + '" data-coach-fish="' + esc(option.fishKey) + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' + esc(option.label) + '</button>';
          }).join(''),
        '</div>',
        '<div class="ar-coach-results">',
          text.options.map(function (option, index) {
            var html = card(option, text);
            return index === 0 ? html : html.replace('<div class="ar-coach-result"', '<div class="ar-coach-result" hidden');
          }).join(''),
        '</div>',
      '</div>'
    ].join('');

    stage.insertAdjacentElement('afterend', section);
    bind(section, text);
    syncFishModel(text.options[0] && text.options[0].fishKey);
  }

  function scheduleRender() {
    window.setTimeout(render, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleRender);
  else scheduleRender();
  document.addEventListener('scm-language-change', function () {
    var old = document.querySelector('.ar-fish-coach');
    if (old) old.remove();
    scheduleRender();
  });
})();