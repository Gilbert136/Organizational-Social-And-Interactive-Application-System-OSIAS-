import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Configuration } from './global.config';

@Injectable()
export class WebSocketService{
  
  private socket;
  
  constructor() {
    this.socket = io(new Configuration().server);
    
    this.socket.on('filter', function(data){
      console.log(data);
    });
  }
  
  onMessage(){
    let observable = new Observable(observer=>{this.socket.on('message', (data)=>{observer.next(data)}); return ()=>{this.socket.disconnect()}})
    return observable;
  }
  
  onTyping(){
    let observable = new Observable(observer=>{this.socket.on('typing', (data)=>{ observer.next(data)}); return ()=>{this.socket.disconnect()}})
    return observable;
  }
  
  onUser(){
    let observable = new Observable(observer=>{this.socket.on('user', (data)=>{ observer.next(data)}); return ()=>{this.socket.disconnect()}});
    return observable;
  }
  
  onChat(){
    // let observable = new Observable(observer=>{this.socket.on('chat', (data)=>{ observer.next(data)}); return ()=>{this.socket.disconnect()}});
    let observable = new Observable(observer=>{this.socket.on('chat', (data)=>{ observer.next(data)})});
    return observable;
  }
  
  typing(data){ this.socket.emit('typing', data) }
  
  post(data){ this.socket.emit('post', data) }
  
  room(data){ this.socket.emit('room', data) }
  
  user(data){ this.socket.emit('user', data)}
  
  chat(data){ this.socket.emit('chat', data)}
  
}