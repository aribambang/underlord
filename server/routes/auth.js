const express = require('express');

const router = express.Router();
const { requireSignIn } = require('../middlewares');

const { register, login, logout, currentUser } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', requireSignIn, currentUser);

module.exports = router;
