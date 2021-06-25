const express = require('express');

const router = express.Router();
const { requireSignIn, isInstructor } = require('../middlewares');

const { uploadImage, removeImage, create } = require('../controllers/course');

router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image', requireSignIn, removeImage);
router.post('/course', requireSignIn, isInstructor, create);

module.exports = router;
