var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs')

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

const uri = "mongodb+srv://pt-2021:battleships@cluster0.1sc64.mongodb.net/pt-2021-battleships?retryWrites=true&w=majority";
// Useless bez whitelisty IP
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testingRouter = require('./routes/testing');
var statsRouter = require('./routes/stats');
var roomsRouter = require('./routes/rooms');

const app = express();
const port = 9000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testing', testingRouter);
app.use('/stats', statsRouter);
app.use('/rooms', roomsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.status(404).send("Resource does not exist")
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Express server listening at https://localhost:${port}`)
})


module.exports = app;
