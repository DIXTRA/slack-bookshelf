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
function getPosts(req, res) {
  const posts = ['post1', 'post2'];
  // res.send(`Listing ${req.user} posts`);
  res.json(commonViews.listPosts(posts));
}

module.exports = {
  savePost,
  getPosts,
};
