let instance = null;
//CORE_REFERENCE_IMPORTS
//append_imports_start
import { StatusCodes as httpStatusCodes } from 'http-status-codes'; //_splitter_
import * as cookieParser from 'cookie-parser'; //_splitter_
import { Readable } from 'stream'; //_splitter_
import { setInterval } from 'timers'; //_splitter_
import { Issuer, custom } from 'openid-client'; //_splitter_
import * as crypto from 'crypto'; //_splitter_
import * as url from 'url'; //_splitter_
import { SDBaseService } from '../services/SDBaseService'; //_splitter_
import { Middleware } from '../middleware/Middleware'; //_splitter_
import * as settings from '../config/config'; //_splitter_
import log from '../utils/Logger'; //_splitter_
import { MongoPersistance } from '../utils/ndefault-mongodb/Mongodb/MongoPersistance'; //_splitter_
import * as mongodb from 'mongodb'; //_splitter_
//append_imports_end
export class ssd1 {
  private sdService = new SDBaseService();
  private app;
  private serviceBasePath: string;
  private generatedMiddlewares: Object;
  private serviceName: string;
  private swaggerDocument: Object;
  private globalTimers: any;
  private constructor(
    app,
    generatedeMiddlewares,
    routeCall,
    middlewareCall,
    swaggerDocument,
    globalTimers
  ) {
    this.serviceName = 'ssd1';
    this.app = app;
    this.serviceBasePath = this.app.settings.base;
    this.generatedMiddlewares = generatedeMiddlewares;
    this.swaggerDocument = swaggerDocument;
    this.globalTimers = globalTimers;
  }
  static getInstance(
    app?,
    generatedeMiddlewares?,
    routeCall?,
    middlewareCall?,
    swaggerDocument?,
    globalTimers?
  ) {
    if (!instance) {
      instance = new ssd1(
        app,
        generatedeMiddlewares,
        routeCall,
        middlewareCall,
        swaggerDocument,
        globalTimers
      );
    }
    instance.mountCalls(routeCall, middlewareCall);
    return instance;
  }
  private mountCalls(routeCall, middlewareCall) {
    if (routeCall) {
      this.mountAllPaths();
      this.mountAllListeners();
    }
    if (middlewareCall) {
      this.generatedMiddlewares[this.serviceName] = {};
      this.mountAllMiddlewares();
      this.mountTimers();
    }
  }
  async mountAllListeners() {
    try {
      //append_listeners
    } catch (e) {
      throw e;
    }
  }
  async mountTimers() {
    try {
      //appendnew_flow_ssd1_TimerStart
    } catch (e) {
      throw e;
    }
  }
  private mountAllMiddlewares() {
    log.debug('mounting all middlewares for service :: ssd1');
    //appendnew_flow_ssd1_MiddlewareStart
  }
  private mountAllPaths() {
    log.debug('mounting all paths for service :: ssd1');
    if (!this.swaggerDocument['paths']['/adduser']) {
      this.swaggerDocument['paths']['/adduser'] = {
        post: {
          summary: '',
          description: '',
          consumes: [],
          produces: [],
          parameters: [],
          responses: {},
        },
      };
    } else {
      this.swaggerDocument['paths']['/adduser']['post'] = {
        summary: '',
        description: '',
        consumes: [],
        produces: [],
        parameters: [],
        responses: {},
      };
    }
    this.app['post'](
      `${this.serviceBasePath}/adduser`,
      cookieParser(),
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'pre',
        this.generatedMiddlewares
      ),
      async (req, res, next) => {
        let bh = {};
        try {
          bh = this.sdService.__constructDefault(
            { local: {}, input: {} },
            req,
            res,
            next
          );
          bh = await this.sd_NNBjZVPgkmSkVUO9(bh);
          //appendnew_next_sd_91CYQ2AiOXjzwHg2
        } catch (e) {
          return await this.errorHandler(bh, e, 'sd_91CYQ2AiOXjzwHg2');
        }
      },
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'post',
        this.generatedMiddlewares
      )
    );
    if (!this.swaggerDocument['paths']['/getUsersList']) {
      this.swaggerDocument['paths']['/getUsersList'] = {
        get: {
          summary: '',
          description: '',
          consumes: [],
          produces: [],
          parameters: [],
          responses: {},
        },
      };
    } else {
      this.swaggerDocument['paths']['/getUsersList']['get'] = {
        summary: '',
        description: '',
        consumes: [],
        produces: [],
        parameters: [],
        responses: {},
      };
    }
    this.app['get'](
      `${this.serviceBasePath}/getUsersList`,
      cookieParser(),
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'pre',
        this.generatedMiddlewares
      ),
      async (req, res, next) => {
        let bh = {};
        try {
          bh = this.sdService.__constructDefault(
            { local: {}, input: {} },
            req,
            res,
            next
          );
          bh = await this.sd_fQYSB3yZ0RiqB4FD(bh);
          //appendnew_next_sd_KxmP71jqH6X0hlzw
        } catch (e) {
          return await this.errorHandler(bh, e, 'sd_KxmP71jqH6X0hlzw');
        }
      },
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'post',
        this.generatedMiddlewares
      )
    );
    if (!this.swaggerDocument['paths']['/getUsersById']) {
      this.swaggerDocument['paths']['/getUsersById'] = {
        get: {
          summary: '',
          description: '',
          consumes: [],
          produces: [],
          parameters: [],
          responses: {},
        },
      };
    } else {
      this.swaggerDocument['paths']['/getUsersById']['get'] = {
        summary: '',
        description: '',
        consumes: [],
        produces: [],
        parameters: [],
        responses: {},
      };
    }
    this.app['get'](
      `${this.serviceBasePath}/getUsersById`,
      cookieParser(),
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'pre',
        this.generatedMiddlewares
      ),
      async (req, res, next) => {
        let bh = {};
        try {
          bh = this.sdService.__constructDefault(
            { local: {}, input: {} },
            req,
            res,
            next
          );
          bh = await this.sd_XggvZ2F2gKA6MGPt(bh);
          //appendnew_next_sd_mRE0aiz2bEmAdPgu
        } catch (e) {
          return await this.errorHandler(bh, e, 'sd_mRE0aiz2bEmAdPgu');
        }
      },
      this.sdService.getMiddlesWaresBySequenceId(
        null,
        'post',
        this.generatedMiddlewares
      )
    );
    //appendnew_flow_ssd1_HttpIn
  }
  //   service flows_ssd1
  //appendnew_flow_ssd1_start
  private async sd_NNBjZVPgkmSkVUO9(bh) {
    try {
      bh.result = await MongoPersistance.getInstance().insertOne(
        'sd_eENAKm36VV8qyHJu',
        'userdetail',
        bh.input.body,
        {}
      );
      bh = await this.sd_W6DscJOsKamb6oTK(bh);
      //appendnew_next_sd_NNBjZVPgkmSkVUO9
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_NNBjZVPgkmSkVUO9');
    }
  }
  private async sd_W6DscJOsKamb6oTK(bh) {
    try {
      console.log('dsdfdsfsdfdf', bh.result);
      await this.sd_ve24iRexohfBwM4E(bh);
      //appendnew_next_sd_W6DscJOsKamb6oTK
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_W6DscJOsKamb6oTK');
    }
  }
  private async sd_ve24iRexohfBwM4E(bh) {
    try {
      bh.web.res.status(200).send(bh.result);
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_ve24iRexohfBwM4E');
    }
  }
  private async sd_fQYSB3yZ0RiqB4FD(bh) {
    try {
      bh.query = {};
      bh = await this.sd_T2mk0CqwyZaG8jaN(bh);
      //appendnew_next_sd_fQYSB3yZ0RiqB4FD
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_fQYSB3yZ0RiqB4FD');
    }
  }
  private async sd_T2mk0CqwyZaG8jaN(bh) {
    try {
      bh.response = await MongoPersistance.getInstance().find(
        'sd_eENAKm36VV8qyHJu',
        'userdetail',
        bh.query,
        {}
      );
      await this.sd_JTmBV88ND8lBY6tn(bh);
      //appendnew_next_sd_T2mk0CqwyZaG8jaN
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_T2mk0CqwyZaG8jaN');
    }
  }
  private async sd_JTmBV88ND8lBY6tn(bh) {
    try {
      bh.web.res.status(200).send(bh.response);
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_JTmBV88ND8lBY6tn');
    }
  }
  private async sd_XggvZ2F2gKA6MGPt(bh) {
    try {
      bh.query = { email: `${bh.input.query.email}` };
      console.log(bh);
      bh = await this.sd_DT5nIEyhqHCzy1I0(bh);
      //appendnew_next_sd_XggvZ2F2gKA6MGPt
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_XggvZ2F2gKA6MGPt');
    }
  }
  private async sd_DT5nIEyhqHCzy1I0(bh) {
    try {
      bh.response = await MongoPersistance.getInstance().find(
        'sd_eENAKm36VV8qyHJu',
        'userdetail',
        bh.query,
        {}
      );
      await this.sd_uCapIa79eytvKmBT(bh);
      //appendnew_next_sd_DT5nIEyhqHCzy1I0
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_DT5nIEyhqHCzy1I0');
    }
  }
  private async sd_uCapIa79eytvKmBT(bh) {
    try {
      bh.web.res.status(200).send(bh.response);
      return bh;
    } catch (e) {
      return await this.errorHandler(bh, e, 'sd_uCapIa79eytvKmBT');
    }
  }
  //appendnew_node
  async errorHandler(bh, e, src) {
    console.error(e);
    bh.error = e;
    bh.errorSource = src;
    if (
      false
      /*appendnew_next_Catch*/
    ) {
      return bh;
    } else {
      if (bh.web.next) {
        bh.web.next(e);
      } else {
        throw e;
      }
    }
  }
}
