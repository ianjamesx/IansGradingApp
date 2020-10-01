/*
Gradux.io

SQL DATABASE INFO
user: root
password: password
*/

import express = require('express');
const app = express();

//all our configuration code (express, database, public files)
import { init } from './config/config';
init(app);

//all our page routes
import { routes } from './routes/routes';
routes(app);

//all api routes
import { init as api } from './api/apiconfig';
api(app);

//import playground for testing/debugging
let playground = require('./utils/playground');

app.listen(8080, () => {
    console.log('xgrade running on port 8080');
});