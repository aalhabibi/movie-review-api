const express = require("express");
const authenticateToken = require("../middleware/tokenAuthentication");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const { param, validationResult } = require("express-validator");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("ID parameter is required")
      .isInt()
      .withMessage("ID must be a valid integer"),
  ],
  authenticateToken,
  async (req, res) => {
    const user = await getUser(req.params.id);
    if (user) res.status(200).json({ user });
    else res.status(404).json({ message: "User not found" });
  }
);

router.put(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("ID parameter is required")
      .isInt()
      .withMessage("ID must be a valid integer"),
  ],
  authenticateToken,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userDetails = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      await updateUser(req.params.id, userDetails, res);
    } catch (error) {
      console.error("Error occurred:", error);

      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

router.delete(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("ID parameter is required")
      .isInt()
      .withMessage("ID must be a valid integer"),
  ],
  authenticateToken,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await deleteUser(req.params.id, res);
    } catch (error) {
      console.error("Error occurred:", error);

      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }
);

module.exports = router;
