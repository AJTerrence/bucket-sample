module.exports = (app)=>{

    class AuthService {
        constructor(){
        }

        async checkAuth(Authorization){
            app.libary.logger.debug('Authorization:', Authorization)
            return Authorization === 'DHTJDR74765856J657BQ3B5B36';
        }

    }

    return new AuthService();
}