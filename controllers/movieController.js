const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Movie } = require("../models/movie");
const { MovieGenre } = require("../models/movieGenre");
const { Director } = require("../models/director");
const { getDirectorById } = require("./directorController");
const { Genre } = require("../models/genre");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      cb(null, "./public/uploads/thumbnails");
    } else if (file.fieldname === "scenes") {
      cb(null, "./public/uploads/scenesGallery");
    } else {
      cb(null, "./public/uploads/others");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!", false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "scenes", maxCount: 5 },
]);

async function createMovie(
  title,
  description,
  releaseDate,
  directorId,
  thumbnail,
  scenesGallery,
  fullURL,
  genreId
) {
  const thumbnailURL = thumbnail.path.slice(6);

  const movie = await Movie.create({
    title,
    description,
    releaseDate,
    directorId,
    thumbnail: fullURL + thumbnailURL,
  });
  await MovieGenre.create({ movieId: movie.id, genreId });
  if (scenesGallery) {
    let scenesURLs = [];
    for (const scene of scenesGallery) {
      scenesURLs.push(fullURL + scene.path.slice(6));
    }
    await Movie.update(
      { scenesGallery: scenesURLs },
      { where: { id: movie.id } }
    );
  }
}

async function getAllMovies() {
  return await Movie.findAll({
    attributes: ["id", "name", "bio"],
    raw: true,
  });
}

async function getMovieById(id) {
  let movie = await Movie.findByPk(id, {
    raw: true,
    attributes: [
      "id",
      "title",
      "description",
      "directorId",
      "thumbnail",
      "scenesGallery",
    ],
  });
  if (movie) {
    movie.directorName = (await getDirectorById(movie.directorId)).name;

    const genresIds = (
      await MovieGenre.findAll({
        where: { movieId: movie.id },
        raw: true,
      })
    ).map((movieGenre) => movieGenre.genreId);
    let genres = [];
    for (const genreId of genresIds) {
      genres.push((await Genre.findByPk(genreId, { raw: true })).name);
    }
    movie.genres = genres;
  }

  return movie;
}

async function getAllMovies(params) {
  const moviesIds = (
    await Movie.findAll({ raw: true, attributes: ["id"] })
  ).map((movie) => movie.id);
  let movies = [];
  for (const movieId of moviesIds) {
    movies.push(await getMovieById(movieId));
  }
  return movies;
}

async function searchMovies(query) {
  const movies = await getAllMovies();
  for (let i = movies.length - 1; i >= 0; i--) {
    if (query.title) {
      if (!movies[i].title.toLowerCase().includes(query.title.toLowerCase())) {
        movies.splice(i, 1);
        continue;
      }
    }
    if (query.director) {
      if (
        !movies[i].directorName
          .toLowerCase()
          .includes(query.director.toLowerCase())
      ) {
        movies.splice(i, 1);
        continue;
      }
    }
    if (query.genre) {
      if (
        !movies[i].genres.some((genre) =>
          genre.toLowerCase().includes(query.genre.toLowerCase())
        )
      ) {
        movies.splice(i, 1);
        continue;
      }
    }
  }
  return movies;
}
async function updateMovie(
  id,
  title,
  description,
  releaseDate,
  directorId,
  thumbnail,
  scenesGallery,
  fullURL,
  genreId
) {
  if ((await Movie.findByPk(id)) == null) {
    return false;
  }
  let updatedInfo = {};
  if (title) {
    updatedInfo.title = title;
  }
  if (description) {
    updatedInfo.description = description;
  }
  if (releaseDate) {
    updatedInfo.releaseDate = releaseDate;
  }
  if (directorId) {
    updatedInfo.directorId = directorId;
  }
  if (thumbnail) {
    const movie = await getMovieById(id);
    console.log(movie);
    fs.unlink(`./public${movie.thumbnail.slice(fullURL.length)}`, (err) => {
      if (err) {
        console.error("Error deleting file", err);
      } else console.log("File deleted");
    });
    updatedInfo.thumbnail = fullURL + thumbnail[0].path.slice(6);
  }

  await Movie.update(updatedInfo, { where: { id } });

  if (scenesGallery) {
    const movie = await getMovieById(id);

    for (const image of movie.scenesGallery) {
      fs.unlink(`./public${image.slice(fullURL.length)}`, (err) => {
        if (err) {
          console.error("Error deleting file", err);
        } else console.log("File deleted");
      });
    }
    let scenesURLs = [];
    for (const scene of scenesGallery) {
      scenesURLs.push(fullURL + scene.path.slice(6));
    }
    await Movie.update(
      { scenesGallery: scenesURLs },
      { where: { id: movie.id } }
    );
  }
  if (genreId) {
    const genre = await MovieGenre.findOne({ where: { movieId: id, genreId } });
    if (!genre) await MovieGenre.create({ movieId: id, genreId });
  }

  return true;
}

async function deleteMovie(id, fullURL) {
  if ((await Movie.findByPk(id)) == null) {
    return false;
  }

  const movie = await getMovieById(id);

  for (const image of movie.scenesGallery) {
    fs.unlink(`./public${image.slice(fullURL.length)}`, (err) => {
      if (err) {
        console.error("Error deleting file", err);
      } else console.log("File deleted");
    });
  }
  fs.unlink(`./public${movie.thumbnail.slice(fullURL.length)}`, (err) => {
    if (err) {
      console.error("Error deleting file", err);
    } else console.log("File deleted");
  });

  await Movie.destroy({ where: { id } });
  return true;
}

module.exports = {
  upload,
  createMovie,
  getMovieById,
  getAllMovies,
  searchMovies,
  updateMovie,
  deleteMovie,
};
