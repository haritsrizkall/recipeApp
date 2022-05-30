const User = require("../database/model/user");
const userRepository = require("../database/repository/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { createResponse } = require("../utils/helpers");

const authController = {
    registerUser: async (req, res) => {
        const { email, password, name } = req.body;
    
        let user = await userRepository.getByEmail(email);
        if (user) {
            return res.status(400).json(createResponse('User already exist', 400, null));
        }
        
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        user = await userRepository.createUser({
            email: email,
            password: hash,
            name: name
        })

        return res.status(200).json(createResponse('User created successfully', 200, user));
    },
    login: async (req, res) => {
        const {email, password} = req.body;
        let user = await userRepository.getByEmail(email);
        if (!user) {
            return res.status(400).json(createResponse('User not found', 400, null));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json(createResponse('Invalid password', 400, null));
        }
        const token = jwt.sign({
            id: user._id,
        }, "SecretJWTRosaliaAbadi")

        return res.status(200).json(createResponse('Login success', 200, {
            token: token,
        }));
    }
}
// 

module.exports = authController;