var pb = require('../services/pagebuilder');

module.exports = (app, templates, components) => {

  app.get('/', (req, res) => {

    pb.homepage(req.getSession(), templates, components).then((page) => {
      res.send(page);
    });

  });

}
