const { db } = require("..")
const Recipe = require("../model/recipe")


const recipeRepository = {
    createRecipe: async (recipe) => {
        return await Recipe.create(recipe)
    },
    getRecipeByUserID: async (userId) => {
        return await Recipe.findAll({
            where: {
                userId: userId
            }
        })
    }
}

module.exports = recipeRepository