/*
Gradux.io

SQL DATABASE INFO
user: root
password: password
*/

import express = require('express');
const app = express();

//all our configuration code
import { init } from './init/config';
init(app);

//all our routes
import { routes } from './routes/routes';
routes(app);

//user api
import { userapi as user } from './api/user';
user(app);

//course api
import { courseapi as course } from './api/course';
course(app);

//assignment api
import { assignmentapi as assignment } from './api/assignment';
assignment(app);

//question api
import { questionapi as question } from './api/question';
question(app);

//import playground for testing/debugging
let playground = require('./utils/playground');

app.listen(8080, () => {
    console.log('xgrade running on port 8080');
});