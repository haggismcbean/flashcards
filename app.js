var app;

setUpExpress();

function routePages() {
  var index = require('./routes/index');
  var settings = require('./routes/settings');
  var community = require('./routes/community');
  var about = require('./routes/about');
  var login = require('./routes/login');

  app.use('/', index);
  app.use('/settings', settings);
  app.use('/community', community);
  app.use('/about', about);
  app.use('/login', login);
}

function routeApi() {
  var api = require('./routes/api');

  app.get('/api', api.findAll);
  app.get('/api/:id', api.findById);
  app.post('/api', api.addSet);
  app.put('/api/:id', api.updateSet);
  app.delete('/api/:id', api.deleteSet);
}

routePages();
routeApi();
errorHandling();

module.exports = app;

//Boilerplate Functions
function setUpExpress() {
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function errorHandling() {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}