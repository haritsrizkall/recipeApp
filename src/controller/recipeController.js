const recipeRepository = require("../database/repository/recipe");
const { unauthorizedResponse, createResponse } = require("../utils/helpers");

const recipeController = {
    createRecipe: async (req, res) => {
        const userId = req.userId;
        const { name, description, ingredients, steps } = req.body;
        try {
            console.log(userId);
            const recipe = await recipeRepository.createRecipe({
                userId: userId,
                name: name,
                description: description,
                ingredients: ingredients,
                steps: steps
            })
            
            return res.status(200).json(createResponse('Recipe created successfully', 200, recipe));
        } catch (error) {
            return res.status(500).json(createResponse('Internal server error', 500, {
                error: error.message
            }));
        }
    },
    deleteRecipe: async (req, res) => {
        const recipeId = req.params.id;
        const userId = req.userId;

        try {
            const recipe = await recipeRepository.getById(recipeId);

            if (recipe.userId.toString() !== userId) {
                return res.status(400).json(unauthorizedResponse())
            }
            await recipe.delete();

            if (!recipe) {
                return res.status(400).json(createResponse('Recipe not found', 400, null));
            }
            return res.status(200).json(createResponse('Recipe deleted successfully', 200, null));
        } catch (error) {
            return res.status(500).json(createResponse('Internal server error', 500, {
                error: error.message
            }));
        }
        
    },
    updateRecipe: async (req, res) => {
        const recipeId = req.params.id;
        const userId = req.userId;
        const { name, description, ingredients, steps } = req.body;

        try {
            const recipe = await recipeRepository.getById(recipeId);
            if (!recipe) {
                return res.status(400).json(createResponse('Recipe not found', 400, null));
            }
            if (recipe.userId.toString() !== userId) {
                return res.status(400).json(unauthorizedResponse())
            }
            
            await recipeRepository.update(recipeId, {
                name: name,
                description: description,
                ingredients: ingredients,
                steps: steps,
            })

            return res.status(200).json(createResponse('Recipe updated successfully', 200, null));

        }catch (error) {
            return res.status(500).json(createResponse('Internal server error', 500, {
                error: error.message
            }));
        }
    },
    getByUserID: async (req, res) => {
        const userId = req.userId;
        const recipes = await recipeRepository.getRecipeByUserID(userId);
        return res.status(200).json(createResponse('Recipes found', 200, recipes));
        
    }
}
// 

module.exports = recipeController;