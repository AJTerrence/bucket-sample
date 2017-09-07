module.exports = (app)=>{
    const router = app.libary.httpRouter();

    /*
    @usage

    router.get(uri, ...middleware)
    router.post(uri, ...middleware)
    router.put(uri, ...middleware)
    router.del(uri, ...middleware)
    
    middleware = [
        async function(ctx, next){...},
        app.middleware.example,
        'example.index', // controller and action
    ]
    
    */

    return router;
}
