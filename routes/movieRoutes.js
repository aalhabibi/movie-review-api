const express = require("express");
const authenticateToken = require("../middleware/tokenAuthentication");
const {
  upload,
  createMovie,
  getMovieById,
  getAllMovies,
  searchMovies,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { body, validationResult } = require("express-validator");
const thumbnailRequired = require("../middleware/thumbnailValidator");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  upload,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("releaseDate").notEmpty().withMessage("Release Date required"),
    body("directorId").notEmpty().withMessage("Director id required"),
  ],
  thumbnailRequired,
  async (req, res) => {
    // console.log(req.files);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await createMovie(
      req.body.title,
      req.body.description,
      req.body.releaseDate,
      req.body.directorId,
      req.files.thumbnail[0],
      req.files.scenes,
      `${req.protocol}://${req.get("host")}`,
      req.body.genreId
    );
    res.status(200).json({ message: "Movie created successfully" });
  }
);

router.get("/:id/", async (req, res) => {
  const movie = await getMovieById(req.params.id);
  if (movie) {
    res.status(200).json({ movie });
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

router.get("/", async (req, res) => {
  if (req.query.title || req.query.director || req.query.genre) {
    const movies = await searchMovies(req.query);
    console.log(movies);
    if (!movies.length) {
      res.status(404).json({ message: "No movies were found" });
    } else {
      res.status(200).json({ movies });
    }
  } else {
    const movies = await getAllMovies();
    if (!movies.length) {
      res.status(404).json({ message: "No movies were found" });
    } else {
      res.status(200).json({ movies });
    }
  }
});

router.put("/:id", upload, authenticateToken, async (req, res) => {
  const updated = await updateMovie(
    req.params.id,
    req.body.title,
    req.body.description,
    req.body.releaseDate,
    req.body.directorId,
    req.files.thumbnail,
    req.files.scenes,
    `${req.protocol}://${req.get("host")}`,
    req.body.genreId
  );

  if (updated) res.status(200).send({ message: "Movie updated succesfully" });
  else res.status(404).json({ message: "Movie not found" });
});

router.delete("/:id/", authenticateToken, async (req, res) => {
  const deleted = await deleteMovie(
    req.params.id,
    `${req.protocol}://${req.get("host")}`
  );
  if (deleted) res.status(200).send({ message: "Movie deleted succesfully" });
  else res.status(404).json({ message: "Movie not found" });
});

module.exports = router;
