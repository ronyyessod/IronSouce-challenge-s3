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
                reject(err);
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

function isUserOwner(file, user) {
    const fileAccess = file.accessToken;
    const userAccess = user.accessToken;

    return new Promise(function (resolve, reject) {
        if (fileAccess === userAccess) {
            resolve(true)
        } else {
            resolve(false)
        }
    });
}

function isAccessible(file, user) {

    const isOwner = isUserOwner(file, user);
    const access = file.access;

    return new Promise(function (resolve, reject) {
        if (access === 'public') {
            resolve(true)
        } else {
            if (isOwner) {
                resolve(true)
            } else {
                resolve(false)
            }
        }
    })
}

function isFileExists(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err) {
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
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err)
            }
            else if (file_record === undefined) {
                reject('Record does not exists')
            } else {
                if (file_record.deleted_at === 'null') {
                    resolve(false)
                } else {
                    resolve(true)
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
                reject(err)
            } else if (file_record === undefined) {
                reject('File does not exists')
            } else {
                resolve(file_record)
            }
        })
    })

}

function getFileByName(name) {
    const sql = `SELECT * FROM Files WHERE name = '${name}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err)
            } else if (file_record === undefined) {
                reject('File does not exists')
            } else {
                resolve({
                    id: file_record.id,
                    name: file_record.name,
                    size: file_record.size,
                    access: file_record.access_type,
                    accessToken: file_record.access_token,
                    path: file_record.path
                })
            }
        })
    })
}


function getFileById(id) {
    const sql = `SELECT * FROM Files WHERE id = '${id}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err)
            } else if (file_record === undefined) {
                reject('File does not exists')
            } else {
                resolve({
                    id: file_record.id,
                    name: file_record.name,
                    size: file_record.size,
                    access: file_record.access_type,
                    accessToken: file_record.access_token,
                    path: file_record.path
                })
            }
        })
    })
}

function getFileMetadata(file) {
    const sql = `SELECT * FROM Files WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.get(sql, function (err, file_record) {
            if (err) {
                reject(err)
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

function updateFileAccess(file, access) {
    const updatedAt = new Date();
    const sql = `UPDATE Files SET access_type = '${access}', updated_at = '${updatedAt}' WHERE id = '${file.id}' AND access_token = '${file.accessToken}'`;

    return new Promise(function (resolve, reject) {
        dbActions.db.run(sql, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    prev_access: file.access,
                    new_access: access,
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
                reject(err)
            } else {
                resolve({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    access: file.access,
                    path: file.path,
                    deletedAt: deletedAt
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
    getFileByName,
    getFileById
};