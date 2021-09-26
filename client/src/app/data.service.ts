import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  userData:any;
  
  setUserData(data){
    this.userData = data;
  }
  
  getUserData(){
    return this.userData;
  }
}