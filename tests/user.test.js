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
  // assert about the response
  expect(response.body.user.name).toBe("Vivian");
  expect(response.body).toMatchObject({
    user: {
      name: "Vivian",
      email: "vivian123.cs02@gmail.com"
    },
    token: user.tokens[0].token
  });
  // see if the password if in the database
  expect(response.body.user.password).not.toBe("123123123123");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
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
  // assert user in database to be null
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});
test("Should not delete account for an unauthorized user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

// test("Should update valid user fields", async()=>{
//     await request(app)
//     .patch
// })
