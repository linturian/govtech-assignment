const matchAll = require("match-all");
const Student = require('../model/student.js');
const Registry = require('../model/registry.js');
const { DatabaseResultHandler } = require('../helper/database-result-handler');
const {
  ErrorHandler
} = require('../helper/error-handler');

const register = async (teacher, students) => {
  validateRequiredFields({
    teacher,
    students
  })
  const res = await Registry.register(teacher, students)
  handleDatabaseErrorIfAny(res)
  return res
}

const getCommonStudents = async (teacher) => {
  validateRequiredFields({
    teacher
  })
  const res = await Registry.getRegisteredStudents(teacher)
  handleDatabaseErrorIfAny(res)
  return res
}

const suspend = async (student) => {
  validateRequiredFields({
    student
  })
  const res = await Student.updateSuspend(student, 1)
  handleDatabaseErrorIfAny(res)
  if(res.affectedRows == 0){
    throw new ErrorHandler(422, "No such student")
  }
  return res
}

const getForNotifications = async (teacher, notification) => {
  validateRequiredFields({
    teacher,
    notification
  })
  const res = await Registry.getNonSuspendedRegisteredStudents(teacher)
  const mentioned = notification.match(/@[^\s]+/g).map(x => x.substr(1))
  const validMentioned = await Student.getNonSuspendedStudents(mentioned)
  return [...new Set([...res, ...validMentioned])]
}

const validateRequiredFields = (fields) => {
  let messages = [];
  let missingFields = [];
  Object.entries(fields).forEach(([k, v]) => {
    if (!v) {
      missingFields.push(k)
    }
  });
  if (missingFields.length > 0) {
    messages.push("Missing required field - " + missingFields.join(", "));
  }
  if (messages.length > 0) {
    throw new ErrorHandler(422, messages);
  }
}

const handleDatabaseErrorIfAny = err => {
  if (err instanceof DatabaseResultHandler && err.error) {
    if (err.value.includes('DUP_ENTRY')) {
      throw new ErrorHandler(422, "Students have registered with teacher")
    }else if (err.value.includes('NO_REFERENCED')) {
      throw new ErrorHandler(422, "No such teacher or students")
    }else{
      throw new ErrorHandler(500, "Something went wrong")
    }
  }
}

module.exports = {
  register,
  getCommonStudents,
  suspend,
  getForNotifications
};
