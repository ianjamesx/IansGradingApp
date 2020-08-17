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

    for(i = 0; i < answers; i++){

        let curr: any[] = vals(answers[i]);
        curr.push(quest.getID()); //also push id of question
        curr.push(await db.generateID('answers')); //and id generated for this answer
        
        answernest.push(curr);

    }

    let result: DBResult = {};
    let savequery = db.format(`INSERT INTO answers (ans, correct, question, id) VALUES ?`, [answernest]);
    console.log(savequery);
    /*
    try {
        result.data = await db.query(savequery);
    } catch(err){
        db.errorsave(err);
        result.error = db.unknownerr;
    }
    */

    return result;

}

export {
    load,
    save,
    generateID
}