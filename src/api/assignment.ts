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

        console.log(req.body);

        let name: string = req.body.name;
        let prompt: string = req.body.prompt;
        let course: number = Number(req.body.course);
        let category: string = req.body.category;

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

        let assignment: Assignment = new Assignment(name, authorID, course, prompt, attempts, randomize, latepenalty, points, open, close, cutoff, active, category);

        //save users data on this assignment
        let result: Result = {};
        let err: any = await assignment.save();

        console.log(assignment);

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