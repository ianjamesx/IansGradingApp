import { Application, Request, Response } from 'express';
import { Assignment, AnswerAttempt } from '../models/Assignment/Assignment';
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

        let assignment: Assignment = new Assignment({
            name: req.body.name,
            author: User.getIDFromSession(req.session),
            prompt: req.body.prompt,
            course: Number(req.body.course),
            category: req.body.category,
            type: req.body.type,

            attempts: Number(req.body.attempts),
            randomize: Number(req.body.randomize),
            latepenalty: Number(req.body.latepenalty),
            points: Number(req.body.points),

            open: req.body.open,
            close: req.body.close,
            cutoff: req.body.cutoff

        });

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
        let assignmentID: number = Number(req.body.assignment);

        let assign: Assignment = new Assignment();
        await assign.loadFromID(assignmentID);
        await assign.saveQuestions(questions);

        let result: Result = {
            success: assignmentID
        };
        res.send(result);

    });

    app.post('/api/assignment/removequestion',  async (req: Request, res: Response) => {

        let assignmentID: number = Number(req.body.assignment);
        let questionID: number = Number(req.body.question);

        let assign: Assignment = new Assignment();
        assign.setID(assignmentID);

        await assign.removeQuestion(questionID);

        let result: Result = {
            success: true
        };
        res.send(result);

    });

    app.post('/api/assignment/answerquestion', async (req: Request, res: Response) => {

        let assignmentID: number = Number(req.body.assignment);
        let questionID: number = Number(req.body.question);
        let userID: number = User.getIDFromSession(req.session);
        let answer: string = req.body.answer;

        //just set ID, no methods require assignment to be loaded
        let assign: Assignment = new Assignment();
        assign.setID(assignmentID);

        let result: AnswerAttempt = await assign.answerQuestion(questionID, userID, answer);
        res.send(result);

    });

};

export {
    assignmentapi
}
