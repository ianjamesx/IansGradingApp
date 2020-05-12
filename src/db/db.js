/*
connection pooling/promise wrapper for mysql
*/

const mysql = require('mysql');

const sqlconfig = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'grade_db'
};

module.exports = (query) => {

  var conn = mysql.createPool(sqlconfig); //get a conn from the pool

  new Promise((resolve, reject) => {

    conn.query(query, (err, rows, fields) => {
      if (err) return reject(err); //on error
      resolve(rows); //result
    );

  });

  let result = await promise;
  return result;

};
