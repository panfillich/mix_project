const crypto = require('crypto');
const CONFIG = require('../../config.js').security;

class Security{
    static _createHash(string, secret){
        return crypto.createHmac(CONFIG.hash.type, secret).update(string).digest('hex');
    }

    static _convertDateToString(date){
        return date.valueOf().toString();
    }

    static _createToken(lenght = CONFIG.token.length){
        return crypto.randomBytes(lenght).toString('hex');
    }

    static createHashForPassword(string){
        return Security._createHash(string, CONFIG.secret.password);;
    }

    static checkPassword(string, date){
        date = Security._convertDateToString(date);
        const hash = Security._createHash(date + string, CONFIG.secret.password);
        return Security.hash === hash;
    }

    static createSession(string, date = new Date()){
        date = token._convertDateToString(date);
        const token = Security._createToken();
        const hash  = Security._createHash(date + token + string, CONFIG.secret.session);
        return {
            token: token, // for client
            hash: hash,   // for redis session
            date: date
        }
    }

    static getSessionHash(string, date, token){
        date = Security._convertDateToString(date);
        return Security._createHash(date + token + string, CONFIG.secret.session);
    }
}

module.exports = Security;
