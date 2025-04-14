const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadDisk');
const uploadImage = require('../services/uploadImage');

router.post('/upload', upload, uploadImage);

module.exports = router;
