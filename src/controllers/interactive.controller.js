const debug = require('debug')('slack-bookshelf:server');
const { ActionType } = require('../enum/action_type');
const { ArticleTopic } = require('../models');

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
  const { type } = payload
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
              res.status(200);
              // TODO: Add home reload  
            } else { // error performing the action
              res.status(500);
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
