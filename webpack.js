
let webpackConfig = require("./webpack.config.js");
// var config = Object.create(webpackConfig);

let WebpackDevServer = require('webpack-dev-server');
var webpack = require("webpack");

//config.devtool = 'eval';
// config.debug = true;
//
// Start a webpack-dev-server
new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    inline: true,
    port: 3900,
    host: '0.0.0.0',
    watchOptions: {
        aggregateTimeout: 30,
        poll: true // is this the same as specifying --watch-poll?
    },
    publicPath: "/public/",
    contentBase: __dirname + "/public/",
    stats: {
        colors: true
    },
    proxy:[
        // {   context: ['/pub-api/**'],
        //     target: 'http://localhost:3003',
        //     pathRewrite: {'/pub-api': '/'}
        // },
        // {   context: ['/priv-api/**'],
        //     target: 'http://localhost:3002',
        //     pathRewrite: {'/priv-api': '/'}
        // },
        // {   context: ['/chat/**'],
        //     target: 'http://localhost:3004',
        //     pathRewrite: {'/chat': '/'}
        // },
        // {   context: ['/*.*'],
        //     target: 'http://localhost:3000/public'
        // },
        {   context: ['/public/*.*'],
            target: 'http://localhost:3000',
            bypass: function(req, res, proxyOptions) {
                return '/public/';
            }
        },
        {   context: ['/**'],
            target: 'http://localhost:3000',
            bypass: function(req, res, proxyOptions) {
                return '/index.html';
            }
        }
    ]
}).listen(3900, '0.0.0.0', function (err) {
    if (err) {
        throw err;
    }
});