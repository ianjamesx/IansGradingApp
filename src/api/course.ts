import { Application, Request, Response } from 'express';
import { Course } from '../models/Course/Course';

//result interface for an API call
interface Result {
    error?: string | any;
    success?: boolean;
}

let courseapi = (app: Application): void => {

    //create a course with user entered properties
    app.post('/course/create', (req: Request, res: Response) => {

        let name: string = req.body.name;
        let department: string = req.body.department;
        let season: string = req.body.season;
        let year: number = req.body.year;
        let number: number = req.body.number;
        let section: number = req.body.number;

        let course: Course = new Course(name, department, season, year, number, section);
        let result: Result = {};

        course.save().then(err => {
            if(err)
                result.error = err;
             else 
                result.success = true;
            
            res.send(result);
        });
    });

};

export {
    courseapi
}