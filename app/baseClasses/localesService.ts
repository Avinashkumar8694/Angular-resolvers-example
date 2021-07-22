import { NLocaleResource } from '../src/app/n-services/n-localeResources.service';

export class localesService {

    private static localesInstance: NLocaleResource;
    
    static getLocalesInstance() {
        if (!localesService.localesInstance) {
            localesService.localesInstance = new NLocaleResource();
            localesService.localesInstance.getLang();
        }
        return localesService.localesInstance;
    }
}