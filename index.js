const fs = require('fs');
const hexvector = require('hexvector');

const crypto = require('crypto');
const algorithm = 'aes-256-ctr'


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
const lock2 = (input, output, offset) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(input);
        let writeStream = fs.createWriteStream(output);
        let ended = false;
        readStream.on('data', chunk => {
            let pendingArray = [];
            for (const value of chunk.values()) {
                pendingArray.push(value + offset);
                if (typeof value != 'number') {
                    console.log('Not a number');
                }
            }
            let chunkBuffer = Buffer.from(pendingArray);
            // console.log('chunkBuffer', chunkBuffer)
            writeStream.write(chunkBuffer, error => {
                if (error) {
                    console.error('Oh no! ', error);
                }
                if (ended == true) {
                    writeStream.end();
                    resolve({ success: true });
                }
            })
        });

        // Read has ended but don't return yet because write might not be done
        readStream.on('end', () => {
            ended = true;
        });
        // Reject immediately on error
        readStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        })
        // Reject immediately on error
        writeStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        });
    })
}
const unlock2 = (input, output, offset) => {
    return new Promise((resolve, reject) => {
        let readStream = fs.createReadStream(input);
        let writeStream = fs.createWriteStream(output);
        let ended = false;
        readStream.on('data', chunk => {
            let pendingArray = [];
            for (const value of chunk.values()) {
                pendingArray.push(value - offset);
                if (typeof value != 'number') {
                    console.log('Not a number');
                }
            }
            let chunkBuffer = Buffer.from(pendingArray);
            writeStream.write(chunkBuffer, error => {
                if (error) {
                    console.error('Oh no! ', error);
                }
                if (ended == true) {
                    writeStream.end();
                    resolve({ success: true });
                }
            })
        });

        // Read has ended but don't return yet because write might not be done
        readStream.on('end', () => {
            ended = true;

        });
        // Reject immediately on error
        readStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        })

        // Reject immediately on error
        writeStream.on('error', () => {
            writeStream.end();
            reject({ success: false });
        });
    })
}
const expandSecret = secret => {
    let i = 0;
    let newSecret = '';
    while (i < 32) {
        newSecret = newSecret + secret;
        i++
    }
    return newSecret;
}
const encrypt = secret => {
    console.log('Creating using ' + secret);
    // Make sure secret is long enough
    secret = expandSecret(secret);
    let key = crypto.createHash('sha256').update(String(secret)).digest('base64').slice(0, 32);
    let iv = secret.slice(0, 16);
    return crypto.createCipheriv(algorithm, key, iv);
}
const dencrypt = secret => {
    // Make sure secret is long enough
    secret = expandSecret(secret);
    let key = crypto.createHash('sha256').update(String(secret)).digest('base64').slice(0, 32);
    let iv = secret.slice(0, 16);
    return crypto.createDecipheriv(algorithm, key, iv);
}
exports.lock = lock;
exports.lock2 = lock2;
exports.unlock = unlock;
exports.unlock2 = unlock2;
exports.encrypt = encrypt;
exports.dencrypt = dencrypt;
exports.decrypt = dencrypt;
