const { chooseTopics } = require("../models/topics.model");

exports.getTopics = (request, response) => {
  chooseTopics().then((topics) => {
    response.status(200).send({ topics: topics });
  });
};
