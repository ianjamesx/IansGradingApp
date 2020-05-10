var render = require('../utils/render');

var homepage = (templates, components) => {

  var errorbox = components.error({message: 'This is an Error'});

  return render.render(templates.user1.file1, {
    err: errorbox
  });

};

module.exports = {
  homepage: homepage
};
