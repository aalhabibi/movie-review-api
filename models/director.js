const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require(".");
// console.log(sequelize);

const Director = sequelize.define("Director", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT },
});

module.exports = { Director };
