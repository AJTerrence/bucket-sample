const mqtt = require('mqtt');
module.exports = app =>{
    const init = ({onConnect})=>{
        const logger = app.libary.logger;
        const mqttConfig = app.config.mqtt;
        const client  = mqtt.connect(`mqtt://${mqttConfig.host}:${mqttConfig.port}`, mqttConfig.option);
        const Router = require('./router')

        // 包装client的方法
        const subscribe = async(topic, qos = 0)=>{
            try{
                return await new Promise((resolve, reject)=>{
                    client.subscribe(topic, {qos}, (error, granted)=>{
                        if(error){
                            reject(error);
                            return;
                        }
                        // 判断订阅成功与否
                        if(granted.length ===1 && (typeof topic === 'string' || topic.length === 1)){
                            logger.info('[mqtt] subscribe success, ', 'topic:', topic, 'result:', granted);
                        }else if(granted.length > 1 && granted.length === topic.length){
                            logger.info('[mqtt] subscribe result', granted);
                            granted.forEach(item=>{
                                if([0,1,2].includes(item.qos)){
                                    logger.info('[mqtt] subscribe success, ', 'topic:', item.topic, 'qos:', item.qos);
                                }else{
                                    logger.warn('[mqtt] subscribe fail, ', 'topic:', item.topic, 'qos:', item.qos);
                                }
                            })
                        }else{
                            logger.warn('[mqtt] subscribe fail, ', 'topic:', topic, 'result:', granted);
                        }
                        resolve(granted);
                    })
                })
            }catch(err){
                logger.error('[mqtt] subscribe error: ', err);
            }
        }

        const unsubscribe = async(topic)=>{
            try{
                return await new Promise((resolve, reject)=>{
                    client.unsubscribe(topic, (error)=>{
                        if(error){
                            reject(error);
                            return;
                        }
                        logger.info('[mqtt] unsubscribe ', topic);
                        resolve();
                    })
                })
            }catch(err){
                logger.error('[mqtt] unsubscribe error: ', err);
            }
        }

        const publish = async(topic,message,qos = 0)=>{
            try{
                return await new Promise((resolve, reject)=>{
                    client.publish(topic, message, {qos}, (error)=>{
                        if(error){
                            reject(error);
                            return;
                        }
                        logger.info('[mqtt] publish success', topic);
                        resolve();
                    })
                })
            }catch(err){
                logger.error('[mqtt] publish error:', err);
            }
        }

        const end = async(force = false) => {
            try{
                return await new Promise((resolve, reject)=>{
                    logger.info('[mqtt] end ...');          
                    client.end(force, resolve)
                })
            }catch(err){
                logger.error('[mqtt] end error:', err);
            }
        }

        client.on('connect', function () {
            logger.info('mqtt connected')
            if(onConnect){
                onConnect(client);
            }
        })

        client.on('close', ()=>{
            logger.warn('mqtt closed')
        })

        client.on('reconnect', ()=>{
            logger.info('mqtt try to reconnect')
        })

        client.on('message',  Router(app).onMesssage)

        client.on('error', (err)=>{
            logger.error('mqtt error', err)
        })

        return {
            Router,
            publish,
            subscribe,
            unsubscribe,
            end
        }
    }

    return init;
}