const Crypto = require('crypto-js');
class AES {
    constructor(key) {
        this.key = key;
    }
    encrypt(content) {
        return Crypto.AES.encrypt(content, this.key).toString();
    }
    decrypt(content) {
        return Crypto.AES.decrypt(content, this.key).toString(Crypto.enc.Utf8);
    }
}
module.exports = AES;