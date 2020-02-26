const mysql = require('mysql');
const util = require('util')

const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 't_govtech'
});

connection.query = util.promisify(connection.query)

module.exports = connection;
