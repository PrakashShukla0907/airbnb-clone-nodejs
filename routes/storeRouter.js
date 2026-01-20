// Core Module
import path from "path";

// External Module
import express from "express";
const storeRouter = express.Router();

// Local Module
import rootDir from "../utils/pathUtil.js";
// const { registeredHomes } = require("./hostRouter");
import {
  getHomes,
  getBookings,
  getIndex,
  getFavouriteList,
  getHomeDetails,
  postAddToFavourite,
  postRemoveFavHome,
} from "../controllers/storeController.js";

storeRouter.get("/", getIndex);
storeRouter.get("/homes", getHomes);
storeRouter.get("/bookings", getBookings);
storeRouter.get("/homes/:_id", getHomeDetails);
storeRouter.get("/favourites", getFavouriteList);
storeRouter.post("/favourites", postAddToFavourite);
storeRouter.post("/favourites/delete/:_id", postRemoveFavHome);

export default storeRouter;
