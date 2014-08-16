// this is a basic bunch of javascript variables 
// which are ties to certain packages, dependecies and node functionality 

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/blog');




// routes are a combination of controllers and models BUT WHAT ABOUT MVC
var routes = require('./routes/index');
var users = require('./routes/users');
// top level route => intasizates express and assinges our top level app to it.
var app = express();
//
// view engine setup
// using the app vairable to configure express stuff

// where to find views, what engine to use under these views => jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// and calls a few things to get stuff up and runnign 

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// tells express what route files to use

// for all routes, addin editing display etc is done in the index router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// these two lines are the middle ware for express
// thery are providing custom functions that the rest of the app can make use off
app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
// error handlers => didnt have these in rails

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
