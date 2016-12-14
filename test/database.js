var should = require('should');
var dateService = require('../services/dateService');
var connect = require('../services/connectionService');
var chatService = require('../services/chatService');


describe('Test Connection', function() {
    it('should connect to database', function() {
        connect.getConnection().then(function(db) {
            should.exist(db);
            describe('DateService', function() {
                var date = new Date();
                it('setDate', function() {
                    dateService.setDate(date).then(function(result) {
                        result.ok.should.equal(1);
                    });
                });
                it('getDate', function() {
                    dateService.getDate().then(function(result) {
                        date.should.equal(date, result.date);
                    });                       
                });
            });
            describe('ChatService', function() {
                var chatId = '1234123';
                it('saveChat', function() {
                    chatService.saveChat(chatId).then(result => {
                        should.ok(result.ok);
                    });
                });
                it('getChats', function() {
                    chatService.getChats().then(chats => {
                        chats.should.be.an.Array();
                        chats.length.should.be.equal(1);
                        chats[0].chatId.should.be.equal(chatId);
                    });
                });
                it('deleteChat', function() {
                    chatService.deleteChat(chatId).then(result => {
                        should.ok(result.result.ok);
                    });
                });
            });
        });  
    });
});
