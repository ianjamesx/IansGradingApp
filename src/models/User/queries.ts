/*
operations for storing user data in SQL db
*/

import * as db from '../../db/dbquery';
import { vals, keys, id } from '../../utils/utils';
import { User, DBResult, Credentials } from './User';
import { compare } from 'bcrypt';

import { Course } from '../Course/Course';
import { Assignment } from '../Assignment/Assignment';

let tablename: string = 'users';

let load = async (user: User): Promise<DBResult> => {
    return await db.load(user, tablename);
};

let save = async (user: User): Promise<DBResult> => {
    return await db.save(user, tablename);
};

let generateID = async (): Promise<number> => {
    return await db.generateID(tablename);
};


/*
load a user from db based on login credentials
*/

let login = async (user: User): Promise<DBResult> => {

    let result: DBResult = {};

    let credentials: Credentials = user.credentials(); //get user login credentials (email, password)
    let select: string = `SELECT ?? FROM ${tablename} WHERE email = ?`; //dont compare to password in query, we do that with bcrypt
    let querydata: any[] = [keys(user.getColumns()), credentials.email]; //what to load on login & login credentials
    let loginquery: string = db.format(select, querydata);

    try {
        result.data = await db.query(loginquery);
        result.data = result.data[0]; //select first entry

        console.log(result.data);

        if(!result.data){            //if no users found from email
            result.error = db.loginerr; //user email not registered, show error
            return result;           //return early as compare will break with no password
        }

        let success: boolean = await compare(credentials.password, result.data.password); //compare users password to hash in db
        if(!success) result.error = db.loginerr;

    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

//get all courses this user is enrolled in/instructing
let getAllCourses = async (user: User): Promise<DBResult> => {
    
    let result: DBResult = {};
    let course: Course = new Course();
    let select = `SELECT ?? FROM courses WHERE id IN (SELECT course FROM usercourse WHERE user = ?)`;
    let coursequery = db.format(select, [keys(course.getColumns()), user.getID()]);

    try {
        result.data = await db.query(coursequery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

//get all assignents this user has coming up
let getAllAssignments = async (user: User): Promise<DBResult> => {
    
    let result: DBResult = {};
    let assingment: Assignment = new Assignment();
    let select = `SELECT ?? FROM assignments WHERE course IN (SELECT course FROM usercourse WHERE user = ?)`;
    let assignmentquery = db.format(select, [keys(assingment.getColumns()), user.getID()]);

    try {
        result.data = await db.query(assignmentquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

}; 

export { 
    load,
    login,
    save,
    generateID,
    getAllCourses,
    getAllAssignments
};