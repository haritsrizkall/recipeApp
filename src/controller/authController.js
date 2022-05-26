const User = require("../database/model/user");
const userRepository = require("../database/repository/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authController = {
    registerUser: async (req, res) => {
        const { email, password } = req.body;
    
        let user = await userRepository.getByEmail(email);
        if (user) {
            return res.status(400).json({
                message: "User already exist"
            })
        }
        
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        user = await userRepository.createUser({
            email: email,
            password: hash
        })

        return res.status(200).json({
            message: "User created successfully",
            data: user
        });
    },
    login: async (req, res) => {
        const {email, password} = req.body;
        let user = await userRepository.getByEmail(email);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
        const token = jwt.sign({
            id: user.userId,
        }, "SecretJWTRosaliaAbadi")

        return res.status(200).json({
            message: "Login successful",
            token:token
        })
    }
}
// 

module.exports = authController;