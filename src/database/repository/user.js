const { db } = require("..")
const User = require("../model/user")


const userRepository = {
    createUser: async (user) => {
        return await User.create(user)
    },
    getByEmail: async (email) => {
        return await User.findOne({
            where: {
                email: email
            }
        })
    }
}

module.exports = userRepository