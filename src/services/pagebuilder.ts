//var render = require('../utils/render');
import { User } from '../models/User/User';
import { Course } from '../models/Course/Course';
import { Request } from 'express';

import common = require('./commonserv');

/*
page builder

gets all data needed for templating engine, sends object of that data back
to router, router renders it with expressjs

functions only need request as we retrieve all data from users session
*/

let dashboard = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };

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

  pagedata.title = 'Your Dashboard';
  pagedata.assignments = assignments;

  //load raw course objects and user objectfrom pagedata
  let courses: Course[] = common.loadCourses(pagedata.course);
  let user: User = new User(pagedata.user);

  return pagedata;

};

let createcourse = async (req: Request) => {

  let pagedata = await common.pagebase(req);
  if(pagedata.error) return { error: pagedata.error };

  //get departments to populate list to choose from
  let course: Course = new Course;
  pagedata.departments = await course.getDepartments();
  
  pagedata.title = 'Create New Course';

  return pagedata;

}

export {
  dashboard,
  createcourse
};
