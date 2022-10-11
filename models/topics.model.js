const db = require("../db/connection");
const format = require("pg-format");

exports.chooseTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

