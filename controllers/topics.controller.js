const {
  chooseTopics,
  chooseArticleById,
  chooseUsers,
  updateArticle,
  chooseAllArticles,
  chooseCommentsByArticleId,
} = require("../models/topics.model");

exports.getTopics = (request, response, next) => {
  chooseTopics()
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  chooseArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (request, response, next) => {
  chooseUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

exports.patchArticles = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  updateArticle(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  const { topic } = request.query;
  chooseAllArticles(topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  chooseCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
