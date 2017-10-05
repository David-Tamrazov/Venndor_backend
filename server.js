'use strict';
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');
const unless = require('express-unless')
const errorHandler = require('./app/error').handler;
const ErrorTypes = require("./app/error").types;
const controllers = require('./app/controllers');
const config = require('./app/config');
const helper = require('./app/helpers');
const auth = jwt({ secret: config.tokenSecret});

//set the port
app.set('port', process.env.PORT || 3000);

//request body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({

//allows us to decode url-encoded bodies
  extended: true
}));

//allows facebook authentication through
app.use(auth.unless({
  path: [
    '/user/auth/facebook/callback'
  ]
}));

//400 middleware
app.put('/:table/:id', helper.validateParameters);
app.post('/:table', helper.validateParameters);

//mount the routes
app.use('/item', controllers.item.router);
app.use('/match', controllers.match.router);
app.use('/user', controllers.user.router);
app.use('/dev', controllers.dev.router);

//Catch and handle all errors
app.use(errorHandler());

app.listen(app.get('port'), () => {
  console.log("Venndor running on Port:", app.get('port'));
});

module.exports = app;
