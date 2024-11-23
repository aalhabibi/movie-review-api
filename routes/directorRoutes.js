const express = require("express");
const authenticateToken = require("../middleware/tokenAuthentication");
const { body, validationResult } = require("express-validator");
const {
  createDirector,
  getAllDirectors,
  getDirectorById,
  updateDirector,
} = require("../controllers/directorController");
const { Director } = require("../models/director");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const directors = await getAllDirectors();
    res.status(200).json({ directors });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const director = await getDirectorById(req.params.id);
    if (director == null)
      res.status(404).json({ message: "Director not found" });
    else res.status(200).json({ director });
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
  body("name").notEmpty().withMessage("Director name required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await createDirector(req.body.name, req.body.bio);
      res.status(200).json({ message: "Director has been added" });
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
  body("name").notEmpty().withMessage("Director name required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const result = await updateDirector(
        req.params.id,
        req.body.name,
        req.body.bio
      );
      if (result)
        res.status(200).json({ message: "Director has been updated" });
      else res.status(404).json({ message: "Director not found" });
    } catch (error) {
      console.error("Error occurred:", error);
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  const affectedRows = await Director.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (affectedRows == 0)
    res.status(404).json({ message: "Director not found" });
  else res.status(200).json({ message: "Director has been deleted" });
});

module.exports = router;
