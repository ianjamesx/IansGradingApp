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

        let question: string = req.body.question;
        let answers: any[] = req.body.answers;
        let subject: string = req.body.subject;
        let topic: string = req.body.topic;
        let type: string = req.body.type;
        let ispublic: number = req.body.public;

        //load instructor data
        let author: User = new User();
        let authorID: number = author.getIDFromSession(req.session);

        //create question object
        let quest: Question = new Question(question, answers, authorID, subject, topic, type, ispublic);

        //save users data on this assignment
        let result: Result = {};
        let err: any = await quest.save();

        if(err) {
            result.error = err;
        } else {
            result.success = quest.getID();
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
