const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('slack-bookshelf:server');

const router = require('./src/routes');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: false })); // support encoded bodies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// configure routers
app.use('/', router);
// adding response methods
app.use((req, res, next) => {
  res.success = (data) => {
    res.json({
      status: 'success',
      data,
    });
  };

  res.error = (message) => {
    res.status(500).json({
      status: 'error',
      message,
    });
  };

  next();
});

// start app
const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug('listening on port ' + port);
});
