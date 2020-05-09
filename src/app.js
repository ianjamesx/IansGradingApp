var express = require("express");
var app = express();

//all our configuration code
var config = require('./init/config')();

//all our routes
var routes = require('./routes/routes')(app);

app.listen(8080, () => {
  console.log('listening on 8080');
});
