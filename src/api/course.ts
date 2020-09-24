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
    app.post('/api/course/create', async (req: Request, res: Response) => {

        let course: Course = new Course({
            name: req.body.name,
            department: req.body.department,
            season: req.body.season,
            year: Number(req.body.year),
            number: Number(req.body.number),
            section: Number(req.body.section),
            categories: req.body.categories,
            instructor: User.getIDFromSession(req.session)
        })

        let result: Result = {};

        let saveerr: any = await course.save();
        if(saveerr){
            result.error = saveerr;
            res.send(result);
        }

        let joinerr = await course.joinCourse(User.getIDFromSession(req.session), `Instructor`);
        if(joinerr){
            result.error = joinerr;
        } else {
            result.success = course.getID();
        }

        res.send(result);

    });

    app.post('/api/course/searchbykey', async (req: Request, res: Response) => {

        let key: string = req.body.key;

        let course: Course = new Course();
        let result: Result = {};

        let err: any = await course.loadCourseByKey(key);

        console.log(err);

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

    app.post('/api/course/join', async (req: Request, res: Response) => {

        let id: number = Number(req.body.id);
        let course: Course = new Course();
        let result: Result = {};

        //get user id for course to add connection
        let userID: number = User.getIDFromSession(req.session);

        //try to load course by that id
        let loaderr: any = await course.loadByID(id);

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

    app.post('/api/course/getcategories', async (req: Request, res: Response) => {

        let id: number = Number(req.body.id);
        let course: Course = new Course();
        let result: Result = {};

        //try to load course by that id
        let loaderr: any = await course.loadByID(id);

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
