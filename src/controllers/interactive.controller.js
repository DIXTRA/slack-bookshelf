const debug = require('debug')('slack-bookshelf:server');
const { ActionType } = require('../enum/action_type');
const { ArticleTopic } = require('../models');

async function removeArticleTopic(articleTopicId) {
  try {
    const articleTopicObject = await ArticleTopic.findOne({ where: { id: articleTopicId } });

    if (articleTopicObject) {
      articleTopicObject.destroy();

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
      articleTopicObject.reviewedBy = user;
      articleTopicObject.save();

      return true;
    } else {
      return false;
    }
  } catch (ex) {
    debugger;
    console.log(ex);

    return false;
  }
}

async function approveArticleTopic(articleTopicId, user) {
  try {
    const articleTopicObject = await ArticleTopic.findOne({ where: { id: articleTopicId } });

    if (articleTopicObject) {
      articleTopicObject.approved = true;
      articleTopicObject.reviewedBy = user;
      articleTopicObject.save();
  
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

  debug("payload: " + JSON.stringify(payload));

  const { user, team } = req;

  console.log(user, team, payload);

  switch(type) {
    case 'block_actions':
      const blockActionPromises = payload.actions.map(action => {
        console.log(action);

        return new Promise(async (resolve, reject) => {
          try {
            debug("action: " + JSON.stringify(action));
            const { action_id, value } = action;

            switch(action_id) {
              case ActionType.ApproveArticleTopic:
                if (user.isAdmin) {
                  const approveResult = approveArticleTopic(value, user);

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
                  const declineResult = declineArticleTopic(value, user);

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
                  const removeResult = removeArticleTopic(value);

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
            if (status === 'fulfilled') { // successfully performed the action
              const { message, action } = value
            } else { // error performing the action
              debugger
            }
          });
        }).catch((error) => {
          console.log(error);
          debugger;
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
