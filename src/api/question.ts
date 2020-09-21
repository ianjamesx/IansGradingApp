import { Application, Request, Response } from 'express';
import { Question } from '../models/Question/Question';
import { User } from '../models/User/User';
import { key } from '../utils/utils';


//result interface for an API call
interface Result {
    error?: string | any;
    success?: any;
}

let questionapi = (app: Application): void => {

    //create a course with user entered properties
    //send generated ID of course on success
    app.post('/api/question/create', async (req: Request, res: Response) => {

        let question: Question = new Question({
            body: req.body.question,
            answers: req.body.answers,
            hint: req.body.hint,
            subject: req.body.subject,
            topic: req.body.topic,
            type: req.body.type,
            ispublic: req.body.public,
            author: User.getIDFromSession(req.session)
        }) 

        //save users data on this assignment
        let result: Result = {};
        let err: any = await question.save();

        if(err) {
            result.error = err;
        } else {
            result.success = question.getID();
        }
        res.send(result);
    });

    app.post('/api/question/search', async (req: Request, res: Response) => {
        
        let subject: string = req.body.subject;
        let topic: string = req.body.topic;
        let type: string = req.body.type;
        let keywords: string = req.body.keywords;

        //search for all questions based on this criteria
        /*let questions: Question[] = await Question.allQuestionsBy(subject, topic, type, keywords);

        console.log(questions);

        res.send(questions);*/

    });

};

export {
    questionapi
}
