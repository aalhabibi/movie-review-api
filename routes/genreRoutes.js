const express = require("express");
const authenticateToken = require("../middleware/tokenAuthentication");
const { body, validationResult } = require("express-validator");
const {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
} = require("../controllers/genreController");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await getAllGenres();
    res.status(200).json({ genres });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await getGenreById(req.params.id);
    if (genre == null) res.status(404).json({ message: "Genre not found" });
    else res.status(200).json({ genre });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.post(
  "/",
  authenticateToken,
  body("name").notEmpty().withMessage("Genre name required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await createGenre(req.body.name);
      res.status(200).json({ message: "Genre has been added" });
    } catch (error) {
      console.error("Error occurred:", error);
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  body("name").notEmpty().withMessage("Genre name required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const result = await updateGenre(req.params.id, req.body.name);
      if (result) res.status(200).json({ message: "Genre has been updated" });
      else res.status(404).json({ message: "Genre not found" });
    } catch (error) {
      console.error("Error occurred:", error);
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  const affectedRows = await Genre.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (affectedRows == 0) res.status(404).json({ message: "Genre not found" });
  else res.status(200).json({ message: "Genre has been deleted" });
});

module.exports = router;
