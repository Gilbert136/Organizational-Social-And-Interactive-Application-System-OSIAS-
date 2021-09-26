var Doc = require('../models/document');
var path = require('path');
var mv = require('mv');
var jimp = require('jimp');


//get all the document
module.exports.getDoc = function(req, res){
  Doc.getDoc(req.query, function(err, doc){
    if(err){throw err}
    console.log('----------');
    console.log(doc);
    console.log('----------');
    res.send({doc: doc});
  });
};

//add documents
module.exports.addDoc = function(req, res){
  
  initiateProcess();
  
  //kick off the whole process
  function initiateProcess(){
    req.body = JSON.parse(req.body.data);
    validation();
    infoCheck(req.files.file);
  }
  
  //change fileName
  //saving the file date is not necessary
  //date makes the file unique
  //main filename should always be places last
  //sometimes it says fileName to long and i have to check that one also
  function fileName(f){ var fileName;
    var origFile=f.originalFilename; origFile=origFile.replace(/-/g, ''); origFile=origFile.replace(/ /g, '-'); origFile=origFile.replace(/_/g, '-');
    var uploadDate = new Date().toISOString();
    uploadDate=uploadDate.replace(/-/g, ''); uploadDate=uploadDate.replace(/:/g, ''); uploadDate=uploadDate.replace('.', '');
    fileName = req.body.owner +'_'+ req.body.department +'_'+ uploadDate+'_'+ origFile.toString();
    return fileName;
  }
  
  //check fileType
  function fileType(t){ var fileType;
    if(t){ var nameSplit = t.split("."); ext = nameSplit[nameSplit.length - 1];
      if(ext == 'jpg' || ext == 'png'){ fileType = 'picture';
      }else if(ext == 'mp4'){ fileType = 'video';
      }else if(ext == 'mp3'){ fileType = 'audio';
      }else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt' || ext == 'txt' || ext == 'xls'){ fileType = 'document';
      }else{ fileType = 'file'; }
    }return fileType;
  }
  
  //check fileSize
  function fileSize(s){ var fileSize;
    //have to convert size to units
    fileSize = sizeConv(s.size.toString());
    return fileSize;
  }
  
  //check content
  //be careful when refactoring, there are modification in this that is different in the chats.js
  function infoCheck(file){
    if(file){
      req.body.downloaded = 0;
      req.body.recent = true;
      req.body.fileSize = fileSize(file);
      req.body.fileName = fileName(file);
      req.body.type = fileType(req.body.fileName);
      pathChange(file, req.body.fileName, req.body.type);
    }
    console.log(req.body);
  }
  
  //convert size
  function sizeConv(c){ var size;
    size = parseInt(c);
    var interval = [
      { min: 0 , max: 999, value: 'B'},
      { min: 1000 , max: 999999, value: 'KB'},
      { min: 1000000 , max: 999999999 , value: 'MB'},
      { min: 1000000000 , max: 999999999, value: 'GB'}];
    if((size >= interval[0].min) && (size <= interval[0].max)){ size = c + interval[0].value }
    else if((size >= interval[1].min) && (size <= interval[1].max)){ size = (c.substring(0, c.length - 3)).toString() + interval[1].value }
    else if((size >= interval[2].min) && (size <= interval[2].max)){ size = (c.substring(0, c.length - 6)).toString() + interval[2].value }
    return size;
  }
  
  
  //changing file path
  function pathChange(f, n, t){ var targetPath; tempPath = f.path;
    if(t == 'picture' ){ targetPath = path.join(__dirname, '../uploads/docPictures/' + n);
    }else if(t == 'video'){ targetPath = path.join(__dirname, '../uploads/docVideos/' + n);
    }else if(t == 'audio'){ targetPath = path.join(__dirname, '../uploads/docAudios/' + n);
    }else if(t == 'document'){ targetPath = path.join(__dirname, '../uploads/docDocuments/' + n);
    }else{ targetPath = path.join(__dirname, '../uploads/docFiles/' + n);}
    mv(tempPath, targetPath, function(err){
      if(err){throw err;}
      imageResize(t, targetPath);
    });
  }
  
  //resize image
  function imageResize(i, p){
    if(i == 'picture'){
      jimp.read(p, function(err, image){
        if(err){throw err;}
          var imageWidth = image.bitmap.width;
          var imageHeight = image.bitmap.height;
          var virtualWidth = 300;
          var virtualHeight = (virtualWidth * imageHeight)/imageWidth;
          resaveImage(image, virtualWidth, virtualHeight, p);
        });
    }
  }
  
  //resave image
  function resaveImage(a, x, y, p){
    a.resize(x, y)
    .quality(80)
    .write(p);
  }
  
  //validation
  function validation(){
    req.checkBody('owner', 'Owner required').notEmpty();
    req.checkBody('department', 'Department required').notEmpty();
    req.checkBody('tag', 'Tag required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
      res.send({errors: errors});
    }
  }
  
  //adding Doc to db
  Doc.addDoc(req.body, function(err, doc){
    if(err){throw err}
    res.send({doc : doc});
  });
  
}