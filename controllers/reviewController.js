const { Op } = require("sequelize");
const sequelize = require("../models");
const { Movie } = require("../models/movie");
const { Review } = require("../models/review");
const { User } = require("../models/user");

async function createReview(rating, comment, movieId, userId) {
  await Review.create({ rating, comment, movieId, userId });
}

async function getAllReviews(query) {
  let filterConditions = {};
  if (query.rating) {
    filterConditions.rating = query.rating;
  }
  if (query.movie) {
    filterConditions["$Movie.title$"] = { [Op.like]: `%${query.movie}%` };
  }
  if (query.user) {
    filterConditions["$User.username$"] = { [Op.like]: `%${query.user}%` };
  }

  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Movie,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [sequelize.col("User.username"), "username"],
        [sequelize.col("Movie.title"), "movieTitle"],
      ],
    },
    raw: true,
    where: filterConditions,
  });
  return reviews;
}

async function getReviewById(id) {
  const review = Review.findByPk(id, {
    include: [
      {
        model: User,
        attributes: [],
      },
      {
        model: Movie,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [sequelize.col("User.username"), "username"],
        [sequelize.col("Movie.title"), "movieTitle"],
      ],
    },
    raw: true,
  });
  return review;
}

async function updateReview(id, rating, comment, movieId) {
  let updatedInfo = {};
  if (rating) {
    updatedInfo.rating = rating;
  }
  if (comment) {
    updatedInfo.comment = comment;
  }
  if (movieId) {
    updatedInfo.movieId = movieId;
  }

  const [affectedRows] = await Review.update(updatedInfo, {
    where: { id: id },
  });
  console.log(affectedRows);
  return affectedRows;
}

async function deleteReview(id) {
  const affectedRows = await Review.destroy({
    where: { id: id },
  });
  return affectedRows;
}

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
