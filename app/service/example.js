module.exports = (app)=>{

    class ExampleService {
        constructor(){
        }

        foo(id, message){
            app.libary.logger.debug(id, message)
        }

    }

    return new ExampleService();
}