const development = require('./dev.config');
const production = require('./prod.config');

const env = process.env.NODE_ENV;


const config = {
    development,
    production
}


module.exports = config[env];