const Queue = require('bull');
const { getInfo } = require('../helpers/medium.helper');
const { Article, ArticleTopic } = require('../models');

const postsQueue = new Queue('video transcoding', process.env.REDIS_URI);

postsQueue.process(async function (job, done) {
  const { url, user, topic } = job.data;

  const postInfo = await getInfo(url);

  if (!postInfo) throw new Error(req.__('errors.get_post_info_error'));

  const { name, description, image, authorName, keywords } = postInfo;

  const post = await Article.create({
    title: name,
    url: postUrl,
    description,
    image: image[0],
    author: authorName,
    keywords: (keywords || []).join(','),
  });

  if (!post) throw new Error(req.__('errors.create_post_error'));

  console.log("FOUND ARTICLE");

  if (topic) {
    await ArticleTopic.create({
      CreatedById: user.id,
      TopicId: topic.id,
      ArticleId: post.id,
    });
  } else {
    await post.addUser(user);
  }

  done();
});

export default function createPostJob (url, user, team, topic) {
  postsQueue.add({ url, user, team, topic });
}
