const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../src/model/user");
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "1231231231",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }]
};
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});
afterEach(() => {
  console.log("afterEach");
});
test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Vivian",
      email: "vivian123.cs02@gmail.com",
      password: "123123123123"
    })
    .expect(201);
  // assert that the database is changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
});
test("Should login existing user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

test("Should not login nonexistent users", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: "123213123"
    })
    .expect(400);
});

test("Should get profile from user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile to unauthorized users", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});
test("Should not delete account for an unauthorized user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});
