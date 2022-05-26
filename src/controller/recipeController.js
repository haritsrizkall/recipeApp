const User = require("../database/model/user");
const userRepository = require("../database/repository/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const recipeRepository = require("../database/repository/recipe");

const recipeController = {
    createRecipe: async (req, res) => {
        const userId = req.userId;
        const { name, description, ingredients, steps } = req.body;
        const recipe = await recipeRepository.createRecipe({
            userId: userId,
            name: name,
            description: description,
            ingredients: JSON.stringify(ingredients),
            steps: JSON.stringify(steps)
        })
        return res.status(200).json({
            message: "Recipe created successfully",
            data: recipe
        })
    },
    getByUserID: async (req, res) => {
        const userId = req.userId;
        const recipes = await recipeRepository.getRecipeByUserID(userId);
        recipes.map(recipe => {
            recipe.ingredients = JSON.parse(recipe.ingredients);
            recipe.steps = JSON.parse(recipe.steps);
        })
        return res.status(200).json({
            message: "Recipes retrieved successfully",
            data: recipes
        });
    }
}
// 

module.exports = recipeController;