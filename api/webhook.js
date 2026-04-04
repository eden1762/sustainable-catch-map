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
    res.status(200).send('漁人地圖 Webhook 運行中！');
  }
}

// 處理訊息事件
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 預設回覆邏輯 (未來可在此串接 AI 漁獲推薦)
  const replyText = `歡迎來到永續漁人地圖！您剛才說了：「${event.message.text}」。我們將為您提供最即時的永續海鮮資訊。`;
  
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}
