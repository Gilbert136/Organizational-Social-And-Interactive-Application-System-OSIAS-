import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { UsersService } from '../users.service';

@Injectable()
export class UserResolver implements Resolve<any> {

  constructor(private userservice : UsersService){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.userservice.getUser({username: route.params['name']});
  }
}