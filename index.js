const fs = require('fs');
const hexvector = require('hexvector');
const lock = (input, output, offset) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(input);
        let writeStream = fs.createWriteStream(output);
        let pendingString = '';
        let ended = false;
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
                    console.error('Oh no! ', error);
                }
                if (ended == true) {
                    writeStream.end();
                }
            })
        });

        // Read has ended but don't return yet because write might not be done
        readStream.on('end', () => {
            ended = true;
            resolve({ success: true });
        });
        // Reject immediately on error
        readStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        })

        writeStream.on('close', () => {
        });
        // Reject immediately on error
        writeStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        });
    })
}
const unlock = (input, output, offset) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(input);
        let writeStream = fs.createWriteStream(output);
        let pendingString = '';
        let ended = false;
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
                if (ended) {
                    writeStream.end();
                    
                }
            })
        });
        readStream.on('end', () => {
            ended = true;
            resolve({ success: true });
        });
        // Reject immediately on error
        readStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        })

        writeStream.on('close', () => {
        });

        // Reject immediately on error
        writeStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        });
    })
}

exports.lock = lock;
exports.unlock = unlock;
