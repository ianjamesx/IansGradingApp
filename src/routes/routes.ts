import pb = require('../services/pagebuilder');
import { Application, Request, Response } from 'express';

let routes = (app: Application) => {

  app.get('/', (req: Request, res: Response) => {

    pb.homepage(req).then(content => {
        res.render('dashboard', content);
    })

    /*pb.homepage(req).then(content => {
      res.render('pages/home.', content);
    });*/

  });

}

export { routes };
