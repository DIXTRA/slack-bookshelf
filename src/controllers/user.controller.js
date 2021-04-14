const commonViews = require('../views/common.views');
const blocksViews = require('../views/blocks.views');

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

/*
  Show help message
*/
function showHelp(req, res) {
  res.renderBlocks(commonViews.showHelp());
}

function getTopics(req, res) {
  // TODO: get topic list 
  const topicList = [
    { topic: 'topic1' },
    { topic: 'topic2' },
    { topic: 'topic3' },
  ];
  
  // TODO: get article list 
  const articleList = [
    { topic: 'topic1', link: 'link1', nombre: 'nombre1' },
    { topic: 'topic2', link: 'link2', nombre: 'nombre2' },
    { topic: 'topic1', link: 'link3', nombre: 'nombre3' },
  ];

  if (topicList.length == 0) {
    res.renderBlocks(blocksViews.plainText('No se encontraron topics'));
  } else {
    var result = [];
    topicList.map((topic) =>
      result.push({
        topic: topic,
        articles: articleList.filter((article) => article.topic == topic.topic)
          .length,
      })
    );
    res.renderBlocks(commonViews.getTopics(result));
  }
}

module.exports = {
  savePost,
  getPosts,
  showHelp,
  getTopics,
};
