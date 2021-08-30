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

// payment movie
router.post("/movie", auth, (req, res) => {
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

// payment subscription
router.post("/subscription", auth, (req, res) => {
  const { token, duration, phone, method_id, price, type } = req.body;
  const decodedJwt = jwt.decode(token, { complete: true });
  const email = decodedJwt.payload.email;
  const created_date = new Date();
  const start_subscription = new Date();
  const finish_subscription = new Date();

  finish_subscription.setDate(
    finish_subscription.getDate() + parseInt(duration)
  );
  mysql.query(
    "INSERT INTO movie.transaction(email, price, start_subscription, end_subscription, created_date, phone_number, type, method_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      email,
      price,
      start_subscription,
      finish_subscription,
      created_date,
      phone,
      type,
      method_id,
    ],
    (error, result) => {
      if (result.rowCount > 0) {
        const queryString = {
          text: `UPDATE movie.users
            SET is_subscription=$2, start_subscription=$3, end_subscription=$4
            WHERE email=$1`,
          values: [email, 1, start_subscription, finish_subscription],
        };
        mysql.query(queryString, null);
        res.send({ status: "success" });
      }
    }
  );
});

module.exports = router;
