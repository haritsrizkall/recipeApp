const { default: mongoose, Schema } = require("mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {collection: 'users', timestamps: true});

module.exports = {
    userModel: mongoose.model('User', userSchema)
}