'use strict';
const model = require('./model');

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1535964104402_2620';

    // add your config here
    config.middleware = [];

    config.models = model({
        host: 'localhost',
        database: 'shop_helper',
        username: 'root',
        password: ''
    });

    config.security = {
        csrf: {
            enable: false,
        },
    };

    return config;
};
