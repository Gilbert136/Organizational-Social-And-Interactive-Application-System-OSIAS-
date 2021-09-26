import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Data} from '@angular/router';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { SharedFunction } from '../shared/shared.function';

@Injectable()
export class AuthGuard implements CanActivateChild {
  
  userToken: any;
  methodShared:SharedFunction;

  constructor(private usersService: UsersService, private router: Router){
    this.methodShared = new SharedFunction();
    this.userToken = this.methodShared.getLocalStorage();
  }
  
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(this.userToken){
      this.usersService.tokentoUsername()
        .subscribe((data: Data) => {
          if(data.result.auth){
            this.router.navigate(['/', data.result.username]);
          }else{ return true }
        })
    }else{ return true }
  }
}