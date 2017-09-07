const http = require('http');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');

module.exports = app=>{

    const init = (option)=>{

        const config = Object.assign({
            port : 3000,
        }, app.config.http, option);

        const koaApp = new Koa();
        const router = new KoaRouter();
        const koaBody = new KoaBody();

        const errHandler = async (ctx, next)=>{
            try{
                app.libary.logger.info(`[httpRouter] request ${ctx.ip} ${ctx.method} ${ctx.url}`);
                const start = new Date();
                await next();
                const ms = new Date() - start;
                app.libary.logger.info(`[httpRouter] response ${ctx.ip} ${ctx.method} ${ctx.url} status ${ctx.status} +${ms}ms`);
            }catch(err){
                app.libary.logger.error(err);
                ctx.status = 500;
                ctx.body = 'error';
            }
        }

        koaApp
        .use(errHandler)
        .use(router.routes())
        .use(router.allowedMethods());

        const httpServer = http.createServer(koaApp.callback());
        httpServer.listen(config.port);

        const serverClose = async () => {
            return await new Promise((resolve, reject)=>{
                app.libary.logger.info('[httpRouter] close ...');                          
                httpServer.close(resolve);
            });
        }

        const controllerWrapper = (controllerAction)=>{
            return async (ctx, next)=>{
                let ctrlAct = controllerAction.split('.');
                if(ctrlAct.length !== 2)
                    throw("Usage: httpRouter.get('/example/:id', 'contrller.action')")
                let act = ctrlAct[1];
                let ctrl = new app.controller[ctrlAct[0]](ctx);
                await ctrl[act]()
                await next();
            }
        }

        const middlewareWrapper = (middlewares)=>{
            const m = middlewares.map((middleware)=>{
                if(typeof middleware === 'function'){
                    return middleware;
                }else if(typeof middleware === 'string'){
                    return controllerWrapper(middleware)
                }
            });
            m.unshift(koaBody);
            return m;
        }


        const get = (uri, ...middlewares)=>{
            const m = middlewareWrapper(middlewares);
            router.get(uri, ...m);
        }

        const post = (uri, ...middlewares)=>{
            const m = middlewareWrapper(middlewares);
            router.post(uri, ...m);
        }

        const put = (uri, ...middlewares)=>{
            const m = middlewareWrapper(middlewares);
            router.put(uri, ...m);
        }


        const del = (uri, ...middlewares)=>{
            const m = middlewareWrapper(middlewares);
            router.del(uri, ...m);
        }


        return {
            get,
            post,
            put,
            del,
            serverClose,
        };
    }
    
    return init;
}


