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
        const expectedUsers = [
          {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ];
        expect(body.users).toEqual(expectedUsers);
        expect(body.users).toHaveLength(4);
      });
  });
});
