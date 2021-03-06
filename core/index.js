const debug = require('debug')('app:core');
const path = require('path');
const fs = require('fs');
const processHandler = require('./processHandler');

module.exports = (option) => {
    let { rootPath, appPath, callback } = Object.assign({}, option);
    const corePath = __dirname;
    if(!rootPath){
        rootPath = path.join(corePath, '../')
    }
    if(!appPath){
        appPath = path.join(rootPath, './app')
    }
    const config = require(path.join(rootPath, './config'))

    const app = {
        config,
        path : {
            core : corePath,
            root : rootPath,
            app  : appPath,
        }
    };

    const loadComponent = (app, obj, componentPath, flag=false)=>{
        return new Promise((resolve, reject)=>{
            fs.readdir(componentPath, function (err, files) {
                if(err)
                    reject(err);
                Promise.all(files.map(async(file)=>{
                    const f = path.join(componentPath, file)
                    const name = path.posix.basename(file).split('.', 1)[0];
                    if(flag)
                        obj[name] = new (require(f)(app))();
                    else
                        obj[name] = require(f)(app);
                    debug(`require ${f}, done`);                    
                })).then(resolve).catch(reject);
            });
        });

    }

    // load framework
     (async ()=>{
        debug('init ...')
        // load first
        await loadComponent(app, app.libary={}, path.join(corePath, './libary')).catch(error=>{
            debug('catch error', error);
            process.abort(); // 加载libary时发生致命错误，die
        });
        processHandler(app);
        await Promise.all([
            loadComponent(app, app.model={}, path.join(appPath, './model')),
            loadComponent(app, app.service={}, path.join(appPath, './service')),
            loadComponent(app, app.middleware={}, path.join(appPath, './middleware')),
            loadComponent(app, app.controller={}, path.join(appPath, './controller')),
        ])
        debug('init completed')

        if(callback)
            callback(app);
     
     })();
     
}

