var render = require('../utils/render');

var homepage = async (session, templates, components) => {

  var errorbox = components.error({message: 'This is an Error'});

  return render(templates.user1.file1, {
    err: errorbox
  });

};

module.exports = {
  homepage: homepage
};
