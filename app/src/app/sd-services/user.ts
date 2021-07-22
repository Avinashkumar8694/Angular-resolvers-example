/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
//CORE_REFERENCE_IMPORTS
//append_imports_start
import { Injectable, Injector } from '@angular/core'; //_splitter_
import {
  Router,
  NavigationEnd,
  NavigationStart,
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router'; //_splitter_
import { MatSnackBar } from '@angular/material/snack-bar'; //_splitter_
import { SDBaseService } from 'app/n-services/SDBaseService'; //_splitter_
//append_imports_end
declare const window: any;
declare const cordova: any;
@Injectable({
  providedIn: 'root',
})
export class user {
  constructor(
    private sdService: SDBaseService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private __service_injector__: Injector
  ) {
    this.registerListeners();
  }
  private registerListeners() {
    let bh = this.sdService.__constructDefault({});
    //append_listeners
  }
  //   service flows_user
  async getUsersList(...others) {
    try {
      var bh: any = {
        input: {},
        local: {
          usersList: undefined,
        },
      };
      bh = this.sdService.__constructDefault(bh);
      bh = await this.sd_WBvAzkzfOKnqXisQ(bh);
      //appendnew_next_getUsersList
      return (
        // formatting output variables
        {
          input: {},
          local: {
            usersList: bh.local.usersList,
          },
        }
      );
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_n53X5msfHh6s1j1e');
    }
  }
  async getUserById(email: any = undefined, ...others) {
    try {
      var bh: any = {
        input: {
          email: email,
        },
        local: {
          userDetails: undefined,
        },
      };
      bh = this.sdService.__constructDefault(bh);
      bh = await this.sd_hCSvC170rkezTeB3(bh);
      //appendnew_next_getUserById
      return (
        // formatting output variables
        {
          input: {},
          local: {
            userDetails: bh.local.userDetails,
          },
        }
      );
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_QIrVR7QcoCgq1J1I');
    }
  }
  //appendnew_flow_user_start
  private async sd_WBvAzkzfOKnqXisQ(bh) {
    try {
      let requestOptions = {
        url: 'http://localhost:8081/api/getUsersList',
        method: 'get',
        responseType: 'json',
        headers: {},
        params: {},
        body: undefined,
      };
      bh.local.usersList = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_WBvAzkzfOKnqXisQ
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_WBvAzkzfOKnqXisQ');
    }
  }
  private async sd_hCSvC170rkezTeB3(bh) {
    try {
      bh.url = `http://localhost:8081/api/getUsersById?email=${bh.input.email}`;
      bh = await this.sd_mj8z1q2Swe4tiwon(bh);
      //appendnew_next_sd_hCSvC170rkezTeB3
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_hCSvC170rkezTeB3');
    }
  }
  private async sd_mj8z1q2Swe4tiwon(bh) {
    try {
      let requestOptions = {
        url: bh.url,
        method: 'get',
        responseType: 'json',
        headers: {},
        params: undefined,
        body: undefined,
      };
      bh.local.userDetails = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_mj8z1q2Swe4tiwon
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_mj8z1q2Swe4tiwon');
    }
  }
  //appendnew_node
  private async errorHandler(bh, e, src) {
    console.error(e);
    bh.error = e;
    bh.errorSource = src;
    if (
      false
      /*appendnew_next_Catch*/
    ) {
      return bh;
    } else {
      throw e;
    }
  }
}
