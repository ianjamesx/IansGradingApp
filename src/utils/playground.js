var hello = async () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)
  return result;

  //console.log(result); // "done!"
};

var hello2 = async () => {

  return await hello();

};

var start = () => {
  hello2().then((result) => {
    console.log(result);
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

var database = require('../db/db');
var db = database();

db.query('SHOW TABLES', (err, result) => {
  if (err) throw err;
  console.log(result);
});
