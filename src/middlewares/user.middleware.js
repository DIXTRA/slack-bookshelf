function getUser(req, res, next) {
  // fetch or create user & add to req...
  req.user = "pochoclo";
  next();
}

module.exports = {
  getUser,
};
