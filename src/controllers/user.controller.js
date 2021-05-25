const { User, Article, Topic } = require('../models');
const commonViews = require('../views/common.views');
const { getCommandParams } = require('../helpers/commands.helper');
const debug = require('debug')('slack-bookshelf:server');
const { getInfo } = require('../helpers/medium.helper');
const { plainText } = require('../views/blocks.views');

/*
  Acciones del usuario sobre su coleccion personal de posts
*/

async function savePost(req, res) {

  const { text, team, user } = req;
  const commandParams = getCommandParams(text, 1);

  try {
    if (!commandParams)
      throw new Error(req.__('errors.number_of_params_error'));
    const [postUrl] = commandParams;

    let post = await Article.findOne({ where: { url: postUrl } });

    if (!post) {
      const info = await getInfo(postUrl);
      debug('INFO:', { info });
      if (!info) throw new Error(req.__('errors.get_post_info_error'));

      const {
        name,
        description,
        image,
        author: { name: authorName },
        keywords,
      } = info;

      post = await Article.create({
        title: name,
        url: postUrl,
        description,
        image: image[0],
        author: authorName,
        keywords: keywords.join(','),
      });
    }

    if (!post) throw new Error(req.__('errors.create_post_error'));

    await post.addUser(user);

    res.renderBlocks([plainText(req.__('articles.add_success'))]);
  } catch (e) {
    debug(e);
    res.renderSlack(commonViews.commandError(e.message));
  }
}

/*
  Demo list posts
*/
async function getUserSavedPosts(req, res) {
  try {
    const posts = await req.user.getArticles();

    res.json(commonViews.listPosts(posts));
  } catch (e) {
    res.json(commonViews.commandError(req.__('errors.list_posts_error')));
  }
}

/*
  Show help message
*/
function showHelp(req, res) {
  const arrayHelpCommands = Object.entries(res.__('help_commands'));
  const errorMessage = res.__('error_message');

  res.renderBlocks(commonViews.showHelp(arrayHelpCommands, errorMessage));
}

async function getTopics(req, res) {
  const { team } = req;

  try {
    const topics = await Topic.findAll({
      where: { TeamId: team.id },
    });
    if (!topics) {
      throw new Error(req.__('errors.no_topics'));
    } else {
      res.renderBlocks(commonViews.getTopics(topics));
    }
  } catch (e) {
    res.renderSlack(commonViews.commandError(e.message));
  }
}

module.exports = {
  savePost,
  getUserSavedPosts,
  showHelp,
  getTopics,
};
