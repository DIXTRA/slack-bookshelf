const visibility = {
  inChannel: 'in_channel',
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
  base object containing blocks array with all UI blocks
*/
function base(blocks = [], inChannel = false) {
  const responseType = inChannel ? visibility.inChannel : visibility.ephemeral;

  return {
    response_type: responseType,
    blocks,
  };
}

module.exports = {
  plainText,
  base,
};
