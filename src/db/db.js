/*
connection pooling/promise wrapper for mysql
*/

var mysql = require('mysql'); //db module
var { insertformat, updateformat, format, escape } = require('../utils/dbutils'); //include some formatting utils

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

var insert = async (table, data) => {
  var formatted = insertformat(data);
  var ins = 'INSERT INTO ' + table + ' ' + formatted.columns + ' VALUES ' + formatted.data + ';';
  var res = await query(ins);
  return res;
};

var update = async (table, data, condition) => {
  var updatedata = updateformat(data), updatecond = updateformat(condition);
  var upd = 'UPDATE ' + table + ' SET ' + formatted + ' WHERE ' + updatecond + ';';
  var res = await query(upd);
  return res;
};

module.exports = {
  query: query,
  insert: insert,
  update: update,

  //dependency injections
  escape: escape,
  format: format
};
