var express = require("express");
var app = express();

//all our configuration code
var configout = require('./init/config')();

//console.log(configout);

//all our routes
var routes = require('./routes/routes')(app, configout.templates, configout.components);

app.listen(8080, () => {
  console.log('listening on 8080');
});
