const debug = require('debug')('slack-bookshelf:server');
const userController = require('./user.controller');

/*
  Mover esto a algun constants en el futuro
*/
const COMMANDS = {
  add: userController.addPost,
  list: userController.getPosts,
};

const COMMAND_NAMES = Object.keys(COMMANDS);

function runCommand(req, res) {
  const command = req.body.text.split(" ")[0];

  debug('command controller:', command);

  if (COMMAND_NAMES.includes(command)) {
    console.log(`running '${command}'`);
    COMMANDS[command](req, res);
    // res.success();
  } else res.error('Command not found');
}

module.exports = { runCommand };
