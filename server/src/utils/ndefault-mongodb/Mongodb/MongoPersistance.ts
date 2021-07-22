
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as BSON from 'bson';
import { MongoConnections } from './MongoConnections';


export class MongoPersistance {
    invalidDbRefmsg = 'Invalid config. Please select properconfig'
    private static instance;
    private constructor() {

    }

    static getInstance(): MongoPersistance {
        if (!MongoPersistance.instance) {
            MongoPersistance.instance = new MongoPersistance();
        }
        return MongoPersistance.instance;
    }

    async updateOne(configId, entity, filter, update, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                update = this.deserialize(update);
                return await dsRef.db().collection(entity).updateOne(filter, update, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    async updateMany(configId, entity, filter, update, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                update = this.deserialize(update);
                return await dsRef.db().collection(entity).updateMany(filter, update, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    /**************FINDERS*****************************/
    async findOne(configId, entity, query, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                query = this.deserialize(query);
                return await dsRef.db().collection(entity).findOne(query, options)
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    find(configId, entity, query, options) {
        return new Promise((resolve, reject) => {
            var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
            if (typeof dsRef === 'undefined') {
                return reject(new Error(this.invalidDbRefmsg));
            }
            else {
                try {
                    query = this.deserialize(query);
                    var cursor = dsRef.db().collection(entity).find(query, options);
                    // cursor.skip(pageSize * (pageNumber - 1)).limit(pageSize).sort(sort).project(projection);
                    return resolve(cursor.toArray());
                } catch (error) {
                    return reject(new Error(error));
                }
            }
        })

    };

    async findOneAndUpdate(configId, entity, query, update, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                query = this.deserialize(query);
                update = this.deserialize(update);
                return await dsRef.db().collection(entity).findOneAndUpdate(query, update, options);
            } catch (error) {
                throw new Error(error);
            }


        }
    };

    async countDocuments(configId, entity, query, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                let filter = this.deserialize(query);
                return { "count": await dsRef.db().collection(entity).countDocuments(filter, options) };
            } catch (error) {
                throw new Error(error);
            }

        }
    };
    /************************************************************/

    async insertOne(configId, entity, doc, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                doc = this.deserialize(doc);
                return await dsRef.db().collection(entity).insertOne(doc, options);
            } catch (error) {
                throw new Error(error);
            }

        }
    };

    async insertMany(configId, entity, doc, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                doc = this.deserialize(doc);
                return await dsRef.db().collection(entity).insertMany(doc, options);
            } catch (error) {
                throw new Error(error);
            }

        }
    };

    async deleteOne(configId, entity, filter, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                return await dsRef.db().collection(entity).deleteOne(filter, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async deleteMany(configId, entity, filter, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                return await dsRef.db().collection(entity).deleteMany(filter, options);
            } catch (error) {
                throw new Error(error);
            }

        }
    }

    uploadFile(configId, entity, filePath, fileName, options) {
        return new Promise((resolve, reject) => {
            var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
            if (typeof dsRef === 'undefined') {
                return reject(new Error(this.invalidDbRefmsg))
            }
            else {
                try {
                    var bucketOptions = { 'bucketName': entity };
                    var readStream = fs.createReadStream(filePath);
                    var bucket = new mongodb.GridFSBucket(dsRef.db(), bucketOptions);
                    var uploadStream = bucket.openUploadStream(fileName, options);
                    var id = uploadStream.id;
                    readStream.pipe(uploadStream).
                        on('error', function (error) {
                            return reject(error)
                        }).
                        on('finish', function (result) {
                            return resolve(result)

                        });
                } catch (error) {
                    return reject(new Error(error));
                }


            }
        })
    }

    downloadFile(configId, entity, filter, options) {
        return new Promise((resolve, reject) => {
            var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
            if (typeof dsRef === 'undefined') {
                throw new Error(this.invalidDbRefmsg);
            }
            else {
                try {
                    var bucketOptions = { 'bucketName': entity };
                    var bucket = new mongodb.GridFSBucket(dsRef.db(), bucketOptions);
                    var cursor = bucket.find(filter);
                    cursor.toArray((error, docs) => {
                        if (error) {
                            return reject(error);
                        }
                        else {
                            if (docs && docs.length > 0) {
                                var metadata = docs[0] //this is the metadata;
                                var downloadStream = bucket.openDownloadStream(docs[0]._id, null);
                                return resolve({ "metadata": metadata, "downloadStream": downloadStream });
                            } else {
                                return reject(new Error('FILE_NOT_FOUND'));
                            }
                        }
                    });
                } catch (error) {
                    throw new Error(error);
                }
            }
        })

    }

    deleteFile(configId, entity, id) {
        return new Promise((resolve, reject) => {
            if (typeof id == 'string') {
                id = new mongodb.ObjectId(id);
            }
            var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
            if (typeof dsRef === 'undefined') {
                throw new Error(this.invalidDbRefmsg);
            }
            else {
                var bucketOptions = { 'bucketName': entity };
                var bucket = new mongodb.GridFSBucket(dsRef.db(), bucketOptions);
                bucket.delete(id, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        return resolve(id);
                    }
                });
            }
        });
    }

    /**************INDEX*****************************/
    async createIndex(configId, entity, fieldOrSpec, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).createIndex(fieldOrSpec, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    async dropIndex(configId, entity, indexName, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).dropIndex(indexName, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    aggregate(configId, entity, pipeline, options) {
        return new Promise((resolve, reject) => {
            var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
            if (typeof dsRef === 'undefined') {
                reject(new Error(this.invalidDbRefmsg));
            }
            else {
                try {
                    var cursor = dsRef.db().collection(entity).aggregate(pipeline, options);
                    return resolve(cursor.toArray());
                } catch (error) {
                    return reject(new Error(error));
                }
            }
        });
    }

    async bulkWrite(configId, entity, doc, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                doc = this.deserialize(doc);
                return await dsRef.db().collection(entity).bulkWrite(doc, options);
            } catch (error) {
                throw new Error(error);
            }

        }
    };

    async distinct(configId, entity, key, query, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).distinct(key, query, options);
            } catch (error) {
                throw new Error(error);
            }

        }
    }

    async drop(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).drop(options);
            } catch (error) {
                throw new Error(error);
            }

        }
    }

    async dropIndexes(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).dropIndexes(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    async estimatedDocumentCount(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).estimatedDocumentCount(options);
            } catch (error) {
                throw new Error(error);
            }

        }
    }

    async findOneAndReplace(configId, entity, filter, replacement, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                return await dsRef.db().collection(entity).findOneAndReplace(filter, replacement, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async findOneAndDelete(configId, entity, query, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                query = this.deserialize(query);
                return await dsRef.db().collection(entity).findOneAndDelete(query, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    };

    async indexExists(configId, entity, indexes, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).indexExists(indexes, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async indexInformation(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).indexInformation(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async indexes(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).indexes(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async initializeOrderedBulkOp(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).initializeOrderedBulkOp(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async initializeUnorderedBulkOp(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).initializeUnorderedBulkOp(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async isCapped(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).isCapped(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async listIndexes(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                const cursor =  await dsRef.db().collection(entity).listIndexes(options);
                return Promise.resolve(cursor.toArray());
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async mapReduce(configId, entity, map, reduce, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).mapReduce(map, reduce, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async options(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).options(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async reIndex(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).reIndex(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async removeMany(configId, entity, filter, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                return await dsRef.db().collection(entity).removeMany(filter, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async removeOne(configId, entity, filter, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                filter = this.deserialize(filter);
                return await dsRef.db().collection(entity).removeOne(filter, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async rename(configId, entity, newName, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).rename(newName, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async replaceOne(configId, entity, filter, doc, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).replaceOne(filter, doc, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async stats(configId, entity, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).stats(options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async watch(configId, entity, pipeline, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                const streamChanges =  dsRef.db().collection(entity).watch(pipeline, options);
                return streamChanges;
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    async geoHaystackSearch(configId, entity, x, y, options) {
        var dsRef = MongoConnections.getInstance().getMongoInstance(configId);
        if (typeof dsRef === 'undefined') {
            throw new Error(this.invalidDbRefmsg);
        }
        else {
            try {
                return await dsRef.db().collection(entity).geoHaystackSearch(x, y, options);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

	private deserialize(item: Buffer | ArrayBuffer | ArrayBufferView) {
		if(Buffer.isBuffer(item) || item instanceof ArrayBuffer || ArrayBuffer.isView(item)) {
			return BSON.deserialize(item);
		}
		return item;
		// return BSON.deserialize(BSON.serialize(item));
	}
}