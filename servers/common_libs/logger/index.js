// Уровни логов

// error — приложение в критическом положении, требуется внимание человека для продолжения. Появляется довольно редко,
//         но метко. Я использую его для очень низкоуровневых вещей или для необработанных исключений
// warn  — произошло что-то необычное, выбивающееся из обычного сценария, но приложение умное и восстановило свою
//         работу само. Я использую этот уровень в обрабочиках ошибок.
// info  — что сейчас происходит
// debug — что сейчас происходит, более подробно
// silly — пишем как в твиттер, все что не попадя.

const winston = require('winston');
require('winston-daily-rotate-file');

const MODE = (process.env.NODE_ENV || 'dev');
const SERVER_NAME = (process.env.SERVER || null);
const PORT = (process.env.PORT || null);
const LOG_CONFIG = require('../../config').env[MODE].log;

// FOR WINSTON 2
let config = {
    transports: []
};

if(LOG_CONFIG.console){
    config.transports.push(
        new winston.transports.Console({
            level: LOG_CONFIG.console_lvl,
            formatter: function (info) {
                let dev = info.meta.dev;
                if (info.meta.dev) {
                    let format = `${info.level}: ${dev.res.status} | ${dev.req.method}:${dev.req.url}\n`;
                    if (dev != undefined) {
                        if (dev.error != undefined) {
                            format += `${dev.error.stack}`;
                        }
                    }
                    return format;
                }
                return `${info.level}: ${info.message}`;
            }
        })
    );
}

if(LOG_CONFIG.file) {
    config.transports.push(
        new (winston.transports.DailyRotateFile)({
            filename: '/vagrant/log/' + SERVER_NAME + '/' + PORT + '',
            json: true,
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: LOG_CONFIG.file_lvl,
            timestamp: true
        })
    )
}

let log = new (winston.Logger)(config);

// FOR WINSTON 3
//
// const { createLogger, format, transports } = require('winston');
// const { combine, timestamp, label, printf } = format;
// let config = {
//     transports: []
// };
//
// const resHandler = printf(function(info){
//     if(info.message == 'Res Handler'){
//         let format = `${info.level}: ${info.dev.res.status} | ${info.dev.req.method}:${info.dev.req.url}\n`;
//         if(info.dev != undefined) {
//             if(info.dev.error != undefined) {
//                 format += `${info.dev.error.stack}`;
//             }
//         }
//         return format;
//     }
//     return `${info.level}: ${info.message}`;
// });
//
// if(LOG_CONFIG.console){
//     config.transports.push(
//         new transports.Console({
//             level: LOG_CONFIG.console_lvl,
//             format: winston.format.combine(
//                 winston.format.colorize(),
//                 resHandler
//             )
//         })
//     );
// }
//
// if(LOG_CONFIG.file){
//     config.transports.push(
//         new transports.File({
//             maxsize: 2*1024*10,
//            // maxFiles: 5,
//            // maxRetries: 10,
//            // maxsize: 1000,
//            // maxFiles: 30,
//             dirname: '/vagrant/log/' + SERVER_NAME,
//             filename: PORT + '.log',
//             level: LOG_CONFIG.file_lvl,
//             format: winston.format.combine(
//                 timestamp(),
//                 format.json()
//             )
//         })
//     );
// }

module.exports = log;