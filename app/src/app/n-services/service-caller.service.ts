//append_imports_start

import * as sd_xxLTxgAtC0rp4V8x from 'app/sd-services/user'; //_splitter_
import { Injectable } from '@angular/core'; //_splitter_
//append_imports_end
@Injectable({ providedIn: 'root' })
export class __NEU_ServiceInvokerService__ {
  constructor(private sd_xxLTxgAtC0rp4V8x: sd_xxLTxgAtC0rp4V8x.user) {}
  invoke(
    injectedServiceId: string,
    methodName: string,
    ...methodArguments: any[]
  ) {
    return this[injectedServiceId][methodName](...methodArguments);
  }
}
