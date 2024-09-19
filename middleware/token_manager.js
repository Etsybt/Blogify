const async_manager = require("express-async-handler");
const jwt = require("jsonwebtoken");

const token_validator = async_manager(async(req, res, next) => {
    let token;
    let auth_header = req.headers.authorization || req.headers.Authorization;

    if (auth_header && auth_header.startsWith("Bearer")) {
        token = auth_header.split(" ")[1];
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("User not authorizes"); 
            }
            req.user = decoded.user;
            next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User unauthorized or TOken not provided");
        }
    }
});

module.exports = token_validator;