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
        dbActions.db.get(sql, function (err, file) {
            if (err) {
                reject(err.message)
            }
            if (file === undefined) {
                resolve({isOwner: false, file: file})
            } else {
                resolve({isOwner: true, file: file})
            }
        })
    })
}

function isAccessible(fileId, accessToken) {
    isUserOwner(fileId, accessToken).then(function (result) {
        const isOwner = result.isOwner;
        const access = result.file.access;
        return !(!isOwner && access === 'private');
    })
}

function isFileExists(fileId) {
    const sql = `SELECT * FROM Files WHERE id = '${fileId}'`;

    return new Promise(function (resolve, reject) {
        dbActions.get(sql, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

function isFileDeleted(fileId) {
    const sql = `SELECT * FROM Files WHERE id = '${fileId}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file) {
            if (err) {
                reject(err.message)
            }
            else if (file === undefined) {
                reject('Record does not exists')
            } else {
                if (file.deletedAt === null) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }

        })
    })
}

function getFile(fileId, accessToken) {
    const sql = `SELECT * FROM Files WHERE id = '${fileId} AND accessToken = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file) {
            if (err) {
                reject(err.message)
            } else if (file === undefined) {
                reject('File does not exists')
            } else {
                resolve(file)
            }
        })
    })

}

function getFileMetadata(fileId, accessToken) {
    const sql = `SELECT * FROM Files WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file) {
            if (err) {
                reject(err.message)
            } else if (file === undefined) {
                reject('File does not exists')
            } else {
                resolve({name: file.name, size: file.size, createdAt: file.created_at,
                        updatedAt: file.updated_at, deletedAt: file.deleted_at})
                }
        })
    });
}

function updateFileAccess(fileId, access, accessToken) {
    const updatedAt = new Date();
    const sql = `UPDATE Files SET access_type = '${access}', updated_at = '${updatedAt}' WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.run(sql, function (err) {
            if (err) {
                reject(err.message)
            } else {
                resolve({fileId: fileId, access: access, updatedAt: updatedAt})
            }
        })
    })
}

function deleteFile(fileId, accessToken) {
    const deletedAt = new Date();
    const sql = `UPDATE FILES set deleted_at = '${deletedAt}' WHERE id = '${fileId}' AND access_token = '${accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.run(sql, function (err) {
            if (err) {
                reject(err.message)
            } else {
                resolve({fileId: fileId, deletedAt: deletedAt})
            }
        })
    })
}


module.exports = {
    addFile,
    isUserOwner,
    isAccessible,
    getFileMetadata,
    updateFileAccess,
    deleteFile,
    isFileExists,
    isFileDeleted,
    getFile,
};