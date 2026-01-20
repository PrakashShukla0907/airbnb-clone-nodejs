// core modules
import path from "path";

// External Module
import express from "express";
import session from "express-session";
import { MongoStore } from "connect-mongo";
import dotenv from "dotenv";



dotenv.config();

const DB_PATH =
  process.env.MONGODB_URI ||
  "mongodb+srv://prakashshukla0907_db_user:airbnbROOT@airbnbcluster.snkerg9.mongodb.net/airbnb?appName=airbnbCluster";

// local module
import authRouter from "./routes/authRouter.js";
import storeRouter from "./routes/storeRouter.js";
import { hostRouter } from "./routes/hostRouter.js";
import rootDir from "#utils/pathUtil";
import { pageNotFound } from "./controllers/errors.js";
import mongoose from "mongoose";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const store = MongoStore.create({
  mongoUrl: DB_PATH,
  collectionName: "sessions",
  ttl: 14 * 24 * 60 * 60,
});

app.use(express.urlencoded());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  }),
);

app.use((req, res, next) => {
  // console.log("Cookies:", req.get("Cookie"));
  // req.isLoggedIn = req.get("Cookie")
  //   ? req.get("Cookie").split("=")[1] === "true"
  //   : false;
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use("/auth", authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});
app.use("/host", hostRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.use(pageNotFound);

const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Mongoose Connected");
    app.listen(PORT, () => {
      console.log(`server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("error while connecting to mongoose", error);
  });
