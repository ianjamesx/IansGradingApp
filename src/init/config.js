/*

all config/init setup of the app

*/


/*
express setup
*/

module.exports = () => {

  /*
  middleware for express
  */
/*
  var bodyParser = require("body-parser");
  var session = require("express-session");
  var fileUpload = require('express-fileupload');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(session({secret: 'tempsecret', resave: false, saveUninitialized: false}));
  app.use(fileUpload());

  app.use('/public', express.static(__dirname + '/public')); //make everything in public accessible
*/

  /*
  preloader setup
  */

  var pre = require('../utils/preloader');
  var templates = pre.load({ //<--- NOTE: we will want to give back our templates
    templatepath: '../view/templates',
    assetspath: '../view/assets'
  });

  /*
  component loader setup
  */

  var component = require('../utils/componentloader');
  var components = component.load({
    components: '../view/components',
    renderfile: '../view/componentrender.js',
    buffer: true
  });

  /*
  return any config output that other parts of the app needed
  (mostly the template buffer from preloader)
  */

  return {
    templates: templates,
    components: components
  };

};
