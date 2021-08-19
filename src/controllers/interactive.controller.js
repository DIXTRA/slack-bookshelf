const debug = require('debug')('slack-bookshelf:server');
const { ActionType } = require('../enum/action_type');
const { ArticleTopic, Article } = require('../models');
const articlesViews = require('../views/articles.views');
const blocks = require('../views/blocks.views');
const axios = require('axios');
const events = require('./events.controller.js');

async function removeArticleTopic(articleTopicId) {
  try {
    const articleTopicObject = await ArticleTopic.findOne({ where: { id: articleTopicId } });

    if (articleTopicObject) {
      await articleTopicObject.destroy();

      return true;
    } else {
      return false;
    }
  } catch (ex) {
    console.log(ex);
    
    return false;
  }
}

async function declineArticleTopic(articleTopicId, user) {
  try {
    const articleTopicObject = await ArticleTopic.findOne({ where: { id: articleTopicId } });

    if (articleTopicObject) {
      articleTopicObject.approved = false;
      articleTopicObject.ReviewedById = user.id;
      articleTopicObject.reviewedAt = new Date();

      await articleTopicObject.save();

      return true;
    } else {
      return false;
    }
  } catch (ex) {
    console.log(ex);

    return false;
  }
}

async function approveArticleTopic(articleTopicId, user) {
  try {
    const articleTopicObject = await ArticleTopic.findOne({ where: { id: articleTopicId } });

    if (articleTopicObject) {
      articleTopicObject.approved = true;
      articleTopicObject.ReviewedById = user.id;
      articleTopicObject.reviewedAt = new Date();
      
      await articleTopicObject.save()
  
      return true
    }
  } catch (ex) {
    console.log(ex);

    return false;
  }
}

async function runInteractive(req, res) {
  const payload  = JSON.parse(req.body.payload);
  const { type, response_url } = payload
  const { user, team } = req;

  switch(type) {
    case 'block_actions':
      const blockActionPromises = payload.actions.map(action => {
        return new Promise(async (resolve, reject) => {
          try {
            debug("action: " + JSON.stringify(action));
            const { action_id, value } = action;

            switch(action_id) {
              case ActionType.ApproveArticleTopic:
                if (user.isAdmin) {
                  const approveResult = await approveArticleTopic(value, user);

                  if (approveResult) {
                    return resolve({ message: 'Article approved successfully', action });
                  } else {
                    return reject({ error: 'Error approving the article', action });  
                  }
                } else {
                  return reject({ error: 'Not permitted', action });
                }
              case ActionType.DeclineArticleTopic:
                if (user.isAdmin) {
                  const declineResult = await declineArticleTopic(value, user);

                  if (declineResult) {
                    return resolve({ message: 'Article declined successfully', action });
                  } else {
                    return reject({ error: 'Error declining the article', action });  
                  }
                } else {
                  return reject({ error: 'Not permitted', action });  
                }
              case ActionType.RemoveArticleTopic:
                if (user.isAdmin) {
                  const removeResult = await removeArticleTopic(value);

                  if (removeResult) {
                    return resolve({ message: 'Article removed successfully', action });
                  } else {
                    return reject({ error: 'Error removing the article', action });  
                  }
                } else {
                  return reject({ error: 'Not permitted', action });  
                }
              case ActionType.ListRemoveArticleTopic:
                if (user.isAdmin) {
                  const articleTopic = await ArticleTopic.findOne({
                    where: { id: value, approved: true },
                    include: [
                      { model: Article, as: 'article' },
                    ],
                  });
                  if(articleTopic){
                    const {article } = articleTopic;
                    const actions = [
                      blocks.actionStructure(req.__('commons.delete'), value, ActionType.ListConfirmRemoveArticleTopic, "danger"),
                      blocks.actionStructure(req.__('commons.cancel'), value, ActionType.ListDeclineRemoveArticleTopic, "default")
                    ];
                    try {
                      await axios({
                        method: 'post',
                        url: response_url,
                        data: {
                          replace_original: true,
                          blocks: 
                          [...articlesViews.renderArticle(req, article, actions, null, "*" + req.__('articles.remove_article') + "*").flat()]
                          ,
                        },
                      });
                      res.sendStatus(200);
                    } catch (error) {
                      res.sendStatus(500);
                    }
                    return;
                  }
                }
                res.sendStatus(404);
                break;
              case ActionType.ListDeclineRemoveArticleTopic:
                try {
                  await axios({
                    method: 'post',
                    url: response_url,
                    data: {
                      delete_original: true,
                    },
                  });
                  res.sendStatus(200);
                } catch (error) {
                  res.sendStatus(500);
                }
                break;
              case ActionType.ListConfirmRemoveArticleTopic:
                let block = [];
                if (user.isAdmin) {
                  const removeResult = await removeArticleTopic(value);
                  
                  if (removeResult) {
                    block = blocks.block(blocks.plainText(req.__('articles.remove_article_success')));
                  } else {
                    block = blocks.block(blocks.plainText(req.__('errors.remove_article_error')));
                  }
                } else {
                  block = blocks.block(blocks.plainText(req.__('errors.not_permitted')));
                }
                try {
                  await axios({
                    method: 'post',
                    url: response_url,
                    data: {
                      replace_original: true,
                      blocks: [block],
                    },
                  });
                  res.sendStatus(200);
                } catch (error) {
                  res.sendStatus(500);
                }
                break;
              default:
                return reject({ error: 'unhandled action', action });
            }
          } catch (ex) {
            console.log("Exception occured");
            console.log(ex);

            reject(ex);
          }
        });
      });

      await Promise.allSettled(blockActionPromises)
        .then((results) => {
          results.forEach(({ status, value }) => {
            if (status === 'fulfilled') {
              events.runEvent(req,res);
              // TODO: Add home reload  
            } else { // error performing the action
              res.sendStatus(500);
            }
          });
        });
      break;
    default:
      // TODO: Cambiar por otro mensaje y/o estructura
      res.error('Ouch!');
  }
}

module.exports = {
  runInteractive
};
