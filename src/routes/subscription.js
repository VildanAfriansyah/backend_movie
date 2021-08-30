require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");

// subscription list
router.get("/", (req, res) => {
  mysql.query(
    "SELECT * FROM movie.subscriptions ORDER BY subscription_id",
    (error, result) => {
      if (error) {
        throw error;
      }
      res.send({
        status: "successs",
        data: result.rows,
      });
    }
  );
});

module.exports = router;
