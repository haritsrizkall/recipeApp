const {Sequelize, DataTypes} = require('sequelize');
const { db } = require('..');
const uuid = require('uuid')

const Recipe = db.define('recipes', {
    recipeId: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    steps: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: (recipe) => {
            recipe.recipeId = uuid.v4()
        }
    }
})

module.exports = Recipe;