const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const topicData = require("../db/data/test-data/topics");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end;
});

describe("GET: /api/topics", () => {
  test("returns a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
});

describe("GET: 200 - /api/topics", () => {
  it("should respond with an array of the topic objects slug and a separate description array.", () => {
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
