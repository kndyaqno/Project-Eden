const axios = require('axios');
const request = require('request');

// Your Facebook Page Access Token
const PAGE_ACCESS_TOKEN = 'EAAFE8bSLVYsBO4EbJZAqp91HipjGxMF2aRwTz4oXhgZCasSeNravWjZCEdkc9NnfEqZBoZBigGyfQcW1W11mVHNx8eMCWaCzWvnovbnOiSHcOWaUvYdIwa6RKX5AlR7MpfcF3erVYO4wVplgiX3y6ZCHLIFauLnCCVplgSlqQuJxcCTZBd9HPfRkhyrodd2FICP9azuAxufDZBh61t21';

// Your OpenAI API Key
const OPENAI_API_KEY = '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';

function handleWebhook(req, res) {
  // Verify webhook with Facebook
  if (req.query['hub.verify_token'] === 'your_verification_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
}

async function handleWebhookPost(req, res) {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Handle incoming messages and generate responses using GPT-3
      handleIncomingMessage(webhookEvent.sender.id, webhookEvent.message.text);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
}

async function generateGPTResponse(userMessage) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: userMessage,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating GPT response:', error.message);
    return 'An error occurred while generating a response.';
  }
}

function sendMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v12.0/me/messages',
    qs: { access_token: EAAFE8bSLVYsBO4EbJZAqp91HipjGxMF2aRwTz4oXhgZCasSeNravWjZCEdkc9NnfEqZBoZBigGyfQcW1W11mVHNx8eMCWaCzWvnovbnOiSHcOWaUvYdIwa6RKX5AlR7MpfcF3erVYO4wVplgiX3y6ZCHLIFauLnCCVplgSlqQuJxcCTZBd9HPfRkhyrodd2FICP9azuAxufDZBh61t21 },
    method: 'POST',
    json: messageData,
  }, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log('Message sent successfully');
    } else {
      console.error('Unable to send message:', err);
    }
  });
}

module.exports = { handleWebhook, handleWebhookPost, handleIncomingMessage, generateGPTResponse, sendMessage, callSendAPI };
