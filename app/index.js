module.exports = (app)=>{
    // 加载http服务
    const httpRouter = require('./httpRouter')(app);

    // 加载mqtt服务
    const mqtt = app.libary.mqtt({
        onConnect : (handler)=>{
            require('./mqttSubscribe')(app, handler) // 连接后订阅设备的主题
        }
    });
    app.mqtt = mqtt; // app对象挂载mqtt句柄
    require('./mqttRouter')(app, mqtt.Router(app)); //加载mqtt的路由

    // 注册process.exit前事件，使已经接受的业务逻辑的数据处理完毕，再退出进程
    app.beforeExit.push(async()=>{
        await httpRouter.serverClose(); // 先停掉http
        setTimeout(mqtt.end, 400);      // 再停掉mqtt
        await new Promise(resolve=>setTimeout(resolve, 800)); // 延时等待数据库操作等处理完毕
    })
}