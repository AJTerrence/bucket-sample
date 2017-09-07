module.exports = app =>{

    class ExampleController extends app.libary.controller {
        // mqtt router
        async index(){
            const {message, params} = this.ctx;
            app.service.example.foo(params.id, message.toString());
            throw('test error handle')
        }

        // http router.post('/example/:id', ...middleware) 
        async post(){
            const {ctx} = this;
            const {id} = ctx.params;
            const body = ctx.request.body;
            // handle something, then
            ctx.status = 201;
            ctx.body = {
                    message : "ok"
            }
        }
    }

    return ExampleController;
}