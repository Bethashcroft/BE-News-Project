const {
  chooseTopics,
  chooseArticleById,
  chooseUsers,
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
