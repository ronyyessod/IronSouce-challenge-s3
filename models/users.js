const dbActions = require('./db');

function getUserData(accessToken) {
    const sql = `SELECT * FROM Users WHERE access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, user) {
            if (err) {
                reject(err.message)
            } else {
                resolve({id: user.id, name: user.name, token: user.access_token})
            }
        })
    })
}

function isUserExists(accessToken) {
    const sql = `SELECT * FROM Users WHERE access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, row) {
            if (err) {
                reject('User does not exists')
            } else if (row === undefined) {
                reject('User does not exists')
            } else {
                resolve(true)
            }
        })
    })
}

module.exports = {
    getUserData,
    isUserExists,
};