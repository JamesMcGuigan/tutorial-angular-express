// Source: https://github.com/JamesMcGuigan/liatandco.com/blob/master/Server.js
const fs           = require('fs');
const morgan       = require('morgan');
const path         = require('path');
const errorHandler = require('express-error-handler');
const config       = require('./config.js');

// $ mkdir ./logs/
function createLogDirectory() {
  let logfiles = [ config.access_log, config.error_log, config.debug_log ];
  let dirnames = [ ...new Set(logfiles.map(path.dirname)) ];
  dirnames
    .map(dirname     => path.resolve(dirname))
    .filter(dirname  => !fs.existsSync(dirname))
    .forEach(dirname => {
      fs.mkdirSync(dirname, { recursive: true })
      console.info(`mkdir: ${dirname}`)
    })
  ;
}

module.exports = function(app) {
    createLogDirectory();
    let access_log_stream = fs.createWriteStream(config.access_log, {flags: 'a'});
    // let error_log_stream  = fs.createWriteStream(config.error_log,  {flags: 'a'});
    // let debug_log_stream  = fs.createWriteStream(config.debug_log,  {flags: 'a'});

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
