const security = require('../common_libs/security');
const USER_CONST = require('../database/const/users');
global.Promise = require('bluebird');

let Op = require('sequelize').Op;

class Users{
    //Подключаемся к базе
    setDatabase(db){
        if(db){
            this.db = db;
            this.users = this.db.models.users;
            return true;
        }
        return false;
    }

    // Создаем пользователя
    async createNewUser(params){
        let users = this.users;
        const PASS_HASH = security.createHashForPassword(params.password + params.login);
        let result = await users.create({
            login: params.login,
            email: params.email,
            password: PASS_HASH,
            status: USER_CONST.status.INVITED
        });
        return result;
    }

    // Меняем статус пользователя
    async changeUserStatus(user_id, status){
        let result = null;
        let users = this.users;
        result = await users.update(
            { status: status },
            { where: {
                userId: user_id }
            }
        );
        return result;
    }

    // Для проверки уникальности пользователя
    // Check of user's uniqueness by email and login
    // params = {login:login, email:email}
    async checkUniqueUser(params){
        const users  = this.users;
        const result = await users.findAll({
            where: {[Op.or]: [
                { login: params.login},
                { email: params.email}
            ]},
            attributes: ['login', 'email']
        });

        let check = {
            is_unique: true,
            is_unique_email: true,
            is_unique_login: true
        };

        if(!result){
            return check;
        }

        result.forEach(function (user) {
            let {login, email} = user.dataValues;
            if(login == params.login) check.is_unique_login = false;
            if(email == params.email) check.is_unique_email = false;
        });

        if(!check.is_unique_login || !check.is_unique_email) check.is_unique = false;

        return check;
    }


    // Получаем юзера

    // Меняем статус пользователя



    //Получаем информацию пользователя для авторизации
    //param : [ email, password ]
    /*getAuthInfo(param, callback){
        let users = this.users;

        let pass_hash = Token.createForUserPass(param.password).hash;

        users.findOne({
            attributes: ['userId', 'login', 'email', 'status'],
            where: {
                email: param.email,
                password: pass_hash,
                status: constants.status.ACTIVATED
            }
        }).then(function(project) {
            let result = null;
            if (project){
                result = project.dataValues;
            }
            callback(null, result);
        }).catch(function(error){
            callback(error, null);
        });
    }

    //Cоздаем нового пользователя
    createNewUser(params, callback){
        let users = this.users;

        //Получаем хэш пароля
        let token = Token.createForUserPass(params.password).hash;

        users.create({
            login: params.login,
            email: params.email,
            password: token,
            status: 1//constants.status.INVITED
        }).then(function(project){
            callback(null, project.dataValues);
        }).catch(function(error){
            callback(error, null);
        });
    }

    //Активируем пользователя
    activateUser(user_id, callback){
        let users = this.users;
        users.update(
            {
                status: constants.status.ACTIVATED
            },
            {
                where: {
                    userId: user_id
                }
            }
        ).then(function(project){
            callback(null, project[0] == 1);
        }).catch(function(error){
            callback(null, error);
        });
    }

    // Получаем все емейлы и логины с шагом в n
    getAllEmailAndLogin(offset, limit, callback){
        let users = this.users;
        users.findAll({
            attributes: ['userId', 'login', 'email'],
            limit: limit,
            offset: offset
        }).then(function (result) {
            let final_result = [];
            result.forEach(function (instance) {
                final_result.push(instance.dataValues)
            });
            callback(null, final_result);
        }).catch(function(error){
            callback(null, error);
        });
    }

    // Получить кол-во всех пользователей
    getCountAllUsers(callback){
        let users = this.users;
        users.count()
            .then(function (count) {
                callback(null, count);
            }).catch(function(error){
            callback(error, null);
        });
    }*/
}


module.exports = Users;