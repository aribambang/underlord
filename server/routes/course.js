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
  detailPrivate,
  videoUpload,
  videoRemove,
  addLesson,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
} = require('../controllers/course');

router.get('/courses', courses);
router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image', requireSignIn, removeImage);
router.post('/course', requireSignIn, isInstructor, create);
router.get('/course/instructor/:slug', requireSignIn, detailPrivate);
router.put('/course/:slug', requireSignIn, isInstructor, update);
router.get('/course/:slug', detail);
router.post('/course/video-upload/:instructorId', requireSignIn, formidable(), videoUpload);
router.post('/course/video-remove/:instructorId', requireSignIn, videoRemove);
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignIn, updateLesson);
router.put('/course/publish/:courseId', requireSignIn, publishCourse);
router.put('/course/unpublish/:courseId', requireSignIn, unpublishCourse);
router.put('/course/:slug/:lessonId', requireSignIn, removeLesson);
router.get('/check-enrollment/:courseId', requireSignIn, checkEnrollment);
router.post('/free-enrollment/:courseId', requireSignIn, freeEnrollment);

module.exports = router;
