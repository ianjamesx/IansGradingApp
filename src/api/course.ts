import { Application, Request, Response } from 'express';
import { Course } from '../models/Course/Course';

//result interface for an API call
interface Result {
    error?: string | any;
    success?: any;
}

let courseapi = (app: Application): void => {

    //create a course with user entered properties
    //send generated ID of course on success
    app.post('/course/create', (req: Request, res: Response) => {

        let name: string = req.body.name;
        let department: string = req.body.department;
        let season: string = req.body.season;
        let year: number = Number(req.body.year);
        let number: number = Number(req.body.number);
        let section: number = Number(req.body.section);

        let course: Course = new Course(name, department, season, year, number, section);
        console.log(course);
        let result: Result = {};

        course.save().then(err => {
            if(err)
                result.error = err;
             else
                result.success = course.getID();

            res.send(result);
        });
    });

};

export {
    courseapi
}
