const { User, Article, Topic } = require('../models');
const commonViews = require('../views/common.views');
const { getCommandParams } = require('../helpers/commands.helper');
const debug = require('debug')('slack-bookshelf:server');
const { getInfo } = require('../helpers/medium.helper');
const { plainText, block } = require('../views/blocks.views');
const { saveUserArticleJob } = require('../jobs/articles/articleJobs');
const articlesViews = require('../views/articles.views');

/*
  Acciones del usuario sobre su coleccion personal de posts
*/

async function savePost(req, res) {
  const { text, team, user } = req;
  const responseUrl = req.body.response_url;
  const commandParams = getCommandParams(text, 1);

  try {
    if (!commandParams)
      throw new Error(req.__('errors.number_of_params_error'));
    const [postUrl] = commandParams;

    let post = await Article.findOne({ where: { url: postUrl } });

    if (!post) {
      saveUserArticleJob(postUrl, user.id, { locale: 'en', responseUrl });

      return res.renderBlocks([block(plainText(req.__('articles.processing_article')))]);
    }

    await post.addUser(user);

    res.renderBlocks([block(plainText(req.__('articles.add_success')))]);
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
    const articlesView = posts.map((article) => { 
        return articlesViews.renderArticle(req, article)
      } 
    );
  
    res.renderBlocks(
      [...articlesView.flat()]
    );
  } catch (e) {
    console.log(e);
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
