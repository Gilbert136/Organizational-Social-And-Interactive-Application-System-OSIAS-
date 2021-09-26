import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { DataService } from '../data.service';
import { HttpEventType } from '@angular/common/http';
import { SharedFunction } from '../shared/shared.function';
import { Configuration } from '../global.config';
import { WebSocketService } from '../webSocket.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  templateUrl: 'main-layout.component.html',
  styleUrls : ['main-layout.component.css']
})

export class MainLayoutComponent implements OnInit, OnDestroy{

  userData: any;
  userDataExit: number;
  methodShared:SharedFunction;
  onChat:Subscription;

  
  menu:any;

  constructor(private usersService: UsersService, private dataService: DataService, private router: Router,
    private route: ActivatedRoute, private wsService:WebSocketService){
    
    this.methodShared = new SharedFunction();
    this.userData = {};

    this.menu = {post: {checked:false, notice:false}, chat: {checked:true, notice:false}, doc: {checked:true, notice:false}};
  }
    
  logout(){
    let mission = "status";
    this.userData.userstatus = 'offline';
    this.wsService.user({_id:this.userData._id, userstatus:this.userData.userstatus, mission:mission});
    this.methodShared.removeLocalStorage();
    this.router.navigate(['/pages/login']);
  }
  
  clickMenu(data){
    Object.keys(this.menu)
      .forEach((result)=>{
        if(data == result){
          this.menu[result].checked = false;
          this.menu[result].notice = false;
        }else{ this.menu[result].checked = true;}
      })
  }
  
  ngOnInit(){
    
    this.route.data
      .subscribe((user) => {
        if(user['user']['user'] !== null){
          this.dataService.setUserData(this.methodShared.setPath(user['user']['user'], 'picture', 'image'));
          this.userData = this.dataService.getUserData();
          
          let mission = "status";
          this.userData.userstatus = 'online';
          // this.menu.chat.notice = this.userData.chatNotice;
          this.wsService.room(this.userData.tags);
          this.wsService.user({_id:this.userData._id, userstatus:this.userData.userstatus, mission:mission});
          
          this.userDataExit = Object.keys(this.userData).length;
          this.router.navigate(['/', this.userData['username'], 'posts']);
        }else{
          this.userDataExit = Object.keys(this.userData).length;
          this.router.navigate(['/pages/login']);
        }
      });
      
      
    this.onChat = this.wsService.onChat()
      .subscribe((data)=>{
        if(this.menu.chat.checked){
          if(data['mission'] == 'message'){
            this.chatNotice(true, data)
          }
        }
    });
  }
  
  chatNotice(notice, data){
    let mission = 'chatNotice';
    this.menu.chat.notice = notice;
    this.wsService.user({ _id: data.message.sender, userchatnotice: notice, mission: mission });
    // this.wsService.user({ _id: data.message.reciever, userchatnotice: notice, mission: mission });
  }
  
  
  ngOnDestroy(){
    this.onChat.unsubscribe();
  }
}