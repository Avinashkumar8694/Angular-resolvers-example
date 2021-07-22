export class Utility {
  
    constructor() { }
  
    generateUUID() {
      return this.__s4() + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + this.__s4() + this.__s4();
    }
  
    __s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
  }