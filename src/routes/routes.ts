import pb = require('../services/pagebuilder');
import { Application, Request, Response } from 'express';

let routes = (app: Application): void => {

  app.get('/', (req: Request, res: Response) => {
    if(req.session.user){
      res.redirect('/dashboard'); //if user has a session, redirect to their dashboard
    } else {
      res.render('homepage');     //if not, send homepage
    }
  });

  app.get('/dashboard', (req: Request, res: Response) => {
    pb.dashboard(req).then(content => {
      if(content.error) return err(req, res); //<-- error check, if we get an error from pagebuilder, send user a 404
      res.render('dashboard', content);
    });
  });

  app.get('/nopage', (req: Request, res: Response) => {
    res.send('We couldnt find that page');
  });

}

let err = (req: any, res: any): void => {
  res.redirect('/nopage');
};

export { routes };
