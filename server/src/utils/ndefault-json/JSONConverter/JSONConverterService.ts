let JSONServiceInstance = null;

export class JSONConverterService {
    private constructor() {

    }

    static getInstance(): JSONConverterService {
        if (!JSONServiceInstance) {
            JSONServiceInstance = new JSONConverterService();
        }
        return JSONServiceInstance;
    }

    json(payload) {
        return new Promise((resolve, reject) => {
            if (payload !== undefined) {
                if (typeof payload === 'string') {
                    try {
                        payload = JSON.parse(payload);
                        return resolve(payload);
                    } catch (error) {
                        return reject(error);
                    }
                } else if (typeof payload === 'object') {
                    try {
                        payload = JSON.stringify(payload);
                        return resolve(payload);
                    } catch (error) {
                        return reject(error);
                    }
                } else {
                    return reject(new Error('Invalid Arguments. JSON convertor takes either a valid JSON object or stringified JSON'));
                }
            } else {
                return reject(new Error('Invalid arguments'));
            }
        });
    }
}