module.exports = function (app) {
    require('./404')(app);
    require('./500')(app);
};