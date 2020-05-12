var pb = require('../services/pagebuilder');

module.exports = (app, templates, components) => {

  app.get('/', async (req, res) => {

    var page = pb.homepage(req.getSession(), templates, components);
    res.send(page);

  });

}
