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

function listTopicLinks(req, res) {
  const topic = req.text;
  const articleList = [
    { topic: 'topic1', link: 'link1', nombre: 'nombre1' },
    { topic: 'topic2', link: 'link2', nombre: 'nombre2' },
    { topic: 'topic1', link: 'link3', nombre: 'nombre3' },
  ];
  const result = articleList.filter((article) => article.topic == topic);
  result.length > 0
    ? res.renderBlocks(commonViews.listTopicLinks(result))
    : res.renderBlocks(
        blocksViews.plainText('No se encontraron posts con ese topic')
      );
}

module.exports = { addTopic, listTopicLinks };
