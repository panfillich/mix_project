let logger = require('./servers/common_libs/logger');
global.Promise = require('bluebird');
// Promise.longStackTraces();
global.Promise.longStackTraces();


let srv_error = require('./servers/common_libs/error');
let ServerError = srv_error.ServerError;

let database = require('./servers/database');
let models = require('./servers/models');
let Users = models.Users;

const CONST_ACTIONS = {
    TABLES_CREATE:      'TABLES-CREATE',
    TABLES_REFRESH:     'TABLES-REFRESH',
    TESTDATA_REFRESH:   'TESTDATA-REFRESH'
};

async function startActions(){
    try {
        await database.connect();
        await database.refreshTables();
        Users.setDatabase(database.getConnect());
        let res = await Users.createNewUser({
            email: 'test1@gmail.com',
            password: 'Qwerty123!',
            login: 'user_test_1'
        });

        await Users.createNewUser({
            email: 'test1@gmail.com',
            password: 'Qwerty123!',
            login: 'usertest1'
        });

        // Promise.reject(new Error("err"));

        const ACTION = process.argv[2];
        if (ACTION === undefined){
            throw new ServerError("Action isn't set");
        }

        const ALL_ACTIONS = Object.values(CONST_ACTIONS);

        if(ALL_ACTIONS.indexOf(ACTION) === -1){
            throw new ServerError('Unknown action. Action = ' + ACTION + '');
        }


        /*await database.connect();
        await database.refreshTables();

        Users.setDatabase(database.getConnect());
        let res = await Users.createNewUser({
            email: 'test1@gmail.com',
            password: 'Qwerty123!',
            login: 'user_test_1'
        });

        logger.info('Finish');*/
    } catch (error){
        // srv_error.trace(error, new ServerError('Action not finished'));
        // logger.error(srv_error.getShortStack(error));

        logger.error(error);
    } finally {
        process.exit(0);
    }
}

logger.info('Srart');
startActions();

