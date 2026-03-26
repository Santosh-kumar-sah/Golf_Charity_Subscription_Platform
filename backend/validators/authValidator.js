import { body } from "express-validator";

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name can only contain letters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 }) // match your backend logic
    .withMessage("Password must be at least 6 characters")
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

export { registerValidator, loginValidator };