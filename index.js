const express = require('express');
const bodyParser = require('body-parser');
const { handleWebhook, handleIncomingMessage, handleGPTResponse, sendMessage, callSendAPI } = require('./controllers');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, this is your Messenger bot!');
});

app.get('/webhook', handleWebhook);

app.post('/webhook', (req, res) => {
  handleWebhookPost(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
