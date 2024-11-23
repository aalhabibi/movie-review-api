const { Genre } = require("../models/genre.js");

async function createGenre(name) {
  return await Genre.create({ name });
}
async function getAllGenres() {
  return await Genre.findAll({
    attributes: ["id", "name"],
    raw: true,
  });
}

async function getGenreById(id) {
  return await Genre.findByPk(id, {
    raw: true,
    attributes: ["id", "name"],
  });
}

async function updateGenre(id, name) {
  const [affectedRows] = await Genre.update(
    {
      name,
    },
    {
      where: {
        id: id,
      },
    }
  );
  if (affectedRows == 0) return false;
  else return true;
}

module.exports = {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
};
