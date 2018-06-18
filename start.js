let pm2 = require('pm2');
let logger = require('./servers/common_libs/logger');
let _ = require('lodash');
const CONFIG = require('./servers/config.js');


//ps -ef | grep python
// kill 4545

const all_servers = [
    'pub_api',
    'bot'
];

const all_modes = ['dev', 'prod', 'mix'];
const MODE = process.argv[2];

if(all_modes.indexOf(MODE) === -1){
    logger.log('error', 'Mode = "' + MODE + '". Unknown mode...');
    process.exit(-1);
}

const PM2_CONFIG_TEMPLATE = {
    env: {
        NODE_ENV: null,
        PORT: null,
        SERVER: null
    },
    name: null,
    script: null,
    max_memory_restart : '100M',
    watch: [
        'servers/common_libs',
        'servers/database',
        'servers/models',
        'servers/redis'
    ],
    ignore_watch : [ "node_modules" ],
    watch_options: {
        followSymlinks: false,
        persistent    : true,
        ignoreInitial : true,
        usePolling    : true
    },
    autorestart : false,
};

let pm2_configs = [];
const ENV = CONFIG.env[MODE];
all_servers.forEach( function(server_name) {
    const SERVER = ENV.servers[server_name];
    for(let i = 0; i < SERVER.count_of_threads; i++){
        const PM2_CONFIG = _.cloneDeep(PM2_CONFIG_TEMPLATE);
        PM2_CONFIG.env.NODE_ENV = MODE;
        PM2_CONFIG.env.PORT = SERVER.starting_port + i;
        PM2_CONFIG.env.SERVER = server_name;

        PM2_CONFIG.name = server_name;
        PM2_CONFIG.script = CONFIG.script[server_name].path;
        PM2_CONFIG.interpreter = CONFIG.script[server_name].interpreter;

        if (PM2_CONFIG.interpreter == 'python3'){
            PM2_CONFIG.interpreterArgs = ['-u']
        }

        if(ENV.watch){
            if (PM2_CONFIG.interpreter == 'python3'){
                PM2_CONFIG.watch = [];
            }
            PM2_CONFIG.watch.push(CONFIG.script[server_name].path);
        } else {
            PM2_CONFIG.watch = false;
        }
        PM2_CONFIG.autorestart = ENV.autorestart;
        pm2_configs.push(PM2_CONFIG);
    }
});

pm2.connect(true, function (err) {
    pm2.start(pm2_configs, function (err) {
        // pm2.streamLogs([...all_servers], 0);
        pm2.launchBus((err, bus) => {
            bus.on('log:out', data => {
                // console.log("\x1b[32m", data.process.name + ':' + data.process.pm_id + ' ' + data.data);
            });
            bus.on('log:err', data => {
                // console.log("\x1b[31m", data.process.name + ':' + data.process.pm_id + ' ' + data.data);
            });
        });
    });
});



/*
pm2.connect(true, function () {
    pm2.start([...dev_config, ...prod_config], function (err) {
        if(['prod-mode', 'dev-mode', 'mix-mode'].indexOf(mode) !== -1) {
            pm2.streamLogs([...all_servers], 0);
        }
    });
});*/