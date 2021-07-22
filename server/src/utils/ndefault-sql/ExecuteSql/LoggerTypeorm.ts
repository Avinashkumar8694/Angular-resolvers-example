import 'reflect-metadata'
import { Logger, QueryRunner } from 'typeorm'
// import log from './Logger'

export class LoggerTypeorm implements Logger {
    constructor(public logger: any) {
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.verbose(query, ...(parameters || []));
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.error(error, query, ...(parameters || []));
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.warn(time, query, ...(parameters || []));
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.verbose(message);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.info(message);
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
        let l
        switch (level) {
            case 'log':
                l = this.logger.debug
                break
            case 'info':
                l = this.logger.info
                break
            case 'warn':
                l = this.logger.warn
                break
            default:
                l = this.logger.trace
                break
        }
        l(message);
    }
}