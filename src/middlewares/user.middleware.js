const { WebClient } = require('@slack/web-api');
const { User } = require('../models');

async function getUser(req, res, next) {
  const { team } = req;
  const { user_id } = req.body;

  try {
    const user = await User.findOne({
      slackId: user_id,
      TeamId: team.id,
    });

    if (user) {
      req.user = user;

      next();
    } else { // add user to the team
      const slackClient = new WebClient();

      const { user } = await slackClient.users.info({
        token: req.team.token,
        user: user_id,
      });

      req.user = await team.createUser({
        slackId: user.id,
        displayName: user.profile.display_name_normalized,
        username: user.name,
        isAdmin: user.is_admin || user.is_owner,
      });

      next();
    }
  } catch (e) {
    console.log(e);
    res.error('failed to get user/create user');
  }
}

module.exports = {
  getUser,
};
