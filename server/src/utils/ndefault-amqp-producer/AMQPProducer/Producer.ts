import { Options, Connection, Channel, connect } from 'amqplib';
import safeStringify from 'fast-safe-stringify';
import log from "../../Logger";

let ProducerInstance: Producer = null;
interface SendOptions {
    producerQ: string,
    message: any,
    assertQueueOptions?: Options.AssertQueue,
    sendTOQOptions?: Options.Publish
}
type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';


export class Producer {
    mqOptions: Options.Connect;
    connection: Connection = null;
    producerQ: string;
    queueChannelMap: { [key: string]: Channel } = {};
    constructor() {}

    static getInstance(mqOptions: Options.Connect): Producer {
        if (!ProducerInstance) {
            if (!mqOptions.hostname || !mqOptions.port) {
                throw new Error("Invalid MQ config");
            }
            ProducerInstance = new Producer();
            ProducerInstance.mqOptions = mqOptions;
        }
        return ProducerInstance;
    }

    async connect() {
        this.log('debug', 'Connecting to AMQP broker...');
        if (!this.connection) {
            this.connection = await connect(this.mqOptions);
            this.__attachCloseAndErrorListeners(this.connection, 'connection');
            this.log('debug', 'Connection established');
        } else {
            this.log('debug', 'Connection already exists. Reusing it.')
        }
    }

    async send(sendOptions: SendOptions) {
        const {
            producerQ,
            message,
            assertQueueOptions = { durable: true },
            sendTOQOptions = { persistent: true }
        } = sendOptions;
        try {
            await this.connect();
            await this.__createChannel(producerQ);
            this.__assertQueue({ q: producerQ, assertQueueOptions });
            this.__sendMessageToQ({ q: producerQ, message, sendTOQOptions });
        } catch (e) {
            this.log('error', e);
        }
    }

    private __attachCloseAndErrorListeners(entity: Connection | Channel, type: 'connection' | 'channel') {
        entity.on('close', () => {
            this.log('debug', `${type} closed :: `, entity);
        });
        entity.on('error', (e) => {
            this.log('debug', `Error occured in ${type}:: `, e);
        });
    }

    private async __createChannel(q) {
        if (this.queueChannelMap[q]) {
            this.log('debug', 'Channel already exists for this queue');
            return this.queueChannelMap[q];
        }
        this.log('debug', 'Creating channel...');
        const channel = await this.connection.createChannel();
        this.__attachCloseAndErrorListeners(channel, 'channel');
        this.queueChannelMap[q] = channel;
        this.log('debug', 'Channel created');
        return channel;
    }

    private __assertQueue({ q, assertQueueOptions }) {
        this.queueChannelMap[q].assertQueue(q, assertQueueOptions);
        this.log('debug', 'Producer queue asserted');
    }

    private __sendMessageToQ({ q, message, sendTOQOptions }) {
        this.log('debug', 'Sending message to the queue...');
        if (!(message instanceof Buffer)) {
            this.log('error', '{message} should be instance of "Buffer"');
        }
        this.queueChannelMap[q].sendToQueue(q, message, sendTOQOptions);
        this.log('debug', 'Message sent...');
    }

    destroy() {
        try {
            this.closeChannels();
            this.connection.close();
        } catch (e) {
            this.log('error', e);
        }
    }

    async closeChannels() {
        const channelClosePromiseArr: Array<Promise<any>> = [];
        const qArr = [];
        Object.entries(this.queueChannelMap).forEach(([q, channel]) => {
            channelClosePromiseArr.push(channel.close());
            qArr.push(q);
        });
        await Promise.all(channelClosePromiseArr.map((p, index) => ({ index, error: p.catch(err => err) }))).then(res => {
            res.forEach(o => {
                if (!o.error) {
                    delete this.queueChannelMap[qArr[o.index]];
                }
            })
            return this.queueChannelMap;
        });
    }

    private log(level: LogLevel, msg: string, ...args) {
        log[level](`[AMQP] ${msg}${args.length ? args.map(e => safeStringify(e)).join('\n') : args}`);
    }
}
