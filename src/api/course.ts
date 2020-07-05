import { Application, Request, Response } from 'express';
import { Course } from '../models/Course/Course';
import { User } from '../models/User/User';

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
        let season: number = Number(req.body.season);
        let year: number = Number(req.body.year);
        let number: number = Number(req.body.number);
        let section: number = Number(req.body.section);

        //get id of user creating course from session to set them as instructor
        let user: User = new User();
        let instructor: number = user.getIDFromSession(req.session);

        let course: Course = new Course(name, department, season, year, number, section, instructor);
        let result: Result = {};

        //save users data on this course in database
        course.save().then(err => {
            if(err) {
                result.error = err;
                res.send(result);
            } else {
                //put course id in result object, add connection between instructor and course
                course.joinCourse(instructor).then(joinerr => {
                    if(joinerr){
                        result.error = joinerr;
                    } else {
                        result.success = course.getID();
                    }
                    res.send(result);
                });
            }
        });
    });

    app.post('/course/searchbykey', (req: Request, res: Response) => {

        let key: string = req.body.key;

        let course: Course = new Course();
        let result: Result = {};

        course.loadCourseByKey(key).then(err => {
            if(err){
                result.error = err;
            } else {
                result.success = course.dataView();
            }
            res.send(result);
        });
    });

    app.post('/course/join', (req: Request, res: Response) => {

        let id: number = Number(req.body.id);
        let course: Course = new Course();
        let result: Result = {};

        //get user id for course to add connection
        let user: User = new User();
        let userID: number = user.getIDFromSession(req.session);

        course.loadCourseByID(id).then(err => {

            if(err){
                result.error = err;
                res.send(result);
            }

            course.joinCourse(userID).then(err => {
                if(err){
                    result.error = err;
                } else {
                    result.success = true;
                }
                res.send(result);
            });

        });

    });

};

export {
    courseapi
}
