const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const movieHandlers = require("./movieHandlers");

const userHandlers = require("./userHandlers");

const { validateMovie } = require("./validators.js");
const { validateUser } = require("./validators.js");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  idChecked,
} = require("./auth.js");

app.get("/", welcome);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.put(
  "/api/movies/:id",
  validateMovie,
  verifyToken,
  movieHandlers.updateMovie
);

app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);

app.post("/api/movies", validateMovie, verifyToken, movieHandlers.postMovie);

app.put(
  "/api/users/:id",
  validateUser,
  hashPassword,
  verifyToken,
  idChecked,
  userHandlers.updateUser
);

app.delete("/api/users/:id", verifyToken, idChecked, userHandlers.deleteUser);
