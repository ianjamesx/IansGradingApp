/*

VERIFICATIONS

just so we dont have to implement any verifications in models/controller
also verify some fields to the db to make sure they're not taken (e.g. email, username)

how verification functions work;
  return empty string if everything checks out
  return error message otherwise

*/

var validator = require('validator');
var passvalid = require('password-validator');
var db = require('../db/data');

/*
conditions to use email:
  must be in email format
  must not be in use
*/

var email = async (email) => {
  if(!validator.isEmail(email))
    return 'That is not a valid email address';
  if(await db.emailinuse(email))
    return 'This email address is already in use';

  return '';
};

/*
first/last names
  alphabetic chars only
  between 2 - 30 chars
*/
var name = (name) => {

  if(!name)
    return 'Please enter a name';
  if(!(validator.isAlpha(name)))
    return 'Please enter a name using only alphabetic characters';
  if(name.length < 2)
    return 'Name has to be at least two characters';
  if(name.length > 30)
    return 'Please limit name entry to 30 characters';

  return '';
};

/*
password conditions:
  eight characters
  one capital letter
  one lowercase letter
  one number
*/

var password = (password) => {

  if(!pass)
    return 'please enter a password';

  var passreq = new passwordValidator();
  passreq
  .is().min(8)            // Minimum length 8
  .is().max(256)          // Maximum length 100
  .has().uppercase()      // Must have uppercase letters
  .has().lowercase()      // Must have lowercase letters
  .has().digits()         // Must have digits

  if(!passreq.validate(password))
    return 'Password requirements: at least 8 characters, one uppercase letter, one lowercase letter, one number';

  return '';

};

/*
determine if we have any errors when passed an object of errors
for example, this object has an error:
{
  email: '',
  name: 'please enter name'
}

object with all blank attributes is error free
*/

var anyerrors = (errs) => {

  var i;
  for(i in errs){
    if(i) return errs; //if we get an error, return entire object
  }

  return null; //or just return null if we have no errors

}

var all = async (fields) => {

  var allroutines = { //all routines user can utilize
    email: email,
    name: name
  }

  var errormessages = {}; //eror messages we'll send back to client
  var i;

  for(i in fields){
    var data = fields[i][0], routine = fields[i][1]; //data (index 0) and verify function (index 1) to use from user

    //need to determine if function is async or not before calling (so we know if we have to await)
    var isasync = allroutines[routine].constructor.name === "AsyncFunction";
    var errmsg;

    if(isasync)
      errmsg = await allroutines[routine](data); //call their verify function with their data
    else
      errmsg = allroutines[routine](data);

    errormessages[i] = errmsg; //store the error message
  }

  return anyerrors(errormessages);

};
