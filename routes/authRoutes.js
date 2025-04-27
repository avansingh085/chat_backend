const express = require('express');
const router = express.Router();

const getUser = require('../services/getUser');
const { login,sign_up,logout,verifyToken } = require('../controllers/auth');

router.post('/login', login, getUser);
router.post('/sign_up', sign_up, getUser);
router.post('/logout', logout);
router.post('/verifyToken', verifyToken, getUser);

module.exports = router;
