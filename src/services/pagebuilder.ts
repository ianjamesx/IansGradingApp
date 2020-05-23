//var render = require('../utils/render');
import { User } from '../models/User';
import { Request } from 'express';

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
*/

interface Content {
  data: any;
  error: any;
};

let dashboard = async (req: Request) => {

  let user: User = new User();
  let error: any = await user.sessionLoad(req.session);
  if(error) return { error: error };                    //if we encounter an error (e.g. no user session)
  
  let courses = [
    {
      name: 'course1',
      dept: 'compsci',
      number: 221,
      section: 101,
      season: 'spring',
      year: 2020,
      id: 302931
    },
    {
      name: 'course2',
      dept: 'math',
      number: 225,
      section: 105,
      season: 'spring',
      year: 2020,
      id: 304122
    }
  ];

  return {
    hello: 'Hello ' + user.getFN(),
    title: 'Your Dashboard',
    courses: courses
  };

};

export { dashboard };