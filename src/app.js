var express = require("express");
var app = express();

//all our configuration code
var configout = require('./init/config')(app);

//all our routes
var routes = require('./routes/routes')(app);

app.listen(8080, () => {
  console.log('listening on 8080');
});
