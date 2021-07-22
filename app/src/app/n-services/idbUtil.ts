enum StoreOperation {
    CREATE = 1,// will carryout create operation
    DELETE,// will carryout delete operation
    UPDATE
}

enum TransactionState {
    ERROR = 10,
    ABORT,
    COMPLETE
}
interface ObjectStoreMetadata {
    storeName: string;
    storeConfig: { keyPath: string; autoIncrement: boolean; };
    storeIndexes: Array<{
        indexName: string;
        keypaths: Array<string>;
        options: IDBIndexParameters;
        operation: StoreOperation;
    }>
    operation: StoreOperation;// store level operation
}
interface ObjectStoreMetadataByVersion {
    version: number;
    ObjectStoreMetadataArr: Array<ObjectStoreMetadata>;
}
interface IndxDBConfig {
    name: string;
    version: number;
    objectStoresMetaByVersion: Array<ObjectStoreMetadataByVersion>;
}
interface Migration {
    version: number;
    migrationLogic: (x: IDBVersionChangeEvent) => any;
}

export class idbUtil {
    idbInstance: IDBDatabase;// database instance
    indexedDBconfig: IndxDBConfig;
    // migrationsLogicByVersion: Array<Migration>;

    constructor() {

    }

    initialize(indexedDbConfig: IndxDBConfig) {
        this.indexedDBconfig = indexedDbConfig;
        // this.migrationsLogicByVersion = migrationsLogicByVersion;
    }
    async getDatabaseInstance() {
        if (this.idbInstance) {
            return this.idbInstance;
        }
        await this.connect();
        return this;
    }
    /**
     * throw error is config not initialized
     */
    throwErrorIfConfigInitialised() {
        if (!this.indexedDBconfig) {
            throw new Error("Config not passed");
        }
    }
    /**
     * Connect to database and store database connection instance in idbInstance
     */
    async connect() {
        this.throwErrorIfConfigInitialised();
        const request = window.indexedDB.open(this.indexedDBconfig.name, this.indexedDBconfig.version);
        const requestPromise = new Promise<any>((resolve, reject) => {
            request.onerror = function (event) {
                return reject(event);
            };
            request.onsuccess = function (event) {
                return resolve(event);
            };
            request.onupgradeneeded = async (event: any) => {
                this.idbInstance = request.result as IDBDatabase; // connecting to the database
                const prevVersion = event.oldVersion;
                const currentVersion = event.newVersion;

                let storeObjsByVersions = this.indexedDBconfig.objectStoresMetaByVersion.filter((item) => item.version > prevVersion);
                storeObjsByVersions.sort((item1, item2) => {
                    if (item1.version < item2.version) {
                        return -1;
                    }
                    else if (item1.version == item2.version) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                });
                //run and create all stores
                for (const item of storeObjsByVersions) {
                    for (const store of item.ObjectStoreMetadataArr) {
                        if (store.operation === StoreOperation.CREATE) {
                            if (this.idbInstance.objectStoreNames.contains(store.storeName)) {
                                throw new Error("Store already exist, try using update or delete operation");
                            }
                            const objectStore = this.idbInstance.createObjectStore(store.storeName, store.storeConfig);
                            // create indexes
                            for (let indexObj of store.storeIndexes) {
                                if (objectStore.indexNames.contains(store.storeName)) {
                                    throw new Error("Index already exists");
                                }
                                objectStore.createIndex(indexObj.indexName, indexObj.keypaths.length === 1 ? indexObj.keypaths[0] : indexObj.keypaths, indexObj.options);
                            }
                        } else if (store.operation === StoreOperation.DELETE) {
                            this.idbInstance.deleteObjectStore(store.storeName);
                        } else if (store.operation === StoreOperation.UPDATE) {
                            const upgradeTransaction = event.target?.transaction;
                            const objectStore = upgradeTransaction.objectStore(store.storeName);
                            for (let indexObj of store.storeIndexes) {
                                if (indexObj.operation === StoreOperation.CREATE) {
                                    if (!objectStore.indexNames.contains(indexObj.indexName)) {
                                        objectStore.createIndex(indexObj.indexName, indexObj.keypaths.length === 1 ? indexObj.keypaths[0] : indexObj.keypaths, indexObj.options);
                                    } else {
                                        throw new Error("INDEX CREATE OPERATION: Index already exists");
                                    }
                                } else if (indexObj.operation === StoreOperation.DELETE) {
                                    if (objectStore.indexNames.contains(indexObj.indexName)) {
                                        objectStore.deleteIndex(indexObj.indexName);
                                    } else {
                                        throw new Error("INDEX DELETE OPERATION: Index doesnot exist");
                                    }
                                } else if (indexObj.operation === StoreOperation.UPDATE) {
                                    throw new Error("INDEX UPDATE OPERATION: Update operation is not supported");
                                } else {
                                    throw new Error("INDEX OPERATION: Invalid index operation");
                                }
                            }
                        } else {
                            throw new Error("Valid Operation not provided");
                        }

                    }
                }

            }
            request.onblocked = (event: any) => {
                throw new Error("Application is open somewhere else, cannot open database with new version");
            }
        });
        this.idbInstance = (await requestPromise).target?.result; // connecting to the database

        return this.idbInstance;
    }

    async createTransaction(storenames: Array<string>,
        eventOnError?: (event: Event) => void,
        eventOnAbort?: (event: Event) => void
    ) {
        const mode = "readwrite";

        this.throwErrorIfConfigInitialised();
        if (!this.idbInstance) {
            await this.connect();
        }
        const transaction = this.idbInstance.transaction(storenames, mode);
        if (eventOnError) {
            transaction.onerror = eventOnError;
        } else {
            transaction.onerror = (event) => {
                throw new Error('Transaction Error');
            };
        }
        if (eventOnAbort) {
            transaction.onabort = eventOnAbort;
        } else {
            transaction.onabort = (event) => {
                throw new Error('Transaction abort');
            };
        }
        return transaction;
        // initialize the transaction event handlers
    }

    async add(insertData: Array<{ objectStoreName: string; record: Object }>, transactionObj?: IDBTransaction) {
        const mode = "readwrite";
        try {
            if (insertData.length === 0) {
                throw new Error("Store names not provided");
            }
            return new Promise(async (resolve, reject) => {
                //promisifying transactions
                let transaction;
                if (transactionObj) {
                    transaction = transactionObj;
                } else {
                    transaction = this.idbInstance.transaction(insertData.map((item) => item.objectStoreName), mode);
                    transaction.onerror = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ERROR });
                    };
                    transaction.onabort = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ABORT });
                    };
                    transaction.oncomplete = (event) => {
                        resolve(event);
                    };
                }
                // perform insert operations
                let insertResponse = [];
                try {
                    for (let objectStoreWithInsertRecord of insertData) {
                        let itemResponse = await this.insertObject(transaction, objectStoreWithInsertRecord);
                        insertResponse.push(itemResponse);
                    }
                } catch (err) {
                    reject(err);
                }
                if (transactionObj) //if and only if transaction is passed as a parameter
                    resolve(insertResponse);
            });

        } catch (err) {
            await Promise.reject(err);
        }
    }

    insertObject(transaction, objectStoreWithInsertRecord) {
        return new Promise((resolve, reject) => {
            let request = transaction.objectStore(objectStoreWithInsertRecord.objectStoreName)
                .add(objectStoreWithInsertRecord.record);
            request.onsuccess = ((event) => {
                resolve(event);
            });
            request.onerror = ((event) => {
                reject(event);
            });
        });
    }

    async put(updateData: Array<{ objectStoreName: string; record: Object }>, transactionObj?: IDBTransaction) {
        const mode = "readwrite";
        try {
            if (updateData.length === 0) {
                throw new Error("Store names not provided");
            }
            return new Promise(async (resolve, reject) => {
                let transaction;
                if (transactionObj) {
                    transaction = transactionObj;
                } else {
                    transaction = this.idbInstance.transaction(updateData.map((item) => item.objectStoreName), mode);
                    transaction.onerror = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ERROR });
                    };
                    transaction.onabort = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ABORT });
                    };
                    transaction.oncomplete = (event) => {
                        resolve(event);
                    };
                }
                // perform upsert operations
                let upsertResponse = [];
                try {
                    for (let objectStoreWithUpdateRecord of updateData) {
                        let itemResponse = await this.upsertObject(transaction, objectStoreWithUpdateRecord);
                        upsertResponse.push(itemResponse);
                    }
                } catch (err) {
                    reject(err);
                }
                if (transactionObj)
                    resolve(upsertResponse);
            });

        } catch (err) {
            await Promise.reject(err);
        }
    }

    upsertObject(transaction, objectStoreWithUpdateRecord) {
        return new Promise((resolve, reject) => {
            let request = transaction.objectStore(objectStoreWithUpdateRecord.objectStoreName)
                .put(objectStoreWithUpdateRecord.record);
            request.onsuccess = ((event) => {
                resolve(event);
            });
            request.onerror = ((event) => {
                reject(event);
            });
        });
    }

    async get(objectStoreName: string, where: IDBKeyRange | string | number, limit?: number, keyindexName?: string, transactionObj?: IDBTransaction) {
        const mode = "readonly";
        try {
            return new Promise((resolve, reject) => {
                let transaction;
                if (transactionObj) {
                    transaction = transactionObj;
                } else {
                    transaction = this.idbInstance.transaction(objectStoreName, mode);
                    transaction.onerror = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ERROR });
                    };
                    transaction.onabort = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ABORT });
                    };
                    transaction.oncomplete = (event) => {
                        resolve(event);
                    };
                }
                // perform get operations
                const objectStore = transaction.objectStore(objectStoreName);
                let index;
                if (keyindexName) { index = objectStore.index(keyindexName); }
                else { index = objectStore }
                let request;
                if (limit !== undefined && limit !== null) {
                    request = where !== null ? index.getAll(where, limit) : index.getAll(null, limit);
                } else {
                    request = where !== null ? index.getAll(where) : index.getAll();
                }
                request.onerror = function (event) {
                    reject(event);
                };
                request.onsuccess = function (event) {
                    resolve(request.result);
                };
            });

        } catch (err) {
            await Promise.reject(err);
        }
    }

    async remove(removeData: { objectStoreName: string; primaryKeypathValue: any }, transactionObj?: IDBTransaction) {
        const mode = "readwrite";
        try {
            return new Promise(async (resolve, reject) => {
                let transaction;
                if (transactionObj) {
                    transaction = transactionObj;
                } else {
                    transaction = this.idbInstance.transaction(removeData.objectStoreName, mode);
                    transaction.onerror = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ERROR });
                    };
                    transaction.onabort = (event) => {
                        reject({ dberror: event, transactionState: TransactionState.ABORT });
                    };
                    transaction.oncomplete = (event) => {
                        resolve(event);
                    };
                }
                // perform delete operations
                try {
                    let removeResponse = await this.removeObject(transaction, removeData);
                    if (transactionObj) {
                        resolve(removeResponse);
                    }
                } catch (err) {
                    reject(err);
                }
            });

        } catch (err) {
            await Promise.reject(err);
        }
    }

    removeObject(transaction, removeData) {
        return new Promise((resolve, reject) => {
            let request = transaction.objectStore(removeData.objectStoreName)
                .delete(removeData.primaryKeypathValue);
            request.onsuccess = ((event) => {
                resolve(event);
            });
            request.onerror = ((event) => {
                reject(event);
            });
        });
    }

    async getCursor(objectStoreName: string, onSuccessCallback: (cursorObj: IDBRequest) => any, where: IDBKeyRange | string | number, keyindexName?: string, transactionObj?: IDBTransaction) {
        return new Promise((resolve, reject) => {
            let objectStore;
            if (transactionObj) {
                objectStore = transactionObj.objectStore(objectStoreName);
            } else {
                objectStore = this.idbInstance.transaction(objectStoreName).objectStore(objectStoreName);
            }
            if (keyindexName) {
                objectStore = objectStore.index(keyindexName);
            }
            let req;
            if (where) {
                req = objectStore.openCursor(where);
            } else {
                req = objectStore.openCursor();
            }
            req.onsuccess = async function (event: any) {
                let cursor = event.target.result;
                if (cursor) {
                    await onSuccessCallback(cursor);
                    cursor.continue();
                }
                else {
                    resolve({});
                }
            };
            req.onerror = function (event) {
                reject(event);
            };
        });
    }

}