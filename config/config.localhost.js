module.exports = {
    evn : 'dev', // pro or dev
    mqtt:{
        host : 'test.mosca.io',
        port : '1883',
        option : {
            reconnectPeriod : 1000,
            clean : false, //set to false to receive QoS 1 and 2 messages while offline
            clientId: String(Math.random()),
            username:'123456',
            password:'123456',
        }
    },
    http:{
        port : 6001,
    },
    logger : {},
    mysql : {
        // 单数据库信息配置
        default: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: '',
            // 数据库名
            database: 'yourDB',
            charset: 'utf8',
            //表名前缀
            tablePrefix : '',
            //查询时长限制
            queryTimeOut : 2000,
            connectionLimit : 30,
        },
    }
}