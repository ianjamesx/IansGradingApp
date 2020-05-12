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

var db = require('../db/db');

db.query('SHOW TABLES').then(result => {
  console.log(result);
});

db.insert('users', {
  greeting: "Hello!",
  farewell: "Goodbye! now!",
  time: 13,
  isonline: 0
}).then(res => {
  console.log(res);
});
