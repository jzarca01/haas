const Conf = require('conf');

const config = new Conf();

module.exports = {
    DEV_API_URL: 'http://localhost:3000/api',
    API_URL: '',
    store: config
}