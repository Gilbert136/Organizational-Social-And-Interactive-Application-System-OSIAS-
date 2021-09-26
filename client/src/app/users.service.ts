import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { HttpRequest, HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from './global.config';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  server:string;
  
  constructor(private http: Http , private httpClient: HttpClient) {
    this.server = new Configuration().server;
  }
  
  try(){
    return this.httpClient.get(this.server+"users/try", {params: {'you':'you'}});
  }
  
  tokentoUsername(){
    return this.httpClient.get(this.server+"users/IDtoUsername");
  }
  
  getUser(user){
    return this.httpClient.get(this.server+"users/getUser" , {params: user});
  }
  
  addUser(newUser){
    let req = new HttpRequest("POST", this.server+"users/register", newUser, {reportProgress : true});
    return this.httpClient.request(req);
  };

  login(userCheck){
    let req = new HttpRequest("POST", this.server+"users/login", userCheck, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  logout(userData){
    let req = new HttpRequest("POST", this.server+"users/logout", userData, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  addPost(newPost){
    let req = new HttpRequest("POST", this.server+"users/post", newPost, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  getPost(postNeeded){
    return this.httpClient.get(this.server+"users/post" , {params: postNeeded});
  }
  
  getDocument(documentNeeded){
    return this.httpClient.get(this.server+"users/document" , {params: documentNeeded});
  }
  
  refreshPost(postRefresh){
    return this.httpClient.get(this.server+"users/post" , {params: postRefresh});
  }
  
  previousPost(postPrevious){
    return this.httpClient.get(this.server+"users/post", {params: postPrevious});
  }
  
  refreshLikeDislike(LikeDislike){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.server+"users/post", LikeDislike, {headers:headers})
      .map(res => res.json());
  }
  
  getImage(imageName, folderName): Observable<Blob>{
    return this.http.get(this.server+ folderName + "/" + imageName, {responseType: ResponseContentType.Blob})
      .map(res => res.blob());
  }
  
  getFile(file): Observable<Blob>{
    return this.httpClient.get(this.server+file, {responseType: 'blob'});
  }
  
  getAllUsers(userCredential){
    return this.httpClient.get(this.server+"users/getUsers", {params : userCredential});
  }
  
  getUserbyName(userCredential){
    return this.httpClient.get(this.server+"users/getUserbyName", {params : userCredential});
  }
  
  addChat(newChat){
    let req = new HttpRequest("POST", this.server+"users/chat", newChat, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  getChat(chat){
    return this.httpClient.get(this.server+"users/chat", {params : chat});
  }
  
  
  
  updateChat(chat){
    let req = new HttpRequest("POST", this.server+"users/updateChat", chat, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  noticeChat(chat){
    return this.httpClient.get(this.server+"users/noticeChat", {params : chat});
  }
  
  
  
  
  previousChat(chatPrevious){
    return this.httpClient.get(this.server+"users/chat", {params : chatPrevious});
  }
  
  refreshChat(chatRefresh){
    return this.httpClient.get(this.server+"users/chat", {params : chatRefresh});
  }
  
  addDoc(newDoc){
    let req = new HttpRequest("POST", this.server+"users/document", newDoc, {reportProgress : true});
    return this.httpClient.request(req);
  }
  
  getDoc(doc){
    return this.httpClient.get(this.server+"users/document", {params : doc});
  }

}
