const express = require("express");
const router = express.Router();
const { uploadMedia } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", upload, uploadMedia);

module.exports = router;
