import * as db from './queries';
import verify = require('../../utils/verify');       //validator wrapper
import { vals, keys } from '../../utils/utils';      //some utils for restructuring data
import { hash as generatehash } from 'bcrypt';    //password encryption

/*
interfaces for this class
*/

//user input errors when making this class
interface Errors {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  any?: string; //<-- errors when inserting into db, not based on user input
}

//DB results for select quieries
interface DBResult {
  error?: string; //any db errors
  data?: any;     //result from db
}

interface Credentials {
  email: string;
  password: string;
}

interface UserSession {
  id: number;
}

class User {

  protected email: string;
  protected password: string;
  protected firstname: string;
  protected lastname: string;
  protected instructor: number;
  protected hash: string; //hashed password
  protected id: number;

  constructor(email?:string, password?:string, firstname?:string, lastname?:string, instructor?: number){
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.instructor = instructor;
  }

  /*

  user session interaction, either loading user data from session (which contain User ID) or loading User ID to session

  */

  public getIDFromSession(session: any): number {
    if(!session.user){
      return null;
    }
    return session.user.id;
  }

  //load user from an id stored in session
  public async sessionLoad(session: any): Promise<string | void> {
    
    if(!session.user) return 'Error: user has no session'; //<-- this error never displayed to client, they only get a 404
    return await this.loadFromID(session.user.id);

  }

  public async loadFromID(id: number): Promise<string | void> {

    this.id = id;
    let result: DBResult = await db.load(this);

    if(result.error) return result.error; //error here most likely caused by user having no active session
    this.loadtouser(result.data);

  }

  public setSession(session: any): void {
    let sess: UserSession = {
      id: this.getID()
    };

    session.user = sess;
  }

  public loadtouser(data: any){
    this.email = data.email;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.id = data.id;
    this.instructor = data.instructor;
  }

  /*

  saving/verification of user inputted data

  */

  private async verify(): Promise<any | null> {
    
    let errs: Errors = {
      email: await verify.emailinuse(this.email),
      firstname: verify.name(this.firstname),
      lastname: verify.name(this.lastname),
      password: verify.password(this.password)
    };

    return verify.anyerrors(errs);

  }

  public async save(): Promise<Errors | void> {

    let errs: Errors = {};
    errs = await this.verify(); //first, see if we have any errors in user inputted data
    if(errs)
      return errs;
    
    if(!this.hash) await this.encryptPassword(); //if we dont have a hash, get it from current password
    if(!this.id) await this.generateID();        //if we dont have an ID either, generate one

    let dberr: DBResult = await db.save(this); //save in db, return any db errors or null if no errs
    if(dberr.error)
      return { any: dberr.error };
  }

  public async login(req: any): Promise<string | void> {
    let result: DBResult = {};
    result = await db.login(this);
    if(result.error) return result.error; //if we get an error
    this.loadtouser(result.data);         //save all data in this object
    this.setSession(req);                 //load data to session
  }

  /*

  ID generation/password encryption

  */

  private async generateID(): Promise<void> {
    this.id = await db.generateID();
  }

  private async encryptPassword(): Promise<void> {
    let saltRounds: number = 5;
    this.hash = await generatehash(this.password, saltRounds);
  }

  /*
  for getting course content
  */

  public async getAllCourses(): Promise<any> {

    let coursedata: DBResult = await db.getAllCourses(this);
    return coursedata;
    
  }

  /*

  general getters, for db inserts, or interfaces

  */

  public getColumns(): any {

    return {
      email: this.email,
      password: this.hash, //when retrieving password to store, only retrieve hash
      firstname: this.firstname,
      lastname: this.lastname,
      instructor: this.instructor ? 1 : 0,
      id: this.id
    };

  }

  public dataView(): any {

    return {
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      instructor: this.instructor ? 1 : 0,
      id: this.id
    };

  }

  public getFN(): string {
    return this.firstname;
  }

  public getLN(): string {
    return this.lastname;
  }

  public getID(): number {
    return this.id;
  }

  //determine if instructor or not
  public isInstructor(): number {
    return this.instructor;
  }

  public credentials(): any { //login credentials
    let creds: Credentials = {
      email: this.email,
      password: this.password
    }
    return creds;
  }

};

export {
  User,
  DBResult,
  Credentials,
  UserSession
};
