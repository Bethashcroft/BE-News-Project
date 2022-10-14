const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("GET: 200 - /api/topics", () => {
  test("should respond with an array of the topic objects slug and a separate description array.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const expectedArray = [
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ];
        expect(body.topics).toEqual(expectedArray);
        expect(body.topics.length).toBe(3);
      });
  });
});

describe("404 - /api/somethingElse", () => {
  it("should respond with a 404 error if pathway is incorrect", () => {
    return request(app)
      .get("/api/somethingElse")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid path");
      });
  });
});

describe("GET: 200 - api/articles/:article_id", () => {
  test("it should respond with a 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("it should respond with the full array relating to that id", () => {
    request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  test("200 - Responds with the correct comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toEqual;
        ("11");
      });
  });
  test("should respond with a 404 error if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/80000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found");
      });
  });
  test("should respond with a 400 error if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/letterid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400! Bad request!");
      });
  });
});

describe("GET: 200 - /api/users", () => {
  test("Responds with an array of objects with user properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const bodyUsers = body.users;
        expect(bodyUsers).toHaveLength(4);
        bodyUsers.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH: 200 - /api/articles/:articles_id", () => {
  test("Updates votes with the required amount and returns the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(101);
      });
  });
  test("400 Error if the article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/northcoders")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400! Bad request!");
      });
  });
  test("400 Error if the inc_votes is an invalid data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "northcoders" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400! Bad request!");
      });
  });
  test("404 Error if the article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404! this does not exist!");
      });
  });
  test("400 Error if the inc_votes key is not sent with to the body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400! Bad request!");
      });
  });
});

describe.only("GET: 200 - /api/articles", () => {
  test("Return an array of articles with all properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              article_id: expect.any(Number),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200 - Returns array in descending date order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404 - Returns an error message when the topic doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=northcoders")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("This topic does not exist!");
      });
  });
  test("Responds with an empty array when no articles exists for the topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});
