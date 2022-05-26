const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World From endpoint users');
})

router.post('/register', authController.registerUser);
router.post('/login', authController.login);

module.exports = router;