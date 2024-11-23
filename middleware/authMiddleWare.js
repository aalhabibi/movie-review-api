const { body, validationResult } = require("express-validator");
const { User } = require("../models/user");

registerationValidator = [
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom(async (username) => {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error("Username is already taken");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (email) => {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error("Email is already registered");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

loginValidator = [
  body("email")
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        throw new Error("Email is not registered");
      }
    })
    .isEmail()
    .withMessage("Please provide a valid email address")
    .notEmpty()
    .withMessage("Email required"),

  body("password").notEmpty().withMessage("Password required"),
];

module.exports = { registerationValidator, loginValidator };
