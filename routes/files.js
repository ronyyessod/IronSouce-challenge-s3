const express = require("express");
const fileController = require("../controllers/files");
const router = express.Router();

router.get("/", fileController.getUser);

module.exports = router;

// manages all routes using the controllers