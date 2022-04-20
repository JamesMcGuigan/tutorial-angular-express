process.argv.forEach(function (value, index, array) {
  if( value.match(/^NODE_ENV=/)   ) { process.env.NODE_ENV   = value.replace(/^NODE_ENV=/,   ''); }
  if( value.match(/^PORT_HTTP=/)  ) { process.env.PORT_HTTP  = value.replace(/^PORT_HTTP=/,  ''); }
  if( value.match(/^PORT_HTTPS=/) ) { process.env.PORT_HTTPS = value.replace(/^PORT_HTTPS=/, ''); }
});
process.env.NODE_ENV = process.env.NODE_ENV || "development";

let configDefaults = {
    name: 'Angular Express Tutorial',
    port: 3000,
    access_log: './logs/oracle-eye-access.log',
    error_log:  './logs/oracle-eye-error.log',
    debug_log:  './logs/oracle-eye-debug.log',
};
let config = {
    test:        { ...configDefaults },
    development: { ...configDefaults },
    staging:     { ...configDefaults },
    production:  { ...configDefaults },
};

module.exports = config[process.env.NODE_ENV];
