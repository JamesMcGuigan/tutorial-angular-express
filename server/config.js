let configDefaults = {
    name: 'Oracle Eye',
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

module.exports = config;