import pb = require('../services/pagebuilder');
import { Application, Request, Response } from 'express';

let routes = (app: Application): void => {

  app.get('/', (req: Request, res: Response) => {

    if(req.session.user.id){
      res.redirect('/dashboard'); //if user has a session, redirect to their dashboard
    } else {
      res.render('homepage');     //if not, send homepage
    }

  });

  app.get('/',(req: Request, res: Response) => {
    pb.homepage(req).then(content => {
      res.render('dashboard', content);
    });
  });

}

export { routes };
