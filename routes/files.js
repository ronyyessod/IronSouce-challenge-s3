const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const fs = require("fs");
const fileController = require('../controllers/files');
const { authenticate } = require('../middleware/authentication');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (request, file, cb) {
        cb(null, `${request.params.username}_${file.originalname}`)
    }
});
const upload = multer({storage: storage});

/*
    Upload file request.
    Every request must include the following:
    1. access token - sent in a header called "x-access-token"
    2. username - sent in the body as a key called "user"

    An upload request must also include a file to upload as a key in the body called "file".

    TODO: I could have validated the file access here OR in uploadFile
 */
router.post('/:username', upload.single("file"), authenticate, async function(request, response) {
    const file = {
        id: shortid.generate(),
        name: `${request.params.username}_${request.file.originalname}`,
        size: request.file.size,
        access: request.body.access,
        accessToken: request.header('x-access-token'),
        path: `/uploads/${request.params.username}_${request.file.originalname}`
    };
    const user = {
        name: request.params.username,
        accessToken: request.header('x-access-token')
    };
    try {
        const res = await fileController.uploadFile(user, file);
        response.send(res)
    } catch (e) {
        response.status(500).json({message: e})
    }
});


/*
    Download file request.

    TODO: I implemented differently:
    1. access token is being passed in every single request for authentication, hence I found it to be redundant
    to send it again as a query param.
    2. due to 1, I supported validation in downloadFile function.
    3. my implementation forces you to send your username as request parameter (as seen in the following request)
    meaning that if you are user1 and wants to download a public file of user2, you need to:
    /user1/<user2_public_file_name>

    I could have done a better job implementing status code returns, so it'll be more according to RESTful API
    conventions.

    all other constrains has been implemented.
 */
router.get('/:username/:fileId', async function(request, response) {
    try {
        const file = await fileController.getFileById(request.params.fileId);
        const user = {
            name: request.params.username,
            accessToken: request.header('x-access-token')
        };
        const path = await fileController.downloadFile(file, user);
        if (path) {
            return response.download(`${__dirname}/../${path}`)
        } else {
            response.status(400).json({message: 'Bad request, you are not permitted to access file'})
        }
    } catch (e) {
        response.status(404).json({message: e})
    }
});

/*
    Update file access.
 */
router.put('/:username/:fileId/:access', async function(request, response) {
    try {
        const file = await fileController.getFileById(request.params.fileId);
        const user = {
            name: request.params.username,
            accessToken: request.header('x-access-token')
        };
        const access = request.params.access;
        const res = await fileController.updateFileMetadata(file, user, access);
        if (res) {
            response.send(res)
        } else {
            response.status(400).json({message: 'Bad request, you are not permitted to access file'})
        }
    } catch (e) {
        response.status(400).json({message: e})
    }
});

/*
    Delete file
 */
router.delete('/:username/:fileId', async function (request, response) {
    try {
        const file = await fileController.getFileById(request.params.fileId);
        const user = {
            name: request.params.username,
            accessToken: request.header('x-access-token')
        };
        const res = await fileController.deleteFile(file, user);
        if (res) {
            fs.unlink(`${__dirname}/../${res.path}`, function (err) {
                if (err) {
                    response.status(500).json({message: err})
                } else {
                    response.send(res)
                }
            })
        } else {
            response.status(404).json({message: 'File not found'})
        }
    } catch (e) {
        response.status(404).json({message: e})
    }
});

module.exports = router;
