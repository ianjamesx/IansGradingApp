"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
//all our configuration code
var config_1 = require("./init/config");
config_1.init(app);
//all our routes
//import routes = require('./routes/routes')(app);
app.listen(8080, function () {
    console.log('xgrade running on port 8080');
});
