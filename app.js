require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const movie = require("./src/routes/movie");
const auth = require("./src/routes/auth");
const payment = require("./src/routes/payment");
const subscription = require("./src/routes/subscription");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use("/movie", movie);
app.use("/auth", auth);
app.use("/payment", payment);
app.use("/subscription", subscription);

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log("App Listen On Port " + port);
});
