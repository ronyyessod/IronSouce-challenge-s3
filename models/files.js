const dbActions = require('./db');

function addFile(user, file) {
    const createdAt = new Date();
    const updatedAt = null;
    const deletedAt = null;
    const sql = `INSERT INTO Files VALUES ('${file.id}','${file.name}','${file.size}','${createdAt}', 
        '${updatedAt}','${deletedAt}','${file.access}','${file.path}','${user.name}','${user.accessToken}')`;

    return new Promise(function(resolve, reject) {
        dbActions.db.run(sql, function(err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    access: file.access,
                    path: file.path
                })
            }
        });
    });
}

function isUserOwner(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err.message)
            }
            if (file === undefined) {
                resolve({
                    isOwner: false,
                    file: file_record
                })
            } else {
                resolve({
                    isOwner: true,
                    file: file_record
                })
            }
        })
    })
}

function isAccessible(file) {
    isUserOwner(file.id, file.accessToken).then(function (result) {
        const isOwner = result.isOwner;
        const access = result.file.access;
        return !(!isOwner && access === 'private');
    })
}

function isFileExists(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}'`;

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

function isFileDeleted(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err) {
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

function getFile(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id} AND accessToken = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err.message)
            } else if (file_record === undefined) {
                reject('File does not exists')
            } else {
                resolve(file_record)
            }
        })
    })

}

function getFileMetadata(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err.message)
            } else if (file === undefined) {
                reject('File does not exists')
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    access: file.access,
                    path: file.path,
                    createdAt: file_record.created_at,
                    updatedAt: file_record.updated_at,
                    deletedAt: file_record.deleted_at
                })
            }
        })
    });
}

function updateFileAccess(file) {
    const updatedAt = new Date();
    const sql = `UPDATE Files SET access_type = '${file.access}', updated_at = '${updatedAt}' WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.run(sql, function (err) {
            if (err) {
                reject(err.message)
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    access: file.access,
                    path: file.path,
                })
            }
        })
    })
}

function deleteFile(file) {
    const deletedAt = new Date();
    const sql = `UPDATE FILES set deleted_at = '${deletedAt}' WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.run(sql, function (err) {
            if (err) {
                reject(err.message)
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    access: file.access,
                    path: file.path,
                    deletedAt: file_record.deleted_at
                })
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