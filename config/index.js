const branch = process.env['branch'];

switch(branch){
    // case 'develop': module.exports = require('./config.dev');break;
    // case 'master': module.exports = require('./config.pro');break;
    default: module.exports = require('./config.localhost');break;
}
