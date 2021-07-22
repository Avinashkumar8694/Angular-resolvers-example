import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { resolve } from 'path';

let FileOutServiceInstance: FileOutService = null;

export class FileOutService {
    private constructor() { }

    static getInstance(): FileOutService {
        if (!FileOutServiceInstance) {
            FileOutServiceInstance = new FileOutService();
        }
        return FileOutServiceInstance;
    }

    /**
 * 
 * @param fileInOptions {
 *      path: path to the file to write
 *      payload: buffer to be written
 *      encoding: encoding of the buffer
 *      appendNewLine: append EOL at the end of buffer
 *      overwriteFile: if file already present, overwrite it
 *      createDir: if directory not present in the path, create it
 * }
 * 
 * all encodings supported by iconv-lite:
 * https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
 */
    fileOut(fileInOptions: {
        filepath: string,
        payload,
        encoding?: string
        appendNewline?: boolean,
        overwriteFile?: boolean,
        createDir?: boolean,
        isStreaming?: boolean
    }) {
        return new Promise((resolve, reject) => {
            if (!fileInOptions.filepath) {
                return reject(new Error('File name for file out options'))
            }
            let filepath = fileInOptions.filepath;
            if (fileInOptions.overwriteFile && fs.existsSync(filepath)) {
                let sdbInstance = this;
                fs.unlink(filepath, function (err) {
                    if (err) {
                        return reject(err);
                    } else {
                        sdbInstance.uploadFilePayload(fileInOptions, resolve, reject);
                    }
                });
            } else {
                this.uploadFilePayload(fileInOptions, resolve, reject);
            }
        })
    }

    private async uploadFilePayload(fileInOptions: {
        filepath: string,
        payload,
        encoding?: string
        appendNewline?: boolean,
        overwriteFile?: boolean,
        createDir?: boolean,
        isStreaming?: boolean
    }, resolve, reject) {
        let filepath = fileInOptions.filepath;
        if (fileInOptions.payload) {
            var dir = path.dirname(filepath);
            if (fileInOptions.createDir) {
                try {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                } catch (err) {
                    return reject(err);
                }
            }

            if (fileInOptions.isStreaming) {
                if (fileInOptions.overwriteFile) {
                    await this.createWriteStream(fileInOptions, { flags: 'w', autoClose: true })
                    return resolve();
                } else {
                    await this.createWriteStream(fileInOptions, { flags: 'a', autoClose: true })
                    return resolve();
                }
            } else {
                var data = fileInOptions.payload;
                if ((typeof data === "object") && (!Buffer.isBuffer(data))) {
                    data = JSON.stringify(data);
                }
                if (typeof data === "boolean") { data = data.toString(); }
                if (typeof data === "number") { data = data.toString(); }
                if ((fileInOptions.appendNewline) && (!Buffer.isBuffer(data))) { data += os.EOL; }

                if (fileInOptions.encoding) {
                    data = this.encode(data, fileInOptions.encoding);
                }
                if (fileInOptions.overwriteFile) {
                    var wstream = fs.createWriteStream(filepath, { encoding: 'binary', flags: 'w', autoClose: true });
                    wstream.on("error", function (err) {
                        return reject(err);
                    });
                    wstream.on("open", function () {
                        wstream.end(fileInOptions.payload, function () {
                            return resolve();
                        });
                    })
                } else {
                    fs.open(fileInOptions.filepath, 'a', (err, fd) => {
                        if (err) throw err;
                        fs.appendFile(fd, data, (err) => {
                            fs.close(fd, (err) => {
                                if (err) {
                                    return reject(err);
                                }
                                return resolve();
                            });
                            if (err) {
                                return reject(err);
                            }
                        });
                    });
                }
            }
        }
    }

    createWriteStream(fileInOptions, options) {
        return new Promise((resolve, reject) => {
            var wstream = fs.createWriteStream(fileInOptions.filepath, options);
            if (fileInOptions.encoding) {
                let str = '';
                fileInOptions.payload.on('data', (data) => {
                    str += this.encode(data, fileInOptions.encoding);
                });
                wstream.on("open", function () {
                    wstream.end(str, function () {
                        // console.log('writting' + str);
                        return resolve();
                    });
                });
            } else {
                fileInOptions.payload.pipe(wstream);
                fileInOptions.payload.on('end', function () {
                    return resolve('file write');
                });
            }
            wstream.on("error", function (err) {
                return reject(err);
            });
        });
    }

    encode(data, enc) {
        if (enc !== "none") {
            return iconv.encode(data, enc);
        }
        return Buffer.from(data);
    }

}
