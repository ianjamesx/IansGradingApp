/*
var hello = async () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)
  console.log('promise:');
  console.log(result);
  return result;

  //console.log(result); // "done!"
};

var hello2 = async () => {
  return await hello();
};

var start = () => {
  hello2().then((result) => {
    //console.log(result);
  });
};

var valid = async () => {

  var verify = require('./verify');

  var errmsgs = await verify.all({
    email: ['hell@h2.com', 'email'],
    firsname: ['ian', 'name'],
    lastname: ['thomas', 'name'],
    password: ['1234Dgdf', 'password'],
  });

  return errmsgs;

};

start();
valid().then(console.log);
*/

/*

db.query('SELECT * FROM users').then(result => {

}).catch(err => {
  console.log("WE GOT AN ERR")
});

setTimeout(() => {
  console.log('------------------------');
  db.query('SELECT 1+1 AS result').then(result => {
    console.log(result.length);
  });
  db.query('SHOW TABLES').then(res => {
    console.log(res.length);
  });
}, 2000);*/

/*
import { saveCategories } from '../models/Course/queries';

let examp: any = {
  21312: {name: 'test', points: 12},
  95435: {name: 'hello', points: 53}
}

saveCategories(examp, 543341).then();*/
/*
import * as db from '../db/dbquery';
let arr: any[] = [[43,1], [64, 23]];
let savequery = db.format(`INSERT INTO course_categories (name, points, course) VALUES ?`, [arr]);
console.log(savequery);

*/

import { Course } from '../models/Course/Course';
import { Assignment } from '../models/Assignment/Assignment';


let test = async (): Promise<void> => {

  let course: Course = new Course();
  await course.loadCourseByID(37547264);

  await course.getAllAssignments();

  //let assign: Assignment = new Assignment();
  //await assign.loadFromID(27154755);

  //console.log(await assign.getQuestionIDs());

}

test();


/*
import { tablekeys } from './utils';

let x = {
  prop1: 'he',
  prop2: 'ka'
};

console.log(tablekeys(x, 'q'));
*/
//test();