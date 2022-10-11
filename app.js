const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api/topics", getTopics);
app.all("*", function (req, res, next) {
  res.status(404).send({ status: 404, msg: "invalid path" });
  next();
});

module.exports = app;
