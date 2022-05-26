const { Sequelize } = require('sequelize');

const db = new Sequelize('recipedb', 'root', 'asmoro123', {
    host: 'db',
    dialect: 'mysql',
    port: 3306,
})

module.exports = {
    db,
}