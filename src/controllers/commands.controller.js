const debug = require('debug')('slack-bookshelf:server');

const { COMMANDS, COMMAND_NAMES } = require('./commands');
const commonViews = require('../views/common.views');

/*
  Handle incoming commands
*/
function runCommand(req, res) {
  const command = req.body.text.split(' ')[0];
  req.text = req.body.text.substr(command.length + 1);

  debug('command controller:', command, req.body);

  if (COMMAND_NAMES.includes(command)) {
    console.log(`running '${command}'`);

    COMMANDS[command](req, res);
    // res.success();
  } else res.renderSlack(commonViews.commandError(req.__('errors.command_not_found')));
}

module.exports = { runCommand };
