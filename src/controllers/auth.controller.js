const { WebClient } = require('@slack/web-api');
const { Team } = require('../models');
const { getUser } = require('../helpers/slack.helper');

async function appInstall (req, res) {
  const { code } = req.query;

  // ref: https://api.slack.com/authentication/oauth-v2#exchanging
  const slackClient = new WebClient();

  try {
    const installData = await slackClient.oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: code,
    });

    const { team, authed_user, access_token } = installData;

    const newTeam = await Team.create({
      slackId: team.id,
      name: team.name,
      token: access_token,
    });

    const user = await getUser(newTeam.token, authed_user.id);

    // ref: https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances
    await newTeam.createUser({
      slackId: user.id,
      displayName: user.profile.display_name_normalized,
      profilePicture: user.profile.image_24,
      username: user.name,
      isAdmin: user.is_admin || user.is_owner,
    });

    return res.json({ ok: true });
  } catch (exception) {
    return res.error('invalid token');
  }
}

module.exports = {
  appInstall,
};
