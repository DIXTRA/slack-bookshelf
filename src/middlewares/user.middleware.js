const { User } = require('../models');
const { getUser } = require('../helpers/slack.helper');

async function getUserMiddleware(req, res, next) {
  const { team } = req;
  const { user_id } = req.body;

  try {
    const user = await User.findOne({
      where: {
        slackId: user_id,
        TeamId: team.id,
      }
    });

    if (user) {
      req.user = user;

      next();
    } else { // add user to the team
      const user = await getUser(req.team.token, user_id);
      console.log(user);

      req.user = await team.createUser({
        slackId: user.id,
        displayName: user.profile.display_name_normalized,
        profilePicture: user.profile.image_24,
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
  getUserMiddleware,
};
