const express = require('express');

const router = express.Router();
const { requireSignIn } = require('../middlewares');

const { makeInstructor, getAccountStatus } = require('../controllers/instructor');

router.post('/make-instructor', requireSignIn, makeInstructor);
router.post('/get-account-status', requireSignIn, getAccountStatus);

module.exports = router;
