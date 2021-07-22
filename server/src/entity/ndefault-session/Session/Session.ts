import * as OracleSession from './oracle/Session';
import { Session } from './mssql/Session';

export let sessionObject = {
    mssql: [Session],
    mysql: [Session],
    mariadb: [Session],
    postgres: [Session],
    oracle: [OracleSession.Session]
}
