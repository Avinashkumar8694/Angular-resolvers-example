/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { user } from 'app/sd-services/user'

@Injectable()
export class userService implements Resolve<any> {
    constructor( public _user: user) {

    }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): any { 
        const email = route.params['email'];
        return this._user.getUserById(email).then(res=>{
            console.log(res)
            return res.local.userDetails;
         })

    }
}
