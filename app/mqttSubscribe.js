module.exports = (app, mqtt)=>{

    (async()=>{
        await Promise.all([
            mqtt.subscribe('/example'),
        ]);
    })().catch(app.libary.error);


}