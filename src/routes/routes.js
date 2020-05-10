var pb = require('../services/pagebuilder');
module.exports = (app, templates, components) => {

  app.get('/', async (req, res) => {

    var page = pb.homepage(templates, components);
    res.send(page);
  });

}
