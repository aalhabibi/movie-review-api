const express = require("express");
const cookieParser = require("cookie-parser");

const sequelize = require("./models");
const { User } = require("./models/user");
const { Director } = require("./models/director");
const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const { MovieGenre } = require("./models/movieGenre");
const { Review } = require("./models/review");

const app = express();

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const directorRoutes = require("./routes/directorRoutes");
const genreRoutes = require("./routes/genreRoutes");
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/directors", directorRoutes);
app.use("/genres", genreRoutes);
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);

// testDbConnection();
// syncModels();
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
async function syncModels() {
  // await User.sync({ force: true });
  // await Director.sync({ force: true });
  // await Genre.sync({ force: true });
  // await Movie.sync({ force: true });
  // await MovieGenre.sync({ force: true });
  await Review.sync({ force: true });
  // await sequelize.sync();

  console.log("All models were synchronized successfully.");
}

app.listen(3000, function () {
  console.log("Express App running at http://localhost:3000/");
});
