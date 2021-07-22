import * as configNodes from './config/configNodes';
//append_imports_start

import { MongoConnections } from './utils/ndefault-mongodb/Mongodb/MongoConnections'; //_splitter_
import { sessionObject } from './entity/ndefault-session/Session/Session'; //_splitter_
import { LoggerTypeorm } from './utils/ndefault-sql/ExecuteSql/LoggerTypeorm'; //_splitter_
import * as log from './utils/Logger'; //_splitter_
import { createConnections } from 'typeorm'; //_splitter_
//append_imports_end
export let StartScripts = [
  //appendnew_flow

  //__start__script__ndefault-sql
  async () => {
    function isDBDisabled(flag) {
      return typeof flag === 'boolean' && flag;
    }
    const dbConfig = configNodes.default['db-config'];
    if (dbConfig) {
      const dbConfigsList = Object.keys(dbConfig);
      let ormConfig: any[] = [];
      for (let i = 0; i < dbConfigsList.length; i++) {
        if (
          dbConfig[dbConfigsList[i]] &&
          !isDBDisabled(dbConfig[dbConfigsList[i]].disabledb) &&
          dbConfig[dbConfigsList[i]].dbOption
        ) {
          let dbOption = dbConfig[dbConfigsList[i]].dbOption;
          if (dbOption.type != 'mongodb') {
            if (typeof dbOption.port === 'string') {
              dbOption.port = parseInt(dbOption.port);
            }
            dbOption.entities = sessionObject[dbOption.type];
            dbOption.logger = new LoggerTypeorm(log.default);
            ormConfig.push(dbOption);
          }
        }
      }
      const connection = await createConnections(ormConfig);
      // to freez the mongo config object
      //  monogConnections.freezConnectionObj();
    }
  },
  //__start__script__ndefault-sql__end

  //__start__script__ndefault-mongodb
  async () => {
    let monogConnections = MongoConnections.getInstance();
    function isDBDisabled(flag) {
      return typeof flag === 'boolean' && flag;
    }
    const dbConfig = configNodes.default['db-config'];
    if (dbConfig) {
      const dbConfigsList = Object.keys(dbConfig);
      let ormConfig: any[] = [];
      for (let i = 0; i < dbConfigsList.length; i++) {
        if (
          dbConfig[dbConfigsList[i]] &&
          !isDBDisabled(dbConfig[dbConfigsList[i]].disabledb) &&
          dbConfig[dbConfigsList[i]].dbOption
        ) {
          let dbOption = dbConfig[dbConfigsList[i]].dbOption;
          if (dbOption.type === 'mongodb') {
            await monogConnections.newConnection(dbOption, dbConfigsList[i]);
          }
        }
      }
    }
  },
  //__start__script__ndefault-mongodb__end
];
