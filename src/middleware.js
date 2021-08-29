const jwt = require("jsonwebtoken");
const mysql = require("./dbconfig");

const auth = (req, res, next) => {
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    const jwt_token = req.headers["authorization"].substr(7);
    if (jwt_token) {
      jwt.verify(jwt_token, process.env.APP_KEY, function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: "Failed to authenticate token.",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.send({ success: false, msg: "You must be login first" });
    }
  } else {
    res.send({ success: false, msg: "You must be login first" });
  }
};

module.exports = { auth };
