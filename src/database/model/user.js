const {Sequelize, DataTypes} = require('sequelize');
const { db } = require('..');
const uuid = require('uuid')

const User = db.define('users', {
    userId : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    email: {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password: {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {
    timestamps : false
})

module.exports = User;