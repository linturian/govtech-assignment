const conn = require('../db-connection.js');
const {DatabaseResultHandler, handleDatabaseError} = require('../helper/database-result-handler');

const register = async (teacher, students) => {
  const sql = "INSERT INTO registry (teacher_id, student_id) VALUES ?";

  let registry = [];
  students.forEach(student => registry.push([teacher, student]));

  const res = await conn.query(sql, [registry]).catch(handleDatabaseError);
  return res
}

const getRegisteredStudents = async (teacher) => {
  const sql = "SELECT distinct(student_id) FROM registry WHERE teacher_id IN (?)";
  const res = await conn.query(sql, [teacher])
    .then(res => {
      return res.map(rs => rs.student_id)
    }).catch(handleDatabaseError);
  return res
}

const getNonSuspendedRegisteredStudents = async (teacher) => {
  const sql = "SELECT student_id FROM t_govtech.registry INNER JOIN student ON id = student_id WHERE teacher_id in (?) AND suspend = 0";
  const res = await conn.query(sql, [teacher])
    .then(res => {
      return res.map(rs => rs.student_id)
    }).catch(handleDatabaseError);
  return res
}

module.exports = {
  register,
  getRegisteredStudents,
  getNonSuspendedRegisteredStudents
};
