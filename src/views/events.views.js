function noApprovalRequests() {
  return [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Articles Awaiting Approval",
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*No approval requests*`
      },
    },
  ];
}

function listApprovalRequests(approvalRequests = []) {
  let blocks = [];

  blocks = approvalRequests.map((request) => {
    const { article, topic, createdBy } = request;

    const userDisplayName = !!createdBy.displayName
      ? createdBy.displayName
      : createdBy.username

    return [
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "Submitted by"
          },
          {
            "type": "image",
            "image_url": createdBy.profilePicture,
            "alt_text": userDisplayName,
          },
          {
            "type": "mrkdwn",
            "text": `*${userDisplayName}*`
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Topic:* ${topic.name}\n\n*Title:* ${article.title}\n\n*Link:* ${article.url}\n`
        },
        "accessory": {
          "type": "image",
          "image_url": article.image,
          "alt_text": article.title
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "action_id": "approve_article_topic",
            "text": {
              "type": "plain_text",
              "text": "Approve",
              "emoji": true
            },
            "style": "primary",
            "value": request.id.toString(),
          },
          {
            "type": "button",
            "action_id": "decline_article_topic",
            "text": {
              "type": "plain_text",
              "text": "Decline",
              "emoji": true
            },
            "style": "danger",
            "value": request.id.toString(),
          },
          {
            "type": "button",
            "action_id": "remove_article_topic",
            "text": {
              "type": "plain_text",
              "text": "Remove",
              "emoji": true
            },
            "value": request.id.toString(),
          }
        ]
      },
    ];
  }).flat();

  blocks.unshift(
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Articles Awaiting Approval",
      }
    },
  );

  return blocks;
}

function listSavedPosts(savedPosts = []) {
  let blocks = [];

  blocks = savedPosts.map((post) => [
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*Title:* ${post.title}\n\n*Link:* ${post.url}\n`
      },
      "accessory": {
        "type": "image",
        "image_url": post.image,
        "alt_text": post.title
      }
    },
  ]).flat();

  blocks.unshift(
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Your saved articles",
      }
    },
  );

  return blocks;
}

module.exports = {
  listApprovalRequests,
  noApprovalRequests,
  listSavedPosts,
};
