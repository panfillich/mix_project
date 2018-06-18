let logger = require('./common_libs/logger');

// let realConsole = console.log;
console.log = function () {
    logger.info(...arguments);
};

require('./redis/test');

