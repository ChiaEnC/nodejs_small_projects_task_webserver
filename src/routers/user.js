const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
const validator = require("validator");

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates!" });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    res.send(req.user);
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
    res.send({ user, token });
    // res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).save();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }
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
