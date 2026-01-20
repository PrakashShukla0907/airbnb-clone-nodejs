// Core Module
import path from "path";

// External Module
import express from "express";
const authRouter = express.Router();

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
} from "../controllers/authController.js";

authRouter.get("/login", getLogin);
authRouter.post("/login", postLogin);
authRouter.post("/logout", postLogout);
authRouter.get("/signup", getSignup);
authRouter.post("/signup", postSignup);

export default authRouter;
