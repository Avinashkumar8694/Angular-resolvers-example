import * as path from 'path';
import * as dotenv from 'dotenv';
let envFileName = process.env.NEUTRINOS_APP_ENV ? `${process.env.NEUTRINOS_APP_ENV}.env` : 'dev.env';
let envFilePath = `${process.cwd()}${path.sep}environments${path.sep}${envFileName}`;
dotenv.config({ path: envFilePath });
import "reflect-metadata";
import * as helmet from "helmet";
import * as express from "express";
import * as bodyParser from "body-parser";

import { UserRoutes } from "./routes";
import { APIResponse } from './middleware/APIResponse';
import * as swaggerUi from 'swagger-ui-express';
import * as url from 'url';
// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests


import config from "./config/config";
import log from "./utils/Logger";
import { Middlewares } from './middleware/GlobalMiddlewares';
import { StartScripts } from './ServerStartScripts';

log.debug(`NEUTRINOS_APP_ENV :: ${process.env.NEUTRINOS_APP_ENV}`);
log.debug(`loading env file :: ${envFilePath}`)

//////////////////////////////////////////////////////////
console.log("process.env.NODE_APP_INSTANCE", process.env.NODE_APP_INSTANCE);
console.log("process.env.pm_id", process.env.pm_id);


(async () => {
    const defaultContextPath = '/api';
    const defaultPort = 8081;
    const contextPath = process.env.SSD_BASE_PATH || defaultContextPath;
    const port = process.env.SSD_DEFAULT_PORT || defaultPort;

    try {
        let loadMiddlewares = function (preOrPost: string, generatedMiddlewares, app) {
            if (config['middlewares']) {
                config['middlewares'][preOrPost].map((mw) => {
                    let key: string = Object.entries(mw)[0][0];
                    let value: string = '' + Object.entries(mw)[0][1];
                    if (generatedMiddlewares[key] && generatedMiddlewares[key][value]) {
                        app.use(generatedMiddlewares[key][value].functionDef);
                    } else if (key === '__ssdGlobalMiddlewares__' && Middlewares[value]) {
                        app.use(Middlewares[value]());
                    }
                });
            }
        }

        // create express app
        const app = express();
        const baseApp = express();

        // Call midlewares
        app.use(helmet());

        // TODO: Make body parser configurable, User may have different APIs to different body requirements between text or json
        app.use(bodyParser.json());
        // load global pre middlewares here
        app.set('base', contextPath);

        let generatedMiddlewares: any = {};
        let swaggerDocument = {
            swagger: "2.0",
            basePath: contextPath,
            paths: {}
        };
        let globalTimers = [];

        /****************************
         * Load server start scripts
         ****************************/
        for (let startscript of StartScripts) {
            await startscript();
        }

        // initialize all middlewares
        UserRoutes.forEach(service => {
            service.getInstance(app, generatedMiddlewares, false, true, swaggerDocument, globalTimers);
        });

        // load global pre routes
        loadMiddlewares('pre', generatedMiddlewares, app);

        // load all routes
        UserRoutes.forEach(service => {
            service.getInstance(app, generatedMiddlewares, true, false, swaggerDocument, globalTimers);;
        });

        // load global pre routes
        loadMiddlewares('post', generatedMiddlewares, app);

        baseApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.get('*', express.static(path.join(__dirname, 'angular-app')), (req, res) => {
            let ssdAppPath = process.env.webAppMountpoint || 'web';
            if (ssdAppPath === '/') {
                res.sendFile(path.join(__dirname, 'angular-app/index.html'));
            } else {
                let originalUrl = req.originalUrl;
                let firstPath = url.parse(originalUrl).pathname.split('/').filter(v => v)[0];
                if (firstPath === ssdAppPath) {
                    res.sendFile(path.join(__dirname, 'angular-app/index.html'));
                } else {
                    res.status(404).send("Invalid API endpoint");
                }
            }
        });
        // generic responses
        app.use(APIResponse);
        baseApp.use(app);
        // run app
        baseApp.listen(port);

        log.info(`N-SD express application context path: ${contextPath}`);
        log.info(`N-SD express application is up and running on port: ${port}`);

    } catch (error) {
        log.error(error)
    }
})();
