const { body, validationResult } = require("express-validator");
const { Movie } = require("../models/movie");

const ratingValidator = [
  body("rating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Rating has to be a number between 0 and 10")
    .notEmpty()
    .withMessage("Rating Required"),
  body("movieId")
    .notEmpty()
    .withMessage("Movie ID Required")
    .isInt()
    .custom(async (movieId) => {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return Promise.reject("Movie not found");
      }
    }),
];

module.exports = { ratingValidator };
