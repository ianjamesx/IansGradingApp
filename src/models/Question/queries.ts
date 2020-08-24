import * as db from '../../db/dbquery';
import { Question, DBResult } from './Question';
import { keys, id, key, vals } from '../../utils/utils';

let tablename: string = 'questions';

let load = async (quest: Question): Promise<DBResult> => {
    return await db.load(quest, tablename);
};

let save = async (quest: Question): Promise<DBResult> => {
    return await db.save(quest, tablename);
};

let generateID = async (): Promise<number> => {
    return await db.generateID(tablename);
};

let saveAnswers = async (quest: Question): Promise<DBResult> => {
    
    //to perform a bulk insert, we have to turn array of objects into nested array first
    let i: number;
    let answernest: any = [];
    let answers = quest.getAnswers();

    for(i = 0; i < answers.length; i++){

        let curr: any[] = vals(answers[i]);
        curr.push(quest.getID()); //also push id of question
        curr.push(await db.generateID('answers')); //and id generated for this answer
        
        answernest.push(curr);

    }

    let result: DBResult = {};
    let savequery = db.format(`INSERT INTO answers (ans, correct, question, id) VALUES ?`, [answernest]);
    
    try {
        result.data = await db.query(savequery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }
    
    return result;

}

/*
select questions given a certain criteria
determine if subject, topic, or type are given, if so, include in search
*/
let allQuestionsByCriteria = async (subject: string, topic: string, type: string): Promise<DBResult> => {

    let result: DBResult = {};
    let quest: Question = new Question();

    let searchquery: string = db.format(`SELECT ?? FROM questions WHERE public = 1 subject = ? AND topic = ? AND type = ?`, [quest.getColumns(), subject, topic, type]);

    console.log(searchquery);
    
    try {
        result.data = await db.query(searchquery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }
    
    return result;

} 

export {
    load,
    save,
    saveAnswers,
    generateID,
    allQuestionsByCriteria
}