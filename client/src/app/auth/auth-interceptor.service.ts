import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SharedFunction } from '../shared/shared.function';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  methodShared:SharedFunction;
  
  constructor(){
    this.methodShared = new SharedFunction();
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.methodShared.getLocalStorage()){
      let authHeader = this.methodShared.getLocalStorage();
      const authReq = req.clone({setHeaders: {authorization: authHeader}})
      return next.handle(authReq)
    }else{
      return next.handle(req);
    }
    
  }
}
