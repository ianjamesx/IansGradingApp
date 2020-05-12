var db = require('../db/data');
var verify = require('../utils/verify');

class User {

  constructor(email, password, firstname, lastname, instructor){
    this.email = email;
    this.password = password;
    this.firstname = fname;
    this.lastname = lname;
    this.instructor = instructor;
  }

  async verifyuserdata(){

    var errormessages = await verify.all({
      email: [this.email, 'email'],
      firsname: [this.firstname, 'name'],
      lastname: [this.lastname, 'name'],
      password: [this.password, 'password'],
    });

    return errormessages

  }

  async saveuserdata(){

    //first, see if we have any errors in our user data
    var errs = verifyuserdata();
    if(errs)
      return errs;

    var inserterr = await db.insertuser(this.getuserdata()); //save in db, get any db errs
    if(inserterr)
      return inserterr;

    return null;

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

  //get users courses
  async getcourses(){
    if(await !this.veryifycredentials()) return;

  }

  getuserdata(){

    return {
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      instructor: this.instructor
    };

  }


};

module.exports = User;
