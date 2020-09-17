/*
all config/init setup of the app
*/

import path = require('path');

import express = require('express');
import session = require('express-session');
import bodyparser = require('body-parser');
import fileupload = require('express-fileupload');

import { init as dbinit } from '../db/tableman';
import { tables } from '../db/tables';
import { load as componentload } from '../clientviews/componentloader';

let init = (app: express.Application): void => {

  /*
  middleware for express
  */

  //set EJS as view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views/pages'));
  
  //send everything in /public (css, js)
  app.use('/public', express.static(path.join(__dirname, '../public')));

  //setup users session
  app.use(session({
    secret: 'tempsecret',
    resave: false,
    saveUninitialized: true
  }));

  //body parser
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({extended: true}));

  //fileupload for express
  app.use(fileupload());

  /*
  init DB tables
  */
  
  dbinit(tables);

  /*
  render components for client
  */

 componentload({
    componentpath: '/clientcomponents',
    clientpath: '../public/js/render.js'
  });


};

export { init };