const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();
const { requireSignIn, isInstructor } = require('../middlewares');

const {
  uploadImage,
  removeImage,
  create,
  update,
  detail,
  videoUpload,
  videoRemove,
  addLesson,
  removeLesson,
  updateLesson,
} = require('../controllers/course');

router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image', requireSignIn, removeImage);
router.post('/course', requireSignIn, isInstructor, create);
router.put('/course/:slug', requireSignIn, isInstructor, update);
router.get('/course/:slug', detail);
router.post('/course/video-upload/:instructorId', requireSignIn, formidable(), videoUpload);
router.post('/course/video-remove/:instructorId', requireSignIn, videoRemove);
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignIn, updateLesson);
router.put('/course/:slug/:lessonId', requireSignIn, removeLesson);

module.exports = router;
