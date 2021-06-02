function noApprovalRequests () {
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*No approval requests*`
      },
    },
  ]
}

function listApprovalRequests(approvalRequests = []) {
  return approvalRequests.map((request) => {
    const { article, topic, createdBy } = request;

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
            "alt_text": createdBy.displayName
          },
          {
            "type": "mrkdwn",
            "text": `*${createdBy.displayName}*`
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
            "text": {
              "type": "plain_text",
              "text": "Approve",
              "emoji": true
            },
            "style": "primary",
            "value": "approve"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Decline",
              "emoji": true
            },
            "style": "danger",
            "value": "decline"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Remove",
              "emoji": true
            },
            "value": "details"
          }
        ]
      },
    ]
  }).flat();
}

function listSavedPosts (savedPosts = []) {
  return savedPosts.map((post) => [
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
}

module.exports = {
  listApprovalRequests,
  noApprovalRequests,
  listSavedPosts,
};
