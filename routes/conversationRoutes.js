const express = require('express');
const router = express.Router();
const createConversation = require('../services/createConversation');
const updateProfile = require('../services/updateProfile');

router.post('/newConversation', createConversation);
router.post('/updateProfile', updateProfile);

module.exports = router;
