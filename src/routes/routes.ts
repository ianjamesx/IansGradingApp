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

  //to logout, just destroy session and redir to /
  app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect('/'); //redirect to homepage
    });
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

  /*
  course releated routes
  */

  app.get('/createcourse', (req: Request, res: Response) => {
    pb.createCourse(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'createcourse');
      res.render(page, content);

    });
  });

  app.get('/joincourse', (req: Request, res: Response) => {
    pb.joinCourse(req).then(content => {
      if(content.error) return err(req, res);
      res.render('student/joincourse', content);
    });
  });

  app.get('/course/:id', (req: Request, res: Response) => {
    pb.coursePage(req).then(content => {
      if(content.error) return err(req, res);
      
      let page: string = userpage(content.instructor, 'course');
      res.render(page, content);

    });
  });

  /*
  assignment pages
  */
  app.get('/createassignment', (req: Request, res: Response) => {
    pb.createAssignment(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'createassignment');
      res.render(page, content);

    });
  });

  app.get('/createassignment/:id', (req: Request, res: Response) => {
    pb.createAssignment(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'createassignment');
      res.render(page, content);

    });
  });

  app.get('/editassignment', (req: Request, res: Response) => {
    pb.editAssignment(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'editassignment');
      res.render(page, content);

    });
  });

  app.get('/assignment/:id', (req: Request, res: Response) => {
    pb.assignment(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'assignment');
      res.render(page, content);

    });
  });

  app.get('/assignment/choosequestions/:id', (req: Request, res: Response) => {
    pb.chooseQuestions(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'choosequestions');
      res.render(page, content);

    });
  });

  app.get('/takeassignment/:id', (req: Request, res: Response) => {
    pb.takeAssignment(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'takeassignment');
      res.render(page, content);

    });
  });

  app.get('/createquestion', (req: Request, res: Response) => {
    pb.createQuestion(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'createquestion');
      res.render(page, content);

    });
  });

  app.get('/studentreport/:course/:student', (req: Request, res: Response) => {
    pb.studentReport(req).then(content => {
      if(content.error) return err(req, res);

      let page: string = userpage(content.instructor, 'studentreport');
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
//NOTE do error catching here eventually (if student tries to access instructor page, etc)
let userpage = (instructor: number, page: string): string => {

  if(instructor){
    return 'instructor/' + page;
  }
  return 'student/' + page;

};

export { routes };