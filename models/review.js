const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require(".");
const { Director } = require("./director");
const { Genre } = require("./genre");
const { Movie } = require("./movie");
const { User } = require("./user");

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 10,
    },
  },

  comment: { type: DataTypes.TEXT },

  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Movie,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

Movie.belongsToMany(User, {
  through: Review,
  foreignKey: "movieId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsToMany(Movie, {
  through: Review,
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });

Review.belongsTo(Movie, { foreignKey: "movieId" });
Movie.hasMany(Review, { foreignKey: "movieId" });

module.exports = { Review };
