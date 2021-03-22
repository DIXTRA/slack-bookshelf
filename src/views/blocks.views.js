const visibility = {
  in_channel: 'in_channel',
  ephemeral: 'ephemeral',
};

/*
  Plain text UI block
 */
function plainText(text) {
  return {
    type: 'plain_text',
    emoji: true,
    text,
  };
}

/*
  Markdown UI block
 */
function markdown(text) {
  return {
    type: 'mrkdwn',
    text,
  };
}

/*
  base object containing blocks array with all UI blocks
*/
function base(blocks = [], inChannel = false) {
  const { in_channel, ephemeral } = visibility;
  const response_type = inChannel ? in_channel : ephemeral;

  return {
    response_type,
    blocks,
  };
}

module.exports = {
  plainText,
  base,
  markdown,
};
