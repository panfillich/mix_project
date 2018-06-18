let client = require('../redis/client');
let Token = require('../common_libs/token');

const TOKEN_PREFIX  = 'token';
const USER_PREFIX = 'user';
const LIFETIME = 600;

class SessionInterface{
    constructor(params, Sessions){
        this._Sessions = Sessions;
        this._params = {};
        for(const param_name in params){
            this._params[param_name] = params[param_name];
        }
    }

    get(param){
        if(this._params[param]) {
            return this._params[param];
        }
        return '';
    }

    getAll(){
        return this._params;
    }

    set(params, callback) {
        this._Sessions.setParamsInSession(this._params.userId, this._params.token, params, function (err) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, true);
            }
        });
    }

    del(params, callback) {

    }
}

class Sessions{
    switchToRedis(client){
        if(client){
            this.client = client;
            return true;
        }
        return false;
    }

    createNewSession(param, callback){
        let token = Token.createForUser(param.email);

        // создаем сессию-токен
        this._createTokenSession(token.hash, param.userId, (err) => {
            if(err){
                callback(err, null);
            } else {
                // после создания токена проверяем сессию пользователя
                this.checkUserSession(param.userId, (err, result) => {
                    if (err) {
                        callback(err, null);
                    } else if (result) {
                        // используем готовый user:id (только поменяем ему token, а старый удалим)
                        this._chandeTokenInUserSession(param.userId, token.hash, function (err) {
                            if(err){
                                callback(err, null);
                            } else {
                                callback(null, token);
                            }
                        });
                    } else {
                        // создаем новый user:id
                        this._createUserSession(param, token.hash, function (err) {
                            if(err){
                                callback(err, null);
                            } else {
                                callback(null, token);
                            }
                        });
                    }
                });
            }
        });
    }


    // Создаем сессию-токен token:[token]
    _createTokenSession(token_hash, userId, callback){
        let client = this.client;
        const KEY = [TOKEN_PREFIX, token_hash].join(':');
        client.multi([
            ['set', KEY, userId],//
            ['expire', KEY, LIFETIME]//
        ]).exec(function (err, res) {
            if (err) {
                callback(err);
            } else if (res[0]!='OK'){
                callback(new Error("Error in RAM: can't create token session"));
            } else {
                callback(null);
            }
        });
    }

    // Создаем пользовательскую сессию user:[id]
    _createUserSession(param, token_hash, callback){
        let client = this.client;
        const KEY = [USER_PREFIX, param.userId].join(':');

        let hmset = ['hmset', KEY, 'token', token_hash];
        for (let key in param) {
            hmset.push(key);
            hmset.push(param[key]);
        }
        client.multi([
            hmset,
            ['expire', KEY, LIFETIME]//
        ]).exec(function (err, res) {
            if (err) {
                callback(err);
            } else if (res[0]!='OK'){
                callback(new Error("Error in RAM: can't create user session"));
            } else {
                callback(null)
            }
        });
    }

    // Заменяем токен в пользовательской сессии а старый токен удаляем
    _chandeTokenInUserSession(userId, token_hash, callback){
        let client = this.client;
        const USER_KEY = [USER_PREFIX, userId].join(':');

        client.hget(USER_KEY, 'token', function (err, res) {
            if (err) {
                callback(err);
            } else if (!res) {
                callback(new Error("Error in RAM: can't change token in user session"));
            } else {
                const OLD_TOKEN_KEY = [TOKEN_PREFIX, res].join(':');
                client.del(OLD_TOKEN_KEY);
                client.hset(USER_KEY, 'token', token_hash);
                callback(null);
            }
        });
    }

    // Проверям существует ли ключ user:id, если существует то добавляем ему время жизни
    checkUserSession(userId, callback){
        let client = this.client;
        const KEY = [USER_PREFIX, userId].join(':');

        client.expire(KEY, LIFETIME, function (err, res) {
            if(err){
                callback(err, false);
            } else if (res){
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    }

    // Получить всю сессию
    getSession(token_hash, callback){
        let client = this.client;
        const TOKEN_KEY = [TOKEN_PREFIX, token_hash].join(':');
        client.multi([
            ['get', TOKEN_KEY],
            ['expire', TOKEN_KEY, LIFETIME]
        ]).exec(function (err, res) {
            if (err) {
                callback(err, null)
            } else if(res[0]){
                const USER_ID = res[0];
                const USER_KEY = [USER_PREFIX, USER_ID].join(':');
                client.multi([
                    ['hgetall', USER_KEY],
                    ['expire',  USER_KEY, LIFETIME]
                ]).exec(function (err, res) {
                    if (err) {
                        callback(err, null);
                    }
                    callback(null, res[0]);
                });
            } else {
                callback(null, null);
            }
        });
    }

    // Получить сессию стороннего пользователя, если он онлайн
    getSessionById(userId, callback){
        let client = this.client;
        const USER_KEY = [USER_PREFIX, userId].join(':');
        client.hgetall(USER_KEY, function (err, res) {
            if (err) {
                callback(err, null);
            }
            callback(null, res);
        });
    }

    // Установить параметры в сессию
    setParamsInSession(userId, token_hash, params, callback){
        let client = this.client;
        const USER_KEY = [USER_PREFIX, userId].join(':');
        const TOKEN_KEY = [TOKEN_PREFIX, token_hash].join(':');
        let hmset = ['hmset', USER_KEY];

        for (let param_name in params) {
            if(['userId','token'].indexOf(param_name) == -1) {
                hmset.push(param_name);
                hmset.push(params[param_name]);
            }
        }
        client.multi([
            hmset,
            ['expire', USER_KEY, LIFETIME],
            ['expire', TOKEN_KEY, LIFETIME]
        ]).exec(function (err, res) {
            if (err) {
                callback(err, null);
            } else if (res[0] != 'OK') {
                if(callback) {
                    callback(new Error("Error in RAM: can't set new params session"), null);
                }
            } else {
                if(callback) {
                    callback(null, true);
                }
            }
        });
    }

    // Создать класс для удобной работы с сессией,
    // чтобы при работе с ними нам не нужно знать hash токена и id пользователя
    createSessionInterface(params){
        return new SessionInterface(params, this);
    }
}

module.exports = Sessions;