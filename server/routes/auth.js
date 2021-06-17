const express = require('express');

const router = express.Router();
const { requireSignIn } = require('../middlewares');

const {
  register,
  login,
  logout,
  currentUser,
  sendEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', requireSignIn, currentUser);
router.get('/send-email', sendEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
