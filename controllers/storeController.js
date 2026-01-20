import Home from "../models/home.js";
import User from "../models/user.js";

export const getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      accountType: req.session.user ? req.session.user.accountType : null,
    });
  });
};

export const getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Home List",
      currentPage: "Home",
      isLoggedIn: req.session.isLoggedIn,
      accountType: req.session.user ? req.session.user.accountType : null,
    });
  });
};

export const getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    accountType: req.session.user ? req.session.user.accountType : null,
  });
};

export const getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    accountType: req.session.user ? req.session.user.accountType : null,
  });
};

export const postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  return res.redirect("/favourites");
};

export const getHomeDetails = (req, res, next) => {
  const _id = req.params._id;
  Home.findById(_id).then((home) => {
    if (!home) {
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "homeDetails",
        isLoggedIn: req.session.isLoggedIn,
        accountType: req.session.user ? req.session.user.accountType : null,
      });
    }
  });
};

export const postRemoveFavHome = async (req, res, next) => {
  const homeId = req.params._id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((fav) => fav != homeId);
    await user.save();
  }

  return res.redirect("/favourites");
};
