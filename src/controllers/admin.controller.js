const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');
const { topicExists } = require('../helpers/topics.helper');

const { validName } = require('../helpers/common.helper');

/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/

async function addTopic(req, res) {
  const { text: name, team, user } = req;

  if (validName(name)) {
    const alreadyCreated = await topicExists(name, team.id);

    if (alreadyCreated) {
      res.renderSlack(
        commonViews.commandError(
          `Topic '${name}' already created\ncreated by ${topic.createdBy.name}`
        )
      );
    } else {
      const newTopic = await team.createTopic({ name, createdBy: user });

      if (newTopic) {
        const text = `Topic '${name}' created!`;
        const message = blocksViews.plainText(text);

        res.renderBlocks([message], true);
      } else
        res.renderSlack(
          commonViews.commandError(`Error creating topic '${name}'`)
        );
    }
  } else {
    res.renderSlack(commonViews.commandError(`Invalid topic name '${name}'`));
  }
}

module.exports = { addTopic };
