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
  var templates = pre.load({ //<--- NOTE: we will want to give back our templates eventually
    templatepath: '../view/templates',
    assetspath: '../view/assets'
  });

  /*
  component renderer setup
  */

  var componentloader = require('../utils/componentloader');
  componentloader.load({
    components: '../view/components',
    renderfile: '../view/componentrender.js'
  });

};
