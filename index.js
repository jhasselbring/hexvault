const fs = require('fs');
const hexvector = require('hexvector');

const lock = (input, output, offset, cb) => {
    let readStream = fs.createReadStream(input);
    let writeStream = fs.createWriteStream(output);
    let pendingString = '';
    readStream.on('data', chunk => {
        let chunkString = chunk.toString('hex');
        pendingString = '';
        for (var i = 0; i < chunkString.length; i++) {
            let newHex = hexvector.lock(chunkString.charAt(i), offset);
            pendingString = pendingString + newHex;
        }
        let chunkBuffer = Buffer.from(pendingString, 'hex');
        writeStream.write(chunkBuffer, error => {
            if (error) {
                console.error(error);
            }
        })
    });

    readStream.on('end', () => {
        fileReadEnd = true;
        cb();
    });
}
const unlock = (input, output, offset, cb) => {
    let readStream = fs.createReadStream(input);
    let writeStream = fs.createWriteStream(output);
    let pendingString = '';
    readStream.on('data', chunk => {
        let chunkString = chunk.toString('hex');
        pendingString = '';
        for (var i = 0; i < chunkString.length; i++) {
            let newHex = hexvector.unlock(chunkString.charAt(i), offset);
            pendingString = pendingString + newHex;
        }
        let chunkBuffer = Buffer.from(pendingString, 'hex');
        writeStream.write(chunkBuffer, error => {
            if (error) {
                console.error(error);
            }
        })
    });

    readStream.on('end', () => {
        fileReadEnd = true;
        cb();
    });
}

exports.lock = lock;
exports.unlock = unlock;
