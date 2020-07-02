var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');

var dbConnectionPool = mysql.createPool({
  host:'localhost',
  database:'rooster'

});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(function(req, res, next){
  req.pool = dbConnectionPool;
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret:'helloworld',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}));



app.use('/users',function(req, res, next) {

  if(!req.session.user){
    res.sendStatus(403);
  }
  next();
});

app.use('/users/manager',function(req, res, next) {

  if(!req.session.user.Manager){
    res.sendStatus(403);
  }
  next();
});



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;