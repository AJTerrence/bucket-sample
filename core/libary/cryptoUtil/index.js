const crypto = require('crypto');
module.exports = app => {

    const md5 = str => crypto.createHash('md5').update(String(str), 'utf8').digest('hex');

    return {
        md5,
    }

}