import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { UsersService } from '../users.service';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from '../shared/ng4-files';
import { DocumentConstruct, FileProfile, Document } from './documents.config';
import { SharedFunction } from '../shared/shared.function';
import { WebSocketService } from '../webSocket.service';
import { DataService } from '../data.service';


@Component({
  templateUrl: 'documents.component.html',
  styleUrls : ['documents.component.css']
})

export class DocumentsComponent implements OnInit, OnDestroy{
  sharedConfig: Ng4FilesConfig;

  userData: any[];
  docs: Document;
  filePro: FileProfile;

  tags: string[];
  method:DocumentConstruct;
  displayTag: string;
  methodShared: SharedFunction;
  imageSize: string;
  

  constructor(private usersService: UsersService, private dataService: DataService, private router: Router,
              private ng4FilesService: Ng4FilesService, private wsService:WebSocketService){
    
    this.method = new DocumentConstruct();
    this.methodShared = new SharedFunction();

    this.sharedConfig  = this.method.defaultFilespec;
    this.imageSize = this.methodShared.sizeConvent(this.method.defaultFilespec.maxFileSize.toString());
    this.tags = this.method.defaultTags;
    this.displayTag = this.method.defaultTag;
    this.filePro = { selectedFile:{}, progStyle:{}, fileProblem:'', short_fileName:'', uploadPro:'', tag:'Public'};
    this.docs = { picture:[], video:[], date:{post:{picture:'', video:''}, chat:{picture:'', video:''}, doc:{picture:'', video:''}} };
    
    this.wsService.onMessage().subscribe(data=>{this.addRecentMedia(data)});
  }
  
  
  getDocs(a, b, c){
    let Docs = [];
      this.usersService.getPost(a)
        .subscribe(info =>{
          Docs.push(info['posted']);
          this.usersService.getChat(b)
            .subscribe(info =>{
              Docs.push(info['chated']);
              this.usersService.getDoc(c)
                 .subscribe(info =>{
                    Docs.push(info['doc']);
                    console.log(Docs);
                    this.addMedia(Docs);
               })
          })
      })
  }
  
  tagSelect(tag){
    this.displayTag = tag;
    this.filePro['tag'] = this.method.tagToName(tag, this.userData);
  }
  
  ngOnInit(){
    this.userData = this.dataService.getUserData();
    if(this.userData){
      this.tags = this.userData['tags'];
      let mission = 'docs';
      
      const postDocs = {
        mission : mission,
        tags : this.tags
      }
      const chatDocs = {
        mission : mission,
        owner : this.userData['_id'],
      }
      const Docs = {
        mission : 'initial',
        tags : this.tags,
        owner : this.userData['username'],
      };
      this.getDocs(postDocs, chatDocs, Docs);
      this.ng4FilesService.addConfig(this.sharedConfig);
    }
  }
  
  prevDoc(type){
    let mission = 'prevDocs';
    
    const postDocs = {
      mission : mission,
      tags : this.tags,
      postDate: this.docs['date']['post'][type],
      type: type
    }
    const chatDocs = {
      mission : mission,
      owner : this.userData['_id'],
      chatDate: this.docs['date']['chat'][type],
      type: type
    }
    const Docs = {
      mission : 'previous',
      tags : this.tags,
      docDate : this.docs['date']['doc'][type],
      owner : this.userData['username'],
      type: type
    };
    this.getDocs(postDocs, chatDocs, Docs);
  }
  
  dataEdit(data){
    data['short_fileName']=this.methodShared.shortText(this.methodShared.shortFilename(data['fileName']), 20);
    if(data['type']=='picture'){data=this.methodShared.setPath(data, 'fileName', 'image')};
    return data;
  }
  
  addRecentMedia(data){
    if(data['type'] != 'text'){
      this.docs[data['type']].unshift(data);
    }
  }
  
  addMedia(data){let compDocs = [];
    for(let x=0; x < data.length; x++){for(let y=0; y < data[x].length; y++){compDocs.push(this.dataEdit(data[x][y]))}}
    this.sortDocs(compDocs);
  }
  
  //i have to do that of the documents, audio, file and others
  sortDocs(data){
    data.sort(function(a, b){return new Date(b['date_created']).getTime() - new Date(a['date_created']).getTime()});
    for(let x = 0; x < data.length; x++){
      //PICTURE
      if(data[x]['type'] == 'picture'){
        this.docs['date'][data[x]['category']][data[x]['type']] = data[x]['date_created'];
        this.docs[data[x]['type']].push(data[x]);
      }
      //VIDEO
      else if(data[x]['type'] == 'video'){
        this.docs['date'][data[x]['category']][data[x]['type']] = data[x]['date_created'];
        this.docs[data[x]['type']].push(data[x]);
      }
    }
  }
  
  DocSent(){
    let fileSelected = this.filePro['selectedFile'];
    const data = {
      category: 'doc',
      tag: this.filePro['tag'],
      owner: this.userData['username'],
      department: this.userData['department'],
    };
    
    if(fileSelected.file){
      let dataStringify = JSON.stringify(data);
      let formData: FormData = new FormData();
      if(fileSelected.status === Ng4FilesStatus.STATUS_SUCCESS){
        formData.append('file', fileSelected.file , fileSelected.file.name);
        formData.append('data', dataStringify);
        
        this.usersService.addDoc(formData)
          .filter(doc => { return (doc.type === HttpEventType.Response || doc.type === HttpEventType.UploadProgress)})
          .subscribe(doc => {
            if(doc.type === HttpEventType.Response){ let body = doc.body;
              if(body['errors']){ /*this.filePro['fileProblem'] = {errors:body['errors']}*/}
              if(body['doc']){
                this.filePro['short_fileName']=''; this.filePro['selectedFile']={status: undefined, value: undefined, file: undefined};
                this.docs[body['doc'].type].unshift(this.dataEdit(body['doc']));
              }
            }else if(doc.type === HttpEventType.UploadProgress){
              let uploadProg = Math.round(100 * doc.loaded/doc.total);
              this.filePro['progStyle'] = {'width': uploadProg +'%'};
            }
        })
      }
    }else{ this.filePro['fileProblem'] = 'Add File'};
  }
  
  filesSelect(Data){
    this.filePro['selectedFile'] = this.methodShared.fileFunction(Data, this.imageSize);
    if(this.filePro['selectedFile'].status === Ng4FilesStatus.STATUS_SUCCESS){
      this.filePro['short_fileName'] = this.methodShared.shortText(this.filePro['selectedFile'].file.name, 15);
      this.filePro['fileProblem'] = '';
    }else{
      console.log(this.filePro);
     this.filePro['fileProblem'] = this.filePro['selectedFile'].value;
     this.filePro['short_fileName'] = '';
    }
  }
  
  ngOnDestroy(){
  }
  
}