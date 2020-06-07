//var render = require('../utils/render');
import { User } from '../models/User/User';
import { Course } from '../models/Course/Course'
import { Request } from 'express';

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
*/

let dashboard = async (req: Request) => {

  //load user
  let user: User = new User();
  let error: any = await user.sessionLoad(req.session);
  if(error) return { error: error };

  //load courses
  let coursedata: any = await user.getAllCourses();
  if(coursedata.error) return {error: coursedata.error}
  let courses: any[] = coursedata.data;

  let assignments = [
    {
      name: 'lab1',
      open: 'Dec 10, 2020',
      close: 'Dec 15, 2020',
      id: 2012931,

    },
    {
      name: 'hw4',
      open: 'Sep 10, 2020',
      close: 'Sep 15, 2020',
      id: 20153931,

    },
  ];

  return {
    title: 'Your Dashboard',
    user: user.getColumns(),
    courses: courses,
    assignments: assignments
  };

};

let createcourse = async (req: Request) => {

  let user: User = new User();
  let error: any = await user.sessionLoad(req.session);
  if(error) return { error: error };

  let coursedata: any = await user.getAllCourses();
  if(coursedata.error) return {error: coursedata.error}
  let courses: any[] = coursedata.data;

}

export {
  dashboard,
  createcourse
};
