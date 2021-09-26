import { Ng4FilesStatus, Ng4FilesSelected } from './ng4-files';
import { Configuration } from '../global.config';

export class SharedFunction {
  server:string;
  
  constructor(){
    this.server = new Configuration().server;
  }
  
  setLocalStorage(data){
    localStorage.setItem('info', data);
  }
  
  removeLocalStorage(){
    localStorage.removeItem('info');
  }
  
  getLocalStorage(){
    return localStorage.getItem('info');
  }
  
  setPath(data, property, name, optCategory?){
    if(optCategory){
      data[name] = this.server+this.getPath(data['category'], data[property], optCategory);
    }else{
      data[name] = this.server+this.getPath(data['category'], data[property]);
    }
    return data;
  }
  
  
  shortText(FileName, lenOri, rem?):string{
    let newFileName, extTempFileNameArray, extFileName, realFileName, remFileName
    if(FileName.length >= lenOri){
      extTempFileNameArray = FileName.split('.');
      extFileName = extTempFileNameArray[extTempFileNameArray.length - 1];
      if(rem){
        realFileName = extTempFileNameArray[extTempFileNameArray.length - 2];
        remFileName = realFileName.slice(-rem);
        newFileName = FileName.substring(0, lenOri-('...'.length + extFileName.length + rem))+ '...' + remFileName+ '.' + extFileName;
      }else{newFileName = FileName.substring(0, lenOri - ('...'.length + extFileName.length))+ '...' + extFileName;}
    }else{newFileName = FileName}
    return newFileName;
  }
  
  shortenText(data, lenOri, propName, rem?):void{
    if(data.fileName != undefined){
      let tempFileName, oldFileNameArray = data.fileName.split('_');
      tempFileName = oldFileNameArray[oldFileNameArray.length - 1];
      data[propName] = this.shortText(tempFileName, lenOri, rem);
    }
  }
  
  shortFilename(data){
    let tempNameArray = data.split('_');
    return tempNameArray[tempNameArray.length-1];
  }
  
  normalCal(data){
    let date = new Date(data['date_created']).toJSON().slice(0, 16).replace(/T/g, ' ');
    return date;
  }
  
  shortDate(data){
    let date = new Date(data).toJSON().slice(0, 16).replace(/T/g, ' ');
    return date;
  }
  
  fileFunction(Files: Ng4FilesSelected, utility: string):any{
    let msg, value;
    if(Files.status === Ng4FilesStatus.STATUS_SUCCESS){
      value = 'File successful';
      msg = {status: Ng4FilesStatus.STATUS_SUCCESS, value: value, file: Array.from(Files.files).map(file => file)[0]};
    }else if(Files.status === Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED){
      value = 'File is larger than ' + utility;
      msg = {status: Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED, value: value, file: undefined };
    }else if(Files.status === Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS){
      value = 'File extention not match';
      msg = {status: Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS, value: value, file: undefined };
    }else{
      value = 'File problem';
      msg = {status: undefined, value: value, file: undefined };
    }return msg
  }
  
  sizeConvent(c:string):string{
    let interval=[
      { min: 0 , max: 999, val: 'B'},
      { min: 1000 , max: 999999, val: 'KB'},
      { min: 1000000 , max: 999999999 , val: 'MB'},
      { min: 1000000000 , max: 999999999, val: 'GB'}];
    let size = parseInt(c);
    if((size >= interval[0].min) && (size <= interval[0].max)){c = c+interval[0].val}
    else if((size >= interval[1].min) && (size <= interval[1].max)){c = (c.substring(0, c.length-3)).toString()+interval[1].val}
    else if((size >= interval[2].min) && (size <= interval[2].max)){c = (c.substring(0, c.length-6)).toString()+interval[2].val}
    return c;
  }
  
  getExt(ext:string):string{
    let value = ext.split('.');
    return value[value.length - 1];
  }
  
  getPath(category:string, filename:string, optCategory?:string):string{
    let folder;
    if(optCategory){
      if(optCategory == 'user'){folder = this.userFolder(filename)}
      else if(optCategory == 'chat'){folder = this.chatFolder(filename)}
      else if(optCategory == 'post'){folder = this.postFolder(filename)}
      else if(optCategory == 'doc'){folder = this.docFolder(filename)}
    }else{
      if(category == 'user'){folder = this.userFolder(filename)}
      else if(category == 'chat'){folder = this.chatFolder(filename)}
      else if(category == 'post'){folder = this.postFolder(filename)}
      else if(category == 'doc'){folder = this.docFolder(filename)}
    }
    return folder+'/'+filename;
  }
  
  userFolder(filename:string):string{
    let folder = 'profilePictures';
    return folder;
  }
  
  postFolder(filename:string):string{
    let ext = this.getExt(filename);
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "postPictures";}
    else if(ext == 'mp4'){ folder = "postVideos";}
    else if(ext == 'mp3'){ folder = "postAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "postDocuments";}
    else{ folder = "postFiles";}
    return folder;
  }
  
  chatFolder(filename:string):string{
    let ext = this.getExt(filename);
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "chatPictures";}
    else if(ext == 'mp4'){ folder = "chatVideos";}
    else if(ext == 'mp3'){ folder = "chatAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "chatDocuments";}
    else{ folder = "chatFiles";}
    return folder;
  }
  
  docFolder(filename:string):string{
    let ext = this.getExt(filename);
    let folder;
    if(ext == 'jpg' || ext == 'png'){ folder = "docPictures";}
    else if(ext == 'mp4'){ folder = "docVideos";}
    else if(ext == 'mp3'){ folder = "docAudios";}
    else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt'){ folder = "docDocuments";}
    else{ folder = "docFiles";}
    return folder;
  }
}