const i18n = require('i18n');
const axios = require('axios');

const { getInfo } = require('../../helpers/medium.helper');
const { Article, ArticleTopic, User, Topic } = require('../../models');

const { plainText, block } = require('../../views/blocks.views');

i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  directory: __dirname + '/../../../locales',
  objectNotation: true,
});

module.exports = async function (job, done) {
  const { url, userId, topicId, options: { locale = 'en', responseUrl } } = job.data;

  try {
    const articleInfo = await getInfo(url);

    if (!articleInfo) throw new Error(i18n.__({ phrase: 'errors.get_post_info_error', locale }));
    
    const { name, description, image, authorName, keywords } = articleInfo;

    let article = await Article.findOne({ where: { url: url } });

    if (!article) {
      article = await Article.create({
        title: name,
        url: url,
        description,
        image: image[0],
        author: authorName,
        keywords: (keywords || []).join(','),
      });
    }

    if (!article) throw new Error(i18n.__({ phrase: 'errors.create_post_error', locale }));

    const user = await User.findOne({ where: { id: userId }});

    if (!user) throw new Error(i18n.__({ phrase: 'errors.user_not_found_error', locale }));
  
    if (topicId) {
      const topic = await Topic.findOne({ where: { id: topicId }});

      if (!topic) throw new Error(i18n.__({ phrase: 'errors.topic_not_found_error', locale }));

      await ArticleTopic.create({
        CreatedById: user.id,
        TopicId: topic.id,
        ArticleId: article.id,
      });

      if (responseUrl) {
        await axios({
          method: 'post',
          url: responseUrl,
          data: {
            replace_original: true,
            blocks: [block(plainText(i18n.__({ phrase: 'articles.add_to_topic_success', locale })))],
          },
        });
      }
    } else {
      await article.addUser(user);

      if (responseUrl) {
        await axios({
          method: 'post',
          url: responseUrl,
          data: {
            replace_original: true,
            blocks: [block(plainText(i18n.__({ phrase: 'articles.add_success', locale })))],
          },
        });
      }
    }

    done();
  } catch (ex) {
    console.log(ex);

    throw ex;
  }
}
