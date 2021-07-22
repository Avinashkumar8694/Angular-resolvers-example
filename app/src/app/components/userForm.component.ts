/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
//CORE_REFERENCE_IMPORTS
//append_imports_start
import {
  Component,
  Injector,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'; //_splitter_
import { SDBaseService } from 'app/n-services/SDBaseService'; //_splitter_
import { SDPageCommonService } from 'app/n-services/sd-page-common.service'; //_splitter_
import { __NEU_ServiceInvokerService__ } from 'app/n-services/service-caller.service'; //_splitter_
import { userService } from 'app/services/user/user.service'; //_splitter_
//append_imports_end
@Component({
  selector: 'bh-userForm',
  templateUrl: './userForm.template.html',
})
export class userFormComponent {
  page: any = { dep: {} };
  constructor(
    private __page_injector__: Injector,
    private sdService: SDBaseService,
    public __serviceInvoker__: __NEU_ServiceInvokerService__
  ) {
    this.__page_injector__.get(SDPageCommonService).addPageDefaults(this.page);
    this.registerListeners();
    //appendnew_element_inject
  }
  private registerListeners() {
    let bh = this.__page_injector__
      .get(SDPageCommonService)
      .constructFlowObject(this);
    //append_listeners
  }
  ngOnInit() {
    try {
      var bh: any = this.__page_injector__
        .get(SDPageCommonService)
        .constructFlowObject(this);
      bh = this.sd_111VEeLXkNZ5Kfl9(bh);
      //appendnew_next_ngOnInit
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_TNXnNYvQOPKCVeQs');
    }
  }
  add(...others) {
    try {
      var bh: any = this.__page_injector__
        .get(SDPageCommonService)
        .constructFlowObject(this);
      bh.input = {};
      bh.local = {};
      bh = this.sd_Dh1LGOvC5cEASgqT(bh);
      //appendnew_next_add
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_cyhbApcRd9DEK0rm');
    }
  }
  cancel(...others) {
    try {
      var bh: any = this.__page_injector__
        .get(SDPageCommonService)
        .constructFlowObject(this);
      bh.input = {};
      bh.local = {};
      bh = this.sd_Qp6Uf7BsFk3qJkVk(bh);
      //appendnew_next_cancel
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_au2DMPo2HzyxbyIm');
    }
  }
  //appendnew_flow_userFormComponent_start
  private sd_111VEeLXkNZ5Kfl9(bh) {
    try {
      this.page.userService = this.__page_injector__.get(userService);
      bh = this.sd_tjFATEJKdLDUZEOq(bh);
      //appendnew_next_sd_111VEeLXkNZ5Kfl9
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_111VEeLXkNZ5Kfl9');
    }
  }
  private sd_tjFATEJKdLDUZEOq(bh) {
    try {
      this.page.user = {
        name: '',
        organisation: '',
        email: '',
        mobile: '',
        address: '',
      };
      bh = this.sd_q8PSo4R8WkmxSHMq(bh);
      //appendnew_next_sd_tjFATEJKdLDUZEOq
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_tjFATEJKdLDUZEOq');
    }
  }
  private sd_q8PSo4R8WkmxSHMq(bh) {
    try {
      //appendnew_next_sd_q8PSo4R8WkmxSHMq
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_q8PSo4R8WkmxSHMq');
    }
  }
  private async sd_Dh1LGOvC5cEASgqT(bh) {
    try {
      let requestOptions = {
        url: 'http://localhost:8081/api/adduser',
        method: 'post',
        responseType: 'json',
        headers: {},
        params: {},
        body: this.page.user,
      };
      bh.response = await this.sdService.nHttpRequest(requestOptions);
      bh = this.sd_r0pkjNEvIChvyaZJ(bh);
      //appendnew_next_sd_Dh1LGOvC5cEASgqT
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_Dh1LGOvC5cEASgqT');
    }
  }
  private sd_r0pkjNEvIChvyaZJ(bh) {
    try {
      this.page.userService.addUserDetail(this.page.user);
      // console.log('outputt',bh.response);
      //appendnew_next_sd_r0pkjNEvIChvyaZJ
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_r0pkjNEvIChvyaZJ');
    }
  }
  private sd_Qp6Uf7BsFk3qJkVk(bh) {
    try {
      this.page.user = {
        name: '',
        organisation: '',
        email: '',
        mobile: '',
        address: '',
      };
      //appendnew_next_sd_Qp6Uf7BsFk3qJkVk
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_Qp6Uf7BsFk3qJkVk');
    }
  }
  //appendnew_node
  errorHandler(bh, e, src) {
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
