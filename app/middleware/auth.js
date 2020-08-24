const jwt = require('jsonwebtoken');

module.exports = {
    isAuth: (req, res, next) => {
        try {
            const token = req.headers.token;
            //console.log(token);
            var decoded = 
            jwt.verify(token, 'TEXT SECRET LETAK KAN DI ENV');
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({
                err:err.message,
                message: 'Token is Invalid'
            });
        }
    }
};