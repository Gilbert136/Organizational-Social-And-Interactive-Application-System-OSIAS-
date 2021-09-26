import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { UsersService } from '../users.service';
import { HttpEventType } from '@angular/common/http';
import { sharedFunctions } from '../shared/sharedFunctions';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from '../shared/ng4-files';
import { SharedFunction } from '../shared/shared.function';
import { WebSocketService } from '../webSocket.service';
 
declare var jquery:any;
declare var $:any;

@Component({
  selector : 'chats-component',
  templateUrl : 'chats.component.html',
  styleUrls : ['chats.component.css']
})

export class ChatsComponent implements OnInit, OnDestroy{
  @Input() flowData: any[];

  sharedConfig: Ng4FilesConfig;
  
  chatInputs: boolean;
  uploadProg: number;
  progStyle: any;
  fileProblem: string;
  
  
  selectedFile: any;
  usersList: any[];
  chatWith: any;

  usersWidth:any;
  typing:boolean;

  methodShared: SharedFunction;
  

  constructor(private usersService: UsersService, private sharedFunctions: sharedFunctions, private ng4FilesService: Ng4FilesService,
    private wsService:WebSocketService ){
    this.usersList = [];
    this.chatWith = [];
    this.chatInputs = true;
    this.selectedFile = {};
    this.uploadProg = 0;
    this.progStyle = {};
    this.fileProblem = '';

    this.methodShared = new SharedFunction();
    
    this.sharedConfig  = { acceptExtensions: ['jpg','png','pdf','ppt','mp3','doc','docx','mp4','txt', 'xls'], maxFilesCount: 1, maxFileSize: 51200000};
    
    this.chatWith = {};
    this.typing = false;

    this.wsService.onUser().subscribe(data=>{console.log(data); this.updateUsersList(data)});
    this.wsService.onChat().subscribe(data=>{ this.message(data) });
  }

  ngOnInit(){
    let ids = [ this.flowData['_id'] ];
    const credValue = {
      ids: ids
    };
    //gets all the users except the one who requested for data
    this.usersService.getAllUsers(credValue)
      .subscribe(info =>{
        this.usersList = info['users'];
        this.usersWidth = {width: (this.usersList.length*40) + 'px'};
        for(let x = 0; x < this.usersList.length; x++){
          this.sharedFunctions.showImage(this.usersList[x], 'users', 'image', 'profilePictures');
          this.usersList[x].chat = [];
        }
      });
    this.ng4FilesService.addConfig(this.sharedConfig);
    this.jqueryFunction();
  }
  
  updateUsersList(data){
    let user = this.usersList.find((user)=>{ return user._id === data._id});
    if(user){ user.userstatus = data.userstatus}
  }

  
  onScroll(e){
    //i have to store each client scroll level in their own object but not now koraa, later
    if(e.target.scrollTop === 0){
      this.previousChat();
    }
  }
  
  //getting the previous or past chat that are not displayed
  previousChat(){
    if(this.chatWith['chat'].length){
      let mission = 'previous';
      const previous = {
        mission : mission,
        sender : this.flowData['_id'],
        reciever : this.chatWith['_id'],
        chatDate : this.chatWith['chat'][0].date_created
      };
      this.usersService.previousChat(previous)
        .subscribe(chat => {
          let prevChat = chat['chated'];
          if(prevChat.length > 0){
            for(let x = 0; x < prevChat.length; x++){
              prevChat[x] = this.chatEdit(prevChat[x]);
              this.chatWith['chat'].unshift(prevChat[x]);
            };
          }
        })
        console.log(previous);
    }
  }
  
  //getting the initial chat
  startChat(data){
    this.chatWith['_id'] = data._id;
    this.chatWith['username'] = data.username;
    this.chatWith['image'] = data.image;
    
    if(data.chat.length){
      console.log('already threr');
      this.chatWith['chat'] = data.chat;
    }else{
      let mission = 'initial';
      const initial = {
        mission : mission,
        sender : this.flowData['_id'],
        reciever : this.chatWith['_id']
      };
      this.usersService.getChat(initial)
        .subscribe(chat => {
          data.chat = chat['chated'].reverse();
          for(let x = 0; x < data.chat.length; x++){data.chat[x] = this.chatEdit(data.chat[x]);};
          this.chatWith['chat'] = data.chat;
      });
      this.chatInputs = false;
      console.log(initial);
    };
    
    if(data.chatNotice){ this.chatNotice(false, data) }
  }
  
  message(data){
    if(data.mission == 'message'){
      if(this.chatWith['_id'] == data.message.sender){
        this.chatWith['chat'].push(this.chatEdit(data.message));
      }else{
        let user=this.usersList.find((user)=>{ return user._id === data.message.sender});
        if(user){
          if(user.chat.length){user.chat.push(data.message) };
          if(!user.chatNotice){ this.chatNotice(true, user) }
        }
      }
    }else if(data.mission == 'typing'){
      if(this.chatWith['_id'] == data.message.sender){
        this.typing = data.message.content;
      }
    }
  }
  
  chatNotice(notice, data){
    let userchatnotice = notice; let mission = 'chatNotice';
    data.chatNotice = userchatnotice;
    this.wsService.user({ _id: data._id, userchatnotice: userchatnotice, mission: mission });
  }
  
  chatTyping(content){
    let mission = 'typing';
    console.log(content.length);
    if(content.length == 0){ this.typeStatus(false)
    //}else if((content.length > 0) && (content.length < 2)){
    }else if(content.length > 0){ this.typeStatus(true) }
  }
  
  typeStatus(data){
    let mission = 'typing';
    const result = { content: data, sender: this.flowData['_id'], reciever: this.chatWith['_id']};
    this.wsService.chat({mission:mission, message:result});
  }

  chatData(data){
    let fileSelected = this.selectedFile;
    let dataChat = data.trim();
    const result = {
      category: 'chat',
      content: dataChat,
      sender: this.flowData['_id'],
      reciever: this.chatWith['_id']
    };
    let dataStringify = JSON.stringify(result);
    let formData: FormData = new FormData();
    if((fileSelected.status === Ng4FilesStatus.STATUS_SUCCESS)  || dataChat){
      if(fileSelected.file){
        formData.append('file', fileSelected.file , fileSelected.file.name);
        formData.append('data', dataStringify);
      }else{
        formData.append('data', dataStringify);
      };
      this.usersService.addChat(formData)
        .subscribe(chat => {
          if(chat.type === HttpEventType.Response){
            
            this.wsService.chat({mission:'message', message:chat['body']['chated']});
            this.chatWith['chat'].push(this.chatEdit(chat['body']['chated']));
            this.typeStatus(false);
            
          }else if(chat.type === HttpEventType.UploadProgress){
            this.uploadProg = Math.round(100 * chat.loaded/chat.total);
            this.progStyle = {'width': this.uploadProg+'%'};
          }
        })
    }else{
      this.typeStatus(false);
      console.log('chat not sent')};
    this.selectedFile = {};
  }
  

  
  chatEdit(data){
    if(data['type']=='picture'){data=this.methodShared.setPath(data, 'fileName', 'image')};
    if(data['type']!='text'){data['short_fileName']=this.methodShared.shortText(this.methodShared.shortFilename(data['fileName']), 18)}
    return data
  }

  
  downloadImage(data, category){
    this.sharedFunctions.downloadImage(data, category);
  }
  
  filesSelect(Data){
    this.selectedFile = this.fileFunction(Data);
    if(this.selectedFile.status === Ng4FilesStatus.STATUS_SUCCESS){
      this.fileProblem = '';
    }else{
      this.fileProblem = this.selectedFile.value;
    }
  }
  
  fileFunction(Files: Ng4FilesSelected): any[]{
    let msg, value;
    if(Files.status === Ng4FilesStatus.STATUS_SUCCESS){
      value = 'File successful';
      msg = {status: Ng4FilesStatus.STATUS_SUCCESS, value: value, file: Array.from(Files.files).map(file => file)[0]};
    }else if(Files.status === Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED){
      value = 'File is larger than 50MB';
      msg = {status: Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED, value: value, file: undefined };
    }else if(Files.status === Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS){
      value = 'File extention not match';
      msg = {status: Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS, value: value, file: undefined };
    }else{
      value = 'File problem';
      msg = {status: undefined, value: value, file: undefined };
    }
    return msg
  }
  
  jqueryFunction(){
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  ngOnDestroy(){
    //this.onDestroy.next(true);
  }
}