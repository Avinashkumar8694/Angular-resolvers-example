import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config/config';

const { combine, timestamp, label, printf, colorize } = format;

class WinstonLogger {

    constructor() {

    }

    getWinstonTransportConfig(transportType) {
        const transportConfig = { transports: [], exceptionHandlers: [] };

        if (transportType.file) {
            transportConfig.transports.push(new DailyRotateFile({
                filename: config.logger.logFile ? config.logger.logFile : 'logs/console.log',
                datePattern: 'DD-MM-YYYY',
                maxSize: '10m',
                maxFiles: '30d'
            }));

            transportConfig.exceptionHandlers.push(new DailyRotateFile({
                filename: config.logger.exceptionFile ? config.logger.exceptionFile : 'logs/exception.log',
                datePattern: 'DD-MM-YYYY',
                maxSize: '10m'
            }));
        }

        if (transportType.console) {
            transportConfig.transports.push(new transports.Console());
            transportConfig.exceptionHandlers.push(new transports.Console());
        }

        return transportConfig;
    }

    loggerStream() {
        const consoleConfig = { file: false, console: false };

        if (config.logger && config.logger.transport) {
            const transportType: any = config.logger.transport;

            if ((Array.isArray(transportType) && (transportType.findIndex(item => item.toLowerCase() === 'console') > -1)) || (typeof transportType === 'string' && transportType.toLowerCase() === 'console')) {
                consoleConfig.console = true;
            }

            if ((Array.isArray(transportType) && (transportType.findIndex(item => item.toLowerCase() === 'file') > -1)) || (typeof transportType === 'string' && transportType.toLowerCase() === 'file')) {
                consoleConfig.file = true;
            }
        }

        return this.getWinstonTransportConfig(consoleConfig);
    }

    logFormat = printf(info => {
        return `[${info.label}] ${info.timestamp} ${info.level}: ${info.message}`;
    });

    initLogger() {
        let logInstance = createLogger({
            level: ((config.logger && config.logger.level) ? config.logger.level : 'info'),
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                verbose: 3,
                debug: 4,
                silly: 5
            },
            exitOnError: false,
            format: combine(
                colorize(),
                label({ label: 'SSD' }),
                timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                this.logFormat
            ),
            ...this.loggerStream()
        });

        // Extend logger object to properly log 'Error' types
        const origLog = logInstance.log

        logInstance.log.prototype = function (level, msg) {
            if (msg instanceof Error) {
                var args = Array.prototype.slice.call(arguments)
                args[1] = msg.stack
                origLog.apply(logInstance, args)
            } else {
                origLog.apply(logInstance, arguments)
            }
        }
        return logInstance;
    }
}

export default new WinstonLogger().initLogger();