exports.isLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  console.log("You need to login first");
  return res.redirect("/coursedirectory/auth/login");
};

exports.isAdmin = function (req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }
  console.log("info", "You are unauthorized!");
  //req.logout();
  return res.redirect("/coursedirectory/admin");
};
