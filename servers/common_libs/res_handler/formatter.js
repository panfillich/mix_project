const MODE      = (process.env.NODE_ENV || 'dev');
const PORT      = process.env.PORT;
const SERVER    = process.env.SERVER;
const _         = require('lodash');
const logger    = require('../logger/index');
const STATUSES  = require('./status.json');

function getErrorInfo(error){
    return {
        message: error.message,
        stack: error.stack,
        name: error.name
    };
}
exports.getErrorInfo = getErrorInfo;

function getReqInfo(req) {
    return {
        method: req.method,
        url:    req.originalUrl,
        body:   req.body,
        headers: req.headers
    };
}
exports.getReqInfo = getReqInfo;

function getServerInfo() {
    let unix_time = _.now();
    return {
        unix_time: unix_time,
        // server_time: new Date(unix_time + 1000).toISOString(),
        port: PORT,
        server: SERVER
    };
}
exports.getServerInfo = getServerInfo;

function getStatusInfo(status) {
    let message, type;
    for (let key in STATUSES){
        if(STATUSES[key][2] ==  status){
            message = STATUSES[key][0];
            type = STATUSES[key][1];
        }
    }
    return {
        status: status,
        message: message,
        type: type
    };
}
exports.getStatusInfo = getStatusInfo;

function getResInfo(res) {
    return {
        headers: res.getHeaders(),
        status: (res.statusCode || 500)
    }
}
exports.getResInfo = getResInfo;