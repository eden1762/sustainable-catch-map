(function () {
  var STORAGE_KEY = 'scm-language';
  var isApplying = false;

  var zhToEn = {
    '永續漁獲地圖': 'Sustainable Catch Map',
    '我們的理念': 'Our Philosophy',
    '友善海鮮地圖': 'Friendly Seafood Map',
    '附近的友善海鮮地圖': 'Nearby Friendly Seafood Restaurants',
    'AR 與永續標籤': 'AR & Sustainability Labels',
    'AR互動與永續標籤': 'AR Interaction & Sustainability Labels',
    '從白色沙灘出發，看見海鮮選擇與海洋永續的連結': 'Start from the white beach and see how seafood choices connect with ocean sustainability',
    'Sustainable Catch Map 希望整合 AI 推薦、漁獲資訊與永續標籤， 幫助消費者找到友善海鮮，也讓漁業、餐飲與教育場域一起支持海洋資源管理。': 'Sustainable Catch Map brings together AI recommendations, seafood information, and sustainability labels to help consumers find ocean-friendly seafood while connecting fisheries, restaurants, and education with better resource stewardship.',
    '看見永續初衷': 'See the purpose of sustainability',
    '看見永續的初衷': 'See the purpose of sustainability',
    '找附近友善海鮮': 'Find nearby friendly seafood',
    '理解永續標籤': 'Understand sustainability labels',
    '3D 理念導覽': '3D philosophy guide',
    '3D 友善小魚': '3D friendly fish',
    '3D 牛頓擺球組': '3D Newton cradle',
    '了解我們的理念：以 AI、資料地圖與互動教育，讓每一次海鮮選擇更透明、更友善海洋。': 'Learn our philosophy: using AI, data maps, and interactive education to make every seafood choice clearer and kinder to the ocean.',
    '跟著小魚游向附近友善海鮮據點，探索推薦路線與在地永續資訊。': 'Follow the little fish to nearby friendly seafood spots and explore recommended routes and local sustainability information.',
    '透過像牛頓擺一樣有節奏的互動，理解海鮮來源、標籤與永續價值。': 'Use rhythmic interaction inspired by a Newton cradle to understand seafood origin, labels, and sustainability value.',
    'Sustainable Catch Map（永續漁人地圖）的核心理念，是把「海洋永續」轉化成一般人看得懂、找得到、願意行動的日常選擇。 我們運用 AI、大數據與 AR/VR 互動體驗，整合漁獲季節、產地來源、永續標籤與友善店家資訊， 讓消費者、漁民、餐飲業者與教育單位都能用更直覺的方式參與永續漁業。': 'The core idea of Sustainable Catch Map is to turn ocean sustainability into everyday choices that people can understand, find, and act on. We use AI, data, and AR/VR interaction to connect seafood seasons, origins, sustainability labels, and friendly stores so consumers, fishers, restaurants, and educators can all take part more intuitively.',
    '回到沉浸式首頁': 'Back to immersive home',
    '探索友善海鮮據點': 'Explore friendly seafood spots',
    '理念一：看見海洋壓力': 'Idea 1: See the pressure on the ocean',
    '過度捕撈、氣候變遷與來源標示不清，讓消費者難以判斷哪些海鮮真正友善環境；因此我們希望先把複雜資訊轉化為清楚、可理解的判斷依據。': 'Overfishing, climate change, and unclear origin labels make it hard for consumers to know which seafood is truly ocean-friendly. We first turn complex information into clear and understandable guidance.',
    '理念二：用科技降低門檻': 'Idea 2: Use technology to lower the barrier',
    '我們結合 AI 分析、季節漁獲資料、永續標準與在地據點，協助大眾理解當季適合選擇的魚種、產地來源與友善消費路徑。': 'We combine AI analysis, seasonal seafood data, sustainability standards, and local locations to help people understand suitable seasonal species, origins, and friendly consumption routes.',
    '理念三：讓選擇形成改變': 'Idea 3: Turn choices into change',
    '透過友善海鮮地圖、AR 互動標籤與教育內容，讓永續海鮮不只是專業議題，而是日常生活中看得懂、找得到、也願意支持的行動。': 'Through a friendly seafood map, AR interactive labels, and educational content, sustainable seafood becomes more than an expert topic: it becomes an action people can understand, find, and support in daily life.',
    '理念實踐方向': 'How we put the idea into practice',
    '先用清楚文字、視覺化資料與互動場景，降低民眾理解永續海鮮的門檻。': 'Use clear writing, visualized data, and interactive scenes to make sustainable seafood easier to understand.',
    '再透過地圖與標籤資訊，串接餐廳、超市、市場與在地漁港等友善據點。': 'Use maps and label information to connect friendly restaurants, supermarkets, markets, and local fishing ports.',
    '最後以 AI 推薦與 AR 教育模組，推動更透明、更有參與感、也更容易被採納的永續消費模式。': 'Use AI recommendations and AR education modules to promote a more transparent, engaging, and adoptable model of sustainable consumption.',
    '即時據點': 'Live locations',
    '資料透明': 'Transparent data',
    '教育互動': 'Interactive education',
    '附近友善海鮮據點': 'Nearby friendly seafood spots',
    '探索附近友善海鮮據點': 'Explore nearby friendly seafood spots',
    '用互動地圖探索附近友善海鮮據點。': 'Explore nearby friendly seafood locations with an interactive map.',
    '透過 AR 互動與 3D 模型理解永續標籤。': 'Understand sustainability labels through AR interaction and 3D models.',
    '更多聯絡方式': 'More contact options',
    '切換中文英文': 'Switch Chinese / English',
    '目前聚焦': 'Current Focus',
    '透過地圖快速找到身邊支持永續漁法、友善養殖與產地透明的海鮮店家。從漁獲來源、販售品項到店家位置一目了然，讓你安心選購新鮮海味，也用每一次消費支持海洋永續與在地漁民。': 'Quickly find nearby seafood stores that support sustainable fishing, responsible aquaculture, and transparent origins. See seafood sources, product types, and store locations at a glance, so every purchase can support ocean sustainability and local fishers.',
    '掃描永續標籤，開啟專屬 AR 海洋互動任務！玩家可透過手機探索漁獲故事、解鎖知識徽章、完成永續挑戰，讓海鮮選購不只是消費，更像一場有趣的海洋冒險。用遊戲化體驗提升參與感，讓永續觀念自然被看見、被分享。': 'Scan sustainability labels to start your own AR ocean mission. Players can use their phones to explore seafood stories, unlock knowledge badges, and complete sustainability challenges, turning seafood shopping into an engaging ocean adventure.',
    '提示：滑鼠拖曳可 720° 環視，移到 3D 物件上會觸發動態效果。': 'Tip: drag to view the scene in 720 degrees. Hover over 3D objects to trigger animations.',
    'AR 互動與永續標籤': 'AR Interaction & Sustainability Labels',
    'AR 與永續標籤': 'AR & Sustainability Labels',
    '資源狀態': 'Resource status',
    '確認是否為非過度捕撈、恢復中或季節性適合食用的魚種。': 'Check whether the species is not overfished, recovering, or suitable to eat in the current season.',
    '漁法資訊': 'Fishing method',
    '標示延繩釣、定置網、養殖等方式，協助使用者理解環境影響。': 'Shows methods such as longline fishing, set nets, and aquaculture to help users understand environmental impact.',
    '產地與足跡': 'Origin and footprint',
    '顯示產地、運輸距離與在地採購指標，讓購買更透明。': 'Shows origin, transport distance, and local sourcing indicators to make purchases more transparent.',
    '大稻埕永續海鮮示範店': 'Dadaocheng Sustainable Seafood Demo Store',
    '信義永續超市專區': 'Xinyi Sustainable Supermarket Section',
    '板橋友善漁獲市場': 'Banqiao Friendly Seafood Market',
    '淡水海風小食堂': 'Tamsui Sea Breeze Eatery',
    '餐廳': 'Restaurant',
    '超市': 'Supermarket',
    '市場': 'Market',
    '全部': 'All',
    '秋刀魚': 'Pacific saury',
    '鬼頭刀': 'Mahi-mahi',
    '鯖魚': 'Mackerel',
    '虱目魚': 'Milkfish',
    '白帶魚': 'Cutlassfish',
    '小卷': 'Small squid',
    '透抽': 'Neritic squid',
    'MSC / 在地友善採購': 'MSC / Local friendly sourcing',
    'ASC / 產銷履歷': 'ASC / Traceable production',
    '在地小漁支持': 'Local small-scale fisher support',
    '季節性採購': 'Seasonal sourcing',
    '台北市大同區': 'Datong District, Taipei',
    '台北市信義區': 'Xinyi District, Taipei',
    '新北市板橋區': 'Banqiao District, New Taipei',
    '新北市淡水區': 'Tamsui District, New Taipei',
    '主打低碳海鮮料理與季節漁獲菜單。': 'Features low-carbon seafood dishes and seasonal catch menus.',
    '可查詢漁法與來源，適合家庭採買。': 'Lets shoppers check fishing methods and origins, suitable for family grocery trips.',
    '假日可見產地直送與教育展示。': 'Offers direct-from-origin seafood and educational displays on weekends.',
    '面海餐桌體驗，提供永續捕撈資訊。': 'Offers seaside dining with sustainable fishing information.',
    '首頁': 'Home',
    '沉浸式 3D 永續漁獲地圖首頁。': 'Immersive 3D Sustainable Catch Map home page.',
    'Sustainable Catch Map 的核心理念、永續問題意識與實踐方向。': 'The core philosophy, sustainability problem awareness, and practice direction of Sustainable Catch Map.',
    '社群連結': 'Social links',
    '切換成英文': 'Switch to English',
    '中文': 'Chinese',
    'English': 'English',
    '永續魚種 3D 模型': '3D model of a sustainable fish species',
    'SUSTAINABLE CATCH MAP': 'SUSTAINABLE CATCH MAP',
    'IMMERSIVE BEACH EXPERIENCE': 'IMMERSIVE BEACH EXPERIENCE',
    'OUR PHILOSOPHY': 'OUR PHILOSOPHY',
    'FRIENDLY SEAFOOD MAP': 'FRIENDLY SEAFOOD MAP',
    'AR & SUSTAINABILITY LABELS': 'AR & SUSTAINABILITY LABELS',
    '類型：': 'Type: ',
    '魚種：': 'Species: ',
    '標籤：': 'Label: ',
    '區域：': 'Area: ',
    '備註：': 'Note: ',
  };

  var enToZh = Object.keys(zhToEn).reduce(function (acc, key) {
    acc[zhToEn[key]] = key;
    return acc;
  }, {});

  function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function translateTextNode(node, lang) {
    var raw = node.nodeValue;
    var trimmed = normalizeText(raw);
    if (!trimmed) return;
    var dict = lang === 'en' ? zhToEn : enToZh;
    var translated = dict[trimmed];
    if (translated && translated !== trimmed) {
      node.nodeValue = raw.replace(trimmed, translated);
      return;
    }

    // Some UI strings are composed from smaller React text nodes or Leaflet popup fragments.
    // Replace known phrases inside the node as a fallback so the whole site follows the selected language.
    var nextRaw = raw;
    Object.keys(dict)
      .filter(function (key) { return key.length >= 2 && nextRaw.indexOf(key) !== -1; })
      .sort(function (a, b) { return b.length - a.length; })
      .forEach(function (key) {
        nextRaw = nextRaw.split(key).join(dict[key]);
      });
    if (nextRaw !== raw) node.nodeValue = nextRaw;
  }

  function translateAttributes(root, lang) {
    var dict = lang === 'en' ? zhToEn : enToZh;
    var attrs = ['title', 'aria-label', 'alt', 'placeholder'];
    var elements = [root].concat(Array.prototype.slice.call(root.querySelectorAll ? root.querySelectorAll('*') : []));
    elements.forEach(function (el) {
      if (!el.getAttribute) return;
      attrs.forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (!value) return;
        var translated = dict[normalizeText(value)];
        if (translated) el.setAttribute(attr, translated);
      });
    });
  }

  function walkTextNodes(root, lang) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) { translateTextNode(node, lang); });
  }

  function setDocumentMeta(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';

    var path = location.pathname;
    var page = 'home';
    if (/\/pages\/about\.html$/.test(path)) page = 'about';
    if (/\/pages\/map\.html$/.test(path)) page = 'map';
    if (/\/pages\/sustainability\.html$/.test(path)) page = 'sustainability';

    var meta = {
      zh: {
        home: {
          title: '永續漁獲地圖 | 首頁',
          description: '沉浸式 3D 永續漁獲地圖首頁。'
        },
        about: {
          title: '永續漁獲地圖 | 我們的理念',
          description: 'Sustainable Catch Map 的核心理念、永續問題意識與實踐方向。'
        },
        map: {
          title: '永續漁獲地圖 | 附近的友善海鮮地圖',
          description: '用互動地圖探索附近友善海鮮據點。'
        },
        sustainability: {
          title: '永續漁獲地圖 | AR互動與永續標籤',
          description: '透過 AR 互動與 3D 模型理解永續標籤。'
        }
      },
      en: {
        home: {
          title: 'Sustainable Catch Map | Home',
          description: 'An immersive 3D beach experience that connects seafood choices with ocean sustainability.'
        },
        about: {
          title: 'Sustainable Catch Map | Our Philosophy',
          description: 'The core philosophy, sustainability challenges, and practical direction behind Sustainable Catch Map.'
        },
        map: {
          title: 'Sustainable Catch Map | Nearby Friendly Seafood Map',
          description: 'Explore nearby ocean-friendly seafood locations with an interactive map.'
        },
        sustainability: {
          title: 'Sustainable Catch Map | AR Interaction & Sustainability Labels',
          description: 'Use AR interaction and 3D models to understand seafood sustainability labels.'
        }
      }
    };

    var selected = meta[lang === 'en' ? 'en' : 'zh'][page];
    document.title = selected.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', selected.description);
  }

  function updateLanguageButtons(lang) {
    var nextLabel = lang === 'en' ? '中' : 'EN';
    var aria = lang === 'en' ? 'Switch to Chinese' : '切換成英文';
    document.querySelectorAll('.language-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', aria);
      btn.setAttribute('title', lang === 'en' ? '中文' : 'English');
      var icon = btn.querySelector('[data-lang-icon]') || btn;
      icon.textContent = nextLabel;
    });
  }

  function removeAboutHomeButton() {
    if (!/\/pages\/about\.html$|\/pages\/about\.html[?#]/.test(location.pathname + location.search)) return;
    document.querySelectorAll('a.primary-btn').forEach(function (a) {
      if (a.getAttribute('href') === '/' || a.textContent.indexOf('回到沉浸式首頁') !== -1 || a.textContent.indexOf('Back to immersive home') !== -1) {
        a.remove();
      }
    });
  }

  function applyLanguage(lang) {
    if (isApplying) return;
    isApplying = true;
    try {
      setDocumentMeta(lang);
      walkTextNodes(document.body, lang);
      translateAttributes(document.body, lang);
      updateLanguageButtons(lang);
      removeAboutHomeButton();
    } finally {
      isApplying = false;
    }
  }

  function currentLang() {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh';
  }

  function initLanguageToggle() {
    document.addEventListener('click', function (event) {
      var btn = event.target.closest && event.target.closest('.language-toggle');
      if (!btn) return;
      event.preventDefault();
      var next = currentLang() === 'en' ? 'zh' : 'en';
      localStorage.setItem(STORAGE_KEY, next);
      // The 3D homepage labels are rendered inside WebGL/Three.js, not normal DOM text.
      // Reload only on the homepage so those Canvas labels can be recreated in the selected language.
      if (document.querySelector('.page-home')) {
        window.location.reload();
        return;
      }
      applyLanguage(next);
    });
  }

  function initObserver() {
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled || isApplying) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        applyLanguage(currentLang());
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    initLanguageToggle();
    applyLanguage(currentLang());
    initObserver();
  });
})();
