// Base component 
import { NDataModel } from './nDataModel.class';
import { localesService } from './localesService';
export class NBaseComponent {
    dm: NDataModel;
    localesService: any;
    constructor() {
        this.dm = new NDataModel();
        this.localesService = localesService.getLocalesInstance();
    }

    get locales() {
        return this.localesService.locale || {};
    }
}