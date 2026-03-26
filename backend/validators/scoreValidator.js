import { body } from "express-validator";

const addScoreValidator = [
  body("score")
    .isInt({ min: 1, max: 45 })
    .withMessage("Score must be between 1 and 45"),

  body("played_at")
    .isISO8601()
    .withMessage("Valid date required")
];

export { addScoreValidator };