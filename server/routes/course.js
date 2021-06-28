const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();
const { requireSignIn, isInstructor } = require('../middlewares');

const {
  uploadImage,
  removeImage,
  create,
  detail,
  videoUpload,
  videoRemove,
  addLesson,
} = require('../controllers/course');

router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image', requireSignIn, removeImage);
router.post('/course', requireSignIn, isInstructor, create);
router.get('/course/:slug', detail);
router.post('/course/video-upload/:instructorId', requireSignIn, formidable(), videoUpload);
router.post('/course/video-remove/:instructorId', requireSignIn, videoRemove);
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson);

module.exports = router;
