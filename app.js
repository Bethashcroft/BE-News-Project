const express = require("express");
const {
  getTopics,
  getArticleById,
  getUsers,
  patchArticles,
} = require("./controllers/topics.controller");
const app = express();
app.use(express.json());

app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticles);

app.all("*", function (req, res, next) {
  res.status(404).send({ status: 404, msg: "invalid path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
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
