const express = require("express");

const router = new express.Router();
const Task = require("../model/task");
const validator = require("validator");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//GET  /tasks?completed=false
//GET /task?limit=10&skip=20
//GET /sortBy=createAt
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    console.log(parts[0]);
    console.log(parts[1]);

    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.status(201).send(req.user.tasks);
    // const tasks = await Task.find({ owner: req.user._id });
    // res.status(201).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    if (!validator.isMongoId(req.params.id)) {
      res.send("invalid id ");
    } else {
      const task = await Task.findOne({ _id, owner: req.user._id });
      if (!task) {
        res.status(404).send();
      }
      console.log(task);
      res.send(task);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      res.status(400).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
