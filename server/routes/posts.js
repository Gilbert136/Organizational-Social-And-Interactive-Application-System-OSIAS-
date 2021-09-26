var mv = require('mv');
var jimp = require('jimp');
var Post = require('../models/post');
var method = require('../methods/global');


module.exports.addPost = function(req, res){
  var file = req.files.file;
  req.body = JSON.parse(req.body.data);
  
  req.checkBody('content', 'Content Required').notEmpty();
  req.checkBody('owner', 'Owner required').notEmpty();
  req.checkBody('ownerPic', 'OwnerPic required').notEmpty();
  req.checkBody('department', 'Department required').notEmpty();
  var errors = req.validationErrors();
  
  if(errors){ res.send({errors:errors});
  }else{ var type, size;
    if(file){
      var fileName=method.formatName(req.body.owner)+'_'+method.formatDateUpload()+'_'+method.formatFileName(file.originalFilename);
      type = method.fileType(fileName);
      size = method.fileSize(file.size.toString());
      var target=method.filePath(type,fileName), temp=file.path;
      req.body.fileName = fileName;
    }else{type = 'text';}
    
    req.body.type = type;
    req.body.fileSize = size;
    Post.addPost(req.body, function(err, post){
      if(err){throw err}
      if(type == 'text'){
        res.send({posted : post});
        
      }
      else{processFile(temp, target, res, post);}
    });
  }
  
  function processFile(tempPath, targetPath, response, data){
    if(type == 'picture'){
      jimp.read(tempPath, function(err, image){
        if(err){throw err;}
        var imageWidth = image.bitmap.width;
        var imageHeight = image.bitmap.height;
        var virtualWidth = 360;
        var virtualHeight = (virtualWidth * imageHeight)/imageWidth;
        
        image.resize(virtualWidth, virtualHeight).quality(70).write(targetPath, function(err, image){
          if(err){throw err;}
          response.send({posted : data});
        });
      });
    }else{
      mv(tempPath, targetPath, function(err){
        if(err){throw err;}
        response.send({posted : data});
        console.log('file moved successfully');
      });
    }
  }
};

//get all the post
module.exports.getPost = function(req, res){
  Post.getPost(req.query, function(err, post){
    if(err){throw err}
    res.send({posted: post});
  });
};

module.exports.addLikeDislike = function(req, res){
  if(req.body.method == "post"){
    Post.countLikeDislike(req.body.postId, function(err, post){
      if(err){throw err}
      if(post.liked === 0  && post.disliked === 0){
        Post.addLikeDislike(req.body, function(err, LDstatus){
          if(err){throw err}
          res.send({status: LDstatus});
        });
      }else{
        var data = {postId : req.body.postId, person : req.body.person, value : req.body.value};
        Post.inLikeDislike(data, function(err, result){
          if(err){throw err}
          Post.minusLikeDislike(req.body, function(err, data){
            res.send({status: data});
          });
        });
      }
    });
  }else if(req.body.method == "get"){
    Post.getLikeDislike({recent : true}, function(err, LikeDislike){
      if(err){throw err}
      res.send({status : LikeDislike});
      Post.recentLikeDislike({recent : true}, function(err, recentPostData){
        if(err){throw err}
        console.log(recentPostData)
      });
    });
  }
};
