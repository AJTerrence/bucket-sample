const log4js = require('log4js'); // include log4js
const path = require('path')
const chalk = require('chalk');
const debug = require('debug')('app');

module.exports = app =>{
    const option = Object.assign({
        type: 'file',
        filename: path.join(app.path.root, './log/app.log'), // specify the path where u want logs folder error.log
        absolute: true, // use absolute file path
        pattern: ".yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        category: 'log',
        maxLogSize: 2048000, //2KB
        backups: 1000
    }, app.config.logger)
    
    /**
     * @description Then initial logging would create a file called "debug.log".
     *              At midnight, the current "blah.log" file would be renamed to "debug.log-2012-09-26" (for example), and a new "debug.log" file created.
     */
    log4js.configure({ // configure to use all types in different files.
        appenders: [
            option,
        ]
    });
    const logger = log4js.getLogger('log'); // initialize the var to use.
    // logger.trace('Entering cheese testing');
    //
    // logger.debug('Got cheese.');
    //
    // logger.info('Cheese is Gouda.');
    //
    // logger.warn('Cheese is quite smelly.');
    //
    // logger.error('Cheese %s is too ripe!', "gouda");
    //
    // logger.fatal('Cheese was breeding ground for listeria.');

    const getDateFormate = (timeStamp) => {
        const addZero = (num) => {
            return num < 10 ? `0${num}` : num
        }
        let d = timeStamp ? new Date(timeStamp) : new Date()
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let date = d.getDate()
        let hour = addZero(d.getHours())
        let minute = addZero(d.getMinutes())
        let second = addZero(d.getSeconds())
        let ms = d.getMilliseconds()
        return `${year}-${month}-${date} ${hour}:${minute}:${second}:${ms}`
    }

    const toString = (...param) => {
        return param.map(ele=>{ return typeof ele === 'object' ? JSON.stringify(ele) : ele })
    }

    const isDev = app.config.evn === 'development' ? true : false ;

    const loggerWrapper = {
        info : (...param)=>{
            param = toString(...param)
            logger.info(...param)
            debug(chalk.green('[info]', getDateFormate() , ...param))
        },
        error : (...param)=>{
            logger.error(...param)
            debug(chalk.red('[error]', getDateFormate()), ...param)
            
        },
        warn : (...param)=>{
            param = toString(...param)
            logger.warn(...param)
            debug(chalk.yellow('[warn]', getDateFormate() , ...param))
            
        },
        debug : (...param)=>{
            param = toString(...param)
            logger.debug(...param)
            debug(chalk.blue('[debug]', getDateFormate() ,...param))

        },
        trace : (...param)=>{
            param = toString(...param)
            logger.trace(...param)
            debug(chalk.yellow('[trace]', getDateFormate() ,...param))
        },
    }

    return loggerWrapper;
}