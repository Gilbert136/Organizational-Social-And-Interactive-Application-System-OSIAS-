var path = require('path');
var mv = require('mv');
var jimp = require('jimp');

var cropImage = function(targetPath, image, x1, y1, x2, y2){
  image.crop(x1, y1, x2, y2)
  .quality(80)
  .write(targetPath);
}

module.exports.formatFileName = function(name){
  var formatName = name.replace(/-/g, '');
  formatName = formatName.replace(/ /g, '-');
  formatName = formatName.replace(/_/g, '-');
  return formatName;
}

module.exports.formatName = function(name){
  var formatName = name.replace(/ /g, '-');
  return formatName;
}

module.exports.formatDateUpload = function(){
  var uploadDate = new Date().getTime();
  return uploadDate;
}

module.exports.processPic = function(targetPath, tempPath){
  mv(tempPath, targetPath, function(err) {
    if (err) {throw err;}
    jimp.read(targetPath, function(err, image){
      if(err){throw err;}
      var imageWidth = image.bitmap.width;
      var imageHeight = image.bitmap.height;
      var imageRemain = 0;
      var imageCropX1 = 0;
      
      if (imageWidth > imageHeight){
        imageRemain = imageWidth - imageHeight;
        imageCropX1 = imageRemain / 2;
        cropImage(targetPath, image, imageCropX1, 0, imageHeight, imageHeight);
      }
      else if(imageWidth < imageHeight){
        imageRemain = imageHeight - imageWidth;
        imageCropY1 = imageRemain / 2;
        cropImage(targetPath, image, 0, imageCropY1, imageWidth, imageWidth);
      }
    });
    console.log('file moved successfully');
  });
}

module.exports.filePath = function(type, fileName){
  var targetPath;
  if(type == 'picture'){ targetPath = path.join(__dirname, '../uploads/postPictures/' + fileName);
  }else if(type == 'video'){ targetPath = path.join(__dirname, '../uploads/postVideos/' + fileName);
  }else if(type == 'audio'){ targetPath = path.join(__dirname, '../uploads/postAudios/' + fileName);
  }else if(type == 'document'){targetPath = path.join(__dirname, '../uploads/postDocuments/' + fileName);
  }else{ targetPath = path.join(__dirname, '../uploads/postFiles/' + fileName);}
  return targetPath;
}

module.exports.fileType = function(file){ var type, nameSplit = file.split("."), ext = nameSplit[nameSplit.length - 1];
  if(ext == 'jpg' || ext == 'png'){ type = 'picture';
  }else if(ext == 'mp4'){ type = 'video';
  }else if(ext == 'mp3'){ type = 'audio';
  }else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt' || ext == 'txt' || ext == 'xls'){ type = 'document';
  }else{ type = 'file'; }
  return type;
}

function sizeConv(c){ var size;
  size = parseInt(c);
  var interval = [{min:0, max:999, value:'B'}, {min:1000, max:999999, value:'KB'}, {min:1000000, max:999999999, value:'MB'},
    {min:1000000000, max:999999999, value:'GB'}];
  if((size >= interval[0].min) && (size <= interval[0].max)){ size = c + interval[0].value }
  else if((size >= interval[1].min) && (size <= interval[1].max)){ size = (c.substring(0, c.length - 3)).toString() + interval[1].value }
  else if((size >= interval[2].min) && (size <= interval[2].max)){ size = (c.substring(0, c.length - 6)).toString() + interval[2].value }
  return size;
}

module.exports.fileSize = function(info){var size, data = parseInt(info);
  var int = [{min:0, max:999, value:'B'}, {min:1000, max:999999, value:'KB'}, {min:1000000, max:999999999, value:'MB'},
                  {min:1000000000, max:999999999, value:'GB'}];
  
  if((data>=int[0].min) && (data<=int[0].max)){size=info+int[0].value }
  else if((data>=int[1].min) && (data<=int[1].max)){size=(info.substring(0, info.length-3)).toString()+int[1].value}
  else if((data>=int[2].min) && (data<=int[2].max)){size=(info.substring(0, info.length-6)).toString()+int[2].value}
  return size;
}
