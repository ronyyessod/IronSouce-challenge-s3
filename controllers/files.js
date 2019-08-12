const userActions = require('../models/users');
const fileActions = require('../models/files');

async function uploadFile(user, file) {
    try {
        const is_exists = await userActions.isUserExists(user);
        if (is_exists) {
            return await fileActions.addFile(user, file)
        } else {
            console.error('User is not supported')
        }
    } catch (e) {
        throw e
    }
}

async function getFileByName(fileName) {
    try {
        return await fileActions.getFileByName(fileName);
    } catch (e) {
        throw e
    }
}

async function getFileById(fileId) {
    try {
        return await fileActions.getFileById(fileId);
    } catch (e) {
        throw e
    }
}

async function downloadFile(file, user) {
    try {
        const isOwner = await fileActions.isUserOwner(file, user);
        console.log("owner " + isOwner);
        const isFileAccessible = await fileActions.isAccessible(file, user);
        console.log('accesible ' + isFileAccessible);
        const isDeleted = await fileActions.isFileDeleted(file);

        if ((isOwner || isFileAccessible) && !isDeleted) {
            return file.path
        } else {
            return null
        }
    } catch (e) {
        throw e
    }

}

async function getFileMetadata(file, user) {
    try {
        const isOwner = await fileActions.isUserOwner(file, user);
        const isFileAccessible = await fileActions.isAccessible(file, user);
        const isExists = await fileActions.isFileExists(file);

        if ((isOwner || isFileAccessible) && isExists) {
            return await fileActions.getFileMetadata(file)
        } else {
            console.error('Cannot get file metadata')
        }
    } catch (e) {
        throw e
    }

}

async function updateFileMetadata(file, user) {
    const accessLow = file.access.toLowerCase();

    try {
        const isOwner = await fileActions.isUserOwner(file, user);
        const isExists = await fileActions.isFileExists(file);
        const isDeleted = await fileActions.isFileDeleted(file);
        const isValid = ['private', 'public'].includes(accessLow);

        if (isOwner && isExists && !isDeleted && isValid) {
            return await fileActions.updateFileAccess(file)
        } else {
            console.error('Cannot update file metadata')
        }
    } catch (e) {
        throw e
    }

}

async function deleteFile(file, user) {
    try {
        const isOwner = await fileActions.isUserOwner(file, user);
        const isExists = await fileActions.isFileExists(file);
        const isDeleted = await fileActions.isFileDeleted(file);

        if (isOwner && isExists && !isDeleted) {
            return await fileActions.deleteFile(file)
        } else {
            console.error('Cannot delete file')
        }
    } catch (e) {
        throw e
    }

}

async function getUser(request, response) {
    try{
        const isex = await userActions.isUserExists(request.query.access_token);
        if (isex) {
            response.json(await userActions.getUserData(request.query.access_token));
        } else {
            return response.status(400).json({
                error: 'could not do it'
            })
        }
    } catch (e) {
        //throw e
        return response.status(400).json({
            error: e
        })
    }
}

module.exports = {
    uploadFile,
    downloadFile,
    getFileMetadata,
    updateFileMetadata,
    deleteFile,
    getUser,
    getFileByName,
    getFileById
};
