const { Team } = require('../models');

async function getTeamMiddleware(req, res, next) {
  const { team_id } = req.body;

  const team = await Team.findOne({
    slackId: team_id,
  });

  if (team) {
    req.team = team;

    next();
  } else {
    // TODO: replace with error block
    res.error('team not found');
  }
}

module.exports = {
  getTeamMiddleware,
}
