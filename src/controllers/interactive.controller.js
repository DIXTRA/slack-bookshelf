const debug = require('debug')('slack-bookshelf:server');
const { ActionType } = require('../enum/action_type');

function runInteractive(req, res) {
  const payload  = JSON.parse(req.body.payload);
  const { type } = payload

  const user_id = payload.user.id;
  const team_id = payload.team.id;
  const channel_id = payload.channel.id;
  
  debug("payload: " + JSON.stringify(payload));

  switch(type) {
    case 'block_actions':
      payload.actions.forEach(action => {
        debug("action: " + JSON.stringify(action));
        
        const {action_id, block_id,value} = action;

        switch(value) {
          case ActionType.Approve:
            // TODO: 
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
