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
  selector: 'bh-userDetail',
  templateUrl: './userDetail.template.html',
})
export class userDetailComponent {
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
      bh = this.sd_IMaYDazXHEYZ1Xe6(bh);
      //appendnew_next_ngOnInit
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_crOdQZBxbl4lUUsJ');
    }
  }
  //appendnew_flow_userDetailComponent_start
  private sd_IMaYDazXHEYZ1Xe6(bh) {
    try {
      this.page.activatedRoute = this.__page_injector__.get(ActivatedRoute);
      this.page.route = this.__page_injector__.get(Router);
      bh = this.sd_FDqnddw41mtN1wBK(bh);
      //appendnew_next_sd_IMaYDazXHEYZ1Xe6
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_IMaYDazXHEYZ1Xe6');
    }
  }
  private sd_FDqnddw41mtN1wBK(bh) {
    try {
      if (
        this.page.activatedRoute.snapshot.data &&
        this.page.activatedRoute.snapshot.data.userDetails
      ) {
        this.page['userDetails'] =
          this.page.activatedRoute.snapshot.data.userDetails.length > 0
            ? this.page.activatedRoute.snapshot.data.userDetails[0]
            : null;
        console.log('this.page.userDetails====', this.page['userDetails']);
      }
      bh = this.sd_CyBDy02wRXLrq9t4(bh);
      //appendnew_next_sd_FDqnddw41mtN1wBK
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_FDqnddw41mtN1wBK');
    }
  }
  private sd_CyBDy02wRXLrq9t4(bh) {
    try {
      //appendnew_next_sd_CyBDy02wRXLrq9t4
      return bh;
    } catch (e) {
      return this.errorHandler(bh, e, 'sd_CyBDy02wRXLrq9t4');
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
