import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../../users.service';
import { HttpEventType } from '@angular/common/http';
import { sharedFunctions } from '../../shared/sharedFunctions';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from '../../shared/ng4-files';
import { SharedFunction } from '../../shared/shared.function';
import { ChatConstruct } from './chats.config';
import { WebSocketService } from '../../webSocket.service';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs/Subscription';
 
declare var jquery:any;
declare var $:any;

@Component({
  selector : 'chats-component',
  templateUrl : 'chats.component.html',
  styleUrls : ['chats.component.css']
})

export class ChatsComponent implements OnInit, AfterViewChecked, OnDestroy{
  @ViewChild('chatBox') private chatBox:ElementRef;
  
  userData: any;
  sharedConfig: Ng4FilesConfig;
  chatInputs: boolean;
  uploadProg: number;
  progStyle: any;
  response: string;
  
  
  selectedFile: any;
  usersList: any[];
  chatWith: any;

  usersWidth:any;
  typing:boolean;

  methodShared: SharedFunction;
  method:ChatConstruct;
  
  onChat:Subscription;
  chatContent:string;
  typeCheck:boolean;
  chatAfterViewCheck:boolean;
  newMessage:boolean;
  imageSize:string;
  loading:boolean;


  constructor(private usersService: UsersService, private sharedFunctions: sharedFunctions, private dataService: DataService, private ng4FilesService: Ng4FilesService, private wsService:WebSocketService ){

    this.usersList = [];
    this.chatInputs = true;
    this.uploadProg = 0;
    this.progStyle = {};
    this.response = '';

    this.method = new ChatConstruct();
    this.methodShared = new SharedFunction();
    
    this.sharedConfig = this.method.defaultFilespec;
    this.imageSize = this.methodShared.sizeConvent(this.method.defaultFilespec.maxFileSize.toString());
    this.selectedFile = this.method.defaultFileStatus;
    
    this.chatWith = {};
    this.typing = false;
    this.chatContent = '';
    this.typeCheck = true;
    this.chatAfterViewCheck = true;
    this.newMessage = false;
    this.loading = false;
    
  }

  ngOnInit(){
    this.onChat = this.wsService.onChat().subscribe(data=>{ this.message(data) });
    this.wsService.onUser().subscribe(data=>{ this.updateUsersList(data) });
    
    
    this.userData = this.dataService.getUserData();
    let ids = [ this.userData['_id'] ];
    const credValue = { ids: ids };
    //gets all the users except the one who requested for data
    this.usersService.getAllUsers(credValue)
      .subscribe(info =>{
        this.usersList = info['users'];
        this.usersWidth = {width: (this.usersList.length*40)+'px'};
        for(let x = 0; x < this.usersList.length; x++){
          this.sharedFunctions.showImage(this.usersList[x], 'users', 'image', 'profilePictures');
          this.usersList[x].chat = [];
        }
      });
    this.ng4FilesService.addConfig(this.sharedConfig);
    this.jqueryFunction();
  }
  
    
  message(data){
    if(data.mission == 'message'){
      if(this.chatWith._id == data.message.sender){
        this.typing = false;
        this.chatWith['chat'].push(this.chatEdit(data.message));
        if(!this.chatAfterViewCheck){
          this.newMessage = true;
        }
      }else{
        let user=this.usersList.find((user)=>{ return user._id === data.message.sender});
        if(user){
          if(user.chat.length){user.chat.push(this.chatEdit(data.message)) };
          if(!user.chatNotice){ this.chatNotice(true, user) }
        }
      }
    }
    
    else if(data.mission == 'typing'){
      if(this.chatWith['_id'] == data.message.sender){
        this.typing = data.message.content }
    }
    
    else if(data.mission == 'chatDelete'){
      if(this.chatWith['_id'] == data.message.sender){
        if(data.message.content.visibility == 'delete'){
          let chat=this.chatWith['chat'].find((chat)=>{ return chat._id === data.message.content._id});
          chat.visibility = data.message.content.visibility;
        }
      }
      else{
        let user=this.usersList.find((user)=>{ return user._id === data.message.sender});
        if(user){
          if(user.chat.length){
            if(data.message.content.visibility == 'delete'){
              let chat=user.chat.find((chat)=>{ return chat._id === data.message.content._id});
              chat.visibility = data.message.content.visibility;
            }
          };
        }
      }
    }
  }
  
  updateUsersList(data){
    let user = this.usersList.find((user)=>{ return user._id === data._id});
    if(user){ user.userstatus = data.userstatus}
  }

  previous(){
    this.previousChat();
  }
  
  bottom(){
    this.scrollToContentButtom()
  }
  
  //getting the previous or past chat that are not displayed
  previousChat(){
    if(this.chatWith['chat'].length){
      this.loading = true;
      let mission = 'previous';
      let visibility = 'show';
      const previous = {
        mission : mission,
        sender : this.userData['_id'],
        reciever : this.chatWith['_id'],
        chatDate : this.chatWith['chat'][0].date_created,
        visibility : visibility
      };
      this.usersService.previousChat(previous)
        .subscribe(chat => {
          let prevChat = chat['chated'];
          if(prevChat.length > 0){
            this.loading = false;
            for(let x = 0; x < prevChat.length; x++){
              prevChat[x] = this.chatEdit(prevChat[x]);
              this.chatWith['chat'].unshift(prevChat[x]);
            };
          }
        })
    }
  }
  
  //getting the initial chat
  startChat(data){
    this.chatWith._id = data._id;
    this.chatWith.username = data.username;
    this.chatWith.image = data.image;
    this.chatWith.userstatus = data.userstatus;
    this.chatWith.chat = [];
    
    if(data.chat.length){
      console.log('already threr');
      this.chatWith['chat'] = data.chat;
    }else{
      let mission = 'initial';
      let visibility = 'show';
      const initial = {
        mission : mission,
        sender : this.userData['_id'],
        reciever : this.chatWith['_id'],
        visibility : visibility
      };
      this.usersService.getChat(initial)
        .subscribe(chat => {
          data.chat = chat['chated'].reverse();
          for(let x = 0; x < data.chat.length; x++){data.chat[x] = this.chatEdit(data.chat[x]);};
          this.chatWith['chat'] = data.chat;
      });
      this.chatInputs = false;
    };
    if(data.chatNotice){ this.chatNotice(false, data) }
  }
  
  userStatus(event){
    let status = event.target.checked;
    let mission = "status";
    if(status){ this.userData.userstatus="online" }else{ this.userData.userstatus="offline" };
    this.wsService.user({_id:this.userData._id, userstatus:this.userData.userstatus, mission:mission});
    console.log(this.userData.userstatus)
  }
  
  chatNotice(notice, data){
    let mission = 'chatNotice';
    data.chatNotice = notice;
    this.wsService.user({ _id: data._id, userchatnotice: notice, mission: mission });
  }
  
  chatTyping(event){
    if(event.keyCode === 13){
      this.chatData();
    }else{
      let mission = 'typing';
      if(this.chatContent.length == 0){ this.typeStatus(false); this.typeCheck = true;
      }else if(this.chatContent.length > 0){
        if(this.typeCheck){
          this.typeStatus(true);
          this.typeCheck = false;
        }
      }
    }
  }
  
  typeStatus(data){
    let mission = 'typing';
    const result = { content: data, sender: this.userData['_id'], reciever: this.chatWith['_id']};
    this.wsService.chat({mission:mission, message:result});
  }

  chatData(){
    let fileSelected = this.selectedFile;
    let dataChat = this.chatContent.trim();
    let defaultVisibility = 'show';
    let result = {
      category: 'chat',
      content: dataChat,
      sender: this.userData['_id'],
      reciever: this.chatWith['_id'],
      visibility: defaultVisibility
    };
    let formData: FormData = new FormData();
    
    if((fileSelected.status === Ng4FilesStatus.STATUS_SUCCESS)  || dataChat){
      if(fileSelected.file){
        result['type'] = this.fileType(fileSelected.file.name);
        result['fileSize'] = this.fileSize(fileSelected.file.size);
        result['fileName'] = this.fileName(fileSelected.file.name);
        result['short_fileName'] = this.methodShared.shortFilename(result['fileName'])
        if(result['type'] == 'picture'){ this.showFile({data:result, file:fileSelected.file}) };
        formData.append('file', fileSelected.file , fileSelected.file.name);
      }else{ result['type'] = 'text' };
      let dataStringify = JSON.stringify(result);
      formData.append('data', dataStringify);

      this.chatWith['chat'].push(result);
      this.chatAfterViewCheck = true;

      this.usersService.addChat(formData)
        .subscribe(chat => {
          if(chat.type === HttpEventType.Response){
            this.typeCheck = true;
            
            result['date_created'] = chat['body']['chated']['date_created'];
            result['_id'] = chat['body']['chated']['_id'];
            result['short_date_created'] = this.methodShared.shortDate(result['date_created'])
            
            this.wsService.chat({mission:'message', message:chat['body']['chated']});
          }else if(chat.type === HttpEventType.UploadProgress){
            this.uploadProg = Math.round(100 * chat.loaded/chat.total);
            this.progStyle = {'width': this.uploadProg+'%'};
          }
        })
    }else{ this.typeStatus(false); console.log('chat not sent')};
    
    this.chatContent = '';
    this.response = '';
    this.selectedFile = this.method.defaultFileStatus;
  }
  
  showFile(result){
    let file = new FileReader();
    file.onload = (data)=>{ result.data['image'] = data['target']['result']; console.log(data)}
    file.readAsDataURL(result.file)
  }
  
  fileName(fileName){ var fileName;
    var origFile=fileName; origFile=origFile.replace(/-/g, ''); origFile=origFile.replace(/ /g, '-'); origFile=origFile.replace(/_/g, '-');
    fileName = origFile.toString();
    return fileName;
  }
  
  fileSize(size){ let fileSize;
    fileSize = this.methodShared.sizeConvent(size.toString());
    return fileSize;
  }
  
  fileType(fileName){ let fileType;
    if(fileName){ let nameSplit = fileName.split("."), ext = nameSplit[nameSplit.length - 1];
      if(ext == 'jpg' || ext == 'png'){ fileType = 'picture';
      }else if(ext == 'mp4'){ fileType = 'video';
      }else if(ext == 'mp3'){ fileType = 'audio';
      }else if(ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'ppt' || ext == 'txt' || ext == 'xls'){ fileType = 'document';
      }else{ fileType = 'file'; }
    }return fileType;
  }
  
  scrollToContentButtom(){
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    this.newMessage = false;
  }
  
  getAmountScroll(event){
    if(event.target.scrollTop === 0){
      this.previousChat();
    }
    
    if((Math.floor(event.target.scrollTop) === event.target.scrollHeight - event.target.clientHeight) ||
        (Math.floor(event.target.scrollTop) === event.target.scrollHeight - event.target.clientHeight- 1)){
      this.chatAfterViewCheck = true;
      this.newMessage = false;
    }else{
      this.chatAfterViewCheck = false;
    }
  }
  
  chatEdit(data){
    if(data['type']=='picture'){data=this.methodShared.setPath(data, 'fileName', 'image')};
    if(data['type']!='text'){data['short_fileName']=this.methodShared.shortFilename(data['fileName'])}
    data['short_date_created']=this.methodShared.normalCal(data);
    return data
  }
  
  chatOption(data){
    let chat=this.chatWith.chat.find((chat)=>{ return chat._id === data._id});
    if(chat){
      if(data.visibility == "delete"){
        let mission = 'chatDelete';
        chat.visibility = data.visibility;
        const result = { content: data, sender: this.userData['_id'], reciever: this.chatWith['_id']};
        this.wsService.chat({mission:mission, message:result});
      }
    }
  }

  downloadImage(data, category){
    this.sharedFunctions.downloadImage(data, category);
  }
  
  filesSelect(data){
    this.selectedFile = this.methodShared.fileFunction(data, this.imageSize);
    if(this.selectedFile.status === Ng4FilesStatus.STATUS_SUCCESS){
      this.response = this.selectedFile.file.name;
    }else{
      this.response = this.selectedFile.value;
    }
  }
  
  jqueryFunction(){
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  ngAfterViewChecked(){
    if(this.chatAfterViewCheck){this.scrollToContentButtom()}
  }
  
  ngOnDestroy(){
    this.onChat.unsubscribe();
  }
}