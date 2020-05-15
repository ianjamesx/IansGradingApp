var db = require('../db/data');
var verify = require('../utils/verify');
var { vals, keys } = require('../utils/utils');

var bcrypt = require('bcrypt');

class User {

  constructor(email, password, firstname, lastname){
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  async verifyuserdata(){

    var errmsgs = await verify.all({
      email: [this.email, 'email'],
      firsname: [this.firstname, 'name'],
      lastname: [this.lastname, 'name'],
      password: [this.password, 'password'],
    });

    return errmsgs;

  }

  async saveuserdata(){
    //first, see if we have any errors in our user data
    var errs = await verifyuserdata();
    if(errs)
      return errs;

    var inserterr = await db.insert(this.getuserdata()); //save in db, get any db errs
    if(inserterr)
      return inserterr;
    return null; //no errors encountered, return null
  }

  async login(){
    return await db.userlogin(this.email, this.pass);
  }

  //ensure users credentials are valid
  async veryifycredentials(){
    var loginresult = await this.login();
    if(!loginresult.error)
      return true;
    return false;
  }

  async encryptpassword(){

    var saltRounds = 5;
    var salt = await bcrypt.genSalt(saltRounds);
    var hash = await bcrypt.hash(this.password, salt);
    this.hash = hash;
    return hash;

  }

  //get users courses
  async getcourses(){
    if(await !this.veryifycredentials()) return;
  }

  getdbdata(){

    return {
      email: this.email,
      password: this.hash,
      firstname: this.firstname,
      lastname: this.lastname
    };

  }

  /*
  portions formatted to work with SQLString library
  */

  logincredentials(){
    return {
      email: this.email,
      password: this.hash
    };
  }

  loadonlogin(){
    return [keys(this.getdbdata())];
  }

  getinsert(){
    return [
      [keys(this.getdbdata())],
      [vals(this.getdbdata())]
    ];
  }

  getupdate(){
    return [
      this.getdbdata(),
      this.id
    ];
  }

};

module.exports = User;
