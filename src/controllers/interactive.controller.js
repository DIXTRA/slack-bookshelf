const debug = require('debug')('slack-bookshelf:server');
const { ActionType } = require('../enum/action_type');

function runInteractive(req, res) {
  const payload  = JSON.parse(req.body.payload);
  const { type } = payload

  debug("payload: " + JSON.stringify(payload));

  const { user, team } = req;

  console.log(user, team);

  switch(type) {
    case 'block_actions':
      payload.actions.forEach(action => {
        debug("action: " + JSON.stringify(action));
        
        const { action_id, value } = action;

        debugger;

        switch(action_id) {
          case ActionType.Approve:
            res.success();
            break;
          case ActionType.Decline:
            // TODO: 
            res.success();
            break;
          case ActionType.Remove:
            // TODO: 
            res.success();
            break;
          default:
            // TODO: Cambiar por otro mensaje y/o estructura
            res.error('Ouch!');
            return;
        }
      });

      break;
    default:
      // TODO: Cambiar por otro mensaje y/o estructura
      res.error('Ouch!');
  }
}

module.exports = {
  runInteractive
};
