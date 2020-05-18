/*
Gradux.io
Gradix.io
Gradax.io
*/

import express = require('express');
const app = express();

//all our configuration code
import { init } from './init/config';
init(app);

//all our routes
import { routes } from './routes/routes';
routes(app);

app.listen(8080, () => {
    console.log('xgrade running on port 8080');
});