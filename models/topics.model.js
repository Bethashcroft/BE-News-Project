const db = require("../db/connection");
const format = require("pg-format");

exports.chooseTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.chooseArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows[0];
    });
};
