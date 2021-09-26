var mongoose = require('mongoose');

//chat Schema
var ChatSchema = mongoose.Schema({
  content: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    default: 'show',
    required: false
  },
  type: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: false
  },
  sender: {
    type: String,
    required: true
  },
  reciever: {
    type: String,
    required: true
  },
  downloaded: {
    type: Number,
    required: false
  },
  fileSize: {
    type: String,
    required: false
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

var Chat = module.exports = mongoose.model('Chat', ChatSchema);

//add chat
module.exports.addChat = function(chatInfo, callback){
  Chat.create(chatInfo, callback);
}

//get all chat of the person you are chatting with
module.exports.getChat = function(chatInfo, callback){
  var query, output = {}, option = {sort : {_id:-1}, limit: 15};
  
  if(chatInfo.mission == 'initial'){
    query = {'$and' : [{'$or':[{ sender : chatInfo.sender, reciever : chatInfo.reciever }, {sender : chatInfo.reciever, reciever : chatInfo.sender }]},
                      {visibility: chatInfo.visibility}]};
    Chat.find(query, output, option, callback);
  }
  
  else if(chatInfo.mission == 'previous'){
    query = {'$and' : [{'$or':[{sender: chatInfo.sender, reciever: chatInfo.reciever }, {sender: chatInfo.reciever,reciever: chatInfo.sender}]},                           {date_created: {'$lt': chatInfo.chatDate}, visibility: chatInfo.visibility}]};
    Chat.find(query, output, option, callback);
  }
  
  //i have to get raid of the content and others
  else if(chatInfo.mission == 'docs'){
    query = {'$or':[{sender: chatInfo.owner, type: {'$nin':['text']}}, {reciever: chatInfo.owner, type: {'$nin':['text']}}]};
    Chat.find(query, output, option, callback);
  }
  //i have to get raid of the content and others
  else if(chatInfo.mission == 'prevDocs'){
    query = {'$and': [{'$or':[{sender: chatInfo.owner, type: chatInfo.type}, {reciever: chatInfo.owner, type: chatInfo.type}]},
                      {date_created: {'$lt': chatInfo.chatDate}}]};
    Chat.find(query, output, option, callback);
  }
}

//update the chat to deleted or show
module.exports.updateVisibility = function(data, callback){
  var query = {_id: data._id};
  var value = {$set: {visibility : data.visibility}};
  Chat.update(query, value, callback);
}

//update the chat on the recent attribute
module.exports.updateChat = function(chatInfo, callback){
  var query, value;
  
  if(chatInfo.mission == 'availChats'){
    query = {'$and' : [{reciever: chatInfo.sender, sender: chatInfo.reciever}, {recent: true}]};
    value = {$set: {recent: false}};
    option = {multi: true}
    Chat.update(query, value, option, callback);
  }
}

module.exports.noticeChat = function(chatInfo, callback){
  var query, value;
  
  if(chatInfo.mission == 'notiRecentChat'){
    query = {recent: true};
    Chat.find(query, callback);
  }
}