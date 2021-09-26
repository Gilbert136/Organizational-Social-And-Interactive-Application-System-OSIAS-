var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	titles: {
		type: [String],
		required:false
	},
	firstname: {
		type: String,
		required:true
	},
	lastname: {
		type: String,
		required:true
	},
	picture: {
		type: String,
		required:true
	},
	tag: {
    type: String,
    required: false
  },
	tags: {
    type: [String],
    required: false
  },
  category: {
		type: String,
		required:false,
		default: 'user'
	},
	contact: {
		type: String,
		required:true
	},
	department: {
		type: String,
		required:true
	},
	password: {
		type: String,
		required:true
	},
	email: {
		type: String,
		required:true
	},
	userstatus: {
		type: String,
		required:false
	},
	profession: {
	  type: String,
	  required:false
	},
	courses: {
    type: [String],
    required: false
  },
  socialaccounts: {
    type: [String],
    required: false
  },
  profileinfo: {
    type: [String],
    required: false
  },
  chatNotice: {
    type: Boolean,
    required: false,
    default: false
  },
	date_created: {
	  type: Date,
	  default: Date.now
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//creating user
module.exports.createUser = function(user, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        user.password = hash;
	        User.create(user, callback);
	    });
	});
}

//getting user by name
module.exports.getUserByUsername = function(name, callback){
	var query = {username: name};
	User.findOne(query, callback);
}

//compare if username already exit
module.exports.checkUser = function(name, callback){
  var query = {username: name};
  var output = {password: 0};
	User.findOne(query, output, callback);
}

//get user with id
module.exports.confirmUserbyID = function(id, callback){
  var query = {_id: id};
  User.findOne(query, callback);
}

//update the user status if the user is online or offline
module.exports.updateUserStatus = function(id, userStatus, callback){
  var query = {_id: id};
  var value = {$set: {userstatus : userStatus}};
  User.update(query, value, callback);
}

//update the user status if the user is online or offline
module.exports.updateUserChatNotice = function(id, notice, callback){
  var query = {_id: id};
  var value = {$set: {chatNotice : notice}};
  User.update(query, value, callback);
}

//compare password of user
module.exports.comparePassword = function(password, hash, callback){
	bcrypt.compare(password, hash, callback);
}

//get all users
module.exports.getAllUsers = function(data, callback){
  //i have to get all users except the one who request for it, do this only if there is an ids query
  //i think i have solve it for now havent seen any errors yet
  var query;
  var output = {password: 0};
  
  //i have get all users if no data information is provided, which i have done but it is not very clear
  if(typeof data.ids === 'object' ){ query = {_id: {$nin: data.ids}};
  }else if(typeof data.ids === 'string'){ query = {_id: {$ne: data.ids}};}
  User.find(query, output, callback);
}
