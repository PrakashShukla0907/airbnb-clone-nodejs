export const pageNotFound = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    currentPage: "404",
    isLoggedIn: req.session.isLoggedIn,
    accountType: req.session.user ? req.session.user.accountType : null,
  });
};
