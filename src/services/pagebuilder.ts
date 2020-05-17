//var render = require('../utils/render');
import User = require('../models/User');
import { Request } from 'express';

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
*/

let homepage = async (req: Request) => {

  let user: User = new User(req);

  return {
    courses: 12,

  };

};

export { homepage };