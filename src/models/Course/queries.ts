import * as db from '../../db/dbquery';
import { Course, DBResult } from './Course';

import { keys, id, key } from '../../utils/utils';

let tablename: string = 'courses';

let load = async (course: Course): Promise<DBResult> => {
    //load course data
    let dbres: DBResult = await db.load(course, tablename);
    //load instructors data
    if(!dbres.error){
        let instData: DBResult = await db.load('users', dbres.data.instructor);
        if(!instData.error){
            dbres.data.instructor = instData;
        }
    }
    return dbres;
};

let save = async (course: Course): Promise<DBResult> => {
    return await db.save(course, tablename);
};

let generateID = async (): Promise<number> => {
    return await db.generateID(tablename);
};

/*
load course data based on inputted key from user
for when student attempts to join course
*/

let loadFromKey = async (course: Course): Promise<DBResult> => {
    
    let result: DBResult = {};
    let loadquery = db.format(`SELECT ?? FROM ${tablename} WHERE coursekey = ?`, [keys(course.getColumns()), course.getKey()]);
    try {
        result.data = await db.query(loadquery);

        //see if we found any courses of that key, if we didnt, put in error
        if(result.data.length == 0){
            result.error = db.unknownerr;
        } else {
            result.data = result.data[0];
        }
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

//generate course key
let generateKey = async (): Promise<string> => {

    let coursekey: string;
    let valid: boolean = false;

    while(!valid){
        coursekey = key();
        let keysearch: string = db.format(`SELECT coursekey FROM ${tablename} WHERE coursekey = ?`, coursekey);
        console.log(keysearch);
        let results: any[] = await db.query(keysearch);
        if(results.length == 0) valid = true;
    }

    return coursekey;

};

//get all departments a course can belong to
let getAllDepartments = async (): Promise<DBResult> => {

    let result: DBResult = {};
    let loadquery = `SELECT abbreviation, name FROM departments`;
    
    try {
        result.data = await db.query(loadquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;
};

//dependency inject students
let getAllStudents = async (course: Course, student: any): Promise<DBResult> => {

    let result: DBResult = {};

    //select all users connected to a course through junction table
    let loadquery = db.format(`SELECT ?? FROM users WHERE id IN (SELECT user FROM usercourse WHERE course = ?)`, [keys(student.getColumns()), course.getID()]);

    try {
        result.data = await db.query(loadquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

let joinCourse = async(courseID: number, userID: number): Promise<DBResult> => {

    let result: DBResult = {};

    //add users connection to course through junction table
    let connquery = db.format(`INSERT INTO usercourse (user, course) VALUES (?, ?)`, [userID, courseID]);

    try {
        console.log(connquery);
        result.data = await db.query(connquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

}


export {
    loadFromKey,
    save,
    load,
    getAllDepartments,
    generateID,
    generateKey,
    getAllStudents,
    joinCourse
}