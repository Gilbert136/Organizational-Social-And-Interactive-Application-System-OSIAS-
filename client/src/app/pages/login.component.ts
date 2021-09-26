import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { LogUser } from './login.config';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { HttpEventType} from '@angular/common/http';
import { SharedFunction } from '../shared/shared.function';
import 'rxjs/add/operator/takeUntil';
import { WebSocketService } from '../webSocket.service';


@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy{

  user:LogUser;
  error:string;
  methodShared:SharedFunction;
  userSubscription:Subscription;
  onDestroy:Subject<boolean>;

  constructor(private userservice : UsersService, private router : Router, private wsService:WebSocketService ) {
    this.methodShared = new SharedFunction();
    this.onDestroy = new Subject<boolean>();
    this.user = {username: '', password: ''};
  }
  
  authuser(){
    const logUser:LogUser = {
      username : this.user.username,
      password : this.user.password};
    let dataStringify = JSON.stringify(logUser);
    let formData:FormData = new FormData();
    formData.append('data', dataStringify);
    this.userSubscription = this.userservice.login(formData)
      .takeUntil(this.onDestroy)
      .filter(user => { return user.type === HttpEventType.Response})
      .subscribe(info => {
        let body = info['body'];
        if(body['success']){
          this.methodShared.setLocalStorage(body['success']['token']);
          this.router.navigate(['/', body['success']['username']]);
        }else if(body['message']){
          this.error = body['message'];
        }
      }, error => {console.log(error)})
  }
  
  ngOnInit(){}
  
  ngOnDestroy(){
    this.onDestroy.next(true);
  }

}



