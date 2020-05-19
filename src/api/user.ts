import { Application, Request, Response } from 'express';
import { User } from '../models/User';

//result interface for an API call
interface Result {
    error: string | any; //<-- err can be string or error object (hash table of strings)
    success: boolean;
}

let userapi = (app: Application): void => {

    //login with email, password
    //if success, store user id in session
    app.post('/login', (req: Request, res: Response) => {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user: User = new User(email, password);
        let result: Result;

        user.login().then(err => {
            if(err){
                result.error = err;
            } else {
                user.setSession(req); //load user data into session
                result.success = true;
            }
            res.send(result);
        });
    });

    //to logout, just destroy session and redir to /
    app.post('/logout', (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.redirect('/'); //redirect to homepage
        });
    });

    //create new user
    //with email, pass, fn, ln
    app.post('/user/create', (req: Request, res: Response) => {
        let email: string = req.body.email;
        let password: string = req.body.password;
        let firstname: string = req.body.firstname;
        let lastname: string = req.body.lastname;

        let user: User = new User(email, password, firstname, lastname);
        let result: Result;

        user.save().then(err => {
            if(err){
                result.error = err;
            } else {
                result.success = true;
            }
            res.send(result);
        });

    });

};

export {
    userapi
}