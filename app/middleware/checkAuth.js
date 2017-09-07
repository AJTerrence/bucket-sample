// http请求，检验权限
module.exports = app => {
    return async function(ctx, next) {
        let flag = await app.service.auth.checkAuth(ctx.header['authorization']);
        if(!flag){
            ctx.status = 401;
            ctx.body={message:'Unauthorized'};
            return;
        }
        await next();
    };
};
