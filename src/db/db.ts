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

let unknownerr: string = `Ah! Something went wrong. We saved this error and we're looking into it. Please try again later.`; //error message when anything in database goes wrong
let loginerr: string = `Email or password incorrect`;

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

let errorsave = (error: string): void => {
  console.log(error);
};

export {
  query,
  errorsave,
  format,
  escape,
  unknownerr,
  loginerr,
};
