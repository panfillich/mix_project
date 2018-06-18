const MODE      = (process.env.NODE_ENV || 'dev');
const PORT      = process.env.PORT;
const SERVER    = process.env.SERVER;
const _         = require('lodash');
const logger    = require('../logger');
const formatter = require('../res_handler/formatter');

module.exports = function (app) {
    app.use(function (err, req, res, next) {
        let status = err.status || 500;
        res.setError(err);
        if(res._headerSent){
            logger.error('Error after sending', {dev: res.dev_info});

        } else {
            res.status(status).json();
        }
    });
};
