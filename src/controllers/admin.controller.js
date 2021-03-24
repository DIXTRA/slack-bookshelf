const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');

const { validName } = require('../helpers/common.helper');
/*
  Controller para acciones de los admins (crear topics, aprobar posts, etc)
*/

function addTopic(req, res) {
  const name = req.text;

  if (validName(name)) {
    // algo asi
    // Topic.findOne({ name }).then((topic) => {
      // if (topic) res.error('ERR');
      // else {
        // y asi
        // Topic.create({ name }).then((topic) => {
          const text = `Topic '${name}' created!`;
          const message = blocksViews.plainText(text);

          res.renderBlocks([message], true);
        // });
      // }
    // });
  } else {
    res.renderSlack(commonViews.commandError(`Invalid topic name '${name}'`));
  }
}

module.exports = { addTopic };
