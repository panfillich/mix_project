let redis = require("redis");
let logger = require('../common_libs/logger');
let bluebird = require('bluebird');

const MODE = (process.env.NODE_ENV || 'dev');

console.log(MODE);

const REDIS_CONFIG = require('../config').env[MODE].redis;


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let option = {
    host: REDIS_CONFIG.host,
    port: REDIS_CONFIG.port,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return 0;
    }
    // detect_buffers: true
};

class Redis{
    constructor(){
        this.client = null;
        this.database = REDIS_CONFIG.database;
    }

    async connect(){
        try {
            this.client = redis.createClient(option);
            await this.client.selectAsync(this.database);
            this._setEvents();
            logger.info('Connected to redis (database = '+this.database+')');
        } catch (e){
            logger.error("Problems with redis connection\n" + e.stack);
        }
        return this;
    }

    getClient(){
        return this.client;
    }

    _setEvents(){
        let client = this.client;
        client.on("error", function (err) {
            logger.error("Error " + err);
        });

        client.on("reconnecting", function () {
            logger.warn("reconnecting");
        });

        client.on("connect", function () {
            // logger.info('Connected to redis');
        });

        client.on("ready", function () {
            // log.info("Connect to Redis is ready");
        });

        client.on("end", function () {
            // console.log("end");
            // client.quit()
            // client = redis.createClient(option);
            // setEvents(client);
        });
    }

    removeKey(){

    }

    async createTest(){
        await tests(this.client);
    }
}

module.exports = Redis;

