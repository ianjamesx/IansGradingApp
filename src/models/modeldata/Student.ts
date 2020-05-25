import { escape, format, query, unknownerr, loginerr, errorsave } from '../../db/db';
import { Student, DBResult } from '../Student';

let joinCourse = async (studentid: number, courseid: number): Promise<string | void> => {

    let loadquery = format(`INSERT INTO usercourse (user, course) VALUES (?, ?)`, [studentid, courseid]);
    
    try {
        await query(loadquery);
    } catch(err){
        errorsave(err);
        return err;
    }

};

export {
    joinCourse
}