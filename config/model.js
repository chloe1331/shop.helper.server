const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '../app/model');

module.exports = (config, sync = false) => {
    const Sequelize = require('sequelize');

    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: 'mysql',
        operatorsAliases: false,
        port: config.port || 3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    let files = [];
    try {
        files = fs.readdirSync(modelPath);
    } catch (e) {
        throw new Error('please create folder of models::(__ROOT__/app/model)');
    }

    const models = {};

    files.forEach(file => {
        const fileMatch = file.match(/(.*)\.[js]*$/);
        let name = fileMatch ? fileMatch[1] : null;
        if (name) {
            const modelClass = require(path.join(modelPath, file));

            const _model = sequelize.define(name.toLowerCase(), modelClass.attributes, {
                tableName: modelClass.tableName,
                createdAt: false,
                updatedAt: false,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            });
            models[name] = new modelClass(_model);

            // sync=true时，自动创建table
            if (sync) {
                _model.sync({
                    force: true
                }).catch(e => {
                    throw new Error(e.message);
                });
            }
        }
    });

    return models;
    // return sequelize
    //     .authenticate()
    //     .then(() => {
    //         return models;
    //     })
    //     .catch(err => {
    //         console.error('Unable to connect to the database:', err);
    //     });
};