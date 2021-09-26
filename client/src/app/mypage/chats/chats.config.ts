export class ChatConstruct {
  defaultFilespec:any;
  defaultFileStatus:any;
  
  constructor(){
    this.defaultFilespec={acceptExtensions:['jpg','png','pdf','ppt','mp3','doc','docx','mp4','txt', 'xls'],maxFilesCount: 1, maxFileSize: 51200000};
    this.defaultFileStatus = {status: undefined, value: undefined, file: undefined};
  }
}

