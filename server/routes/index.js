var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
  res.cookie("SESSIONID", 'you', {httpOnly:true, secure:false});
	console.log(res);
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
	  res.cookie("SESSIONID", 'you', {httpOnly:true, secure:true});
	  console.log(res);
		res.redirect('/users/login');
	}
}

module.exports = router;