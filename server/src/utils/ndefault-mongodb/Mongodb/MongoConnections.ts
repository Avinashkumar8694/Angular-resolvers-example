import * as mongodb from 'mongodb'

export class MongoConnections {
    private static instance;
    private connectionsObj = {};
    private constructor() {

    }


    static getInstance(): MongoConnections {
        if (!MongoConnections.instance) {
            MongoConnections.instance = new MongoConnections();
        }
        return MongoConnections.instance;
    }

    set connection(nwConnection) {
        this.connectionsObj = Object.assign({}, this.connectionsObj, nwConnection)
    }


    getMongoInstance(id) {
        return this.connectionsObj[id];
    }

    freezConnectionObj() {
        Object.freeze(this.connectionsObj);
    }

    async newConnection(dbObj, id) {
        let options = dbObj.options ? JSON.parse(dbObj.options) : {};
        options.useUnifiedTopology = true;
        let client = await mongodb.MongoClient.connect(dbObj.url, options);
        this.connectionsObj[id] = client;
    }
}