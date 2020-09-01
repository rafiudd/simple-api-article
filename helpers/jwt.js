const expressJwt = require('express-jwt');
const dotenv = require("dotenv");
dotenv.config();

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET_JWT;
    const algorithms = ["HS256"];
    return expressJwt({ secret, algorithms }).unless({
        path: [
            // public routes that don't require authentication
            '/',
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    });
}