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
import { ActivatedRoute, Router } from '@angular/router'; //_splitter_
//append_imports_end
@Component({
  selector: 'bh-userlist',
  templateUrl: './userlist.template.html',
})
export class userlistComponent {
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
      bh = this.sd_CEf0sYTcYzrReUdq(bh);
      //appendnew_next_ngOnInit
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_GGlWoXY5uiZMmiRd');
    }
  }
  openUserDetail(data: any = undefined, ...others) {
    try {
      var bh: any = this.__page_injector__
        .get(SDPageCommonService)
        .constructFlowObject(this);
      bh.input = { data: data };
      bh.local = {};
      bh = this.sd_G5LxDgvmmvCJiEYZ(bh);
      //appendnew_next_openUserDetail
      return bh.input.data;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_NfteUPNgQlTTwIhO');
    }
  }
  //appendnew_flow_userlistComponent_start
  private sd_CEf0sYTcYzrReUdq(bh) {
    try {
      this.page.activatedRoute = this.__page_injector__.get(ActivatedRoute);
      this.page.route = this.__page_injector__.get(Router);
      bh = this.sd_aGc6a91rJncWb09z(bh);
      //appendnew_next_sd_CEf0sYTcYzrReUdq
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_CEf0sYTcYzrReUdq');
    }
  }
  private sd_aGc6a91rJncWb09z(bh) {
    try {
      if (
        this.page.activatedRoute.snapshot.data &&
        this.page.activatedRoute.snapshot.data.userList
      ) {
        this.page['userlist'] = this.page.activatedRoute.snapshot.data.userList;
        console.log('this.page.userlist====', this.page['userlist']);
      }
      bh = this.sd_CyQ6IPGCnMvvJ0lD(bh);
      //appendnew_next_sd_aGc6a91rJncWb09z
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_aGc6a91rJncWb09z');
    }
  }
  private sd_CyQ6IPGCnMvvJ0lD(bh) {
    try {
      //appendnew_next_sd_CyQ6IPGCnMvvJ0lD
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_CyQ6IPGCnMvvJ0lD');
    }
  }
  private sd_G5LxDgvmmvCJiEYZ(bh) {
    try {
      this.page.route.navigate([`userdetails/${bh.input.data.email}`]);
      //appendnew_next_sd_G5LxDgvmmvCJiEYZ
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_G5LxDgvmmvCJiEYZ');
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
