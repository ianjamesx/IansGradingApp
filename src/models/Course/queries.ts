import * as db from '../../db/dbquery';
import { Course, DBResult } from './Course';
import { Student } from '../Student/Student';

import { keys, id, key } from '../../utils/utils';

let tablename: string = 'courses';

let load = async (course: Course): Promise<DBResult> => {
    return await db.load(course, tablename);
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
    let loadquery = db.format(`SELECT ?? FROM ${tablename} WHERE key = ?`, [keys(course.getColumns()), course.getKey()]);
    
    try {
        result.data = await db.query(loadquery);
        result.data = result.data[0];
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
        let keysearch: string = db.format(`SELECT key FROM ${tablename} WHERE key = ?`, coursekey);
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

let getAllStudents = async (course: Course): Promise<DBResult> => {

    let result: DBResult = {};

    //select all users connected to a course through junction table
    let student: Student;
    let loadquery = db.format(`SELECT ?? FROM users WHERE id IN (SELECT user FROM usercourse WHERE course = ?)`, [keys(student.getColumns()), course.getID()]);

    try {
        result.data = await db.query(loadquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

export {
    loadFromKey,
    save,
    load,
    getAllDepartments,
    generateID,
    generateKey,
    getAllStudents
}