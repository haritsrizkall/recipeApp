const { recipeModel } = require("../model/recipe")


const recipeRepository = {
    createRecipe: async (recipe) => {
        return await recipeModel.create(recipe)
    },
    getById: async (id) => {
        return await recipeModel.findById(id);
    },
    getRecipeByUserID: async (userId) => {
        return await recipeModel.where({ userId: userId }).find()
    },
    delete: async (id) => {
        return await recipeModel.findByIdAndDelete(id)
    },
    update: async (id, recipe) => {
        return await recipeModel.updateOne({ _id: id }, recipe)
    }
}

module.exports = recipeRepository