/*
operations for storing user data in SQL db
*/

import { escape, format, query, unknownerr, loginerr, errorsave } from '../../db/db';
import { id } from '../../utils/utils';
import { User, DBResult, Credentials } from '../User';
import { compare } from 'bcrypt'; //for comparing passwords to hash

/*
load a user from db based on id only (used for loading from session)
*/

let load = async (user: User): Promise<DBResult> => {

    let result: DBResult = {};
    let loadquery = format(`SELECT ?? FROM users WHERE id = ?`, [user.loadOnLogin(), user.getID()]);
    
    try {
        result.data = await query(loadquery);
        result.data = result.data[0];
    } catch(err){
        errorsave(err);
        result.error = unknownerr;
    }

    return result;

};

/*
load a user from db based on login credentials
*/

let login = async (user: User): Promise<DBResult> => {

    let result: DBResult = {};

    let credentials: Credentials = user.credentials(); //get user login credentials (email, password)
    let select: string = `SELECT ?? FROM users WHERE email = ?`; //dont compare to password in query, we do that with bcrypt
    let querydata: any[] = [user.loadOnLogin(), credentials.email]; //what to load on login & login credentials
    let loginquery: string = format(select, querydata);

    try {
        result.data = await query(loginquery);
        result.data = result.data[0]; //select first entry

        if(!result.data){            //if no users found from email
            result.error = loginerr; //user email not registered, show error
            return result;           //return early as compare will break with no password
        }

        let success: boolean = await compare(credentials.password, result.data.password); //compare users password to hash in db
        if(!success) result.error = loginerr;

    } catch(err){
        errorsave(err);
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
        savequery = format(`INSERT INTO users (??) VALUES ?`, user.getInsert()); //no user in db with this id, insert new one
    
    //run, return errors if any are encountered
    try {
        await query(savequery);
    } catch(err){
        errorsave(err);
        return unknownerr; 
    }

    return null;
};

let generateID = async (): Promise<number> => {

    let userid: number;
    let valid: boolean = false; //whether we have a valid ID or not

    while(!valid){
        userid = id();
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
    login,
    save,
    generateID
};