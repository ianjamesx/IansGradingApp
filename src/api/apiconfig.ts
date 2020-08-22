/*
importing all api routes
*/

import { Application, Request, Response } from 'express';

//user api
import { userapi as user } from './user';

//course api
import { courseapi as course } from './course';

//assignment api
import { assignmentapi as assignment } from './assignment';

//question api
import { questionapi as question } from './question';

let init = (app: Application): void => {

    //pass our app to all routes we import
    user(app);
    course(app);
    assignment(app);
    question(app);

};

export {
    init
};