const express = require('express');
const router = express.Router();
const StudentService = require('../service/student-service.js');

/* POST register students */
router.post('/register', async (req, res, next) => {
  const teacher = req.body.teacher;
  const students = req.body.students;
  await StudentService.register(teacher, students)
  res.status(204).send();
});

/* GET get common students */
router.get('/commonstudents', async (req, res, next) => {
  const teacher = req.query.teacher;
  const students = await StudentService.getCommonStudents(teacher)
  res.status(200).json({
    students
  });
});

/* POST suspend a student*/
router.post('/suspend', async (req, res, next) => {
  const s = req.body.student;
  await StudentService.suspend(s)
  res.status(204).send();
});

/* POST suspend a student*/
router.post('/retrievefornotifications', async (req, res, next) => {
  const teacher = req.body.teacher;
  const notification = req.body.notification;
  const recipients = await StudentService.getForNotifications(teacher, notification)
  res.status(200).json({
    recipients
  });
});


module.exports = router;
