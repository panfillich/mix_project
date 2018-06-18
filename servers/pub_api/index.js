let express = require('express');
let app = express();

let logger = require('../common_libs/logger');


(async function () {
    // connect to database
    let db = await require('../database').connect();
    // set database to models
    require('../models').setDatabase(db);
})();

// connect to redis
require('../redis').connect();

// filters
require('../common_libs/filters')(app);

// routers/controllers
require('./controllers')(app);

// error_handlers
require('../common_libs/error_handler')(app);

app.listen(process.env.PORT, function () { //
    logger.log('info', 'Server run on port: ' + process.env.PORT)
});


