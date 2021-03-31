const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');
const { Topic } = require('../models');

const { validName } = require('../helpers/common.helper');

/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/

async function addTopic(req, res) {
  const { text: name, team } = req;

  if (validName(name)) {
    if (await Topic.findOne({ name })) res.error('ERR');
    else {
      await team.createTopic({ name });

      const text = `Topic '${name}' created!`;
      const message = blocksViews.plainText(text);

      res.renderBlocks([message], true);
    }
  } else {
    res.renderSlack(commonViews.commandError(`Invalid topic name '${name}'`));
  }
}

module.exports = { addTopic };
