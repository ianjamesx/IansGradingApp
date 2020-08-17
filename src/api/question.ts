import { Application, Request, Response } from 'express';
import { Question } from '../models/Question/Question';
import { User } from '../models/User/User';


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
        let ispublic: string = req.body.ispublic;

        //load instructor data
        let author: User = new User();
        let authorID: number = author.getIDFromSession(req.session);

        //set as not active yet (as its only a draft)
        let active: number = 0;

        //save users data on this assignment
        let result: Result = {};
        let err: any = await assignment.save();

        if(err) {
            result.error = err;
        } else {
            result.success = assignment.getID();
        }
        res.send(result);
    });

};

export {
    assignmentapi
}
