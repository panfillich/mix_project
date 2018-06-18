const MODE      = (process.env.NODE_ENV || 'dev');
const logger    = require('../logger');

const formatter = require('./formatter');
const STATUSES  = require('./status.json');

const WARN = [];
const ERR = [];
const SUCCESS = [];

for (let key in STATUSES){
    switch (STATUSES[key][1]){
        case 'warn':
            WARN.push(STATUSES[key][2]); break;
        case 'error':
            ERR.push(STATUSES[key][2]); break;
        case 'success':
            SUCCESS.push(STATUSES[key][2]); break;
    }
}


function modifyRes(res) {
    res.dev_info = {};
    res.is_json  = false;

    res.setError = function (error) {
        this.dev_info.error = formatter.getErrorInfo(error);
        return this;
    }.bind(res);

    res.setDevInfo = function (data) {
        if(typeof data === 'object') {
            Object.assign(this.dev_info, data);
        } else {
            throw new Error("Data isn't an object");
        }
        return this;
    }.bind(res);
}

function getFullDevInfo(req, res, res_body) {
    return Object.assign(
        formatter.getServerInfo(),
        res.dev_info,
        {
            req: formatter.getReqInfo(req),
            res: Object.assign(
                formatter.getResInfo(res),
                res_body
            )
        }
    );
}

function resHandler(req, res, next) {
    let oldSend = res.send;
    let oldJson = res.json;

    modifyRes(res);

    res.json = function (body) {
        res.is_json = true;
        const STATUS = (res.statusCode || 500);
        oldJson.call(this, Object.assign(
            {info: formatter.getStatusInfo(STATUS)},
            (body||{}),
            (function () {
                res.dev_info = getFullDevInfo(req, res, body);
                if(MODE == 'prod'){
                    return {};
                }
                return {dev: res.dev_info};
            })()
        ));
    };

    res.send = function(body){
        if(!res.is_json) {
            res.is_json = false;
            return oldSend.apply(this, arguments);
        }

        oldSend.apply(this, arguments);

        const STATUS = (res.statusCode || 500);
        if (SUCCESS.indexOf(STATUS) !== -1){
            return;
        }
        // if(res.dev_info.server !== undefined){
        //     res.dev_info = getFullDevInfo(req, res, {});
        // }
        if(WARN.indexOf(STATUS) !== -1){
            logger.warn('Res Handler', {dev:res.dev_info});
        } else if (ERR.indexOf(STATUS)!==-1){
            logger.error('Res Handler', {dev:res.dev_info});
        }
    };

    next();
}

module.exports = resHandler;