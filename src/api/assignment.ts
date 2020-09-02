import { Application, Request, Response } from 'express';
import { Assignment } from '../models/Assignment/Assignment';
import { User } from '../models/User/User';


//result interface for an API call
interface Result {
    error?: string | any;
    success?: any;
}

let assignmentapi = (app: Application): void => {

    //create a course with user entered properties
    //send generated ID of course on success
    app.post('/api/assignment/create', async (req: Request, res: Response) => {

        let name: string = req.body.name;
        let prompt: string = req.body.prompt;
        let course: number = Number(req.body.course);
        let category: string = req.body.category;
        let type: string = req.body.type;

        let attempts: number = Number(req.body.attempts);
        let randomize: number = Number(req.body.randomize);
        let latepenalty: number = Number(req.body.latepenalty);
        let points: number = Number(req.body.points);

        let open: string = req.body.open;
        let close: string = req.body.close;
        let cutoff: string = req.body.cutoff;

        //load instructor data
        let author: User = new User();
        let authorID: number = author.getIDFromSession(req.session);

        //set as not active yet (as its only a draft)
        let active: number = 0;

        let assignment: Assignment = new Assignment(name, authorID, course, prompt, attempts, randomize, latepenalty, points, open, close, cutoff, active, category, type);

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

    app.post('/api/assignment/addquestions', async (req: Request, res: Response) => {

        let questions: string[] = req.body.questions;
        let assignment: number = Number(req.body.assignment);

        console.log(questions);
        console.log(assignment);

        await Assignment.saveQuestions(assignment, questions);

    });

};

export {
    assignmentapi
}
