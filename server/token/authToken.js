var jsonwebtoken = require('jsonwebtoken');
var config = require('../configuration/config');

module.exports.verifyToken = function(req, res, next){
  var token = req.headers['authorization'];
  jsonwebtoken.verify(token, config.secret, function(err, result){
    if(err){ req.Msg = {auth: false, _id: null}}
    else{ req.Msg = {auth: true, _id: result.id}}
    next();
  })
}

module.exports.setToken = function(req, res){
  var token = jsonwebtoken.sign({}, config.secret, {expiresIn: 86400});
}
