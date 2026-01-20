// Core Modules
import path from "path";

// External MOdules
import express from "express";
const hostRouter = express.Router();

// Local Module
import {
  getAddHome,
  postAddHome,
  getHostHomes,
  getEditHome,
  postEditHome,
  postDeleteHome,
} from "../controllers/hostController.js";
// const rootDir = require('#utils/pathUtil'); // pro method
// const rootDir = require("../utils/pathUtil");  //problem if the folder structure is deep

hostRouter.get("/add-home", getAddHome);
hostRouter.post("/add-home", postAddHome);
hostRouter.get("/host-home-list", getHostHomes);
hostRouter.get("/edit-home/:_id", getEditHome);
hostRouter.post("/edit-home", postEditHome);
hostRouter.post("/delete-home/:_id", postDeleteHome);

export { hostRouter };
