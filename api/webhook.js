const LINE_REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('🌊 Sustainable Catch Map immersive webhook is live.');
  }

  try {
    const body = parseBody(req.body);
    const events = Array.isArray(body.events) ? body.events : [];
    const results = await Promise.all(events.map(handleEvent));
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Webhook error' });
  }
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

async function handleEvent(event) {
  if (!event || event.type !== 'message' || !event.message || event.message.type !== 'text') {
    return null;
  }

  const userMsg = String(event.message.text || '').trim();
  const replyMessages = buildReplyMessages(userMsg);

  if (!channelAccessToken) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN is not configured. Skip LINE reply.');
    return { skipped: true, reason: 'missing LINE_CHANNEL_ACCESS_TOKEN' };
  }

  if (!event.replyToken) {
    return { skipped: true, reason: 'missing replyToken' };
  }

  const response = await fetch(LINE_REPLY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channelAccessToken}`
    },
    body: JSON.stringify({
      replyToken: event.replyToken,
      messages: replyMessages
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LINE reply failed: ${response.status} ${text}`);
  }

  return { ok: true };
}

function buildReplyMessages(userMsg) {
  if (userMsg.includes('推薦') || userMsg.includes('吃什麼') || userMsg.includes('魚')) {
    return [{
      type: 'text',
      text: '🤖【AI 永續智能推薦】\n目前推薦：秋刀魚、鬼頭刀。\n請打開 3D 首頁後點選「附近的友善海鮮地圖」探索店家。'
    }];
  }

  if (userMsg.includes('AR') || userMsg.includes('體驗')) {
    return [{
      type: 'text',
      text: '📱 請在首頁點選「AR 互動與永續標籤」，可查看 3D 魚模型並在支援裝置上進入 AR 模式。'
    }];
  }

  return [{
    type: 'text',
    text: `您好，歡迎來到永續漁獲地圖。\n您剛才說的是：「${userMsg}」\n可輸入「推薦」或直接進站探索 3D 首頁。`
  }];
}
