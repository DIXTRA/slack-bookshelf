require('dotenv').config();
const debug = require('debug')('slack-bookshelf:server');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const appRouter = require('./src/routes');

let app = express();

// configure middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure routers
app.use('/', appRouter);

// start app
const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug('listening on port ' + port);
});
