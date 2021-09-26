import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';
import { DataService } from '../data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from '../shared/ng4-files';
import { saveAs as importedSaverAs } from 'file-saver';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';
import { HttpEventType} from '@angular/common/http';
import { PostConstruct, Response } from './posts.config';
import { SharedFunction } from '../shared/shared.function';
import { Configuration } from '../global.config';
import { WebSocketService } from '../webSocket.service';




@Component({
  templateUrl: 'posts.component.html',
})

export class PostsComponent implements OnInit, OnDestroy{
  
  content: string;
  tag: string;
  color: string;
  download: string;
  owner: string;
  department: string;
  displayTag: string;
  tags:string[];
  
  userData: any;
  errors: string[];
  allLikedDisliked : string[];

  method:PostConstruct;
  methodShared: SharedFunction;
  sharedConfig: Ng4FilesConfig;
  selectedFile: any;
  response: Response;
  fileName: string;
  server:string;
  imageSize:string;
  postData: any[];
  switchTag:boolean;
  typingData:string[];

  timerSubscription:Subscription;

  constructor(private usersService: UsersService, private dataService: DataService, private router: Router,
    private ng4FilesService: Ng4FilesService, private wsService:WebSocketService){
    let config = new Configuration();
    this.server = config.server;
    this.method = new PostConstruct();
    this.methodShared = new SharedFunction();
    this.sharedConfig = this.method.defaultFilespec;
    this.imageSize = this.methodShared.sizeConvent(this.method.defaultFilespec.maxFileSize.toString());
    this.selectedFile = this.method.defaultFileStatus;
    this.tags = this.method.defaultTags;
    this.displayTag = this.method.defaultTag;
    this.tag = this.method.defaultTag;
    this.color = this.method.defaultChange;
    this.response = {errors:[]};
    this.switchTag = false;
    this.typingData = [];
    this.userData = {};
    
    this.wsService.onMessage().subscribe(data=>{this.message(data)});
    this.wsService.onTyping().subscribe(data=>{this.displayTyping(data)});
  }
  
  displayTyping(data){
    if(data.mission == 'on'){
      this.typingData = [this.methodShared.setPath(data, 'ownerPic', 'ownerImage', 'user')];
    }else if(data.mission == 'off'){
      this.typingData = [];
    }
  }
  
  typing(status){
    const data = {
      mission: status,
      tag: this.tag,
      owner: this.userData['username'],
      ownerPic : this.userData['picture']
    }
    this.wsService.typing(data);
  }
  
  change(color){
    this.color = this.method.color(color);
  }
  
  mytag(tag){
    this.displayTag = tag;
    this.tag = this.tagToName(tag);
  }
  
  switchSelect(event, tag){
    let checked = event.target.checked; let name = this.tagToName(tag);
    if(checked){ if(!this.tags.includes(name)){ this.tags.push(name)}
    }else{ if(this.tags.includes(name)){ this.tags.splice(this.tags.indexOf(name), 1)}};
    this.wsService.room(this.tags);

    let mission = 'initial';
    const initValues = {
      mission : mission,
      tags : this.tags
    };
    this.usersService.getPost(initValues)
      .subscribe(info =>{
        this.postData = [];
        if(info['posted'].length > 0){
          for(let x = 0; x < info['posted'].length; x++){ info['posted'][x] = this.postEdit(info['posted'][x])};
          this.postData = info['posted']; this.switchTag = false;
        }else{this.switchTag = true;};
    })
  }
      
  post(){
    let category = 'post';
    const data = {
      category: category,
      content: this.content,
      tag: this.tag,
      color: this.color,
      owner: this.userData['username'],
      department: this.userData['department'],
      ownerPic : this.userData['picture']}

    if(this.content){
      let dataStringify = JSON.stringify(data);
      let formData:FormData = new FormData();
      formData.append('data', dataStringify);
      let file = this.selectedFile.file;
      if(file){ formData.append('file', file , file.name); };
      this.response = {errors:null};
      
      
      this.usersService.addPost(formData)
        .filter(info => { return (info.type === HttpEventType.Response || info.type === HttpEventType.UploadProgress)})
        .subscribe(info=>{
          if(info.type === HttpEventType.Response){ let body = info.body;
            if(body['errors']){ this.response = {errors:body['errors']};
            }else if(body['posted']){
              this.wsService.post(body['posted']);
              this.typing('off');
              this.content = ""; this.fileName = ""; this.selectedFile = {status: undefined, value: undefined, file: undefined};
              if(!this.switchTag){
                if(this.tags.indexOf(body['posted']['tag'])>-1){this.postData.unshift(this.postEdit(body['posted']));}}}
          }else if(info.type === HttpEventType.UploadProgress){
            const percentDone = Math.round(100 * info.loaded/info.total);
            this.fileName = percentDone.toString() + '% Uploaded';}
        })
    }else{ this.response = {errors:[{'msg':'Add Content'}]} }
  }
  
  previous(){
    let mission = 'previous';
    const previous = {
      mission : mission,
      tags : this.tags,
      postDate : this.postData[this.postData.length - 1]['date_created'],
    };
    
    this.usersService.previousPost(previous)
      .subscribe(post => {
        if(post['posted'].length > 0){
          for(let x = 0; x < post['posted'].length; x++){ this.postData.push(this.postEdit(post['posted'][x]))}}
      })
  }
  
  dateUpdate(){
    this.timerSubscription = timer(10000,10000).subscribe(()=>{
      this.postData=this.postData.map((data)=>{data=this.method.timeToword(data); return data});
    });
  }
  
  message(data){
    data = this.postEdit(data);
    this.postData.unshift(data);
  }
  
  tagToName(data){
    let name;
    if(data == 'Private'){ name = this.userData['username']}
    else if(data == 'Department'){ name = this.userData['department']}
    else{ name = data}
    return name;
  }
  
  postEdit(data){
    if(data['type']=='picture'){data=this.methodShared.setPath(data, 'fileName', 'image')};
    if(data['type']!='text'){data['short_fileName'] = this.methodShared.shortText(this.shortFilename(data['fileName']), 20)}
    data = this.method.timeToword(data);
    data = this.methodShared.setPath(data, 'ownerPic', 'ownerImage', 'user');
    return data
  }
  
  downloadFile(category, filename){
    this.usersService.getFile(this.methodShared.getPath(category, filename))
      .subscribe(blob =>{
        importedSaverAs(blob, filename);
      })
  }
  
  shortFilename(data){
    let tempNameArray = data.split('_');
    return tempNameArray[tempNameArray.length-1];
  }
  
  filesSelect(data){
    this.selectedFile = this.methodShared.fileFunction(data, this.imageSize);
    if(this.selectedFile.status === Ng4FilesStatus.STATUS_SUCCESS){
      this.response = {errors:null};
      this.fileName = this.methodShared.shortText(this.selectedFile.file.name, 15);
    }else{
      this.fileName = '';
      this.response = {errors:[{'msg':this.selectedFile.value}]};
    }
  }
  
  ngOnInit(){
    this.userData = this.dataService.getUserData();
    if(this.userData){
      this.tags = this.userData['tags'];
      
      // this.wsService.room(this.tags);
      
      let mission = 'initial';
      const initValues = {
        mission : mission,
        tags : this.tags
      };
      this.usersService.getPost(initValues)
        .subscribe(info =>{
          for(let x = 0; x < info['posted'].length; x++){ info['posted'][x] = this.postEdit(info['posted'][x]);};
          this.postData = info['posted'];
          console.log(this.postData);
          this.dateUpdate();
      });
      this.ng4FilesService.addConfig(this.sharedConfig);
    }
  }
  
  ngOnDestroy(){
    this.timerSubscription.unsubscribe();
  }
  
  option(value, postid, file?){
    let method = 'post';
    const data = {
      method : method,
      value : value,
      postId : postid,
      person : this.userData['username']
    };
    this.usersService.refreshLikeDislike(data)
      .subscribe(info =>{ if(value == '2'){ this.downloadFile('post', file); } })
  }
}