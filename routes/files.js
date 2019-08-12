const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const fileController = require('../controllers/files');
const { authenticate } = require('../middleware/authentication');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (request, file, cb) {
        cb(null, `${request.body.user}_${file.originalname}`)
    }
});
const upload = multer({storage: storage});

//router.get('/', fileController.getUser);

router.post('/', upload.single("file"), authenticate, async function(request, response) {
    const file = {
        id: shortid.generate(),
        name: `${request.body.user}_${request.file.originalname}`,
        size: request.file.size,
        access: request.body.access,
        accessToken: request.header('x-access-token'),
        path: `/uploads/${request.body.user}_${request.file.originalname}`
    };
    const user = {
        name: request.body.user,
        accessToken: request.header('x-access-token')
    };
    try {
        const res = await fileController.uploadFile(user, file);
        response.send(res)
    } catch (e) {
        response.status(500).json({message: e})
    }
});

module.exports = router;
