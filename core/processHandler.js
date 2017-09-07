module.exports = (app)=>{
    const logger = app.libary.logger;
    app.beforeExit = [];
    // error handler
    process.on("unhandledRejection", (reason, promise)=>{
        logger.error('[Process] catch event unhandledRejection, reason is ',reason, ' promise is ', promise);
    });
    process.on("uncaughtException", (error)=>{
        logger.error('[Process] catch event uncaughtException, error is ',error);
        process.abort();
    });
    process.on('warning', (warning)=>{
        logger.warn('[Process] catch event warning, warning is ',warning);
    });
    let signalFlag = false;
    process.on('SIGINT', () => {
        if(signalFlag)
            return;
        signalFlag = true;
        logger.warn('[Process] Received SIGINT');
        setTimeout(process.exit, 1000); // exit in max time
        Promise.all(app.beforeExit.filter(item => typeof item === 'function').map(async item => await item())).then(()=>{
            logger.warn('[Process] exit');      
            process.exit();
        });
    });
    const processLog = ()=>{
        let cpuBeforeUsage = process.cpuUsage();
        setTimeout(()=>{
            let cpuAfterUsage = process.cpuUsage();
            let userUsage = ((cpuAfterUsage.user - cpuBeforeUsage.user) / 1000000 / 60).toFixed(6) + '%';
            let systemUsage = ((cpuAfterUsage.system - cpuBeforeUsage.system) / 1000000 / 60).toFixed(6) + '%';
            let memoryUsage = process.memoryUsage();
            let rss = (memoryUsage.rss / 1024 / 1024).toFixed(2) + 'MB';
            logger.debug(`[Process] pid=${process.pid} , Usage, cpu:(userUsage:${userUsage}, systemUsage:${systemUsage}), memory:(rss: ${rss}), param:`,cpuAfterUsage, memoryUsage);        
            cpuBeforeUsage = cpuAfterUsage;
        }, 60000);
    }
    processLog();
    setInterval(processLog, 60000);

}