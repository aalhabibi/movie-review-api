const express = require("express");
const authenticateToken = require("../middleware/tokenAuthentication");
const { body, validationResult } = require("express-validator");
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { ratingValidator } = require("../middleware/reviewValidator");
const {
  reviewAuthorityValidator,
} = require("../middleware/userAuthorityValidator");

const router = express.Router();

router.post("/", authenticateToken, ratingValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await createReview(
    req.body.rating,
    req.body.comment,
    req.body.movieId,
    req.user.id
  );
  res.status(200).json({ message: "Review posted successfully" });
});

router.get("/", async (req, res) => {
  const reviews = await getAllReviews(req.query);
  if (reviews.length == 0)
    res.status(404).json({ message: "No reviews found" });
  else res.status(200).json({ reviews });
});

router.get("/:id/", async (req, res) => {
  const review = await getReviewById(req.params.id);

  if (!review) res.status(404).json({ message: "No reviews found" });
  else res.status(200).json({ review });
});

router.put(
  "/:id/",
  authenticateToken,
  reviewAuthorityValidator,
  async (req, res) => {
    const updated = await updateReview(
      req.params.id,
      req.body.rating,
      req.body.comment,
      req.body.movieId
    );
    if (updated == 0) res.status(404).json({ message: "Review not found" });
    else res.status(200).json({ message: "Review updated successfully" });
  }
);

router.delete(
  "/:id/",
  authenticateToken,
  reviewAuthorityValidator,
  async (req, res) => {
    const deleted = await deleteReview(req.params.id);

    if (deleted == 0) res.status(404).json({ message: "Review not found" });
    else res.status(200).json({ message: "Review deleted successfully" });
  }
);

module.exports = router;
