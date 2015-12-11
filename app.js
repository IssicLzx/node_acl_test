var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var MongoDb = require('mongodb');
var Acl = require('acl');
var MongoClient = require('mongodb').MongoClient;

// Connection URL

var url = 'mongodb://localhost:27017/node_acl';

var app = express();

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


MongoClient.connect(url, function(err, db) {

  console.log("Connected correctly to server");
  var mongoBackend = new Acl.mongodbBackend(db, 'acl_');
  var acl = new Acl(mongoBackend);

  //acl.allow('guest', 'blogs', 'view', function (err) {
  //  console.log('acl error : %j', err);
  //});
  //
  //acl.allow('teacher', 'papers', 'edit', function (err) {
  //  console.log('acl error : %j', err);
  //});

  //acl.addRoleParents('teacher',['admin','guest'], function(err){
  //  console.log('acl error : %j', err);
  //})
  //
  //acl.addUserRoles('123', 'admin', function(err){
  //  console.log('acl error : %j', err);
  //});
  //

  //acl.removeUserRoles('123','teacher', function(err){
  //  console.log('acl error : %j', err);
  //});

  acl.allowedPermissions('123', ['blogs','papers'], function(err, permissions){
    console.log('acl err : %j', err);
    console.log('permissions : %j', permissions);
  });

  acl.userRoles( '123', function(err, roles){
    console.log('acl error: %j', err);
    console.log('user roles : ', roles);
  });

  app.use('/', routes);
  app.use('/users', users);

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

  console.log('finish init server');

});




module.exports = app;
