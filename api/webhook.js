const line = require('@line/bot-sdk');

// 設定環境變數
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const events = req.body.events;
      const results = await Promise.all(events.map(handleEvent));
      res.status(200).json(results);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.status(200).send('🌊 永續漁人地圖 Webhook 運行中！');
  }
}

// 處理訊息事件
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMsg = event.message.text.trim();
  let replyMessages = [];

  // 模擬 AI 關鍵字判斷與推薦系統
  if (userMsg.includes('推薦') || userMsg.includes('吃什麼') || userMsg.includes('魚')) {
    replyMessages.push({
      type: 'text',
      text: '🤖 【AI 永續智能推薦】\n根據漁業署本週數據與產季模型分析，目前強烈推薦選擇：\n\n🐟 「秋刀魚」或「鬼頭刀」\n✅ 資源豐富，目前非過度捕撈狀態\n✅ 碳足跡較低\n\n您可以打開下方的「永續漁人地圖」選單，尋找附近有供應這些友善漁獲的餐廳！'
    });
  } else if (userMsg.includes('AR') || userMsg.includes('體驗')) {
    replyMessages.push({
      type: 'text',
      text: '📱 點擊下方選單的「開啟地圖」，即可在網頁中使用 AR 擴增實境功能，將海洋生物投影到您的桌面上進行學習喔！'
    });
  } else {
    replyMessages.push({
      type: 'text',
      text: `您好！歡迎來到「永續漁人地圖 Sustainable Catch Map」🌊\n\n您剛才說了：「${userMsg}」。\n\n您可以嘗試輸入「推薦」，讓我為您分析今日最適合購買的友善海鮮；或是直接點擊下方選單開啟地圖與 AR 體驗！`
    });
  }
  
  return client.replyMessage(event.replyToken, replyMessages);
}
