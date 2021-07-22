import * as xml2js from 'xml2js';
let XMLServiceInstance = null;
export class XMLService {
    constructor() {}

    static getInstance(): XMLService {
        if (!XMLServiceInstance) {
            XMLServiceInstance = new XMLService();
        }
        return XMLServiceInstance;
    }

    xml(value, parserOptions, attrkey, charkey) {
        return new Promise((resolve, reject) => {
            try {
                let parseString = xml2js.parseString;
                if (value !== undefined) {
                    var options;
                    if (typeof value === "object") {
                        options = { renderOpts: { pretty: false } };
                        if (parserOptions && typeof parserOptions === "object") { options = parserOptions; }
                        options.async = false;
                        var builder = new xml2js.Builder(options);
                        value = builder.buildObject(value, options);
                        return resolve(value);
                    }
                    else if (typeof value == "string") {
                        options = {};
                        if (parserOptions && typeof parserOptions === "object") { options = parserOptions; }
                        options.async = true;
                        options.attrkey = attrkey || options.attrkey || '$';
                        options.charkey = charkey || options.charkey || '_';
                        parseString(value, options, function (err, result) {
                            if (err) { return reject(err) }
                            else {
                                return resolve(result);
                            }
                        });
                    }
                }
                else {
                    return reject(new Error("XML Parser :: value cannot undefined"));
                }
            }
            catch (err) {
                return reject(err);
            }
        });
    }

}