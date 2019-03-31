const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Vivian",
      email: "vivian123.cs02@gmail.com",
      password: "123123123123"
    })
    .expect(201);
});
