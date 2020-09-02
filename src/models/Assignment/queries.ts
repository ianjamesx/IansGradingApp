import * as db from '../../db/dbquery';
import { Assignment, DBResult } from './Assignment';
import { keys, id, key } from '../../utils/utils';

let tablename: string = 'assignments';

let load = async (assign: Assignment): Promise<DBResult> => {
    return await db.load(assign, tablename);
};

let save = async (assign: Assignment): Promise<DBResult> => {
    return await db.save(assign, tablename);
};

let generateID = async (): Promise<number> => {
    return await db.generateID(tablename);
};

let saveQuestions = async (assignment: number, questions: string[]): Promise<DBResult> => {

    //to perform bulk insert, we must add id of assignment to each element (and cast question ids to numbers)
    let i: number;
    let questionnest = [];
    for(i = 0; i < questions.length; i++){
        questionnest[i] = [assignment, Number(questions[i])];
    }

    let result: DBResult = {};
    let savequery = db.format(`INSERT INTO assignmentquestions (assignment, question) VALUES ?`, [questionnest]);
    
    try {
        result.data = await db.query(savequery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }

    return result;

};

export {
    load,
    save,
    generateID,
    saveQuestions
}