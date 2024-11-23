const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require(".");
const { Movie } = require("./movie");
const { Genre } = require("./genre");

const MovieGenre = sequelize.define("MovieGenre", {
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  genreId: {
    type: DataTypes.INTEGER,
    references: {
      model: Genre,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

Movie.belongsToMany(Genre, {
  through: MovieGenre,
  foreignKey: "movieId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Genre.belongsToMany(Movie, {
  through: MovieGenre,
  foreignKey: "genreId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = { MovieGenre };
