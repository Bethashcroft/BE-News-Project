const express = require("express");
const {
  getTopics,
  getArticleById,
} = require("./controllers/topics.controller");
const app = express();

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/topics", getTopics);
app.all("*", function (req, res, next) {
  res.status(404).send({ status: 404, msg: "invalid path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400! Bad request!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500! Internal server error!" });
});

module.exports = app;
