const { addPost, deletePost, listPosts } = require('./postCommands');
const { addTopic, deleteTopic, listTopics } = require('./topicCommands');
const { savePost, listUserPosts } = require('./userCommands');

module.exports = {
  "add_post": addPost,
  "delete_post": deletePost,
  "list_posts": listPosts,
  "add_topic": addTopic,
  "delete_topic": deleteTopic,
  "list_topics": listTopics,
  "save_post": savePost,
  "list_saved": listUserPosts,
};
