const express = require('express');
const authController = require('../controller/authController');
const recipeController = require('../controller/recipeController');
const Authorization = require('../middleware/authorization');

const router = express.Router();

router.post('/', Authorization ,recipeController.createRecipe)
router.get('/', Authorization ,recipeController.getByUserID)
router.put('/:id', Authorization ,recipeController.updateRecipe)
router.delete('/:id', Authorization ,recipeController.deleteRecipe)

module.exports = router;