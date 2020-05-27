import pb = require('../services/pagebuilder');
import { Application, Request, Response } from 'express';

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
      res.render('dashboard', content);
    });
  });

}

//on error, redirect to homepage
//most errors are from not having a session, send back to homepage to re-login
let err = (req: any, res: any): void => {
  res.redirect('/');
};

export { routes };
