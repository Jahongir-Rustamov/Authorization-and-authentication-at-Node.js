const express = require("express");
const body_parser = require("body-parser");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const templatepath = path.join(__dirname, "../templates");
const { collection, validate } = require("./mongodb");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatepath);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await collection.findOne({ email: req.body.email });
  if (user) {
    res.status(404).send("Bu emaildan oldin ro'yhatdan o'tilgan");
  }
  user = new collection(lodash.pick(req.body, ["name", "password", "email"]));
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  try {
    await user.save();
    res.render("home");
  } catch {
    res.status(400).send("Have error with saved");
  }
});

app.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send("Bunday email yo'q !!!");
    }
    const isvalidate = await bcrypt.compare(req.body.password, user.password);
    if (isvalidate) {
      res.render("home");
    } else {
      res.status(404).send("You don't signup from website");
    }
  } catch {
    res.status(400).send("Have error with saved");
  }
});
app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
