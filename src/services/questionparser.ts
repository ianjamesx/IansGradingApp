let path = require('path');
let fs = require('fs');

import { Question } from '../models/Question/Question';

let saveQuestionsFromJSON = async () => {

    let questionpath = path.join(__dirname, '../data/questionsJSON.txt');
    let questionsJSON = fs.readFileSync(questionpath, 'utf8');
    let qs = JSON.parse(questionsJSON);

    let i;
    for(i in qs.questions){
        await saveOneQuestion(qs.questions[i]);
    }

};

let saveOneQuestion = async (questionObj) => {

    let question: string = questionObj.question;
    let correct: string[] = questionObj.correct;
    let wrong: string[] = questionObj.wrong;

    //put all answers into one array, make distinction if correct/wrong
    let answers: any[] = [];
    let i: number;

    for(i = 0; i < correct.length; i++){
        answers.push({
            answer: correct[i],
            correct: 1
        });
    }
    for(i = 0; i < wrong.length; i++){
        answers.push({
            answer: wrong[i],
            correct: 0
        });
    }

    //create question object
    let quest: Question = new Question(question, answers, null, null, null, null, 'Multiple Choice', 1);

    let err: any = await quest.save();

};

export { saveQuestionsFromJSON }