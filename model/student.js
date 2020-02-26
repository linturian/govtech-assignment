const conn = require('../db-connection.js');
const {DatabaseResultHandler, handleDatabaseError} = require('../helper/database-result-handler');

const updateSuspend = async (student, suspend) => {
  const sql = "UPDATE student SET suspend = ? WHERE id = ?";

  const res = await conn.query(sql, [suspend, student]).catch(handleDatabaseError);
  return res
}

const getNonSuspendedStudents = async (students) => {
  const sql = "SELECT id FROM student WHERE id IN (?) AND suspend = 0";
  const res = await conn.query(sql, [students])
    .then(res => {
      return res.map(rs => rs.id)
    })
    .catch(handleDatabaseError);
  return res
}

module.exports = {
  updateSuspend,
  getNonSuspendedStudents
};
