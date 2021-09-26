import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { sharedFunctions } from '../shared/sharedFunctions';



@Component({
  templateUrl : './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent {
  
  data: any[];
  
  constructor( private usersService : UsersService, private router : Router, private route : ActivatedRoute, public sharedFunctions: sharedFunctions){
    this.data = [];
    this.data['usersDetail'] = [];
    this.data['userSeached'] = [];
    this.data['userDocs'] = [];
    
    this.data['userDocs']['pictures'] = [];
    this.data['userDocs']['videos'] = [];
    this.data['userDocs']['audios'] = [];
    this.data['userDocs']['documents'] = [];
    this.data['userDocs']['files'] = [];
    
  };
  
  // not important any more
  // getUserFromHref(data){
  //   let hrefArray = data.split('/');
  //   let user = hrefArray[hrefArray.length -1];
  //   if(user){
  //     this.getUsers(user);
  //   }
  // }
  
  
  getUsers(searchUserInAllUsers){
    let ids = [];
    const credValue = {
      ids: ids
    };
    this.usersService.getAllUsers(credValue)
      .subscribe(info => {
        this.data['usersDetail'] = info['users'];
        for(let x = 0; x < this.data['usersDetail'].length; x++){
          this.sharedFunctions.showImage(this.data['usersDetail'][x], 'users', 'image', 'profilePictures');
          //console.log(this.data['userSeached']);
          if(searchUserInAllUsers == this.data['usersDetail'][x]['username']){
            this.data['userSeached'] = this.data['usersDetail'][x];
            this.getDocs(this.data['userSeached']['_id']);
            //i have to find means of getting raid of userSearched to not appear in usersDetail
            //this.data['usersDetail'].splice(x,1);
          }
        };
      })
  }
  
  getDocs(data){
    let mission = 'everyDocByUser';
    const credValue = {
      mission : mission,
      owner : data
    };
    this.usersService.getDoc(credValue)
       .subscribe(info =>{
          let Doc = info['doc'];
          
          this.data['userDocs']['pictures'] = [];
          this.data['userDocs']['videos'] = [];
          this.data['userDocs']['audios'] = [];
          this.data['userDocs']['documents'] = [];
          this.data['userDocs']['files'] = [];
          
          for(let x = 0; x < Doc.length; x++){
            if(Doc[x]['type'] == 'picture'){
              this.sharedFunctions.showImage(Doc[x], 'docs', 'image');
              this.data['userDocs']['pictures'].push(Doc[x]);
            }else if(Doc[x]['type'] == 'video'){
              this.data['userDocs']['videos'].push(Doc[x]);
            }else if(Doc[x]['type'] == 'audio'){
              this.data['userDocs']['audios'].push(Doc[x]);
            }else if(Doc[x]['type'] == 'document'){
              this.data['userDocs']['documents'].push(Doc[x]);
            }if(Doc[x]['type'] == 'file'){
              this.data['userDocs']['files'].push(Doc[x]);
            };
            this.sharedFunctions.shortenText(Doc[x], 18, 'shortFileName', 4);
          }
     })
  }

  userClick(data){
    this.router.navigate(['/internal/timeline', data['username']]);
  }
  
  subsParams(){
    this.route.params
      .subscribe(params=>{
        this.getUsers(params.name);
      })
  }
  
  ngOnInit(){
    this.subsParams();
    //let url = location.href;
    //this.getUserFromHref(url);
  };
}