import { Application, Request, Response } from 'express';
import { resolve } from 'path';
import { loginerr } from '../db/dbquery';
import { User } from '../models/User/User';

//result interface for an API call
interface Result {
    error?: string | any; //<-- err can be string or error object (hash table of strings)
    success?: boolean;
}

let userapi = (app: Application): void => {

    //login with email, password
    //if success, store user id in session
    app.post('/api/user/login', async (req: Request, res: Response) => {

        let user: User = new User({
            email: req.body.email,
            password: req.body.password
        });

        let result: Result = {};
        let err: string | void = await user.login(req.session);

        if(err)
            result.error = err;
         else 
            result.success = true;

        res.send(result);
    });

    //create new user
    //with email, pass, fn, ln
    app.post('/api/user/create', async (req: Request, res: Response) => {

        let user: User = new User({
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            instructor: Number(req.body.instructor)
        })

        let result: Result = {};

        let saveErr: any = await user.save();

        if(saveErr){
            result.error = saveErr;
            res.send(result);
        }

        let loginerr: string | void = await user.login(req);
        if(!loginerr){
            result.success = true;
        } else {
            result.error = loginerr;
        }

        res.send(result);

    });

    app.post('/api/user/update', async (req: Request, res: Response) => {

        let user: User = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            id: req.body.id
        });

        let result: Result = {};
        result.error = await user.save();

        if(!result.error){
            result.success = true;
        }

        res.send(result);

    });

    app.post('/api/user/updatepassword', async (req: Request, res: Response) => {

        let user: User = new User();
        await user.loadFromID(Number(req.body.id));

        let newpass: string = req.body.newpassword;
        let result: Result = {};

        if(await user.passwordCorrect()){
            user.setPassword(newpass);
            result.error = await user.save();

            //turn result.error object into just an error about password
            if(result.error) 
                result.error = result.error.password;
            else
                result.success = true;

            res.send(result);

        } else {
            res.send({error: 'Current Password Incorrect'});
        }

    });

};

export {
    userapi,
    Result
}