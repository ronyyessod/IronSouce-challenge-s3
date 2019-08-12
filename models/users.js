const dbActions = require('./db');

function getUserData(user) {
    const sql = `SELECT * FROM Users WHERE access_token = '${user.accessToken}' AND name = '${user.name}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, user_record) {
            if (err) {
                reject(err.message)
            } else {
                resolve({
                    id: user_record.id,
                    name: user_record.name,
                    token: user_record.access_token
                })
            }
        })
    })
}

function isUserExists(user) {
    const sql = `SELECT * FROM Users WHERE name = '${user.name}' AND access_token = '${user.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, user_record) {
            if (err) {
                reject(err)
            } else if (user_record === undefined) {
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