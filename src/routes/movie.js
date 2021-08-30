require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mysql = require("../dbconfig");
const { auth } = require("../middleware");

// list movie
router.get("/list", (req, res) => {
  mysql.query(
    "SELECT * FROM movie.movie ORDER BY movie_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

// get my movie
router.post("/my-movie", auth, (req, res) => {
  const { token } = req.body;
  const decodedJwt = jwt.decode(token, { complete: true });
  const email = decodedJwt.payload.email;

  mysql.query(
    "SELECT * FROM movie.movie INNER JOIN movie.my_movie ON movie.movie_id = my_movie.movie_id WHERE my_movie.email=$1 ",
    [email],
    (error, result) => {
      res.send({
        data: result.rows,
      });
    }
  );
});

module.exports = router;
