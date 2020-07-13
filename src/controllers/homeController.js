let getHome = (req, res) => {
  return res.render("main/home/home" , {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user // lay thang du lieu tu user
  });
};

module.exports = {
  getHome: getHome
};
