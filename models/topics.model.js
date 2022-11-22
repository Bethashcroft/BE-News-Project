const db = require("../db/connection");
const format = require("pg-format");
const articles = require("../db/data/test-data/articles");

exports.chooseTopics = () => {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
};

exports.chooseArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [id]
    )
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

exports.chooseAllArticles = (topic) => {
  return exports.chooseTopics().then((validTopics) => {
    let sqlCommand = `SELECT articles.*, COUNT(comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

    let articleArray = [];
    let slugArray = [];

    for (let i = 0; i < validTopics.length; i++) {
      slugArray.push(validTopics[i].slug);
    }

    if (topic) {
      if (slugArray.includes(topic)) {
        sqlCommand += ` WHERE topic = $1`;
        articleArray.push(topic);
      } else {
        return Promise.reject({
          status: 404,
          msg: "This topic does not exist!",
        });
      }
    }

    if (topic) {
      if (slugArray.includes(topic) && articles.length <= 0) {
        return [];
      }
    }

    sqlCommand += ` GROUP BY articles.article_id ORDER BY created_at desc;`;

    return db.query(sqlCommand, articleArray).then((response) => {
      return response.rows;
    });
  });
};

exports.chooseCommentsByArticleId = (article_id) => {
  return exports.chooseArticleById(article_id).then(() => {
    const commentCommand = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`;

    return db.query(commentCommand, [article_id]).then(({ rows: comments }) => {
      return comments;
    });
  });
};

exports.postedComment = (id, body, username) => {
  if (body.length === 0) {
    return Promise.reject({ status: 404, msg: "Body length is 0" });
  }
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;",
      [id, body, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};
