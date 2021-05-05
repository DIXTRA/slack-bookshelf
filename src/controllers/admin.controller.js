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

module.exports = { addTopic };
