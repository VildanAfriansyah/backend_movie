require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");

/* get listmovie */
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

module.exports = router;
