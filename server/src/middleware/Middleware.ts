export class Middleware{
    serviceName: string;
    functionDef: any;
    middlewareName: string;

    constructor(serviceName, middlewareName, functionDef){
        this.serviceName = serviceName;
        this.functionDef = functionDef;
        this.middlewareName = middlewareName;
    }
}