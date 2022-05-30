const { userModel } = require("../model/user")

const userRepository = {
    createUser: async (user) => {
        return await userModel.create(user)
    },
    getByEmail: async (email) => {
        return await userModel.where({ email: email }).findOne();
    },
    update: async (id, user) => {
        return await userModel.findByIdAndUpdate(id, user)
    }
}

module.exports = userRepository