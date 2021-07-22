import { getConnection} from "typeorm";

/**
 * Generic functions to execute raw sql queries.
 */
export class GenericRDBMSOperations{
    constructor(){

    }

    async executeSQL(connectionName, query, params) {
        if (!connectionName) {
            throw ("connectionName is mandatory")
        }
        try {
            return await getConnection(connectionName).query(query, params);
        }
        catch (err) {
            throw err;
        }
    }
}