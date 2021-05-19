const { User, Article, Topic } = require('../models');
const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');
const debug = require('debug')('slack-bookshelf:server');

/*
  Acciones del usuario sobre su coleccion personal de posts
*/

function savePost(req, res) {
  /*
  Agregar Post:
  * Si existe (por url) lo traigo y lo asigno al user
  * Si no existe:
    * hago requ st para traer data del post (titulo, description, imagen?) # Es necesario? (slack sabe mostrar links, pero quiero poder buscarlo por titulo?)
    * Creo Post en db con esta info
    * Asigno a user
  
*/
  res.send('Adding post to collection');
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
