const thumbnailRequired = (req, res, next) => {
  if (!req.files.thumbnail) {
    return res.status(400).json({ error: "Thumbnail required" });
  }
  next();
};

module.exports = thumbnailRequired;
