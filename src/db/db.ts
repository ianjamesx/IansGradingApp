/*
connection pooling/promise wrapper for mysql
*/

import mysql = require('mysql'); //db module
import { format, escape } from 'sqlstring'; //formatting utils (export these for datbase utils)

/*
MySQL database configuration
*/

let sqlconfig: any = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'grade_db'
};

let idlength: number = 10; //specify length of ids in the database
let unknownerr: string = "Ah! Something went wrong. We saved this error and we're looking into it. Please try again later."; //error message when anything in database goes wrong

/*
get results from a single query from db
*/
let query = async (query): Promise<any> => {

  let conn = mysql.createPool(sqlconfig); //get a conn from the pool
  let promise = new Promise((resolve, reject) => { //promise wrapper for sql queries
    conn.query(query, (err, rows, fields) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  return await promise;

};

export {
  query,
  format,
  escape,
  idlength,
  unknownerr
};
