const jwt = require('jsonwebtoken');
const Authorization = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }else {
        const token = authHeader.split(' ');
        if (token[0] !== 'Bearer' || token.length !== 2) {
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
        try {
            const decoded = jwt.verify(token[1], "SecretJWTRosaliaAbadi");
            req.userId = decoded.id;
            next();
        } catch (error) {
            res.status(401).json({
                message: "Unauthorized"
            });  
        }
    }
}

module.exports = Authorization;