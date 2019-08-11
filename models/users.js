const dbActions = require('./db');

function getUserData(accessToken) {
    const sql = `SELECT * FROM Users WHERE access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, row) {
            if (err) {
                reject(err.message)
            } else {
                resolve(row)
            }
        })
    })
}

module.exports = {
    getUserData,
};