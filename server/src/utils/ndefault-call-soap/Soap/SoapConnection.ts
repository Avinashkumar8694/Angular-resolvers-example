import * as soap from 'strong-soap';
export class SoapConnection {
    private static instance;
    connectionsObj = {};
    private constructor() {
    }
    static async getInstance(configId, soapConfigObj, wsdlFilePath, options, authType = undefined, basicAuth = {username: '', password: ''}, token = '') {
        return new Promise((resolve, reject) => {
            if (!configId) {
                return reject('Config id missing');
            }
            let url;
            // let filePath = `../../../../configFiles/soap-config/${configId}/wsdlFiles/${wsdlFilePath}`
            let filePath = `configFiles/soap-config/${configId}/wsdlFiles/${wsdlFilePath}`
            if (soapConfigObj.useurl) {
                url = soapConfigObj.wsdlUrl
            } else {
                url = filePath;
            }
            /**Create Instance if not created already */
            if (!SoapConnection.instance) {
                SoapConnection.instance = new SoapConnection();
            }
            if (SoapConnection.instance.connectionsObj && SoapConnection.instance.connectionsObj.hasOwnProperty(configId)) {
                return resolve(SoapConnection.instance.connectionsObj[configId]);
            } else {
                soap.soap.createClient(url, {}, (err, client) => {
                    if (authType && authType == 'basic') {
                        client.setSecurity(new soap.BasicAuthSecurity(basicAuth.username, basicAuth.password));
                    } else if (authType && authType == 'token'){
                        client.setSecurity(new soap.BearerSecurity(token));
                    }
                    this.instance.connectionsObj[configId] = client;
                    return resolve(this.instance.connectionsObj[configId]);
                });
            }
        });
    }
}