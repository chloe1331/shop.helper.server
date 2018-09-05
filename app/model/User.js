'use strict';

const Sequelize = require('sequelize');
const moment = require('moment');

class User {
    constructor(model) {
        this.model = model;
    }
}

// User.tableName = 'users'; // 默认文件名
User.attributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING(32) // 'admin|member'
    },
    parent_id: {
        type: Sequelize.INTEGER
    },
    uid: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        unique: true
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};

module.exports = User;
