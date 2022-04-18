// Source: https://github.com/JamesMcGuigan/liatandco.com/blob/master/Server.js
process.argv.forEach(function (value, index, array) {
    if( value.match(/^NODE_ENV=/)   ) { process.env.NODE_ENV   = value.replace(/^NODE_ENV=/,   ''); }
    if( value.match(/^PORT_HTTP=/)  ) { process.env.PORT_HTTP  = value.replace(/^PORT_HTTP=/,  ''); }
    if( value.match(/^PORT_HTTPS=/) ) { process.env.PORT_HTTPS = value.replace(/^PORT_HTTPS=/, ''); }
});
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const fs           = require('fs');
const morgan       = require('morgan');
const errorHandler = require('express-error-handler');
const config       = require('./config.js')[process.env.NODE_ENV];

module.exports = function(app) {
    var access_log_stream = fs.createWriteStream(config.access_log, {flags: 'a'});
    var error_log_stream  = fs.createWriteStream(config.error_log,  {flags: 'a'});
    
    // Logging
    if( ["staging","production"].indexOf(process.env.NODE_ENV) != -1 ) {
        // TODO: http://learnboost.github.io/cluster/docs/logger.html
        app.use(morgan("short")); 				              	 // log every request to the console
        app.use(morgan("short", {stream: access_log_stream }));  // log every request to the console
        app.enable('view cache');
    }
    if( ["test","development","vagrant"].indexOf(process.env.NODE_ENV) != -1 ) {
        app.use(morgan("dev"));
        app.use(morgan("dev", {stream: access_log_stream }));
        app.use(errorHandler({showStack: true, dumpExceptions: true}));
    }
    
    app.use(function(request, response, next) {
        response.header('Vary', 'Accept-Encoding');            // Instruct proxies to store both compressed and uncompressed versions
        response.header('Access-Control-Allow-Origin', '*');   // Allow connections from other hosts
        //response.header('X-Frame-Options', 'SAMEORIGIN');    // Prevent Clickjacking
        next();
    });
}