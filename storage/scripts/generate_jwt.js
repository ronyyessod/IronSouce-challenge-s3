const jwt = require("jsonwebtoken");

exports.jwt_generator = (user_id) => {
    const user = { id: user_id };
    return jwt.sign({ user }, "user_access_token");
};