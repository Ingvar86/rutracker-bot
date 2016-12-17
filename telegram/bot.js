'use strict';
var TelegramBot = require('node-telegram-bot-api');
var chatSetvice = require('../services/chatService');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
var bot;
// Create a bot that uses 'polling' to fetch new updates
if(process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
    bot = new TelegramBot(token, { polling: true });
}

// temporary

// Matches "/start"
bot.onText(/\/start/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

    var chatId = msg.chat.id;
    chatSetvice.saveChat(chatId);
  // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, 'notification started');
});

// Matches "/end"
bot.onText(/\/end/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

    var chatId = msg.chat.id;
    chatSetvice.deleteChat(chatId);
  // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, 'notification ended');
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', function (msg) {
//   var chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   // bot.sendMessage(chatId, "Received your message");
// });

bot.notifyAll = function (massage) {
    chatSetvice.getChats().then(chats => {
        chats.forEach((chat) => {
            bot.sendMessage(chat.chatId, massage);
        });
    });
};

module.exports = bot;