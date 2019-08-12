const userActions = require('../models/users');

async function authenticate(request, response, next) {
    const user = {
        name: request.body.user,
        accessToken: request.header('x-access-token')
    };

    if (!user.accessToken) {
        return response.status(400).json({
            success: false,
            message: 'Token must be provided in the request header'
        })
    } else if (!user.name) {
        return response.status(400).json({
            success: false,
            message: 'User name must be provided in the request body'
        })
    } else {
        try {
            const isExists = await userActions.isUserExists(user);
            if (isExists) {
                next()
            } else {
                console.error('User cannot be found')
            }
        } catch (e) {
            return response.status(401).json({
                success: false,
                message: e
            })
        }
    }
}

module.exports = {
    authenticate,
};