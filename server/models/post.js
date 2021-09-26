var mongoose = require('mongoose');

//post Schema
var PostSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  like: {
    type: [String],
    required: false,
    default: []
  },
  dislike: {
    type: [String],
    required: false,
    default: []
  },
  liked: {
    type: Number,
    required: false,
    default: 0
  },
  recent: {
    type: Boolean,
    required: false
  },
  disliked: {
    type: Number,
    required: false,
    default: 0
  },
  tag: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: false
  },
  fileSize: {
    type: String,
    required: false
  },
  owner: {
    type: String,
    required: true
  },
	ownerPic: {
	  type: String,
		required:true
	},
  download: {
    type: [String],
    required: false,
    default: []
  },
  downloaded: {
    type: Number,
    required: false,
    default: 0
  },
  department: {
    type: String,
    required: false
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

var Post = module.exports = mongoose.model('Post', PostSchema);

//get post
module.exports.getPost = function(postInfo, callback){
  var query; var value = {}; var option = {sort : {_id:-1}, limit: 10};
  
  if(postInfo.mission == 'initial'){
    query = { tag: {'$in': postInfo.tags}};
    Post.find(query, value, option, callback);
  }
  
  else if(postInfo.mission == 'previous'){
    query = { '$and' : [{tag: {'$in': postInfo.tags}}, {date_created : { '$lt' : postInfo.postDate}}]};
    Post.find(query, value, option, callback);
  }
  
  //i have to get raid of the content and color and others
  else if(postInfo.mission == 'docs'){
    query = { tag: {'$in': postInfo.tags}, type: {'$nin':['text']} };
    Post.find(query, value, option, callback);
  }
  
  //i have to get raid of the content and color and others
  else if(postInfo.mission == 'prevDocs'){
    query = {'$and': [{tag: {'$in': postInfo.tags}}, {date_created :{'$lt': postInfo.postDate}}, {type: {'$nin':['text']}},
                      {type: postInfo.type}]};
    Post.find(query, value, option, callback);
  }
  
};

//add post
module.exports.addPost = function(postData, callback){
  Post.create(postData, callback);
};


//check if like and dislike is empty
module.exports.countLikeDislike = function(id, callback){
  var query = {_id : id};
  var output = {liked : 1, disliked : 1, downloaded : 1};
  Post.find(query, output, callback);
}
;
//check if ownerIn in like or dislike
module.exports.inLikeDislike = function(data, callback){
  var query; var value;
  if(data.value == 1){
    query = {_id : data.postId, like : {$nin : [data.person]}};
    value = {$set: {recent : true, like: data.person}, $inc : {liked : 1}};
    Post.update(query, value, callback);
  }else if(data.value == 2){
    query = {_id : data.postId};
    value = {$addToSet: {download: data.person}, $inc : {downloaded : 1}, $set: {recent : true}};
    Post.update(query, value, callback);
  }else{
    query = {_id : data.postId, dislike : {$nin : [data.person]}};
    value = {$set: {recent : true, dislike: data.person}, $inc : {disliked : 1}};
    Post.update(query, value, callback);
  }
}

module.exports.minusLikeDislike = function(data, callback){
  var query; var value;
  if(data.value == 1){
    query = {_id : data.postId, dislike : {$in : [data.person]}};
    value = {$pull: {dislike: data.person}, $inc : {disliked : -1}};
    Post.update(query, value, callback);
  }else{
    query = {_id : data.postId, like : {$in : [data.person]}};
    value = {$pull: {like: data.person}, $inc : {liked : -1}};
    Post.update(query, value, callback);
  }
}

//add like and dislike
module.exports.addLikeDislike = function(LikeDislike, callback){
  var query; var value;
  if(LikeDislike.value == 1){
    query = {_id : LikeDislike.postId};
    value = {$set: {recent : true, like: LikeDislike.person}, $inc : {liked : 1}};
    Post.update(query, value, callback);
  }else if(LikeDislike.value == 2){
    query = {_id : LikeDislike.postId};
    value = {$addToSet: {download: LikeDislike.person}, $inc : {downloaded : 1}, $set: {recent : true}};
    Post.update(query, value, callback);
  }
  else{
    query = {_id : LikeDislike.postId};
    value = {$set: {recent : true, dislike: LikeDislike.person}, $inc : {disliked : 1}};
    Post.update(query, value, callback);
  }
}

module.exports.getLikeDislike = function(data, callback){
  var query = data;
  var output = {liked : 1, disliked : 1, recent : 1, downloaded : 1};
  Post.find(query, output, callback);
}

module.exports.recentLikeDislike = function(data, callback){
  var query = data;
  var value = {$set : {recent : 'false'}};
  var output = {multi : true};
  Post.update(query, value, output, callback);
}



