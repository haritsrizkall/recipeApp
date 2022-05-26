const express = require('express');
const authController = require('../controller/authController');
const recipeController = require('../controller/recipeController');
const Authorization = require('../middleware/authorization');

const router = express.Router();

router.post('/', Authorization ,recipeController.createRecipe)
router.get('/', Authorization ,recipeController.getByUserID)
module.exports = router;