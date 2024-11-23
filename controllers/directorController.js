const { Director } = require("../models/director");

async function createDirector(name, bio) {
  return await Director.create({ name, bio });
}
async function getAllDirectors() {
  return await Director.findAll({
    attributes: ["id", "name", "bio"],
    raw: true,
  });
}

async function getDirectorById(id) {
  return await Director.findByPk(id, {
    raw: true,
    attributes: ["id", "name", "bio"],
  });
}

async function updateDirector(id, name, bio) {
  const [affectedRows] = await Director.update(
    {
      name,
      bio,
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
  createDirector,
  getAllDirectors,
  getDirectorById,
  updateDirector,
};
