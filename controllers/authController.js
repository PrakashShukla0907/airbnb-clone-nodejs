import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// ------------------------login controller------------------------
export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    currentPage: "login",
    isLoggedIn: req.session.isLoggedIn || false,
    errors: [],
    accountType: "",
    oldInput: { email: "" },
  });
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid email or password."],
      oldInput: { email },
      accountType: "",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid password."],
      oldInput: { email },
      accountType: "",
    });
  }

  // res.cookie("isLoggedIn", true);
  req.isLoggedIn = true;
  req.session.isLoggedIn = true;
  req.session.user = user;

  req.session.save((err) => {
    if (err) {
      console.log("Session save error:", err);
      return res.redirect("/login");
    }
    // 3. ONLY redirect once the save is confirmed
    res.redirect("/");
  });
};

export const postLogout = (req, res, next) => {
  // res.cookie("isLoggedIn", false);
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

// ------------------------signup controller------------------------

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    currentPage: "signup",
    isLoggedIn: req.session.isLoggedIn || false,
    accountType: "",
  });
};

export const postSignup = [
  check("FirstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name must contain only letters and spaces"),
  check("LastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last Name must contain only letters and spaces"),
  check("Email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email address"),
  check("Password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
  check("ConfirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.Password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("accountType")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["host", "guest"])
    .withMessage("Invalid account type"),
  check("terms")
    .notEmpty()
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),
  (req, res, next) => {
    const { FirstName, LastName, Email, Password, accountType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array(),
        oldInput: { FirstName, LastName, Email, Password, accountType },
        accountType: "",
      });
    }

    bcrypt
      .hash(Password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName: FirstName,
          lastName: LastName,
          email: Email,
          password: hashedPassword,
          accountType: accountType,
        });
        return user.save();
      })
      .then((user) => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          if (err) {
            console.log("Session save error:", err);
            return res.redirect("/auth/signup");
          }
          return res.redirect("/auth/login");
        });
      })
      .catch((err) => {
        let errorMessage = "An error occurred during signup. Please try again.";
        if (err.code === 11000) {
          errorMessage = "Email already exists. Please use a different email.";
        }
        return res.status(422).render("auth/signup", {
          pageTitle: "signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [{ msg: errorMessage }],
          oldInput: { FirstName, LastName, Email, Password, accountType },
          accountType: "",
        });
      });
  },
];
