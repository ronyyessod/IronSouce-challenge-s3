const dbActions = require('./db');
const shortid = require('shortid');

function addFile(userName, accessToken, name, size, accessType, filePath) {
    const fileId = shortid.generate();
    const createdAt = new Date();
    const updatedAt = null;
    const deletedAt = null;
    const sql = `INSERT INTO Files VALUES ('${fileId}','${name}','${size}','${createdAt}', 
        '${updatedAt}','${deletedAt}','${accessType}','${filePath}','${userName}','${accessToken}')`;

    return new Promise(function(resolve, reject) {
        dbActions.db.run(sql, function(err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({id: fileId, path: filePath})
            }
        });
    });
}

function isUserOwner(fileId, accessToken) {
    const sql = `SELECT * FROM Files WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, row) {
            if (err) {
                reject(err.message)
            }
            if (row === undefined) {
                resolve({isOwner: false, row: row})
            } else {
                resolve({isOwner: true, row: row})
            }
        })
    })
}

function isAccessible(fileId, accessToken) {
    isUserOwner(fileId, accessToken).then(function (result) {
        const isOwner = result.isOwner;
        const access = result.row.access;
        return !(!isOwner && access === 'private');
    })
}

function getFileMetadata(fileId, accessToken) {
    const sql = `SELECT * FROM Files as file WHERE file.id = '${fileId}' AND file.access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, row) {
            if (err) {
                reject(err.message)
            } else {
                if (row.deletedAt === null) {
                    resolve({name: row.name, size: row.size, createdAt: row.createdAt,
                        updatedAt: row.updatedAt})
                } else {
                    resolve({name: row.name, size: row.size, createdAt: row.createdAt,
                        updatedAt: row.updatedAt, deletedAt: row.deleteAt})
                }
            }
        })
    })
}

function updateFileAccess(fileId, access, accessToken) {
    const updatedAt = new Date();
    const sql = `UPDATE Files SET access_type = '${access}', updated_at = '${updatedAt}' WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    isUserOwner(fileId, accessToken).then(function (result) {
        if (result.isOwner) {
            return new Promise(function (resolve, reject) {
                dbActions.db.run(sql, function (err) {
                    if (err) {
                        reject(err.message)
                    } else {
                        resolve({fileId: fileId, access: access, updatedAt: updatedAt})
                    }
                })
            })
        } else {
            console.log('User is not an owner of the file')
        }
    })
}

function deleteFile(fileId, accessToken) {
    const deletedAt = new Date();
    const sql = `UPDATE FILES set deleted_at = '${deletedAt}' WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    isUserOwner(fileId, accessToken).then(function (result) {
        if (result.isOwner) {
            return new Promise(function (resolve, reject) {
                dbActions.db.run(sql, function (err) {
                    if (err) {
                        reject(err.message)
                    } else {
                        resolve({fileId: fileId, deletedAt: deletedAt})
                    }
                })
            })
        } else {
            console.log('User is not an owner of the file')
        }
    })
}


module.exports = {
    addFile,
    isUserOwner,
    isAccessible,
    getFileMetadata,
    updateFileAccess,
    deleteFile
};