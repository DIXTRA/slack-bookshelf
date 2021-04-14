const { User, Article } = require('../models');
const commonViews = require('../views/common.views');

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
    const posts = await req.user.getArticles()

    res.json(commonViews.listPosts(posts));
  } catch (e) {
    res.json(commonViews.commandError(req.__("errors.list_posts_error")));
  }
}

/*
  Show help message
*/
function showHelp(req, res) {  
  res.renderBlocks(commonViews.showHelp());
}

module.exports = {
  savePost,
  getUserSavedPosts,
  showHelp,
};
