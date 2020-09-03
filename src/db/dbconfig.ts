/*
connection pooling/promise wrapper for mysql
*/

import mysql = require('mysql'); //db module
import { DBResult } from './dbquery';

/*
MySQL database configuration

for DarkRock/Silver:

also, cmd for silver mySQL access: /usr/local/mysql/bin/mysql -u root -p

let sqlconfig: any = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'grade_db'
};

for SUSE III:

let sqlconfig: any = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'grade_db'
};

*/

let sqlconfig: any = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'grade_db'
};

let unknownerr: string = `Ah! Something went wrong. We saved this error and we're looking into it. Please try again later.`; //error message when anything in database goes wrong
let loginerr: string = `Email or password incorrect`;

/*
promise wrapper for performing SQL queries
*/
let query = async (query): Promise<any> => {

  let conn = mysql.createPool(sqlconfig);
  let promise = new Promise((resolve, reject) => {
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

/*
wrapper for returning results from a database query
*/
let dbquery = async (sqlquery): Promise<DBResult> => {

  let result: DBResult = {};

  try {
    result.data = await query(sqlquery);
  } catch(err){
    errorsave(err);
    result.error = unknownerr;
  }

  return result;

}

export {
  query,
  dbquery,
  errorsave,
  unknownerr,
  loginerr,
};
