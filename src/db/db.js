/*
connection pooling/promise wrapper for mysql
*/

var mysql = require('mysql'); //db module
var { format, insert, update } = require('../utils/dbutils'); //include some formatting utils

var sqlconfig = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'grade_db'
};

/*
get results from a single query from db
*/

var query = async (query) => {

  var conn = mysql.createPool(sqlconfig); //get a conn from the pool
  let promise = new Promise((resolve, reject) => { //promise wrapper for sql queries
    conn.query(query, (err, rows, fields) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  let result = await promise;
  return result;

};

module.exports = {
  query: query,
  insert: insert
};
