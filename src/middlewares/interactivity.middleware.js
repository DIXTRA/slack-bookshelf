const { Team, User } = require('../models');
const { getUser } = require('../helpers/slack.helper');

async function getInteractiveEventUserAndTeam(req, res, next) {
  const { user: { id: userId, team_id: teamId } } = JSON.parse(req.body.payload);

  const team = await Team.findOne({
    where: { slackId: teamId },
  });

  if (team) {
    req.team = team;

    const user = await User.findOne({
      where: {
        slackId: userId,
        TeamId: team.id,
      }
    });

    if (user) {
      req.user = user;

      next();
    } else { // add user to the team
      const user = await getUser(req.team.token, user_id);

      req.user = await team.createUser({
        slackId: user.id,
        displayName: user.profile.display_name_normalized,
        profilePicture: user.profile.image_24,
        username: user.name,
        isAdmin: user.is_admin || user.is_owner,
      });

      next();
    }
  } else {
    // TODO: replace with error block
    res.error('team not found');
  }
}

module.exports = {
    getInteractiveEventUserAndTeam,
}
