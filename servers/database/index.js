const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const schemas = require('./schema');
const setAssociations = require('./association');

const CONFIG = require('../config.js');
const MODE = process.env.NODE_ENV;
const DATABASE_CONFIG = CONFIG.env[MODE].database;

let logger = require('../common_libs/logger');

class Database{
    async connect(){
        this._createConnectOnly();
        await this._testConnect();
        this._setModels();
        this._setAssociation();
        return this.sequelize;
    }

    getConnect(){
        return this.sequelize;
    }

    _createConnectOnly(){
        this.sequelize = new Sequelize(DATABASE_CONFIG.database, DATABASE_CONFIG.user, DATABASE_CONFIG.password, {
            host: DATABASE_CONFIG.host,
            dialect: 'mysql',
            operatorsAliases: Op, // use Sequelize.Op
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            logging: (msg) => logger.info(msg)
        });
        return this.sequelize;
    }

    async _testConnect(){
        try {
            await this.sequelize.authenticate()
        } catch(err) {
            logger.log('error', 'Unable to connect to the mysql database');
            throw err;
        }
        logger.log('info', 'Connection to the mysql database ('+DATABASE_CONFIG.database+') has been established successfully.');
    }

    _setModels(){
        schemas.forEach(schema => {
            this.sequelize.define(...schema);
        });
    }

    _setAssociation(){
        setAssociations(this.sequelize);
    }

    async createTables(){
        try {
            await this.sequelize.sync();
        } catch(err) {
            logger.log('error', 'Table wasn\'t created.');
            throw err;
        }
        logger.log('info', 'All tables created');
    }

    async removeTables(){
        try {
            await this.sequelize.drop();
        } catch(err) {
            logger.log('error', 'Table wasn\'t deleted.');
            throw err;
        }
        logger.log('info', 'All tables deleted');
    }

    async refreshTables(){
        try {
            await this.sequelize.sync({force: true});
        } catch(err) {
            logger.log('error','Tables wasn\'t deleted or created.');
            throw err;
        }
        logger.log('info', 'All tables were refreshed');
    }

    createTestData(){

    }

    refreshTestData(){

    }

    fullRefresh(){

    }
}

module.exports = new Database();
