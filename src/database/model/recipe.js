const { default: mongoose } = require('mongoose');

const recipeSchema = mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    steps: {
        type: [String],
        required: true,
    }

}, {
    collection: 'recipes',
    timestamps: true
})

module.exports = {
    recipeModel: mongoose.model('Recipe', recipeSchema),
};