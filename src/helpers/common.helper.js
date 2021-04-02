const { nameRegex } = require('../utils/constants');

function validName(name = '') {
  return nameRegex.test(name);
}

module.exports = { validName };
