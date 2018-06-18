module.exports = function (app) {
    app.use('/reg',  require('./reg'));
    app.use('/test', require('./test'));
};

//