/*
all config/init setup of the app
*/

import path = require('path');
import express = require('express');
import { init as dbinit } from '../db/tableinit';

let init = (app: express.Application): void => {

  /*
  middleware for express
  */

  //set EJS as view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views/pages'));
  
  //publicly send everything in /public
  app.use('/public', express.static(path.join(__dirname, '../public')));
  
  //init db tables
  dbinit();
  
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

};

export { init };