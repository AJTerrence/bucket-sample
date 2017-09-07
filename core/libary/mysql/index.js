module.exports = app =>{
    const mysql = require('./mysql')(app);
    const mysqlConfig = Object.assign({}, app.config.mysql);

    class db{
        constructor(){
            this.db = {};
        }

        get(db='default'){
            if(!this.db.hasOwnProperty(db))
                this.db[db] = new mysql(mysqlConfig[db]);
            return this.db[db];
        }

    };

    return new db();
}