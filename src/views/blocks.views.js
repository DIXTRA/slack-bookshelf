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
function base(blocks = []) {
  return {
    response_type: 'in_channel', // or 'ephemeral' // move to constant & in parameters
    blocks,
  };
}

module.exports = {
  plainText,
  base,
};
