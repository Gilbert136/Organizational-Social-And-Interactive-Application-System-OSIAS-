var path = require('path');
var jsonwebtoken = require('jsonwebtoken');
var User = require('../models/user');
var method = require('../methods/global');
var config = require('../configuration/config');


//i have to take this one out becouse it is not part of the codes anymore
// Register get page
module.exports.getRegister = function(req, res){
	res.render('register');
};

//i have to take this one out becouse it is not part of the codes anymore
// Login get page
module.exports.getLogin = function(req, res){
	res.render('login');
};

// Register User
module.exports.Register = function(req, res){
  var file = req.files.file;
  req.body = JSON.parse(req.body.data);
	
	//check if username exist
	User.checkUser(req.body.username, function(err, user){
    if(err) throw err;
    if(user !== null){return res.send({exist : 'Username already exist'});
    }else{
    	req.checkBody('email', 'Email is required').notEmpty();
    	req.checkBody('email', 'Email is not valid').isEmail();
    	req.checkBody('firstname', 'First Name is required').notEmpty();
    	req.checkBody('lastname', 'Last Name is required').notEmpty();
    	req.checkBody('contact', 'Contact is required').notEmpty();
    	req.checkBody('department', 'Department is required').notEmpty();
    	req.checkBody('username', 'Username is required').notEmpty();
    	req.checkBody('password', 'Password is required').notEmpty();
    	req.checkBody('password2', 'Password do not match').equals(req.body.password);
    	var errors = req.validationErrors();
    	if(errors){ return res.send({errors:errors});
    	}else{ var fileName = method.formatName(req.body.username)+'_'+method.formatDateUpload()+'_'+
    	  method.formatFileName(file.originalFilename);
        var targetPath = path.join(__dirname, '../uploads/profilePictures/'+fileName);
    	  var tempPath = file.path;
    	  req.body.picture = fileName;
    	  req.body.tag = 'Public';
    	  req.body.tags = [req.body.tag, req.body.username, req.body.department];
    	  req.body.userstatus = 'offline';
    		User.createUser(req.body, function(err, user){
    			if(err) throw err;
    			method.processPic(targetPath ,tempPath);
    			return res.send({created : 'You are registered and can now login'});
    		});}}});
};

//get User
module.exports.getUser = function(req, res){
  if(req.Msg.auth){
    if(req.Msg.username == req.query.username){
      User.checkUser(req.query.username, function(err, user){
        if(err) throw err;
        return res.send({user: user});
      })
    }else{return res.send({user: null})}
  }else{return res.send({user: null})}
}

module.exports.confirmUserbyID = function(req, res, next){
  User.confirmUserbyID(req.Msg._id, function(err, user){
    if(err) throw err;
    if(user === null){req.Msg.auth = false}
    else{req.Msg.username = user.username}
    next();
  })
}

//get Users
module.exports.getUsers = function(req, res){
  User.getAllUsers(req.query, function(err, users){
    if(err) throw err;
    return res.send({users : users});
  })
}

module.exports.IDtoUsername = function(req, res){
  User.confirmUserbyID(req.Msg._id, function(err, user){
    if(err) throw err; req.Msg._id = undefined;
    if(user === null){
      req.Msg.auth = false;
      return res.send({result: req.Msg});
    }else{
      req.Msg.username = user.username;
      return res.send({result: req.Msg});
    }
  })
}

module.exports.login = function(req, res){
  //console.log(req.body);
  req.body = JSON.parse(req.body.data);
  User.getUserByUsername(req.body.username, function(err, user){
    if(err) throw err;
    if(!user){ return res.send({message : "Username Invalid"})}
    User.comparePassword(req.body.password, user.password, function(err, match){
      if(err) throw err;
      if(!match){ return res.send({message : "Password Invalid"})}
      user.password = undefined;
      User.updateUserStatus(user._id, "online", function(err, result){
 		    if(err) throw err;
 		    var token = jsonwebtoken.sign({id:user._id}, config.secret
 		   // , {expiresIn: 86400}
 		    );
 		    var userData = {username : user.username, token: token}
 	      return res.send({success: userData})
 		  })
    })
  })
};

module.exports.logout = function(req, res){
  User.updateUserStatus(req.body._id, req.body.userstatus, function(err, setStatus){
    if(err) throw err;
    return res.send({user : setStatus});
  })
}

module.exports.Logout = function(req, res){
	req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};

