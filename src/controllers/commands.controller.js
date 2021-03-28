const debug = require('debug')('slack-bookshelf:server');
const commandHandlers = require('./commands');

function command(req, res) {
  const command = req.body.text.split(' ')[0];
  debug('command controller:', command);

  const commandHandler = commandHandlers[command];

  if (commandHandler) {
    return commandHandler(req, res);
  } else {
    res.error("wrong command");
  }
}

module.exports = command;
