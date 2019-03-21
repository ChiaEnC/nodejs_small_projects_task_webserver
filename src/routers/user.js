const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const validator = require("validator");

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates!" });
  }

  const _id = req.params.id;
  console.log(_id);
  try {
    const user = await User.findById(_id);
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    await user.save();
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users", async function(req, res) {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    //res.send({ user, token });
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "invalid" });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    console.log(token);
    res.send({ user, token });
    // res.send(user);
  } catch (e) {
    res.send(400).send();
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    if (!validator.isMongoId(req.params.id)) {
      return res.send("invalid id ");
    } else {
      const user = await User.findById(_id);
      res.send(user);
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
