
module.exports = (app) => {

  app.get('/', async (req, res) => {
    res.send(templates.user1.file1);
  });

}
