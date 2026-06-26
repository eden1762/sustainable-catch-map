(function () {
  'use strict';

  var storageKey = 'fishfull-purchase-feedback-v2';

  var pages = {
    about: {
      zh: {
        title: '我們的理念',
        metaTitle: 'FishFull 漁有料｜我們的理念',
        description: 'FishFull 漁有料把主推魚、合作點、零失敗食譜與十秒回饋串成一條買魚路線，讓消費者、魚販與漁業夥伴都能看懂、敢買、好介紹。',
        eyebrow: '友善漁業行動',
        headline: '從「看不懂魚」到「今天敢買一條」',
        lead: 'FishFull 漁有料不是把永續講得很遠，而是把買魚現場變簡單：先看今天主推魚，知道去哪裡買，帶走一份零失敗食譜，最後留下 10 秒回饋。讓消費者少踩雷、魚販更好介紹，漁業夥伴也看得到市場真的喜歡什麼。',
        badges: ['主推魚帶路', '合作點好找', '食譜不翻車', '回饋超快'],
        sections: [
          {
            kind: 'cards',
            eyebrow: '一條買魚路線',
            title: '不是只放理念，而是把下一步做成入口',
            body: '使用者看到「下一步」時，可以立刻點進主推魚、附近合作點、零失敗食譜與十秒回饋，不會只停在文字說明。',
            cards: [
              { icon: '魚', title: '先選一條主推魚', body: '用今晚餐桌情境推薦一條好上手的魚，附上口感、份量、魚販話術與搭配食譜。' },
              { icon: '店', title: '再去附近買魚', body: '合作點地圖把市場、魚市、餐廳與漁港整理好，讓想買的人能直接行動。' },
              { icon: '煮', title: '帶走零失敗食譜', body: '清蒸、乾煎、煮湯用步驟拆解，新手照做也不容易翻車。' },
              { icon: '回', title: '留下 10 秒回饋', body: '買或沒買都能記一筆，讓魚販知道哪句介紹、哪條魚、哪道料理最有用。' }
            ]
          },
          {
            kind: 'flow',
            eyebrow: '現場流程',
            title: '掃碼後 60 秒內，要讓人知道自己該做什麼',
            body: 'FishFull 把資訊排成現場可用的順序：先縮小選擇，再把購買、料理、回饋接起來。',
            steps: [
              { label: '01', title: '看主推魚', body: '先看到今天最推薦的一條，降低選擇壓力。' },
              { label: '02', title: '找合作點', body: '知道哪裡買得到，不讓興趣卡在「去哪買」。' },
              { label: '03', title: '選食譜', body: '買之前先知道今晚怎麼煮，購買信心更高。' },
              { label: '04', title: '買回家', body: '魚販用短句講清楚口感、份量、價格與做法。' },
              { label: '05', title: '回一句', body: '用 10 秒留下原因，讓下一輪推薦更準。' }
            ]
          },
          {
            kind: 'links',
            eyebrow: '今天就能點',
            title: '直接進入四個實作頁面',
            body: '不用先讀完整網站。想試買的人，照這四個入口走就好。',
            links: [
              { icon: '🐟', title: '主推魚', body: '看今天先推哪條魚、怎麼問、怎麼挑。', href: '/pages/fish.html' },
              { icon: '📍', title: '去附近買魚', body: '看合作點地圖與購買地點。', href: '/pages/map.html' },
              { icon: '🍳', title: '零失敗食譜', body: '照步驟煮，第一次也能成功。', href: '/pages/recipes.html' },
              { icon: '⚡', title: '十秒回饋', body: '買完或沒買都能快速記一筆。', href: '/pages/feedback.html' }
            ]
          }
        ]
      }
    },

    fish: {
      zh: {
        title: '主推魚',
        metaTitle: 'FishFull 漁有料｜主推魚',
        description: 'FishFull 主推魚頁面，整理今天先推薦的魚種、挑選重點、魚販介紹話術、合作點與零失敗食譜搭配。',
        eyebrow: '今日主推魚',
        headline: '今天先推一條：午仔魚，友善新手也能駕馭',
        lead: '主推魚頁面的目的很直接：不要讓客人在魚攤前滑半天。先把選擇縮成一條好理解、好料理、好介紹的魚，再接到合作點地圖與零失敗食譜。',
        badges: ['肉質細嫩', '清蒸乾煎都行', '家庭餐桌友善', '適合魚販一句話介紹'],
        spotlight: {
          fish: '午仔魚',
          status: '今日主推',
          tagline: '肉細、油香、刺感相對好處理，新手第一次買魚可以先從這條開始。',
          notes: [
            '適合 2～4 人家庭餐桌：清蒸、乾煎、煮湯都能搭。',
            '買魚時先問「今天這條適合清蒸還是乾煎？」魚販很容易接話。',
            '優先選來源說得清楚、冰度好、魚身完整、沒有明顯腥臭味的魚。'
          ],
          facts: [
            { label: '口感', value: '細嫩、清甜、油脂感舒服' },
            { label: '料理難度', value: '低，新手友善' },
            { label: '現場問法', value: '這條兩人吃夠嗎？清蒸幾分鐘？' },
            { label: '搭配頁面', value: '合作點地圖＋零失敗食譜' }
          ]
        },
        sections: [
          {
            kind: 'cards',
            eyebrow: '買魚前 30 秒',
            title: '先看這三件事，少踩雷',
            body: '消費者不用硬背專業名詞，魚販也不用講長篇。用看得到、問得出口、煮得出來的方式判斷。',
            cards: [
              { icon: '鮮', title: '看冰度與魚身', body: '魚身完整、有彈性、冰度夠，味道不要刺鼻。看不懂也可以直接問魚販今天哪批新鮮。' },
              { icon: '份', title: '問份量', body: '兩人吃先問一尾夠不夠，家庭餐桌可以問要不要切段。份量清楚，價格就比較不恐怖。' },
              { icon: '煮', title: '先決定做法', body: '清蒸想吃原味，乾煎想吃香氣，煮湯想要穩。先知道今晚做法，比較敢買。' }
            ]
          },
          {
            kind: 'flow',
            eyebrow: '魚販一句話',
            title: '讓魚販好介紹，讓客人聽得懂',
            body: '主推魚不是硬推銷，而是把選擇變簡單。',
            steps: [
              { label: '開場', title: '今天先看午仔魚', body: '「今天這批午仔魚肉細，兩個人吃剛好。」' },
              { label: '口感', title: '把味道說成餐桌感', body: '「清蒸很甜，乾煎也香，不太需要複雜調味。」' },
              { label: '做法', title: '先給零失敗選項', body: '「回家蔥薑清蒸，水滾後 8 到 10 分鐘就能上桌。」' },
              { label: '回饋', title: '收一句真話', body: '「你剛剛是因為哪一句比較敢買？」' }
            ]
          },
          {
            kind: 'links',
            eyebrow: '搭配入口',
            title: '主推魚要和地圖、食譜、回饋一起用',
            body: '看完這頁，不要只停在知道。下一步直接找買點、選食譜、回傳心得。',
            links: [
              { icon: '📍', title: '去附近買魚', body: '找市場、餐廳、魚市與漁港合作點。', href: '/pages/map.html' },
              { icon: '🍳', title: '午仔魚零失敗食譜', body: '清蒸、乾煎、煮湯三種路線。', href: '/pages/recipes.html' },
              { icon: '⚡', title: '留下十秒回饋', body: '買或沒買都能回一句，幫下一次推薦更準。', href: '/pages/feedback.html' },
              { icon: '📸', title: '看現場紀錄', body: '看魚販怎麼介紹，消費者怎麼問。', href: '/pages/field.html' }
            ]
          }
        ]
      }
    },

    map: {
      zh: {
        title: '去附近買魚',
        metaTitle: 'FishFull 漁有料｜去附近買魚',
        description: '用開放地圖找到可買、可吃、可認識漁獲的真實地點；點店家看位置，點地址可開導航。',
        eyebrow: '合作點地圖',
        headline: '想買友善海鮮，先找到最近的好店',
        lead: '地圖把市場、餐廳、漁港與魚市整理在同一頁。看完主推魚與食譜後，可以直接找附近合作點；買完再到十秒回饋頁留下心得。',
        badges: ['真實地址', '手機好導航', '搭配主推魚', '買完可回饋'],
        filters: ['全部', '市場', '餐廳', '漁港', '魚市'],
        locations: [
          { id: 1, type: '市場', name: '板橋黃石市場', area: '新北市板橋區', address: '新北市板橋區北門街11號', lat: 25.01086, lng: 121.45658, species: '生鮮魚貨、生魚片、家常料理食材', tag: '市場買魚入門點', note: '適合把主推魚牌卡放在魚攤旁，讓消費者快速看懂魚種、季節與簡單料理。' },
          { id: 2, type: '餐廳', name: '上引水產', area: '台北市中山區', address: '台北市中山區民族東路410巷2弄18號', lat: 25.06662, lng: 121.53702, species: '現流海鮮、刺身、熟食、海鮮料理', tag: '把好魚端上桌', note: '適合示範一道零失敗料理，讓「不知道怎麼煮」變成「我今天想試」。' },
          { id: 3, type: '漁港', name: '碧砂漁港', area: '基隆市中正區', address: '基隆市中正區北寧路211號', lat: 25.14506, lng: 121.79134, species: '在地當季漁獲、白帶魚、小卷、海鮮料理', tag: '漁法與產地故事', note: '適合把漁港、魚販與消費者連在一起，讓使用者知道魚從哪裡來。' },
          { id: 4, type: '魚市', name: '臺北魚市', area: '台北市中山區', address: '台北市中山區民族東路410巷2弄20號', lat: 25.06672, lng: 121.53728, species: '產銷履歷水產品、冷凍水產、家庭採買魚貨', tag: '來源說得清楚', note: '適合把產地、履歷與料理建議說成一般人聽得懂的購買理由。' },
          { id: 5, type: '魚市', name: '萬大魚類批發市場', area: '台北市萬華區', address: '台北市萬華區萬大路531號', lat: 25.02005, lng: 121.49877, species: '大台北漁貨供應、批發魚貨、零批採買', tag: '魚販與漁貨流通現場', note: '適合讓魚販、餐飲店與年輕人認識魚市流通，也能做現場採買任務點。' }
        ],
        playbook: {
          kind: 'cards',
          eyebrow: '現場怎麼用',
          title: '地圖不是結束，是把人帶去買',
          body: '每個合作點都搭配主推魚、零失敗食譜與十秒回饋，讓購買路線完整。',
          cards: [
            { icon: '🐟', title: '主推魚牌卡', body: '先告訴客人今天看哪條魚，減少選擇壓力。' },
            { icon: '🍳', title: '料理建議', body: '買之前知道今晚怎麼煮，購買率更有機會上升。' },
            { icon: '⚡', title: '買後回饋', body: '問一句哪個資訊有用，下一次介紹更準。' }
          ]
        }
      }
    },

    recipes: {
      zh: {
        title: '零失敗食譜',
        metaTitle: 'FishFull 漁有料｜零失敗食譜',
        description: '零失敗食譜頁面，提供主推魚的清蒸、乾煎、煮湯做法，讓第一次買魚的人也能照步驟完成。',
        eyebrow: '今晚就能煮',
        headline: '買魚前先選一道菜，回家就不慌',
        lead: '零失敗食譜不是追求大廚感，而是讓第一次買友善漁獲的人願意再買第二次。每道菜都用短步驟、明確時間、失敗救援，讓消費者、魚販與活動夥伴都能快速分享。',
        badges: ['15 分鐘上桌', '步驟短', '失敗有救', '可搭配主推魚'],
        recipes: [
          {
            title: '蔥薑清蒸午仔魚',
            time: '約 15 分鐘',
            level: '最穩入門款',
            bestFor: '想吃原味、家人一起吃、第一次買魚',
            ingredients: ['午仔魚 1 尾', '薑片 4～6 片', '蔥 2 支', '米酒 1 小匙', '醬油 1.5 大匙', '熱油少許'],
            steps: ['魚身擦乾，兩面各劃 2 刀。', '盤底放薑片，魚身抹少許米酒。', '水滾後放入蒸 8～10 分鐘，魚肉可輕鬆撥開就好。', '倒掉多餘腥水，放蔥絲、淋醬油與少量熱油。'],
            rescue: '蒸過頭變乾：加一點熱水或高湯，變成清蒸湯汁版。'
          },
          {
            title: '鹽香乾煎午仔魚',
            time: '約 18 分鐘',
            level: '香氣最有感',
            bestFor: '想吃煎魚香、配飯、便當菜',
            ingredients: ['午仔魚 1 尾或魚片', '鹽少許', '白胡椒少許', '油 1 大匙', '檸檬或蒜末可選'],
            steps: ['魚身擦乾，薄薄抹鹽與胡椒，靜置 5 分鐘。', '鍋熱再下油，中火先煎魚皮面。', '不要急著翻，邊緣變金黃再翻面。', '兩面金黃後關火，利用餘溫悶 1 分鐘。'],
            rescue: '魚皮沾鍋：先不要硬拉，關小火等表面定型再翻。'
          },
          {
            title: '味噌魚湯',
            time: '約 20 分鐘',
            level: '最適合救場',
            bestFor: '魚比較小、想煮湯、家裡有小孩或長輩',
            ingredients: ['魚肉或魚骨 1 份', '味噌 1.5 大匙', '豆腐半盒', '薑片 3 片', '蔥花少許', '水 700ml'],
            steps: ['水滾後放薑片與魚骨，轉中小火煮 8 分鐘。', '放豆腐與魚肉，煮到魚肉轉白。', '關小火後把味噌用湯化開再倒回鍋中。', '撒蔥花，試味道，不夠鹹再補一點味噌。'],
            rescue: '味噌湯不要大滾太久，香氣會跑掉；太鹹就加熱水。'
          }
        ],
        sections: [
          {
            kind: 'cards',
            eyebrow: '買魚時先問',
            title: '食譜也要能幫魚販成交',
            body: '魚販不需要背整份食譜，只要會把做法講成三句，客人就比較敢買。',
            cards: [
              { icon: '問', title: '這條適合清蒸嗎？', body: '如果魚新鮮、肉細，清蒸最能讓客人吃到原味。' },
              { icon: '煎', title: '可以乾煎不破嗎？', body: '提醒客人魚身擦乾、鍋熱再下魚，不要一直翻。' },
              { icon: '湯', title: '煮湯會不會腥？', body: '加薑片、先滾水、最後放味噌或蔥花，味道更穩。' }
            ]
          },
          {
            kind: 'links',
            eyebrow: '搭配使用',
            title: '食譜要接回主推魚與合作點',
            body: '客人看到食譜後，下一步應該能直接知道買哪條、去哪買、買完怎麼回饋。',
            links: [
              { icon: '🐟', title: '看主推魚', body: '先確認今天推薦哪一條。', href: '/pages/fish.html' },
              { icon: '📍', title: '去附近買魚', body: '找合作點與地址。', href: '/pages/map.html' },
              { icon: '⚡', title: '留下十秒回饋', body: '記下哪道菜讓你更敢買。', href: '/pages/feedback.html' }
            ]
          }
        ]
      }
    },

    feedback: {
      zh: {
        title: '十秒回饋',
        metaTitle: 'FishFull 漁有料｜十秒回饋',
        description: '十秒回饋頁面，讓魚販、餐飲店、社區或校園夥伴快速記錄買魚原因、卡關點與客人原話。',
        eyebrow: '留下十秒回饋',
        headline: '買或沒買，都只要回三個小問題',
        lead: '回饋不要像考卷。現場只記「有沒有買、哪句有用、下次會不會再買」，再補一句客人原話，就能知道主推魚、合作點與食譜有沒有真的幫上忙。',
        badges: ['不重複出現在每頁', '本機先暫存', '可複製摘要', '店家好整理'],
        formTitle: '現場回饋小卡',
        formBody: '給魚販、餐飲店、社區或校園試用：先把每筆回饋存在這台裝置，收攤後就能複製給團隊整理。',
        placeLabel: '點位 / 店家',
        placePlaceholder: '例如：黃石市場 A 攤',
        fishLabel: '魚種或料理',
        fishPlaceholder: '例如：午仔魚、蔥薑清蒸',
        boughtLabel: '今天有買嗎？',
        boughtOptions: ['已購買', '考慮中', '沒買，想先學料理'],
        reasonLabel: '讓你更敢買的原因',
        reasonOptions: ['主推魚清楚', '店家推薦', '零失敗食譜', '價格清楚', '產地 / 漁法故事'],
        revisitLabel: '下次會回來買嗎？',
        revisitOptions: ['會', '可能會', '需要更清楚的料理或價格'],
        quoteLabel: '客人原話',
        quotePlaceholder: '例如：這個我會煮嗎？魚刺多不多？小孩敢吃嗎？',
        saveButton: '存一筆回饋',
        saved: '已存入這台裝置，下一筆可以繼續記。',
        summaryTitle: '目前本機累積',
        summaryEmpty: '尚未記錄，先從 1 筆開始。',
        summaryLabels: ['總筆數', '已購買', '會/可能會回來', '最新一筆', '客人原話'],
        exportLabel: '複製摘要給團隊',
        exportCopied: '摘要已複製，可以貼到工作紀錄。',
        exportFallback: '瀏覽器無法自動複製，請直接選取摘要。',
        sections: [
          {
            kind: 'metrics',
            eyebrow: '問卷收短',
            title: '只問能改進現場的三件事',
            body: '不用問太多，先讓魚販和夥伴知道推薦有沒有把人推到購買。',
            metrics: [
              { value: '有沒有買', label: '知道主推魚和食譜是否真的推動購買。' },
              { value: '哪句有用', label: '找出最能讓人放心的魚販介紹。' },
              { value: '下次會不會', label: '看是不是有回購可能，或需要更多料理資訊。' }
            ]
          },
          {
            kind: 'links',
            eyebrow: '回到行動',
            title: '回饋要接回主推魚、地圖與食譜',
            body: '收完一句真話，下一步就是調整推薦魚、合作點說法與料理入口。',
            links: [
              { icon: '🐟', title: '主推魚', body: '調整下一次推薦哪一條。', href: '/pages/fish.html' },
              { icon: '📍', title: '去附近買魚', body: '看哪個合作點更需要補資訊。', href: '/pages/map.html' },
              { icon: '🍳', title: '零失敗食譜', body: '看哪道食譜最能降低焦慮。', href: '/pages/recipes.html' },
              { icon: '📸', title: '看現場紀錄', body: '把回饋變成現場故事。', href: '/pages/field.html' }
            ]
          }
        ]
      }
    },

    sustainability: {
      zh: {
        title: '玩標籤',
        metaTitle: 'FishFull 漁有料｜玩標籤',
        description: '用小任務、徽章與拍照分享，把魚種狀態、漁法故事、產地資訊與料理建議變成看得懂、玩得起、買得到的體驗。',
        eyebrow: '玩中學永續標籤',
        headline: '把標籤變成買魚小任務',
        lead: '對年輕人來說，永續不能只有一段介紹。FishFull 把標籤做成任務：看燈號、讀漁法、選食譜、去合作點買，再留下十秒回饋。',
        badges: ['標籤好懂', '任務感', '拍照分享', '接回購買'],
        labels: [
          { title: '魚種狀態', body: '用簡單燈號提醒今天適不適合買。' },
          { title: '漁法故事', body: '把漁法、產地與季節用一般人聽得懂的話說清楚。' },
          { title: '料理入口', body: '標籤不是知識結尾，而是把人帶到食譜與合作點。' }
        ],
        missions: {
          kind: 'cards',
          eyebrow: '任務路線',
          title: '四步驟小任務：讓標籤有下一步',
          body: '每一步都要能被消費者理解，也能幫店家知道大家喜歡什麼。',
          cards: [
            { icon: '🔍', title: '掃描解鎖', body: '掃描後看到今日主推魚與燈號提示。' },
            { icon: '🎖️', title: '完成徽章', body: '回答漁法或產地小問題，取得好魚玩家徽章。' },
            { icon: '🍽️', title: '帶走食譜', body: '選清蒸、乾煎、煮湯等簡單料理。' },
            { icon: '🧾', title: '回饋採購', body: '買或沒買都留一句，幫下一位使用者更好選。' }
          ]
        },
        arHint: '點選標籤卡切換互動物件；這頁重點是讓標籤接回主推魚、食譜、合作點與回饋。'
      }
    },

    field: {
      zh: {
        title: '看現場紀錄',
        metaTitle: 'FishFull 漁有料｜看現場紀錄',
        description: '現場紀錄頁，讓消費者、魚販、漁業夥伴與社區校園推廣者看懂怎麼掃碼選魚、購買、料理與回饋。',
        eyebrow: '現場紀錄',
        headline: '好魚不只被看見，還要真的被帶回家',
        lead: '這一頁把現場要做的事收短：掃碼、看主推魚、找合作點、選食譜、買一份、留 10 秒回饋。讓客人敢買，讓魚販好介紹，也讓漁業夥伴知道哪種好魚真的有人想吃。',
        badges: ['合作店家', '魚販故事', '買魚回饋', '試吃小任務'],
        sections: [
          {
            kind: 'cards',
            eyebrow: '現場小卡',
            title: '一張牌卡，接住買魚前後五個動作',
            body: '不要讓客人在魚攤前讀太久。牌卡只要幫他完成今天最重要的幾步：看懂、敢問、知道怎麼煮、買下去、回一句。',
            cards: [
              { icon: '掃', title: '掃碼看主推魚', body: '先看今天推薦哪一條，不讓客人站在魚前面卡關。' },
              { icon: '問', title: '問今天最推', body: '魚販先講魚名、價格、產地、口感與適合份量；客人不用裝懂，也能自然開口。' },
              { icon: '煮', title: '選零失敗做法', body: '肉嫩清蒸、肉厚乾煎、骨多煮湯。買之前先知道今晚怎麼煮，就比較敢帶回家。' },
              { icon: '買', title: '找附近合作點', body: '想買就直接看附近店家或活動點，減少知道很好但不知道去哪買的落差。' },
              { icon: '回', title: '留下 10 秒回饋', body: '買或沒買都可以回一句：哪句有用、哪裡卡住、下次想看哪種魚。' }
            ]
          },
          {
            kind: 'cards',
            eyebrow: '買前不尷尬',
            title: '把新鮮、份量、做法問成三句話',
            body: '客人常不是不想買，而是不知道怎麼開口。FishFull 把買魚前 30 秒收成三句，讓新手、學生、家庭客都能自然問下去。',
            cards: [
              { icon: '鮮', title: '這條今天新鮮看哪裡？', body: '魚販可以直接指眼睛、魚身、冰度與味道，客人不用先懂術語，也能快速建立安心感。' },
              { icon: '份', title: '兩個人吃要買多少？', body: '把斤價換成 1 人、2 人、家庭鍋的份量，價格就比較像今晚餐桌，而不是陌生數字。' },
              { icon: '煮', title: '清蒸、乾煎還是煮湯？', body: '把問題問小，魚販好回答，客人也比較容易從看看、問問，變成真的買一份。' }
            ]
          },
          {
            kind: 'links',
            eyebrow: '現在就去買魚',
            title: '看完紀錄，不要停在知道',
            body: '最短路線是：看主推魚、找附近合作點、選一道零失敗食譜，再留下十秒回饋。',
            links: [
              { icon: '🐟', title: '主推魚', body: '先看今天推薦哪一條。', href: '/pages/fish.html' },
              { icon: '📍', title: '去附近買魚', body: '找到合作點與導航。', href: '/pages/map.html' },
              { icon: '🍳', title: '零失敗食譜', body: '買之前先知道怎麼煮。', href: '/pages/recipes.html' },
              { icon: '⚡', title: '十秒回饋', body: '把現場一句真話留下來。', href: '/pages/feedback.html' }
            ]
          }
        ]
      }
    }
  };

  function lang() {
    return window.SCMLanguage ? window.SCMLanguage.current() : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function esc(value) {
    return window.SCMLanguage ? window.SCMLanguage.escapeHtml(value) : String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function pageKey() {
    return document.body.dataset.page || 'about';
  }

  function nav(currentKey) {
    var currentLang = lang();
    var labels = currentLang === 'en'
      ? { home: 'Home', about: 'Idea', fish: 'Featured Fish', map: 'Buy Nearby', recipes: 'Easy Recipes', feedback: '10-sec Feedback', field: 'Field Notes', sustainability: 'Label Missions' }
      : { home: '首頁', about: '我們的理念', fish: '主推魚', map: '去附近買魚', recipes: '零失敗食譜', feedback: '十秒回饋', field: '看現場紀錄', sustainability: '玩標籤' };
    var links = [
      { key: 'about', label: labels.about, href: '/pages/about.html' },
      { key: 'fish', label: labels.fish, href: '/pages/fish.html' },
      { key: 'map', label: labels.map, href: '/pages/map.html' },
      { key: 'recipes', label: labels.recipes, href: '/pages/recipes.html' },
      { key: 'feedback', label: labels.feedback, href: '/pages/feedback.html' },
      { key: 'field', label: labels.field, href: '/pages/field.html' },
      { key: 'sustainability', label: labels.sustainability, href: '/pages/sustainability.html' }
    ];
    return [
      '<header class="topbar">',
        '<a class="brand" href="/">',
          '<span class="brand-symbol" aria-hidden="true">◐</span>',
          '<span><small>SUSTAINABLE CATCH MAP</small><strong>FishFull 漁有料</strong></span>',
        '</a>',
        '<nav class="topnav" aria-label="' + esc(currentLang === 'en' ? 'Main navigation' : '主選單') + '">',
          '<a href="/">' + esc(labels.home) + '</a>',
          links.map(function (item) {
            return '<a href="' + esc(item.href) + '"' + (item.key === currentKey ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a>';
          }).join(''),
        '</nav>',
        '<div class="nav-actions">',
          '<a class="circle-link" href="https://www.instagram.com/fishfull_2025/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>',
          '<button class="circle-link language-toggle" type="button"><span data-lang-icon>' + (currentLang === 'en' ? '中文' : 'EN') + '</span></button>',
        '</div>',
      '</header>'
    ].join('');
  }

  function hero(data) {
    return [
      '<section class="page-hero">',
        '<div class="hero-text">',
          '<p class="eyebrow">' + esc(data.eyebrow) + '</p>',
          '<h1>' + esc(data.headline) + '</h1>',
          '<p>' + esc(data.lead) + '</p>',
          '<div class="badge-row">' + (data.badges || []).map(function (badge) { return '<span>' + esc(badge) + '</span>'; }).join('') + '</div>',
        '</div>',
        '<div class="hero-card" aria-hidden="true">',
          '<span class="sun-dot"></span>',
          '<strong>' + esc(data.title) + '</strong>',
          '<em>FishFull</em>',
          '<div class="wave-lines"><i></i><i></i><i></i></div>',
        '</div>',
      '</section>'
    ].join('');
  }

  function cardSection(section) {
    return [
      '<section class="content-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(section.eyebrow) + '</p>',
          '<h2>' + esc(section.title) + '</h2>',
          '<p>' + esc(section.body) + '</p>',
        '</div>',
        '<div class="info-grid">',
          section.cards.map(function (card) {
            return '<article class="info-card"><span class="card-icon" aria-hidden="true">' + esc(card.icon) + '</span><h3>' + esc(card.title) + '</h3><p>' + esc(card.body) + '</p></article>';
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  function linkSection(section) {
    return [
      '<section class="content-section link-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(section.eyebrow) + '</p>',
          '<h2>' + esc(section.title) + '</h2>',
          '<p>' + esc(section.body) + '</p>',
        '</div>',
        '<div class="link-grid">',
          section.links.map(function (item) {
            return '<a class="action-card" href="' + esc(item.href) + '"><span class="card-icon" aria-hidden="true">' + esc(item.icon) + '</span><h3>' + esc(item.title) + '</h3><p>' + esc(item.body) + '</p><strong>' + esc(lang() === 'en' ? 'Open' : '打開') + ' →</strong></a>';
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  function flowSection(section) {
    return [
      '<section class="content-section flow-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(section.eyebrow) + '</p>',
          '<h2>' + esc(section.title) + '</h2>',
          '<p>' + esc(section.body) + '</p>',
        '</div>',
        '<div class="flow-line">',
          section.steps.map(function (step) {
            return '<article class="flow-step"><span>' + esc(step.label) + '</span><h3>' + esc(step.title) + '</h3><p>' + esc(step.body) + '</p></article>';
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  function metricsSection(section) {
    return [
      '<section class="content-section metrics-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">' + esc(section.eyebrow) + '</p>',
          '<h2>' + esc(section.title) + '</h2>',
          '<p>' + esc(section.body) + '</p>',
        '</div>',
        '<div class="metric-grid">',
          section.metrics.map(function (metric) {
            return '<article class="metric-card"><strong>' + esc(metric.value) + '</strong><span>' + esc(metric.label) + '</span></article>';
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  function spotlightSection(data) {
    var s = data.spotlight;
    return [
      '<section class="content-section fish-spotlight">',
        '<div class="spotlight-main">',
          '<p class="eyebrow">' + esc(s.status) + '</p>',
          '<h2>' + esc(s.fish) + '</h2>',
          '<p>' + esc(s.tagline) + '</p>',
          '<ul>' + s.notes.map(function (note) { return '<li>' + esc(note) + '</li>'; }).join('') + '</ul>',
        '</div>',
        '<div class="spotlight-facts">',
          s.facts.map(function (fact) {
            return '<article><span>' + esc(fact.label) + '</span><strong>' + esc(fact.value) + '</strong></article>';
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  function recipeSection(data) {
    return [
      '<section class="content-section recipe-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">食譜卡</p>',
          '<h2>三種不容易翻車的做法</h2>',
          '<p>每張卡都含時間、材料、步驟與失敗救援，手機上也好讀。</p>',
        '</div>',
        '<div class="recipe-grid">',
          data.recipes.map(function (recipe) {
            return [
              '<article class="recipe-card">',
                '<div class="recipe-card__head"><span>' + esc(recipe.time) + '</span><span>' + esc(recipe.level) + '</span></div>',
                '<h3>' + esc(recipe.title) + '</h3>',
                '<p><strong>適合：</strong>' + esc(recipe.bestFor) + '</p>',
                '<h4>材料</h4>',
                '<ul>' + recipe.ingredients.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>',
                '<h4>步驟</h4>',
                '<ol>' + recipe.steps.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ol>',
                '<div class="rescue-tip"><strong>救援</strong><span>' + esc(recipe.rescue) + '</span></div>',
              '</article>'
            ].join('');
          }).join(''),
        '</div>',
      '</section>'
    ].join('');
  }

  var mapInstance = null;
  var mapMarkers = {};

  function googleMapsLink(item) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.name + ' ' + item.address);
  }

  function visibleMapLocations(data) {
    var active = sessionStorage.getItem('fishfull-map-filter') || data.filters[0];
    var allToken = data.filters[0];
    if (data.filters.indexOf(active) === -1) active = allToken;
    return data.locations.filter(function (item) { return active === allToken || item.type === active; });
  }

  function mapPopupHtml(item) {
    return [
      '<div class="map-popup">',
        '<strong>' + esc(item.name) + '</strong>',
        '<span>' + esc(item.type) + '｜' + esc(item.area) + '</span>',
        '<p>' + esc(item.species) + '</p>',
        '<a href="' + esc(googleMapsLink(item)) + '" target="_blank" rel="noopener noreferrer">用地圖開啟地址</a>',
      '</div>'
    ].join('');
  }

  function focusMapLocation(id) {
    var marker = mapMarkers[String(id)];
    var cards = document.querySelectorAll('[data-location-id]');
    Array.prototype.forEach.call(cards, function (card) {
      card.classList.toggle('is-selected', card.getAttribute('data-location-id') === String(id));
    });
    if (!mapInstance || !marker) return;
    mapInstance.setView(marker.getLatLng(), 16, { animate: true });
    marker.openPopup();
  }

  function setupOsmMap(data) {
    var mapEl = document.getElementById('fishfull-osm-map');
    if (!mapEl) return;
    if (!window.L) {
      mapEl.innerHTML = '<div class="map-fallback">地圖載入中；如果地圖沒有出現，請確認網路連線。</div>';
      return;
    }

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      mapMarkers = {};
    }

    var visible = visibleMapLocations(data);
    mapInstance = window.L.map(mapEl, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    }).setView([25.055, 121.55], 10);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    var markerList = [];
    visible.forEach(function (item) {
      var marker = window.L.marker([item.lat, item.lng], { title: item.name }).addTo(mapInstance);
      marker.bindPopup(mapPopupHtml(item));
      marker.on('click', function () { focusMapLocation(item.id); });
      mapMarkers[String(item.id)] = marker;
      markerList.push(marker);
    });

    if (markerList.length > 1) {
      var group = window.L.featureGroup(markerList);
      mapInstance.fitBounds(group.getBounds().pad(0.18));
    } else if (markerList.length === 1) {
      focusMapLocation(visible[0].id);
    }

    window.setTimeout(function () {
      if (mapInstance) mapInstance.invalidateSize();
    }, 80);
  }

  function locationCard(item) {
    return [
      '<article class="location-card" data-location-id="' + esc(item.id) + '" tabindex="0" role="button" aria-label="在地圖置中：' + esc(item.name) + '">',
        '<div><strong>' + esc(item.name) + '</strong><span>' + esc(item.type) + '｜' + esc(item.area) + '</span></div>',
        '<p>' + esc(item.species) + '</p>',
        '<a class="address-link" href="' + esc(googleMapsLink(item)) + '" target="_blank" rel="noopener noreferrer">地址：' + esc(item.address) + '<b aria-hidden="true">↗</b></a>',
        '<small>' + esc(item.tag) + '</small>',
        '<em>' + esc(item.note) + '</em>',
        '<div class="location-actions">',
          '<button type="button" class="map-action" data-center-location="' + esc(item.id) + '">在地圖置中</button>',
          '<a class="mini-link" href="/pages/fish.html">看主推魚</a>',
          '<a class="mini-link" href="/pages/recipes.html">看食譜</a>',
        '</div>',
      '</article>'
    ].join('');
  }

  function renderMap(data) {
    var active = sessionStorage.getItem('fishfull-map-filter') || data.filters[0];
    var allToken = data.filters[0];
    if (data.filters.indexOf(active) === -1) active = allToken;
    var visible = visibleMapLocations(data);
    return [
      '<section class="content-section map-section">',
        '<div class="section-heading">',
          '<p class="eyebrow">真實採買點位</p>',
          '<h2>找到地點，再帶著食譜去買</h2>',
          '<p>點選店家卡片，地圖會移到該店位置；點地址文字可另開導航。</p>',
        '</div>',
        '<div class="filter-row">',
          data.filters.map(function (filter) {
            return '<button type="button" class="filter-chip' + (filter === active ? ' is-active' : '') + '" data-filter="' + esc(filter) + '">' + esc(filter) + '</button>';
          }).join(''),
        '</div>',
        '<div class="map-layout">',
          '<section class="osm-panel" aria-label="Map">',
            '<div id="fishfull-osm-map" class="osm-map"></div>',
            '<p class="map-note">地圖資料來自 OpenStreetMap；地址文字可另開導航，方便使用者直接前往。</p>',
          '</section>',
          '<div class="location-list">',
            visible.map(locationCard).join(''),
          '</div>',
        '</div>',
      '</section>',
      cardSection(data.playbook),
      linkSection({
        eyebrow: '把路線接完',
        title: '選完合作點，接著看主推魚與食譜',
        body: '地圖不是單獨存在，要搭配主推魚、零失敗食譜與十秒回饋一起使用。',
        links: [
          { icon: '🐟', title: '主推魚', body: '先看今天推薦哪一條。', href: '/pages/fish.html' },
          { icon: '🍳', title: '零失敗食譜', body: '買之前先知道怎麼煮。', href: '/pages/recipes.html' },
          { icon: '⚡', title: '十秒回饋', body: '買完或沒買都留一句。', href: '/pages/feedback.html' }
        ]
      })
    ].join('');
  }

  function renderSustainability(data) {
    return [
      '<section class="content-section sustainability-layout">',
        '<div class="sustainability-copy">',
          '<div class="section-heading">',
            '<p class="eyebrow">標籤小任務</p>',
            '<h2>讓標籤帶出真正的選擇</h2>',
            '<p>' + esc(data.arHint) + '</p>',
          '</div>',
          '<div class="label-grid">',
            data.labels.map(function (item) {
              return '<article class="label-card"><h3>' + esc(item.title) + '</h3><p>' + esc(item.body) + '</p></article>';
            }).join(''),
          '</div>',
        '</div>',
        '<section class="model-stage" aria-label="互動標籤示意"><div class="mission-orb"><span>FishFull</span><strong>掃碼・選魚・料理・回饋</strong></div></section>',
      '</section>',
      cardSection(data.missions),
      linkSection({
        eyebrow: '任務出口',
        title: '每個任務都要接到真實購買',
        body: '可以直接前往主推魚、合作點地圖、零失敗食譜或十秒回饋。',
        links: [
          { icon: '🐟', title: '主推魚', body: '先推一條好上手的魚。', href: '/pages/fish.html' },
          { icon: '📍', title: '去附近買魚', body: '找到合作點。', href: '/pages/map.html' },
          { icon: '🍳', title: '零失敗食譜', body: '選一道不翻車做法。', href: '/pages/recipes.html' },
          { icon: '⚡', title: '十秒回饋', body: '留一句現場真話。', href: '/pages/feedback.html' }
        ]
      })
    ].join('');
  }

  function readFeedback() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (error) {
      return [];
    }
  }

  function writeFeedback(items) {
    localStorage.setItem(storageKey, JSON.stringify(items.slice(-300)));
  }

  function summarize(items, text) {
    if (!items.length) return text.summaryEmpty;
    var bought = items.filter(function (item) { return item.bought === text.boughtOptions[0]; }).length;
    var maybe = items.filter(function (item) { return item.revisit === text.revisitOptions[1]; }).length;
    var yes = items.filter(function (item) { return item.revisit === text.revisitOptions[0]; }).length;
    var latest = items[items.length - 1];
    var labels = text.summaryLabels || ['Total', 'Bought', 'Come back yes/maybe', 'Latest', 'Quote'];
    return [
      labels[0] + ': ' + items.length,
      labels[1] + ': ' + bought,
      labels[2] + ': ' + yes + '/' + maybe,
      labels[3] + ': ' + (latest.place || '-') + ' / ' + (latest.fish || '-') + ' / ' + latest.bought + ' / ' + latest.reason,
      labels[4] + ': ' + (latest.quote || '-')
    ].join('\n');
  }

  function optionTags(name, options) {
    return options.map(function (label, index) {
      var id = 'fishfull-' + name + '-' + index;
      return '<label class="feedback-choice" for="' + id + '"><input id="' + id + '" type="radio" name="' + name + '" value="' + esc(label) + '"' + (index === 0 ? ' checked' : '') + '> <span>' + esc(label) + '</span></label>';
    }).join('');
  }

  function feedbackForm(text) {
    return [
      '<form class="feedback-form" id="fishfull-feedback-form">',
        '<h3>' + esc(text.formTitle) + '</h3>',
        '<p>' + esc(text.formBody) + '</p>',
        '<div class="feedback-grid">',
          '<label>' + esc(text.placeLabel) + '<input type="text" name="place" placeholder="' + esc(text.placePlaceholder) + '"></label>',
          '<label>' + esc(text.fishLabel) + '<input type="text" name="fish" placeholder="' + esc(text.fishPlaceholder) + '"></label>',
        '</div>',
        '<div class="feedback-group"><label>' + esc(text.boughtLabel) + '</label><div class="feedback-choices">' + optionTags('bought', text.boughtOptions) + '</div></div>',
        '<div class="feedback-group"><label>' + esc(text.reasonLabel) + '</label><div class="feedback-choices">' + optionTags('reason', text.reasonOptions) + '</div></div>',
        '<div class="feedback-group"><label>' + esc(text.revisitLabel) + '</label><div class="feedback-choices">' + optionTags('revisit', text.revisitOptions) + '</div></div>',
        '<div class="feedback-group"><label>' + esc(text.quoteLabel) + '<textarea name="quote" maxlength="120" placeholder="' + esc(text.quotePlaceholder) + '"></textarea></label></div>',
        '<div class="feedback-actions"><button class="feedback-save" type="submit">' + esc(text.saveButton) + '</button><button class="feedback-export" type="button" data-feedback-export>' + esc(text.exportLabel) + '</button><span class="feedback-status" aria-live="polite"></span></div>',
        '<div class="feedback-summary" data-feedback-summary aria-label="' + esc(text.summaryTitle) + '"></div>',
      '</form>'
    ].join('');
  }

  function renderFeedback(data) {
    return [
      renderSections(data),
      '<section class="content-section feedback-panel">',
        '<div class="section-heading">',
          '<p class="eyebrow">現場小卡</p>',
          '<h2>現在就能記一筆</h2>',
          '<p>這張表單只放在十秒回饋獨立頁，不再每個頁面重複出現。</p>',
        '</div>',
        feedbackForm(data),
      '</section>'
    ].join('');
  }

  function bindFeedback(text) {
    var form = document.getElementById('fishfull-feedback-form');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    var summary = form.querySelector('[data-feedback-summary]');
    var status = form.querySelector('.feedback-status');

    function refresh(message) {
      summary.textContent = summarize(readFeedback(), text);
      status.textContent = message || '';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var items = readFeedback();
      var data = new FormData(form);
      items.push({
        time: new Date().toISOString(),
        place: String(data.get('place') || '').trim(),
        fish: String(data.get('fish') || '').trim(),
        bought: String(data.get('bought') || ''),
        reason: String(data.get('reason') || ''),
        revisit: String(data.get('revisit') || ''),
        quote: String(data.get('quote') || '').trim()
      });
      writeFeedback(items);
      form.reset();
      form.querySelector('input[name="bought"]').checked = true;
      form.querySelector('input[name="reason"]').checked = true;
      form.querySelector('input[name="revisit"]').checked = true;
      refresh(text.saved);
    });

    form.querySelector('[data-feedback-export]').addEventListener('click', function () {
      var output = summarize(readFeedback(), text);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output).then(function () { refresh(text.exportCopied); }, function () { refresh(text.exportFallback); });
      } else {
        refresh(text.exportFallback);
      }
    });

    refresh();
  }

  function renderSections(data) {
    return (data.sections || []).map(function (section) {
      if (section.kind === 'cards') return cardSection(section);
      if (section.kind === 'flow') return flowSection(section);
      if (section.kind === 'metrics') return metricsSection(section);
      if (section.kind === 'links') return linkSection(section);
      return '';
    }).join('');
  }

  function footer() {
    return [
      '<footer class="site-footer">',
        '<strong>FishFull 漁有料</strong>',
        '<span>選魚、買魚、料理、回饋，讓好魚真的被帶回家。</span>',
      '</footer>'
    ].join('');
  }

  function setMeta(data) {
    document.documentElement.lang = lang() === 'en' ? 'en' : 'zh-Hant';
    document.title = data.metaTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', data.description);
  }

  function render() {
    var key = pageKey();
    if (!pages[key]) key = 'about';
    var data = pages[key][lang()] || pages[key].zh;
    var root = document.getElementById('root');
    if (!root) return;
    setMeta(data);

    var body = '';
    if (key === 'map') body = renderMap(data);
    else if (key === 'sustainability') body = renderSustainability(data);
    else if (key === 'fish') body = spotlightSection(data) + renderSections(data);
    else if (key === 'recipes') body = recipeSection(data) + renderSections(data);
    else if (key === 'feedback') body = renderFeedback(data);
    else body = renderSections(data);

    root.innerHTML = '<div class="page-shell page-' + esc(key) + '">' + nav(key) + '<main>' + hero(data) + body + '</main>' + footer() + '</div>';
    if (key === 'map') setupOsmMap(data);
    if (key === 'feedback') bindFeedback(data);
  }

  document.addEventListener('click', function (event) {
    var filter = event.target.closest && event.target.closest('[data-filter]');
    if (filter) {
      sessionStorage.setItem('fishfull-map-filter', filter.dataset.filter);
      render();
      return;
    }

    var centerButton = event.target.closest && event.target.closest('[data-center-location]');
    if (centerButton) {
      event.preventDefault();
      focusMapLocation(centerButton.getAttribute('data-center-location'));
      return;
    }

    var card = event.target.closest && event.target.closest('[data-location-id]');
    if (!card || event.target.closest('a') || event.target.closest('button')) return;
    focusMapLocation(card.getAttribute('data-location-id'));
  });

  document.addEventListener('keydown', function (event) {
    var card = event.target.closest && event.target.closest('[data-location-id]');
    if (!card || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    focusMapLocation(card.getAttribute('data-location-id'));
  });

  document.addEventListener('scm-language-change', function () {
    sessionStorage.removeItem('fishfull-map-filter');
    render();
  });

  render();
})();
