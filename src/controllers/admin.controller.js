const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');
const { topicExists } = require('../helpers/topics.helper');

const { validName } = require('../helpers/common.helper');

/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/

// control access to admins only
function adminOnlyError(req, res) {
  const isAdmin = !!req?.user?.isAdmin;

  if (!isAdmin)
    res.renderSlack(
      commonViews.commandError(req.__('errors.admin_only_error'))
    );

  return !isAdmin;
}

async function addTopic(req, res) {
  const { text: name, team, user } = req;

  if (adminOnlyError(req, res)) return;

  if (validName(name)) {
    const alreadyCreated = await topicExists(name, team.id);

    if (alreadyCreated) {
      res.renderSlack(
        commonViews.commandError(
          req.__('errors.topic_already_created_error', { name })
        )
      );
    } else {
      const newTopic = await team.createTopic({ name, createdBy: user.id });

      if (newTopic) {
        const message = blocksViews.plainText(
          req.__('topics.create_success', { name })
        );

        res.renderBlocks([message], true);
      } else
        res.renderSlack(
          commonViews.commandError(
            req.__('errors.create_topic_error', { name })
          )
        );
    }
  } else {
    res.renderSlack(
      commonViews.commandError(
        req.__('errors.invalid_topic_name_error', { name })
      )
    );
  }
}


// { "type": "block_actions", "user": { "id": "U01QWBBE4SZ", "username": "diego.valle", "name": "diego.valle", "team_id": "T01QSKEL1QW" }, "api_app_id": "A01RYPT4Q72", "token": "yQxF4X45RAmngqbXRKB34Fww", "container": { "type": "message", "message_ts": "1619634961.000200", "channel_id": "D01RC2X5L49", "is_ephemeral": true }, "trigger_id": "2011973345219.1842660681846.b8d4c1067ca94fc07c4c4741cfe39b36", "team": { "id": "T01QSKEL1QW", "domain": "slack-bookshelf" }, "enterprise": null, "is_enterprise_install": false, "channel": { "id": "D01RC2X5L49", "name": "directmessage" }, "state": { "values": { } }, "response_url": "https:\/\/hooks.slack.com\/actions\/T01QSKEL1QW\/2011762010354\/bx8Cc56AX7tX9oNpsT3yB9w7", "actions": [{ "action_id": "W7Mlk", "block_id": "Wnv\/s", "text": { "type": "plain_text", "text": "Approve", "emoji": true }, "value": "approve", "style": "primary", "type": "button", "action_ts": "1619634967.532538" }] }
async function approveArticle(req, res) {
  const { team, user } = req;

  
}


module.exports = { addTopic, approveArticle };
