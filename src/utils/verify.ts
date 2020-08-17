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
import { query, format, escape } from '../db/dbquery';

/*
user attributes
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
course attributes
*/

let range = (val: number, low: number, high: number): string => {

  if(!val)
    return 'Please enter a number';
  if(val < low || val > high){
    return 'Must be between ' + low + ' and ' + high;
  }
  return '';
};

let title = (title: string): string => {

  if(!title)
    return 'Please enter a title';
  if(title.length > 50)
    return 'Please enter a title less than 50 characters';

  return '';
};

let custom = (input: string, name: string): string => {

  if(!input)
    return `Please enter a ${name}`;

  return '';
};

let year = (year: number): string => {

  let curryear: number = new Date().getFullYear();
  if(!year)
    return 'Please enter a year';
  if(year > curryear+10 || year < curryear-1)
    return 'Please enter year before ' + (curryear+10) + ' and after ' + (curryear-1);

  return '';
};

/*
assignment attributes
*/

//make sure all dates in array are in order
let dateorder = (dates: any[], names: string[]): string => {

  let i: number;
  for(i = 0; i < (dates.length-1); i++){
    
    let curr: Date = new Date(dates[i]);
    let next: Date = new Date(dates[i+1]);
    
    if(curr.getTime() > next.getTime()){
      return (names[i] + ' date must occur before ' + names[i+1] + ' date');
    }
  }

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

  let i: any;
  for(i in errs){
    if(errs[i]) return errs; //if we get an error, return entire object
  }

  return null; //or just return null if we have no errors

}

var all = async (fields: any): Promise<any | null> => { //<-- async as some utils do db searches for username/email availability

  let allroutines: any = { //all routines user can utilize
    email: emailinuse,
    name: name,
    password: password,
    courseyear: year,
    title: title,
    range: range
  }

  let errormessages: any = {}; //error messages we'll send back to client
  let i: any; //use as string in first loop, number in second

  for(i in fields){
    let data: any = fields[i][0], routine = fields[i][1]; //data (index 0) and verify function (index 1) to use from user
    let errmsg: string;
    errmsg = await allroutines[routine](data); //await as function may be async
    errormessages[i] = errmsg; //store the error message (or promise at this point)
  }

  console.log(errormessages);

  return anyerrors(errormessages);

};

export { 
  email,
  emailinuse,
  name,
  password,
  range,
  title,
  custom,
  year,
  dateorder,
  anyerrors,
  all 
};
