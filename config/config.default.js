'use strict';
const model = require('./model');

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1535964104402_2620';

    // add your config here
    config.middleware = [];

    config.models = model({
        // 'dialectOptions': {
        //     charset: 'utf8mb4',
        //     collate: 'utf8mb4_unicode_ci',
        //     supportBigNumbers: true,
        //     bigNumberStrings: true
        // },
        define: {
            underscored: false,
            freezeTableName: false,
            charset: 'utf8',
            dialectOptions: {
                collate: 'utf8_general_ci'
            },
            timestamps: true
        },

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
