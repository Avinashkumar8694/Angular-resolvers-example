/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { userService } from 'app/services/user/user.service';
import { user } from 'app/sd-services/user'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class _userslistService implements Resolve<any> {

constructor( public router: Router,public _userService:userService, public _user: user) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): any {       
         return this._user.getUsersList().then(res=>{
            return res.local.usersList;
         })
    }

}
