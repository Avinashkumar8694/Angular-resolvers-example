import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { SDBaseService } from 'app/n-services/SDBaseService';
import { localesService } from '../../../baseClasses/localesService';
import { NDataModel } from '../../../baseClasses/nDataModel.class';

@Injectable({ providedIn: 'root' })
export class SDPageCommonService {
    private componentRefPropertiesMap = new Map<any, any>();

    constructor(
        private sdService: SDBaseService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}
    constructFlowObject(componentInstance: any) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            componentInstance.constructor
        );
        const inputProperties = factory.inputs.map(i => i.propName);
        const outputProperties = factory.outputs.map(i => i.propName);
        const bh: any = {
            sdService: this.sdService,
        };
        Object.defineProperty(bh, 'pageInput', {
            value: Object.defineProperties(
                {},
                this.definePropertiesGetter(
                    componentInstance,
                    inputProperties,
                    'Input'
                )
            ),
        });
        Object.defineProperty(bh, 'pageOutput', {
            value: Object.defineProperties(
                {},
                this.definePropertiesGetter(
                    componentInstance,
                    outputProperties,
                    'Output'
                )
            ),
        });
        this.sdService.__constructDefault(bh);
        return bh;
    }

    private definePropertiesGetter(
        componentInstance: any,
        properties: string[],
        type: string
    ): PropertyDescriptorMap {
        const componentClassRef = componentInstance.constructor;
        const mappedVal = this.componentRefPropertiesMap.get(componentClassRef);
        if (!mappedVal) {
            this.componentRefPropertiesMap.set(componentClassRef, {});
        }
        if (!this.componentRefPropertiesMap.get(componentClassRef)[type]) {
            const propertiesAccessDescriptors = {};
            for (const property of properties) {
                propertiesAccessDescriptors[property] = {
                    get() {
                        return componentInstance[property];
                    },
                };
            }
            this.componentRefPropertiesMap.get(componentClassRef)[type] =
                propertiesAccessDescriptors;
        }
        return this.componentRefPropertiesMap.get(componentClassRef)[type];
    }

    addPageDefaults(page) {
        Object.defineProperties(page, {
            locales: {
                value: {},
            },
            dm: {
                value: new NDataModel(),
            },
        });
        Object.defineProperties(page.locales, {
            keys: {
                get: () => localesService.getLocalesInstance().locale || {},
            },
            language: {
                get: () => localesService.getLocalesInstance().language,
                set: l => (localesService.getLocalesInstance().language = l),
            },
        });
        this.sdService.__constructDefault(page);
    }
}
