require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const mysql = require("../dbconfig");

// add email
router.put("/", (req, res) => {
  const { email, name } = req.body;
  const token = jwt.sign({ email: email, name: name }, process.env.APP_KEY);
  mysql.query(
    "SELECT * FROM movie.users WHERE email=$1",
    [email],
    (error, result) => {
      if (result.rowCount == 1) {
        res.send({
          status: "success",
          token: token,
        });
      } else {
        mysql.query(
          "INSERT INTO movie.users(email, name) VALUES ($1, $2)",
          [email, name],
          (error, result) => {
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

module.exports = router;
