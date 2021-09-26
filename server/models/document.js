var mongoose = require('mongoose');

//document Schema
var DocumentSchema = mongoose.Schema({
  recent: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: false
  },
  owner: {
    type: String,
    required: true
  },
  tag: {
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
  department: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

var Doc = module.exports = mongoose.model('Doc', DocumentSchema);

//get document
module.exports.getDoc = function(docInfo, callback){
  var query, output = {}, option = {sort : {_id:-1}, limit: 15};
  
  if(docInfo.mission == 'initial'){
    query = {owner : docInfo.owner, tag: {'$in': docInfo.tags}};
    Doc.find(query, output, option, callback);
  }else if(docInfo.mission == 'previous'){
    query = {$and: [{owner : docInfo.owner}, {date_created: {'$lt': docInfo.docDate}}, {type: docInfo.type},
            {tag: {'$in': docInfo.tags}}]};
    Doc.find(query, output, option, callback);
  }
  
  
  
  else if(docInfo.mission == 'everyDoc'){
    query = {};
    option = {sort : {_id:-1}}
    Doc.find(query, output, option, callback);
  }
  
  //the everyDocByUser and initiall are the same just the option is different, find better means of solving this
  else if(docInfo.mission == 'everyDocByUser'){
    query = {owner : docInfo.owner};
    option = {sort : {_id:-1}}
    Doc.find(query, output, option, callback);
  }
}

//add documents
module.exports.addDoc = function(docInfo, callback){
  Doc.create(docInfo, callback);
}