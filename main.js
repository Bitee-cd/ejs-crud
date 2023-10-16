require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const connectDb = require("./config/dbConnection");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

//set template
app.set("view engine", "ejs");

app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
