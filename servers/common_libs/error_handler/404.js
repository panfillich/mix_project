module.exports = function (app) {
    app.use(function(req, res, next){
        return res.status(404).json();
    });
};


