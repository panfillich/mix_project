let DATABASE = {
    host:     'localhost',
    database: 'card_game',
    user:     'admin',
    password: 'admin'
};

let REDIS = {
    host: 'localhost',
    port:  6379,
    database: 0
};

const CONFIG = {
    script: {
        pub_api: {
            path: 'servers/pub_api',
            interpreter: 'node'
        },
        bot: {
            path: 'servers/bot/main.py',
            interpreter: 'python3'
        },
    },

    env: {
        dev: {
            database:   Object.assign({}, DATABASE, {database: 'card_game_dev'}),
            redis:      Object.assign({}, REDIS, {database: 3}),
            servers: {
                pub_api: {
                    starting_port: 3010, // nginx
                    count_of_threads: 3  // = n
                                         // 3010, 3011, 3012, ...301n
                },
                bot: {
                    starting_port: 4041, // nginx
                    count_of_threads: 1  // = n
                                         // 4041, 4042, 4043, ...404n
                }
            },
            log: {
                console: true,
                console_lvl: 'debug',
                file: true,
                file_lvl: 'info',
                file_folder: 'log'
            },
            res: {
                dev_info: true,
                status_info: false
            },
            watch: true,
            autorestart: false
        },

        prod: {
            database:   Object.assign({}, DATABASE, {database: 'card_game'}),
            redis:      Object.assign({}, REDIS, {database: 4}),
            servers: {
                pub_api: {
                    starting_port: 4010,
                    count_of_threads: 3
                },
            },
            log: {
                console: true,
                console_lvl: 'info',
                file: true,
                file_lvl: 'info',
                file_folder: 'log'
            },
            res: {
                dev_info: true,
                status_info: false
            },
            watch: false,
            autorestart: true
        },

        test: {
            database:   Object.assign({}, DATABASE, {database: 'card_game_test'}),
            redis:      Object.assign({}, REDIS, {database: 5}),
            servers: {
                pub_api: {
                    starting_port: 5010, // nginx
                    count_of_threads: 3, // = n
                                         // 3011, 3012, 3013, ...301n
                },
            },
            logger: {
                console: false,
                file: false
            },
            res: {
                dev_info: false,
                status_info: false
            },
            watch: false,
            autorestart: false
        }
    },

    security: {
        secret: { //salt
            'password': 'secret_for_pass',
            'session':  'secret_for_session',
            'chat':     'secret_for_chat'
        },
        hash: {
            type: 'sha512',
            length: 64,
        },
        // for session and email
        token: {
            length: 100
        }
    }
};
// console.dir(CONFIG);
module.exports = CONFIG;