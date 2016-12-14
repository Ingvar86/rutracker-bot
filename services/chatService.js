var connect = require('../services/connectionService');

function getChats() {        
    return connect.getConnection().then((db) => {
        return db.collection('chats').find().toArray();
    });
}

function saveChat(chatId) {
    return connect.getConnection().then((db) => {
        return db.collection('chats').findOneAndUpdate({chatId: chatId}, {$set: {chatId: chatId}}, {upsert: true});
    });
}

function deleteChat(chatId) {
    return connect.getConnection().then((db) => {
        return db.collection('chats').deleteOne({chatId: chatId});
    });
}

exports.getChats = getChats;
exports.saveChat = saveChat;
exports.deleteChat = deleteChat;