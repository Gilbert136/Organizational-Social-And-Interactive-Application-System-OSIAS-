var path = require('path');
var mv = require('mv');
var Chat = require('../models/chat');

//adds chat to db
module.exports.addChat = function(req, res){

  req.body = JSON.parse(req.body.data);
  req.checkBody('sender', 'Sender required').notEmpty();
  req.checkBody('reciever', 'Reciever required').notEmpty();
  var errors = req.validationErrors();
  if(errors){ res.send({error: errors}) }
  
  if(req.files.file){
    req.body.downloaded = 0;
    req.body.fileName = Date.now()+'_'+req.body.fileName;
    pathChange(req.files.file, req.body.fileName, req.body.type);
  }else{addChat()}

  //changing file path
  function pathChange(f, n, t){ var targetPath; tempPath = f.path;
    if(t == 'picture' ){ targetPath = path.join(__dirname, '../uploads/chatPictures/' + n);
    }else if(t == 'video'){ targetPath = path.join(__dirname, '../uploads/chatVideos/' + n);
    }else if(t == 'audio'){ targetPath = path.join(__dirname, '../uploads/chatAudios/' + n);
    }else if(t == 'document'){ targetPath = path.join(__dirname, '../uploads/chatDocuments/' + n);
    }else{ targetPath = path.join(__dirname, '../uploads/chatFiles/' + n)}
    mv(tempPath, targetPath, function(err){if(err){throw err} addChat();});
  }
  
  //adding chats to db
  function addChat(){
    Chat.addChat(req.body, function(err, chat){ if(err){throw err} res.send({chated:chat}); });
  }
}

//get chat from db
module.exports.getChat = function(req, res){
  Chat.getChat(req.query, function(err, chat){
    if(err){throw err}
    console.log(chat);
    res.send({chated: chat});
  });
}

//update chat in db
module.exports.updateChat = function(req, res){
  Chat.updateChat(req.body, function(err, chat){
    console.log(req.body);
    if(err){throw err}
    console.log(chat);
    res.send({update: chat});
  });
}

//get notification for recent chat
module.exports.noticeChat = function(req, res){
  Chat.noticeChat(req.query, function(err, chat){
    if(err){throw err}
    res.send({notice: chat});
  });
}