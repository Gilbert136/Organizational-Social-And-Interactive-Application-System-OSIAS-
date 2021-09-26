var User = require('../models/user');
var Chat = require('../models/chat');

module.exports.Post = function(data, socket){
  let execute = 'socket';
  [data.tag].forEach((tag)=>{execute+='.to("'+tag+'")'}); execute+='.emit("message",data )';
  eval(execute);
}

module.exports.Typing = function(data, socket){
  let execute = 'socket';
  [data.tag].forEach((tag)=>{execute+='.to("'+tag+'")'}); execute+='.emit("typing", data )';
  eval(execute);
}

module.exports.Room = function(data, socket){
  socket.joinRooms.forEach((room)=>{ if(!data.includes(room)){ socket.leave(room)}});
  socket.joinRooms = data;
  data.forEach((tag)=>{ socket.join(tag) });
}

module.exports.Doc = function(data, socket){
  let execute = 'socket';
  [data.tag].forEach((tag)=>{execute+='.to("'+tag+'")'}); execute+='.emit("document",data )';
  eval(execute);
}

module.exports.User = function(data, socket, connectedUsers){
  if(data.mission == 'status'){
    if(data.userstatus == 'online'){ socket.userId = data._id; connectedUsers[data._id] = socket;
    }else{ delete connectedUsers[data._id]}
    User.updateUserStatus(socket.userId, data.userstatus, function(err, setStatus){ if(err) throw err});
    socket.broadcast.emit('user', {_id:data._id, userstatus:data.userstatus});
  }else if(data.mission == 'chatNotice'){
    User.updateUserChatNotice(data._id, data.userchatnotice, function(err, setStatus){ if(err) throw err});
  }
}

module.exports.Disconnected = function(socket, connectedUsers){
  console.log('user disconneced');
  User.updateUserStatus(socket.userId, 'offline', function(err, setStatus){ if(err) throw err;})
  delete connectedUsers[socket.userId];
  socket.broadcast.emit('user', {_id:socket.userId, userstatus:'offline'});
}

module.exports.Chat = function(data, socket, connectedUsers){
   console.log(Object.keys(connectedUsers));
  
  if(data.mission == 'message' || data.mission == 'typing'){
    console.log(data);
    if(data.message.reciever in connectedUsers){
      connectedUsers[data.message.reciever].emit('chat', data);
    }
  }
  
  else if(data.mission == 'chatDelete'){
    console.log(data);
    Chat.updateVisibility(data.message.content, function(err, setVisibility){ if(err) throw err;})
  }
}