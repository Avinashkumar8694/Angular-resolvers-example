/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  NAlertComponent,
  NAlertService,
  NFileIOService,
  NFileUploadComponent
} from 'neutrinos-module'
import {
  NDataModelService,
  NAuthGuardService,
  NHTTPLoaderService,
  NLocalStorageService,
  NLoginService,
  NLogoutService,
  NNotificationService,
  NPubSubService,
  NSessionStorageService,
  NSnackbarService,
  NSystemService,
  NTokenService
} from 'neutrinos-seed-services';
import { NeutrinosOAuthClientService } from 'neutrinos-oauth-client';
@Injectable()
export class SDBaseService {
  systemService = NSystemService.getInstance();
  appProperties;

  constructor(private http: HttpClient,
    private sessionStorage: NSessionStorageService,
    private tokenService: NTokenService,
    private httpLoaderService: NHTTPLoaderService,
    private dataModelService: NDataModelService,
    private loginService: NLoginService,
    private authGuardService: NAuthGuardService,
    private localStorageService: NLocalStorageService,
    private logoutService: NLogoutService,
    private notificationService: NNotificationService,
    private pubsubService: NPubSubService,
    private snackbarService: NSnackbarService,
    private alertService: NAlertService,
    private fileIOService: NFileIOService,
    private OauthService: NeutrinosOAuthClientService) {
  }

    operators = {
        'eq': function (a, b, c, d) { return a == b; },
        'se': function (a, b, c, d) { return a === b; },
        'neq': function (a, b, c, d) { return a != b; },
        'sne': function (a, b, c, d) { return a !== b; },
        'lt': function (a, b, c, d) { return a < b; },
        'lte': function (a, b, c, d) { return a <= b; },
        'gt': function (a, b, c, d) { return a > b; },
        'gte': function (a, b, c, d) { return a >= b; },
        'btwn': function (a, b, c, d) { return a >= b && a <= c; },
        'cont': function (a, b, c, d) { return (a + "").indexOf(b) != -1; },
        'regex': function (a, b, c, d) { return (a + "").match(new RegExp(b, d ? 'i' : '')); },
        'true': function (a, b, c, d) { return a === true; },
        'false': function (a, b, c, d) { return a === false; },
        'null': function (a, b, c, d) { return (typeof a == "undefined" || a === null); },
        'nnull': function (a, b, c, d) { return (typeof a != "undefined" && a !== null); },
        'empty': function (a, b, c, d) {
            if (typeof a === 'string' || Array.isArray(a)) {
                return a.length === 0;
            } else if (typeof a === 'object' && a !== null) {
                return Object.keys(a).length === 0;
            }
            return false;
        },
        'nempty': function (a, b, c, d) {
            if (typeof a === 'string' || Array.isArray(a)) {
                return a.length !== 0;
            } else if (typeof a === 'object' && a !== null) {
                return Object.keys(a).length !== 0;
            }
            return false;
        },

        'istype': function (a, b, c, d) {
            if (b === "array") { return Array.isArray(a); }
            else if (b === "json") {
                try { JSON.parse(a); return true; }   // or maybe ??? a !== null; }
                catch (e) { return false; }
            }
            else if (b === "null") { return a === null; }
            else { return typeof a === b && !Array.isArray(a) && a !== null; }
        },
        'else': function (a, b, c, d) { return a === true; }
    };

    getPathAndQParamsObj(urlWithSearchParams) {
        const paramsObj = {};
        const qparams = urlWithSearchParams.split('?')[1];
        if (qparams) {
            const qkv = qparams.split('&');
            if (qkv) {
                qkv.map((qparamsPair) => qparamsPair.split('=')).forEach(v => paramsObj[v[0]] = v[1]);
            }
        }
        return { paramObj: paramsObj, path: urlWithSearchParams.split('?')[0] };
    }

    formatPathWithParams(path: string, pathparams) {
        Object.keys(pathparams || {}).forEach((pathparamKey) => {
            let value = pathparams[pathparamKey];
            value = value ? ((typeof value === 'object') ? JSON.stringify(value) : value) : `:${pathparamKey}`;
            path = path.replace(`:${pathparamKey}`, value);
        });
        return path;
    }

    __formatHeaders(headersObj) {
        let headers = new HttpHeaders();
        if (typeof headersObj === 'object') {
            Object.entries(headersObj).forEach((p: Array<any>) => {
                let value = p[1];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                headers = headers.set(p[0], value);
            });
        }
        return headers;
    }

    __formatParams(paramsObj) {
        let params = new HttpParams();
        if (typeof paramsObj === 'object') {
            Object.entries(paramsObj).forEach((p: Array<any>) => {
                let value = p[1];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                params = params.set(p[0], value);
            });
        }
        return params;
    }

    nHttpRequest(requestOptions): any {
        const responseType = requestOptions.responseType || undefined;
        const reportProgress = requestOptions.reportProgress || false;
    
        const headers = this.__formatHeaders(requestOptions.headers);
        const params = this.__formatParams(requestOptions.params);
    
        const options = { headers: headers, params: params, responseType: responseType, reportProgress: reportProgress };
        if (requestOptions.withCredentials) {
            options['withCredentials'] = true;
        }
        if (requestOptions.observe) {
            options['observe'] = requestOptions.observe;
        }
        const httpReqObj = this.http.request(requestOptions.method, requestOptions.url, { body: requestOptions.body, ...options });
        
        if (requestOptions?.observe) {
            return httpReqObj;
        } else {
            return httpReqObj.toPromise();
        }
    }

    __constructDefault(bh) {

      const system: any = {};

      try {
        system.oauthService = this.OauthService;
        system.currentUser =  system.oauthService.userInfo;
        system.environment = environment;
        system.tokenService = this.tokenService;
        system.deviceService = this.systemService;
        system.httpLoaderService = this.httpLoaderService;
        system.dataModelService = this.dataModelService;
        system.loginService = this.loginService;
        system.authGuardService = this.authGuardService;
        system.localStorageService = this.localStorageService;
        system.logoutService = this.logoutService;
        system.notificationService = this.notificationService;
        system.pubsubService = this.pubsubService;
        system.snackbarService = this.snackbarService;
        system.alertService = this.alertService;
        system.fileIOService = this.fileIOService;

        Object.defineProperty(bh, 'system', {
          value: system,
          writable: false
        });

        if (!bh.input) {
            bh.input = {};
        }
        if (!bh.local) {
            bh.local = {};
        }

        return bh;
      }
      catch (e) {
        throw e;
      }
    }
}
