const express = require("express");
const postController = require("../controllers/files");

const router = express.Router();

// router.get("/", postController.getPosts);
router.get("/", postController.getUser);

module.exports = router;

// manages all routes using the controllers