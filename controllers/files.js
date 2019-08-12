const userActions = require('../models/users');
const fileActions = require('../models/files');

async function uploadFile(userName, accessToken, name, size, accessType, filePath) {
    try {
        const is_exists = await userActions.isUserExists(accessToken);
        if (is_exists) {
            return await fileActions.addFile(userName, accessToken, name, size, accessType, filePath)
        } else {
            console.error('User is not supported')
        }
    } catch (e) {
        throw e
    }
}

async function downloadFile(fileId, accessToken) {
    try {
        const isOwner = await fileActions.isUserOwner(fileId, accessToken);
        const isFileAccessible = await fileActions.isAccessible(fileId, accessToken);
        const isExists = await fileActions.isFileExists(fileId);
        const isDeleted = await fileActions.isFileDeleted(fileId);

        if ((isOwner || isFileAccessible) && isExists && !isDeleted) {
            return await fileActions.getFile(fileId, accessToken).path
        } else {
            console.error('File cannot be downloaded')
        }
    } catch (e) {
        throw e
    }

}

async function getFileMetadata(fileId, accessToken) {
    try {
        const isOwner = await fileActions.isUserOwner(fileId, accessToken);
        const isFileAccessible = await fileActions.isAccessible(fileId, accessToken);
        const isExists = await fileActions.isFileExists(fileId);

        if ((isOwner || isFileAccessible) && isExists) {
            return await fileActions.getFileMetadata(fileId, accessToken)
        } else {
            console.error('Cannot get file metadata')
        }
    } catch (e) {
        throw e
    }

}

async function updateFileMetadata(fileId, accessToken, access) {
    const accessLow = access.toLowerCase();

    try {
        const isOwner = await fileActions.isUserOwner(fileId, accessToken);
        const isExists = await fileActions.isFileExists(fileId);
        const isDeleted = await fileActions.isFileDeleted(fileId);
        const isValid = ['private', 'public'].includes(accessLow);

        if (isOwner && isExists && !isDeleted && isValid) {
            return await fileActions.updateFileAccess(fileId, accessLow, accessToken)
        } else {
            console.error('Cannot update file metadata')
        }
    } catch (e) {
        throw e
    }

}

async function deleteFile(fileId, accessToken) {
    try {
        const isOwner = await fileActions.isUserOwner(fileId, accessToken);
        const isExists = await fileActions.isFileExists(fileId);
        const isDeleted = await fileActions.isFileDeleted(fileId);

        if (isOwner && isExists && !isDeleted) {
            return await fileActions.deleteFile(fileId, accessToken)
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
            console.error('this is an error')
        }
    } catch (e) {
        throw e
    }
}

module.exports = {
    uploadFile,
    downloadFile,
    getFileMetadata,
    updateFileMetadata,
    deleteFile,
    getUser,
};
