const events = require('events');
const eventEmitter = new events.EventEmitter();

let PubSubInstance = null;
export class pubsubUtil {
    constructor() {

    }
    static getInstance(): pubsubUtil {
        if (!PubSubInstance) {
            
            PubSubInstance = new pubsubUtil();
        }
        return PubSubInstance;
    }
    on (event, callback) {
        eventEmitter.on(event, callback)
    }
    once (event, callback) {
        eventEmitter.once(event, callback)
    }
    emit (event, data) {
        eventEmitter.emit(event, data)
    }
}