/*
    简单实现一个router,　目前只支持一个参数，如 `/example/:id/xxx`, 可以获取params.id
*/
module.exports = app => {
    if(!app.mqttRouterMap)
        app.mqttRouterMap = new Map();

    const getUri = (topic)=>{
        const uri = {
            keys : [],
        };
        const name = topic.replace(/:([a-zA-Z_]\w*)/g, ($0,key)=>{
            uri.keys.push(key)
            return '+';
        })
        uri.name = name;
        return uri;
    }

    const controllerWrapper = (controllerAction)=>{
        return async (ctx, next)=>{
            let ctrlAct = controllerAction.split('.');
            if(ctrlAct.length !== 2)
                throw("Usage: router.sub('/example/:id', 'contrller.action')")
            let act = ctrlAct[1];
            let ctrl = new app.controller[ctrlAct[0]](ctx);
            await ctrl[act]()
            await next();
        }
    }

    const middlewareWrapper = (middlewares)=>{
        return middlewares.map((middleware)=>{
            if(typeof middleware === 'function'){
                return middleware;
            }else if(typeof middleware === 'string'){
                return controllerWrapper(middleware)
            }
        });
    }

    const sub = (topic, ...middlewares) => {
        const {name, keys} = getUri(topic);
        middlewares = middlewareWrapper(middlewares);
        app.mqttRouterMap.set(name,  {middlewares, keys});
    }

    const onMesssage = (topic, message)=>{
        let router = null
        let i = -1
        let topicArr = topic.split('/');
        let topicArr2 = null;
        router = app.mqttRouterMap.get(topic);
        const params = {};
        while(!router && i < topicArr.length){
            i++
            topicArr2 = [...topicArr];
            topicArr2[i] = '+';
            router = app.mqttRouterMap.get(topicArr2.join('/'))
        }
        if(router){
            const {middlewares, keys} = router;
            if(i !== -1){
                params[keys[0]] = topicArr[i];
            }
            app.libary.logger.info('[router]', topic, message.length, message)
            
            // 构建洋葱模型
            const ctx = {message, params, topic};
            const stack = [async () => {}];
            [...middlewares].reverse().map((item, index)=>{
                return stack[index + 1] = async()=>{
                    await item(ctx, stack[index])
                }
            }).pop()().then().catch((err)=>{
                app.libary.logger.error(err)
            });
        }else{
            app.libary.logger.error('[router] not found', topic, JSON.stringify(message))
        }
    }

    return {
        sub,
        onMesssage,
    }
}