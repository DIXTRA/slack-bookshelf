function getCommandParams(text = '', wordCount = 1) {
  const words = text.split(' ');
  if (words.length != wordCount) return;

  return words;
}

module.exports = { getCommandParams };
