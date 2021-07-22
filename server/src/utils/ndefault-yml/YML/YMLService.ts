import * as yaml from 'js-yaml';

let YMLServiceInstance = null;
export class YMLService {
    private constructor() {}

    static getInstance(): YMLService {
        if (!YMLServiceInstance) {
            YMLServiceInstance = new YMLService();
        }
        return YMLServiceInstance;
    }
    
    yml(payload) {
        return new Promise((resolve, reject) => {
            if (payload !== undefined) {
                if (typeof payload === "string") {
                    try {
                        payload = yaml.load(payload);
                        return resolve(payload);
                    }
                    catch (e) {
                        return reject(e);
                    }
                }
                else if (typeof payload === "object") {
                    if (!Buffer.isBuffer(payload)) {
                        try {
                            payload = yaml.dump(payload);
                            return resolve(payload);
                        }
                        catch (e) {
                            return reject(e);
                        }
                    }
                    else {
                        return reject(new Error('Invalid YAML object'));
                    }
                }
                else {
                    return reject(new Error('YAML convertor takes either a valid YAML string to convert to JSON or a JSON to convert to YAML'));
                }
            } else {
                return reject(new Error('Invalid arguments'));
            }
        })
    }
}