import * as iconv from 'iconv-lite';
import * as fs from 'fs';

let FileInServiceInstance: FileInService = null;

export class FileInService {
    private constructor() {}

    static getInstance(): FileInService {
        if (!FileInServiceInstance) {
            FileInServiceInstance = new FileInService();
        }
        return FileInServiceInstance;
    }

    fileIn(fileOptions: {
        filepath: string,
        format?: string,
        encoding?: string
    }) {
        return new Promise((resolve, reject) => {
            let filepath = fileOptions.filepath;
            let format = fileOptions.format || 'buffer'; // buffer | stream | utf8
            let encoding = fileOptions.encoding || 'none';
            if (!filepath) {
                return reject(new Error('Invalid path given for file out'))
            }

            let lines = Buffer.from([]);

            // format stream will return a stream instance
            if (format == 'stream') {
                return resolve(fs.createReadStream(filepath));
            }

            let rs = fs.createReadStream(filepath)
                .on('readable', function () {
                    let lChunk;
                    while (null !== (lChunk = rs.read())) {
                        lines = Buffer.concat([lines, lChunk]);
                    }
                })
                .on('error', function (err) {
                    return reject(err);
                })
                .on('end', () => {
                    let payload;
                    if (format === "utf8") {
                        payload = this.decode(lines, encoding);
                    }
                    else { payload = lines; }
                    return resolve(payload);
                });
        })
    }

    decode(data, enc) {
        if (enc !== "none") {
            return iconv.decode(data, enc);
        }
        return data.toString();
    }
}
