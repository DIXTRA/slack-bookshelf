const visibility = {
  in_channel: 'in_channel',
  ephemeral: 'ephemeral',
};

/*
  Block wrapper
  @text: block content
  @type: 'section' | 'header' | ...
*/
function block(text, type = 'section') {
  return { type, text };
}

/*
  Plain text UI block
*/
function plainText(text, type) {
  return block(
    {
      type: 'plain_text',
      emoji: true,
      text,
    },
    type
  );
}

/*
  Markdown UI block
*/
function markdown(text, type) {
  return block(
    {
      type: 'mrkdwn',
      text,
    },
    type
  );
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
