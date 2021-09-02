require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware");
const mysql = require("../dbconfig");

// add email
router.post("/login", (req, res) => {
  const { email, name } = req.body;
  const token = jwt.sign({ email: email, name: name }, process.env.APP_KEY);
  mysql.query(
    "SELECT * FROM movie.users WHERE email=$1",
    [email],
    (error, result) => {
      if (error) {
        res.status(500).send({
          status: error,
        });
      }
      if (result.rowCount == 1) {
        res.status(201).send({
          status: "success",
          token: token,
        });
      } else {
        mysql.query(
          "INSERT INTO movie.users(email, name) VALUES ($1, $2)",
          [email, name],
          (error, result) => {
            if (error) {
              res.status(500).send({
                status: error,
              });
            }
            res.send({
              status: "success",
              token: token,
            });
          }
        );
      }
      mysql.query(
        "INSERT INTO movie.tokens(token, is_revoked) VALUES ($1, $2)",
        [token, false]
      );
    }
  );
});

// checking token
router.post("/token", (req, res) => {
  const { token } = req.body;

  mysql.query(
    "SELECT * FROM movie.tokens WHERE token=$1 and is_revoked=false",
    [token],
    (error, result) => {
      if (result.rows.length > 0) {
        res.send({ status: "success" });
      }
    }
  );
});

// checking subscription
router.post("/subscription", auth, (req, res) => {
  const { token } = req.body;
  const decodedJwt = jwt.decode(token, { complete: true });
  const email = decodedJwt.payload.email;
  const date = new Date();

  mysql.query(
    "SELECT * FROM movie.users WHERE email=$1",
    [email],
    (error, result) => {
      if (result.rows.length > 0) {
        if (result.rows[0].end_subscription >= date) {
          res.send({ status: "success" });
        } else {
          res.send({ status: "invalid" });
        }
      } else {
        res.send({ status: "invalid" });
      }
    }
  );
});

// checking movie
router.post("/subscription", auth, (req, res) => {
  const { token, movie_id } = req.body;
  const decodedJwt = jwt.decode(token, { complete: true });
  const email = decodedJwt.payload.email;
});

module.exports = router;
