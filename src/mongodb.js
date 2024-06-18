const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Joi = require("joi");
mongoose
  .connect("mongodb://localhost/UserInfos")
  .then(() => {
    console.log("Ok, Go On");
  })
  .catch(() => {
    console.log("Have Error with Mongodb connect  ");
  });

const logINSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 160,
  },
  email: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("collection", logINSchema);

function validate1(values) {
  const userinfoss = Joi.object({
    name: Joi.string().min(5).max(50),
    password: Joi.string().required().min(4).max(160),
    email: Joi.string().required(),
  });
  return userinfoss.validate(values);
}
exports.collection = collection;
exports.validate = validate1;
