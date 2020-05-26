/*
operations for storing user data in SQL db
*/

import * as db from '../../db/dbquery';
import { vals, keys, id } from '../../utils/utils';
import { User, DBResult, Credentials } from './User';
import { compare } from 'bcrypt';

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