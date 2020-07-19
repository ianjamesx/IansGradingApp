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
    app.post('/api/assignment/create', (req: Request, res: Response) => {

        let name: string = req.body.name;
        let category: string = req.body.name;
        let prompt: string = req.body.name;

        let attempts: number = req.body.name;
        let randomize: number = req.body.name;
        let latepenalty: number = req.body.name;
        let questionpoints: number = req.body.name;

        let open: number = req.body.name;
        let close: number = req.body.name;
        let cutoff: number = req.body.name;

        //load instructor data
        let author: User = new User();
        let authorID: number = author.getIDFromSession(req.session);
/*
        let assignment: Assignment = new Assignment(name, authorID, category, prompt, attempts, randomize, latepenalty, questioncount, questionpoints, open, close, cutoff);
        let result: Result = {};

        console.log(assignment);
/*
        //save users data on this course in database
        assignment.save().then(err => {
            if(err) {
                result.error = err;
                res.send(result);
            } else {
                
                //add connection between instructor and course
                course.joinCourse(instructor.getID()).then(joinerr => {
                    if(joinerr){
                        result.error = joinerr;
                    } else {
                        result.success = course.getID();
                    }
                    res.send(result);
                });
            }

        });*/
    });



};

export {
    assignmentapi
}
