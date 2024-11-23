const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require(".");
const { Director } = require("./director");
const { Genre } = require("./genre");

const Movie = sequelize.define("Movie", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  title: { type: DataTypes.STRING, allowNull: false },

  description: { type: DataTypes.TEXT },

  releaseDate: { type: DataTypes.DATEONLY, allowNull: false },

  directorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Director, key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },

  thumbnail: { type: DataTypes.STRING },

  scenesGallery: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
});

module.exports = { Movie };
