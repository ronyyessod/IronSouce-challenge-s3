const fs = require("fs");
const userActions = require("../models/users");

function getPosts(request, response) {
    response.json({
        posts: [
            {title: "First post", owner: "Rony"},
            {title: "Second post", owner: "Ilan"}
        ]
    })
}

function getUser(request, response) {
    userActions.getUserData(request.query.access_token).then(function (result) {
        response.json({
            name: result.name,
            id: result.id,
            token: result.access_token
        })
    });
}

module.exports = {
    getPosts,
    getUser,
};
