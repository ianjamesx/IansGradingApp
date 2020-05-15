var pb = require('../services/pagebuilder');

module.exports = (app) => {

  app.get('/', (req, res) => {

    pb.homepate(req).then(content => {
      res.render('pages/index', content);
    });

  });

}
