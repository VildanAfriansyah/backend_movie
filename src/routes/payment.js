require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mysql = require("../dbconfig");
const { auth } = require("../middleware");

// list payment
router.get("/list", (req, res) => {
  mysql.query(
    "SELECT * FROM movie.payment_method ORDER BY method_id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

// payment
router.post("/", auth, (req, res) => {
  const { token, movie_id, price, method_id, type, phone } = req.body;
  const decodedJwt = jwt.decode(token, { complete: true });
  const email = decodedJwt.payload.email;
  const date = new Date();

  mysql.query(
    "INSERT INTO movie.transaction(email, movie_id, price, method_id, type, phone_number, created_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [email, movie_id, price, method_id, type, phone, date],
    (error, result) => {
      if (result.rowCount > 0) {
        mysql.query(
          "INSERT INTO movie.my_movie(movie_id, email) VALUES ($1, $2)",
          [movie_id, email],
          (err, results) => {
            res.send({ status: "success" });
          }
        );
      }
    }
  );
});

module.exports = router;
