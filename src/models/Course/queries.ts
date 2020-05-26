import { escape, format, query, unknownerr, loginerr, errorsave } from '../../db/db';
import { Course, DBResult } from './Course';
import { id, key } from '../../utils/utils';

let loadFromKey = async (course: Course): Promise<DBResult> => {
    
    let result: DBResult = {};
    let loadquery = format(`SELECT ?? FROM courses WHERE key = ?`, [course.onLoad(), course.getKey()]);
    
    try {
        result.data = await query(loadquery);
        result.data = result.data[0];
    } catch(err){
        errorsave(err);
        result.error = unknownerr;
    }

    return result;

};

let generateID = async (): Promise<number> => {

    let courseid: number;
    let valid: boolean = false; //whether we have a valid ID or not

    while(!valid){
        courseid = id();
        let idsearch: string = format(`SELECT id FROM courses WHERE id = ?`, courseid);
        let results: any[] = await query(idsearch); //search for this ID
        if(results.length == 0) valid = true; //if no results, we have a valid unique ID
    }

    return courseid;

};

let generateKey = async (): Promise<string> => {

    let coursekey: string;
    let valid: boolean = false;

    while(!valid){
        coursekey = key();
        let keysearch: string = format(`SELECT id FROM users WHERE id = ?`, coursekey);
        let results: any[] = await query(keysearch);
        if(results.length == 0) valid = true;
    }

    return coursekey;

}

let save = async (course: Course): Promise<string | null> => {

    let existsquery: string = format(`SELECT id FROM courses WHERE id = ?`, [course.getID()]);
    let result: any[] = await query(existsquery);
    let savequery: string;

    if(result.length > 0)
        savequery = format(`UPDATE courses SET ?? WHERE id = ?`, course.getUpdate()); //there is a user in the db with this email, update that user
     else 
        savequery = format(`INSERT INTO courses (??) VALUES ?`, course.getInsert()); //no user in db with this id, insert new one
    
    //run, return errors if any are encountered
    try {
        await query(savequery);
    } catch(err){
        errorsave(err);
        return unknownerr; 
    }

    return null;

};

//get all departments a course can belong to
let getAllDepartments = async (): Promise<DBResult> => {
    let result: DBResult = {};
    let loadquery = `SELECT id, name, abbreviation FROM departments`;
    
    try {
        result.data = await query(loadquery);
    } catch(err){
        errorsave(err);
        result.error = unknownerr;
    }

    return result;
}

export {
    loadFromKey,
    save,
    getAllDepartments,
    generateID,
    generateKey
}