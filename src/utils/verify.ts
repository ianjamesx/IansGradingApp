/*

VERIFICATIONS

just so we dont have to implement any verifications in models/controller
also verify some fields to the db to make sure they're not taken (e.g. email, username)

how verification functions work;
  return empty string if everything checks out
  return error message otherwise

*/

import validator = require('validator');
import passwordValidator = require('password-validator');
import { query, format, escape } from '../db/db';

/*
conditions to use email:
  must be in email format

emailinuse checks condition and if email is currently in database (for making new users)
*/

let email = (email: string): string => {
  if(!validator.isEmail(email))
    return 'That is not a valid email address';
  return '';
};


let emailinuse = async (email) => {
  if(!validator.isEmail(email))
    return 'That is not a valid email address';
  let dbquery: string = format(`SELECT * FROM users WHERE email = ?`, email);
  let dbresult: any = await query(dbquery);
  if(dbresult.length)
    return 'This email address is already in use';
  return '';
};


/*
first/last names
  alphabetic chars only
  between 2 - 30 chars
*/
let name = (name: string): string => {

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

let password = (password: string): string => {

  if(!password)
    return 'Please enter a password';

  let passreq: any = new passwordValidator();
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

let anyerrors = (errs: any): any | null => {

  let i;
  for(i in errs){
    if(errs[i]) return errs; //if we get an error, return entire object
  }

  return null; //or just return null if we have no errors

}
/*
 let parseErrors = async (errors: any): Promise<any> => { //parse promises that resolve to errors

  let errorProm = new Promise((resolve, reject) => {
    let i;
    for(i in errors){
      if(typeof errors[i] == 'object'){
        console.log('parsing prop ' + i);
         Promise.resolve(errors[i]).then(err => {
          errors[i] = err;
        }).then(() => {
          resolve(errors);
        });
        break;
      }
    }
  });

  return errorProm;
}
*/

var all = async (fields: any): Promise<any | null> => { //<-- async as some utils do db searches for username/email availability

  let allroutines: any = { //all routines user can utilize
    email: emailinuse,
    name: name,
    password: password
  }

  let errormessages: any = {}; //error messages we'll send back to client
  let i: any; //use as string in first loop, number in second

  for(i in fields){
    let data: any = fields[i][0], routine = fields[i][1]; //data (index 0) and verify function (index 1) to use from user
    var errmsg: string;
    errmsg = await allroutines[routine](data); //await as function may be async
    errormessages[i] = errmsg; //store the error message (or promise at this point)
  }

  return anyerrors(errormessages);

};

export { 
  email,
  name,
  password,
  anyerrors,
  all 
};
