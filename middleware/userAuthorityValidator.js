const { Review } = require("../models/review");

async function reviewAuthorityValidator(req, res, next) {
  const review = await Review.findByPk(req.params.id, { raw: true });
  if (!review) {
    res.status(404).json({ message: "Review not found" });
  } else {
    if (review.userId != req.user.id) {
      res
        .status(403)
        .json({ message: "Unauthorized to edit or delete review" });
    } else next();
  }
}

module.exports = { reviewAuthorityValidator };
