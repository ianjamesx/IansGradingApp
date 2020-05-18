//var render = require('../utils/render');
import { User } from '../models/User';
import { Request } from 'express';

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
*/

let homepage = async (req: Request) => {

  let user: User = new User();
  /*let err: string = await user.sessionLogin(req.session.email, req.session.hash);
  if(err){

  }*/

  return {
    hello: 'Hello, Mr. User! How is you?',
    title: 'My Homepage'
  };

};

export { homepage };