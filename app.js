require('./src/models');
const { I18n } = require('i18n');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('slack-bookshelf:server');
const router = require('./src/routes');
const viewBase = require('./src/views/blocks.views').base;

const i18n = new I18n({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
  objectNotation: true,
});

const app = express();

app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: false })); // support encoded bodies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

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

  res.renderSlack = (content) => {
    res.json(content);
  };

  res.renderBlocks = (blocks, inChannel) => {
    res.json(viewBase(blocks, inChannel));
  };

  next();
});

// configure routers
app.use('/', router);

// start app
const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug('listening on port ' + port);
});
