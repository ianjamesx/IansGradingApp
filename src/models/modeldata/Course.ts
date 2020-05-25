import { escape, format, query, unknownerr, loginerr, errorsave } from '../../db/db';
import { Course, DBResult } from '../Course';

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

let save = async (course: Course): Promise<string | null> => {

};

export {
    loadFromKey,
    save
}