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

exports.chooseUsers = () => {
  return db.query("SELECT * FROM users").then((response) => {
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

exports.updateArticle = (id, votes) => {
  const updateQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;

  return db.query(updateQuery, [votes, id]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "404! this does not exist!",
      });
    }
    return response.rows[0];
  });
};
