const express = require('express');

const router = express.Router();
const { requireSignIn } = require('../middlewares');

const {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
} = require('../controllers/instructor');

router.post('/make-instructor', requireSignIn, makeInstructor);
router.post('/get-account-status', requireSignIn, getAccountStatus);
router.get('/current-instructor', requireSignIn, currentInstructor);
router.get('/instructor-courses', requireSignIn, instructorCourses);

module.exports = router;
