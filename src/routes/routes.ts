import pb = require('../services/pagebuilder');
import { Application, Request, Response } from 'express';
import { Instructor } from '../models/Instructor/Instructor';

let routes = (app: Application): void => {

  //if user has a session, redirect to their dashboard
  //if not, send the homepage
  app.get('/', (req: Request, res: Response) => {
    if(req.session.user){
      res.redirect('/dashboard');
    } else {
      res.render('homepage');
    }
  });

  app.get('/dashboard', (req: Request, res: Response) => {
    pb.dashboard(req).then(content => {
      if(content.error) return err(req, res); //<-- error check, if we get an error from pagebuilder, send user a 404

      //get page path from userpage function IF page depends on user type
      //e.g. instructor sees more content on dashboard than studnets
      let page: string = userpage(content.instructor, 'dashboard');
      res.render(page, content);

    });
  });

  app.get('/createcourse', (req: Request, res: Response) => {
    pb.createCourse(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'createcourse');

      console.log(content);
      console.log(content.instructor);
      res.render(page, content);

    });
  });

}

//on error, redirect to homepage
//most errors are from not having a session, send back to homepage to re-login
let err = (req: any, res: any): void => {
  res.redirect('/');
};

//decide which page to get depending on if user is instructor or not
//NOTE do error catching here eventually
let userpage = (instructor: number, page: string): string => {

  if(instructor){
    return 'instructor/' + page;
  }
  return 'student/' + page;

};

export { routes };