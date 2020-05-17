import * as db from './UserData';
import verify = require('../utils/verify');       //validator wrapper
import { vals, keys } from '../utils/utils';      //some utils for restructuring data
import { hash as generatehash } from 'bcrypt';    //password encryption

/*
interfaces for this class
*/

//user input errors when making this class
interface Errors {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

//DB results for select quieries
interface DBResult {
  error: string; //any db errors
  data: any;     //result from db
}

class User {

  private email: string;
  private password: string;
  private firstname: string;
  private lastname: string;
  private hash: string;     //hashed password
  private id: number;

  //constructor
  //notice all params are optional as you can load data from session: userFromSession(email, hash)
  //if you are loading data from a session rather than from a user
  constructor(email?:string, password?:string, firstname?:string, lastname?:string){
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  //as typescript is yet to support constructor overloading, use static methods as alternatives
  public async loginFromSession(email: string, hash: string): Promise<string | void>{
    this.email = email;
    this.hash = hash;
    return this.login(); //after we get data from session, login
  }

  private async verify(): Promise<Errors> {

    let errs: Errors = await verify.all({
      email:    [this.email, 'email'],
      firsname: [this.firstname, 'name'],
      lastname: [this.lastname, 'name'],
      password: [this.password, 'password'],
    });

    return errs;

  }

  public async save(): Promise<Errors | string | void> {
    let errs: Errors = await this.verify(); //first, see if we have any errors in user inputted data
    if(errs) return errs;

    //if we dont have a hash, get it from current password
    if(!this.hash) await this.encryptPassword();

    let inserterr: string | null = await db.save(this); //save in db, return any db errors or null if no errs
    if(inserterr) return inserterr;
  }

  public async login(): Promise<string | void> {
    let result: DBResult = await db.load(this);
    if(result.error) return result.error; //if we get an error

    //save all data in this object
    this.email = result.data.email;
    this.hash = result.data.password;
    this.firstname = result.data.firstname;
    this.lastname = result.data.lastname;
    this.id = result.data.id;
  }

  private async generateID(): Promise<void> {
    this.id = await db.generateID();
  }

  async encryptPassword(): Promise<void> {
    let saltRounds: number = 5;
    this.hash = await generatehash(this.password, saltRounds);
  }

  //get users courses
  async getCourses(){

  }

  public getColumns(): any {

    return {
      email: this.email,
      password: this.hash, //<-- save hash instead of actual password
      firstname: this.firstname,
      lastname: this.lastname,
      id: this.id
    };

  }

  /*
  portions formatted to work with SQLString library
  */

  public getID(): number {
    return this.id;
  }

  public credentials(): any { //login credentials
    return {
      email: this.email,
      password: this.hash
    };
  }

  public loadOnLogin(): any {
    return [keys(this.getColumns())]; //load all columns on login
  }

  public getInsert(): any {
    return [
      [keys(this.getColumns())], //keys aligned to column names
      [vals(this.getColumns())]  //vals aligned to values we insert
    ];
  }

  public getUpdate(): any {
    return [
      this.getColumns(),
      this.id
    ];
  }

};

export {
  User,
  DBResult
};
