import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';
import { HttpEventType} from '@angular/common/http';
import { RegisterConstruct, PrintErrors, NewUser } from './register.config';
import { SharedFunction } from '../shared/shared.function';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesStatus, Ng4FilesSelected } from '../shared/ng4-files';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';

@Component({
  templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  user:NewUser;
  created: string;
  exist: string;
  imageSize: string;
  departmentList: string[];
  selectedFile: any;
  methodShared: SharedFunction;
  sharedConfig: Ng4FilesConfig;
  resPrint:PrintErrors;
  imageName:string;
  defaultDept:string;
  userSubscription:Subscription;
  onDestroy:Subject<boolean>;
  
  constructor(private userservice : UsersService, private ng4FilesService: Ng4FilesService) {
    let dataClass = new RegisterConstruct();
    this.methodShared = new SharedFunction();
    this.resPrint = new PrintErrors();
    this.onDestroy = new Subject<boolean>();
    this.departmentList = dataClass.departments;
    this.defaultDept = dataClass.defaultDepartment;
    this.imageSize = this.methodShared.sizeConvent(dataClass.defaultFilesize.toString());
    this.sharedConfig = dataClass.defaultFilespec;
    this.imageName = '';
    this.resPrint = {errors:[], created:'', exist:''};
    this.selectedFile = {status: undefined, value: undefined, file: undefined};
    this.user = {username: '', email: '', firstname: '', lastname: '', contact: '', department: this.defaultDept, password: '', password2: ''};
  };

  filesSelect(Data){
    this.selectedFile = this.methodShared.fileFunction(Data, this.imageSize);
    if(this.selectedFile.status === Ng4FilesStatus.STATUS_SUCCESS){
      this.resPrint.exist = '';
      this.imageName = this.methodShared.shortText(this.selectedFile.file.name, 15);
    }else{
      this.imageName = 'Choosing...';
      this.resPrint.exist = this.selectedFile.value;
    }
  }
  
  adduser(){
	  let file = this.selectedFile.file;
	  if(file !== undefined){
	    const newUser:NewUser={
        username: this.user.username,
  	    email: this.user.email,
  	    firstname: this.user.firstname,
  	    lastname: this.user.lastname,
  	    contact: this.user.contact,
  	    department: this.user.department,
  	    password: this.user.password,
  	    password2: this.user.password2};
  	  let dataStringify = JSON.stringify(newUser);
	    let formData:FormData = new FormData();
	    formData.append('file', file , file.name);
	    formData.append('data', dataStringify);
	    this.userService(formData);
	  }else{
	    this.resPrint.errors = [];
	    this.resPrint.created = '';
	    this.resPrint.exist = 'Add picture';
	  }
  }
  
  userService(data){
    this.userSubscription = this.userservice.addUser(data)
      .takeUntil(this.onDestroy)
      .filter(user => { return user.type === HttpEventType.Response})
      .subscribe(user => {
        let body = user['body'];
        if(body['errors']){ this.resPrint = {errors:body['errors'], created:'', exist:''};
        }else if(body['exist']){ this.resPrint = {errors:[], created:'', exist:body['exist']};
        }else if(body['created']){ this.initForm(); this.resPrint = {errors:[], created:body['created'], exist:''};}
      }, error => {console.log(error)})
  }
  
  initForm(){
    this.imageName = '';
    this.selectedFile = {status: undefined, value: undefined, file: undefined};
    this.user = {username: '', email: '', firstname: '', lastname: '', contact: '', department: this.defaultDept, password: '', password2: ''};
  }
  
  ngOnInit(){
    this.ng4FilesService.addConfig(this.sharedConfig);
  }
  
  ngOnDestroy(){
    this.onDestroy.next(true);
  }
}
