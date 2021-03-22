const blocks = require('./blocks.views');

/*
  Demo de mensaje de error 
*/
function commandError(message) {
  return blocks.base([
    {
      type: 'header',
      text: blocks.plainText('Oops!'),
    },
    {
      type: 'section',
      text: blocks.plainText(message),
    },
  ]);
}

/*
  Demo de listar posts
*/
function listPosts(posts = []) {
  return blocks.base(
    posts.map((post, i) => {
      return {
        type: 'section',
        text: blocks.plainText(post),
      };
    })
  );
}

function showHelp() {
  // move somewhere else
  const items = [
    '`/sb help`: Show this message',
    '`/sb list`: List saved posts',
  ];

  return items.map((item) => ({
    type: 'section',
    text: blocks.markdown(item),
  }));
}

module.exports = {
  listPosts,
  commandError,
  showHelp,
};
