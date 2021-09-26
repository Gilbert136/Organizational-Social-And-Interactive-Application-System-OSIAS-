export class DocumentConstruct {
  
  defaultTag:string;
  defaultFilespec:any;
  defaultTags:string[];
  
  constructor(){
    this.defaultTags=[];
    this.defaultTag='Public';
    this.defaultFilespec={acceptExtensions: ['jpg','png','pdf','ppt','mp3','doc','docx','mp4','txt', 'xls'],
                          maxFilesCount: 1, maxFileSize:102400000};
  }
  
  tagToName(data, userData){ let name;
    if(data == 'Private'){ name = userData['username']}
    else if(data == 'Department'){ name = userData['department']}
    else{ name = data}
    return name;
  }
}

export class FileProfile{
  selectedFile:any;
  progStyle:any;
  fileProblem:string;
  short_fileName:string;
  uploadPro:string;
  tag:string;
}

export class Document{
  picture:any[];
  video:any[];
  date:{ doc:{picture:string, video:string}, chat:{picture:string, video:string}, post:{picture:string, video:string} };
}
