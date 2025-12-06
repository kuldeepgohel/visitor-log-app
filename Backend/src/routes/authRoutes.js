const express = require('express');
const router = express.Router();
const { register, login, me} = require('../controllers/authController');
const authMw = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

router.post('/auth/register',authMw, requireRole(['admin']),register);
router.post('/auth/login',login);
router.get('/auth/me', authMw , me);

module.exports = router;