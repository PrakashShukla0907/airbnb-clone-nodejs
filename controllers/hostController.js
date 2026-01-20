import Home from "../models/home.js";

export const getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    accountType: req.session.user ? req.session.user.accountType : null,
  });
};

export const postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl, discription } =
    req.body;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photoUrl,
    discription,
  });
  home.save().then(() => {
    console.log("Home Added SuccessFully");
  });
  res.redirect("/host/host-home-list");
};

export const getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      isLoggedIn: req.session.isLoggedIn,
      registeredHomes: registeredHomes,
      pageTitle: "Host Home List",
      currentPage: "host-homes",
      accountType: req.session.user ? req.session.user.accountType : null,
    });
  });
};

export const getEditHome = (req, res) => {
  const _id = req.params._id;
  const editing = req.query.editing === "true";
  Home.findById(_id).then((home) => {
    if (!home) {
      console.log("Home Not Found For Editing");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      home: home,
      pageTitle: "edit Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.session.isLoggedIn,
      accountType: req.session.user ? req.session.user.accountType : null,
    });
  });
};

export const postEditHome = (req, res) => {
  const { _id, houseName, price, location, rating, photoUrl, discription } =
    req.body;
  Home.findById(_id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photoUrl = photoUrl;
    home.discription = discription;
    home
      .save()
      .then((result) => {
        console.log("Home Added SuccessFully", result);
      })
      .catch((error) => console.log("error while updating home", error));
    res.redirect("/host/host-home-list");
  });
};

export const postDeleteHome = (req, res, next) => {
  const _id = req.params._id;
  Home.findByIdAndDelete(_id)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => console.log("error while deleting", error));
};
