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
        let season: string = req.body.season;
        let year: number = Number(req.body.year);
        let number: number = Number(req.body.number);
        let section: number = Number(req.body.section);
        let categories: any = req.body.categories;

        //load instructor data
        let instructor: User = new User();
        let instructorID: number = instructor.getIDFromSession(req.session);

        //load new course
        let course: Course = new Course(name, department, season, year, number, section, instructorID, categories);
        let result: Result = {};

        //save users data on this course in database
        course.save().then(err => {
            if(err) {
                result.error = err;
                res.send(result);
            } else {
                
                //add connection between instructor and course
                //if joining through create API, user is the instructor
                course.joinCourse(instructorID, `Instructor`).then(joinerr => {
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

    app.post('/course/searchbykey', async (req: Request, res: Response) => {

        let key: string = req.body.key;

        let course: Course = new Course();
        let result: Result = {};

        let err: any = await course.loadCourseByKey(key);

        //send error if could not find course by that key
        if(err){
            result.error = err;
            res.send(result);

        } else {

            let data: any = await course.dataView();
            result.success = data;
            res.send(result);
        }

    });

    app.post('/course/join', async (req: Request, res: Response) => {

        let id: number = Number(req.body.id);
        let course: Course = new Course();
        let result: Result = {};

        //get user id for course to add connection
        let user: User = new User();
        let userID: number = user.getIDFromSession(req.session);

        //try to load course by that id
        let loaderr: any = await course.loadCourseByID(id);

        console.log(userID + ' joining course ' + id);
        if(loaderr){
            
            result.error = loaderr;
            res.send(result);

        } else {

            //if joining through join API, user is a student (if not the instructor can upgrade them)
            let joinerr: any = await course.joinCourse(userID, `Student`);
            if(joinerr){
                result.error = joinerr;
            } else {
                result.success = true;
            }
            res.send(result);

        }

    });

    app.post('/course/getcategories', async (req: Request, res: Response) => {

        let id: number = Number(req.body.id);
        let course: Course = new Course();
        let result: Result = {};

        //try to load course by that id
        let loaderr: any = await course.loadCourseByID(id);

        if(loaderr){
            result.error = loaderr;
            res.send(result);
        } else {

            let categories: any = await course.getCategories();
            result.success = categories;
            res.send(result);

        }

    });

};

export {
    courseapi
}
