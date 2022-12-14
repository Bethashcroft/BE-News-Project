const express = require("express");
const {
  getTopics,
  getArticleById,
  getUsers,
  patchArticles,
  getAllArticles,
  getCommentsByArticleId,
  getPostedComment,
} = require("./controllers/topics.controller");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticles);

app.post("/api/articles/:article_id/comments", getPostedComment);

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
