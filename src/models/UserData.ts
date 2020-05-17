/*
operations for storing user data in SQL db
*/

import { escape, format, query, idlength, unknownerr } from '../db/db';
import { id } from '../utils/utils';
import { User, DBResult } from './User';

/*
if we encounter any DB errors
put into a log to review them later
*/

var saveDBerrors = (error: string): void => {
    
};

/*
load a user from db based on login credentials
*/

let load = async (user: User): Promise<string | any> => {

    let select: string = `SELECT ?? FROM users WHERE email = ? AND password = ?`;
    let credentials: [string, string] = user.credentials(); //get user login credentials
    let querydata: any[] = [user.loadOnLogin(), credentials[0], credentials[1]]; //what to load on login & login credentials
    let loginquery: string = format(select, querydata);
    let result: DBResult;

    try {
        result.data = await query(loginquery)[0];
        if(!result.data){ //if no user found by those credentials
            result.error = "Email or Password incorrect." //<-- invalid credentials error message
        }
    } catch(err){
        result.error = unknownerr;
    }
    return result;

};

/*
save user data
determine if they already exist, then determine whether to update or insert
*/

let save = async (user: User): Promise<string | null> => {

    let existsquery: string = format(`SELECT id FROM users WHERE id = ?`, [user.getID()]);
    let result: any[] = await query(existsquery);
    let savequery: string;

    if(result.length > 0)
        savequery = format(`UPDATE users SET ?? WHERE id = ?`, user.getUpdate()); //there is a user in the db with this email, update that user
     else 
        savequery = format(`INSERT INTO users (??) VALUES (?)`, user.getInsert()); //no user in db with this id, insert new one
    
    //run, return errors if any are encountered
    try {
        await query(savequery);
    } catch(err){
        return unknownerr; 
    }

    return null;
};

let generateID = async (): Promise<number> => {

    let userid: number;
    let valid: boolean = false; //whether we have a valid ID or not

    while(!valid){
        userid = id(idlength);
        let idsearch: string = format(`SELECT id FROM users WHERE id = ?`, userid);
        let results: any[] = await query(idsearch); //search for this ID
        if(results.length == 0) valid = true; //if no results, we have a valid unique ID
    }

    return userid;

}
/*
var getcourses_min = async (userid) => {
    var course = new Course;
    var select = `SELECT ?? FROM course WHERE id IN (
                 SELECT course FROM user_course WHERE user = ?`;
    var coursequery = format(select, [course.getcolumns_min(), userid]);
};

var getcourse_full = async (userid) => {
    var course = new Course;
    var select = `SELECT ?? FROM course WHERE id IN (
                 SELECT course FROM user_course WHERE user = ?`;
    var coursequery = format(select, [course.getcolumns_full(), userid]);
};
*/

export { 
    load,
    save,
    generateID
};