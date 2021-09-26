import { Injectable } from '@angular/core';
import { UsersService } from '../users.service';
import { saveAs as importedSaverAs } from 'file-saver';


@Injectable()

export class sharedFunctions{
  constructor(private usersService: UsersService) {}
  
  fileFolder(fileName){
    let value = fileName.split('.');
    let ext = value[value.length - 1];
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "postPictures";}
    else if(ext == 'mp4'){ folder = "postVideos";}
    else if(ext == 'mp3'){ folder = "postAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "postDocuments";}
    else{ folder = "postFiles";}
    return folder;
  }
  
  imageToShow(file, folder?){
    var folderName;
    var fileName;
    if(folder){
      folderName = folder;
      fileName = file['picture'];
    }else{
      folderName = this.fileFolder(file['fileName']);
      fileName = file['fileName'];
    }
    this.usersService.getImage(fileName, folderName)
      .subscribe(data => {
        let reader = new FileReader();
        reader.onload = function(){
          file['image'] = reader.result;
        }
        if(data){
          reader.readAsDataURL(data);
        }
      });
  }
  
  postFolder(fileName){
    let value = fileName.split('.');
    let ext = value[value.length - 1];
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "postPictures";}
    else if(ext == 'mp4'){ folder = "postVideos";}
    else if(ext == 'mp3'){ folder = "postAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "postDocuments";}
    else{ folder = "postFiles";}
    return folder;
  }
  
  chatFolder(fileName){
    let value = fileName.split('.');
    let ext = value[value.length - 1];
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "chatPictures";}
    else if(ext == 'mp4'){ folder = "chatVideos";}
    else if(ext == 'mp3'){ folder = "chatAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "chatDocuments";}
    else{ folder = "chatFiles";}
    return folder;
  }
  
  docFolder(fileName){
    let value = fileName.split('.');
    let ext = value[value.length - 1];
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "docPictures";}
    else if(ext == 'mp4'){ folder = "docVideos";}
    else if(ext == 'mp3'){ folder = "docAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "docDocuments";}
    else{ folder = "docFiles";}
    return folder;
  }
  
  showImage(file, object? , attr?, folder?){
    let folderName, fileName;
    if(object == 'posts'){
      if(folder){
        folderName = folder;
        fileName = file['ownerPic'];
      }else{
        folderName = this.postFolder(file['fileName']);
        fileName = file['fileName'];}
    }
    
    else if(object == 'chats'){
      //this part is not really useful only if i want an image from a custom folder
      if(folder){
        folderName = folder;
        fileName = file['ownerPic'];
      }else{
        folderName = this.chatFolder(file['fileName']);
        fileName = file['fileName'];}
    }
    
    else if(object == 'docs'){
      if(folder){
        folderName = folder;
        fileName = file['ownerPic'];
      }else{
        folderName = this.docFolder(file['fileName']);
        fileName = file['fileName'];}
    }
    
    else if(object == 'login'){
      if(folder){
        folderName = folder;
        fileName = file['picture']}
    }
    
    else if(object == 'users'){
      if(folder){
        folderName = folder;
        fileName = file['picture']}
    };
    
    this.usersService.getImage(fileName, folderName)
      .subscribe(data => {
        let reader = new FileReader();
        reader.onload = function(){
          file[attr] = reader.result;}
        if(data){
          reader.readAsDataURL(data);
        }
      });
  }
  
  downloadImage(filename, category){
    let folderName;
    if(category == 'post'){
      folderName = this.postFolder(filename);
    }else if(category == 'chat'){
      folderName = this.chatFolder(filename);
    }else if(category == 'doc'){
      folderName = this.docFolder(filename);
    };
    
    this.usersService.getImage(filename, folderName)
      .subscribe(blob =>{
        importedSaverAs(blob, filename);
      })
  }
  
  shortenText(data, lenOri, propName, rem? ){
    if(data.fileName != undefined){
      let newFileName, tempFileName, extTempFileNameArray, extFileName, realFileName, remFileName, oldFileNameArray = data.fileName.split('_');
      tempFileName = oldFileNameArray[oldFileNameArray.length - 1];
      if(tempFileName.length >= lenOri){
        extTempFileNameArray = tempFileName.split('.');
        extFileName = extTempFileNameArray[extTempFileNameArray.length - 1];
        if(rem){
          realFileName = extTempFileNameArray[extTempFileNameArray.length - 2];
          remFileName = realFileName.slice(-rem);
          newFileName = tempFileName.substring(0, lenOri - (3 + extFileName.length + rem)) + '...' + remFileName+ '.' + extFileName;
        }else{
          newFileName = tempFileName.substring(0, lenOri - (3 + extFileName.length)) + '...' + extFileName;
        }
      }else{ newFileName = tempFileName; }
      data[propName] = newFileName;
    }
  }
}
