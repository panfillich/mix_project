let helmet      =  require('helmet');
let bodyParser  =  require('body-parser');
let resHandler  =  require('../res_handler');
// Content-Type: application/json

module.exports = function (app) {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(function (req, res, next){
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', false);

        // Set Content Type
        res.setHeader('Content-Type', 'application/json');

        next();
    });
    app.use(resHandler);
};

