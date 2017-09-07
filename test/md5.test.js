const assert = require('assert');
const cryptoUtil = require('../core/libary/cryptoUtil')();

it("md5 test", (done)=>{
    assert.equal(cryptoUtil.md5(123), '202cb962ac59075b964b07152d234b70')
    done()
})