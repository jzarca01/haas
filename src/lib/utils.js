const { isNil } = require('lodash');
const { store } = require('../config/config');

const isConnected = !isNil(store.get('token'))

module.exports = {
    isConnected
}